import {inputValue,createCheckedAccessProxy} from '../functionsCatalog';
import {assesmentMissed,collectedDateTime} from '../lifelinesFunctions'
import {LaboratoryTestResult, TestResultEntry} from '../fhir-resource-interfaces/laboratoryTestResult'
import {getSNOMEDCode,getLOINCCode,getUCUMCode,CodeProperties} from '../codes/codesCollection'
import e from 'express';


/*
Based on HCIM Observation/ ZIB LaboratoryTestResult resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.13/files/2039136
https://zibs.nl/wiki/LaboratoryTestResult-v4.1(2017EN)

ADD URL OF THE VARIABLES DOCUMENTATION INVOLVED IN THE PAIRING RULES
Related Lifelines variables:
http://wiki.lifelines.nl/doku.php?id=blood_analyses
https://www.umcg.nl/bw/503e8554-bf74-47c9-b175-9fc3792ba9b4
*/



/**
 * A laboratory result describes the result of a laboratory analysis. These are specimen-oriented 
 * tests as performed in laboratories such as Clinical Chemistry, Serology, Microbiology, etc. 
 * In addition to the results of tests with a singular result, this concept can also contain 
 * the results of more complex tests with multiple results or a ‘panel’.
 * 
 * 
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][3A][3B]
 * albumin_result_all_m_1         [X ][  ][  ][  ][  ][  ]
 * date                           [X ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * @return, for each assessment:
 *      [[assessment_N]:
 *          - result: albumin_result_all_m_1 in assessment_N
 *          - resultcoding: {"system": "http://loinc.org","code": "1751-7","display": "Albumin SerPl-mCnc"}
 *          - resultunits: {"unit": "g/l","system": "http://unitsofmeasure.org","code": "g/L"}
 *          - resultFlag: 
 *               {code:281302008, system:http://snomed.info/sct} if 
 *                  albumin_result_all_m_1 in assessment_N > 50.0 g/l
 *               {code:281300000, system:http://snomed.info/sct} if 
 *                  albumin_result_all_m_1 in assessment_N < 35.0 g/l             
 *          - collectedDateTime: date of assessment_N         
 * 
 */

export const plasmaAlbumin:LaboratoryTestResult = {
    labTestName: function (): string {
        return "plasma-albumin"
    },
    referenceRangeUpperLimit: function (): number | undefined {
        return PLASMA_ALBUMIN_REFERENCE_RANGE_UPPER_LIMIT
    },
    referenceRangeLowerLimit: function (): number | undefined {
        return PLASMA_ALBUMIN_REFERENCE_RANGE_LOWER_LIMIT
    },
    diagnosticCategoryCoding: function (): CodeProperties[] {
        //laboratory_report,microbiology_procedure
        return [getSNOMEDCode('4241000179101'), getSNOMEDCode('19851009')];
    },
    diagnosticCodeCoding: function (): CodeProperties[] {
        //1751-7:Albumin SerPl-mCnc
        return [getLOINCCode('1751-7')]
    },
    observationCodeCoding: function (): CodeProperties[] {
        //1751-7:Albumin SerPl-mCnc
        return [getLOINCCode('1751-7')]
    },
    diagnosticCodeText: function (): string {
        return "Albumin [Mass/volume] in Serum or Plasma"
    },
    observationCategoryCoding: function (): object[] {
        //"Laboratory test finding (finding)","display": "Serum chemistry test"
        return [getSNOMEDCode('49581000146104'), getSNOMEDCode('275711006')];
    },
    resultUnit: function (): CodeProperties {
        return getUCUMCode('g/L')        
    },
    results: function (): TestResultEntry[] {
        const waves = ["1a"];

        //if the assessment was missed, do not evaluate/create the resource
        return waves.filter((wave) => !assesmentMissed(wave)).map((wave) => createCheckedAccessProxy({
            "assessment": wave,
            "resultFlags": resultFlag(wave),
            "testResult": function(){
                const albumin = inputValue("albumin_result_all_m_1",wave);                
                return albumin!==undefined?Number(albumin):undefined
            }(),
            "collectedDateTime": collectedDateTime(wave)
        })
        );
        
    }
}

const PLASMA_ALBUMIN_REFERENCE_RANGE_LOWER_LIMIT = 35
const PLASMA_ALBUMIN_REFERENCE_RANGE_UPPER_LIMIT = 50

const resultFlag = (wave:string):CodeProperties|undefined=> {

    const albumin = inputValue("albumin_result_all_m_1",wave);

    if (albumin===undefined){
        return undefined        
    }
    else{
        const albuminVal = Number(albumin)
        if (albuminVal > PLASMA_ALBUMIN_REFERENCE_RANGE_UPPER_LIMIT){
            return getSNOMEDCode('281302008')
        }
        else if(albuminVal < PLASMA_ALBUMIN_REFERENCE_RANGE_LOWER_LIMIT){
            return getSNOMEDCode('281300000')
        }
        else{
            return undefined
        }
    }
}

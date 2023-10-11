import {inputValue,createCheckedAccessProxy} from '../functionsCatalog';
import {assesmentMissed,collectedDateTime} from '../lifelinesFunctions'
import {LaboratoryTestResult, TestResultEntry} from '../fhir-resource-interfaces/laboratoryTestResult'
import {getSNOMEDCode,getLOINCCode,getUCUMCode,CodeProperties} from '../codes/codesCollection'


/*
Based on HCIM Observation/ ZIB LaboratoryTestResult resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.13/files/2039136
https://zibs.nl/wiki/LaboratoryTestResult-v4.1(2017EN)

ADD URL OF THE VARIABLES DOCUMENTATION INVOLVED IN THE PAIRING RULES
Related Lifelines variables:
http://wiki.lifelines.nl/doku.php?id=blood_analyses
https://www.umcg.nl/bw/7f1121a4-bc7d-4c82-92e9-163fd7c41162
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
 * creatinine_result_all_m_1      [X ][  ][  ][X ][  ][  ]
 * date                           [X ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * @return, for each assessment:
 *      [[assessment_N]:
 *          - result: creatinine_result_all_m_1 in assessment_N
 *          - resultcoding: {"system": "http://loinc.org","code": "14682-9","display": "Creat SerPl-sCnc"}
 *          - resultunits: {"unit": "umol/l","system": "http://unitsofmeasure.org","code": "umol/L"}
 *          - resultFlag: if gender == male:
 *                            if creatinine_result_all_m_1 in assessment_N > 110.0 mmol/L:
 *                               {code:281302008, system:http://snomed.info/sct}
 *                            elif creatinine_result_all_m_1 in assessment_N < 50.0 mmol/L:
 *                               {code:281300000, system:http://snomed.info/sct}
 *                        elif gender == female:
 *                            if creatinine_result_all_m_1 in assessment_N > 90.0 mmol/L:
 *                               {code:281302008, system:http://snomed.info/sct}
 *                            elif creatinine_result_all_m_1 in assessment_N < 50.0 mmol/L:
 *                               {code:281300000, system:http://snomed.info/sct}
 *          - collectedDateTime: date of assessment_N         
 * 
 */

export const creatinine:LaboratoryTestResult = {
    labTestName: function (): string {
        return "creatinine"
    },
    referenceRangeUpperLimit: function (): number | undefined {
        return undefined
    },
    referenceRangeLowerLimit: function (): number | undefined {
        return undefined
    },
    diagnosticCategoryCoding: function (): CodeProperties[] {
        //laboratory_report,microbiology_procedure
        return [getSNOMEDCode('4241000179101'), getSNOMEDCode('19851009')];
    },
    diagnosticCodeCoding: function (): CodeProperties[] {
        //"Creat SerPl-sCnc"}
        return [getLOINCCode('14682-9')];        
    },
    diagnosticCodeText: function (): string {
        return "Creatinine [Moles/volume] in Serum or Plasma"
    },
    observationCategoryCoding: function (): object[] {
        //"Laboratory test finding (finding)","display": "Serum chemistry test"
        return [getSNOMEDCode('49581000146104'), getSNOMEDCode('275711006')];
    },
    observationCodeCoding: function (): CodeProperties[] {
        //"Creat SerPl-sCnc"}
        return [getLOINCCode('14682-9')];        
    },
    resultUnit: function (): CodeProperties {
        return getUCUMCode('umol/L')
    },
    results: function (): TestResultEntry[] {
        
        const waves = ["1a", "2a"];

        //if the assessment was missed, do not evaluate/create the resource
        return waves.filter((wave) => !assesmentMissed(wave)).map((wave) => createCheckedAccessProxy({
            "assessment": wave,
            "resultFlags": resultFlag(wave),
            "testResult": function(){
                const creatinine = inputValue("creatinine_result_all_m_1",wave);                
                return creatinine!==undefined?Number(creatinine):undefined
            }(),
            "collectedDateTime": collectedDateTime(wave)
        })
        );
        
    }
}


const resultFlag = (wave:string):CodeProperties|undefined => {


    // Gender only available on '1a'
    const gender = inputValue("gender","1a");
    const creatinine = inputValue("creatinine_result_all_m_1",wave);


    if (gender===undefined || creatinine===undefined){
        return undefined        
    }
    else{
        if (gender=="MALE"){
            if (Number(creatinine) > 110){
                return getSNOMEDCode('281302008')
            }
            else if (Number(creatinine) < 50){
                return getSNOMEDCode('281300000')                
            }
            else{
                return undefined;
            }
        }
        else{
            if (Number(creatinine) > 90){
                return getSNOMEDCode('281302008')
            }
            else if (Number(creatinine) < 50){
                return getSNOMEDCode('281300000')                
            }
            else{
                return undefined;
            }

        }
    }
}


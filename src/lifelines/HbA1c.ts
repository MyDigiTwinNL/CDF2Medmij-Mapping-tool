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
https://www.umcg.nl/bw/a20a8160-9c17-4866-a9eb-191dddb43d8b
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
 * hba1cconc_result_all_m_1       [X ][  ][  ][X ][  ][  ]
 * date                           [X ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * @return, for each assessment:
 *      [[assessment_N]:
 *          - result: hba1cconc_result_all_m_1 in assessment_N
 *          - resultcoding: {"system": "http://loinc.org","code": "14646-4","display": "HbA1c MFr Bld"}
 *          - resultunits: {"unit": "mmol/mol","system": "http://unitsofmeasure.org","code": "mmol/mol"}
 *          - resultFlag: {code:281302008, system:http://snomed.info/sct} if 
 *              hba1cconc_result_all_m_1 in assessment_N > 42 mmol/mol
 *          - collectedDateTime: date of assessment_N         
 * 
 */

export const hbA1c:LaboratoryTestResult = {

    labTestName: function (): string {
        return 'HbA1c'
    },
    referenceRangeUpperLimit: function (): number | undefined {
        return HBA1C_UPPER_LIMIT
    },
    referenceRangeLowerLimit: function (): number | undefined {
        return undefined
    },
    diagnosticCategoryCoding: function (): CodeProperties[] {
        //laboratory_report,microbiology_procedure
        return [getSNOMEDCode('4241000179101'), getSNOMEDCode('19851009')];
    },
    diagnosticCodeCoding: function (): CodeProperties[] {
        //HbA1c MFr Bld
        return [getLOINCCode('14646-4')];        
    },
    diagnosticCodeText: function (): string {
        return "Cholesterol in HDL [Moles/volume] in Serum or Plasma"
    },
    observationCategoryCoding: function (): object[] {
        //"Laboratory test finding (finding)", "Serum chemistry test"
        return [getSNOMEDCode('49581000146104'), getSNOMEDCode('275711006')];        
    },
    observationCodeCoding: function (): CodeProperties[] {
        //HbA1c MFr Bld
        return [getLOINCCode('14646-4')];
    },
    resultUnit: function (): CodeProperties {
        return getUCUMCode('mmol/mol')
    },
    results: function (): TestResultEntry[] {
        const waves = ["1a", "2a"];

        //if the assessment was missed, do not evaluate/create the resource
        return waves.filter((wave) => !assesmentMissed(wave)).map((wave) => createCheckedAccessProxy({
            "assessment": wave,
            "resultFlags": resultFlag(wave),
            "testResult": function(){
                const hba1c = inputValue("hba1cconc_result_all_m_1",wave);                
                return hba1c!==undefined?Number(hba1c):undefined
            }(),
            "collectedDateTime": collectedDateTime(wave)
        })
        );
        
    }
}

const HBA1C_UPPER_LIMIT = 42;


const resultFlag = (wave:string):CodeProperties|undefined => {

    const hba1cresult = inputValue('hba1cconc_result_all_m_1',wave);
    if (hba1cresult!==undefined && Number(hba1cresult) > HBA1C_UPPER_LIMIT){
        return getSNOMEDCode('281302008');
    }
    else{
        return undefined;
    }

}
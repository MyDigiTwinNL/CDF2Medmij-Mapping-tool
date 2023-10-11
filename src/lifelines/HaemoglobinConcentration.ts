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
https://www.umcg.nl/bw/42976573-722a-48fc-a650-5ea718fd1717
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
 * hemoglobin_result_all_m_1      [X ][  ][  ][X ][  ][  ]
 * date                           [X ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * @return, for each assessment:
 *      [[assessment_N]:
 *          - result: hemoglobin_result_all_m_1 in assessment_N
 *          - resultcoding: {"system": "http://loinc.org","code": "718-7","display": "Hgb Bld-mCnc"}
 *          - resultunits: {"unit": "mmol/l","system": "http://unitsofmeasure.org","code": "mmol/L"}
 *          - resultFlag: if gender == male:
 *                            if hemoglobin_result_all_m_1 in assessment_N > 11.0 mmol/L:
 *                               {code:281302008, system:http://snomed.info/sct}
 *                            elif hemoglobin_result_all_m_1 in assessment_N < 8.5 mmol/L:
 *                               {code:281300000, system:http://snomed.info/sct}
 *                        elif gender == female:
 *                            if hemoglobin_result_all_m_1 in assessment_N > 10.0 mmol/L:
 *                               {code:281302008, system:http://snomed.info/sct}
 *                            elif hemoglobin_result_all_m_1 in assessment_N < 7.5 mmol/L:
 *                               {code:281300000, system:http://snomed.info/sct}
 *          - collectedDateTime: date of assessment_N         
 * 
 */
export const haemoglobinConcentration:LaboratoryTestResult = {
    referenceRangeUpperLimit: function (): number | undefined {
        return undefined;
    },
    referenceRangeLowerLimit: function (): number | undefined {
        return undefined;
    },
    diagnosticCategoryCoding: function (): CodeProperties[] {
        //laboratory_report,microbiology_procedure
        return [getSNOMEDCode('4241000179101'), getSNOMEDCode('19851009')];
    },
    diagnosticCodeCoding: function (): CodeProperties[] {
        //"718-7" - "Hgb Bld-mCnc"
        return [getLOINCCode('718-7')];
    },
    diagnosticCodeText: function (): string {
        return "Hemoglobin [Mass/volume] in Blood"
    },
    observationCategoryCoding: function (): object[] {
        //"Laboratory test finding (finding)","display": "Serum chemistry test"
        return [getSNOMEDCode('49581000146104'), getSNOMEDCode('275711006')];
    },
    observationCodeCoding: function (): CodeProperties[] {
        //"718-7" - "Hgb Bld-mCnc"
        return [getLOINCCode('718-7')];
    },
    resultUnit: function (): CodeProperties {
        //*"mmol/l
        return getUCUMCode("mmol/L");
    },
    results: function (): TestResultEntry[] {
        const waves = ["1a", "2a"];

        //if the assessment was missed, do not evaluate/create the resource
        return waves.filter((wave) => !assesmentMissed(wave)).map((wave) => createCheckedAccessProxy({
            "assessment": wave,
            "resultFlags": resultFlag(wave),
            "testResult": function(){
                const hemoglobin = inputValue("hemoglobin_result_all_m_1",wave);                
                return hemoglobin!==undefined?Number(hemoglobin):undefined
            }(),
            "collectedDateTime": collectedDateTime(wave)
        })
        );

    },
    labTestName: function (): string {
        return "Haemoglobin"
    }
}


/**
 * Result flag calculation for Haemoglobin concentration
 * @param wave 
 * @returns SNOMED code for above/below limit
 */
const resultFlag = (wave:string):CodeProperties|undefined=> {

    // Gender only available on '1a'
    const gender = inputValue("gender","1a");
    const hemoglobin = inputValue("hemoglobin_result_all_m_1",wave);


    if (gender===undefined || hemoglobin===undefined){
        return undefined        
    }
    else{
        if (gender=="male"){
            if (Number(hemoglobin) > 11.0){
                return getSNOMEDCode('281302008')
            }
            else if (Number(hemoglobin) < 8.5){
                return getSNOMEDCode('281300000')                
            }
            else{
                return undefined;
            }
        }
        else{
            if (Number(hemoglobin) > 10.0){
                return getSNOMEDCode('281302008')
            }
            else if (Number(hemoglobin) < 7.5){
                return getSNOMEDCode('281300000')                
            }
            else{
                return undefined;
            }

        }
    }
}

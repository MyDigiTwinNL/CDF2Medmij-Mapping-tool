import {inputValue,createCheckedAccessProxy} from '../functionsCatalog';
import {lifelinesDateToISO,substractDates} from '../lifelinesFunctions'
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
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2763564/
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
 * age                            [X ][  ][  ][  ][  ][  ]
 * gender                         [X ][  ][  ][  ][  ][  ]
 * ethnicity_category_adu_q_1     [  ][X ][  ][  ][  ][  ]
 * date                           [X ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * 1 umol/L = 0.011312217194570135 mg/dL
 * 
 * Calculation
 * gender_constant = 
 *   1 if gender == "male"
 *   1.018 if gender == "female"
 * race_constant =
 *   1.159 if race == "black"  (black/negroid)
 *   1 if race != "black"
 * kappa = 
 *   0.9 if gender == "male"
 *   0.7 if gender == "female"
 * alpha =
 *   -0.411 if gender == "male"
 *   -0.329 if gender == "female"
 * egfr = 141 * (min(((creatinine_result_all_m_1 * 0.011312217194570135) / kappa), 1)^alpha) * (max(((creatinine_result_all_m_1 * 0.011312217194570135) / kappa), 1)^-1.209) * (0.993^age) * gender_constant * race_constant
 *
 * @return, for each assessment:
 *      [[assessment_N]:
 *          - result: egfr in assessment_N
 *          - resultcoding: {"system": "http://loinc.org","code": "62238-1","display": "GFR/BSA.pred SerPlBld CKD-EPI-ArVRat"}
 *          - resultunits: {"unit": "mL/min/{1.73_m2}","system": "http://unitsofmeasure.org","code": "mL/min/{1.73_m2}"}
 *          - resultFlag: {code:281300000, system:http://snomed.info/sct}
 *                           if egfr in assessment_N < 60.0 mL/min/{1.73_m2}
 *          - collectedDateTime: date of assessment_N         
 * 
 **/
export const eGFRS:LaboratoryTestResult = {

    referenceRangeUpperLimit: function (): number | undefined {
        return undefined;
    },
    referenceRangeLowerLimit: function (): number | undefined {
        return REFERENCE_RANGE_LOWER_LIMIT;
    },
    diagnosticCategoryCoding: function (): CodeProperties[] {
        //laboratory_report,microbiology_procedure
        return [getSNOMEDCode('4241000179101'), getSNOMEDCode('19851009')];
    },
    diagnosticCodeCoding: function (): CodeProperties[] {
        //GFR/BSA.pred SerPlBld CKD-EPI-ArVRat
        return [getLOINCCode('62238-1')];
    },
    diagnosticCodeText: function (): string {
        return "Glomerular filtration rate/1.73 sq M.predicted [Volume Rate/Area] in Serum, Plasma or Blood by Creatinine-based formula (CKD-EPI)";
    },
    observationCategoryCoding: function (): object[] {
        //"Laboratory test finding (finding)","display": "Serum chemistry test"
        return [getSNOMEDCode('49581000146104'), getSNOMEDCode('275711006')];
    },
    observationCodeCoding: function (): CodeProperties[] {
        //GFR/BSA.pred SerPlBld CKD-EPI-ArVRat
        return [getLOINCCode('62238-1')];
    },
    results: function (): TestResultEntry[] {
        const waves = ["1a", "2a"];

        //if the assessment was missed, do not evaluate/create the resource
        return waves.filter((wave) => !missedAsssesment(wave)).map((wave) => createCheckedAccessProxy({
            "assessment": wave,
            "isAboveReferenceRange": undefined,
            "isBelowReferenceRange": isBelowReferenceRange(wave,REFERENCE_RANGE_LOWER_LIMIT),
            "resultFlags": resultFlags(wave,REFERENCE_RANGE_LOWER_LIMIT),
            "testResult": eGFRResult(wave),
            "collectedDateTime": collectedDateTime(wave)
        })
        );
    },
    resultUnit: function (): CodeProperties {
        return getUCUMCode("mL/min/{1.73_m2}")
    }
}


const REFERENCE_RANGE_LOWER_LIMIT = 60;


/**
 * It is assumed (from Lifelines data analysis) that when 'date' is missing in an assessment, the
 * participant dropped the study or missed the assessment.
 * @param wave 
 * @returns true if the assessment was missed 
 */
const missedAsssesment = (wave:string) => inputValue("date",wave)==undefined


const isBelowReferenceRange = (wave:string,lowerLimit:number):boolean|undefined => {
    const eGFR = eGFRResult(wave)
    return (eGFR!==undefined && eGFR < lowerLimit);
}

/**
 * 
 * @param wave 
 * @precondition date is defined for the given wave
 * @returns 
 */
const eGFRResult = (wave:string):number|undefined => {

    // Gender only available on '1a'
    const gender = inputValue("gender","1a");
    
    // Ethnicity (ethnicity_category_adu_q_1) available only on 1B
    //1:white/eastern and western european
    //2:white/mediterranean or arabic
    //3:black/negroid
    //4:asian
    //5:other:
    const race = inputValue("ethnicity_category_adu_q_1",'1b');    

    const creatinine = inputValue('creatinine_result_all_m_1', wave)
    
    const age = inputValue("age","1a");    

    if (gender===undefined || race===undefined || creatinine===undefined || age === undefined){
        return undefined        
    }
    else{
        const baslineAge = Number(age)

        //the age is only available on the first assessment(wave), so it is estimated
        //for the follow-up assessments based on the date it was performed        
        const monthsSinceBaseline = substractDates(inputValue("date","1a")!,inputValue("date",wave)!)
        const ageOnGivenWave = (wave==="1a")?baslineAge:(baslineAge + Math.floor(monthsSinceBaseline/12))

        const genderConstant = (gender === "male")?1:1.018
        const raceConstant = (race === "3")?1.159:1
        const kappa = (gender === "male")?0.9:0.7
        const alpha = (gender === "male")?-0.411:-0.329
        const creatinineValue = Number(creatinine)
        

        const egfr = 141 * (Math.min((creatinineValue * 0.011312217194570135) / kappa,1) ** alpha) * (Math.max((creatinineValue * 0.011312217194570135) / kappa,1) ** -1.209) * (0.993 ** ageOnGivenWave) * genderConstant * raceConstant
        
        return egfr;
    }


}



/**
 * 
 * @precondition date in the given wave is never undefined
 * @param wave 
 * @returns 
 */
const collectedDateTime=function(wave:string):string|undefined{
    const coldate = inputValue("date",wave)
    if (coldate!=undefined){
        return lifelinesDateToISO(coldate)
    }
    else{
        return undefined
    }    
    
};


/**
 * 
 * @param wave 
 * @returns 
 */
const resultFlags = function(wave:string,limit:number):CodeProperties|undefined{
    const eGFR = eGFRResult(wave)

    if (eGFR!==undefined && eGFR < limit){
        //Below reference range
        return getSNOMEDCode('281300000')
    }
    else{
        return undefined
    }
    
};
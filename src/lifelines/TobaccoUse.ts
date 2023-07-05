import { inputValue } from '../functionsCatalog';
import { lifelinesDateToISO } from '../lifelinesFunctions'
import moize from 'moize'
import { tobaccoUseStatusSNOMEDCodelist,typeOfTobaccoUsedSNOMEDCodelist} from '../codes/snomedCodeLists';


/**
 * Based on HCIM Tobacco ZIB resource https://zibs.nl/wiki/TobaccoUse-v3.1(2017EN)
 * Based on Lifelines smoking derivatives http://wiki.lifelines.nl/doku.php?id=smoking_derivatives_v2
 * 
 */



export type TobaccoUseProperties = {
    "assessment":string,
    "useStatus":object,
    "amountPerDay":number,
    "packYears":number,
    "smokingStartDate":string,
    "smokingEndDate":string,
    "everSmoker":boolean,
    "currentSmoker":boolean,
    "exSmoker":boolean
}
  


export const results=function():TobaccoUseProperties[]{

    //Lifelines tobacco use derivatives do not include 3B
    const waves=["1A","1B","1C","2A","2B","3A"]

    return waves.map((wave)=>(
        {
            "assessment":wave,
            "useStatus":tobaccoUseStatus(wave),
            "amountPerDay":amountPerDay(wave),
            "packYears":packYears(wave),
            "smokingStartDate":smokingStart(wave),
            "smokingEndDate":smokingEnd(wave),
            "everSmoker":everSmoker(wave),
            "currentSmoker":currentSmoker(wave),
            "exSmoker":exSmoker(wave)
        }
    )
    
    );


}

/**
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][2B][3A][3B]
 * ever_smoker_adu_c_2            [X ][X ][X ][X ][X ][X ][  ] 
 *   
 */
const everSmoker = function(wave:string):boolean{
    return inputValue("ever_smoker_adu_c_2",wave)==="1"
}

/**
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][2B][3A][3B]
 * current_smoker_adu_c_2         [X ][X ][X ][X ][X ][X ][  ] 
 * 
 */
const currentSmoker = function(wave:string):boolean{
    return inputValue("current_smoker_adu_c_2",wave)==="1"
}

/**
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][2B][3A][3B]
 * ex_smoker_adu_c_2              [X ][X ][X ][X ][X ][X ][  ] 
 * 
 */
const exSmoker = function(wave:string):boolean{
    return inputValue("ex_smoker_adu_c_2",wave)==="1"
}

/**
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][2B][3A][3B]
 * smoking_startage_adu_c_2       [X ][X ][X ][X ][X ][X ][  ] 
 * AGE                            [X ][  ][  ][  ][  ][  ][  ] 
 * 
 * @precondition
 *      - no missing values in AGE and smoking_startage_adu_c_2 in the given wave
 * 
 * @pairingrule 
 *      - the approximate year the participant had the age reported in A1 baseline assessment, 
 *        given the date such baseline assessment was performed
 */
const  smokingStart = function(wave:string){
    //
    const surveyDateParts = inputValue("DATE","1A").split("/");        
    const surveyYear= Number(surveyDateParts[1]);
    const startAge = Number(inputValue("smoking_startage_adu_c_2",wave));
    //Age is only on baseline assessment 1A
    const surveyAge = Number(inputValue("AGE","1A"));                
    return (surveyYear - surveyAge + startAge).toString()
};

/**
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][2B][3A][3B]
 * smoking_endage_adu_c_2         [X ][X ][X ][X ][X ][X ][  ] 
 * AGE                            [X ][  ][  ][  ][  ][  ][  ] 
 * 
 */
const  smokingEnd = function(wave:string){
    const surveyDateParts = inputValue("DATE","1A").split("/");        
    const surveyYear= Number(surveyDateParts[1]);
    const endAge = Number(inputValue("smoking_endage_adu_c_2",wave));
    const surveyAge = Number(inputValue("AGE","1A"));                
    return (surveyYear - surveyAge + endAge).toString()
};



/**
 * Type of toboacco is reported as undefined. Using it would require creating a FHIR resource for each type of tobbaco, 
 * with its specific consuption. Consuption per type is not available in the smoking_derivatives. 
 * 
 * @param wave assessment for which the type of tobacco would be reported
 */
const typeOfTobaccoUsed = (wave:string):object|undefined =>{
    return undefined
}

/**
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][2B][3A][3B]
 * ex_smoker_adu_c_2              [X ][X ][X ][X ][X ][X ][  ]
 * ever_smoker_adu_c_2            [X ][X ][X ][X ][X ][X ][  ]   
 * current_smoker_adu_c_2         [X ][X ][X ][X ][X ][X ][  ]   
 * ------------------------------------------------------------------
 * 
 * The status of the result value.
 * 
 * @precondition the three variables have no missing values in the given 'wave'
 * 
 * @param wave the code of the assessment for which the tobacco use status will be evaluated
 * 
 * @question is there a way to tell if it is daily or ocasional smoker?
 * 
 */
const tobaccoUseStatus = (wave:string):object => {    
    if (inputValue("ever_smoker_adu_c_2",wave)==="2"){
        return tobaccoUseStatusSNOMEDCodelist.non_smoker;
    }
    else if (inputValue("ex_smoker_adu_c_2",wave)==="1"){
        return tobaccoUseStatusSNOMEDCodelist.ex_smoker;
    }
    else if (inputValue("current_smoker_adu_c_2",wave)==="1"){
        return tobaccoUseStatusSNOMEDCodelist.occasional;
    }
    else{
        return tobaccoUseStatusSNOMEDCodelist.other;
    }
}

/**
 * total_frequency_adu_c_1 total number smoked per day (all types except e-cigarettes)
 * 
 * 
 */
const amountPerDay = (wave:string):number =>{
    return Number(inputValue("total_frequency_adu_c_1",wave))
}

/**
 * packyears_cumulative_adu_c_2 - packyears (cumuative smoking history)
 */
const packYears = (wave:string):number => {
    return Number(inputValue("packyears_cumulative_adu_c_2",wave))
}
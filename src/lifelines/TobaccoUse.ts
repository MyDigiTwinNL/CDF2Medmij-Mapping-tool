import { inputValue } from '../functionsCatalog';
import { lifelinesDateToISO } from '../lifelinesFunctions'
import moize from 'moize'
import { tobaccoUseStatusSNOMEDCodelist,typeOfTobaccoUsedSNOMEDCodelist} from '../snomedCodeLists';


/**
 * Based on Lifelines smoking derivatives http://wiki.lifelines.nl/doku.php?id=smoking_derivatives_v2
 */

/**
 * Using derivatives: 
 * 
 * MedMij model expect a detailed entry for each type of tobacco
 * 
 * 
 * Age at stop smoking
 * 
 * 
 * 
 */

/**
 * 
 * 
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][2B][3A][3B]
 * currentsmoker_v2               [X ][X ][X ][X ][X ][X ][  ] 
 * smoking_startage_adu_c_2       [X ][X ][X ][X ][X ][X ][  ]      how old were you when you started smoking? (xx years)
 * ex_smoker_adu_c_2              [X ][X ][X ][X ][X ][X ][  ]
 * smoking_endage_adu_c_2         [X ][X ][X ][X ][X ][X ][  ]   
 * eversmoker_v2  
 * total_frequency_adu_c_1
 * packyears_cumulative_adu_c_2
 * 
 *  
 * cigarettes_frequency_adu_c_2   [X ][X ][X ][X ][X ][X ][  ]
 * cigarillos_frequency_adu_c_2   [X ][X ][X ][X ][X ][X ][  ]
 * cigars_frequency_adu_c_2       [X ][X ][X ][X ][X ][X ][  ] 
 * ecigars_frequency_adu_c_1      [X ][X ][X ][X ][X ][X ][  ]
 * DATE                           [X ][X ][X ][X ][X ][X ][  ]
 * ------------------------------------------------------------------
 * 
 * 
 * 
 * @returns 
 * 
 * 
 */

export type TobaccoUseProperties = {
    "assessment":string,
    "useStatus":object,
    "amountPerDay":string,
    "packYears":string,
    "smokingStartDate":string,
    "smokingEndDate":string
    "everSmoker":string
    "currentSmoker":string  
}
  


export const results=function():object[]{
    return [
        {
            "assessment":"1A",
            "useStatus":tobaccoUseStatus("1A"),
            "amountPerDay":amountPerDay("1A"),
            "packYears":packYears("1A"),
            "smokingStartDate":smokingStart("1A"),
            "smokingEndDate":smokingEnd("1A"),
            "everSmoker":everSmoker("1A"),
            "currentSmoker":currentSmoker("1A")
        },
    ]

}


const everSmoker = function(wave:string){
    return inputValue("ever_smoker_adu_c_2")[wave]==="1"
}

const currentSmoker = function(wave:string){
    return inputValue("current_smoker_adu_c_2")[wave]==="1"
}

const  smokingStart = function(wave:string){
    const surveyDateParts = inputValue("DATE")[wave].split("/");        
    const surveyYear= Number(surveyDateParts[1]);
    const startAge = Number(inputValue("smoking_startage_adu_c_2")[wave]);
    //Age is only on baseline assessment 1A
    const surveyAge = Number(inputValue("AGE")['1A']);                
    return (surveyYear - surveyAge + startAge).toString()
};

const  smokingEnd = function(wave:string){
    const surveyDateParts = inputValue("DATE")[wave].split("/");        
    const surveyYear= Number(surveyDateParts[1]);
    const endAge = Number(inputValue("smoking_endage_adu_c_2")[wave]);
    const surveyAge = Number(inputValue("AGE")['1A']);                
    return (surveyYear - surveyAge + endAge).toString()
};



/**
 * Type won't be used. Using it would require having one entry for each type of tobbaco, with its
 * specific consuption. Consuption per type is not available in the derivatives. (only on the baseline assessment)
 * @param wave 
 */
const typeOfTobaccoUsed = (wave:string):object|undefined =>{
    return undefined
}

/**
 * 
 * 
 * @question is there a way to tell if it is daily or ocasional smoker?
 * @param wave 
 */
const tobaccoUseStatus = (wave:string):object => {    
    if (inputValue("ever_smoker_adu_c_2")[wave]==="2"){
        return tobaccoUseStatusSNOMEDCodelist.non_smoker;
    }
    else if (inputValue("ex_smoker_adu_c_2")[wave]==="1"){
        return tobaccoUseStatusSNOMEDCodelist.ex_smoker;
    }
    else if (inputValue("current_smoker_adu_c_2")[wave]==="1"){
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
const amountPerDay = (wave:string) =>{
    return inputValue("total_frequency_adu_c_1")[wave]
}

/**
 * packyears_cumulative_adu_c_2 - packyears (cumuative smoking history)
 */
const packYears = (wave:string) => {
    return inputValue("packyears_cumulative_adu_c_2")[wave]
}
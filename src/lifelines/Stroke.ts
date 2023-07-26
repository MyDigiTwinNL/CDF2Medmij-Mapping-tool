import {inputValue, inputValues} from '../functionsCatalog';
import moize from 'moize'
import {lifelinesDateToISO, lifelinesMeanDate} from '../lifelinesFunctions'
import {clinicalStatusSNOMEDCodeList,conditionsSNOMEDCodeList,verificationStatusSNOMEDCodeList} from '../codes/snomedCodeLists';


/*
Based on HCIM Problem resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.12/files/2002573

Related Lifelines variables:
http://wiki.lifelines.nl/doku.php?id=stroke&s[]=stroke&s[]=startage&s[]=adu&s[]=1
*/


/**
 * Defines whether the output of the mapping should be included in the participant's bundle.
 * 
 * Related variables/functions:
 * ------------------------------------------------------------------
 * clinicalStatus()
 * 
 * ------------------------------------------------------------------
 * There us no such a thing as 'inactive' stroke. Therefore, the stroke resource will be
 * generated only when the clinicalStatus() is active.
 * 
 */
export const isPresent = ():boolean => clinicalStatus() === clinicalStatusSNOMEDCodeList.active


/**
 * The problem status describes the condition of the problem: Active problems are problems of which the patient experiences 
 * symptoms or for which evidence exists. Problems with the status 'Inactive' refer to problems that don't affect the patient 
 * anymore or that of which there is no evidence of existence anymore.
 * 
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][3A][3B]
 * stroke_presence_adu_q_1        [X ][  ][  ][  ][  ][  ]
 * stroke_followup_adu_q_1        [  ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * @precondition
 *      - no missing values
 * 
 * @pairingrule 
 *      if stroke_presence_adu_q_1 = yes in 1A => SNOMED code for active. 
 *      else
 *          if stroke_presence_adu_q_1 = no, and there is a 'yes' on stroke_followup_adu_q_1 in any of the 
 *          follow-up assessments => active. 
 *          else 
 *              an empty object is returned, as there is no such a thing as 'inactive' stroke given the
 *              definition used by the profile: Problems with the status 'Inactive' refer to problems that don't 
 *              affect the patient anymore or that of which there is no evidence of existence anymore.
 * 
 */
export const clinicalStatus = ():object => { 
    return _clinicalStatus(inputValue("stroke_presence_adu_q_1","1A"),inputValues("stroke_followup_adu_q_1"));
}

/**
 * Memoized function for clinicalStatus
 */
const _clinicalStatus = moize((stroke_presence:string,followup_assessments:object):object => {        
    if (stroke_presence==="1"){
        return clinicalStatusSNOMEDCodeList.active
    }
    else if (Object.values(followup_assessments).some((wavereading) => wavereading === "1")){
        return clinicalStatusSNOMEDCodeList.active
    }
    else{
        return {}
    }    
})


/**
 * Start of the disorder to which the problem applies. Especially in symptoms in which it takes 
 * longer for the final diagnosis, it is important to know not only the date of the diagnosis, 
 * but also how long the patient has had the disorder. A ‘vague’ date, such as only the year or 
 * the month and the year, is permitted.
 * 
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][3A][3B]
 * stroke_startage_adu_q_1        [X ][  ][  ][  ][  ][  ]
 * stroke_presence_adu_q_1        [X ][  ][  ][  ][  ][  ]
 * stroke_followup_adu_q_1        [  ][X ][X ][X ][X ][X ]
 * date                           [X ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * @precondition
 *      - no missing values
 *      - the problem is 'active' (see clinicalStatus function)
 * 
 * @pairingrule
 *      if stroke_presence_adu_q_1 = yes in 1A => approximate year on which the participant given the age reported  by stroke_startage_adu_q_1
 *      else
 *          if there is a 'yes' in any stroke_followup_adu_q_1 => mean date between the date of the assessment 
 *              where stroke_followup_adu_q_1 = yes, and the date of the preceding one.
 *          else
 *              error/precondition violated ('stroke' is not 'active' if the execution reached this point)
 *    
 * @question
 * 
 *      - Given the question stroke_followup_adu_q_1: "did the health problems listed below start since the last time you filled 
 *          in the lifelines questionnaire?", and considering that this variable was collected only in 2A, 3A and 3B, when a 'yes'
 *          is reported in 2A, should this 'mean date' be calculated between the date of 1A and 2A, or between 1C and 2A?
 *          For the time being, 1A date will be used.
 *          
 */
export const onsetDateTime = ():string => {
    if (inputValue("stroke_presence_adu_q_1","1A")==='1'){
        const surveyDateParts = inputValue("date","1A").split("/");
        const surveyYear = Number(surveyDateParts[1]);
        const strokeStartAge = Number (inputValue("stroke_startage_adu_q_1","1A"));
        const surveyAge = Number(inputValue("age","1A"));      
        return (surveyYear - surveyAge + strokeStartAge).toString();
    }
    else{
        
        const timeInterval = findDatesBetweenStrokePresenceReport();
        if (timeInterval!=undefined){
            const [date1,date2]=timeInterval;
            return lifelinesDateToISO(lifelinesMeanDate(date1,date2))
        }
        else{
            throw Error("Unexpected input (precondition violated): no 'yes' values in stroke_followup_adu_q_1")
        }


    }

}
    
/**
 * 
 * @param diabFollowUp 
 * @returns 
 */
function findDatesBetweenStrokePresenceReport(): [string,string]|undefined{
    const strokeFollowUp=inputValues('stroke_followup_adu_q_1')      
    const waves = ['1A','1B','1C','2A', '3A', '3B'];
    let previousWave = waves[0];
  
    for (let i = 1; i < waves.length; i++) {
      const wave = waves[i];
      const value = strokeFollowUp[wave];
      if (value === '1') {
        return [inputValue("date",previousWave),inputValue("date",wave)];        
      }
  
      previousWave = wave;
    }

    return undefined
  }




/**
 * The verification status to support or decline the clinical status of the condition or diagnosis.
 */
export const verificationStatus = ():object => { 
    return verificationStatusSNOMEDCodeList.unknwon
}


/**
 * 
 * @precondition
 *      - no missing values
 *      - the problem is 'active' (see clinicalStatus function)
 *      
 * @pairingrule 
 *      - Snomed code for Stroke
 * 
 * @question
 * 
 * 
 */
export const code = ():object => {

    
    return conditionsSNOMEDCodeList.cerebrovascular_accident
    
    
}


/**
 * Anatomical location which is the focus of the procedure.
 * 
 * Not used by the stroke template
 */
const bodySite = () => {throw Error("Function not implemented")}



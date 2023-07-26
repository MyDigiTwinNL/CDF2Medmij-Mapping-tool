import {inputValue, inputValues} from '../functionsCatalog';
import moize from 'moize'
import {lifelinesDateToISO, lifelinesMeanDate} from '../lifelinesFunctions'
import {clinicalStatusSNOMEDCodeList,conditionsSNOMEDCodeList,verificationStatusSNOMEDCodeList} from '../codes/snomedCodeLists';


/*
Based on HCIM Problem resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.12/files/2002573

Related Lifelines variables:
http://wiki.lifelines.nl/doku.php?id=diabetes&s[]=diabetes&s[]=startage&s[]=adu&s[]=1
*/


/**
 * Defines whether the output of the mapping should be included in the participant's bundle.
 * 
 * Related variables/functions:
 * ------------------------------------------------------------------
 * clinicalStatus()
 * 
 * ------------------------------------------------------------------
 * There us no such a thing as 'inactive' diabetes. Therefore, the Diabetes resource will be
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
 * diabetes_presence_adu_q_1      [X ][  ][  ][  ][  ][  ]
 * diabetes_followup_adu_q_1      [  ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * @precondition
 *      - no missing values
 * 
 * @pairingrule 
 *      if diabetes_presence_adu_q_1 = yes in 1A => SNOMED code for active. 
 *      else
 *          if diabetes_presence_adu_q_1 = no, and there is a 'yes' on diabetes_followup_adu_q_1 in any of the 
 *          follow-up assessments => active. 
 *          else 
 *              an empty object is returned, as there is no such a thing as 'inactive' diabetes given the
 *              definition used by the profile: Problems with the status 'Inactive' refer to problems that don't 
 *              affect the patient anymore or that of which there is no evidence of existence anymore.
 * 
 */
export const clinicalStatus = ():object => { 
    return _clinicalStatus(inputValue("diabetes_presence_adu_q_1","1a"),inputValues("diabetes_followup_adu_q_1"));
}

/**
 * Memoized function for clinicalStatus
 */
const _clinicalStatus = moize((diab_presence:string,followup_assessments:object):object => {        
    if (diab_presence==="1"){
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
 * diabetes_startage_adu_q_1      [X ][  ][  ][  ][  ][  ]
 * diabetes_presence_adu_q_1      [X ][  ][  ][  ][  ][  ]
 * diabetes_followup_adu_q_1      [  ][X ][X ][X ][X ][X ] 
 * date                           [X ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * @precondition
 *      - no missing values
 *      - the problem is 'active' (see clinicalStatus function)
 * 
 * @pairingrule
 *      if diabetes_presence_adu_q_1 = yes in 1A => approximate year on which the participant given the age reported  by diabetes_startage_adu_q_1
 *      else
 *          if there is a 'yes' in any diabetes_followup_adu_q_1 => mean date between the date of the assessment 
 *              where diabetes_followup_adu_q_1 = yes, and the date of the preceding one.
 *          else
 *              error/precondition violated ('diabetes' is not 'active' if the execution reached this point)
 *              
 */
export const onsetDateTime = ():string => {
    if (inputValue("diabetes_presence_adu_q_1","1a")==='1'){
        const surveyDateParts = inputValue("date","1a").split("/");
        const surveyYear = Number(surveyDateParts[1]);
        const diabetesStartAge = Number (inputValue("diabetes_startage_adu_q_1","1a"));
        const surveyAge = Number(inputValue("age","1a"));      
        return (surveyYear - surveyAge + diabetesStartAge).toString();
    }
    else{
        
        const result = findDatesBetweenDiabetesPresenceReport();
        if (result!=undefined){
            const [date1,date2]=result;
            return lifelinesDateToISO(lifelinesMeanDate(date1,date2))
        }
        else{
            throw Error("Unexpected input (precondition violated): no 'yes' values in neither t2d_followup_adu_q_1 nor t2d_followup_adu_q_1")
        }


    }

}
    
/**
 * 
 * @param diabFollowUp 
 * @returns 
 */
function findDatesBetweenDiabetesPresenceReport(): [string,string]|undefined{
    const diabFollowUp=inputValues('diabetes_followup_adu_q_1')      
    const waves = ['1a','1b','1c','2a', '3a', '3b'];
    let previousWave = waves[0];
  
    for (let i = 1; i < waves.length; i++) {
      const wave = waves[i];
      const value = diabFollowUp[wave];
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
 *                              [1A][1B][1C][2A][3A][3B]
 * diabetes_type_adu_q_1        [X ][  ][  ][  ][  ][  ] what type of diabetes do you have? (1) type 1, (2) type 2, (3) other type, (4) I do not know
 * diabetes_type_adu_q_1_a      [X ][  ][  ][  ][  ][  ] another type of diabetes
 * t1d_followup_adu_q_1         [  ][  ][  ][X ][X ][X ] did the health problems listed below start since the last time
 * t2d_followup_adu_q_1         [  ][  ][  ][X ][X ][X ] did the health problems listed below start since the last time
 * diabetes_presence_adu_q_1    [X ][  ][  ][  ][  ][  ]
 * diabetes_followup_adu_q_1    [  ][X ][X ][X ][X ][X ]
 * 
 * @precondition
 *      - no missing values
 *      - the problem is 'active' (see clinicalStatus function)
 *      - there are no 'yes' values in both t1d_followup_adu_q_1 and t1d_followup_adu_q_2 (the two types of diabetes are mutually exclusive)
 *      - when there is a yes in diabetes_followup_adu_q_1, there should be a yes in either t1d_followup_adu_q_1 and t2d_followup_adu_q_1 
 *      
 * @pairingrule 
 *      if diabetes_presence_adu_q_1[1A] is 'yes', and diabetes_type_adu_q_1 is either 1 or 2 => corresponding SNOMED diabetes type code
 *      else if diabetes_presence_adu_q_1[1A] is 'yes', and diabetes_type_adu_q_1 is neither 1 or 2 => **UNDEFINED** (see @questions)
 *      else
 *          if there is a 'yes' in t1d_followup_adu_q_1 => SNOMED code for diabates type 1
 *          else if there is a 'yes' in t2d_followup_adu_q_1 or  => SNOMED-diabates type 2
            else - error/precondition #4 violated
 * 
 * 
 * @question
 *      - @bas, is diabetes_type_adu_q_1_a an open-ended question? @bas and @bauke, which type should we return if a value is given here?
 *      - diabetes_followup_adu_q_1 was collected in [1A][1B][1C][2A][3A][3B], but t1d_followup_adu_q_1 and t2d_followup_adu_q_1 were 
 *          collected only on 2A, 3A, 3B. So, which diabetes type should we use?
 * 
 */
export const code = ():object => {

    if (inputValue('diabetes_presence_adu_q_1',"1a")==='1'){
        if (inputValue('diabetes_type_adu_q_1',"1a")==='1') return conditionsSNOMEDCodeList.diabetes_mellitus_type_1;
        else if (inputValue('diabetes_type_adu_q_1',"1a")==='2') return conditionsSNOMEDCodeList.diabetes_mellitus_type_2
        else throw Error("Undefined mapping case")
    }
    else{
        const t1dfollowup = inputValues("t1d_followup_adu_q_1")

        if (Object.values(t1dfollowup).some((wavereading) => wavereading === "1")){
            return conditionsSNOMEDCodeList.diabetes_mellitus_type_1;
        }
        else{
            const t2dfollowup = inputValues("t2d_followup_adu_q_1")
            if (Object.values(t2dfollowup).some((wavereading) => wavereading === "1")){
                return conditionsSNOMEDCodeList.diabetes_mellitus_type_2;
            }
            else{
                throw Error("Unexpected input (precondition violated): no 'yes' values in neither t2d_followup_adu_q_1 nor t2d_followup_adu_q_1")
            }

        }

    }
    
}


/**
 * Anatomical location which is the focus of the procedure.
 * 
 * Not used by the Diabetes template
 */
const bodySite = () => {throw Error("Function not implemented")}



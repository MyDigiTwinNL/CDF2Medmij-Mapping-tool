import {inputValue,inputValues} from '../functionsCatalog';
import moize from 'moize'
import {lifelinesDateToISO, lifelinesMeanDate} from '../lifelinesFunctions'
import {clinicalStatusSNOMEDCodeList,conditionsSNOMEDCodeList,verificationStatusSNOMEDCodeList} from '../snomedCodeLists';


/*
Based on HCIM Problem resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.12/files/2002573

Related Lifelines variables:
http://wiki.lifelines.nl/doku.php?id=cardiovascular_diseases
*/


/**
 * 
 *                                      [1A][1B][1C][2A][3A][3B]
 *   heartattack_startage_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   angioplasty_bypass_adu_q_1a:       [X ][  ][  ][  ][X ][X ]    
 *   heartattack_presence_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   heartattack_followup_adu_q_1:      [  ][X ][X ][X ][X ][X ]    
 *   angioplasty_bypass_adu_q_1:        [X ][  ][  ][  ][X ][X ]    
 *   carotid_stenosis_adu_q_1:          [X ][  ][  ][  ][  ][  ]    
 *   claudication_followup_adu_q_1:     [  ][  ][  ][X ][X ][X ]    
 *   cvd_followup_adu_q_1:              [  ][X ][X ][X ][X ][X ]    
 *
 *   @precondition
 *      clinical status is active
 * 
 */
export const code = ():object => {
    return conditionsSNOMEDCodeList.peripheral_vascular_disease;
}

/**
 * 
 *                                      [1A][1B][1C][2A][3A][3B]
 *   heartattack_startage_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   angioplasty_bypass_adu_q_1a:       [X ][  ][  ][  ][X ][X ]    
 *   heartattack_presence_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   heartattack_followup_adu_q_1:      [  ][X ][X ][X ][X ][X ]    
 *   angioplasty_bypass_adu_q_1:        [X ][  ][  ][  ][X ][X ]    
 *   carotid_stenosis_adu_q_1:          [X ][  ][  ][  ][  ][  ]    
 *   claudication_followup_adu_q_1:     [  ][  ][  ][X ][X ][X ]    
 *   cvd_followup_adu_q_1:              [  ][X ][X ][X ][X ][X ]    
 *   
 * 
 * 
 *  @pairingrule
 *     if any of the following variables (if collected on any of the assessments) has a 'yes' value, return 'active':
 *                  heartattack_presence_adu_q_1 
 *                  heartattack_followup_adu_q_1 
 *                  angioplasty_bypass_adu_q_1 
 *                  carotid_stenosis_adu_q_1 
 *                  atherosclerosis_presence_adu_q_1 
 *                  claudication_followup_adu_q_1 
 *                  cvd_followup_adu_q_1
 *     else
 *          Empty result (there is no such thing as an  inactive' CVD)
 * 
 * 
 */
export const clinicalStatus = ():object => { 
    
    /*atherosclerosis_presence_adu_q_1: is categorical*/

    const firstAssessmentWithPositiveCVD: string | null = findFirstAssessmentWithPositiveValue(cvdRelatedVariables);

    if (firstAssessmentWithPositiveCVD===null){
        return {}
    }
    else{
        return clinicalStatusSNOMEDCodeList.active
    }


}


const cvdRelatedVariables = {
    "heartattack_presence_adu_q_1":inputValues("heartattack_presence_adu_q_1"),
    "heartattack_followup_adu_q_1":inputValues("heartattack_followup_adu_q_1"),
    "angioplasty_bypass_adu_q_1" :inputValues("angioplasty_bypass_adu_q_1"),
    "carotid_stenosis_adu_q_1" :inputValues("carotid_stenosis_adu_q_1"),
    "atherosclerosis_presence_adu_q_1":inputValues("atherosclerosis_presence_adu_q_1"),
    "claudication_followup_adu_q_1":inputValues("claudication_followup_adu_q_1"),
    "cvd_followup_adu_q_1":inputValues("cvd_followup_adu_q_1")
}


type ObjectWithProperties = 
{
    [key: string]: {
      [key: string]: string;
    };
};

  
/**
 * Find the first assessment (given the series of assessment 1A, 1B, 1C, 2A, 3A, 3B) where
 * at least one of given variables has has a 'yes' value ('1' in Lifelines), if such variable
 * was collected in the said assessment.
 * @param variables 
 * @returns 
 */
const findFirstAssessmentWithPositiveValue = (variables: {
        [key: string]: {
            [key: string]: string;
        };
    }): string | null => {
    
    const wavesSequence: string[] = ["1A", "1B", "1C", "2A", "3A", "3B"];
    

    for (const element of wavesSequence) {
        if (Object.values(variables).some((props) => props.hasOwnProperty(element) && props[element] === '1')) {
            return element;
        }
    }
    return null;
}




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
 *                                      [1A][1B][1C][2A][3A][3B]
 *   heartattack_presence_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   heartattack_startage_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   angioplasty_bypass_adu_q_1:        [X ][  ][  ][  ][X ][X ]  have you ever had a balloon angioplasty (stretching of artery with balloon) and/or bypass surgery? 
 *   angioplasty_bypass_adu_q_1a:       [X ][  ][  ][  ][X ][X ]  if so, how old were you when you had the (first) balloon angioplasty/bypass surgery?  
 * 
 *   heartattack_followup_adu_q_1:      [  ][X ][X ][X ][X ][X ]    
 *   carotid_stenosis_adu_q_1:          [X ][  ][  ][  ][  ][  ]    
 *   claudication_followup_adu_q_1:     [  ][  ][  ][X ][X ][X ]    
 *   cvd_followup_adu_q_1:              [  ][X ][X ][X ][X ][X ] did the health problems listed below start since the last time you filled in the lifelines questionnaire?   
 *    
 * 
 * @pairingrule
 *  (Original pairing rule) First non-NaN date of heartattack_startage_adu_q_1, angioplasty_bypass_adu_q_1a if available, else NaN
 *  (Updated)
 *      if heartattack_presence_adu_q_1 in 1A = yes => year when participant was the age given in heartattack_startage_adu_q_1
 *      else if angioplasty_bypass_adu_q_1 in 1A, 3A or 3B => year when participant was the age given in the corresponding angioplasty_bypass_adu_q_1a
 *      else
 *          *TO BE DEFINED* (See questions below)
 * 
 * 
 * 
 * @Precondition
 *  - Problem is 'active'
 * 
 * @Questions
 *  
 *  - Some variables have no question regarding onset of disease, which would lead to an imperfect description of 'onset'
 *  - As far I can tell The following variables do not have a related age/date. Can (and should) we do imputation based on the assessment date?
 *          heartattack_followup_adu_q_1:      [  ][X ][X ][X ][X ][X ]    
 *          carotid_stenosis_adu_q_1:          [X ][  ][  ][  ][  ][  ]    
 *          claudication_followup_adu_q_1:     [  ][  ][  ][X ][X ][X ]    
 *          cvd_followup_adu_q_1:              [  ][X ][X ][X ][X ][X ]  
 * 
 */
export const vascularDiseaseStartYear = function(){

    /*const firstAssessmentWithPositiveCVD = findFirstAssessmentWithPositiveValue(cvdRelatedVariables);
    if (inputValue("heartattack_presence_adu_q_1")["1A"]==="1"){        
        const surveyDateParts = inputValue("DATE")["1A"].split("/");        
        const surveyYear= Number(surveyDateParts[1]);
        const heartAttackStartAge = Number(inputValue("heartattack_startage_adu_q_1"));
        const surveyAge = Number(inputValue("AGE"));                
        return (surveyYear - surveyAge + heartAttackStartAge).toString()
    }        
    
    }*/
    throw Error('Function not implemented')

};



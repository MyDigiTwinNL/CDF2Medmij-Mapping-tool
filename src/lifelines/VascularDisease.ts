import {inputValue,inputValues} from '../functionsCatalog';
import moize from 'moize'
import {lifelinesDateToISO, lifelinesMeanDate} from '../lifelinesFunctions'
import {clinicalStatusSNOMEDCodeList,conditionsSNOMEDCodeList,verificationStatusSNOMEDCodeList} from '../codes/snomedCodeLists';


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
 *   angioplasty_bypass_adu_q_1_a:      [X ][  ][  ][  ][X ][X ]    
 *   heartattack_presence_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   heartattack_followup_adu_q_1:      [  ][X ][X ][X ][X ][X ]    
 *   angioplasty_bypass_adu_q_1:        [X ][  ][  ][  ][X ][X ]    
 *   carotid_stenosis_adu_q_1:          [X ][  ][  ][  ][  ][  ]    
 *   claudication_followup_adu_q_1:     [  ][  ][  ][X ][X ][X ]    
 *   cvd_followup_adu_q_1:              [  ][  ][  ][X ][X ][X ]    
 * 
 *   heartattack_followup_adu_q_1
 *   stroke_followup_adu_q_1
 * 
 * 
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
 *   heartattack_presence_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   heartattack_followup_adu_q_1:      [  ][X ][X ][X ][X ][X ]
 *   angioplasty_bypass_adu_q_1:        [X ][  ][  ][  ][X ][X ]     
 *   angioplasty_bypass_adu_q_1_a:      [X ][  ][  ][  ][X ][X ]  how old were you when you had the (first) balloon angioplasty/bypass surgery?       
 *   carotid_stenosis_adu_q_1:          [X ][  ][  ][  ][  ][  ]    
 *   claudication_followup_adu_q_1:     [  ][X ][X ][X ][X ][X ]    
 *   cvd_followup_adu_q_1:              [  ][  ][  ][X ][X ][X ]    <- check: only on 2A, 3A, 3B?
 * 
 *   atherosclerosis_presence_adu_q_q:  [X ][  ][  ][  ][  ][  ]
 *   
 * 
 * 
 *  @pairingrule
 *     if any of the following variables (if collected on any of the assessments) has a 'yes' value, return 'active':
 *                  heartattack_presence_adu_q_1 
 *                  heartattack_followup_adu_q_1 
 *                  angioplasty_bypass_adu_q_1 
 *                  carotid_stenosis_adu_q_1 
 *                  claudication_followup_adu_q_1 
 *                  cvd_followup_adu_q_1 (Myocardial infarction, Stroke (both ischemic and hemorrhagic, Heart failure / cardiomyopathy, Intermittent claudication)
 *     or atherosclerosis_presence_adu_q_1 == 'atherosclerosis' (not the other options: heart valve problems, thrombosis, pulmonary embolism)
 *     else
 *          Empty result (there is no such thing as an  inactive' CVD)
 * 
 * @question
 *      	
 *
 * Bas:
 *       atherosclerosis <- only this is relevant
 *       heart valve problems
 *       thrombosis
 *       pulmonary embolism
 * 
 *  
 * - atherosclerosis_presence_adu_q_1 is a categorical variable, but in the data catalogue only "atherosclerosis (arteriosclerosis)"
 * category is shown. 
 * Not sure what are the values, in this categorical variable, for: 
 *  Myocardial infarction, Stroke (both ischemic and hemorrhagic), Heart failure / cardiomyopathy, Intermittent claudication
 * 
 * 
 * These options are part of the cvd_followup (it covers all three as far I understand). Given your comment, 
 * Myocardial infarction
 * Stroke (both ischemic and hemorrhagic)
 * Heart failure / cardiomyopathy
 * Intermittent claudication
 * 
 * 
 */
export const clinicalStatus = ():object => { 
    
    /*atherosclerosis_presence_adu_q_1: is categorical*/

    const cvdRelatedVariables = {
        "heartattack_presence_adu_q_1":inputValues("heartattack_presence_adu_q_1"),
        "heartattack_followup_adu_q_1":inputValues("heartattack_followup_adu_q_1"),
        "angioplasty_bypass_adu_q_1" :inputValues("angioplasty_bypass_adu_q_1"),
        "carotid_stenosis_adu_q_1" :inputValues("carotid_stenosis_adu_q_1"),        
        "claudication_followup_adu_q_1":inputValues("claudication_followup_adu_q_1"),
        "cvd_followup_adu_q_1":inputValues("cvd_followup_adu_q_1"),
        "atherosclerosis_presence_adu_q_1":inputValues("atherosclerosis_presence_adu_q_1"),
    }


    const firstAssessmentWithPositiveCVD: string | null = findFirstAssessmentWithPositiveValue(cvdRelatedVariables);

    if (firstAssessmentWithPositiveCVD===null){
        return {}
    }
    else{
        return clinicalStatusSNOMEDCodeList.active
    }


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
    
    const wavesSequence: string[] = ["1a", "1b", "1c", "2a", "3a", "3b"];
    

    for (const element of wavesSequence) {
        if (Object.values(variables).some((props) => Object.prototype.hasOwnProperty.call(props,element) && props[element] === '1')){
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
 * There us no such a thing as 'inactive' vascular disease. Therefore, the VD resource will be
 * generated only when the clinicalStatus() is active.
 * 
 */
export const isPresent = ():boolean => clinicalStatus() === clinicalStatusSNOMEDCodeList.active



/**
 *                                      [1A][1B][1C][2A][3A][3B]
 *   heartattack_presence_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   heartattack_startage_adu_q_1:      [X ][  ][  ][  ][  ][  ]    
 *   angioplasty_bypass_adu_q_1:        [X ][  ][  ][  ][X ][X ]  have you ever had a balloon angioplasty (stretching of artery with balloon) and/or bypass surgery? 
 *   angioplasty_bypass_adu_q_1_a:       [X ][  ][  ][  ][X ][X ]  if so, how old were you when you had the (first) balloon angioplasty/bypass surgery?  
 * 
 *   heartattack_followup_adu_q_1:      [  ][X ][X ][X ][X ][X ]    
 *   carotid_stenosis_adu_q_1:          [X ][  ][  ][  ][  ][  ]    
 *   claudication_followup_adu_q_1:     [  ][X ][X ][X ][X ][X ]    
 *   cvd_followup_adu_q_1:              [  ][  ][  ][X ][X ][X ] (yes/no) did the health problems listed below start since the last time you filled in the lifelines questionnaire?   
 *
 *   atherosclerosis_presence_adu_q_q:  [X ][  ][  ][  ][  ][  ] (NEW)
 *    
 * @Precondition
 *  - Problem is 'active'
 *  - No missing values
 * 
 * @pairingrule
 * 
 *      if heartattack_presence_adu_q_1 in 1A = yes AND angioplasty_bypass_adu_q_1 in 1A = yes => earliest date calculated based on (heartattack_startage_adu_q_1, angioplasty_bypass_adu_q_1_a)
 *      else
 *          if there is a 'yes' in any heartattack_followup_adu_q_1 => mean date between the date of the assessment 
 *              where heartattack_followup_adu_q_1 = yes, and the date of the preceding one.
 *          else if there is a 'yes' in any claudication_followup_adu_q_1 after 1B assessment => mean date between the date of the assessment 
 *              where claudication_followup_adu_q_1 = yes, and the date of the preceding one.
 *          else
 *              NaN (no onset year would be reported)
 * 
 * @Questions
 *  
 *    It is not clear whether cvd_followup_adu_q_1 is linked to other questions. According to the spreadsheets comments, a 'yes' value
 *    on cvd_followup_adu_q_1 would imply any (one or more?) of the following:
 *       Myocardial infarction, Stroke (both ischemic and hemorrhagic), Heart failure / cardiomyopathy and Intermittent claudication.
 *    Should this variable be considered for the onset calculation, specially given that 'Stroke' is reported as a separate resource?
 */
export const vascularDiseaseStartYear = function(){

    /*const firstAssessmentWithPositiveCVD = findFirstAssessmentWithPositiveValue(cvdRelatedVariables);
    if (inputValue("heartattack_presence_adu_q_1")["1a"]==="1"){        
        const surveyDateParts = inputValue("date")["1a"].split("-");        
        const surveyYear= Number(surveyDateParts[1]);
        const heartAttackStartAge = Number(inputValue("heartattack_startage_adu_q_1"));
        const surveyAge = Number(inputValue("age"));                
        return (surveyYear - surveyAge + heartAttackStartAge).toString()
    }        
    
    }*/
    throw Error('Function not implemented')

};



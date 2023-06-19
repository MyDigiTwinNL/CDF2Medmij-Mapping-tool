import {inputValue,inputValues} from '../functionsCatalog';
import moize from 'moize'
import {clinicalStatusSNOMEDCodeList,verificationStatusSNOMEDCodeList,conditionsSNOMEDCodeList} from '../snomedCodeLists';


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
 * 
 * 
 * 
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][3A][3B]
 * hypertension_presence_adu_q_1  [X ][  ][  ][  ][X ][X ] have you ever had hypertension?
 * ------------------------------------------------------------------
 * 
 * 
 * 
 * @pairingrule
 *  if hypertension_presence_adu_q_1 = yes in 1A, 3A or 3B => active. 
 *  else
 *      an 'empty' result is returned, as there is no such a thing as 'inactive' hypertension.
 * 
 */
export const clinicalStatus = ():object => { 
    return _clinicalStatus(inputValues('hypertension_presence_adu_q_1'));
}


/**
 * Memoized function for clinicalStatus
 */
const _clinicalStatus = moize((hypertension_presence_assessments:object):object => {        
    if (Object.values(hypertension_presence_assessments).some((wavereading) => wavereading === "1")){
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
 * hypertension_startage_adu_q_1  [X ][  ][  ][  ][X ][X ] how old were you when hypertension was first diagnosed?
 * hypertension_presence_adu_q_1  [X ][  ][  ][  ][X ][X ] have you ever had hypertension? 
 * DATE                           [X ][X ][X ][X ][X ][X ]
 * AGE                            [X ]
 * ------------------------------------------------------------------
 * 
 * @precondition
 *      - no missing values
 *      - the problem is 'active' (see clinicalStatus function)
 * 
 * @pairingrule
 *   the year when the participand had the age reported in hypertension_startage_adu_q_1, in the first assessment
 *     (1A, 3A, or 3B) where hypertension_presence_adu_q_1 == yes
 */
export const onsetDateTime = ():string => {
    //find the first occurence of hypertension_presence_adu_q_1=yes
    const hypPresence = Object.entries(inputValues("hypertension_presence_adu_q_1")).find(([key,value]) => value === "1")
    const hypPresenceAssessment:string = hypPresence?hypPresence[0]:"";
    const surveyDateParts = inputValue("DATE","1A").split("/");
    const surveyAge = Number(inputValue("AGE","1A"));      
    const surveyYear = Number(surveyDateParts[1]);
    const hypStartAge = Number(inputValue('hypertension_startage_adu_q_1',hypPresenceAssessment))
    return (surveyYear - surveyAge + hypStartAge).toString()
};

/**
 * 
 */
export const verificationStatus = ():object => { 
    return verificationStatusSNOMEDCodeList.unknwon
}


export const code = ():object => (
    conditionsSNOMEDCodeList.diabetes_mellitus
)

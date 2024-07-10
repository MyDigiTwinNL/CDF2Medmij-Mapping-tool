import {CodeProperties} from '../codes/codesCollection'

export interface Condition {
    
    conditionName():string;
    
    /**
     * Does the condition exist?
     * Defines whether the output of the mapping should be included in the participant's bundle.
    **/
    isPresent():boolean
    
    /**
     * The problem status describes the condition of the problem: Active problems are problems of which the patient experiences 
     * symptoms or for which evidence exists. Problems with the status 'Inactive' refer to problems that don't affect the patient 
     * anymore or that of which there is no evidence of existence anymore.
     */
    clinicalStatus():CodeProperties | undefined

    /**
     * Start of the disorder to which the problem applies. Especially in symptoms in which it takes 
     * longer for the final diagnosis, it is important to know not only the date of the diagnosis, 
     * but also how long the patient has had the disorder. A ‘vague’ date, such as only the year or 
     * the month and the year, is permitted.       
     */
    onsetDateTime():string | undefined

    /**
     * The verification status to support or decline the clinical status of the condition or diagnosis.
     */
    verificationStatus():CodeProperties


    /**
     * Code of the condition
     */
    code(): CodeProperties



}


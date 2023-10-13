import {ResearchSubjectAndStudy, StudyStatus} from '../fhir-resource-interfaces/researchSubjectAndStudy'
import { assertIsDefined } from '../unexpectedInputException'
import { lifelinesDateToISO } from '../lifelinesFunctions'
import { inputValue, inputValues, variableAssessments } from '../functionsCatalog'

/**
 *                       [global][1a][1b][1c][2a][3a][3b]
 *  "date_of_inclusion": [     X]
 *  "date":              [      ][ x][ x][ x][ x][ x][ x]
 * 
 *  
 * 
 */
export const researchSubjectAndStudy:ResearchSubjectAndStudy = {
    studyName: function (): string {
        return "Lifelines-Netherlands";
    },
    studyStatus: function (): StudyStatus {
        return StudyStatus.COMPLETED;
    },
    dateOfInclusion: function (): string {
        const dateOfInclusion = inputValue('date_of_inclusion','global')
        assertIsDefined(dateOfInclusion,`Date of inclusion is expected to be not null for all participants`)
        return lifelinesDateToISO(dateOfInclusion);
    },
    dateOfLastResponse: function (): string {        
        const assessmentDates:variableAssessments = inputValues('date')
        //Filter the assessment dates without an undefined value as [key,value] tuples
        const effectiveAssessments = Object.entries(assessmentDates).filter(([k,v]) => v!==undefined)
        //Get the last assessment
        const lastEffectiveAssessment = effectiveAssessments.pop()
        assertIsDefined(lastEffectiveAssessment,`It is expected at least one non-null assessment date`);
        //! operator added it is not possible for the tuple value to be undefined, given the filtering
        return lifelinesDateToISO(lastEffectiveAssessment[1]!);
           
    }
}
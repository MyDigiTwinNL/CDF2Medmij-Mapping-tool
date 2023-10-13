import {ResearchStudy, StudyStatus} from '../fhir-resource-interfaces/researchStudy'
import {inputValue} from '../functionsCatalog';

/**
 * 
 */
export const researchStudy:ResearchStudy = {
    studyName: function (): string {
        return "Lifelines-Netherlands"
    },
    studyStatus: function (): StudyStatus {
        return StudyStatus.COMPLETED
    }
}
/**
 * Based on https://build.fhir.org/researchsubject.html and 
 * 
 * https://hl7.org/fhir/STU3/researchstudy.html
 */

export enum StudyStatus {
    DRAFT = "draft",
    IN_PROGRESS = "in-progress",
    SUSPENDED = "suspended",
    STOPPED = "stopped",
    COMPLETED = "completed",
    ENTERED_IN_ERROR = "entered-in-error"
}

export interface ResearchSubjectAndStudy {
    dateOfInclusion():string,
    dateOfLastResponse():string
    studyName():string,
    studyStatus():StudyStatus
}

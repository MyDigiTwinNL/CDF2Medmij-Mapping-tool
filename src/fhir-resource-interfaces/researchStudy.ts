/**
 * Based on https://hl7.org/fhir/STU3/researchstudy.html#ResearchStudy
 */

export enum StudyStatus {
    DRAFT = "draft",
    IN_PROGRESS = "in-progress",
    SUSPENDED = "suspended",
    STOPPED = "stopped",
    COMPLETED = "completed",
    ENTERED_IN_ERROR = "entered-in-error"
}

export interface ResearchStudy {
    studyName():string,
    studyStatus():StudyStatus
}


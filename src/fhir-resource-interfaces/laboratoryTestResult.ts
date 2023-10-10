import {CodeProperties} from '../codes/codesCollection'


export interface LaboratoryTestResult {
    referenceRangeUpperLimit(): number|undefined;
    referenceRangeLowerLimit(): number|undefined;
    diagnosticCategoryCoding(): CodeProperties[];
    diagnosticCodeCoding(): CodeProperties[];
    diagnosticCodeText():string;    
    observationCategoryCoding():object[];
    observationCodeCoding():CodeProperties[];
    results(): TestResultEntry[];
}

export type TestResultEntry= {
    assessment: string;
    isAboveReferenceRange: boolean | undefined;
    isBelowReferenceRange: boolean | undefined;
    resultFlags: object | undefined;
    testResults: number | undefined;
    collectedDateTime: string | undefined;
  };


import {CodeProperties} from '../codes/codesCollection'


export interface LaboratoryTestResult {
    referenceRangeUpperLimit(): number|undefined;
    referenceRangeLowerLimit(): number|undefined;
    diagnosticCategoryCoding(): CodeProperties[];
    diagnosticCodeCoding(): CodeProperties[];
    diagnosticCodeText():string;    
    observationCategoryCoding():object[];
    observationCodeCoding():CodeProperties[];
    resultUnit(): CodeProperties;
    results(): TestResultEntry[];
}

export type TestResultEntry= {
    assessment: string;
    isAboveReferenceRange: boolean | undefined;
    isBelowReferenceRange: boolean | undefined;
    resultFlags: CodeProperties | undefined;
    testResult: number | undefined;
    collectedDateTime: string | undefined;
  };


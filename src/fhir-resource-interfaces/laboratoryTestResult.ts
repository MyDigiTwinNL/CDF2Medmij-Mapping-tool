import {CodeProperties} from '../codes/codesCollection'


export interface LaboratoryTestResult {
    labTestName():string;
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
    resultFlags: CodeProperties | undefined;
    testResult: number | undefined;
    collectedDateTime: string | undefined;
  };


import { InputSingleton } from '../inputSingleton';
import * as hdlcholesterolmf from '../lifelines/HDLCholesterol'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'
import { transformVariables } from '../functionsCatalog';
import {TestResultEntry} from '../fhir-resource-interfaces/laboratoryTestResult'



test('HDL Cholesterol reports, below reference lower limit', () => {
  
  const input = {

    "hdlchol_result_all_m_1":       {"1a":""+(hdlcholesterolmf.hdlCholesterol.referenceRangeLowerLimit()!-0.1),"2a":""+(hdlcholesterolmf.hdlCholesterol.referenceRangeLowerLimit()!-0.5)},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
  }  

  InputSingleton.getInstance().setInput(input);
  const results = hdlcholesterolmf.hdlCholesterol.results()
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).isBelowReferenceRange).toBe(true)
  expect((results[0] as TestResultEntry).resultFlags?.display).toBe("Below reference range");
  expect((results[1] as TestResultEntry).isBelowReferenceRange).toBe(true)
  expect((results[1] as TestResultEntry).resultFlags?.display).toBe("Below reference range");
  

});


test('HDL Cholesterol reports, mix of normal and above reference ranges', () => {
  
  const input = {

    "hdlchol_result_all_m_1":       {"1a":""+(hdlcholesterolmf.hdlCholesterol.referenceRangeLowerLimit()!+0.1),"2a":""+(hdlcholesterolmf.hdlCholesterol.referenceRangeLowerLimit()!-0.1)},
    "date": { "1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"}
  }  

  InputSingleton.getInstance().setInput(input);
  const results = hdlcholesterolmf.hdlCholesterol.results()
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).isBelowReferenceRange).toBe(false)
  expect((results[0] as TestResultEntry).resultFlags).toStrictEqual(undefined);
  expect((results[1] as TestResultEntry).isBelowReferenceRange).toBe(true)
  expect((results[1] as TestResultEntry).resultFlags?.display).toBe("Below reference range");
  

});


test('HDL cholesterol reports, within normal levels', () => {
  
  const input:transformVariables = {

    "hdlchol_result_all_m_1":{"1a":""+(hdlcholesterolmf.hdlCholesterol.referenceRangeLowerLimit()!+0.1),"2a":""+(hdlcholesterolmf.hdlCholesterol.referenceRangeLowerLimit()!+0.5)},
    "date": { "1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"}
  }  

  InputSingleton.getInstance().setInput(input);
  const results = hdlcholesterolmf.hdlCholesterol.results()
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).isBelowReferenceRange).toBe(false)
  expect((results[0] as TestResultEntry).resultFlags).toStrictEqual(undefined)
  expect((results[1] as TestResultEntry).isBelowReferenceRange).toBe(false)
  expect((results[1] as TestResultEntry).resultFlags).toStrictEqual(undefined)
    

});


/**
 * This tests only checks the module and its related templates work together, with no errors.
 * FHIR-specific validations are expected to be done using the HL7 tools
 */

test('HDLCholesterol resource generation ()', () => {

  
  const input = {
    "hdlchol_result_all_m_1":       {"1a":""+(hdlcholesterolmf.hdlCholesterol.referenceRangeLowerLimit()!+0.1),"2a":""+(hdlcholesterolmf.hdlCholesterol.referenceRangeLowerLimit()!-0.1)},
    "date": { "1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
    "project_pseudo_id": { "1a": "520681571" },
  }

  let targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/generic/LabTestResult_Diagnostic_Report.jsonata', "module": './lifelines/HDLCholesterol'},
  ]
  
  processInput(input,targets).then((output:object[]) => {    
    expect(output.length).toBe(2);    
  })

 
  targets = [
    { "template": './zib-2017-mappings/generic/LabTestResult_Observation.jsonata', "module": './lifelines/HDLCholesterol'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })

  targets = [
    { "template": './zib-2017-mappings/generic/LabTestResult_Specimen.jsonata', "module": './lifelines/HDLCholesterol'}
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })


})

      
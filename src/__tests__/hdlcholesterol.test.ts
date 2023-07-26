import { InputSingleton } from '../inputSingleton';
import * as hdlcholesterolmf from '../lifelines/HDLCholesterol'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'

type HDLCholesterolProperties = {
  "assessment":string,
  "isHDLBelowReferenceRange":boolean,
  "resultFlags": object,
  "hdlResults": number,
  "collectedDateTime": string
}


test('HDL Cholesterol reports, below reference lower limit', () => {
  
  const input = {

    "hdlchol_result_all_m_1":       {"1a":(hdlcholesterolmf.referenceRangeLowerLimit()-0.1),"2a":(hdlcholesterolmf.referenceRangeLowerLimit()-0.5)},
    "date": { "1a": "5/1992", "1b": "5/1995", "1C": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = hdlcholesterolmf.results()
  expect(results.length).toBe(2);  
  expect((results[0] as HDLCholesterolProperties).isHDLBelowReferenceRange).toBe(true)
  expect((results[0] as HDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.below_reference_range);
  expect((results[1] as HDLCholesterolProperties).isHDLBelowReferenceRange).toBe(true)
  expect((results[1] as HDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.below_reference_range);
  

});


test('HDL Cholesterol reports, mix of normal and above reference ranges', () => {
  
  const input = {

    "hdlchol_result_all_m_1":       {"1a":(hdlcholesterolmf.referenceRangeLowerLimit()+0.1),"2a":(hdlcholesterolmf.referenceRangeLowerLimit()-0.1)},
    "date": { "1a": "5/1992", "1b": "5/1995", "1C": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = hdlcholesterolmf.results()
  expect(results.length).toBe(2);  
  expect((results[0] as HDLCholesterolProperties).isHDLBelowReferenceRange).toBe(false)
  expect((results[0] as HDLCholesterolProperties).resultFlags).toStrictEqual({});
  expect((results[1] as HDLCholesterolProperties).isHDLBelowReferenceRange).toBe(true)
  expect((results[1] as HDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.below_reference_range);
  

});


test('HDL cholesterol reports, within normal levels', () => {
  
  const input = {

    "hdlchol_result_all_m_1":       {"1a":(hdlcholesterolmf.referenceRangeLowerLimit()+0.1),"2a":(hdlcholesterolmf.referenceRangeLowerLimit()+0.5)},
    "date": { "1a": "5/1992", "1b": "5/1995", "1C": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = hdlcholesterolmf.results()
  expect(results.length).toBe(2);  
  expect((results[0] as HDLCholesterolProperties).isHDLBelowReferenceRange).toBe(false)
  expect((results[0] as HDLCholesterolProperties).resultFlags).toStrictEqual({})
  expect((results[1] as HDLCholesterolProperties).isHDLBelowReferenceRange).toBe(false)
  expect((results[1] as HDLCholesterolProperties).resultFlags).toStrictEqual({})
    

});


/**
 * This tests only checks the module and its related templates work together, with no errors.
 * FHIR-specific validations are expected to be done using the HL7 tools
 */
test('HDLCholesterol resource generation ()', () => {

  
  const input = {
    "hdlchol_result_all_m_1":       {"1a":(hdlcholesterolmf.referenceRangeLowerLimit()+0.1),"2a":(hdlcholesterolmf.referenceRangeLowerLimit()-0.1)},
    "date": { "1a": "5/1992", "1b": "5/1995", "1C": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
    "age": { "1a": "22" },
    "project_pseudo_id": { "1a": "520681571" },
  }

  let targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/HDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/HDLCholesterol'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })

  targets = [
    { "template": './zib-2017-mappings/HDLCholesterol_Observation.jsonata', "module": './lifelines/HDLCholesterol'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })

  targets = [
    { "template": './zib-2017-mappings/HDLCholesterol_Specimen.jsonata', "module": './lifelines/HDLCholesterol'}
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })


})

      
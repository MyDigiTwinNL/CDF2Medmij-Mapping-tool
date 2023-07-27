import { InputSingleton } from '../inputSingleton';
import * as cholesterolmf from '../lifelines/LDLCholesterol'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'

type LDLCholesterolProperties = {
  "assessment":string,
  "isLDLAboveReferenceRange":boolean,
  "resultFlags": object,
  "ldlResults": number,
  "collectedDateTime": string
}


test('Cholesterol reports, above reference range', () => {
  
  const input = {

    "ldlchol_result_all_m_1":  {"1a":(cholesterolmf.referenceRangeUpperLimit()+0.1).toString(),"2a":(cholesterolmf.referenceRangeUpperLimit()+0.1).toString()},
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = cholesterolmf.results()
  expect(results.length).toBe(2);  
  expect((results[0] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(true)
  expect((results[0] as LDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  expect((results[1] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(true)
  expect((results[1] as LDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  

});


test('Cholesterol reports, mix of normal and above reference ranges', () => {
  
  const input = {

    "ldlchol_result_all_m_1":  {"1a":(cholesterolmf.referenceRangeUpperLimit()-0.1).toString(),"2a":(cholesterolmf.referenceRangeUpperLimit()+0.1).toString()},
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = cholesterolmf.results()
  expect(results.length).toBe(2);  
  expect((results[0] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(false)
  expect((results[0] as LDLCholesterolProperties).resultFlags).toStrictEqual({});
  expect((results[1] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(true)
  expect((results[1] as LDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  

});


test('Cholesterol reports, within normal levels', () => {
  
  const input = {

    "ldlchol_result_all_m_1":  {"1a":(cholesterolmf.referenceRangeUpperLimit()-1).toString(),"2a":(cholesterolmf.referenceRangeUpperLimit()-0.1).toString()},
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = cholesterolmf.results()
  expect(results.length).toBe(2);
  expect((results[0] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(false)
  expect((results[0] as LDLCholesterolProperties).resultFlags).toStrictEqual({});
  expect((results[1] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(false)
  expect((results[1] as LDLCholesterolProperties).resultFlags).toStrictEqual({});
  

});



test('LDLCholesteron resource generation', () => {

  
  const input = {
    "ldlchol_result_all_m_1":  {"1a":(cholesterolmf.referenceRangeUpperLimit()-1).toString(),"2a":(cholesterolmf.referenceRangeUpperLimit()-0.1).toString()},
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
    "age": { "1a": "22" },
    "project_pseudo_id": { "1a": "520681571" },
  }

  let targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/LDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/LDLCholesterol'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })

  targets = [
    { "template": './zib-2017-mappings/LDLCholesterol_Observation.jsonata', "module": './lifelines/LDLCholesterol'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })

  targets = [
    { "template": './zib-2017-mappings/LDLCholesterol_Specimen.jsonata', "module": './lifelines/LDLCholesterol'}
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })


})

      
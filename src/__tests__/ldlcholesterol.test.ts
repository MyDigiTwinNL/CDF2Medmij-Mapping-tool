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
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
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
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
  }  

  InputSingleton.getInstance().setInput(input);
  const results = cholesterolmf.results()
  expect(results.length).toBe(2);  
  expect((results[0] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(false)
  expect((results[0] as LDLCholesterolProperties).resultFlags).toStrictEqual(undefined);
  expect((results[1] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(true)
  expect((results[1] as LDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  

});


test('Cholesterol reports, within normal levels', () => {
  
  const input = {

    "ldlchol_result_all_m_1":  {"1a":(cholesterolmf.referenceRangeUpperLimit()-1).toString(),"2a":(cholesterolmf.referenceRangeUpperLimit()-0.1).toString()},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
  }  

  InputSingleton.getInstance().setInput(input);
  const results = cholesterolmf.results()
  expect(results.length).toBe(2);
  expect((results[0] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(false)
  expect((results[0] as LDLCholesterolProperties).resultFlags).toStrictEqual(undefined);
  expect((results[1] as LDLCholesterolProperties).isLDLAboveReferenceRange).toBe(false)
  expect((results[1] as LDLCholesterolProperties).resultFlags).toStrictEqual(undefined);
  

});



test('LDLCholesteron resource generation', () => {

  
  const input = {
    "ldlchol_result_all_m_1":  {"1a":(cholesterolmf.referenceRangeUpperLimit()-1).toString(),"2a":(cholesterolmf.referenceRangeUpperLimit()-0.1).toString()},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
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

      
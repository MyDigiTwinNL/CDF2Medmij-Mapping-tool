import { InputSingleton } from '../inputSingleton';
import * as totalCholesterolFunctions from '../lifelines/TotalCholesterol'
import {TotalCholesterolReadingEntry} from '../lifelines/TotalCholesterol'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'


test('Cholesterol reports, above reference range', () => {
  
  const input = {

    "cholesterol_result_all_m_1":  {"1a":(totalCholesterolFunctions.referenceRangeUpperLimit()+0.1).toString(),"2a":(totalCholesterolFunctions.referenceRangeUpperLimit()+0.1).toString()},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
  }  

  InputSingleton.getInstance().setInput(input);
  const results = totalCholesterolFunctions.results()
  expect(results.length).toBe(2);  
  expect((results[0] as TotalCholesterolReadingEntry).isTotalCholAboveReferenceRange).toBe(true)
  expect((results[0] as TotalCholesterolReadingEntry).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  expect((results[1] as TotalCholesterolReadingEntry).isTotalCholAboveReferenceRange).toBe(true)
  expect((results[1] as TotalCholesterolReadingEntry).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  

});


test('Cholesterol reports, mix of normal and above reference ranges', () => {
  
  const input = {

    "cholesterol_result_all_m_1":  {"1a":(totalCholesterolFunctions.referenceRangeUpperLimit()-0.1).toString(),"2a":(totalCholesterolFunctions.referenceRangeUpperLimit()+0.1).toString()},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
  }  

  InputSingleton.getInstance().setInput(input);
  const results = totalCholesterolFunctions.results()
  expect(results.length).toBe(2);  
  expect((results[0] as TotalCholesterolReadingEntry).isTotalCholAboveReferenceRange).toBe(false)
  expect((results[0] as TotalCholesterolReadingEntry).resultFlags).toStrictEqual(undefined);
  expect((results[1] as TotalCholesterolReadingEntry).isTotalCholAboveReferenceRange).toBe(true)
  expect((results[1] as TotalCholesterolReadingEntry).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  

});


test('Cholesterol reports, within normal levels', () => {
  
  const input = {

    "cholesterol_result_all_m_1":  {"1a":(totalCholesterolFunctions.referenceRangeUpperLimit()-1).toString(),"2a":(totalCholesterolFunctions.referenceRangeUpperLimit()-0.1).toString()},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
  }  

  InputSingleton.getInstance().setInput(input);
  const results = totalCholesterolFunctions.results()
  expect(results.length).toBe(2);
  expect((results[0] as TotalCholesterolReadingEntry).isTotalCholAboveReferenceRange).toBe(false)
  expect((results[0] as TotalCholesterolReadingEntry).resultFlags).toStrictEqual(undefined);
  expect((results[1] as TotalCholesterolReadingEntry).isTotalCholAboveReferenceRange).toBe(false)
  expect((results[1] as TotalCholesterolReadingEntry).resultFlags).toStrictEqual(undefined);
  

});



test('Total Cholesterol resource generation', () => {

  
  const input = {
    "cholesterol_result_all_m_1":  {"1a":(totalCholesterolFunctions.referenceRangeUpperLimit()-1).toString(),"2a":(totalCholesterolFunctions.referenceRangeUpperLimit()-0.1).toString()},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
    "project_pseudo_id": { "1a": "520681571" },
  }

  let targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/TotalCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/TotalCholesterol'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })

  targets = [
    { "template": './zib-2017-mappings/TotalCholesterol_Observation.jsonata', "module": './lifelines/TotalCholesterol'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })

  targets = [
    { "template": './zib-2017-mappings/TotalCholesterol_Specimen.jsonata', "module": './lifelines/TotalCholesterol'}
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })


})
      


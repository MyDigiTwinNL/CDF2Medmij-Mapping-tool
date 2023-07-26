import { InputSingleton } from '../inputSingleton';
import * as cholesterolmf from '../lifelines/TotalCholesterol'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'

type LDLCholesterolProperties = {
  "assessment":string,
  "isTotalCholAboveReferenceRange":boolean,
  "resultFlags": object,
  "totalCholResults": number,
  "collectedDateTime": string
}


test('Cholesterol reports, above reference range', () => {
  
  const input = {

    "cholesterol_result_all_m_1":  {"1A":(cholesterolmf.referenceRangeUpperLimit()+0.1).toString(),"2A":(cholesterolmf.referenceRangeUpperLimit()+0.1).toString()},
    "date": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = cholesterolmf.results()
  expect(results.length).toBe(2);  
  expect((results[0] as LDLCholesterolProperties).isTotalCholAboveReferenceRange).toBe(true)
  expect((results[0] as LDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  expect((results[1] as LDLCholesterolProperties).isTotalCholAboveReferenceRange).toBe(true)
  expect((results[1] as LDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  

});


test('Cholesterol reports, mix of normal and above reference ranges', () => {
  
  const input = {

    "cholesterol_result_all_m_1":  {"1A":(cholesterolmf.referenceRangeUpperLimit()-0.1).toString(),"2A":(cholesterolmf.referenceRangeUpperLimit()+0.1).toString()},
    "date": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = cholesterolmf.results()
  expect(results.length).toBe(2);  
  expect((results[0] as LDLCholesterolProperties).isTotalCholAboveReferenceRange).toBe(false)
  expect((results[0] as LDLCholesterolProperties).resultFlags).toStrictEqual({});
  expect((results[1] as LDLCholesterolProperties).isTotalCholAboveReferenceRange).toBe(true)
  expect((results[1] as LDLCholesterolProperties).resultFlags).toBe(testResultFlagsSNOMEDCodelist.above_reference_range);
  

});


test('Cholesterol reports, within normal levels', () => {
  
  const input = {

    "cholesterol_result_all_m_1":  {"1A":(cholesterolmf.referenceRangeUpperLimit()-1).toString(),"2A":(cholesterolmf.referenceRangeUpperLimit()-0.1).toString()},
    "date": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = cholesterolmf.results()
  expect(results.length).toBe(2);
  expect((results[0] as LDLCholesterolProperties).isTotalCholAboveReferenceRange).toBe(false)
  expect((results[0] as LDLCholesterolProperties).resultFlags).toStrictEqual({});
  expect((results[1] as LDLCholesterolProperties).isTotalCholAboveReferenceRange).toBe(false)
  expect((results[1] as LDLCholesterolProperties).resultFlags).toStrictEqual({});
  

});



test('Total Cholesterol resource generation', () => {

  
  const input = {
    "cholesterol_result_all_m_1":  {"1A":(cholesterolmf.referenceRangeUpperLimit()-1).toString(),"2A":(cholesterolmf.referenceRangeUpperLimit()-0.1).toString()},
    "date": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
    "age": { "1A": "22" },
    "project_pseudo_id": { "1A": "520681571" },
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

      
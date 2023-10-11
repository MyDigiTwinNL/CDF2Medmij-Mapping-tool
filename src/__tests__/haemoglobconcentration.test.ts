import { InputSingleton } from '../inputSingleton';
import {haemoglobinConcentration} from '../lifelines/HaemoglobinConcentration'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'
import { transformVariables } from '../functionsCatalog';
import {TestResultEntry} from '../fhir-resource-interfaces/laboratoryTestResult'



test('Haemoglobine conceptration for male participant, above limit', () => {

  const input = {
   
    "hemoglobin_result_all_m_1" :{ "1a": "11.1", "2a":"12"},//in mmol/L
    "gender" : { "1a":"male"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  
  InputSingleton.getInstance().setInput(input);
  const results = haemoglobinConcentration.results();
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).testResult).toBe(11.1)
  expect((results[0] as TestResultEntry).resultFlags?.display).toBe("Above reference range")
  expect((results[1] as TestResultEntry).testResult).toBe(12)  
  expect((results[1] as TestResultEntry).resultFlags?.display).toBe("Above reference range")

  

});

test('Haemoglobine conceptration for male participant, below reference range', () => {

  const input = {
   
    "hemoglobin_result_all_m_1" :{ "1a": "8", "2a":"8.4"},//in mmol/L
    "gender" : { "1a":"male"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  
  InputSingleton.getInstance().setInput(input);
  const results = haemoglobinConcentration.results();
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).testResult).toBe(8)
  expect((results[0] as TestResultEntry).resultFlags?.display).toBe("Below reference range")
  expect((results[1] as TestResultEntry).testResult).toBe(8.4)  
  expect((results[1] as TestResultEntry).resultFlags?.display).toBe("Below reference range")

  

});

test('Haemoglobine conceptration for male participant, within the reference range (border cases)', () => {

  const input = {
   
    "hemoglobin_result_all_m_1" :{ "1a": "11", "2a":"8.5"},//in mmol/L
    "gender" : { "1a":"male"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  
  InputSingleton.getInstance().setInput(input);
  const results = haemoglobinConcentration.results();
  expect(results.length).toBe(2);  
  
  expect((results[0] as TestResultEntry).resultFlags).toBe(undefined)
  expect((results[1] as TestResultEntry).resultFlags).toBe(undefined)

  

});

test('Haemoglobine conceptration for male participant, within the reference range ', () => {

  const input = {
   
    "hemoglobin_result_all_m_1" :{ "1a": "10", "2a":"9"},//in mmol/L
    "gender" : { "1a":"male"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  
  InputSingleton.getInstance().setInput(input);
  const results = haemoglobinConcentration.results();
  expect(results.length).toBe(2);  
  
  expect((results[0] as TestResultEntry).resultFlags).toBe(undefined)
  expect((results[1] as TestResultEntry).resultFlags).toBe(undefined)

  

});
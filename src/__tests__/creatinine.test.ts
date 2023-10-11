import { InputSingleton } from '../inputSingleton';
import {creatinine} from '../lifelines/Creatinine'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'
import { transformVariables } from '../functionsCatalog';
import {TestResultEntry} from '../fhir-resource-interfaces/laboratoryTestResult'



test('Creatinine conceptration for male participant, above limit', () => {

  const input = {
   
    "creatinine_result_all_m_1" :{ "1a": "111", "2a":"120"},//in mmol/L
    "gender" : { "1a":"MALE"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  
  InputSingleton.getInstance().setInput(input);
  const results = creatinine.results();
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).testResult).toBe(111)
  expect((results[0] as TestResultEntry).resultFlags?.display).toBe("Above reference range")
  expect((results[1] as TestResultEntry).testResult).toBe(120)  
  expect((results[1] as TestResultEntry).resultFlags?.display).toBe("Above reference range")

  

});

test('Creatinine conceptration for male participant, below reference range', () => {

  const input = {
   
    "creatinine_result_all_m_1" :{ "1a": "49", "2a":"48"},//in mmol/L
    "gender" : { "1a":"MALE"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  
  InputSingleton.getInstance().setInput(input);
  const results = creatinine.results();
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).testResult).toBe(49)
  expect((results[0] as TestResultEntry).resultFlags?.display).toBe("Below reference range")
  expect((results[1] as TestResultEntry).testResult).toBe(48)  
  expect((results[1] as TestResultEntry).resultFlags?.display).toBe("Below reference range")

  

});

test('Creatinine conceptration for male participant, within the reference range (border cases)', () => {

  const input = {
   
    "creatinine_result_all_m_1" :{ "1a": "110", "2a":"50"},//in mmol/L
    "gender" : { "1a":"MALE"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  
  InputSingleton.getInstance().setInput(input);
  const results = creatinine.results();
  expect(results.length).toBe(2);  
  
  expect((results[0] as TestResultEntry).resultFlags).toBe(undefined)
  expect((results[1] as TestResultEntry).resultFlags).toBe(undefined)

  

});

test('Creatinine conceptration for male participant, within the reference range ', () => {

  const input = {
   
    "creatinine_result_all_m_1" :{ "1a": "100", "2a":"60"},//in mmol/L
    "gender" : { "1a":"MALE"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  
  InputSingleton.getInstance().setInput(input);
  const results = creatinine.results();
  expect(results.length).toBe(2);  
  
  expect((results[0] as TestResultEntry).resultFlags).toBe(undefined)
  expect((results[1] as TestResultEntry).resultFlags).toBe(undefined)

  

});
import { InputSingleton } from '../inputSingleton';
import {hbA1c} from '../lifelines/HbA1c'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'
import { transformVariables } from '../functionsCatalog';
import {TestResultEntry} from '../fhir-resource-interfaces/laboratoryTestResult'



test('HBA1C above upper limit', () => {  
  const input = {
    "hba1cconc_result_all_m_1":{ "1a": "43", "2a":"44"},
    "gender" : { "1a":"male"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = hbA1c.results();
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).testResult).toBe(43)
  expect((results[0] as TestResultEntry).resultFlags?.display).toBe("Above reference range")
  expect((results[1] as TestResultEntry).testResult).toBe(44)
  expect((results[1] as TestResultEntry).resultFlags?.display).toBe("Above reference range")

  

});




test('HBA1C below upper limit', () => {  
  const input = {
    "hba1cconc_result_all_m_1":{ "1a": "12", "2a":"20"},
    "gender" : { "1a":"male"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = hbA1c.results();
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).testResult).toBe(12)
  expect((results[0] as TestResultEntry).resultFlags).toBe(undefined)
  expect((results[1] as TestResultEntry).testResult).toBe(20)
  expect((results[1] as TestResultEntry).resultFlags).toBe(undefined)

  

});

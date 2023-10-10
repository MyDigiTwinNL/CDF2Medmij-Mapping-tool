import { InputSingleton } from '../inputSingleton';
import {eGFRS} from '../lifelines/eGFR'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'
import { transformVariables } from '../functionsCatalog';
import {TestResultEntry} from '../fhir-resource-interfaces/laboratoryTestResult'

//test cases based on https://www.mdcalc.com/calc/3939/ckd-epi-equations-glomerular-filtration-rate-gfr
//for 2009 CKD-EPI Creatinine (using as an input the creatinine converted from mmol/dl -Lifelines- to mg/dl)


test('eGFRS for male, black participant', () => {

  const input = {
   
    "creatinine_result_all_m_1":{ "1a": "79.2", "2a":"106.1"},//in umol/L
    "ethnicity_category_adu_q_1":{"1b":"3"},
    "gender" : { "1a":"male"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = eGFRS.results();
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).testResult).toBeCloseTo(124,0)
  expect((results[0] as TestResultEntry).resultFlags).toBe(undefined)
  expect((results[1] as TestResultEntry).testResult).toBeCloseTo(81,0)  
  expect((results[1] as TestResultEntry).resultFlags).toBe(undefined)

  

});


test('eGFRS for female, non-black participant', () => {

    const input = {
     
      "creatinine_result_all_m_1":{ "1a": "79.2", "2a":"106.1"},//in umol/L
      "ethnicity_category_adu_q_1":{"1b":"1"},
      "gender" : { "1a":"female"},
      "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
      "age": { "1a": "40" },  //age on "2a": 50  
      "project_pseudo_id": { "1a": "520681571" },
      
    }  
  
    InputSingleton.getInstance().setInput(input);
    const results = eGFRS.results();
    expect(results.length).toBe(2);  
    expect((results[0] as TestResultEntry).testResult).toBeCloseTo(80,0)
    expect((results[0] as TestResultEntry).resultFlags).toBe(undefined)
    expect((results[1] as TestResultEntry).testResult).toBeCloseTo(53,0)  
    expect((results[1] as TestResultEntry).resultFlags?.display).toBe("Below reference range")      
    
    

  });

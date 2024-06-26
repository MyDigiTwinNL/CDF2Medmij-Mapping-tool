import { InputSingleton } from '../inputSingleton';
import * as diabetesmf from '../lifelines/Diabetes'
import { clinicalStatusSNOMEDCodeList, conditionsSNOMEDCodeList, verificationStatusSNOMEDCodeList } from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'
import {UnexpectedInputException} from '../unexpectedInputException'

test('diabetes clinical status, when reported positive in 1A, diabetes type 2', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "1" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "2", "3b": "2" },
    "diabetes_startage_adu_q_1": { "1a": "12" },
    "diabetes_type_adu_q_1":     { "1a": "2" },
    "diabetes_type_adu_q_1_a":   { "1a": "" },
    "t1d_followup_adu_q_1":                            { "2a": "2", "3a": "2", "3b": "2" },
    "t2d_followup_adu_q_1":                            { "2a": "2", "3a": "2", "3b": "2" },    
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
  expect(diabetesmf.code()).toBe(conditionsSNOMEDCodeList.diabetes_mellitus_type_2);
  expect(diabetesmf.onsetDateTime()).toBe("1982");
  

});


test('diabetes clinical status, when reported positive in a follow-up, diabetes type 1', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "1", "3b": "2" },
    "diabetes_startage_adu_q_1": { "1a": "" },
    "diabetes_type_adu_q_1":     { "1a": "2" },
    "diabetes_type_adu_q_1_a":   { "1a": "" },
    "t1d_followup_adu_q_1":                            { "2a": "2", "3a": /*Positive*/"1", "3b": "2" },
    "t2d_followup_adu_q_1":                            { "2a": "2", "3a": "2", "3b": "2" },    
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5",/*date1*/"2a":"2001-5",/*date2*/"3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
  expect(diabetesmf.code()).toBe(conditionsSNOMEDCodeList.diabetes_mellitus_type_1);
  expect(diabetesmf.onsetDateTime()).toBe("2002-05");
  

});



test('diabetes clinical status, when reported positive in a follow-up after multiple skipped assessments, diabetes type 1', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "", "3b": "1" },
    "diabetes_startage_adu_q_1": { "1a": "" },
    "diabetes_type_adu_q_1":     { "1a": "2" },
    "diabetes_type_adu_q_1_a":   { "1a": "" },
    "t1d_followup_adu_q_1":                            { "2a": "2", "3a": "", /*Positive*/"3b": "1" },
    "t2d_followup_adu_q_1":                            { "2a": "2", "3a": "", "3b": "2" },    
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5",/*date1*/"2a":"2001-5","3a":"",/*date2*/"3b":"2005-5"},
    "age": { "1a": "22" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
  expect(diabetesmf.code()).toBe(conditionsSNOMEDCodeList.diabetes_mellitus_type_1);
  expect(diabetesmf.onsetDateTime()).toBe("2003-05");
  
});

test('diabetes clinical status, with inconsistencies, missing date on the assessment where diabetes is reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "", "3b": "1" },
    "diabetes_startage_adu_q_1": { "1a": "" },
    "diabetes_type_adu_q_1":     { "1a": "2" },
    "diabetes_type_adu_q_1_a":   { "1a": "" },
    "t1d_followup_adu_q_1":                            { "2a": "2", "3a": "", /*Positive*/"3b": "1" },
    "t2d_followup_adu_q_1":                            { "2a": "2", "3a": "", "3b": "2" },    
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5",/*date1*/"2a":"2001-5","3a":"",/*date2*/"3b":""},
    "age": { "1a": "22" },
  }

  try{
    InputSingleton.getInstance().setInput(input);
    expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
    expect(diabetesmf.isPresent()).toBe(true);
    expect(diabetesmf.code()).toBe(conditionsSNOMEDCodeList.diabetes_mellitus_type_1);
    expect(diabetesmf.onsetDateTime()).toBe("2003-05");
  }
  catch(error){
    if (!(error instanceof UnexpectedInputException)) fail('Expected exception')
  }
  
  
});



test('diabetes clinical status, when reported after assessment 1A', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "1", "3a": "2", "3b": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
});

test('diabetes clinical status, when never reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "2", "3b": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toStrictEqual({});
  expect(diabetesmf.isPresent()).toBe(false);

});


/**
 * To be implemented when the expected output for this case is defined
 */
/*test('diabetes clinical status, when reported in assessments 1B or 1C, where t1d_followup_adu_q_1 is not available', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "1", "2a": "2", "3a": "2", "3b": "2" },
    "diabetes_startage_adu_q_1": { "1a": "" },
    "diabetes_type_adu_q_1":     { "1a": "2" },
    "diabetes_type_adu_q_1_a":   { "1a": "" },
    "t1d_followup_adu_q_1":                            { "2a": "2", "3a": "2", "3b": "2" },
    "t2d_followup_adu_q_1":                            { "2a": "2", "3a": "2", "3b": "2" },    
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
  //Not yet defined
  //expect(diabetesmf.code()).toBe(conditionsSNOMEDCodeList.diabetes_mellitus_type_1);
  expect(diabetesmf.onsetDateTime()).toBe("1996-05");
  

});*/


test('diabetes clinical status, when reported in assessments 1B or 1C, where t1d_followup_adu_q_1 is not available', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "1", "3a": "2", "3b": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
});

test('diabetes clinical status, when never reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "2", "3b": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toStrictEqual({});
  expect(diabetesmf.isPresent()).toBe(false);

});




test('Diabates resource generation when not reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "2", "3b": "2" },
    "diabetes_startage_adu_q_1": { "1a": "" },
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
    "project_pseudo_id": { "1a": "520681571" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/Diabetes.jsonata', "module": './lifelines/Diabetes' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(0);
  })

});








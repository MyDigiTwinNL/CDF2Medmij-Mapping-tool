import { InputSingleton } from '../inputSingleton';
import {diabetes} from '../lifelines/Diabetes'
import { MappingTarget, processInput } from '../mapper'

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
  expect(diabetes.clinicalStatus()?.display).toBe("Active");
  expect(diabetes.isPresent()).toBe(true);
  expect(diabetes.code().display).toBe("Diabetes mellitus type 2 (disorder)");
  expect(diabetes.onsetDateTime()).toBe("1982");
  

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
  expect(diabetes.clinicalStatus()?.display).toBe("Active");
  expect(diabetes.isPresent()).toBe(true);
  expect(diabetes.code().display).toBe("Diabetes mellitus type 1 (disorder)");
  expect(diabetes.onsetDateTime()).toBe("2002-05");
  

});



test('assertion test: diabetes clinical status, when reported positive in a follow-up, but no diabetes type is defined', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "1", "3b": "2" },
    "diabetes_startage_adu_q_1": { "1a": "" },
    "diabetes_type_adu_q_1":     { "1a": "2" },
    "diabetes_type_adu_q_1_a":   { "1a": "" },
    "t1d_followup_adu_q_1":                            { "2a": "2", "3a": "2", "3b": "2" },
    "t2d_followup_adu_q_1":                            { "2a": "2", "3a": "2", "3b": "2" },    
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5",/*date1*/"2a":"2001-5",/*date2*/"3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
  }


  InputSingleton.getInstance().setInput(input);
  expect(diabetes.clinicalStatus()?.display).toBe("Active");
  expect(diabetes.isPresent()).toBe(true);

  //Since we cannot be sure about the type of diabetes, we assign the parent code for Diabetes Mellitus as a sort of Diabetes, unspecified.
  expect(diabetes.code().display).toBe("Diabetes mellitus (disorder)");
  expect(diabetes.onsetDateTime()).toBe("2002-05");


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
  expect(diabetes.clinicalStatus()?.display).toBe("Active");
  expect(diabetes.isPresent()).toBe(true);
  expect(diabetes.code().display).toBe("Diabetes mellitus type 1 (disorder)");
  expect(diabetes.onsetDateTime()).toBe("2003-05");
  
});

test('diabetes clinical status (T1D) reported on a follow up, with missing date on the assessment where was reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "1", "3b": "2" },
    "diabetes_startage_adu_q_1": { "1a": "" },
    "diabetes_type_adu_q_1":     { "1a": "2" },
    "diabetes_type_adu_q_1_a":   { "1a": "" },
    "t1d_followup_adu_q_1":                            { "2a": "2", "3a": "", /*Positive*/"3b": "1" },
    "t2d_followup_adu_q_1":                            { "2a": "2", "3a": "", "3b": "2" },    
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5",/*date1*/"2a":"2001-5","3a":"",/*date2*/"3b":""},
    "age": { "1a": "22" },
  }

  
  InputSingleton.getInstance().setInput(input);
  expect(diabetes.clinicalStatus()?.display).toBe("Active");
  expect(diabetes.isPresent()).toBe(true);
  expect(diabetes.code().display).toBe("Diabetes mellitus type 1 (disorder)");
  expect(diabetes.onsetDateTime()).toBe(undefined);
  
  
  
});



test('diabetes clinical status, when reported after assessment 1A', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "1", "3a": "2", "3b": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetes.clinicalStatus()?.display).toBe("Active");
  expect(diabetes.isPresent()).toBe(true);
});

test('diabetes clinical status, when never reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "2", "3b": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetes.clinicalStatus()).toStrictEqual(undefined);
  expect(diabetes.isPresent()).toBe(false);

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
  expect(diabetes.clinicalStatus()?.display).toBe("Active");
  expect(diabetes.isPresent()).toBe(true);
});

test('diabetes clinical status, when never reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1a": "2" },
    "diabetes_followup_adu_q_1": { "1b": "2", "1c": "2", "2a": "2", "3a": "2", "3b": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetes.clinicalStatus()).toStrictEqual(undefined);
  expect(diabetes.isPresent()).toBe(false);

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
    { "template": './zib-2017-mappings/generic/Condition.jsonata', "module": './lifelines/Diabetes' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(0);
  })

});








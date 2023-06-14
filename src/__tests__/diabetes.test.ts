import { InputSingleton } from '../inputSingleton';
import * as diabetesmf from '../lifelines/Diabetes'
import { clinicalStatusSNOMEDCodeList, conditionsSNOMEDCodeList, verificationStatusSNOMEDCodeList } from '../snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'


test('diabetes clinical status, when reported positive in 1A, diabetes type 2', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1A": "1" },
    "diabetes_followup_adu_q_1": { "1B": "2", "1C": "2", "2A": "2", "3A": "2", "3B": "2" },
    "diabetes_startage_adu_q_1": { "1A": "12" },
    "diabetes_type_adu_q_1":     { "1A": "2" },
    "diabetes_type_adu_q_1_a":   { "1A": "" },
    "t1d_followup_adu_q_1":                            { "2A": "2", "3A": "2", "3B": "2" },
    "t2d_followup_adu_q_1":                            { "2A": "2", "3A": "2", "3B": "2" },    
    "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997","2A":"5/2001","3A":"5/2003","3B":"5/2005"},
    "AGE": { "1A": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
  expect(diabetesmf.code()).toBe(conditionsSNOMEDCodeList.diabetes_mellitus_type_2);
  expect(diabetesmf.onsetDateTime()).toBe("1982");
  

});


test('diabetes clinical status, when reported positive in a follow-up, diabetes type 1', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1A": "2" },
    "diabetes_followup_adu_q_1": { "1B": "2", "1C": "2", "2A": "2", "3A": "1", "3B": "2" },
    "diabetes_startage_adu_q_1": { "1A": "" },
    "diabetes_type_adu_q_1":     { "1A": "2" },
    "diabetes_type_adu_q_1_a":   { "1A": "" },
    "t1d_followup_adu_q_1":                            { "2A": "2", "3A": /*Positive*/"1", "3B": "2" },
    "t2d_followup_adu_q_1":                            { "2A": "2", "3A": "2", "3B": "2" },    
    "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997",/*date1*/"2A":"5/2001",/*date2*/"3A":"5/2003","3B":"5/2005"},
    "AGE": { "1A": "22" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
  expect(diabetesmf.code()).toBe(conditionsSNOMEDCodeList.diabetes_mellitus_type_1);
  expect(diabetesmf.onsetDateTime()).toBe("2002-05");
  

});


test('diabetes clinical status, when reported after assessment 1A', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1A": "2" },
    "diabetes_followup_adu_q_1": { "1B": "2", "1C": "2", "2A": "1", "3A": "2", "3B": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
});

test('diabetes clinical status, when never reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1A": "2" },
    "diabetes_followup_adu_q_1": { "1B": "2", "1C": "2", "2A": "2", "3A": "2", "3B": "2" },
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
    "diabetes_presence_adu_q_1": { "1A": "2" },
    "diabetes_followup_adu_q_1": { "1B": "2", "1C": "1", "2A": "2", "3A": "2", "3B": "2" },
    "diabetes_startage_adu_q_1": { "1A": "" },
    "diabetes_type_adu_q_1":     { "1A": "2" },
    "diabetes_type_adu_q_1_a":   { "1A": "" },
    "t1d_followup_adu_q_1":                            { "2A": "2", "3A": "2", "3B": "2" },
    "t2d_followup_adu_q_1":                            { "2A": "2", "3A": "2", "3B": "2" },    
    "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997","2A":"5/2001","3A":"5/2003","3B":"5/2005"},
    "AGE": { "1A": "22" },
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
    "diabetes_presence_adu_q_1": { "1A": "2" },
    "diabetes_followup_adu_q_1": { "1B": "2", "1C": "2", "2A": "1", "3A": "2", "3B": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(diabetesmf.isPresent()).toBe(true);
});

test('diabetes clinical status, when never reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1A": "2" },
    "diabetes_followup_adu_q_1": { "1B": "2", "1C": "2", "2A": "2", "3A": "2", "3B": "2" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(diabetesmf.clinicalStatus()).toStrictEqual({});
  expect(diabetesmf.isPresent()).toBe(false);

});




test('Diabates resource generation when not reported', () => {

  const input = {
    "diabetes_presence_adu_q_1": { "1A": "2" },
    "diabetes_followup_adu_q_1": { "1B": "2", "1C": "2", "2A": "2", "3A": "2", "3B": "2" },
    "diabetes_startage_adu_q_1": { "1A": "" },
    "DATE": { "1A": "5/1992" },
    "AGE": { "1A": "22" },
    "PROJECT_PSEUDO_ID": { "1A": "520681571" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/Diabetes.jsonata', "module": './lifelines/Diabetes' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(0);
  })

});








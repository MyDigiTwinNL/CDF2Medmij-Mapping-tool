import { InputSingleton } from '../inputSingleton';
import { cardioVascularDisease } from '../lifelines/CardioVascularDisease'; 
import { MappingTarget, processInput } from '../mapper'
import {getSNOMEDCode} from '../codes/codesCollection'

test('CVD , when none of the related conditions (MI, HF, Stroke) are present', () => {

  const input = {

    "heartfailure_startage_adu_q_1":{ "1a": "" },
    "heartfailure_presence_adu_q_1": { "1a": "2" },
    "heartfailure_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "stroke_startage_adu_q_1":{ "1a": "" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "heartattack_startage_adu_q_1":{ "1a": "" },
    "heartattack_presence_adu_q_1": { "1a": "2" },
    "heartattack_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },

  }

  InputSingleton.getInstance().setInput(input);
  expect(cardioVascularDisease.clinicalStatus()).toStrictEqual(undefined)

});


test('CVD , when the three related conditions (MI, HF, Stroke) are present on the baseline assessment', () => {

  const input = {

    "heartfailure_startage_adu_q_1":{ "1a": "25" },
    "heartfailure_presence_adu_q_1": { "1a": "1" },
    "heartfailure_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "stroke_startage_adu_q_1":{ "1a": "30" },
    "stroke_presence_adu_q_1": { "1a": "1" },
    "stroke_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "heartattack_startage_adu_q_1":{ "1a": "35" },
    "heartattack_presence_adu_q_1": { "1a": "1" },
    "heartattack_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" }

  }

  InputSingleton.getInstance().setInput(input);
  expect(cardioVascularDisease.clinicalStatus()?.display).toBe("Active");
  expect(cardioVascularDisease.isPresent()).toBe(true);
  expect(cardioVascularDisease.code().display).toBe("CVD - cardiovascular disease");
  //Expected to use the 'onset' date of HF, the earliest condition to happen
  expect(cardioVascularDisease.onsetDateTime()).toBe("1977-01");


});



test('CVD , when only one of the conditions (MI, HF, Stroke) is present on the baseline assessment', () => {

  const input = {

    "heartfailure_startage_adu_q_1":{ "1a": "" },
    "heartfailure_presence_adu_q_1": { "1a": "2" },
    "heartfailure_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "stroke_startage_adu_q_1":{ "1a": "" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "heartattack_startage_adu_q_1":{ "1a": "35" },
    "heartattack_presence_adu_q_1": { "1a": "1" },
    "heartattack_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" }

  }

  InputSingleton.getInstance().setInput(input);
  expect(cardioVascularDisease.clinicalStatus()?.display).toBe("Active");
  expect(cardioVascularDisease.isPresent()).toBe(true);
  expect(cardioVascularDisease.code().display).toBe("CVD - cardiovascular disease");
  //Expected to use the 'onset' date of HF, the earliest condition to happen
  expect(cardioVascularDisease.onsetDateTime()).toBe("1987-01");


});


test('CVD , when only one of the conditions (MI, HF, Stroke) is present on a follow-up assessment', () => {

  const input = {

    "heartfailure_startage_adu_q_1":{ "1a": "" },
    "heartfailure_presence_adu_q_1": { "1a": "2" },
    "heartfailure_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "stroke_startage_adu_q_1":{ "1a": "" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "heartattack_startage_adu_q_1":{ "1a": "" },
    "heartattack_presence_adu_q_1": { "1a": "2" },
    "heartattack_followup_adu_q_1":{"1b":"2","1c":"2",/*->*/"2a":"1","3a":"2","3b":"2"},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" }

  }

  InputSingleton.getInstance().setInput(input);
  expect(cardioVascularDisease.clinicalStatus()?.display).toBe("Active");
  expect(cardioVascularDisease.isPresent()).toBe(true);
  expect(cardioVascularDisease.code().display).toBe("CVD - cardiovascular disease");
  //Expected to use the 'onset' date of HF, the earliest condition to happen
  expect(cardioVascularDisease.onsetDateTime()).toBe("1999-05");


});


/**
 * Case intended only for testing that the template and the module, together, do not fail
 * when generating a FHIR resource with a given input. More specific validations on this
 * output are performed through the HL7 validator.
 * 
 */
test('CVD resource generation when reported', () => {

  const input = {
    "heartfailure_startage_adu_q_1":{ "1a": "" },
    "heartfailure_presence_adu_q_1": { "1a": "2" },
    "heartfailure_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "stroke_startage_adu_q_1":{ "1a": "" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "heartattack_startage_adu_q_1":{ "1a": "" },
    "heartattack_presence_adu_q_1": { "1a": "2" },
    "heartattack_followup_adu_q_1":{"1b":"2","1c":"2",/*->*/"2a":"1","3a":"2","3b":"2"},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/generic/Condition.jsonata', "module": './lifelines/CardioVascularDisease' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(1);    
  })

});
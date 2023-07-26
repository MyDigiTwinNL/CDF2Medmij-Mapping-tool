import { InputSingleton } from '../inputSingleton';
import * as strokemf from '../lifelines/Stroke'
import { clinicalStatusSNOMEDCodeList, conditionsSNOMEDCodeList, verificationStatusSNOMEDCodeList } from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'


test('stroke, when reported positive in 1A', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "1" },
    "stroke_followup_adu_q_1":{"1b":"2","1C":"2","2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"5/1992","1b":"5/1995","1C":"5/1997","2a":"5/2001","3a":"5/2003","3b":"5/2005"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(strokemf.isPresent()).toBe(true);
  expect(strokemf.code()).toBe(conditionsSNOMEDCodeList.cerebrovascular_accident);
  expect(strokemf.onsetDateTime()).toBe("1982");
  
});


test('stroke, when reported in 2A', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":"2","1C":"2","2a":"1","3a":"2","3b":"2"},    
    "date": {"1a":"5/1992","1b":"5/1995","1C":"5/1996","2a":"5/2002","3a":"5/2003","3b":"5/2005"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(strokemf.isPresent()).toBe(true);
  expect(strokemf.code()).toBe(conditionsSNOMEDCodeList.cerebrovascular_accident);
  expect(strokemf.onsetDateTime()).toBe("1999-05");
  
});


test('stroke, when reported right after baseline (1B)', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":"1","1C":"2","2a":"2","3a":"2","3b":"2"},    
    "date": {"1a":"5/1993","1b":"5/1995","1C":"5/1996","2a":"5/2002","3a":"5/2003","3b":"5/2005"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(strokemf.isPresent()).toBe(true);
  expect(strokemf.code()).toBe(conditionsSNOMEDCodeList.cerebrovascular_accident);
  expect(strokemf.onsetDateTime()).toBe("1994-05");
  
});

test('stroke, when no reported', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"5/1992","1b":"5/1995","1C":"5/1997","2a":"5/2002","3a":"5/2003","3b":"5/2005"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.clinicalStatus()).toStrictEqual({})
  
});






test('Stroke resource generation when not reported', () => {

  const input = {
    "project_pseudo_id": {"1a":"520681571"},
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"5/1992","1b":"5/1995","1C":"5/1997","2a":"5/2002","3a":"5/2003","3b":"5/2005"},
    "age": { "1a": "22" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/Stroke.jsonata', "module": './lifelines/Stroke' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(0);
  })

});



/**
 * Case intended only for testing that the template and the module, together, do not fail
 * when generating a FHIR resource with a given input. More specific validations on this
 * output are performed through the HL7 validator.
 * 
 */
test('Stroke resource generation when reported', () => {

  const input = {
    "project_pseudo_id": {"1a":"520681571"},
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "1" },
    "stroke_followup_adu_q_1":{"2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"5/1992","1b":"5/1995","1C":"5/1997","2a":"5/2002","3a":"5/2003","3b":"5/2005"},
    "age": { "1a": "22" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/Stroke.jsonata', "module": './lifelines/Stroke' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(1);    
  })

});



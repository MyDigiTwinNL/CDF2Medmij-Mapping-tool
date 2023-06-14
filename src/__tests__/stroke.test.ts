import { InputSingleton } from '../inputSingleton';
import * as strokemf from '../lifelines/Stroke'
import { clinicalStatusSNOMEDCodeList, conditionsSNOMEDCodeList, verificationStatusSNOMEDCodeList } from '../snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'


test('stroke, when reported positive in 1A', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1A": "12" },
    "stroke_presence_adu_q_1": { "1A": "1" },
    "stroke_followup_adu_q_1":{"2A":"2","3A":"2","3B":"2"},
    "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997","2A":"5/2001","3A":"5/2003","3B":"5/2005"},
    "AGE": { "1A": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(strokemf.isPresent()).toBe(true);
  expect(strokemf.code()).toBe(conditionsSNOMEDCodeList.cerebrovascular_accident);
  expect(strokemf.onsetDateTime()).toBe("1982");
  
});


test('stroke, when reported positive in 2A', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1A": "12" },
    "stroke_presence_adu_q_1": { "1A": "2" },
    "stroke_followup_adu_q_1":{"2A":"1","3A":"2","3B":"2"},
    "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997","2A":"5/2002","3A":"5/2003","3B":"5/2005"},
    "AGE": { "1A": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(strokemf.isPresent()).toBe(true);
  expect(strokemf.code()).toBe(conditionsSNOMEDCodeList.cerebrovascular_accident);
  expect(strokemf.onsetDateTime()).toBe("1997-05");
  
});



test('stroke, when no reported', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1A": "12" },
    "stroke_presence_adu_q_1": { "1A": "2" },
    "stroke_followup_adu_q_1":{"2A":"2","3A":"2","3B":"2"},
    "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997","2A":"5/2002","3A":"5/2003","3B":"5/2005"},
    "AGE": { "1A": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.clinicalStatus()).toStrictEqual({})
  
});






test('Stroke resource generation when not reported', () => {

  const input = {
    "PROJECT_PSEUDO_ID": {"1A":"520681571"},
    "stroke_startage_adu_q_1":{ "1A": "12" },
    "stroke_presence_adu_q_1": { "1A": "2" },
    "stroke_followup_adu_q_1":{"2A":"2","3A":"2","3B":"2"},
    "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997","2A":"5/2002","3A":"5/2003","3B":"5/2005"},
    "AGE": { "1A": "22" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/Stroke.jsonata', "module": './lifelines/Stroke' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(0);
  })

});




test('Stroke resource generation when reported', () => {

  const input = {
    "PROJECT_PSEUDO_ID": {"1A":"520681571"},
    "stroke_startage_adu_q_1":{ "1A": "12" },
    "stroke_presence_adu_q_1": { "1A": "1" },
    "stroke_followup_adu_q_1":{"2A":"2","3A":"2","3B":"2"},
    "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997","2A":"5/2002","3A":"5/2003","3B":"5/2005"},
    "AGE": { "1A": "22" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/Stroke.jsonata', "module": './lifelines/Stroke' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(1);    
  })

});



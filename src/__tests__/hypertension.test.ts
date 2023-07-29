import { InputSingleton } from '../inputSingleton';
import * as hypertensionmf from '../lifelines/Hypertension'
import { clinicalStatusSNOMEDCodeList, conditionsSNOMEDCodeList, verificationStatusSNOMEDCodeList } from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'

test('hypertension reported on assessment 3A', () => {

  const input = {
    "hypertension_startage_adu_q_1": { "1a": "", "3a": "23", "3b": "23" },
    "hypertension_presence_adu_q_1": { "1a": "2", "3a": "1", "3b": "1" },
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(hypertensionmf.isPresent()).toBe(true);
  expect(hypertensionmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(hypertensionmf.onsetDateTime()).toBe("1993");


});



test('No hypertension reported', () => {

  const input = {
    "hypertension_startage_adu_q_1": { "1a": "", "3a": "", "3b": "" },
    "hypertension_presence_adu_q_1": { "1a": "2", "3a": "2", "3b": "2" },
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(hypertensionmf.isPresent()).toBe(false);
  expect(hypertensionmf.clinicalStatus()).toStrictEqual({});



});


test('Hypertension resource generation when it is reported', () => {

  const input = {
    "hypertension_startage_adu_q_1": { "1a": "", "3a": "23", "3b": "23" },
    "hypertension_presence_adu_q_1": { "1a": "2", "3a": "1", "3b": "1" },
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
    "project_pseudo_id": { "1a": "520681571" },
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/Hypertension.jsonata', "module": './lifelines/Hypertension'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(1);
    expect(output[0]).toHaveProperty("id")
    expect(output[0]).toHaveProperty("clinicalStatus")
    expect(output[0]).toHaveProperty("verificationStatus")
    expect(output[0]).toHaveProperty("code.coding[0].system")
    expect(output[0]).toHaveProperty("code.coding[0].code")
    expect(output[0]).toHaveProperty("code.coding[0].display")
    expect(output[0]).toHaveProperty("subject.reference")
    expect(output[0]).toHaveProperty("subject.display")
    expect(output[0]).toHaveProperty("onsetDateTime")
  })

})

test('Hypertension resource generation when no hypertension is reported', () => {

  const input = {
    "hypertension_startage_adu_q_1": { "1a": "", "3a": "", "3b": "" },
    "hypertension_presence_adu_q_1": { "1a": "2", "3a": "2", "3b": "2" },
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" },
    "project_pseudo_id": { "1a": "520681571" },
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/Hypertension.jsonata', "module": './lifelines/Hypertension'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(0);    
  })

})
  
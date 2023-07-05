import { InputSingleton } from '../inputSingleton';
import * as hypertensionmf from '../lifelines/Hypertension'
import { clinicalStatusSNOMEDCodeList, conditionsSNOMEDCodeList, verificationStatusSNOMEDCodeList } from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'

test('hypertension reported on assessment 3A', () => {

  const input = {
    "hypertension_startage_adu_q_1": { "1A": "", "3A": "23", "3B": "23" },
    "hypertension_presence_adu_q_1": { "1A": "2", "3A": "1", "3B": "1" },
    "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
    "AGE": { "1A": "22" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(hypertensionmf.isPresent()).toBe(true);
  expect(hypertensionmf.clinicalStatus()).toBe(clinicalStatusSNOMEDCodeList.active);
  expect(hypertensionmf.onsetDateTime()).toBe("1993");


});



test('No hypertension reported', () => {

  const input = {
    "hypertension_startage_adu_q_1": { "1A": "", "3A": "", "3B": "" },
    "hypertension_presence_adu_q_1": { "1A": "2", "3A": "2", "3B": "2" },
    "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
    "AGE": { "1A": "22" },
  }

  InputSingleton.getInstance().setInput(input);
  expect(hypertensionmf.isPresent()).toBe(false);
  expect(hypertensionmf.clinicalStatus()).toStrictEqual({});



});


test('Hypertension resource generation when it is reported', () => {

  const input = {
    "hypertension_startage_adu_q_1": { "1A": "", "3A": "23", "3B": "23" },
    "hypertension_presence_adu_q_1": { "1A": "2", "3A": "1", "3B": "1" },
    "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
    "AGE": { "1A": "22" },
    "PROJECT_PSEUDO_ID": { "1A": "520681571" },
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
    "hypertension_startage_adu_q_1": { "1A": "", "3A": "", "3B": "" },
    "hypertension_presence_adu_q_1": { "1A": "2", "3A": "2", "3B": "2" },
    "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
    "AGE": { "1A": "22" },
    "PROJECT_PSEUDO_ID": { "1A": "520681571" },
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/Hypertension.jsonata', "module": './lifelines/Hypertension'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(0);    
  })

})
  
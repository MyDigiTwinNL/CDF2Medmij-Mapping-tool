import { InputSingleton } from '../inputSingleton';
import * as strokemf from '../lifelines/Stroke'
import { MappingTarget, processInput } from '../mapper'
import {getSNOMEDCode} from '../codes/codesCollection'

test('stroke, when reported positive in 1A', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "1" },
    "stroke_followup_adu_q_1":{"1b":"2","1c":"2","2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  

  expect(strokemf.stroke.clinicalStatus()?.display).toBe("Active");
  expect(strokemf.stroke.isPresent()).toBe(true);
  expect(strokemf.stroke.code().display).toBe("Cerebrovascular accident (disorder)");
  expect(strokemf.stroke.onsetDateTime()).toBe("1982");
  
});


test('stroke, when reported in 2A', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":"2","1c":"2","2a":"1","3a":"2","3b":"2"},    
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.stroke.clinicalStatus()?.display).toBe("Active");
  expect(strokemf.stroke.isPresent()).toBe(true);
  expect(strokemf.stroke.code().display).toBe("Cerebrovascular accident (disorder)");
  expect(strokemf.stroke.onsetDateTime()).toBe("1999-05");
  
});


test('stroke, when reported right after baseline (1B)', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":"1","1c":"2","2a":"2","3a":"2","3b":"2"},    
    "date": {"1a":"1992-5","1b":"1994-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.stroke.clinicalStatus()?.display).toBe("Active");
  expect(strokemf.stroke.isPresent()).toBe(true);
  expect(strokemf.stroke.code().display).toBe("Cerebrovascular accident (disorder)");
  expect(strokemf.stroke.onsetDateTime()).toBe("1993-05");
  
});


test('stroke, when reported in 2A, after skipping one assessment', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":"2","1c":undefined,"2a":"1","3a":"2","3b":"2"},    
    "date": {"1a":"1992-5","1b":"1995-5","1c":undefined,"2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.stroke.clinicalStatus()?.display).toBe("Active");
  expect(strokemf.stroke.isPresent()).toBe(true);
  expect(strokemf.stroke.code().display).toBe("Cerebrovascular accident (disorder)");
  expect(strokemf.stroke.onsetDateTime()).toBe("1998-05");
  
});


test('stroke, when reported in 2A, after skipping multiple assessments', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"1b":undefined,"1c":undefined,"2a":"1","3a":"2","3b":"2"},    
    "date": {"1a":"1992-5","1b":undefined,"1c":undefined,"2a":"2002-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.stroke.clinicalStatus()?.display).toBe("Active");
  expect(strokemf.stroke.isPresent()).toBe(true);
  expect(strokemf.stroke.code().display).toBe("Cerebrovascular accident (disorder)");
  expect(strokemf.stroke.onsetDateTime()).toBe("1997-05");
  
});



test('stroke, when no reported', () => {

  const input = {
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  expect(strokemf.stroke.clinicalStatus()).toStrictEqual(undefined)
  
});






test('Stroke resource generation when not reported', () => {

  const input = {
    "project_pseudo_id": {"1a":"520681571"},
    "stroke_startage_adu_q_1":{ "1a": "12" },
    "stroke_presence_adu_q_1": { "1a": "2" },
    "stroke_followup_adu_q_1":{"2a":"2","3a":"2","3b":"2"},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/generic/Condition.jsonata', "module": './lifelines/Stroke' },
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
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "22" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/generic/Condition.jsonata', "module": './lifelines/Stroke' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(1);    
  })

});



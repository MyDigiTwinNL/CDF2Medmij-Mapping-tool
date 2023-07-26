import { InputSingleton } from '../inputSingleton';
import * as bloodpressuremf from '../lifelines/BloodPressure'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'



test('BloodPressure resource generation', () => {

  
  const input = {
    "bp_entrytype_all_m_1":         {"1a":"2","2a":"2"},
    "bp_bandsize_all_m_1":          {"1a":"1","2a":"1","3a":"1"},
    "bp_arm_all_m_1":                           {"3a":"2"},
    "bpavg_systolic_all_m_1":       {"1a":"130","2a":"130"},
    "bpavg_diastolic_all_m_1":      {"1a":"140","2a":"140"},
    "bpavg_arterial_all_m_1":       {"1a":"113","2a":"113"},
    "date": {"1a":"5/1992","1b":"5/1995","1C":"5/1997","2a":"5/2001","3a":"5/2003","3b":"5/2005"},
    "project_pseudo_id": { "1a": "520681571" },
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/BloodPressure.jsonata', "module": './lifelines/BloodPressure'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })

})


test('BloodPressure resource generation with empty values', () => {

  
  const input = {
    "bp_entrytype_all_m_1":         {"1a":"2","2a":"2"},
    "bp_bandsize_all_m_1":          {"1a":"1","2a":"1","3a":"1"},
    "bp_arm_all_m_1":                           {"3a":"2"},
    "bpavg_systolic_all_m_1":       {"1a":"130","2a":""},
    "bpavg_diastolic_all_m_1":      {"1a":"140","2a":""},
    "bpavg_arterial_all_m_1":       {"1a":"113","2a":"113"},
    "date": {"1a":"5/1992","1b":"5/1995","1C":"5/1997","2a":"5/2001","3a":"5/2003","3b":"5/2005"},
    "project_pseudo_id": { "1a": "520681571" },
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/BloodPressure.jsonata', "module": './lifelines/BloodPressure'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })




})




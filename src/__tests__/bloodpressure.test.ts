import { InputSingleton } from '../inputSingleton';
import * as bloodpressuremf from '../lifelines/BloodPressure'
import {testResultFlagsSNOMEDCodelist} from '../snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'


type BloodPressureReadingEntry = {
    "cuffType": object,
    "measuringLocation": object,
    "systolicBloodPressure": number,
    "diastolicBloodPressure": number,
    "arterialBloodPressure": number,
    "bloodPressureDateTime": string
}



test('BloodPressure resource generation', () => {

  
  const input = {
    "bp_entrytype_all_m_1":         {"1A":"2","2A":"2"},
    "bp_bandsize_all_m_1":          {"1A":"1","2A":"1","3A":"1"},
    "bp_arm_all_m_1":                           {"3A":"2"},
    "bpavg_systolic_all_m_1":       {"1A":"130","2A":"130"},
    "bpavg_diastolic_all_m_1":      {"1A":"140","2A":"140"},
    "bpavg_arterial_all_m_1":       {"1A":"113","2A":"113"},
    "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997","2A":"5/2001","3A":"5/2003","3B":"5/2005"},
    "PROJECT_PSEUDO_ID": { "1A": "520681571" },
  }

  let targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/BloodPressure.jsonata', "module": './lifelines/BloodPressure'},
  ]
  
  processInput(input,targets).then((output:object[]) => {
    expect(output.length).toBe(2);    
  })




})





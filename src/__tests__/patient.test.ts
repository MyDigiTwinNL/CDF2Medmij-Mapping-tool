import { InputSingleton } from '../inputSingleton';
import * as patientmf from '../lifelines/Patient'
import {genderFHIRV3Codes} from '../codes/fhirv3codes'
import { MappingTarget, processInput } from '../mapper'


test('Male patient', () => {
  
  const input = {
    "age": {"1a":"22"},
    "date": { "1a": "5/1992", "1b": "5/1995", "1C": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
    "gender": {"1a":"male"}
  }  

  InputSingleton.getInstance().setInput(input);
  expect(patientmf.birthDate()).toBe("1970");
  expect(patientmf.gender()).toBe(genderFHIRV3Codes.male)
  

});



test('Patient resource generation', () => {

  
    const input = {
        "project_pseudo_id": {"1a":"520681571"},
        "age": {"1a":"22"},
        "date": { "1a": "5/1992", "1b": "5/1995", "1C": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
        "gender": {"1a":"male"}
      }  
      
    const targets: MappingTarget[] = [
      { "template": './zib-2017-mappings/Patient.jsonata', "module": './lifelines/Patient'},
    ]
    
    processInput(input,targets).then((output:object[]) => {
      expect(output.length).toBe(1);    
    })
    
  })
  
      

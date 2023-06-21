import { InputSingleton } from '../inputSingleton';
import * as patientmf from '../lifelines/Patient'
import {genderFHIRV3Codes} from '../fhirv3codes'
import { MappingTarget, processInput } from '../mapper'


test('Male patient', () => {
  
  const input = {
    "AGE": {"1A":"22"},
    "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
    "GENDER": {"1A":"male"}
  }  

  InputSingleton.getInstance().setInput(input);
  expect(patientmf.birthDate()).toBe("1970");
  expect(patientmf.gender()).toBe(genderFHIRV3Codes.male)
  

});



test('Patient resource generation', () => {

  
    const input = {
        "PROJECT_PSEUDO_ID": {"1A":"520681571"},
        "AGE": {"1A":"22"},
        "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "3A": "5/2003", "3B": "5/2005" },
        "GENDER": {"1A":"male"}
      }  
      
    const targets: MappingTarget[] = [
      { "template": './zib-2017-mappings/Patient.jsonata', "module": './lifelines/Patient'},
    ]
    
    processInput(input,targets).then((output:object[]) => {
      expect(output.length).toBe(1);    
    })
    
  })
  
      

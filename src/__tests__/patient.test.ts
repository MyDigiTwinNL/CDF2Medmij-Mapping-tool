import { InputSingleton } from '../inputSingleton';
import * as patientmf from '../lifelines/Patient'
import {genderFHIRV3Codes} from '../codes/fhirv3codes'
import { MappingTarget, processInput } from '../mapper'


test('Male patient', () => {
  
  const input = {
    "age": {"1a":"22"},
    "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
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
        "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
        "gender": {"1a":"male"}
      }  
      
    const targets: MappingTarget[] = [
      { "template": './zib-2017-mappings/Patient.jsonata', "module": './lifelines/Patient'},
    ]
    
    processInput(input,targets).then((output:object[]) => {
      expect(output.length).toBe(1);    
    })
    
  })
  
      

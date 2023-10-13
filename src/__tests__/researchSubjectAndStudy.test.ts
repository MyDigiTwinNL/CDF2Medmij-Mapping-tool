import { InputSingleton } from '../inputSingleton';
import {researchSubjectAndStudy} from '../lifelines/ResearchSubjectAndStudy'
import { MappingTarget, processInput } from '../mapper'


test('Skipped one or more assessment, but participated in the last one', () => {
  
  const input = {
    "project_pseudo_id": { "1a": "520681571" },
    "date_of_death": {"global":"2020-2"},
    "date_of_inclusion": {"global":"2010-2"},
    "age": {"1a":"22"},
    "date": {"1a":"1992-5","1b":"","1c":"","2a":"2001-5","3a":"2003-5","3b":"2005-5"},
  }  

  InputSingleton.getInstance().setInput(input);

  expect(researchSubjectAndStudy.dateOfInclusion()).toBe("2010-02")
  expect(researchSubjectAndStudy.dateOfLastResponse()).toBe("2005-05")
  

});

test('Skipped one or more assessment, including the last one', () => {
  
    const input = {
      "project_pseudo_id": { "1a": "520681571" },
      "date_of_death": {"global":"2020-2"},
      "date_of_inclusion": {"global":"2010-2"},
      "age": {"1a":"22"},
      "date": {"1a":"1992-5","1b":"","1c":"","2a":"2001-5","3a":"2003-5","3b":""},
    }  
  
    InputSingleton.getInstance().setInput(input);
  
    expect(researchSubjectAndStudy.dateOfInclusion()).toBe("2010-02")
    expect(researchSubjectAndStudy.dateOfLastResponse()).toBe("2003-05")
    
});


test('Skipped all the assessment but the baseline one', () => {
  
    const input = {
      "project_pseudo_id": { "1a": "520681571" },
      "date_of_death": {"global":"2020-2"},
      "date_of_inclusion": {"global":"2010-2"},
      "age": {"1a":"22"},
      "date": {"1a":"1992-5","1b":"","1c":"","2a":"","3a":"","3b":""},
    }  
  
    InputSingleton.getInstance().setInput(input);
  
    expect(researchSubjectAndStudy.dateOfInclusion()).toBe("2010-02")
    expect(researchSubjectAndStudy.dateOfLastResponse()).toBe("1992-05")
    
});


/**
 * Intended for verifying that the JSOnata does not fail on building the template
 * Further verifications are performed through the FHIR profile validator.
 */
test('Subject and study resource generation', () => {

    const input = {
        "project_pseudo_id": { "1a": "520681571" },
        "date_of_death": {"global":"2020-2"},
        "date_of_inclusion": {"global":"2010-2"},
        "age": {"1a":"22"},
        "date": {"1a":"1992-5","1b":"","1c":"","2a":"2001-5","3a":"2003-5","3b":""},
      }  
    
    let targets: MappingTarget[] = [
      { "template": './zib-2017-mappings/ResearchStudy.jsonata', "module": './lifelines/ResearchSubjectAndStudy.ts'},
    ]
    
    processInput(input,targets).then((output:object[]) => {
      expect(output.length).toBe(1);    
    })

    targets = [
        { "template": './zib-2017-mappings/ResearchStudy.jsonata', "module": './lifelines/ResearchSubjectAndStudy.ts'},
    ]
      
    processInput(input,targets).then((output:object[]) => {
        expect(output.length).toBe(1);    
    })
  
  })
  
        
# Creating new pairing rules


!!! warning "Under Development"
    
    This tool is under active development. The documentation is not complete yet. If you have any 
    questions, please contact us via [GitHub Issues](https://github.com/MyDigiTwinNL/CDF2Medmij-Mapping-tool/issues)


As described on the architecture section, the CDF2FHIR performs a batch process where a set of previously defined pairing rules are applied 

- Existing interfaces
        
        LaboratoryTestResults


Implementing the interfaces

    Typesystem

API

    getting the value of a variable for a given assessment
        inputValue("gender","1a");
    
    Sometimes the output depends on whether the asessment on a given wave was performed or not
    
        assessmentMissed("")
    
    Assertions that abort the transformation of the current patient:

    
        assertIsDefined(inputValue("date","1a"),`Precondition failed: date of baseline assessment (1a) is expected to be not-null for eGFR calculations`)


Getting codes: SNOMED, LOINC, ...
//error when non existing


## Test-driven-development

1. Pick template/interface
2. Add specification for the functions
3. Test case implementation - use equivalence classes partitioning or other approaches

test('eGFRS for male, black participant', () => {

  const input = {
   
    "creatinine_result_all_m_1":{ "1a": "79.2", "2a":"106.1"},//in umol/L
    "ethnicity_category_adu_q_1":{"1b":"3"},
    "gender" : { "1a":"MALE"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = eGFRS.results();
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).testResult).toBeCloseTo(124,0)
  expect((results[0] as TestResultEntry).resultFlags).toBe(undefined)
  expect((results[1] as TestResultEntry).testResult).toBeCloseTo(81,0)  
  expect((results[1] as TestResultEntry).resultFlags).toBe(undefined)

  

});



## Defining a module


import the following libraries:

````
import {inputValue, inputValues} from '../functionsCatalog';
import moize from 'moize'
import {lifelinesDateToISO, lifelinesMeanDate} from '../lifelinesFunctions'
import {clinicalStatusSNOMEDCodeList,conditionsSNOMEDCodeList,verificationStatusSNOMEDCodeList} from '../snomedCodeLists';
````

* inputValue: get the input value from a given wave/assessment

````
inputValue(<variable name>,<wave>)
````

* inputValues: get the map of all the wave values

````
const val = inputValue(<variable name>)
````
* moize

caching expensive computations (used multiple times within the template)

* Coding system libraries


### FHIR resources (1 <-> 0..1)

From the available data, the output is a single resource (e.g., Diabetes condition )




### FHIR resources (1 <-> 0..N)



Resources that represent a change over time. Multiple resources are generated.



## Testing

resource.test.ts

Testing the module functions independently (not using then in the mapping)

````
//To set the input of the transformation
import { InputSingleton } from '../inputSingleton';
//The module to be tested
import * as problemXmod from '../lifelines/MyProbXModule'
//Other modules required for the test, e.g., modules with codes
import { clinicalStatusSNOMEDCodeList, conditionsSNOMEDCodeList, verificationStatusSNOMEDCodeList } from '../snomedCodeLists';

//set the input
const input = {
    "varOne":{"W1":"2","W2":"5"},
    "varTwo":{"W1":"1","W2":"9"},
}

InputSingleton.getInstance().setInput(input);

expect(problemXmod.functionToBeTested()).toBe(<expected value>);

````

Testing the functions through the mapping process

````
//To set the input of the transformation
import { InputSingleton } from '../inputSingleton';
//The module to be tested
import * as problemXmod from '../lifelines/MyProbXModule'
//Other modules required for the test, e.g., modules with codes
import { clinicalStatusSNOMEDCodeList, conditionsSNOMEDCodeList, verificationStatusSNOMEDCodeList } from '../snomedCodeLists';
//The mapper, to generate the FHIR bundle with the given input
import { MappingTarget, processInput } from '../mapper'

//set the input
const input = {
    "varOne":{"W1":"2","W2":"5"},
    "varTwo":{"W1":"1","W2":"9"},
}


const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/ProblemXtemplate', "module": './lifelines/MyProbXModule' },
  ]

//Process the template, using the module, then evaluate the output (an array of FHIR resources to be included in the bundle). Ref to description of 1-to-* and 1-to-1.
processInput(input, targets).then((output: object[]) => {
    //test
    expect(output.length).toBe(1);

})


````

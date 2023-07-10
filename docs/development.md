# Tool overview

## Intermediate data representation for cohort studies

## Transformation overview

![](images/mapingoverview.drawio.png)

## Mapping targets specification

## Defining an output template

Templates that can be reused:

- Problem/Condition
- Laboratory result

For other specific MedMij resources, a template need to be created from the technical information from Nictiz. For example, Vaccination/Immunization- the following referneces would be useful:

* Vaccination/Immunization- profile (structure definition)- requires checking (url)
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/1.3.4/files/113799

* ZIBs documentation:
https://zibs.nl/wiki/HCIM_Release_2017(EN)


* Vaccination/Immunization- examples. By checking the cardinality specified in the previous two, it can be identified which elements are not considered in the example
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.12/files/2002637

Create a file with .jsonata extension

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


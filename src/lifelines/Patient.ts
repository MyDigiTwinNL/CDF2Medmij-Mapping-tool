import {inputValue} from '../functionsCatalog';
import {genderFHIRV3Codes} from '../fhirv3codes'


/*
Based on HCIM resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.12/files/2002232/~overview

Related Lifelines variables:
GENDER, AGE (See Lifelines data manual)
*/

export const birthDate = () => {   
        const surveyDateParts = inputValue("DATE","1A").split("/");
        const surveyAge = Number(inputValue("AGE","1A"));      
        const surveyYear = Number(surveyDateParts[1]);
        return (surveyYear-surveyAge).toString()
}


export const gender = ():object => {
    if (inputValue("GENDER","1A")==="male"){
        return genderFHIRV3Codes.male;
    }
    else if (inputValue("GENDER","1A")==="female"){
        return genderFHIRV3Codes.female;
    }
    else{
        return genderFHIRV3Codes.unknown;
    }    
}    

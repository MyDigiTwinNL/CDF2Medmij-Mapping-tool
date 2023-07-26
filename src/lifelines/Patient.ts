import {inputValue} from '../functionsCatalog';
import {genderFHIRV3Codes} from '../codes/fhirv3codes'


/*
Based on HCIM resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.12/files/2002232/~overview

Related Lifelines variables:
gender, age (See Lifelines data manual)
*/

export const birthDate = () => {   
        const dateValue:string|undefined = inputValue("date","1A");
        if (dateValue!=undefined){
            const surveyDateParts = inputValue("date","1A")!.split("/");
            const surveyAge = Number(inputValue("age","1A"));      
            const surveyYear = Number(surveyDateParts[1]);
            return (surveyYear-surveyAge).toString()
        }
        else{
            return "unknown";
        }        
}


export const gender = ():object => {
    if (inputValue("gender","1A")==="male"){
        return genderFHIRV3Codes.male;
    }
    else if (inputValue("gender","1A")==="female"){
        return genderFHIRV3Codes.female;
    }
    else{
        return genderFHIRV3Codes.unknown;
    }    
}    

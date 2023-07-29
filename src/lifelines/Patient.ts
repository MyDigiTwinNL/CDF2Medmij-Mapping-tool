import {inputValue} from '../functionsCatalog';
import {genderFHIRV3Codes} from '../codes/fhirv3codes'


/*
Based on HCIM resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.12/files/2002232/~overview

Related Lifelines variables:
gender, age (See Lifelines data manual)
*/

export const birthDate = () => {   
        const dateValue:string|undefined = inputValue("date","1a");
        if (dateValue!=undefined){
            const surveyDateParts = inputValue("date","1a")!.split("-");
            const surveyAge = Number(inputValue("age","1a"));      
            const surveyYear = Number(surveyDateParts[0]);
            return (surveyYear-surveyAge).toString()
        }
        else{
            return "unknown";
        }        
}


export const gender = ():object => {
    if (inputValue("gender","1a")==="male"){
        return genderFHIRV3Codes.male;
    }
    else if (inputValue("gender","1a")==="female"){
        return genderFHIRV3Codes.female;
    }
    else{
        return genderFHIRV3Codes.unknown;
    }    
}    

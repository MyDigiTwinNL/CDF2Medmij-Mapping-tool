import {inputValue} from '../functionsCatalog';
import {genderFHIRV3Codes} from '../codes/fhirv3codes'
import {lifelinesDateToISO} from '../lifelinesFunctions'
import {UnexpectedInputException,assertIsDefined} from '../unexpectedInputException'

/*
Based on HCIM resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.12/files/2002232/~overview

Related Lifelines variables:
gender, age (See Lifelines data manual)

*/

/**
 * 
 * @precondition assessment date is not null
 * @precondition in reported age is defined, it is a number
 * 
 * @returns 
 */
export const birthDate = ():string|undefined => {   
        const assessmetDate:string|undefined = inputValue("date","1a")

        assertIsDefined(assessmetDate,'failed precondition: non-null assessment date is expected (Patient)')            
        const surveyDateParts = assessmetDate.split("-");
        
        const reportedAge:string|undefined = inputValue("age","1a")

        if (reportedAge!=undefined){
            const surveyAge = Number(reportedAge);      
            const surveyYear = Number(surveyDateParts[0]);
            return (surveyYear-surveyAge).toString()
        }
        else{
            return undefined;
        }
        
}


export const deceasedDateTime = ():string|undefined => {
    const dod = inputValue("date_of_death","global")
    if (dod!==undefined){
        return lifelinesDateToISO(dod)
    }
    else{
        return undefined;    
    }
    
}

export const gender = ():object|undefined => {
    if (inputValue("gender","1a")==="MALE"){
        return genderFHIRV3Codes.male;
    }
    else if (inputValue("gender","1a")==="FEMALE"){
        return genderFHIRV3Codes.female;
    }
    else{
        return undefined;
    }    
}    

import moize from 'moize'
import {lifelinesDateToISO, lifelinesMeanDate} from '../lifelinesFunctions'
import {inputValue, inputValues,variableAssessments} from '../functionsCatalog';

import {myocardialInfarction} from './MyocardialInfarction'
import {heartFailure} from './HeartFailure'
import {stroke} from './Stroke'

import {Condition} from '../fhir-resource-interfaces/condition'
import {getSNOMEDCode,CodeProperties} from '../codes/codesCollection'
import {assertIsDefined} from '../unexpectedInputException'


export const cardioVascularDisease:Condition = {
    conditionName: function (): string {
        throw new Error('cardio-vascular-disease');
    },

    isPresent: function (): boolean {
        return stroke.isPresent() || heartFailure.isPresent() || myocardialInfarction.isPresent()
    },

    clinicalStatus: function (): CodeProperties | undefined {      
        const statuses = [stroke.clinicalStatus(),heartFailure.clinicalStatus(),myocardialInfarction.clinicalStatus()]
        const activeSNOMEDCode = getSNOMEDCode("55561003")
        if (statuses.some((condition) => condition ===  activeSNOMEDCode)){
            return activeSNOMEDCode
        }
        else{
            return undefined
        }
    },

    /**
     * Return the earliest onsetdate of the active stroke, HF or MI conditions.
     * 
     * @precondition stroke, HF or MI are active (there is no definition of 'onsetDateTime' for this case)
     * @returns 
     */
    onsetDateTime: function (): string | undefined {
        
        const onsetDates:(string|undefined)[] = [];

        //onSetDateTime method fails if used on a condition that is not active
        if (stroke.isPresent()) onsetDates.push(stroke.onsetDateTime())
        if (heartFailure.isPresent()) onsetDates.push(heartFailure.onsetDateTime())
        if (myocardialInfarction.isPresent()) onsetDates.push(myocardialInfarction.onsetDateTime())

        //The three conditions are not present, hence the CVD condition is not present and this method
        //shouldn't be invoked.
        if (onsetDates.length === 0) {
            throw Error("Failed precondition: requesting onsetDateTime on a CVD condition that is not active");
        }

        //filter undefined dates, and parse the remaining ones.
        const parsedDates = onsetDates.filter(date => date !== undefined)
        .map(date => {
            // (date with '!' as here is no longer possible for it to be undefined)
            const [year, month] = date!.split('-');

            //An onset date for a condition may include only the year. This is the case when it is estimated from 
            //the reported start age, that is to say, when it was reported on the baseline assessment
            if (month === undefined){
                return new Date(`${year}`);
            }
            else{
                return new Date(`${year}-${month}`);
            }
        });

        // If all the 'present' conditions have an undefined onset date, the CVD onset date is also undefined.
        if (parsedDates.length === 0) {
            return undefined; 
        }

        // Find the earliest date
        let earliestDate = parsedDates[0];
        for (const date of parsedDates) {
            if (date < earliestDate) {
                earliestDate = date;
            }
        }

        // Convert the earliest Date object back to 'YYYY-MM' format
        
        return  earliestDate.toISOString().slice(0, 7);

    },

    verificationStatus: function (): CodeProperties {
        return getSNOMEDCode("UNK")
    },
    /**
     * @returns SNOMED code for 
     *      Disorder of the circulatory system 
     *      CVD - cardiovascular disease        - 49601007
     */
    code: function (): CodeProperties {
        return getSNOMEDCode("49601007")
    }
}

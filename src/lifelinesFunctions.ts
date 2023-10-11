import {inputValue} from './functionsCatalog';

/**
 * The following general-purpose functions are not intended to be used directly, as
 * they are context-dependant (given which JSON document is being processed by
 * a JSONata expression). 
 * These are loaded as'bindings' to each JSONata expression (see mapper module), 
 * so that they can be called within the templates, or from the other loaded
 * modules. 
 * 
 */


export const resourceId = (resourceName:string):string => `${resourceName}-${inputValue('project_pseudo_id',"1a")}`

export const waveSpecificResourceId = (resourceName:string,wave:string):string => `${resourceName}-${wave}-${inputValue('project_pseudo_id','1a')}`

export const echo = (text:string):void => (console.info(text))

/**
 * 
 * It is assumed (from Lifelines data analysis) that when 'date' is missing in an assessment, the
 * participant dropped the study or missed the assessment.
 * @param wave 
 * @returns true if the assessment was missed, for the
 */
export const assesmentMissed = (wave:string) => inputValue("date",wave)==undefined

/**
 * 
 * @precondition date in the given wave is never undefined
 * @param wave 
 * @returns 
 */
export const collectedDateTime=function(wave:string):string|undefined{
    const coldate = inputValue("date",wave)
    if (coldate!=undefined){
        return lifelinesDateToISO(coldate)
    }
    else{
        return undefined
    }    
    
};



/**
 * Output format based on: https://build.fhir.org/datatypes.html#dateTime
 */
export const lifelinesDateToISO = (lifelinesdate: string) => {

    if (lifelinesdate === undefined) throw Error('Undefined parameter given to lifelinesDataToISO function. Expected string with the format YYYY-MM')
    
    const [year,month] = lifelinesdate.split('-').map(
        (dpart) => parseInt(dpart)
    );
    
    //Format YYYY-MM required, e.g., 2012-10, 2013-01
    return `${year}-${month<10?"0":""}${month}`;
}    


/**
 * 
 * @param date1 
 * @param date2 
 * @returns The mean between date1 and date2 that follow the lifelines format
 * YYYY-M
 */
export const lifelinesMeanDate = (date1: string, date2: string): string => {
    const [year1,month1] = date1.split('-');
    const [year2,month2] = date2.split('-');
  
    const date1Obj = new Date(parseInt(year1), parseInt(month1) - 1);
    const date2Obj = new Date(parseInt(year2), parseInt(month2) - 1);
  
    const meanTimestamp = (date1Obj.getTime() + date2Obj.getTime()) / 2;
    const meanDate = new Date(meanTimestamp);
  
    const meanMonth = (meanDate.getMonth() + 1).toString();
    const meanYear = meanDate.getFullYear();
  
    return `${meanYear}-${meanMonth}`;
  }


/**
 * Return the difference, in months, between to dates that follow Lifeline's format 
 * YYYY-MM. To get a positive result, the earliest date should be given as the
 * first argument.
 * 
 * @param date1
 * @param date2  
 * @returns the difference
 */
export const substractDates = (date1: string, date2: string): number => {
    const [year1, month1] = date1.split('-').map(Number);
    const [year2, month2] = date2.split('-').map(Number);
  
    return (year2 - year1) * 12 + (month2 - month1);
}



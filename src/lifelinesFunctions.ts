import {inputValue} from './functionsCatalog';


export const resourceId = (resourceName:string):string => `${resourceName}-${inputValue('PROJECT_PSEUDO_ID',"1A")}`

export const waveSpecificResourceId = (resourceName:string,wave:string):string => `${resourceName}-${wave}-${inputValue('PROJECT_PSEUDO_ID','1A')}`


/**
 * Output format based on: https://build.fhir.org/datatypes.html#dateTime
 */
export const lifelinesDateToISO = (lifelinesdate?: string) => {

    if (lifelinesdate === undefined) throw Error('Undefined parameter given to lifelinesDataToISO function. Expected string with the format YYYY-MM')
    
    const [month, year] = lifelinesdate.split('/').map(
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
 * MM/YYYY
 */
export const lifelinesMeanDate = (date1: string, date2: string): string => {
    const [month1, year1] = date1.split('/');
    const [month2, year2] = date2.split('/');
  
    const date1Obj = new Date(parseInt(year1), parseInt(month1) - 1);
    const date2Obj = new Date(parseInt(year2), parseInt(month2) - 1);
  
    const meanTimestamp = (date1Obj.getTime() + date2Obj.getTime()) / 2;
    const meanDate = new Date(meanTimestamp);
  
    const meanMonth = (meanDate.getMonth() + 1).toString();
    const meanYear = meanDate.getFullYear();
  
    return `${meanMonth}/${meanYear}`;
  }

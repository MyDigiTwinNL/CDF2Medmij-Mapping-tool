import * as parameters from './transformationParameters';
import { v5 as uuidv5 } from 'uuid';
import { InputSingleton } from './inputSingleton';


export type variableAssessments = { [key: string]: string|undefined}
export type transformVariables = {[key:string]:variableAssessments}

/**
 * Generates a FHIR-compliant UUID based on an unique identified (e.g., participant id)
 */
export const idToUUID = (id: string) => `urn:uuid:${uuidv5(id, parameters.privateNameSpace)}`

/**
 * (Safer) alternative to the regular approach for referencing variables within a JSONata expression,
 * which reports an error if a given variable does not exist. Also useful for getting access to 
 * the input variables within JSONAta bindings (external functions).
 * @param name of the variable
 * @returns value of the given variable
 */
export const inputValue = (name:string,wave:string): string | undefined => {    
    const assessmentValues = InputSingleton.getInstance().getInput()[name];

    //console.info(`>>>${name}>>${wave}>>>${JSON.stringify(assessmentValues)}>>>>>`)

    if (assessmentValues===undefined) throw Error(`Variable ${name} not provided in the input`)
    if (!(wave in assessmentValues)) throw Error(`Assessment ${wave} not available for variable ${name}`)

    const datafileVal = assessmentValues[wave]
    
    //Empty string means an undefined or missing value for the variable 
    //if (datafileVal.trim()===''){
    //  return undefined;      
   // }
    //else{
      return assessmentValues[wave]
    //}
    
}

/**
 * Returns the map with all the assessments of a given variable.
 * Access to properties not defined in a given variable will raise an error 
 * (a Proxy with this behavior is returned)
 * @param name 
 * @param expectedAssessments assessment expected to be read from the datafile (including potentially missing ones)
 * @returns 
 */
export const inputValues = (name:string,expectedAssessments:string[]): variableAssessments => {    

    //returns a Map. @TODO change getInput type from any to Map
    const assessmentValues:variableAssessments = InputSingleton.getInstance().getInput()[name];

    if (assessmentValues===undefined) throw Error(`Variable ${name} not provided in the input`)    

    if (expectedAssessments.length !== Object.keys(assessmentValues).length){
      throw Error(`Expected assessments for variable ${name} (${expectedAssessments}) do not match the ones in the input file (${assessmentValues})`) 
    }
    else{
      /*for (const assessmentValue in assessmentValues){        
        if (assessmentValues[assessmentValue]?.trim()==='') assessmentValues[assessmentValue]=undefined;
      }*/
      //Check that all the expected assessments (including potentially missing ones) were provided
      for (const expectedAssessment in expectedAssessments){
        if (!(expectedAssessment in assessmentValues)){
          throw Error(`Expected assessments for variable ${name} (${expectedAssessments}) do not match the ones in the input file (${assessmentValues}). Missing:${expectedAssessment}`) 
        }
      }

      return assessmentValues;
      /*return new Proxy(assessmentValues, {
          get(target, property) {
            if (!(property in target)) {
              throw new Error(`Property ${String(property)} does not exist in the object ${String(JSON.stringify(target))}.`);
            }
            return target[property];
          }
        });*/

    }
  }





/**
 * Function for echoing strings within a JSONata expression (for debugging purposes)
 * @param text 
 * @returns 
 */
export const echo = (text:string) => console.info(`ECHO: ${text}`);

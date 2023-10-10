import fs from 'fs';
import jsonata from 'jsonata';
import { v5 as uuidv5 } from 'uuid';

import * as funcatalog from './functionsCatalog';

import * as lifelinesfunc from './lifelinesFunctions';

import { privateNameSpace } from './transformationParameters';

import { InputSingleton } from './inputSingleton';

import {transformVariables} from './functionsCatalog'

import {UnexpectedInputException} from './unexpectedInputException'


/**
 * Registers a JS function into a JSONata expression
 * @param moduleObject an module whose functions will be registered on the expression 
 * @param expression jsonata expression where functions will be regitered
 */
function registerModuleFunctions(moduleObject: object, expression: jsonata.Expression) {
  for (const rfunc of Object.values(moduleObject)) {
    //console.info(`registering ${prefix}_${rfunc.name}`)
    expression.registerFunction(`${rfunc.name}`, rfunc);
  }

}

/**
 * Setting up a collection of JSOnata expressions based on the given MappingTargets (templates and related modules)
 * @param targets mapping targets
 * @returns Expressions ready to be used for transforming input data
 */
async function setup(targets: MappingTarget[]): Promise<jsonata.Expression[]> {

  const resourceExpressions: jsonata.Expression[] = [];

  //an expression evaluator for each type of resource (so memoization is used across multiple inputs)
  for (const target of targets) {
    const expression = jsonata(fs.readFileSync(target.template, 'utf8'));

    //Register general-purpose functions
    for (const libfunc of Object.values(funcatalog)) {
      expression.registerFunction(libfunc.name, libfunc);
    }

    //register lifelines-specific functions
    for (const libfunc of Object.values(lifelinesfunc)) {
      expression.registerFunction(libfunc.name, libfunc);
    }

    //register resource-specific functions, set the modulename as a prefix
    await import(target.module).then(      
      (rfuncs) => registerModuleFunctions(rfuncs, expression)
    ).then(() => {      
      resourceExpressions.push(expression);
    })
  }

  return resourceExpressions;

}

/**
 * Perform a transformation of all the data given as 'input', based the configurations
 * of templates and modules of the 'mappings' parameter, into individual FHIR
 * JSON resources
 * @param input a JSON object with the data encoded as expected by the templates and
 * modules given in the mappings parameter
 * @param mappings configuration of templates and modules to be used in the transformation
 * @returns An array of JSON FHIR objects
 */
export async function processInput(input: transformVariables, mappings:MappingTarget[]): Promise<object[]> {

  InputSingleton.getInstance().setInput(input);

  const resources: object[] = [];

  const resourceExpressions = await setup(mappings)

  await Promise.all(
    resourceExpressions.map(
      async (expression) => {        
        try {          
          const output = await expression.evaluate(input)          
          //the output can be an array of resources (e.g., lab results involve multiple linked resources)
          if (Array.isArray(output)) {            
            output.forEach((resource) => {
              //Some of the resources within the array may be empty (when no created due to missing information)
              if (Object.keys(resource).length > 0) resources.push(resource)
            }
            )

          }
          //include only non-empty outputs (empty objects are returned when the resource should not be part of the participant's bundle)
          else if (typeof output === 'object' && Object.keys(output).length > 0) {
            resources.push(output)
          }
          //TODO double-check types here
          //if none of the above, it should be an empty object or undefined
          /*else if (typeof output === 'object' && Object.keys(output).length === 0) {
          
          }
          else{
            
          }*/
        }
        catch (error) {          
          if (error instanceof UnexpectedInputException){            
            throw error;
            //console.info('@@@@@@@@@@@@@@@@@@@@ Input data error - to skip')
          }
          else{
            throw new Error(`Error while transforming a JSonata expression [${JSON.stringify(expression.ast())}]`, { cause: error })  
          }                    
          
        }

      }
    )
  )


  return resources;

}

/**
 * Turns an array of individual FHIR resources into a FHIR bundle
 * @param resources array of FHIR resources
 * @returns a FHIR bundle
 */
function generateBundle(resources: any[]): object {

  const resourcesBundle: { entry: any[], resourceType: string, type: string } = {
    entry: [],
    resourceType: "Bundle",
    type: "transaction"
  };


  resources.forEach((resource) => {

    if ('id' in resource) {
      //Using a fixed namespace to ensure the UUIDs are always the same given the resource id.
      const resourceUUID = uuidv5(resource.id, privateNameSpace);
      const bundleEntry = { "fullUrl": `urn:uuid:${resourceUUID}`, "request":{"method": "POST", "url":"http://localhost:8080/fhir"},"resource": resource };
      resourcesBundle.entry.push(bundleEntry);
    }
    else {
      throw new Error(`Resource ${resource} does not have an 'id' property.`);
    }

  })

  return resourcesBundle;

}

export type MappingTarget = {
  template: string;
  module: string;
}

/**
 * Perform a transformation of all the data given as 'input', based on the configurations
 * of templates and modules of the 'mappings' parameter, into a JSON FHIR bundle
 * @param input 
 * @param mappings 
 * @returns 
 */
export const transform = function (input: any,mappings:MappingTarget[]): Promise<object> {
  return processInput(input,mappings).then((output: object[]) => {
    return generateBundle(output)
  }
  )
}



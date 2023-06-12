import * as parameters from './transformationParameters';
import { v5 as uuidv5 } from 'uuid';
import { InputSingleton } from './inputSingleton';

/**
 * 
 */
export const idToUUID = (id: string) => `urn:uuid:${uuidv5(id, parameters.privateNameSpace)}`

//export const captureInput = (input: any) => {
//    InputSingleton.getInstance().setInput(input);
//}

export const inputValue = (name:string) => InputSingleton.getInstance().getInput()[name];

export const echo = (text:string) => console.info(`ECHO: ${text}`);

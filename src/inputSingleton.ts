import { Mutex } from 'async-mutex';
import {transformVariables,variableAssessments} from './functionsCatalog'

export class InputSingleton {
    private static instance: InputSingleton;
  
    private input!: transformVariables;
    private mutex: Mutex;
    
    private constructor() {
      // initialize singleton instance
      this.mutex = new Mutex();
    }
  
    public setInput(input:transformVariables){

      //replace empty spaces in the input data with 'undefined'
      for (const variable in input){
        for (const assessment in input[variable]){
          if (input[variable][assessment]?.trim()==='') input[variable][assessment]=undefined
        }
      }
        this.input = input;
    }

    public getInput(varName:string):variableAssessments{
        return this.input[varName];
    }

    public getMutex():Mutex{
      return this.mutex;
    }


    public static getInstance(): InputSingleton {
      if (!InputSingleton.instance) {
        InputSingleton.instance = new InputSingleton();
      }
      return InputSingleton.instance;
    }
  
    
  }
  
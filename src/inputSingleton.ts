import { Mutex } from 'async-mutex';

export class InputSingleton {
    private static instance: InputSingleton;
  
    private input: any;
    private mutex: Mutex;
    
    private constructor() {
      // initialize singleton instance
      this.mutex = new Mutex();
    }
  
    public setInput(input:any){
        this.input = input;
    }

    public getInput():any{
        return this.input;
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
  
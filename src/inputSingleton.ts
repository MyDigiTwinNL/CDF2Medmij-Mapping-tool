
export class InputSingleton {
    private static instance: InputSingleton;
  
    input: any;
    
    private constructor() {
      // initialize singleton instance
    }
  
    public setInput(input:any){
        this.input = input;
    }

    public getInput():any{
        return this.input;
    }

    public static getInstance(): InputSingleton {
      if (!InputSingleton.instance) {
        InputSingleton.instance = new InputSingleton();
      }
      return InputSingleton.instance;
    }
  
    
  }
  
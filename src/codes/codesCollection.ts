import * as fs from "fs";
import * as path from "path";
import  {parse}  from 'csv-parse/sync';


/**
 * Type that defines the details that are provided for a code in any coding system
 */
export type CodeProperties = {
    display: string;
    code: string;
    system: string;    
}

/**
 * To be removed once all the mappings are no dependant on statically defined code objects
 */
export type CodesSubset = {
    [key: string]: CodeProperties;
  };


export const getSNOMEDCode = (code:string):CodeProperties => {
    return CodesCollection.getInstance().getSNOMEDCode(code);
}

export const getLOINCCode = (code:string):CodeProperties => {
    return CodesCollection.getInstance().getLOINCCode(code);
}

export const getUCUMCode = (code:string):CodeProperties => {
    return CodesCollection.getInstance().getUCUMCode(code);
}



/**
 * Singleton to access the details (CodeProperties) of the currently available codes
 */
export class CodesCollection {
    private static instance: CodesCollection | null = null;
    private snomedMap = new Map<string, CodeProperties>();
    private loincMap = new Map<string, CodeProperties>();
    private manchetMap = new Map<string, CodeProperties>();
    private fhirv3Map = new Map<string, CodeProperties>();
    private ucumMap = new Map<string, CodeProperties>();

    private loadCodesFile = (filePath:string):Map<string, CodeProperties> =>{
        const codesMap = new Map<string, CodeProperties>();
        const records:CodeProperties[] = parse(fs.readFileSync(filePath,'utf8'),{
            columns: true,
            skip_empty_lines: true
          });
        for (const record of records){
            codesMap.set(record.code,record)
        }

        return codesMap
    }

    private constructor() {
        this.snomedMap = this.loadCodesFile(path.resolve(__dirname, '../../codefiles/snomed.csv'))
        this.loincMap = this.loadCodesFile(path.resolve(__dirname, '../../codefiles/loinc.csv'))
        this.manchetMap = this.loadCodesFile(path.resolve(__dirname, '../../codefiles/manchet.csv'))
        this.fhirv3Map = this.loadCodesFile(path.resolve(__dirname, '../../codefiles/fhirv3.csv'))
        this.ucumMap = this.loadCodesFile(path.resolve(__dirname, '../../codefiles/ucum.csv'))
    };

    public static getInstance(): CodesCollection {
        if (!this.instance) {
            this.instance = new CodesCollection();
        }
        return this.instance;
    }

    public getSNOMEDCode(code:string): CodeProperties {
        const codeProp = this.snomedMap.get(code);
        if (codeProp!==undefined) return codeProp;
        throw Error(`Error while trying to access an undefined SNOMED code ${code}`)
    }

    public getLOINCCode(code:string): CodeProperties {
        const codeProp = this.loincMap.get(code);
        if (codeProp!==undefined) return codeProp;
        throw Error(`Error while trying to access an undefined LOINC code ${code}`)
    }

    public getUCUMCode(code:string): CodeProperties {
        const codeProp = this.ucumMap.get(code);
        if (codeProp!==undefined) return codeProp;
        throw Error(`Error while trying to access an undefined UCUM (units of measurement) code ${code}`)
    }



}

//const cl = CodesCollection.getInstance();
//console.info(cl.getSNOMEDCode('6685009'))
//console.info(cl.getLOINCCode('14646-4'))



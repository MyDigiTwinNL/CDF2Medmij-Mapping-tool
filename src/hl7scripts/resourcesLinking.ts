import {MappingTarget,transform,processInput} from '../mapper'
import * as path from 'path';

function hasPath<T>(obj: T, path: string): boolean {
    const pathArr = path.split('.');
    let currentObj: any = obj;
  
    for (const key of pathArr) {
      if (!(key in currentObj)) {
        return false;
      }
  
      currentObj = currentObj[key];
    }
  
    return true;
  }
  

function getValueAtPath<T>(obj: T, path: string): any {
    const pathArr = path.split('.');
    let currentObj: any = obj;
  
    for (const key of pathArr) {
      if (!(key in currentObj)) {
        return undefined;
      }
  
      currentObj = currentObj[key];
    }
  
    return currentObj;
  }


test('Linking between resources', () => {  
    const input = {
        "PROJECT_PSEUDO_ID": {"1A":"520681571"},
        "VARIANT_ID": {},
        "DATE": {"1A":"5/1992","1B":"5/1995","1C":"5/1997","2A":"5/2001","3A":"5/2003","3B":"5/2005"},
        "AGE": {"1A":"22"},            
        "hdlchol_result_all_m_1":       {"1A":"0.31","2A":"0.32"},
        "ldlchol_result_all_m_1":       {"1A":"0.41","2A":"0.42"},
    }

    const targets:MappingTarget[] = [    
        { "template": './zib-2017-mappings/LDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/LDLCholesterol'},
        { "template": './zib-2017-mappings/LDLCholesterol_Observation.jsonata', "module": './lifelines/LDLCholesterol'},
        { "template": './zib-2017-mappings/LDLCholesterol_Specimen.jsonata', "module": './lifelines/LDLCholesterol'}
    ]
    
    //This test is coupled to a specific implementation of the processInput function
    
    //transform(input,targets).then((bundle)=>{
    //  console.info(bundle)
    //});

    /*processInput(input,targets).then((outputResources)=>{
      //two waves of each resource  
      expect(outputResources.length).toBe(6);
      
      const diagnostic1a = outputResources[0]
      const observation1a = outputResources[2]
      const specimen1a = outputResources[4]

      expect (diagnostic1a)


        console.info(outputResources[0]);
        console.info(outputResources[1]);
    })*/
    //processInput(input,targets).then((outputResources)=>{
    //    outputResources[0]
    //})
    //expect(path.resolve("./")).toBe('/Users/hcadavid/eScience/MyDigiTwin/JSONataHarmonization')
    /*transform(input,targets).then((output)=>{

        export async function processInput(input: any, mappings:MappingTarget[]): Promise<object[]> {

        expect(hasPath(output,"aaa")).toBeTruthy;
        expect(getValueAtPath(output,"aaa")).toBe
        const val = output.xxx??{}
        expect(output.ssss).toEqual('jogn');
        //console.info(JSON.stringify(output));
    }*/
    
  
  });




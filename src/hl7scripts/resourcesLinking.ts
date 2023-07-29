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
        "project_pseudo_id": {"1a":"520681571"},
        "variant_id": {},
        "date": {"1a":"1992-5","1b":"1995-5","1c":"1997-5","2a":"2001-5","2b":"2002-5","3a":"2003-5","3b":"2005-5"},
        "age": {"1a":"22"},            
        "hdlchol_result_all_m_1":       {"1a":"0.31","2a":"0.32"},
        "ldlchol_result_all_m_1":       {"1a":"0.41","2a":"0.42"},
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




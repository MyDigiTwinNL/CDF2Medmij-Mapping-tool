import fs from 'fs';

import {MappingTarget,transform} from './mapper'

const input = JSON.parse(fs.readFileSync('./input/lifelines-ma/input.json', 'utf8'));

const targets:MappingTarget[] = [
  { "template": '../zib-2017-mappings/Diabetes.jsonata', "module": './lifelines/Diabetes'},
  { "template": '../zib-2017-mappings/LDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/LDLCholesterol'},
  { "template": '../zib-2017-mappings/LDLCholesterol_Observation.jsonata', "module": './lifelines/LDLCholesterol'},
  { "template": '../zib-2017-mappings/LDLCholesterol_Specimen.jsonata', "module": './lifelines/LDLCholesterol' },
  { "template": '../zib-2017-mappings/Hypertension.jsonata', "module": './lifelines/Hypertension' },
  { "template": '../zib-2017-mappings/HDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/HDLCholesterol'},
  { "template": '../zib-2017-mappings/HDLCholesterol_Observation.jsonata', "module": './lifelines/HDLCholesterol'},
  { "template": '../zib-2017-mappings/HDLCholesterol_Specimen.jsonata', "module": './lifelines/HDLCholesterol' },
  

]


transform(input,targets).then((output)=>{
  console.info(JSON.stringify(output));
}
)


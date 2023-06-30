import fs from 'fs';
import * as path from 'path';
import {MappingTarget,transform} from './mapper'


const targets:MappingTarget[] = [
  { "template": '../zib-2017-mappings/Diabetes.jsonata', "module": './lifelines/Diabetes'},
  { "template": '../zib-2017-mappings/BloodPressure.jsonata', "module": './lifelines/BloodPressure'},
  { "template": '../zib-2017-mappings/LDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/LDLCholesterol'},
  { "template": '../zib-2017-mappings/LDLCholesterol_Observation.jsonata', "module": './lifelines/LDLCholesterol'},
  { "template": '../zib-2017-mappings/LDLCholesterol_Specimen.jsonata', "module": './lifelines/LDLCholesterol' },
  { "template": '../zib-2017-mappings/Hypertension.jsonata', "module": './lifelines/Hypertension' },
  { "template": '../zib-2017-mappings/HDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/HDLCholesterol'},
  { "template": '../zib-2017-mappings/HDLCholesterol_Observation.jsonata', "module": './lifelines/HDLCholesterol'},
  { "template": '../zib-2017-mappings/HDLCholesterol_Specimen.jsonata', "module": './lifelines/HDLCholesterol' },
  { "template": '../zib-2017-mappings/Patient.jsonata', "module": './lifelines/Patient' },
  { "template": '../zib-2017-mappings/TobaccoUse.jsonata', "module": './lifelines/TobaccoUse' }

]


const main = (inputPath:string) =>{

  //To resolve all relative paths from the 'dist' folder.
  const folderPath = path.resolve(__dirname);
  process.chdir(folderPath);
  
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    transform(input,targets).then((output)=>{
      console.info(JSON.stringify(output));
    }
  )  
}


// Check if a file exists
const validateFileExistence = (fileName: string):boolean => {
  try {
    fs.accessSync(fileName);
    return true;
  } catch (error) {
    return false;
  }
}

// Get command line arguments
const args: string[] = process.argv.slice(2);

// Extract the file name
const fileName: string | undefined = args[0];

if (fileName) {
  const absFilePath=path.resolve(fileName)
  if (validateFileExistence(absFilePath)) {
    main(absFilePath);
  } else {
    console.log(`File '${absFilePath}' does not exist.`);
  }
} else {
  console.log(`Expected input: node ${__filename.slice(__dirname.length + 1, -3)} <file-name>`);
}









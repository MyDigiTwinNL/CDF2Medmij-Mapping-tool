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

//To resolve all relative paths from the 'dist' folder.
const folderPath = path.resolve(__dirname);
process.chdir(folderPath);


const inputFileToStdout = (filePath:string) =>{
  const input = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    transform(input,targets).then((output)=>{
      console.info(JSON.stringify(output));
    }
  )  
}

const inputFileToFolder = (filePath:string,outputFolder:string) =>{
  const input = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    transform(input,targets).then((output)=>{

      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath);
      const fileNameWithoutExtension = fileName.replace(fileExtension, '');
      const fhirFileName = `${fileNameWithoutExtension}-fhir${fileExtension}`;
      const outputFilePath = path.join(outputFolder, fhirFileName);
    
      fs.writeFileSync(outputFilePath, JSON.stringify(output));

    }
  )  
}



// Check if a file exists
const validateFileExistence = (filePath: string):boolean => {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

const validateFolderExistence = (folderPath: string): boolean => {
  try {
    const stats = fs.statSync(folderPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}


function printCommandLineArguments(): void {
  console.log('Program parameters details:');
  console.log('Process all the files in a folder (output folder is mandatory):');
  console.log(`node ${__filename.slice(__dirname.length + 1, -3)} <input folder path> -o <output folder path>`);
  console.log('Process a single file and generate a file with the output in a given folder:');
  console.log(`node ${__filename.slice(__dirname.length + 1, -3)} <input file path> -o <output folder path>`);
  console.log('Process a single file and print the output on STDOUT:');
  console.log(`node ${__filename.slice(__dirname.length + 1, -3)} <input file path>`);
}

function processArguments(args: string[]): void {
  if (args.length === 0) {
    printCommandLineArguments()
    return;
  }

  let folderPath: string | null = null;
  let filePath: string | null = null;
  let outputFolder: string | null = null;

  if (args.length === 1) {
    const arg = args[0];
    if (validateFolderExistence(arg)) {
      console.error('Error: a folder path was given as an input, but the output folder is missing (-o option followed by the output folder)');
      return;
    } else if (validateFileExistence(arg)) {
      inputFileToStdout(arg);
    } else {
      console.error(`Error: the path or folder given as an input does not exist: '${arg}'`);
      return;
    }
  } 
  else if (args.length === 3) {
    const arg1 = args[0];
    const arg2 = args[1];
    const arg3 = args[2];

    if (arg2 === '-o') {
      if (validateFolderExistence(arg1)) {
        folderPath = arg1;
        outputFolder = arg3;
      } else if (validateFileExistence(arg1)) {
        filePath = arg1;
        outputFolder = arg3;
      } else {
        console.error(`Error: Invalid path '${arg1}'`);
        return;
      }
    } else {
      console.error('Error: Invalid command');
      printCommandLineArguments();
      return;
    }
  } else {
    console.error('Error: Invalid command');
    printCommandLineArguments()
    return;
  }
}

// Get command line arguments
const args: string[] = process.argv.slice(2);
processArguments(args);

// Extract the file name
/*const fileName: string | undefined = args[0];

if (fileName) {
  const absFilePath=path.resolve(fileName)
  if (validateFileExistence(absFilePath)) {
    main(absFilePath);
  } else {
    console.log(`File '${absFilePath}' does not exist.`);
  }
} else {
  console.log(`Expected input: node ${__filename.slice(__dirname.length + 1, -3)} <file-name>`);
}*/









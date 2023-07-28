import fs from 'fs';
import * as path from 'path';
import { MappingTarget, transform } from './mapper'
import {InputSingleton} from './inputSingleton'


const targets: MappingTarget[] = [
  { "template": '../zib-2017-mappings/Diabetes.jsonata', "module": './lifelines/Diabetes' },
  { "template": '../zib-2017-mappings/BloodPressure.jsonata', "module": './lifelines/BloodPressure' },
  /*{ "template": '../zib-2017-mappings/LDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/LDLCholesterol' },
  { "template": '../zib-2017-mappings/LDLCholesterol_Observation.jsonata', "module": './lifelines/LDLCholesterol' },
  { "template": '../zib-2017-mappings/LDLCholesterol_Specimen.jsonata', "module": './lifelines/LDLCholesterol' },
  { "template": '../zib-2017-mappings/Hypertension.jsonata', "module": './lifelines/Hypertension' },*/
  { "template": '../zib-2017-mappings/HDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/HDLCholesterol' },
  { "template": '../zib-2017-mappings/HDLCholesterol_Observation.jsonata', "module": './lifelines/HDLCholesterol' },
  { "template": '../zib-2017-mappings/HDLCholesterol_Specimen.jsonata', "module": './lifelines/HDLCholesterol' },
  /*{ "template": '../zib-2017-mappings/TobaccoUse.jsonata', "module": './lifelines/TobaccoUse' },
  { "template": '../zib-2017-mappings/Stroke.jsonata', "module": './lifelines/Stroke' },
  { "template": '../zib-2017-mappings/TotalCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/TotalCholesterol' },
  { "template": '../zib-2017-mappings/TotalCholesterol_Observation.jsonata', "module": './lifelines/TotalCholesterol' },
  { "template": '../zib-2017-mappings/TotalCholesterol_Specimen.jsonata', "module": './lifelines/TotalCholesterol' },*/
  { "template": '../zib-2017-mappings/Patient.jsonata', "module": './lifelines/Patient' },
]

/**
 * //To resolve all relative paths from the 'dist' folder.
 */
const resolveLocalPath = () => {
  const folderPath = path.resolve(__dirname);
  process.chdir(folderPath);
}

const inputFileToStdout = (filePath: string) => {
  resolveLocalPath();

  /*Transformation performed with a mutex to prevent async race conditions due to the shared variable (InputSingletone)
    between the mapping modules and the JSONata templates. The mutex is released after the transformation is performed
    so the input cannot be changed in the process.*/
  InputSingleton.getInstance().getMutex().acquire().then((releasemutex) => {
    const input = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    transform(input, targets).then((output) => {
      console.info(JSON.stringify(output));
      releasemutex();
    })

  });

  
}

const inputFileToFolder = (filePath: string, outputFolder: string) => {
  //To resolve all relative paths from the 'dist' folder.
  resolveLocalPath();

  //See comment on inputFileToStdout
  InputSingleton.getInstance().getMutex().acquire().then((releasemutex) => {
    const input = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    transform(input, targets).then((output) => {
  
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath);
      const fileNameWithoutExtension = fileName.replace(fileExtension, '');
      const fhirFileName = `${fileNameWithoutExtension}-fhir${fileExtension}`;
      const outputFilePath = path.join(outputFolder, fhirFileName);
  
      fs.writeFileSync(outputFilePath, JSON.stringify(output));
      
      console.info(`${filePath} ====> ${outputFilePath})`);      
      
      releasemutex();
    }
    ).catch((error)=>{
        console.info(`Transformation of file ${filePath} failed. Cause: ${error.cause}`);      
    })

  });

  
}

const inputFolderToOutputFolder = (inputFolder: string, outputFolder: string) => {

  const fileNames: string[] = fs.readdirSync(inputFolder);
  fileNames.forEach((fileName) => {
    const filePath: string = path.join(inputFolder, fileName);
    const fileStats: fs.Stats = fs.statSync(filePath);
    if (fileStats.isFile() && fileName.toLowerCase().endsWith(".json")) {
      inputFileToFolder(filePath, outputFolder);            
    }
  });

}


// Check if a file exists
const validateFileExistence = (filePath: string): boolean => {
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
  console.log(`npm run transform -- <input folder path> -o <output folder path>`);
  console.log('Process a single file and generate a file with the output in a given folder:');
  console.log(`npm run transform -- <input file path> -o <output folder path>`);
  console.log('Process a single file and print the output on STDOUT:');
  console.log(`npm run transform -- <input file path>`);
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
      filePath = path.resolve(arg)
      inputFileToStdout(filePath);
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
      if (validateFolderExistence(arg1) && validateFolderExistence(arg3)) {
        folderPath = path.resolve(arg1);
        outputFolder = path.resolve(arg3);
        inputFolderToOutputFolder(folderPath, outputFolder);
      } else if (validateFileExistence(arg1) && validateFolderExistence(arg3)) {
        filePath = path.resolve(arg1);
        outputFolder = path.resolve(arg3);
        inputFileToFolder(filePath, outputFolder);
      } else {
        console.error(`Error: Invalid or non existing input/output paths. Input: ${arg1}, Output: ${arg3}`);
        return;
      }
    } else {
      console.error('Error: Invalid arguments');
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





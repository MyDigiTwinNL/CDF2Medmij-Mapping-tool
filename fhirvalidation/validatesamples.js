const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Directory containing the sample input files
const directoryPath = path.join(__dirname, './sampleinputs');


// Generate a random folder name to store the temporary input files and the JAR output
const outputTempFolder = fs.mkdtempSync(path.join(os.tmpdir(), Math.random().toString(36).substring(7)));
const logsTempFolder = fs.mkdtempSync(path.join(os.tmpdir(), Math.random().toString(36).substring(7)));

execSync('tsc');

const fhirvpath = process.env.fhirvpath;
if (!fhirvpath) {


  let errorMsg = `ERROR: The environment variable [fhirvpath] is not defined. 
  This variable should have the path where the HL7 FHIR validator (validator_cli.jar) is located. 
  The validator can be downloaded at https://github.com/hapifhir/org.hl7.fhir.core/releases/download/6.0.10/validator_cli.jar
  `
  console.error(errorMsg);
  process.exit(1);
}

const validatorCliPath = path.join(fhirvpath, 'validator_cli.jar');
if (!fs.existsSync(validatorCliPath)) {
  console.error('ERROR: The fhirvpath does not contain the validator_cli.jar file');
  process.exit(1);
}

// Get the list of files in the directory
const files = fs.readdirSync(directoryPath);

// Create temporary input files
const tempInputFiles = files.map((file) => {
  const filePath = path.join(directoryPath, file);
  const randomFileName = Math.random().toString(36).substring(7) + '.json';
  const tempInputFile = path.join(outputTempFolder, randomFileName);
  const tsCommand = `node ${path.join(__dirname, '..', 'dist', 'transform')}  ${filePath} > ${tempInputFile}`;  
  console.info(`Executing ${tsCommand}`)
  
  execSync(tsCommand, { cwd: `${path.join(__dirname, '..', 'dist')}` });

  return tempInputFile;
});

// Execute the JAR command with the path to temporary input files
const jarOutputFile = path.join(logsTempFolder, 'output.log.txt');
const jarCommand = `java -jar ${process.env.fhirvpath}/validator_cli.jar ${outputTempFolder} -version 3.0.2 -ig nictiz.fhir.nl.stu3.zib2017#2.2.8 -sct nl  -level error  -output-style compact > ${jarOutputFile}`;
let output = ""
try {
  output = execSync(jarCommand);
  console.log(`FHIR validation successful (exited with code 0). Log file path:${jarOutputFile}`);
} catch (error) {
  console.error('FHIR Resources validation failed (non-zero exit code) - Log file path:${jarOutputFile}');
  if (error.stderr) {
    console.error('Error output:');
    console.error(error.stderr.toString());
    const outputContent = fs.readFileSync(jarOutputFile, 'utf8');
    console.log(outputContent);
    process.exit(1)
  }
}


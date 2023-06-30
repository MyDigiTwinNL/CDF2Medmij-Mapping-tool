const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Directory containing the files
const directoryPath = './sampleinputs';

// Generate a random folder name to store the temporary input files and the JAR output
const outputTempFolder = fs.mkdtempSync(path.join(os.tmpdir(), Math.random().toString(36).substring(7)));
const logsTempFolder = fs.mkdtempSync(path.join(os.tmpdir(), Math.random().toString(36).substring(7)));

// Compile TypeScript code
execSync('tsc');

// Check if the environment variable is defined
if (!process.env.fhirvpath) {
  console.error('ERROR: The environment variable fhirvpath is not defined');
  process.exit(1);
}

// Get the list of files in the directory
const files = fs.readdirSync(directoryPath);

// Create temporary input files
const tempInputFiles = files.map((file) => {
  const filePath = path.join(directoryPath, file);
  const randomFileName = Math.random().toString(36).substring(7) + '.json';
  const tempInputFile = path.join(outputTempFolder, randomFileName);
  const tsCommand = `node ../dist/transform  ${filePath} > ${tempInputFile}`;

  console.info(`Executing ${tsCommand}`)

  execSync(tsCommand);
  return tempInputFile;
});

// Execute the JAR command with the path to temporary input files
const jarOutputFile = path.join(logsTempFolder, 'output.log.txt');
const jarCommand = `java -jar ${process.env.fhirvpath}/validator_cli.jar ${outputTempFolder} -version 3.0.2 -ig nictiz.fhir.nl.stu3.zib2017#2.2.8 -sct nl  -level error  -output-style compact > ${jarOutputFile}`;
let output = ""
try {
  output = execSync(jarCommand);
  console.log(`Command exited with code 0. Log file path:${jarOutputFile}`);
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


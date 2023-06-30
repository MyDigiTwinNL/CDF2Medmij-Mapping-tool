const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Directory containing the files
const directoryPath = './sampleinputs';

// Generate a random folder name to store the output files
const randomFolderName = Math.random().toString(36).substring(7);
const outputFolder = fs.mkdtempSync(os.tmpdir() + '/') + randomFolderName;
fs.mkdirSync(outputFolder);

// Compile TypeScript code
execSync('tsc');

// Check if the environment variable is defined
if (!process.env.fhirvpath) {
  console.error('ERROR: The environment variable fhirvpath is not defined');
  process.exit(1);
}

// Get the list of files in the directory
const files = fs.readdirSync(directoryPath);

// Execute the TypeScript code for each file
files.forEach((file) => {
  // Get the full path of the file
  const filePath = path.join(directoryPath, file);

  // Execute the TypeScript code and redirect the output to a random file in the output folder
  const randomFileName = Math.random().toString(36).substring(7) + '.json';
  const outputFile = path.join(outputFolder, randomFileName);
  const tsCommand = `node ../dist/transform ${filePath} > ${outputFile}`;
  console.info(`Running ${tsCommand}`)
  execSync(tsCommand);
});

// Execute the JAR command for each output file
const outputFiles = fs.readdirSync(outputFolder);
outputFiles.forEach((outputFile) => {
  // Get the full path of the output file
  const outputFilePath = path.join(outputFolder, outputFile);

  // Execute the JAR command
  const jarCommand = `java -jar ${process.env.fhirvpath}/validator_cli.jar ${outputFilePath} -version 3.0.2 -ig nictiz.fhir.nl.stu3.zib2017#2.2.8 -sct nl -output-style compact`;
  try {
    execSync(jarCommand);
    console.log(`JAR command for ${outputFile} exited with code 0`);
  } catch (error) {
    console.error(`JAR command for ${outputFile} execution failed with non-zero exit code`);
  }
});


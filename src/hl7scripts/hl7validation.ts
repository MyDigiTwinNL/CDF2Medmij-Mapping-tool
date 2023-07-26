import { exec } from 'child_process';
import { MappingTarget, transform, processInput } from '../mapper';
import fs from 'fs';

/*test('diabetes clinical status, when never reported', async () => {
  const output = "";
  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/LDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/LDLCholesterol', "prefix": 'LDLCholesterol' },
    { "template": './zib-2017-mappings/LDLCholesterol_Observation.jsonata', "module": './lifelines/LDLCholesterol', "prefix": 'LDLCholesterol' },
    { "template": './zib-2017-mappings/LDLCholesterol_Specimen.jsonata', "module": './lifelines/LDLCholesterol', "prefix": 'LDLCholesterol' }
  ];

  const input = {
    "project_pseudo_id": { "1a": "520681571" },
    "variant_id": {},
    "date": { "1a": "5/1992", "1b": "5/1995", "1C": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
    "age": { "1a": "22" },
    "hdlchol_result_all_m_1": { "1a": "0.31", "2a": "0.32" },
    "ldlchol_result_all_m_1": { "1a": "0.41", "2a": "0.42" },
  };

  const transformedOutput = await transform(input, targets);
  const command = `echo '${JSON.stringify(transformedOutput)}' | java -jar /Users/hcadavid/eScience/MyDigiTwin/MedMij-Profile-validator/validator_cli.jar /dev/stdin -version 3.0.2 -ig nictiz.fhir.nl.stu3.zib2017#2.2.8 -sct nl -output-style compact`;

  exec(command, (error, stdout, stderr) => {
    // Check the return code
    expect(error).toBeNull();
    expect(stderr).toBe('');

    // Assert the expected output
    // expect(stdout).toContain('Expected Output');
    // Modify the 'toContain' matcher to match your specific expected output

    
  });
});
*/


  const output = "";
  const targets: MappingTarget[] = [
    { "template": '../zib-2017-mappings/LDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/LDLCholesterol'},
    { "template": '../zib-2017-mappings/LDLCholesterol_Observation.jsonata', "module": './lifelines/LDLCholesterol'},
    { "template": '../zib-2017-mappings/LDLCholesterol_Specimen.jsonata', "module": './lifelines/LDLCholesterol' }
  ];

  const input = {
    "project_pseudo_id": { "1a": "520681571" },
    "variant_id": {},
    "date": { "1a": "5/1992", "1b": "5/1995", "1C": "5/1997", "2a": "5/2001", "3a": "5/2003", "3b": "5/2005" },
    "age": { "1a": "22" },
    "hdlchol_result_all_m_1": { "1a": "0.31", "2a": "0.32" },
    "ldlchol_result_all_m_1": { "1a": "0.41", "2a": "0.42" },
  };

  const transformedOutput = transform(input, targets).then((bundle) => {
    const outputPath = "/tmp/output.json"
    fs.writeFileSync(outputPath, JSON.stringify(bundle));
    console.info("RUNNING HL7 validator")
    const command = `java -jar /Users/hcadavid/eScience/MyDigiTwin/MedMij-Profile-validator/validator_cli.jar ${outputPath} -version 3.0.2 -ig nictiz.fhir.nl.stu3.zib2017#2.2.8 -sct nl -output-style compact -tx n/a`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running the JAR file: ${error.message}`);
        process.exit(1);
      }
      else{
        console.error(`HL7 validation success: error code 0`);
      }

      
            
    });


  }
  );

  
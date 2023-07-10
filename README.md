# FHIR Cohort Data Transformer

The FHIR Cohort Data Transformer is a TypeScript tool designed to transform cohort-study data into FHIR-compliant data. This tool allows you to specify and test the pairing rules between the cohort-study data and the properties of a given FHIR resource. Once you have defined these rules, you can link them to one or more FHIR-compliant templates.

## Features

- Transform cohort-study data into FHIR-compliant data
- Allows the definition of pairing rules between cohort-study data and FHIR resource properties
- Paring rules are specified in independent modules to make them testeable

## Prerequisites

To use this tool, ensure you have the following installed:

- Node.js (version 12 or higher)
- npm (Node Package Manager)
- TypeScript (installed globally)

## Installation

1. Clone the repository from GitHub:

```bash
git clone https://github.com/your-username/fhir-cohort-data-transformer.git
```

2. Navigate to the project directory:

```bash
cd fhir-cohort-data-transformer
```

3. Install the dependencies:

```bash
npm install
```

4. Compile

```bash
tsc
```


## Usage

1. To create new pairing rules or JSON output-templates, refer to the developer manual. 

* To run the unit tests :

  ```bash
  npm test
  ```

* To run the linter :

  ```bash
  npm run lint
  ```
* To transform the available input samples (./fhirvalidation/sampleinputs), and check the validity of their corresponding transformations against a FHIR profile:

  ```bash  
  npm run validatesamples
  ```

  
1. Tp generate FHIR-compliant data based on the rules already defined, and the mapping configuration:

```bash
#Transform a single file, print the ouput to STDOUT
npm run transform -- ./fhirvalidation/sampleinputs/input-p1234.json
#Transform a single file, save the output on the given folder
npm run transform -- ./fhirvalidation/sampleinputs/input-p1234.json -o /tmp/out
#Transform all the .json files in a given folder, save the output on the given folder
npm run transform -- ./fhirvalidation/sampleinputs -o /tmp/out
```

## Configuration

To configure which pairing-rule modules will be used on which JSON output-templates, edit the file ...

## Developer documentation

The developer documentation with the description of the tool design, and further details for creating new templates/pairing rules [can be found here](./docs/development.md).


## License

This project is licensed under the [MIT License](LICENSE).



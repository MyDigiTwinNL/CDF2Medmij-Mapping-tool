# FHIR templates creation

!!! warning "Under Development"
    
    This tool is under active development. The documentation is not complete yet. If you have any 
    questions, please contact us via [GitHub Issues](https://github.com/MyDigiTwinNL/CDF2Medmij-Mapping-tool/issues)

Work in progress

- JSONata reference - operators
- Tool-specific/pairing rule interface functions

    $results()
    $isDefined()
    $idToUUID
    $resourceID

## Defining an output template

Templates that can be reused:

- Problem/Condition
- Laboratory result

For other specific MedMij resources, a template need to be created from the technical information from Nictiz. For example, Vaccination/Immunization- the following referneces would be useful:

* Vaccination/Immunization- profile (structure definition)- requires checking (url)
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/1.3.4/files/113799

* ZIBs documentation:
https://zibs.nl/wiki/HCIM_Release_2017(EN)


* Vaccination/Immunization- examples. By checking the cardinality specified in the previous two, it can be identified which elements are not considered in the example
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.12/files/2002637

Create a file with .jsonata extension


### Automatic generation/cross-reference of UUIDs

#### FHIR resources (1 <-> 0..1)

**$resourceId** function

````
$resourceId('zib-hypertension')
````

#### FHIR resources (1 <-> 0..N)

**$waveSpecificResourceId** function

````
$waveSpecificResourceId('zib-laboratorytestresult-specimen-hdl',$result.assessment)
````
# Pairing rules


!!! warning "Under Development"
    
    This tool is under active development. The documentation is not complete yet. If you have any 
    questions, please contact us via [GitHub Issues](https://github.com/MyDigiTwinNL/CDF2Medmij-Mapping-tool/issues)

Work in progress

- Existing interfaces
        
        LaboratoryTestResults


Implementing the interfaces

    Typesystem

API

    getting the value of a variable for a given assessment
        inputValue("gender","1a");
    
    Sometimes the output depends on whether the asessment on a given wave was performed or not
    
        assessmentMissed("")
    
    Assertions that abort the transformation of the current patient:

    
        assertIsDefined(inputValue("date","1a"),`Precondition failed: date of baseline assessment (1a) is expected to be not-null for eGFR calculations`)


Getting codes: SNOMED, LOINC, ...
//error when non existing


## Test-driven-development

1. Pick template/interface
2. Add specification for the functions
3. Test case implementation - use equivalence classes partitioning or other approaches

test('eGFRS for male, black participant', () => {

  const input = {
   
    "creatinine_result_all_m_1":{ "1a": "79.2", "2a":"106.1"},//in umol/L
    "ethnicity_category_adu_q_1":{"1b":"3"},
    "gender" : { "1a":"MALE"},
    "date": {/*date1*/ "1a":"1990-1","1b":"1995-5","1c":"1997-5",/*date2*/"2a":"2000-1","3a":"2003-5","3b":"2005-5"},
    "age": { "1a": "40" },  //age on "2a": 50  
    "project_pseudo_id": { "1a": "520681571" },
  }  

  InputSingleton.getInstance().setInput(input);
  const results = eGFRS.results();
  expect(results.length).toBe(2);  
  expect((results[0] as TestResultEntry).testResult).toBeCloseTo(124,0)
  expect((results[0] as TestResultEntry).resultFlags).toBe(undefined)
  expect((results[1] as TestResultEntry).testResult).toBeCloseTo(81,0)  
  expect((results[1] as TestResultEntry).resultFlags).toBe(undefined)

  

});



4. 
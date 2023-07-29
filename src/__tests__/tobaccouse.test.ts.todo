import { InputSingleton } from '../inputSingleton';
import { TobaccoUseProperties } from '../lifelines/TobaccoUse'
import * as tobbacousemf from '../lifelines/TobaccoUse'
import { tobaccoUseStatusSNOMEDCodelist } from '../codes/snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'


test('non-smoker', () => {

  const input = {
    "current_smoker_adu_c_2": { "1a": "2", "1b": "2", "1c": "2", "2a": "2", "2b": "2", "3a": "2"},
    "smoking_startage_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": ""},
    "ex_smoker_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": ""},
    "smoking_endage_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": ""},
    "ever_smoker_adu_c_2": { "1a": "2", "1b": "2", "1c": "2", "2a": "2", "2b": "2", "3a": "2"},
    "total_frequency_adu_c_1": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": ""},
    "packyears_cumulative_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": ""},
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "2b": "5/2003", "3a": "5/2005"},
    "age": { "1a": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  const mappingResult = tobbacousemf.results();

  expect((mappingResult[0] as TobaccoUseProperties).useStatus === tobaccoUseStatusSNOMEDCodelist.non_smoker);

});



test('participant was an ex-smoker before the first assessment', () => {

  const input = {
    "current_smoker_adu_c_2": { "1a": "2", "1b": "2", "1c": "2", "2a": "2", "2b": "2", "3a": "2" },
    "smoking_startage_adu_c_2": { "1a": "20", "1b": "20", "1c": "20", "2a": "20", "2b": "20", "3a": "20" },
    "ex_smoker_adu_c_2": { "1a": "1", "1b": "1", "1c": "1", "2a": "1", "2b": "1", "3a": "1" },
    "smoking_endage_adu_c_2": { "1a": "30", "1b": "30", "1c": "30", "2a": "30", "2b": "30", "3a": "30" },
    "ever_smoker_adu_c_2": { "1a": "1", "1b": "1", "1c": "1", "2a": "1", "2b": "1", "3a": "1" },
    "total_frequency_adu_c_1": { "1a": "5", "1b": "5", "1c": "5", "2a": "5", "2b": "5", "3a": "5" },
    "packyears_cumulative_adu_c_2": { "1a": "200", "1b": "200", "1c": "200", "2a": "200", "2b": "200", "3a": "200" },
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "2b": "5/2003", "3a": "5/2005", "3b": "5/2009" },
    "age": { "1a": "40" }
  }

  InputSingleton.getInstance().setInput(input);
  const mappingResult = tobbacousemf.results();

  expect((mappingResult[0] as TobaccoUseProperties).useStatus).toBe(tobaccoUseStatusSNOMEDCodelist.ex_smoker);
  expect((mappingResult[0] as TobaccoUseProperties).smokingStartDate).toBe("1972");
  expect((mappingResult[0] as TobaccoUseProperties).smokingEndDate).toBe("1982");

});



test('participant started smoking before the baseline assessment and was still a smoker in the last assessment', () => {

  const input = {
    "current_smoker_adu_c_2": { "1a": "1", "1b": "1", "1c": "1", "2a": "1", "2b": "1", "3a": "1" },
    "smoking_startage_adu_c_2": { "1a": "20", "1b": "20", "1c": "20", "2a": "20", "2b": "20", "3a": "20" },
    "ex_smoker_adu_c_2": { "1a": "2", "1b": "2", "1c": "2", "2a": "2", "2b": "2", "3a": "2" },
    "smoking_endage_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": "" },
    "ever_smoker_adu_c_2": { "1a": "1", "1b": "1", "1c": "1", "2a": "1", "2b": "1", "3a": "1" },
    "total_frequency_adu_c_1": { "1a": "5", "1b": "5", "1c": "5", "2a": "5", "2b": "5", "3a": "5" },
    "packyears_cumulative_adu_c_2": { "1a": "200", "1b": "200", "1c": "200", "2a": "200", "2b": "200", "3a": "200" },
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "2b": "5/2003", "3a": "5/2005", "3b": "5/2009" },
    "age": { "1a": "40" }
  }

  InputSingleton.getInstance().setInput(input);
  const mappingResult = tobbacousemf.results();

  expect((mappingResult[0] as TobaccoUseProperties).useStatus).toBe(tobaccoUseStatusSNOMEDCodelist.daily);
  expect((mappingResult[0] as TobaccoUseProperties).smokingStartDate).toBe("1972");
  expect((mappingResult[0] as TobaccoUseProperties).currentSmoker).toBe(true);

});


test('participant started smoking after the baseline assessment and was still a smoker in the last assessment', () => {

  const input = {
    "current_smoker_adu_c_2":   { "1a": "2", "1b": "2", "1c": "2", "2a": "1", "2b": "1", "3a": "1" },
    "smoking_startage_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "20", "2b": "20", "3a": "20" },
    "ex_smoker_adu_c_2":        { "1a": "2", "1b": "2", "1c": "2", "2a": "2", "2b": "2", "3a": "2" },
    "smoking_endage_adu_c_2":   { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": "" },
    "ever_smoker_adu_c_2":      { "1a": "2", "1b": "2", "1c": "2", "2a": "1", "2b": "1", "3a": "1" },
    "total_frequency_adu_c_1":  { "1a": "", "1b": "", "1c": "", "2a": "5", "2b": "5", "3a": "5" },
    "packyears_cumulative_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "200", "2b": "200", "3a": "200" },
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "2b": "5/2003", "3a": "5/2005", "3b": "5/2009" },
    "age": { "1a": "40" }
  }

  InputSingleton.getInstance().setInput(input);
  const mappingResult = tobbacousemf.results();

  expect((mappingResult[0] as TobaccoUseProperties).useStatus).toBe(tobaccoUseStatusSNOMEDCodelist.non_smoker);  
  expect((mappingResult[0] as TobaccoUseProperties).currentSmoker).toBe(false);

  expect((mappingResult[3] as TobaccoUseProperties).assessment).toBe("2a");
  expect((mappingResult[3] as TobaccoUseProperties).useStatus).toBe(tobaccoUseStatusSNOMEDCodelist.daily);
  expect((mappingResult[3] as TobaccoUseProperties).smokingStartDate).toBe("1972");
  expect((mappingResult[3] as TobaccoUseProperties).currentSmoker).toBe(true);


});

test('participant started smoking after the baseline assessment and quit smoking before the last assessment', () => {

  
  const input = {
    "current_smoker_adu_c_2":   { "1a": "2", "1b": "1", "1c": "1", "2a": /*ex-smoker*/"2", "2b": "2", "3a": "2" },
    "smoking_startage_adu_c_2": { "1a": "", "1b": "42", "1c": "42", "2a": "42", "2b": "42", "3a": "42" },
    "ex_smoker_adu_c_2":        { "1a": "2", "1b": "2", "1c": "2", "2a": /*ex-smoker*/ "1", "2b": "1", "3a": "1" },
    "smoking_endage_adu_c_2":   { "1a": "", "1b": "", "1c": "", "2a": "48", "2b": "48", "3a": "48" },
    "ever_smoker_adu_c_2":      { "1a": "2", "1b": "1", "1c": "1", "2a": "1", "2b": "1", "3a": "1" },
    "total_frequency_adu_c_1":  { "1a": "", "1b": "5", "1c": "5", "2a": "", "2b": "", "3a": "" },
    "packyears_cumulative_adu_c_2": { "1a": "", "1b": "200", "1c": "200", "2a": "200", "2b": "200", "3a": "200" },
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "2b": "5/2003", "3a": "5/2005", "3b": "5/2009" },
    "age": { "1a": "40" }
  }

  InputSingleton.getInstance().setInput(input);
  const mappingResult = tobbacousemf.results();

  expect((mappingResult[0] as TobaccoUseProperties).assessment).toBe("1a");
  expect((mappingResult[0] as TobaccoUseProperties).useStatus).toBe(tobaccoUseStatusSNOMEDCodelist.non_smoker);  
  expect((mappingResult[0] as TobaccoUseProperties).currentSmoker).toBe(false);

  expect((mappingResult[1] as TobaccoUseProperties).assessment).toBe("1b");
  expect((mappingResult[1] as TobaccoUseProperties).useStatus).toBe(tobaccoUseStatusSNOMEDCodelist.daily);  
  expect((mappingResult[1] as TobaccoUseProperties).smokingStartDate).toBe("1994");
  expect((mappingResult[1] as TobaccoUseProperties).currentSmoker).toBe(true);
  
  expect((mappingResult[3] as TobaccoUseProperties).assessment).toBe("2a");
  expect((mappingResult[3] as TobaccoUseProperties).useStatus).toBe(tobaccoUseStatusSNOMEDCodelist.ex_smoker);
  expect((mappingResult[1] as TobaccoUseProperties).smokingStartDate).toBe("1994");
  expect((mappingResult[3] as TobaccoUseProperties).smokingEndDate).toBe("2000");
  expect((mappingResult[3] as TobaccoUseProperties).currentSmoker).toBe(false);


});



/**
 * The following tests are intended only for identifying problems between the TobaccoUse module with 
 * its corresponding JSONata template, which would lead to a JSONata-library error (test failures).
 */
test('Resource generation - participant started smoking before the baseline assessment and was still a smoker in the last assessment', () => {

  const input = {
    "current_smoker_adu_c_2": { "1a": "1", "1b": "1", "1c": "1", "2a": "1", "2b": "1", "3a": "1" },
    "smoking_startage_adu_c_2": { "1a": "20", "1b": "20", "1c": "20", "2a": "20", "2b": "20", "3a": "20" },
    "ex_smoker_adu_c_2": { "1a": "2", "1b": "2", "1c": "2", "2a": "2", "2b": "2", "3a": "2" },
    "smoking_endage_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": "" },
    "ever_smoker_adu_c_2": { "1a": "1", "1b": "1", "1c": "1", "2a": "1", "2b": "1", "3a": "1" },
    "total_frequency_adu_c_1": { "1a": "5", "1b": "5", "1c": "5", "2a": "5", "2b": "5", "3a": "5" },
    "packyears_cumulative_adu_c_2": { "1a": "200", "1b": "200", "1c": "200", "2a": "200", "2b": "200", "3a": "200" },
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "2b": "5/2003", "3a": "5/2005", "3b": "5/2009" },
    "age": { "1a": "40" },
    "project_pseudo_id": { "1a": "520681571" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/TobaccoUse.jsonata', "module": './lifelines/TobaccoUse' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(6);
  })

});


test('Resource generation - non-smoker', () => {

  const input = {
    "current_smoker_adu_c_2": { "1a": "2", "1b": "2", "1c": "2", "2a": "2", "2b": "2", "3a": "2", "3b": "2" },
    "smoking_startage_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": "", "3b": "" },
    "ex_smoker_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": "", "3b": "" },
    "smoking_endage_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": "", "3b": "" },
    "ever_smoker_adu_c_2": { "1a": "2", "1b": "2", "1c": "2", "2a": "2", "2b": "2", "3a": "2", "3b": "2" },
    "total_frequency_adu_c_1": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": "", "3b": "" },
    "packyears_cumulative_adu_c_2": { "1a": "", "1b": "", "1c": "", "2a": "", "2b": "", "3a": "", "3b": "" },
    "date": { "1a": "5/1992", "1b": "5/1995", "1c": "5/1997", "2a": "5/2001", "2b": "5/2003", "3a": "5/2005", "3b": "5/2009" },
    "age": { "1a": "22" },
    "project_pseudo_id": { "1a": "520681571" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/TobaccoUse.jsonata', "module": './lifelines/TobaccoUse' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(6);
  })

});






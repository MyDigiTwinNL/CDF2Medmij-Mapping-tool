import { InputSingleton } from '../inputSingleton';
import {TobaccoUseProperties} from '../lifelines/TobaccoUse'
import * as tobbacousemf from '../lifelines/TobaccoUse'
import { tobaccoUseStatusSNOMEDCodelist} from '../snomedCodeLists';
import { MappingTarget, processInput } from '../mapper'


test('non-smoker', () => {

  const input = {
    "currentsmoker_v2": { "1A": "2", "1B": "2", "1C": "2", "2A": "2", "2B": "2", "3A": "2", "3B": "2" },
    "smoking_startage_adu_c_2": { "1A": "", "1B": "", "1C": "", "2A": "", "2B": "", "3A": "", "3B": "" },
    "ex_smoker_adu_c_2": { "1A": "", "1B": "", "1C": "", "2A": "", "2B": "", "3A": "", "3B": "" },
    "smoking_endage_adu_c_2": { "1A": "", "1B": "", "1C": "", "2A": "", "2B": "", "3A": "", "3B": "" },
    "ever_smoker_adu_c_2": { "1A": "2", "1B": "2", "1C": "2", "2A": "2", "2B": "2", "3A": "2", "3B": "2" },
    "total_frequency_adu_c_1": { "1A": "", "1B": "", "1C": "", "2A": "", "2B": "", "3A": "", "3B": "" },
    "packyears_cumulative_adu_c_2": { "1A": "", "1B": "", "1C": "", "2A": "", "2B": "", "3A": "", "3B": "" },
    "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "2B": "5/2003", "3A": "5/2005", "3B": "5/2009" },
    "AGE": { "1A": "22" }
  }

  InputSingleton.getInstance().setInput(input);
  const mappingResult = tobbacousemf.results();

  expect((mappingResult[0] as TobaccoUseProperties).useStatus===tobaccoUseStatusSNOMEDCodelist.non_smoker);  

});



test('participant was an ex-smoker before the first assessment', () => {

  const input = {
    "currentsmoker_v2": { "1A": "2", "1B": "2", "1C": "2", "2A": "2", "2B": "2", "3A": "2"},
    "smoking_startage_adu_c_2": { "1A": "20", "1B": "20", "1C": "20", "2A": "20", "2B": "20", "3A": "20"},
    "ex_smoker_adu_c_2": { "1A": "1", "1B": "1", "1C": "1", "2A": "1", "2B": "1", "3A": "1"},
    "smoking_endage_adu_c_2": { "1A": "30", "1B": "30", "1C": "30", "2A": "30", "2B": "30", "3A": "30"},
    "ever_smoker_adu_c_2": { "1A": "1", "1B": "1", "1C": "1", "2A": "1", "2B": "1", "3A": "1"},
    "total_frequency_adu_c_1": { "1A": "5", "1B": "5", "1C": "5", "2A": "5", "2B": "5", "3A": "5"},
    "packyears_cumulative_adu_c_2": { "1A": "200", "1B": "200", "1C": "200", "2A": "200", "2B": "200", "3A": "200"},
    "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "2B": "5/2003", "3A": "5/2005", "3B": "5/2009" },
    "AGE": { "1A": "40" }
  }

  InputSingleton.getInstance().setInput(input);
  const mappingResult = tobbacousemf.results();

  expect((mappingResult[0] as TobaccoUseProperties).useStatus===tobaccoUseStatusSNOMEDCodelist.ex_smoker);  
  expect((mappingResult[0] as TobaccoUseProperties).smokingStartDate==="1972");  
  expect((mappingResult[0] as TobaccoUseProperties).smokingEndDate==="1982");  

});



test('participant started smoking before the baseline assessment and in the last assessent still smoked', () => {

  const input = {
    "currentsmoker_v2": { "1A": "1", "1B": "1", "1C": "1", "2A": "1", "2B": "1", "3A": "1"},
    "smoking_startage_adu_c_2": { "1A": "20", "1B": "20", "1C": "20", "2A": "20", "2B": "20", "3A": "20"},
    "ex_smoker_adu_c_2": { "1A": "2", "1B": "2", "1C": "2", "2A": "2", "2B": "2", "3A": "2"},
    "smoking_endage_adu_c_2": { "1A": "", "1B": "", "1C": "", "2A": "", "2B": "", "3A": ""},
    "ever_smoker_adu_c_2": { "1A": "1", "1B": "1", "1C": "1", "2A": "1", "2B": "1", "3A": "1"},
    "total_frequency_adu_c_1": { "1A": "5", "1B": "5", "1C": "5", "2A": "5", "2B": "5", "3A": "5"},
    "packyears_cumulative_adu_c_2": { "1A": "200", "1B": "200", "1C": "200", "2A": "200", "2B": "200", "3A": "200"},
    "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "2B": "5/2003", "3A": "5/2005", "3B": "5/2009" },
    "AGE": { "1A": "40" }
  }

  InputSingleton.getInstance().setInput(input);
  const mappingResult = tobbacousemf.results();

  expect((mappingResult[0] as TobaccoUseProperties).useStatus).toBe(tobaccoUseStatusSNOMEDCodelist.occasional);  
  expect((mappingResult[0] as TobaccoUseProperties).smokingStartDate).toBe("1972");  
  expect((mappingResult[0] as TobaccoUseProperties).currentSmoker).toBe(true);  

});


test('Diabates resource generation when not reported', () => {

  const input = {
      "currentsmoker_v2": { "1A": "1", "1B": "1", "1C": "1", "2A": "1", "2B": "1", "3A": "1"},
      "smoking_startage_adu_c_2": { "1A": "20", "1B": "20", "1C": "20", "2A": "20", "2B": "20", "3A": "20"},
      "ex_smoker_adu_c_2": { "1A": "2", "1B": "2", "1C": "2", "2A": "2", "2B": "2", "3A": "2"},
      "smoking_endage_adu_c_2": { "1A": "", "1B": "", "1C": "", "2A": "", "2B": "", "3A": ""},
      "ever_smoker_adu_c_2": { "1A": "1", "1B": "1", "1C": "1", "2A": "1", "2B": "1", "3A": "1"},
      "total_frequency_adu_c_1": { "1A": "5", "1B": "5", "1C": "5", "2A": "5", "2B": "5", "3A": "5"},
      "packyears_cumulative_adu_c_2": { "1A": "200", "1B": "200", "1C": "200", "2A": "200", "2B": "200", "3A": "200"},
      "DATE": { "1A": "5/1992", "1B": "5/1995", "1C": "5/1997", "2A": "5/2001", "2B": "5/2003", "3A": "5/2005", "3B": "5/2009" },
      "AGE": { "1A": "40" },
      "PROJECT_PSEUDO_ID": { "1A": "520681571" }
  }

  const targets: MappingTarget[] = [
    { "template": './zib-2017-mappings/TobbacoUse.jsonata', "module": './lifelines/TobbacoUse' },
  ]

  processInput(input, targets).then((output: object[]) => {
    expect(output.length).toBe(1);
  })

});







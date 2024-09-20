import moize from 'moize'
import {lifelinesDateToISO, lifelinesMeanDate} from '../lifelinesFunctions'
import {inputValue, inputValues,variableAssessments} from '../functionsCatalog';
import {Condition} from '../fhir-resource-interfaces/condition'
import {getSNOMEDCode,CodeProperties} from '../codes/codesCollection'
import {assertIsDefined} from '../unexpectedInputException'

export const diabetes:Condition = {

    conditionName: function (): string {
        return "diabetes";
    },
    isPresent: function (): boolean {        
        return _clinicalStatus(inputValue("diabetes_presence_adu_q_1", "1a"), inputValues("diabetes_followup_adu_q_1")) === getSNOMEDCode("55561003")
    },
    clinicalStatus: function (): CodeProperties | undefined {
        return _clinicalStatus(inputValue("diabetes_presence_adu_q_1", "1a"), inputValues("diabetes_followup_adu_q_1"))
    },
    onsetDateTime: function (): string | undefined {
        assertIsDefined(inputValue("date","1a"),'failed precondition: non-null date is expected (Diabetes)')

        if (inputValue("diabetes_presence_adu_q_1","1a")==='1'){
            const surveyDateParts = inputValue("date","1a")!.split("-");
            const surveyYear = Number(surveyDateParts[0]);
    
            const diabetesStartAge = inputValue("diabetes_startage_adu_q_1","1a")
            const age = inputValue("age","1a")
    
            if (diabetesStartAge!==undefined && age!=undefined){
                const surveyAge = Number(inputValue("age","1a"));   
                return (surveyYear - surveyAge + Number(diabetesStartAge)).toString();
            }
            else{
                return undefined
            }
    
            
        }
        else{
            
            const result = findDatesBetweenDiabetesPresenceReport();
            if (result!=undefined){
                const [date1,date2]=result;
                return lifelinesDateToISO(lifelinesMeanDate(date1,date2))
            }
            else{
                return undefined;            
            }
    
    
        }
    },
    verificationStatus: function (): CodeProperties {
        return getSNOMEDCode("UNK");
    },
    code: function (): CodeProperties {
        return determineCode();
    }
}


/**
 * Memoized function for clinicalStatus
 */
const _clinicalStatus = moize((diab_presence:string|undefined,followup_assessments:variableAssessments):CodeProperties|undefined  => {        
    if (diab_presence==="1"){
        return getSNOMEDCode("55561003")
    }
    else if (Object.values(followup_assessments).some((wavereading) => wavereading === "1")){
        return getSNOMEDCode("55561003")
    }
    else{
        return undefined
    }    
})

/* 
 * 
 * Helper function for 'onsetDateTime'
 * 
 * @param diabFollowUp 
 * 
 * @return
 *      If the date of the assessment where diabetes_followup_adu_q_1 = yes is available =>
 *          mean date between that particular date (when diabetes_followup_adu_q_1 = yes), and the date of the preceding assessment.
 *      Else
 *          return undefined date
 * 
 * @precondition: there is at least one 'yes'/1 on diabetes_followup_adu_q_1
 * @precondition there is always a date on one of the assessment prior to the one where diabetes_followup_adu_q_1 was 'yes'
 * 
 */
function findDatesBetweenDiabetesPresenceReport(): [string,string]|undefined{
    
    const diabFollowUp:variableAssessments = inputValues('diabetes_followup_adu_q_1')      
    
    //find the first positive report on diabetes_followup_adu_q_1, and its corresponding date
    const diabetesRepWave = Object.keys(diabFollowUp).find((key) => diabFollowUp[key] === '1');
    
    assertIsDefined(diabetesRepWave,`A 'yes' value on diabetes_followup_adu_q_1 was expected`)    

    const diabetesRepWaveDate = inputValue("date",diabetesRepWave)
    if (diabetesRepWaveDate === undefined){
        return undefined
    } 
    else{
        //find the previous non-undefined assessment date
        const assessmentDates:variableAssessments = inputValues('date')            
        const waves = ['1a','1b','1c','2a','3a','3b'];    
        const previousWaves = waves.slice(0,waves.indexOf(diabetesRepWave))
        const previousAssessmentWave = previousWaves.reverse().find((pwave)=>assessmentDates[pwave]!==undefined)
        
        assertIsDefined(previousAssessmentWave,`Assessment (with a defined date) expected to exist previous to the one where diabetes_followup_adu_q_1 is reported`)

        const previousAssessmentDate:string = assessmentDates[previousAssessmentWave]!;
        return [previousAssessmentDate,diabetesRepWaveDate]
    }




  }


/**
 *                              [1A][1B][1C][2A][3A][3B]
 * diabetes_type_adu_q_1        [X ][  ][  ][  ][  ][  ] what type of diabetes do you have? (1) type 1, (2) type 2, (3) other type, (4) I do not know
 * diabetes_type_adu_q_1_a      [X ][  ][  ][  ][  ][  ] another type of diabetes
 * t1d_followup_adu_q_1         [  ][  ][  ][X ][X ][X ] did the health problems listed below start since the last time
 * t2d_followup_adu_q_1         [  ][  ][  ][X ][X ][X ] did the health problems listed below start since the last time
 * diabetes_presence_adu_q_1    [X ][  ][  ][  ][  ][  ]
 * diabetes_followup_adu_q_1    [  ][X ][X ][X ][X ][X ]
 * 
 * @precondition
 *      - the problem is 'active' (see clinicalStatus function)
 *      - there are no 'yes' values in both t1d_followup_adu_q_1 and t1d_followup_adu_q_2 (the two types of diabetes are mutually exclusive)
 *      - when there is a yes in diabetes_followup_adu_q_1, there should be a yes in either t1d_followup_adu_q_1 and t2d_followup_adu_q_1 
 *      - if there is a yes in 'diabetes_presence_adu_q_1', there should be a value in 'diabetes_type_adu_q_1'
 *      
 * @pairingrule 
 *      if diabetes_presence_adu_q_1[1A] is 'yes', and diabetes_type_adu_q_1 is either 1 or 2 => corresponding SNOMED diabetes type code
 *      else if diabetes_presence_adu_q_1[1A] is 'yes', and diabetes_type_adu_q_1 is neither 1 or 2 => **UNDEFINED** (see @questions)
 *      else
 *          if there is a 'yes' in t1d_followup_adu_q_1 => SNOMED code for diabates type 1
 *          else if there is a 'yes' in t2d_followup_adu_q_1 or  => SNOMED-diabates type 2
 *           else - error/precondition #3 violated

 */
export const determineCode = ():CodeProperties => {
    
    if (inputValue('diabetes_presence_adu_q_1',"1a")==='1'){

        const diabetesType = inputValue('diabetes_type_adu_q_1',"1a")

        //"1","type 1 (juvenile diabetes, usually since childhood)","type 1 (jeugddiabetes, meestal van kinds af aan)"
        if (diabetesType==='1') return getSNOMEDCode("46635009");
        //"2","type 2 (adult-onset diabetes, usually started at a later age)","type 2 (ouderdomsdiabetes, meestal op latere leeftijd)"
        else if (diabetesType==='2') return getSNOMEDCode("44054006");
        //"3","other type:","andere vorm, nl."
        else if (diabetesType==='3') {
            /**
             * To be defined (Issue #2)
             * 
             * TODO: re-code open ended values from diabetes_type_adu_q_1_a
             */
            //const otherType = inputValue('diabetes_type_adu_q_1_a',"1a")                        
            return getSNOMEDCode("73211009");
        }
        //"4","i do not know","weet ik niet"
        //missing value
        else{
            return getSNOMEDCode("73211009");
        }                

    }
    else{
        const t1dfollowup = inputValues("t1d_followup_adu_q_1")

        if (Object.values(t1dfollowup).some((wavereading) => wavereading === "1")){
            return getSNOMEDCode("46635009");
        }
        else{
            const t2dfollowup = inputValues("t2d_followup_adu_q_1")
            if (Object.values(t2dfollowup).some((wavereading) => wavereading === "1")){
                return getSNOMEDCode("44054006");
            }
            else{                
                //return unidentified diabetes type (https://github.com/MyDigiTwinNL/CDF2Medmij-Mapping-tool/issues/23#issuecomment-2357954979)
                return getSNOMEDCode("73211009");
            }

        }

    }
    
}

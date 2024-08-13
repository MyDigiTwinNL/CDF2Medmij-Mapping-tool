import moize from 'moize'
import {lifelinesDateToISO, lifelinesMeanDate} from '../lifelinesFunctions'
import {inputValue, inputValues,variableAssessments} from '../functionsCatalog';
import {Condition} from '../fhir-resource-interfaces/condition'
import {getSNOMEDCode,CodeProperties} from '../codes/codesCollection'
import {assertIsDefined} from '../unexpectedInputException'

export const heartFailure:Condition = {

    conditionName: function (): string {
        return 'heart-failure';
    },

    isPresent: function (): boolean {
        return _clinicalStatus(inputValue("heartfailure_presence_adu_q_1", "1a"), inputValues("heartfailure_followup_adu_q_1")) === getSNOMEDCode("55561003")
    },


    /* Related variables:
    * ------------------------------------------------------------------
    *                                [1A][1B][1C][2A][3A][3B]

    * heartfailure_presence_adu_q_1:  [X ][  ][  ][  ][  ][  ]    
    * heartfailure_followup_adu_q_1:  [  ][X ][X ][X ][X ][X ] 
    * ------------------------------------------------------------------
    *
    * @precondition
    *      - no missing values
    *
    * @pairingrule
    *      if heartfailure_presence_adu_q_1 = yes in 1A => SNOMED code for active (55561003).
    *      else
    *          if heartfailure_presence_adu_q_1 = no, and there is a 'yes' on heartfailure_followup_adu_q_1 in any of the
    *          follow-up assessments => active.
    *          else
    *              undefined, as there is no such a thing as 'inactive' heartfailure given the
    *              definition used by the profile: Problems with the status 'Inactive' refer to problems that don't
    *              affect the patient anymore or that of which there is no evidence of existence anymore.
    */
    clinicalStatus: function (): CodeProperties | undefined {
        return _clinicalStatus(inputValue("heartfailure_presence_adu_q_1", "1a"), inputValues("heartfailure_followup_adu_q_1"));
    },


    /**
     *
     * Related variables:
     * ------------------------------------------------------------------
     *                                [1A][1B][1C][2A][3A][3B]
     * heartfailure_startage_adu_q_1   [X ][  ][  ][  ][  ][  ]
     * heartfailure_presence_adu_q_1   [X ][  ][  ][  ][  ][  ]
     * heartfailure_followup_adu_q_1   [  ][X ][X ][X ][X ][X ]
     * date                           [X ][X ][X ][X ][X ][X ]
     * ------------------------------------------------------------------
     *
     * @precondition
     *      - date and age are not missing values (undefined)
     *      - the problem is 'active' (see clinicalStatus function)
     *
     * @pairingrule
     *      if heartfailure_presence_adu_q_1 = yes in 1A => approximate year on which the participant given the age reported  by heartfailure_startage_adu_q_1
     *      else
     *          if there is a 'yes' in any heartfailure_followup_adu_q_1 => mean date between the date of the assessment
     *              where heartfailure_followup_adu_q_1 = yes, and the date of the preceding one.
     *          else
     *              error/precondition violated ('heartfailure' is not 'active' if the execution reached this point)
     *
     *
     */
    onsetDateTime: function (): string | undefined {
        const firstAssessmentDate = inputValue("date", "1a");

        assertIsDefined(firstAssessmentDate, 'non-null date expected for assessment 1a');
        const firstAssessmentAge = inputValue("age", "1a");

        if (inputValue("heartfailure_presence_adu_q_1", "1a") === '1') {
            const surveyDateParts = firstAssessmentDate.split("-");
            const surveyYear = Number(surveyDateParts[0]);

            const heartfailureStartAge = inputValue("heartfailure_startage_adu_q_1", "1a");
            if (heartfailureStartAge !== undefined && firstAssessmentAge !== undefined) {
                const surveyAge = Number(inputValue("age", "1a"));
                return (surveyYear - surveyAge + Number(heartfailureStartAge)).toString();
            }
            else {
                return undefined;
            }

        }
        else {

            const timeInterval = findDatesBetweenheartfailurePresenceReport();
            if (timeInterval != undefined) {
                const [date1, date2] = timeInterval;
                return lifelinesDateToISO(lifelinesMeanDate(date1, date2));
            }
            else {
                throw Error("Unexpected input (precondition violated): no 'yes' values in heartfailure_followup_adu_q_1");
            }


        }
    },


    /**
     * Verification status is undefined (SNOMED - UNK)
     */
    verificationStatus: function (): CodeProperties {
        return getSNOMEDCode("UNK")
    },

    /**
     * 
     * @returns SNOMED code for heart failure: 84114007
     * Parent: Disorder of cardiac function (disorder)
     * 
     */
    code: function (): CodeProperties {
        return getSNOMEDCode("84114007")
        
    },

}


/**
 * Memoized function for clinicalStatus
 */
const _clinicalStatus = moize((heartfailure_presence:string|undefined,followup_assessments:variableAssessments):CodeProperties|undefined => {        
    if (heartfailure_presence==="1"){
        return getSNOMEDCode("55561003")
    }
    else if (Object.values(followup_assessments).some((wavereading) => wavereading === "1")){
        return getSNOMEDCode("55561003")
    }
    else{
        return undefined
    }    
})


/**
 * Helper function for 'onsetDateTime'
 *                                [1a][1b][1c][2a][3a][3b]
 * heartfailure_followup_adu_q_1  [  ][X ][X ][X ][X ][X ]
 * date                           [X ][X ][X ][X ][X ][X ]
 * 
 * 
 * mean date between the date of the assessment 
 *              where heartfailure_followup_adu_q_1 = yes, and the date of the preceding one.
 * 
 * 
 * @param diabFollowUp 
 * @returns 
 */
function findDatesBetweenheartfailurePresenceReport(): [string,string]|undefined{

    const heartfailureFollowUp:variableAssessments = inputValues('heartfailure_followup_adu_q_1')    
    
    //find the first positive report on heartfailure_followup_adu_q_1, and its corresponding date
    const heartfailureWave = Object.keys(heartfailureFollowUp).find((key) => heartfailureFollowUp[key] === '1');
    
    assertIsDefined(heartfailureWave,`A 'yes' value on heartfailure_followup_adu_q_1 was expected`)

    const heartfailureWaveDate = inputValue("date",heartfailureWave)
    assertIsDefined(heartfailureWaveDate,`A non-null date is expected in the assessment where heartfailure_followup_adu_q_1 is reported`)

    //find the previous non-undefined assessment date
    const assessmentDates:variableAssessments = inputValues('date')            
    const waves = ['1a','1b','1c','2a','3a','3b'];    
    const previousWaves = waves.slice(0,waves.indexOf(heartfailureWave))
    const previousAssessmentWave = previousWaves.reverse().find((pwave)=>assessmentDates[pwave]!==undefined)
    
    assertIsDefined(previousAssessmentWave,`Assessment (with a non-null date) expected to exist previous to the one where heartfailure_followup_adu_q_1 is reported`)

    const previousAssessmentDate:string = assessmentDates[previousAssessmentWave!]!;
    return [previousAssessmentDate,heartfailureWaveDate]
  }
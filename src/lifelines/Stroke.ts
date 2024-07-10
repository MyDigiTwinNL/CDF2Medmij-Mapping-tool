
import moize from 'moize'
import {lifelinesDateToISO, lifelinesMeanDate} from '../lifelinesFunctions'
import {clinicalStatusSNOMEDCodeList,conditionsSNOMEDCodeList,verificationStatusSNOMEDCodeList} from '../codes/snomedCodeLists';

import {inputValue, inputValues,variableAssessments} from '../functionsCatalog';
import {assesmentMissed,collectedDateTime} from '../lifelinesFunctions'
import {Condition} from '../fhir-resource-interfaces/condition'
import {getSNOMEDCode,getLOINCCode,getUCUMCode,CodeProperties} from '../codes/codesCollection'
import {UnexpectedInputException, assertIsDefined} from '../unexpectedInputException'


export const stroke:Condition = {
    conditionName: function (): string {
        return "stroke"
    },

    /**
     * It is present if the clinical status is 'active' (SNOMED 55561003)
     */
    isPresent: function (): boolean {
        return _clinicalStatus(inputValue("stroke_presence_adu_q_1", "1a"), inputValues("stroke_followup_adu_q_1")) === getSNOMEDCode("55561003")
    },

    /* Related variables:
    * ------------------------------------------------------------------
    *                                [1A][1B][1C][2A][3A][3B]
    * stroke_presence_adu_q_1        [X ][  ][  ][  ][  ][  ]
    * stroke_followup_adu_q_1        [  ][X ][X ][X ][X ][X ]
    * ------------------------------------------------------------------
    *
    * @precondition
    *      - no missing values
    *
    * @pairingrule
    *      if stroke_presence_adu_q_1 = yes in 1A => SNOMED code for active (55561003).
    *      else
    *          if stroke_presence_adu_q_1 = no, and there is a 'yes' on stroke_followup_adu_q_1 in any of the
    *          follow-up assessments => active.
    *          else
    *              undefined, as there is no such a thing as 'inactive' stroke given the
    *              definition used by the profile: Problems with the status 'Inactive' refer to problems that don't
    *              affect the patient anymore or that of which there is no evidence of existence anymore.
    */
    clinicalStatus: function (): CodeProperties | undefined {
        return _clinicalStatus(inputValue("stroke_presence_adu_q_1", "1a"), inputValues("stroke_followup_adu_q_1"));
    },


    /**
     *
     * Related variables:
     * ------------------------------------------------------------------
     *                                [1A][1B][1C][2A][3A][3B]
     * stroke_startage_adu_q_1        [X ][  ][  ][  ][  ][  ]
     * stroke_presence_adu_q_1        [X ][  ][  ][  ][  ][  ]
     * stroke_followup_adu_q_1        [  ][X ][X ][X ][X ][X ]
     * date                           [X ][X ][X ][X ][X ][X ]
     * ------------------------------------------------------------------
     *
     * @precondition
     *      - date and age are not missing values (undefined)
     *      - the problem is 'active' (see clinicalStatus function)
     *
     * @pairingrule
     *      if stroke_presence_adu_q_1 = yes in 1A => approximate year on which the participant given the age reported  by stroke_startage_adu_q_1
     *      else
     *          if there is a 'yes' in any stroke_followup_adu_q_1 => mean date between the date of the assessment
     *              where stroke_followup_adu_q_1 = yes, and the date of the preceding one.
     *          else
     *              error/precondition violated ('stroke' is not 'active' if the execution reached this point)
     *
     * @notes
     *
     *      - Given the question stroke_followup_adu_q_1: "did the health problems listed below start since the last time you filled
     *          in the lifelines questionnaire?", and considering that this variable was collected only in 2A, 3A and 3B, when a 'yes'
     *          is reported in 2A, should this 'mean date' be calculated between the date of 1A and 2A, or between 1C and 2A?
     *          For the time being, 1A date will be used.
     *
     */
    onsetDateTime: function (): string | undefined {
        const firstAssessmentDate = inputValue("date", "1a");

        assertIsDefined(firstAssessmentDate, 'non-null date expected for assessment 1a (TobaccoUse/smokingStart)');
        //if (firstAssessmentDate==undefined) throw new UnexpectedInputException('non-null date expected for assessment 1a (TobaccoUse/smokingStart)');
        const firstAssessmentAge = inputValue("age", "1a");

        if (inputValue("stroke_presence_adu_q_1", "1a") === '1') {
            const surveyDateParts = firstAssessmentDate.split("-");
            const surveyYear = Number(surveyDateParts[0]);

            const strokeStartAge = inputValue("stroke_startage_adu_q_1", "1a");
            if (strokeStartAge !== undefined && firstAssessmentAge !== undefined) {
                const surveyAge = Number(inputValue("age", "1a"));
                return (surveyYear - surveyAge + Number(strokeStartAge)).toString();
            }
            else {
                return undefined;
            }

        }
        else {

            const timeInterval = findDatesBetweenStrokePresenceReport();
            if (timeInterval != undefined) {
                const [date1, date2] = timeInterval;
                return lifelinesDateToISO(lifelinesMeanDate(date1, date2));
            }
            else {
                throw Error("Unexpected input (precondition violated): no 'yes' values in stroke_followup_adu_q_1");
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
     * @returns SNOMED code for cerebro vascular accident - 230690007
     */
    code: function (): CodeProperties {
        return getSNOMEDCode("230690007")
    },

}


/**
 * Memoized function for clinicalStatus
 */
const _clinicalStatus = moize((stroke_presence:string|undefined,followup_assessments:variableAssessments):CodeProperties|undefined => {        
    if (stroke_presence==="1"){
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
 * stroke_followup_adu_q_1        [  ][X ][X ][X ][X ][X ]
 * date                           [X ][X ][X ][X ][X ][X ]
 * 
 * 
 * mean date between the date of the assessment 
 *              where stroke_followup_adu_q_1 = yes, and the date of the preceding one.
 * 
 * 
 * @param diabFollowUp 
 * @returns 
 */
function findDatesBetweenStrokePresenceReport(): [string,string]|undefined{

    const strokeFollowUp:variableAssessments = inputValues('stroke_followup_adu_q_1')    
    
    //find the first positive report on stroke_followup_adu_q_1, and its corresponding date
    const strokeWave = Object.keys(strokeFollowUp).find((key) => strokeFollowUp[key] === '1');
    
    assertIsDefined(strokeWave,`A 'yes' value on stroke_followup_adu_q_1 was expected`)

    const strokeWaveDate = inputValue("date",strokeWave)
    assertIsDefined(strokeWaveDate,`A non-null date is expected in the assessment where stroke_followup_adu_q_1 is reported`)

    //find the previous non-undefined assessment date
    const assessmentDates:variableAssessments = inputValues('date')            
    const waves = ['1a','1b','1c','2a','3a','3b'];    
    const previousWaves = waves.slice(0,waves.indexOf(strokeWave))
    const previousAssessmentWave = previousWaves.reverse().find((pwave)=>assessmentDates[pwave]!==undefined)
    
    assertIsDefined(previousAssessmentWave,`Assessment (with a non-null date) expected to exist previous to the one where stroke_followup_adu_q_1 is reported`)

    const previousAssessmentDate:string = assessmentDates[previousAssessmentWave!]!;
    return [previousAssessmentDate,strokeWaveDate]
  }
import { inputValue,createCheckedAccessProxy, inputValues } from '../functionsCatalog';
import { lifelinesDateToISO } from '../lifelinesFunctions'
import moize from 'moize'
import { cuffTypeManchetTypeCodeList } from '../codes/manchetCodeLists';
import { measuringLocationSNOMEDCodelist } from '../codes/snomedCodeLists';
import assert from 'assert'



/*
Based on HCIM Problem resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/1.3.4/files/113638/

Related Lifelines variables:
http://wiki.lifelines.nl/doku.php?id=blood_pressure
*/


export type BloodPressureReadingEntry = {
    "assessment":string,
    "cuffType": object|undefined,
    "measuringLocation": object|undefined,
    "systolicBloodPressure": number|undefined,
    "diastolicBloodPressure": number|undefined,
    "arterialBloodPressure": number|undefined,
    "collectedDateTime": string|undefined
}


/**
 * It is assumed (from Lifelines data analysis) that when 'date' is missing in an assessment, the
 * participant dropped the study or missed the assessment.
 * @param wave 
 * @returns true if the assessment was missed 
 */
const missedAsssesment = (wave:string) => inputValue("date",wave)==undefined



/**
 * HCIM BloodPressure:
 * The FHIR BloodPressure profile sets a minimum expectations for the Observation Resource to record, 
 * search and fetch the blood pressure associated with a patient.
 * 
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][3A][3B]
 * bpavg_systolic_all_m_1         [X ][  ][  ][X ][  ][  ]
 * bpavg_diastolic_all_m_1        [X ][  ][  ][X ][  ][  ]
 * bpavg_arterial_all_m_1         [X ][  ][  ][X ][  ][  ]
 * bp_entrytype_all_m_1           [X ][  ][  ][X ][  ][  ]
 * bp_bandsize_all_m_1            [X ][  ][  ][X ][X ][  ]
 * bp_arm_all_m_1                 [  ][  ][  ][  ][X ][  ]
 * date                           [X ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * 
 * @mappingrules
 *      - Two blood pressure measurements based on the systolic, diastolic and arterial readings from 1A and 2A
 *           "cuffType": Manchet code for bp_bandsize_all_m_1 value, in the corresponding assessment
 *           "measuringLocation": undefined *See question below
 *           "systolicBloodPressure": bpavg_systolic_all_m_1 value in the corresponding assesment
 *           "diastolicBloodPressure": bpavg_diastolic_all_m_1 value in the corresponding assesment
 *           "arterialBloodPressure": bpavg_arterial_all_m_1 value in the corresponding assesment
 *           "collectedDateTime": Date of the corresponding assessment
 * @question
 *      - The bp_arm_all_m_1 variable (Left or right arm?) was collected only in 3A. The blood pressure measurements 
 *          were collected in 1A and 2A. How to interpret this? Which 'measuring location' should we use in this case?:
 *          The SOP states that blood pressure is measured on the right upper arm, barring any contra-indications. 
 *          In case of a contra-indication, the left upper arm is used. Unfortunately, we don't know in which patients 
 *          there is a contra-indication. Best practice might be to omit the measurement location in the wave we are 
 *          uncertain about the location.
 *                
 */
export const results = function (): BloodPressureReadingEntry[] {

    const waves=["1a","2a"]

    return waves.map((wave) => 
        //return the data through the 'checked access' proxy to prevent silent data-access errors in JSONata (e.g., a mispelled property)
        createCheckedAccessProxy({
            "assessment":wave,
            "cuffType": cuffType(wave),
            "measuringLocation": undefined,
            "systolicBloodPressure": systolicBloodPressure(wave),
            "diastolicBloodPressure": diastolicBloodPressure(wave),
            "arterialBloodPressure": arterialBloodPressure(wave),
            "collectedDateTime": collectedDateTime(wave)
        })
    
    ).filter((bpentry:BloodPressureReadingEntry)=>!missedAsssesment(bpentry.assessment))

    
    return [
        createCheckedAccessProxy({
            "assessment":"1a",
            "cuffType": cuffType("1a"),
            "measuringLocation": undefined,
            "systolicBloodPressure": systolicBloodPressure("1a"),
            "diastolicBloodPressure": diastolicBloodPressure("1a"),
            "arterialBloodPressure": arterialBloodPressure("1a"),
            "collectedDateTime": collectedDateTime("1a")
        }),
        createCheckedAccessProxy({
            "assessment":"2a",
            "cuffType": cuffType("2a"),
            "measuringLocation": undefined,
            "systolicBloodPressure": systolicBloodPressure("2a"),
            "diastolicBloodPressure": diastolicBloodPressure("2a"),
            "arterialBloodPressure": arterialBloodPressure("2a"),
            "collectedDateTime": collectedDateTime("2a")
        })

    ]
}



/**
 * Lifelines' Categorical values - SNOMED/Manchet codes mapping
*/
/*1: left arm*/
/*2: right arm*/
export const measuring_location_codeMapping: { [key: string]: object } = {
    "1": measuringLocationSNOMEDCodelist.left_upper_arm_structure,
    "2": measuringLocationSNOMEDCodelist.right_upper_arm_structure
};

/*1:small adult cuff*/
/*2:medium adult cuff*/
/*3:large adult cuff*/
/*4:child cuff*/
/*5:thigh cuff (xl cuff)*/
const bp_bandsize_all_m_1_codeMapping: { [key: string]: object } = {
    "1": cuffTypeManchetTypeCodeList.klein,
    "2": cuffTypeManchetTypeCodeList.standard,
    "3": cuffTypeManchetTypeCodeList.groot,
    "4": cuffTypeManchetTypeCodeList.kind,
    "5": cuffTypeManchetTypeCodeList.extra_groot
};


export const cuffType = function (wave: string): object|undefined {
    const bandsize: string|undefined = inputValue("bp_bandsize_all_m_1",wave)

    if (bandsize!=undefined){
        return bp_bandsize_all_m_1_codeMapping[bandsize];
    }
    else{
        return undefined
    }
};


export const measuringLocation = function (wave: string): object|undefined {
    const lifelinesBpArmAll = inputValue("bp_arm_all_m_1",wave)
    if (lifelinesBpArmAll!=undefined){
        return measuring_location_codeMapping[lifelinesBpArmAll]
    }
    else{
        return undefined;
    }

    
};


export const systolicBloodPressure = function (wave: string): number|undefined {
    const sysv = inputValue("bpavg_systolic_all_m_1",wave);
    if (sysv!==undefined){
        return Number(sysv);
    }
    else{
        return undefined;
    }    
};

export const diastolicBloodPressure = function (wave: string): number|undefined {
    const diav = inputValue("bpavg_diastolic_all_m_1",wave)
    if (diav!==undefined){
        return Number(diav);
    }
    else{
        return undefined;
    }
};

export const arterialBloodPressure = function (wave: string): number|undefined {
    const artbpv = inputValue("bpavg_arterial_all_m_1",wave);
    if (artbpv!==undefined){
        return Number(artbpv);    
    }
    else{
        return undefined;
    }    
};


/**
 * 
 * @param wave 
 * @precondition date column has never missing values
 * @returns collected date time
 */
export const collectedDateTime = function (wave: string): string|undefined {
    const date = inputValue("date",wave);
    assert(date!=undefined,`Precondition failed - bloodpressure: missing date in assessment ${wave}`)
    return lifelinesDateToISO(date);    
    
}


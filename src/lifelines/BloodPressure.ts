import { inputValue } from '../functionsCatalog';
import { lifelinesDateToISO } from '../lifelinesFunctions'
import moize from 'moize'
import { cuffTypeManchetTypeCodeList } from '../manchetCodeLists';
import { measuringLocationSNOMEDCodelist } from '../snomedCodeLists';


/*
Based on HCIM Problem resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/1.3.4/files/113638/

Related Lifelines variables:
http://wiki.lifelines.nl/doku.php?id=blood_pressure
*/



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
 * DATE                           [X ][X ][X ][X ][X ][X ]
 * ------------------------------------------------------------------
 * 
 * 
 * @mappingrules
 *      - Two blood pressure measurements based on the systolic, diastolic and arterial readings from 1A and 2A
 *           "cuffType": Manchet code for bp_bandsize_all_m_1 value, in the corresponding assessment
 *           "measuringLocation": SNOMED code for bp_arm_all_m_1 from ("3A") *See question below
 *           "systolicBloodPressure": bpavg_systolic_all_m_1 value in the corresponding assesment
 *           "diastolicBloodPressure": bpavg_diastolic_all_m_1 value in the corresponding assesment
 *           "arterialBloodPressure": bpavg_arterial_all_m_1 value in the corresponding assesment
 *           "collectedDateTime": Date of the corresponding assessment
 * @question
 *      - The bp_arm_all_m_1 variable (Left or right arm?) was collected only in 3A. The blood pressure measurements 
 *          were collected in 1A and 2A. How to interpret this? Which 'measuring location' should we use in this case?
 *          
 *      
 */
export const results = function (): object[] {
    return [
        {
            "assessment":"1A",
            "cuffType": cuffType("1A"),
            "measuringLocation": measuringLocation("3A"),
            "systolicBloodPressure": systolicBloodPressure("1A"),
            "diastolicBloodPressure": diastolicBloodPressure("1A"),
            "arterialBloodPressure": arterialBloodPressure("1A"),
            "collectedDateTime": collectedDateTime("1A")
        },
        {
            "assessment":"2A",
            "cuffType": cuffType("2A"),
            "measuringLocation": measuringLocation("3A"),
            "systolicBloodPressure": systolicBloodPressure("2A"),
            "diastolicBloodPressure": diastolicBloodPressure("2A"),
            "arterialBloodPressure": arterialBloodPressure("2A"),
            "collectedDateTime": collectedDateTime("2A")
        }

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



export const cuffType = function (wave: string): object {
    const bandsize: string = inputValue("bp_bandsize_all_m_1",wave)
    return bp_bandsize_all_m_1_codeMapping[bandsize];
};


export const measuringLocation = function (wave: string): object {
    const lifelinesBpArmAll = inputValue("bp_arm_all_m_1",wave)
    return measuring_location_codeMapping[lifelinesBpArmAll]
};


export const systolicBloodPressure = function (wave: string): number {
    return Number(inputValue("bpavg_systolic_all_m_1",wave))
};

export const diastolicBloodPressure = function (wave: string): number {
    return Number(inputValue("bpavg_diastolic_all_m_1",wave))
};

export const arterialBloodPressure = function (wave: string): number {
    return Number(inputValue("bpavg_arterial_all_m_1",wave))
};

export const collectedDateTime = function (wave: string): string {
    return lifelinesDateToISO(inputValue("DATE",wave));
}


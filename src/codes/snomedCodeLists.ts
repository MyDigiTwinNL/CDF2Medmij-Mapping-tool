/**
 * This module is deprecated. 
 * It will be removed once all the pairing rules are updated to use the
 * strongly-typed methods provided by the codesCollection module.
 * 
 */


export const typeOfTobaccoUsedSNOMEDCodelist = {
    "cigarrette":{"system": "http://snomed.info/sct","display":"Cigarette smoker (finding)","code":"65568007"},        
    "cigar":{"system": "http://snomed.info/sct","display":"Cigar smoker (finding)","code":"59978006"},
    "pipe":{"system": "http://snomed.info/sct","display":"Pipe smoker (finding)","code":"82302008"},
    "rolls_own_cigarrettes":{"system": "http://snomed.info/sct","display":"Rolls own cigarettes (finding)","code":"160619003"},
    "other":{"system": "http://snomed.info/sct","display":"Other","code":"OTH"}    
}

export const tobaccoUseStatusSNOMEDCodelist = {
    "daily":{"system": "http://snomed.info/sct","display":"Smokes tobacco daily (finding)","code":"449868002"},
    "occasional":{"system": "http://snomed.info/sct","display":"Occasional cigarette smoker (finding)","code":"230059006"},
    "passive":{"system": "http://snomed.info/sct","display":"Passive smoker (finding)","code":"43381005"},
    "ex_smoker":{"system": "http://snomed.info/sct","display":"Ex-smoker (finding)","code":"8517006"},
    "past_smoking_hist":{"system": "http://snomed.info/sct","display":"Current non smoker but past smoking history unknown (finding)","code":"405746006"},
    "non_smoker":{"system": "http://snomed.info/sct","display":"Never smoked tobacco (finding)","code":"266919005"},
    "other":{"system": "http://snomed.info/sct","display":"Other","code":"OTH"}
};


export const conditionsSNOMEDCodeList = {
    "diabetes_mellitus": { "system": "http://snomed.info/sct", "code": "73211009", "display": "Diabetes mellitus (disorder)" },
    "diabetes_mellitus_type_1": { "system": "http://snomed.info/sct", "code": "46635009", "display": "Diabetes mellitus type 1 (disorder)" },
    "diabetes_mellitus_type_2": { "system": "http://snomed.info/sct", "code": "44054006", "display": "Diabetes mellitus type 2 (disorder)" },
    "hypertensive_disorder":{"system":"http://snomed.info/sct","code":"59621000","display":"Essential hypertension (disorder)"},
    "peripheral_vascular_disease":{"system":"http://snomed.info/sct","code":"400047006","display":"Peripheral vascular disease (disorder)"},
    "cerebrovascular_accident":{"system":"http://snomed.info/sct","code":"230690007","display":"Cerebrovascular accident (disorder)"}                      
};



/*diabetes_type_adu_q_1*/
/*1:type 1 (juvenile diabetes, usually since childhood)*/
/*2:type 2 (adult-onset diabetes, usually started at a later age)*/
/*3:other type:*/
/*4:i do not know*/

/*diabetes_type_adu_q_1_a - another type of diabetes*/

/*http://terminology.hl7.org/CodeSystem/condition-ver-status*/
export const verificationStatusSNOMEDCodeList = {
    "suspected": { "system": "http://snomed.info/sct", "display": "Suspected", "code": "415684004", "hl7_code": "provisional" },
    "known_possible": { "system": "http://snomed.info/sct", "display": "Known possible", "code": "410590009", "hl7_code": "provisional" },
    "confirmed_present": { "system": "http://snomed.info/sct", "display": "Confirmed present", "code": "410605003", "hl7_code": "confirmed" },
    "known_absent": { "system": "http://snomed.info/sct", "display": "Known absent", "code": "410516002", "hl7_code": "refuted" },
    "unknwon": { "system": "http://hl7.org/fhir/v3/NullFlavor", "display": "Unknown", "code": "UNK", "hl7_code": "unknown" }
};

export const clinicalStatusSNOMEDCodeList = {
    "active": { "system": "http://snomed.info/sct", "display": "Active", "code": "55561003", "hl7_code": "active" },
    "inactive": { "system": "http://snomed.info/sct", "display": "Inactive", "code": "73425007", "hl7_code": "inactive" }
};


export const testResultTypeSNOMEDCodeList = {
    "hematology_test":{"display":"Hematology test","code":"252275004", "system":"http://snomed.info/sct"},
    "serum_chemistry_test":{"display":"Serum chemistry test","code":"275711006", "system":"http://snomed.info/sct"},
    "serologic_test":{"display":"Serologic test","code":"68793005", "system":"http://snomed.info/sct"},
    "viral_studies":{"display":"Viral studies","code":"395124008", "system":"http://snomed.info/sct"},
    "toxicology_screening_test":{"display":"Toxicology screening test","code":"314076009", "system":"http://snomed.info/sct"},
    "microbiology_procedure":{"display":"Microbiology procedure","code":"19851009", "system":"http://snomed.info/sct"},
    "molecular_genetic_test":{"display":"Molecular genetic test","code":"405825005", "system":"http://snomed.info/sct"}
};

export const testResultFlagsSNOMEDCodelist = {
    "above_reference_range":{"display":"Above reference range","code":"281302008", "system":"http://snomed.info/sct"},
    "below_reference_range":{"display":"Below reference range","code":"281300000", "system":"http://snomed.info/sct"},
    "intermediate":{"display":"Intermediate","code":"11896004", "system":"http://snomed.info/sct"},
    "resistant":{"display":"Resistant","code":"30714006", "system":"http://snomed.info/sct"},
    "susceptible":{"display":"Susceptible","code":"131196009", "system":"http://snomed.info/sct"}
};

export const measurementMethodSNOMEDCodeList={
    "invasive":{"display":"Invasive","code":"10179008","system":"http://snomed.info/sct"},
    "non-invasive":{"display":"Non-invasive","code":"22762002","system":"http://snomed.info/sct"}
};

export const measuringLocationSNOMEDCodelist={
    "upper_arm_structure":{"display":"Upper arm structure","code":"40983000", "system":"http://snomed.info/sct"},
    "right_upper_arm_structure":{"display":"Right upper arm structure","code":"368209003", "system":"http://snomed.info/sct"},
    "left_upper_arm_structure":{"display":"Left upper arm structure","code":"368208006", "system":"http://snomed.info/sct"},
    "thigh_structure":{"display":"Thigh structure","code":"68367000", "system":"http://snomed.info/sct"},
    "structure_of_right_thigh":{"display":"Structure of right thigh","code":"11207009", "system":"http://snomed.info/sct"},
    "structure_of_left_thigh":{"display":"Structure of left thigh","code":"61396006", "system":"http://snomed.info/sct"},
    "wrist_region_structure":{"display":"Wrist region structure","code":"8205005", "system":"http://snomed.info/sct"},
    "structure_of_right_wrist":{"display":"Structure of right wrist","code":"9736006", "system":"http://snomed.info/sct"},
    "structure_of_left_wrist":{"display":"Structure of left wrist","code":"5951000", "system":"http://snomed.info/sct"},
    "finger_structure":{"display":"Finger structure","code":"7569003", "system":"http://snomed.info/sct"},
    "ankle_region_structure":{"display":"Ankle region structure","code":"344001", "system":"http://snomed.info/sct"},
    "structure_of_right_ankle":{"display":"Structure of right ankle","code":"6685009", "system":"http://snomed.info/sct"},
    "structure_of_left_ankle":{"display":"Structure of left ankle","code":"51636004", "system":"http://snomed.info/sct"}
};



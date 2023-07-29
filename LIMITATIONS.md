# Mapping limitations


| FHIR/MedMij resource | Limitation | Cause |
| -------------- | -------------- | -------------- |
| TobaccoUse     |In the generated data there won't be distiction betweem 'daily' and 'occasional' smokers. All 'current smokers' will be reported as 'daily' smokers|In lifelines, there are variables for a one-to-one mapping of the non-smokers and ex-smokers codes of SNOMED. However, the variable 'current-smoker' could be mapped to two SNOMED codes: daily and occasional. In Lifelines there is a report of 'cigarettes' per day for all participants (so it is an average) and hence, there is no way to distinguish between daily and occasional smokers.                |
|                |                |                |
|                |                |                |






*   the year when the participand had the age reported in hypertension_startage_adu_q_1, in the first assessment
 *     (1A, 3A, or 3B) where hypertension_presence_adu_q_1 == yes
 *   if the age on that particular assessment is missing
 


         //"3","other type:","andere vorm, nl."
        //"4","i do not know","weet ik niet"
        //missing value
        else return conditionsSNOMEDCodeList.diabetes_mellitus
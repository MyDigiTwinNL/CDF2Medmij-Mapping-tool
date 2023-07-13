# Mapping limitations


| FHIR/MedMij resource | Limitation | Cause |
| -------------- | -------------- | -------------- |
| TobaccoUse     |In the generated data there won't be distiction betweem 'daily' and 'occasional' smokers. All 'current smokers' will be reported as 'daily' smokers|In lifelines, there are variables for a one-to-one mapping of the non-smokers and ex-smokers codes of SNOMED. However, the variable 'current-smoker' could be mapped to two SNOMED codes: daily and occasional. In Lifelines there is a report of 'cigarettes' per day for all participants (so it is an average) and hence, there is no way to distinguish between daily and occasional smokers.                |
|                |                |                |
|                |                |                |





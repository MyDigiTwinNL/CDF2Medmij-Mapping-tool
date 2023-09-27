import {inputValue,createCheckedAccessProxy} from '../functionsCatalog';
import {lifelinesDateToISO} from '../lifelinesFunctions'
import moize from 'moize'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';



export const referenceRangeUpperLimit = function():number{
    return 5
};

export type TotalCholesterolReadingEntry = {
    "assessment":string,
    "isTotalCholAboveReferenceRange": boolean|undefined,
    "resultFlags": object|undefined,
    "totalCholResults": number|undefined,
    "collectedDateTime": string|undefined
}


/*
Based on HCIM Problem resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.13/files/2039136

*/

/**
 * It is assumed (from Lifelines data analysis) that when 'date' is missing in an assessment, the
 * participant dropped the study or missed the assessment.
 * @param wave 
 * @returns true if the assessment was missed 
 */
const missedAsssesment = (wave:string) => inputValue("date",wave)==undefined




/**
 * A laboratory result describes the result of a laboratory analysis. These are specimen-oriented 
 * tests as performed in laboratories such as Clinical Chemistry, Serology, Microbiology, etc. 
 * In addition to the results of tests with a singular result, this concept can also contain 
 * the results of more complex tests with multiple results or a ‘panel’.
 * 
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][3A][3B]
 * cholesterol_result_all_m_1     [X ][  ][  ][X ][  ][  ]
 * ------------------------------------------------------------------
 * 
 */
export const results=function():TotalCholesterolReadingEntry[]{

    const waves=["1a","2a"]

    //if the assessment was missed, do not evaluate/create the resource
    return waves.filter((wave)=>!missedAsssesment(wave)).map((wave) =>
        createCheckedAccessProxy({
            "assessment":wave,
            "isTotalCholAboveReferenceRange": isTotalCholAboveReferenceRange(wave),
            "resultFlags": resultFlags(wave),
            "totalCholResults": totalCholResults(wave),
            "collectedDateTime": collectedDateTime(wave)
        })        
    )

}


const isTotalCholAboveReferenceRange = function(wave:string):boolean|undefined{
    
    if (totalCholResults(wave)!=undefined){
        return Number(inputValue("cholesterol_result_all_m_1",wave)) > referenceRangeUpperLimit()
    }
    else{
        return undefined
    }
};

const resultFlags = function(wave:string):object|undefined{

    if (isTotalCholAboveReferenceRange(wave)){
        return testResultFlagsSNOMEDCodelist.above_reference_range
    }
    else{
        return undefined
    }

};

const totalCholResults=function(wave:string):number|undefined{

    const totalCholRes = inputValue("cholesterol_result_all_m_1",wave);

    if (totalCholRes!=undefined){
        return Number(totalCholRes)    
    }
    else{
        return undefined
    }    

};

const collectedDateTime=function(wave:string):string|undefined{
    const coldate = inputValue("date",wave)
    if (coldate!=undefined){
        return lifelinesDateToISO(coldate)
    }
    else{
        return undefined
    }    
};

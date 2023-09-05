import {inputValue,createCheckedAccessProxy} from '../functionsCatalog';
import {lifelinesDateToISO} from '../lifelinesFunctions'
import moize from 'moize'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';



export const referenceRangeUpperLimit = function():number{
    return 3
};

export type LDLCholesterolReadingEntry = {
    "assessment":string,
    "isLDLAboveReferenceRange": boolean|undefined,
    "resultFlags": object|undefined,
    "ldlResults": number|undefined,
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
 * ldlchol_result_all_m_1         [X ][  ][  ][X ][  ][  ]
 * ------------------------------------------------------------------
 * 
 */
export const results=function():LDLCholesterolReadingEntry[]{

    const waves=["1a","2a"]

    //if the assessment was missed, do not evaluate/create the resource
    return waves.filter((wave)=>!missedAsssesment(wave)).map((wave) =>
        createCheckedAccessProxy({
            "assessment":wave,
            "isLDLAboveReferenceRange": isLDLAboveReferenceRange(wave),
            "resultFlags": resultFlags(wave),
            "ldlResults": ldlResults(wave),
            "collectedDateTime": collectedDateTime(wave)
        })        
    )

}


const isLDLAboveReferenceRange = function(wave:string):boolean|undefined{

    const hdlres = ldlResults(wave)    
    if (ldlResults(wave)!=undefined){
        return Number(inputValue("ldlchol_result_all_m_1",wave)) > referenceRangeUpperLimit()
    }
    else{
        return undefined
    }
};

const resultFlags = function(wave:string):object|undefined{

    if (isLDLAboveReferenceRange(wave)){
        return testResultFlagsSNOMEDCodelist.above_reference_range
    }
    else{
        return undefined
    }

};

const ldlResults=function(wave:string):number|undefined{

    const ldlres = inputValue("ldlchol_result_all_m_1",wave);

    if (ldlres!=undefined){
        return Number(ldlres)    
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

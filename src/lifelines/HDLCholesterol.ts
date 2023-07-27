import {inputValue,createCheckedAccessProxy} from '../functionsCatalog';
import {lifelinesDateToISO} from '../lifelinesFunctions'
import moize from 'moize'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';
import assert from 'assert'

export const referenceRangeLowerLimit = function():number{
    return 1
};

export type HDLCholesterolReadingEntry = {
    "assessment":string,
    "isHDLBelowReferenceRange": boolean|undefined,
    "resultFlags": object|undefined,
    "hdlResults": number|undefined,
    "collectedDateTime": string|undefined
}

/*
Based on HCIM Problem resource:
https://simplifier.net/packages/nictiz.fhir.nl.stu3.zib2017/2.2.13/files/2039136

*/



/**
 * A laboratory result describes the result of a laboratory analysis. These are specimen-oriented 
 * tests as performed in laboratories such as Clinical Chemistry, Serology, Microbiology, etc. 
 * In addition to the results of tests with a singular result, this concept can also contain 
 * the results of more complex tests with multiple results or a ‘panel’.
 * 
 * 
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][3A][3B]
 * hdlchol_result_all_m_1         [X ][  ][  ][X ][  ][  ]
 * ------------------------------------------------------------------
 * 
 * @precondition hdlResults is a number (not undefined)
 * 
 */
export const results=function():HDLCholesterolReadingEntry[]{
    
    return [
        createCheckedAccessProxy({
            "assessment":"1a",
            "isHDLBelowReferenceRange": isHDLBelowReferenceRange("1a"),
            "resultFlags": resultFlags("1a"),
            "hdlResults": hdlResults("1a"),
            "collectedDateTime": collectedDateTime("1a")
        }),
        createCheckedAccessProxy({
            "assessment":"2a",
            "isHDLBelowReferenceRange": isHDLBelowReferenceRange("2a"),
            "resultFlags": resultFlags("2a"),
            "hdlResults": hdlResults("2a"),
            "collectedDateTime": collectedDateTime("2a")
        }),
    
    ]

}


/**
 * @precondition hdlResults is a number (not undefined)
 * @param wave 
 * @returns 
 */
const isHDLBelowReferenceRange = function(wave:string):boolean|undefined{
    const hdlres = hdlResults(wave)    
    if (hdlResults(wave)!=undefined){
        return Number(inputValue("hdlchol_result_all_m_1",wave)) < referenceRangeLowerLimit()    
    }
    else{
        return undefined
    }
    
};

/**
 * 
 * @precondition isHDLBelowReferenceRange is true
 * @param wave 
 * @returns 
 */
const resultFlags = function(wave:string):object|undefined{

    if (isHDLBelowReferenceRange(wave)){
        return testResultFlagsSNOMEDCodelist.below_reference_range
    }
    else{
        return undefined
    }
    
};

/**
 * 
 * @param wave 
 * @returns hdl results, or undefined
 */
const hdlResults=function(wave:string):number|undefined{
    const hdlres = inputValue("hdlchol_result_all_m_1",wave);

    if (hdlres!=undefined){
        return Number(hdlres)    
    }
    else{
        return undefined
    }    
};

/**
 * 
 * @precondition date in the given wave is never undefined
 * @param wave 
 * @returns 
 */
const collectedDateTime=function(wave:string):string|undefined{
    const coldate = inputValue("date",wave)
    if (coldate!=undefined){
        return lifelinesDateToISO(coldate)
    }
    else{
        return undefined
    }    
    
};

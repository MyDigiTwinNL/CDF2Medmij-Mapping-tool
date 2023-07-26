import {inputValue} from '../functionsCatalog';
import {lifelinesDateToISO} from '../lifelinesFunctions'
import moize from 'moize'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';



export const referenceRangeUpperLimit = function():number{
    return 3
};


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
 * Related variables:
 * ------------------------------------------------------------------
 *                                [1A][1B][1C][2A][3A][3B]
 * ldlchol_result_all_m_1         [X ][  ][  ][X ][  ][  ]
 * ------------------------------------------------------------------
 * 
 */
export const results=function():object[]{
    return [
        {
            "assessment":"1a",
            "isLDLAboveReferenceRange": isLDLAboveReferenceRange("1a"),
            "resultFlags": resultFlags("1a"),
            "ldlResults": ldlResults("1a"),
            "collectedDateTime": collectedDateTime("1a")
        },
        {
            "assessment":"2a",
            "isLDLAboveReferenceRange": isLDLAboveReferenceRange("2a"),
            "resultFlags": resultFlags("2a"),
            "ldlResults": ldlResults("2a"),
            "collectedDateTime": collectedDateTime("2a")
        },
    
    ]

}


const isLDLAboveReferenceRange = function(wave:string):boolean{
    return Number(inputValue("ldlchol_result_all_m_1",wave)) > referenceRangeUpperLimit()
};

const resultFlags = function(wave:string):object{
    return isLDLAboveReferenceRange(wave)?testResultFlagsSNOMEDCodelist.above_reference_range:{}
};

const ldlResults=function(wave:string):number{
    return Number(inputValue("ldlchol_result_all_m_1",wave))
};

const collectedDateTime=function(wave:string):string{
    return lifelinesDateToISO(inputValue("date",wave))
};

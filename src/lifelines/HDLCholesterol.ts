import {inputValue} from '../functionsCatalog';
import {lifelinesDateToISO} from '../lifelinesFunctions'
import moize from 'moize'
import {testResultFlagsSNOMEDCodelist} from '../codes/snomedCodeLists';


export const referenceRangeLowerLimit = function():number{
    return 1
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
 * hdlchol_result_all_m_1         [X ][  ][  ][X ][  ][  ]
 * ------------------------------------------------------------------
 * 
 */
export const results=function():object[]{
    return [
        {
            "assessment":"1A",
            "isHDLBelowReferenceRange": isHDLBelowReferenceRange("1A"),
            "resultFlags": resultFlags("1A"),
            "hdlResults": hdlResults("1A"),
            "collectedDateTime": collectedDateTime("1A")
        },
        {
            "assessment":"2A",
            "isHDLBelowReferenceRange": isHDLBelowReferenceRange("2A"),
            "resultFlags": resultFlags("2A"),
            "hdlResults": hdlResults("2A"),
            "collectedDateTime": collectedDateTime("2A")
        },
    
    ]

}

const isHDLBelowReferenceRange = function(wave:string):boolean{
    return Number(inputValue("hdlchol_result_all_m_1",wave)) < referenceRangeLowerLimit()
};

const resultFlags = function(wave:string):object{
    return isHDLBelowReferenceRange(wave)?testResultFlagsSNOMEDCodelist.below_reference_range:{}
};

const hdlResults=function(wave:string):number{
    return Number(inputValue("hdlchol_result_all_m_1",wave))
};

const collectedDateTime=function(wave:string):string{
    return lifelinesDateToISO(inputValue("DATE",wave))
};

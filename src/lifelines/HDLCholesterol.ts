import {inputValue,createCheckedAccessProxy} from '../functionsCatalog';
import {lifelinesDateToISO} from '../lifelinesFunctions'
import {LaboratoryTestResult, TestResultEntry} from '../fhir-resource-interfaces/laboratoryTestResult'
import {getSNOMEDCode,getLOINCCode,getUCUMCode,CodeProperties} from '../codes/codesCollection'

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


export const hdlCholesterol:LaboratoryTestResult = {
    referenceRangeUpperLimit: function (): number | undefined {
        //only lower limit defined for hdl cholesterol
        return undefined;
    },
    referenceRangeLowerLimit: function (): number | undefined {
        return referenceRangeLowerLimit();
    },
    results: function (): TestResultEntry[] {
        const waves = ["1a", "2a"];

        //if the assessment was missed, do not evaluate/create the resource
        return waves.filter((wave) => !missedAsssesment(wave)).map((wave) => createCheckedAccessProxy({
            "assessment": wave,
            "isAboveReferenceRange": undefined,
            "isBelowReferenceRange": isHDLBelowReferenceRange(wave),
            "resultFlags": resultFlags(wave),
            "testResult": hdlResults(wave),
            "collectedDateTime": collectedDateTime(wave)
        })
        );
    },
    diagnosticCategoryCoding: function (): CodeProperties[] {
        //laboratory_report,microbiology_procedure
        return [getSNOMEDCode('4241000179101'), getSNOMEDCode('19851009')];
    },
    diagnosticCodeCoding: function (): CodeProperties[] {
        //"HDLc SerPl-sCnc"
        return [getLOINCCode('14646-4')];
    },
    diagnosticCodeText: function (): string {
        return "Cholesterol in HDL [Moles/Vol]";
    },
    observationCategoryCoding: function (): CodeProperties[] {
        //"Laboratory test finding (finding)","display": "Serum chemistry test"
        return [getSNOMEDCode('49581000146104'), getSNOMEDCode('275711006')];
    },
    observationCodeCoding: function (): CodeProperties[] {
        return [getLOINCCode('14646-4')];
    },
    resultUnit: function (): CodeProperties {
        return getUCUMCode('mmol/L');
    }
}



const referenceRangeLowerLimit = function():number{
    return 1
};


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
const resultFlags = function(wave:string):CodeProperties|undefined{

    if (isHDLBelowReferenceRange(wave)){
        //below_reference_range
        return getSNOMEDCode('281300000');        
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


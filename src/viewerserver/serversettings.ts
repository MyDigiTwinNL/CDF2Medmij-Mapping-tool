import {MappingTarget} from '../mapper'

export const targets:MappingTarget[] = [
    //{ "template": '../../zib-2017-mappings/Diabetes.jsonata', "module": './lifelines/Diabetes'},
    //{ "template": '../../zib-2017-mappings/BloodPressure.jsonata', "module": './lifelines/BloodPressure'},
    //{ "template": '../../zib-2017-mappings/LDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/LDLCholesterol'},
    //{ "template": '../../zib-2017-mappings/LDLCholesterol_Observation.jsonata', "module": './lifelines/LDLCholesterol'},
    //{ "template": '../../zib-2017-mappings/LDLCholesterol_Specimen.jsonata', "module": './lifelines/LDLCholesterol' },
    //{ "template": '../../zib-2017-mappings/Hypertension.jsonata', "module": './lifelines/Hypertension' },
    //{ "template": '../../zib-2017-mappings/HDLCholesterol_Diagnostic_Report.jsonata', "module": './lifelines/HDLCholesterol'},
    //{ "template": '../../zib-2017-mappings/HDLCholesterol_Observation.jsonata', "module": './lifelines/HDLCholesterol'},
    //{ "template": '../../zib-2017-mappings/HDLCholesterol_Specimen.jsonata', "module": './lifelines/HDLCholesterol' },
    //{ "template": '../../zib-2017-mappings/Patient.jsonata', "module": './lifelines/Patient' },
    //{ "template": '../../zib-2017-mappings/Stroke.jsonata', "module": './lifelines/Stroke' },
    //{ "template": '../../zib-2017-mappings/TobaccoUse.jsonata', "module": './lifelines/TobaccoUse'} 
    { "module": './lifelines/eGFR', "template": '../../zib-2017-mappings/generic/LabTestResult_Diagnostic_Report.jsonata' },
    { "module": './lifelines/eGFR', "template": '../../zib-2017-mappings/generic/LabTestResult_Observation.jsonata' },
    { "module": './lifelines/eGFR', "template": '../../zib-2017-mappings/generic/LabTestResult_Specimen.jsonata' },
  
    
  ]

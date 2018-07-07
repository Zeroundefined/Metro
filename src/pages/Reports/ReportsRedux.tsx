import { url, Response } from '../../utils/http';
import { message } from 'antd';
import { browserHistory } from 'react-router';

const prefix = 'reports/';

enum DataType {
  // 'breakdown_facility_result' = 'faultData',
  // 'construction_information_result' = 'workingData',
  // 'facility_information_result' = 'equipData',
  // 'material_information_result' = 'materialData',
  // 'polling_information_result' = 'checkInData',
  'material_information_result' = 'materialData',
  'polling_avg_duration_result' = 'pollingDurationData',
  'polling_num_hour_result' = 'pollingHourData',
  'polling_num_result' = 'pollingData',
  'construction_cashing_rate_result' = 'constructionCashingData',
  'construction_utilization_ratio_result' = 'constructionUtilizationData',
  'construction_change_rate_result' = 'constructionChangeData',
  'construction_irregularities_result' = 'constructionIrregularitiesData',
  'construction_line_result' = 'constructionLineData',
  'facility_class_sum_result' = 'facilityData',
  'breakdown_facility_01_result' = 'breakdownFacility01Data',
  'breakdown_facility_02_result' = 'breakdownFacility02Data',
  'breakdown_type_ratio_result' = 'breakdownTypeData',
  'breakdown_statu_result' = 'breakdownStatuData',
  'breakdown_24h_sum_result' = 'breakdown24hSumData',
  'breakdown_line_sum_result' = 'breakdownLineData',
  'report_information_breakdown_result' = 'resultBreakdownReportData',
  'report_information_construction_result' = 'resultConstructionReportData',
  'report_information_polling_result' = 'resultPollingReportData',

  'breakdown_facility_origin' = 'originFaultData',
  'construction_information_origin' = 'originWorkingData',
  'facility_information_origin' = 'originEquipData',
  'material_information_origin' = 'originMaterialData',
  'polling_information_origin' = 'originCheckInData',
  'position_information_gps_origin' = 'originGpsData',

}

const getResultTables = () => {
  return (dispatch) => {
    return fetch(`${url}/getResultTables`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then(data => {
      dispatch({
        type: `${prefix}resultTables`,
        payload: data
      })

      if (data.errMsg) {
        if(data.code === 401) {
          browserHistory.push('/login');
        }
        message.error(data.errMsg);
      }

      return data
    })
  }
}

const getOriginTables = () => {
  return (dispatch) => {
    return fetch(`${url}/getOriginTables`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then(data => {
      dispatch({
        type: `${prefix}originTables`,
        payload: data
      })

      if (data.errMsg) {
        if(data.code === 401) {
          browserHistory.push('/login');
        }
        message.error(data.errMsg);
      }

      return data
    })
  }
}

const updateData = (selectedTable, editingItem, value) => {
  return () => {
    return fetch(`${url}/updateData`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify({
        selectedTable,
        editingItem,
        value,
        editor: 'zhouyun'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then(data => {
      if (data.errMsg) {
        if(data.code === 401) {
          browserHistory.push('/login');
        }
        message.error(data.errMsg);
      }
      return data;
    });
  }
}

/** 获取原始数据 */
const getData = (selectedTable, timeRange, field, keyword?) => {
  const reportTables = ['report_information_breakdown_result', 'report_information_construction_result', 'report_information_polling_result'];
  let fetchUrl = reportTables.indexOf(selectedTable) > -1 ? 'getReportData' : 'getData';
  return (dispatch) => {
    return fetch(`${url}/${fetchUrl}?table=${selectedTable}&timeRange=${[new Date(timeRange[0]).toLocaleDateString(), new Date(timeRange[1]).toLocaleDateString()]}&keyword=${keyword}&field=${field}`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then(data => {
      dispatch({
        type: `${prefix}${DataType[selectedTable]}`,
        payload: data
      })

      if (data.errMsg) {
        if(data.code === 401) {
          browserHistory.push('/login');
        }
        message.error(data.errMsg);
      }
      return data
    })
  }
}

const getCalcData = (date) => {
  let searchDate = new Date(date);
  let fromDate = `${searchDate.getFullYear()}/${searchDate.getMonth()+1}/1`;
  let toDate = `${searchDate.getFullYear()}/${searchDate.getMonth()+1}/31`;
  return (dispatch) => {
    // return fetch(`${url}/getCalcData?timeRange=${[new Date(timeRange[0]).toLocaleDateString(), new Date(timeRange[1]).toLocaleDateString()]}`, {
    return fetch(`${url}/getCalcData?timeRange=${[fromDate, toDate]}`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then(data => {
      dispatch({
        type: `${prefix}CalcData`,
        payload: data
      })

      if (data.errMsg) {
        if(data.code === 401) {
          browserHistory.push('/login');
        }
        message.error(data.errMsg);
      }
      return data
    })
  }
}

const screenshot = (content, width, height) => {
  return () => {
    return fetch(`${url}/screenshot`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        content,
        width,
        height
      }),
    }).then((res) => res.json()).then(data => {
      if (data.errMsg) {
        if(data.code === 401) {
          browserHistory.push('/login');
        }
        message.error(data.errMsg);
      }
      return data
    })
  }
}

const actions = {
  getData,
  updateData,
  getResultTables,
  screenshot,
  getCalcData,
  getOriginTables
}

class InitState {
  // materialData: Response;
  pollingDurationData: Response;
  pollingHourData: Response;
  pollingData: Response;
  constructionCashingData: Response;
  constructionUtilizationData: Response;
  constructionChangeData: Response;
  constructionIrregularitiesData: Response;
  constructionLineData: Response;
  facilityData: Response;
  breakdownFacility01Data: Response;
  breakdownFacility02Data: Response;
  breakdownTypeData: Response;
  breakdownStatuData: Response;
  breakdown24hSumData: Response;
  breakdownLineData: Response;
  resultBreakdownReportData: Response;
  resultConstructionReportData: Response;
  resultPollingReportData: Response;

  faultData: Response;
  workingData: Response;
  equipData: Response;
  materialData: Response;
  checkInData: Response;
  originGpsData: Response;

  resultTables: Response;
  calcData: Response;
  originTables: Response;
  originFaultData: Response;
  originWorkingData: Response;
  originEquipData: Response;
  originMaterialData: Response;
  originCheckInData: Response;
}

const reducer = (state = new InitState(), action): InitState => {
  switch (action.type) {
    case `${prefix}materialData`: {
      return {
        ...state,
        materialData: action.payload
      }
    }

    case `${prefix}pollingDurationData`: {
      return {
        ...state,
        pollingDurationData: action.payload
      }
    }

    case `${prefix}pollingHourData`:
      return {
        ...state,
        pollingHourData: action.payload
      }

    case `${prefix}pollingData`:
      return {
        ...state,
        pollingData: action.payload
      }

    case `${prefix}constructionCashingData`:
      return {
        ...state,
        constructionCashingData: action.payload
      }

    case `${prefix}constructionUtilizationData`:
      return {
        ...state,
        constructionUtilizationData: action.payload
      }

    case `${prefix}constructionChangeData`:
      return {
        ...state,
        constructionChangeData: action.payload
      }

    case `${prefix}constructionIrregularitiesData`:
      return {
        ...state,
        constructionIrregularitiesData: action.payload
      }

    case `${prefix}constructionLineData`:
      return {
        ...state,
        constructionLineData: action.payload
      }

    case `${prefix}facilityData`:
      return {
        ...state,
        facilityData: action.payload
      }

    case `${prefix}breakdownFacility01Data`:
      return {
        ...state,
        breakdownFacility01Data: action.payload
      }
    
      case `${prefix}breakdownFacility02Data`:
      return {
        ...state,
        breakdownFacility02Data: action.payload
      }

      case `${prefix}breakdownTypeData`:
      return {
        ...state,
        breakdownTypeData: action.payload
      }

      case `${prefix}breakdownStatuData`:
      return {
        ...state,
        breakdownStatuData: action.payload
      }

      case `${prefix}breakdown24hSumData`:
      return {
        ...state,
        breakdown24hSumData: action.payload
      }

      case `${prefix}breakdownLineData`:
      return {
        ...state,
        breakdownLineData: action.payload
      }

      case `${prefix}resultBreakdownReportData`:
      return {
        ...state,
        resultBreakdownReportData: action.payload
      }

      case `${prefix}resultConstructionReportData`:
      return {
        ...state,
        resultConstructionReportData: action.payload
      }

      case `${prefix}resultPollingReportData`:
      return {
        ...state,
        resultPollingReportData: action.payload
      }


      case `${prefix}originFaultData`:
      return {
        ...state,
        originFaultData: action.payload
      }
    case `${prefix}originWorkingData`:
      return {
        ...state,
        originWorkingData: action.payload
      }
    case `${prefix}originEquipData`:
      return {
        ...state,
        originEquipData: action.payload
      }
    case `${prefix}originMaterialData`:
      return {
        ...state,
        originMaterialData: action.payload
      }
    case `${prefix}originCheckInData`:
      return {
        ...state,
        originCheckInData: action.payload
      }

    case `${prefix}originGpsData`:
      return {
        ...state,
        originGpsData: action.payload
      }

    case `${prefix}CalcData`: {
      return {
        ...state,
        calcData: action.payload
      }
    }

    case `${prefix}resultTables`: {
      return {
        ...state,
        resultTables: action.payload
      }
    }
    case `${prefix}originTables`: {
      return {
        ...state,
        originTables: action.payload
      }
    }
    
    default:
      return state
  }
}

export { actions, reducer, InitState, DataType }
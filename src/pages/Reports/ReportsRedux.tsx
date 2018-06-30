import { url, Response } from '../../utils/http';
import { message } from 'antd';
import { browserHistory } from 'react-router';

const prefix = 'reports/';

enum DataType {
  'breakdown_facility_result' = 'faultData',
  'construction_information_result' = 'workingData',
  'facility_information_result' = 'equipData',
  'material_information_result' = 'materialData',
  'polling_information_result' = 'checkInData'
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
  return (dispatch) => {
    return fetch(`${url}/getData?table=${selectedTable}&timeRange=${[new Date(timeRange[0]).toLocaleDateString(), new Date(timeRange[1]).toLocaleDateString()]}&keyword=${keyword}&field=${field}`, {
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

const getCalcData = (timeRange) => {
  return (dispatch) => {
    return fetch(`${url}/getCalcData?timeRange=${[new Date(timeRange[0]).toLocaleDateString(), new Date(timeRange[1]).toLocaleDateString()]}`, {
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

const screenshot = (content) => {
  return () => {
    return fetch(`${url}/screenshot`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        content,
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
  getCalcData
}

class InitState {
  faultData: Response;
  workingData: Response;
  equipData: Response;
  materialData: Response;
  checkInData: Response;
  resultTables: Response;
  calcData: Response;
}

const reducer = (state = new InitState(), action): InitState => {
  switch (action.type) {
    case `${prefix}resultTables`: {
      return {
        ...state,
        resultTables: action.payload
      }
    }

    case `${prefix}faultData`:
      return {
        ...state,
        faultData: action.payload
      }
    case `${prefix}workingData`:
      return {
        ...state,
        workingData: action.payload
      }
    case `${prefix}equipData`:
      return {
        ...state,
        equipData: action.payload
      }
    case `${prefix}materialData`:
      return {
        ...state,
        materialData: action.payload
      }
    case `${prefix}checkInData`:
      return {
        ...state,
        checkInData: action.payload
      }

    case `${prefix}CalcData`: {
      return {
        ...state,
        calcData: action.payload
      }
    }
    default:
      return state
  }
}

export { actions, reducer, InitState, DataType }
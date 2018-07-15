import * as React from 'react';
import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import * as canvg from 'canvg';
import * as _ from 'lodash';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { WorkingCard, EquipCard, MaterialCard, CheckInCard, FaultCard } from './ReportCard';
import { DatePicker, Button, Table, Input, Modal, message, Select, Icon, Spin } from 'antd';
import { actions, InitState, DataType } from './ReportsRedux';
import { url } from '../../utils/http';
import './Reports.scss';
import locale from 'antd/lib/date-picker/locale/zh_CN';
// import { spawn } from 'child_process';
// import TextArea from 'antd/lib/input/TextArea';
const { RangePicker, MonthPicker } = DatePicker;
const Option = Select.Option;
const InputGroup = Input.Group;
const { TextArea } = Input;

const mapStateToProps = (state) => ({
  ...state.reports
})

enum Columns {
  /** 结果表字段*/
  'material_information_result' = 'resultMaterialColumns',
  'polling_avg_duration_result' = 'resultPollingAvgDurationColumns',
  'polling_num_hour_result' = 'resultPollingNumHourColumns',
  'polling_num_result' = 'resultPollingNumColumns',
  'construction_cashing_rate_result' = 'resultConstructionCashingRateColumns',
  'construction_utilization_ratio_result' = 'resultConstructionUtilizationRateColumns',
  'construction_change_rate_result' = 'resultConstructionChangeRateColumns',
  'construction_Irregularities_result' = 'resultConstructionIrregularitiesColumns',
  'construction_line_result' = 'resultConstructionLineColumns',
  'facility_class_sum_result' = 'resultFacilityClassSumColumns',
  'breakdown_facility_01_result' = 'resultBreakdownFacility01Columns',
  'breakdown_facility_02_result' = 'resultBreakdownFacility02Columns',
  'breakdown_type_ratio_result' = 'resultBreakdownTypeRatioColumns',
  'breakdown_statu_result' = 'resultBreakdownStatuColumns',
  'breakdown_24h_sum_result' = 'resultBreakdown24hSumColumns',
  'breakdown_line_sum_result' = 'resultBreakdownLineSumColumns',
  'report_information_breakdown_result' = 'resultBreakdownReportColumns',
  'report_information_construction_result' = 'resultConstructionReportColumns',
  'report_information_polling_result' = 'resultPollingReportColumns',

  /** 元数据表字段*/
  'breakdown_facility_origin' = 'originFaultColumns',
  'construction_information_origin' = 'originWorkingColumns',
  'facility_information_origin' = 'originEquipColumns',
  'material_information_origin' = 'originMaterialColumns',
  'polling_information_origin' = 'originCheckInColumns',
  'position_information_gps_origin' = 'originGpsColumns',
}

enum TableDict {
  /** 结果表名*/
  'material_information_result' = '物资信息',
  'polling_avg_duration_result' = '巡检信息-巡检时长',
  'polling_num_hour_result' = '巡检信息-巡检次数--分时',
  'polling_num_result' = '巡检信息-巡检次数',
  'construction_cashing_rate_result' = '施工信息-施工计划兑现率',
  'construction_utilization_ratio_result' = '施工信息-施工计划工时利用率',
  'construction_change_rate_result' = '施工信息-施工计划变更率',
  'construction_Irregularities_result' = '施工信息-施工违规项',
  'construction_line_result' = '施工信息-分线路施工数量',
  'facility_class_sum_result' = '设备信息',
  'breakdown_facility_01_result' = '故障信息-晚点',
  'breakdown_facility_02_result' = '故障信息-道岔',
  'breakdown_type_ratio_result' = '故障信息-类型占比',
  'breakdown_statu_result' = '故障信息-处置状态',
  'breakdown_24h_sum_result' = '故障信息-24小时故障',
  'breakdown_line_sum_result' = '故障信息-分线路故障',
  'report_information_breakdown_result' = '故障信息-报表',
  'report_information_construction_result' = '施工信息-报表',
  'report_information_polling_result' = '巡检信息-报表',

  /** 元数据表名*/
  'breakdown_facility_origin' = '故障信息元数据表',
  'construction_information_origin' = '施工信息元数据表',
  'facility_information_origin' = '设备信息元数据表',
  'material_information_origin' = '物资信息元数据表',
  'polling_information_origin' = '巡检信息元数据表',
  'position_information_gps_origin' = 'GPS信息元数据表'
} 

const dateFormat = 'YYYY/MM/DD';

class Reports extends React.Component<RouteComponentProps<any, any> & typeof actions & InitState, any> {
  /** 元数据表字段 */
  originFaultColumns = [
  {
    title: '发生日期',
    dataIndex: 'datelabel',
    key: 'datelabel',
    fixed: 'left',
    render: text => text.slice(0, 10),
    width: 150
  }, {
    title: '发生时分',
    dataIndex: 'time',
    key: 'time',
    width: 150
  }, {
    title: '故障序号',
    dataIndex: 'fault_sequence',
    key: 'fault_sequence',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'fault_sequence')
  }, {
    title: '故障线路',
    dataIndex: 'line',
    key: 'line',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'line')
  }, {
    title: '故障站点区间',
    dataIndex: 'rang',
    key: 'rang',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'rang', true)
  }, {
    title: '故障设备',
    dataIndex: 'facility',
    key: 'facility',
    width: 200,
    render: (text, record) => this.tableEdite(text, record, 'facility', true)
  }, {
    title: '故障现象',
    dataIndex: 'phenomenon',
    key: 'phenomenon',
    width: 200,
    render: (text, record) => this.tableEdite(text, record, 'phenomenon', true)
  }, {
    title: '故障处置延时',
    dataIndex: 'receive_delay',
    key: 'receive_delay',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'receive_delay')
  }, {
    title: '报修延时',
    dataIndex: 'fix_delay',
    key: 'fix_delay',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'fix_delay')
  }, {
    title: '接修延时',
    dataIndex: 'repair_delay',
    key: 'repair_delay',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'repair_delay')
  }, {
    title: '处理延时',
    dataIndex: 'processing_delay',
    key: 'processing_delay',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'processing_delay')
  }, {
    title: '闭环延时',
    dataIndex: 'closed_loop_delay',
    key: 'closed_loop_delay',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'closed_loop_delay')
  }, {
    title: '报修单位',
    dataIndex: 'report_company',
    key: 'report_company',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'report_company', true)
  }, {
    title: '处置状态',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    render: (text, record) =>this.tableEdite(text, record, 'status')
  }, {
    title: '处置经过',
    dataIndex: 'record',
    key: 'record',
    width: 200,
    render: (text, record) => this.tableEdite(text, record, 'record', true)
  }];
  originWorkingColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      fixed: true,
      render: text => text.slice(0, 10),
      width: 150,
    }, {
      title: '计划编号',
      dataIndex: 'plan_id',
      key: 'plan_id',
      width: 150
    }, {
      title: '线路编号',
      dataIndex: 'line',
      key: 'line',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'line')
    }, {
      title: '区域类别',
      dataIndex: 'distinct_type',
      key: 'distinct_type',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'distinct_type')
    }, {
      title: '计划类别',
      dataIndex: 'plan_type',
      key: 'plan_type',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'plan_type')
    }, {
      title: '车站名称',
      dataIndex: 'station_name',
      key: 'station_name',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'station_name')
    }, {
      title: '施工负责人姓名',
      dataIndex: 'station_worker_name',
      key: 'station_worker_name',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'station_worker_name')
    }, {
      title: '计划起始时间',
      dataIndex: 'plan_start_time',
      key: 'plan_start_time',
      width: 200,
      render: (text, record) => <div>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
    }, {
      title: '计划终止时间',
      dataIndex: 'plan_end_time',
      key: 'plan_end_time',
      width: 200,
      render: (text, record) => <div>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
    }, {
      title: '计划用时',
      dataIndex: 'plan_hour',
      key: 'plan_hour',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'plan_hour')
    }, {
      title: '施工类别',
      dataIndex: 'construction_type',
      key: 'construction_type',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'construction_type')
    }, {
      title: '登记站点名称',
      dataIndex: 'load_station_name',
      key: 'load_station_name',
      width: 200,
      render: (text, record) => this.tableEdite(text, record, 'load_station_name', true)
    }, {
      title: '施工详细说明',
      dataIndex: 'construction_report',
      key: 'construction_report',
      width: 200,
      render: (text, record) => this.tableEdite(text, record, 'construction_report', true)
    }, {
      title: '是否停电',
      dataIndex: 'ispower',
      key: 'ispower',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'ispower')
    }, {
      title: '计划状态',
      dataIndex: 'plan_status',
      key: 'plan_status',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'plan_status')
    }, {
      title: '实际开始时间',
      dataIndex: 'original_start_time',
      key: 'original_start_time',
      width: 200,
      render: (text, record) => <div>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
    }, {
      title: '实际结束时间',
      dataIndex: 'original_end_time',
      key: 'original_end_time',
      width: 200,
      render: (text, record) => <div>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
    }, {
      title: '实际用时',
      dataIndex: 'original_usetime',
      key: 'original_usetime',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'original_usetime')
    }, {
      title: '违规',
      dataIndex: 'job_type',
      key: 'job_type',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'job_type')
    }
  ];
  originEquipColumns = [
  {
    title: '启用日期',
    dataIndex: 'datelabel',
    key: 'datelabel',
    fixed: true,
    render: text => text.slice(0, 10),
    width: 150
  }, {
    title: '线路',
    dataIndex: 'line',
    key: 'line',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'line')
  }, {
    title: '位置',
    dataIndex: 'position',
    key: 'position',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'position', true)
  }, {
    title: '位置描述',
    dataIndex: 'describ',
    key: 'describ',
    width: 200,
    render: (text, record) => this.tableEdite(text, record, 'describ', true)
  }, {
    title: '一级',
    dataIndex: 'level_01',
    key: 'level_01',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'level_01')
  }, {
    title: '二级',
    dataIndex: 'level_02',
    key: 'level_02',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'level_02')
  }, {
    title: '三级',
    dataIndex: 'level_03',
    key: 'level_03',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'level_03')
  }, {
    title: '四级',
    dataIndex: 'level_04',
    key: 'level_04',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'level_04')
  }, {
    title: '五级',
    dataIndex: 'level_05',
    key: 'level_05',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'level_05')
  }, {
    title: '六级',
    dataIndex: 'level_06',
    key: 'level_06',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'level_06')
  }, {
    title: '设备名称',
    dataIndex: 'facility_name',
    key: 'facility_name',
    width: 200,
    render: (text, record) => this.tableEdite(text, record, 'facility_name', true)
  }, {
    title: '管理粒度',
    dataIndex: 'granularity',
    key: 'granularity',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'granularity')
  }, {
    title: '设备数量',
    dataIndex: 'facility_num',
    key: 'facility_num',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'facility_num')
  }, {
    title: '规格型号',
    dataIndex: 'model',
    key: 'model',
    width: 200,
    render: (text, record) => this.tableEdite(text, record, 'model', true)
  }, {
    title: '制造厂商',
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    width: 200,
    render: (text, record) => this.tableEdite(text, record, 'manufacturer', true)
  }, {
    title: '计量单位',
    dataIndex: 'unit',
    key: 'unit',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'unit')
  }, {
    title: '安装地点',
    dataIndex: 'location',
    key: 'location',
    width: 200,
    render: (text, record) => this.tableEdite(text, record, 'location', true)
  }
];
  originMaterialColumns = [
  {
    title: '日期',
    dataIndex: 'datelabel',
    key: 'datelabel',
    fixed: true,
    render: text => text.slice(0, 10),
    width: 150
  }, {
    title: 'c码',
    dataIndex: 'material_id',
    key: 'material_id',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'material_id')
  }, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'name')
  }, {
    title: '专业',
    dataIndex: 'major',
    key: 'major',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'major')
  }, {
    title: '系统',
    dataIndex: 'system',
    key: 'system',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'system')
  }, {
    title: '设备',
    dataIndex: 'facility',
    key: 'facility',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'facility', true)
  }, {
    title: '入库时间',
    dataIndex: 'in_time',
    key: 'in_time',
    width: 200,
    render: (text, record) => <div>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
  }, {
    title: '领用时间',
    dataIndex: 'use_time',
    key: 'use_time',
    width: 200,
    render: (text, record) => <div>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
  }, {
    title: '物资属性',
    dataIndex: 'material_type',
    key: 'material_type',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'material_type')
  }, {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: 200,
    render: (text, record) => this.tableEdite(text, record, 'department', true)
  }, {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'number')
  }];
  originCheckInColumns= [
  {
    title: '日期',
    dataIndex: 'datelabel',
    key: 'datelabel',
    fixed: true,
    render: text => text.slice(0, 10),
    width: 150
  }, {
    title: '开始时间',
    dataIndex: 'begin_time',
    key: 'begin_time',
    width: 200,
    render: (text, record) => <div>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
  }, {
    title: '结束时间',
    dataIndex: 'end_time',
    key: 'end_time',
    width: 200,
    render: (text, record) => <div>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</div>
  }, {
    title: '线路',
    dataIndex: 'line',
    key: 'line',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'line')
  }, {
    title: '站点',
    dataIndex: 'charge',
    key: 'charge',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'charge')
  }, {
    title: '巡检人',
    dataIndex: 'worker',
    key: 'worker',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'worker')
  }, {
    title: '巡检时长',
    dataIndex: 'duration',
    key: 'duration',
    width: 150,
    render: (text, record) => this.tableEdite(text, record, 'duration')
  }];
  originGpsColumns= [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      fixed: true,
      render: text => text.slice(0, 10),
      width: 150
    }, 
    {
      title: '时间',
      dataIndex: 'datetime',
      key: 'datetime',
      render: (text, record) => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>,
      width: 200
    }, {
      title: '经度',
      dataIndex: 'lon',
      key: 'lon',
      width: 200,
      render: (text, record) => this.tableEdite(text, record, 'lon', true)
    }, {
      title: '纬度',
      dataIndex: 'lat',
      key: 'lat',
      width: 200,
      render: (text, record) => this.tableEdite(text, record, 'lat', true)
    }, {
      title: '设备号',
      dataIndex: 'number',
      key: 'number',
      width: 200,
      render: (text, record) => this.tableEdite(text, record, 'number', true)
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'name')
    }];

  /** 结果表字段 */
  resultMaterialColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'type')
    }, {
      title: '状态',
      dataIndex: 'staut',
      key: 'staut',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'staut')
    }, {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'number')
    }
  ];
  resultPollingAvgDurationColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '线路',
      dataIndex: 'line',
      key: 'line',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'line')
    }, {
      title: '平均时长',
      dataIndex: 'avg_duration',
      key: 'avg_duration',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'avg_duration')
    }
  ];
  resultPollingNumHourColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      render: text => text.slice(0, 10),
      key: 'datelabel',
      fixed: true,
      width: 200,
    }, {
      title: '时段',
      dataIndex: 'hour',
      key: 'hour',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'hour')
    }, {
      title: '线路',
      dataIndex: 'line',
      key: 'line',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'line')
    }, {
      title: '次数',
      dataIndex: 'num',
      key: 'num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'num')
    }
  ]
  resultPollingNumColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '线路',
      dataIndex: 'line',
      key: 'line',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'line')
    }, {
      title: '次数',
      dataIndex: 'num',
      key: 'num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'num')
    }
  ];
  resultConstructionCashingRateColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      render: text => text.slice(0, 10),
      key: 'datelabel',
      fixed: true,
      width: 200,
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'type')
    }, {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'number')
    }
  ]
  resultConstructionUtilizationRateColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '数量',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'ratio')
    }
  ]
  resultConstructionChangeRateColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'number')
    }
  ];
  resultConstructionIrregularitiesColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'number')
    }
  ]
  resultConstructionLineColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '线路',
      dataIndex: 'line',
      key: 'line',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'line')
    }, {
      title: '时段',
      dataIndex: 'hour',
      key: 'hour',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'hour')
    }, {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'number')
    }
  ];
  resultFacilityClassSumColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      render: text => text.slice(0, 10),
      key: 'datelabel',
      fixed: true,
      width: 200,
    }, {
      title: '线路',
      dataIndex: 'line',
      key: 'line',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'line')
    }, {
      title: '大类',
      dataIndex: 'first_type',
      key: 'first_type',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'first_type')
    }, {
      title: '小类',
      dataIndex: 'secd_type',
      key: 'secd_type',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'secd_type')
    }, {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'number')
    }
  ];
  resultBreakdownFacility01Columns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '五分钟晚点',
      dataIndex: 'num_1',
      key: 'num_1',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'num_1')
    }, {
      title: '十五分钟晚点',
      dataIndex: 'num_2',
      key: 'num_2',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'num_2')
    }
  ];
  resultBreakdownFacility02Columns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'num')
    }
  ]
  resultBreakdownTypeRatioColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'type')
    }, {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'num')
    }
  ]
  resultBreakdownStatuColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'status')
    }, {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'num')
    }
  ]
  resultBreakdown24hSumColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '时段',
      dataIndex: 'hour',
      key: 'hour',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'hour')
    }, {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'num')
    }
  ]
  resultBreakdownLineSumColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      render: text => text.slice(0, 10),
      fixed: true,
      width: 200,
    }, {
      title: '线路',
      dataIndex: 'line',
      key: 'line',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'line')
    }, {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'num')
    }
  ];
  resultBreakdownReportColumns = [
    {
      title: '日期',
      dataIndex: 'month',
      render: (text, record) => <span>{text ? moment(text).format('YYYY-MM') : '-'}</span>,
      key: 'month',
      fixed: true,
      width: 200,
    }, {
      title: '故障次数',
      dataIndex: 'breakdown_num',
      key: 'breakdown_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'breakdown_num')
    }, {
      title: '同比',
      dataIndex: 'year_on_year',
      key: 'year_on_year',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'year_on_year')
    }, {
      title: '环比',
      dataIndex: 'month_on_month',
      key: 'month_on_month',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'month_on_month')
    }, {
      title: '五分钟晚点',
      dataIndex: 'five_late_num',
      key: 'five_late_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'five_late_num')
    }, {
      title: '十五分钟晚点',
      dataIndex: 'fivth_late_num',
      key: 'fivth_late_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'fivth_late_num')
    }, {
      title: '信号专业故障',
      dataIndex: 'breakdown_xh_num',
      key: 'breakdown_xh_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'breakdown_xh_num')
    }, {
      title: '通讯专业故障',
      dataIndex: 'breakdown_tx_num',
      key: 'breakdown_tx_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'breakdown_tx_num')
    }, {
      title: '信息专业故障',
      dataIndex: 'breakdown_xx_num',
      key: 'breakdown_xx_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'breakdown_xx_num')
    }, {
      title: '处置故障平均用时',
      dataIndex: 'breakdown_avg',
      key: 'breakdown_avg',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'breakdown_avg')
    }, {
      title: '故障修复率',
      dataIndex: 'breakdown_repair',
      key: 'breakdown_repair',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'breakdown_repair')
    }, {
      title: '闭环',
      dataIndex: 'closed_loop',
      key: 'closed_loop',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'closed_loop')
    }
  ];
  resultConstructionReportColumns = [
    {
      title: '日期',
      dataIndex: 'month',
      render: (text, record) => <span>{text ? moment(text).format('YYYY-MM') : '-'}</span>,
      key: 'month',
      fixed: true,
      width: 200,
    }, {
      title: '施工次数',
      dataIndex: 'construction_num',
      key: 'construction_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'construction_num')
    }, {
      title: '日常巡检施工次数',
      dataIndex: 'day_polling_num',
      key: 'day_polling_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'day_polling_num')
    }, {
      title: '项目施工次数',
      dataIndex: 'project_contruction_num',
      key: 'project_contruction_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'project_contruction_num')
    }, {
      title: '二级重大施工次数',
      dataIndex: 'a',
      key: 'a',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'a')
    }, {
      title: '施工兑现率',
      dataIndex: 'b',
      key: 'b',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'b')
    }, {
      title: '工时利用率',
      dataIndex: 'c',
      key: 'c',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'c')
    }, {
      title: '实施规范率',
      dataIndex: 'd',
      key: 'd',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'd')
    }, {
      title: '计划变更率',
      dataIndex: 'e',
      key: 'e',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'e')
    }
  ];
  resultPollingReportColumns = [
    {
      title: '日期',
      dataIndex: 'month',
      key: 'month',
      render: (text, record) => <span>{text ? moment(text).format('YYYY-MM') : '-'}</span>,
      fixed: true,
      width: 200,
    }, {
      title: '巡检次数',
      dataIndex: 'polling_num',
      key: 'polling_num',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'polling_num')
    }, {
      title: '巡检时长',
      dataIndex: 'polling_duration',
      key: 'polling_duration',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'polling_duration')
    }, {
      title: '平均巡检时长',
      dataIndex: 'polling_avg_duration',
      key: 'polling_avg_duration',
      width: 150,
      render: (text, record) => this.tableEdite(text, record, 'polling_avg_duration')
    }
  ];

  tableEdite = (text, record, field, isTextArea = false) => {
    let {editingItem,expendItem, test} = this.state;
    if(editingItem.id === record.id && editingItem.field === field){
      return <div className="table-input-cell">
          {!isTextArea ? 
          <Input id="input" style={{ height: 22 }} defaultValue={text} onKeyDown={this.onKeyDown} onBlur={this.handleBlur} autoFocus/> :
          <TextArea rows={3} id="input" style={{resize:"none" }} defaultValue={text} onKeyDown={this.onKeyDown} onBlur={this.handleBlur} autoFocus/>}
          {/* <Icon type="save" onMouseDown={this.handleUpdate}/> */}
        </div>
    } else {
      let isExpend = expendItem.id == record.id && expendItem.field == field;
      return <div onDoubleClick={this.handleCellDBLClick.bind(this, record, field)} id="cell" className="table-cell">
        <span className={isExpend ? 'table-cell-text':"overflow-text table-cell-text"} title={text} onClick={this.set.bind(this, record, field, isExpend)}>
          {text}
        </span> 
      <Icon type="edit" onClick={this.handleCellDBLClick.bind(this, record, field)}/>
    </div>
    }
    
  }

  set = (record, field, isExpend) =>{
    this.setState({expendItem: isExpend ? {} : {id: record.id, field}});
  }

  state = {
    review: false,
    editingItem: {} as any,
    expendItem: {} as any,
    selectedTable: '',
    timeRange: [moment(new Date().toLocaleDateString(), dateFormat).subtract(7, 'days'), moment(new Date().toLocaleDateString(), dateFormat)],
    searchedField: '',
    keyword: '',
    modalSpinning: false,
    modalMonth: moment(new Date()),
    test: false,
    "fault": {
      // "delayCount": null,
      // "lostCount": null,
      // "faultType": [{
      //     "type": "信号 ",
      //     "count": 7
      //   },
      //   {
      //     "type": "网络 ",
      //     "count": 1
      //   },
      //   {
      //     "type": "通信 ",
      //     "count": 9
      //   }
      // ],
      // "faultHandle": [{
      //     "status": "在处理",
      //     "count": 4
      //   },
      //   {
      //     "status": "已修复",
      //     "count": 5
      //   },
      //   {
      //     "status": "已完结",
      //     "count": 5
      //   },
      //   {
      //     "status": "新报修",
      //     "count": 3
      //   }
      // ],
      // "hourDivided": [{
      //     "hour": "0-2",
      //     "count": 3
      //   },
      //   {
      //     "hour": "10-12",
      //     "count": 2
      //   },
      //   {
      //     "hour": "12-14",
      //     "count": 1
      //   },
      //   {
      //     "hour": "4-6",
      //     "count": 2
      //   },
      //   {
      //     "hour": "6-8",
      //     "count": 6
      //   },
      //   {
      //     "hour": "8-10",
      //     "count": 3
      //   }
      // ],
      // "lineDivided": [{
      //     "line": "七号线",
      //     "count": 1
      //   },
      //   {
      //     "line": "三号线",
      //     "count": 2
      //   },
      //   {
      //     "line": "九号线",
      //     "count": 5
      //   },
      //   {
      //     "line": "八号线",
      //     "count": 1
      //   },
      //   {
      //     "line": "六号线",
      //     "count": 1
      //   },
      //   {
      //     "line": "十一号线",
      //     "count": 1
      //   },
      //   {
      //     "line": "十七号线",
      //     "count": 2
      //   },
      //   {
      //     "line": "十六号线",
      //     "count": 2
      //   },
      //   {
      //     "line": "四号线",
      //     "count": 2
      //   }
      // ]
    },
    "working": {
      // "reachRatio": null,
      // "hourRatio": 0,
      // "updateRatio": null,
      // "illegal": 1,
      // "workingActual": 150,
      // "workingTotal": 150,
      // "lineDivided": [{
      //     "line": "00",
      //     "count": 96
      //   },
      //   {
      //     "line": "01",
      //     "count": 80
      //   },
      //   {
      //     "line": "02",
      //     "count": 106
      //   },
      //   {
      //     "line": "03",
      //     "count": 86
      //   },
      //   {
      //     "line": "04",
      //     "count": 70
      //   },
      //   {
      //     "line": "05",
      //     "count": 14
      //   },
      //   {
      //     "line": "06",
      //     "count": 64
      //   },
      //   {
      //     "line": "07",
      //     "count": 90
      //   },
      //   {
      //     "line": "08",
      //     "count": 90
      //   },
      //   {
      //     "line": "09",
      //     "count": 76
      //   },
      //   {
      //     "line": "10",
      //     "count": 50
      //   },
      //   {
      //     "line": "11",
      //     "count": 58
      //   },
      //   {
      //     "line": "1101",
      //     "count": 4
      //   },
      //   {
      //     "line": "12",
      //     "count": 74
      //   },
      //   {
      //     "line": "13",
      //     "count": 58
      //   },
      //   {
      //     "line": "16",
      //     "count": 52
      //   },
      //   {
      //     "line": "17",
      //     "count": 46
      //   }
      // ],
      // "hourDivided": [{
      //     "hour": "0-2",
      //     "count": 66
      //   },
      //   {
      //     "hour": "10-12",
      //     "count": 13
      //   },
      //   {
      //     "hour": "12-14",
      //     "count": 7
      //   },
      //   {
      //     "hour": "14-16",
      //     "count": 4
      //   },
      //   {
      //     "hour": "16-18",
      //     "count": 6
      //   },
      //   {
      //     "hour": "18-20",
      //     "count": 1
      //   },
      //   {
      //     "hour": "20-22",
      //     "count": 25
      //   },
      //   {
      //     "hour": "22-24",
      //     "count": 64
      //   },
      //   {
      //     "hour": "4-6",
      //     "count": 13
      //   },
      //   {
      //     "hour": "6-8",
      //     "count": 66
      //   },
      //   {
      //     "hour": "8-10",
      //     "count": 292
      //   }
      // ]
    },
    "equip": {
      // "firstTypeCount": [{
      //     "first_type": "05",
      //     "count": 323
      //   },
      //   {
      //     "first_type": "06",
      //     "count": 3553
      //   }
      // ],
      // "equipTotal": 3876,
      // "secdTypeTotal": {
      //   "05": [{
      //     "first_type": "05",
      //     "secd_type": "03",
      //     "count": 323
      //   }],
      //   "06": [{
      //       "first_type": "06",
      //       "secd_type": "01",
      //       "count": 34
      //     },
      //     {
      //       "first_type": "06",
      //       "secd_type": "02",
      //       "count": 2346
      //     },
      //     {
      //       "first_type": "06",
      //       "secd_type": "03",
      //       "count": 153
      //     },
      //     {
      //       "first_type": "06",
      //       "secd_type": "04",
      //       "count": 442
      //     },
      //     {
      //       "first_type": "06",
      //       "secd_type": "05",
      //       "count": 51
      //     },
      //     {
      //       "first_type": "06",
      //       "secd_type": "06",
      //       "count": 34
      //     },
      //     {
      //       "first_type": "06",
      //       "secd_type": "07",
      //       "count": 136
      //     },
      //     {
      //       "first_type": "06",
      //       "secd_type": "09",
      //       "count": 323
      //     },
      //     {
      //       "first_type": "06",
      //       "secd_type": "10",
      //       "count": 34
      //     }
      //   ]
      // }
    },
    "material": {
      // "入库": [{
      //     "type": "入库",
      //     "staut": "信号",
      //     "ratio": 592
      //   },
      //   {
      //     "type": "入库",
      //     "staut": "未分配",
      //     "ratio": 299
      //   },
      //   {
      //     "type": "入库",
      //     "staut": "电源",
      //     "ratio": 38
      //   },
      //   {
      //     "type": "入库",
      //     "staut": "耗材",
      //     "ratio": 5
      //   },
      //   {
      //     "type": "入库",
      //     "staut": "计算机网络",
      //     "ratio": 234
      //   },
      //   {
      //     "type": "入库",
      //     "staut": "通信",
      //     "ratio": 1026
      //   },
      //   {
      //     "type": "入库",
      //     "staut": "附属设备",
      //     "ratio": 20
      //   }
      // ],
      // "其他": [{
      //     "type": "其他",
      //     "staut": "C库",
      //     "ratio": 277
      //   },
      //   {
      //     "type": "其他",
      //     "staut": "帐内",
      //     "ratio": 65
      //   }
      // ],
      // "出库": [{
      //     "type": "出库",
      //     "staut": "信号",
      //     "ratio": 721
      //   },
      //   {
      //     "type": "出库",
      //     "staut": "未分配",
      //     "ratio": 43
      //   },
      //   {
      //     "type": "出库",
      //     "staut": "电源",
      //     "ratio": 6
      //   },
      //   {
      //     "type": "出库",
      //     "staut": "计算机网络",
      //     "ratio": 226
      //   },
      //   {
      //     "type": "出库",
      //     "staut": "通信",
      //     "ratio": 1654
      //   },
      //   {
      //     "type": "出库",
      //     "staut": "附属设备",
      //     "ratio": 21
      //   }
      // ],
      // "物资": [{
      //     "type": "物资",
      //     "staut": "C库",
      //     "ratio": 4032
      //   },
      //   {
      //     "type": "物资",
      //     "staut": "帐内",
      //     "ratio": 234
      //   },
      //   {
      //     "type": "物资",
      //     "staut": "帐外",
      //     "ratio": 277
      //   }
      // ]
    },
    "polling": {
      // "hourDivided": [{
      //     "key": "0-2",
      //     "value": 58
      //   },
      //   {
      //     "key": "10-12",
      //     "value": 56
      //   },
      //   {
      //     "key": "12-14",
      //     "value": 29
      //   },
      //   {
      //     "key": "16-18",
      //     "value": 29
      //   },
      //   {
      //     "key": "18-20",
      //     "value": 29
      //   },
      //   {
      //     "key": "22-24",
      //     "value": 58
      //   },
      //   {
      //     "key": "4-6",
      //     "value": 58
      //   },
      //   {
      //     "key": "6-8",
      //     "value": 174
      //   },
      //   {
      //     "key": "8-10",
      //     "value": 87
      //   }
      // ],
      // "count": 578,
      // "duration": 13.3
    }
  }

  handleBlur = (e) => {
    this.setState({editingItem: {}})
  }

  init = (props) => {
    const { getResultTables, getOriginTables , getData, location: { pathname } } = props;
    const { timeRange, keyword } = this.state;
    const isMetaCenter = pathname.indexOf('metaCenter') > 0;
    const request  = isMetaCenter ? getOriginTables : getResultTables;
    (request() as any).then(data => {
      this.setState({
        selectedTable: data.data[0],
        searchedField: _.reject(this[Columns[data.data[0]]], { key: 'datelabel' })[0].key
      })
      
      data.data.forEach(table => {
        Columns[table] && getData(table, timeRange, this[Columns[table]][0].key, keyword);
      })
    });
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.modalSpinning !== this.props.modalSpinning) {
      this.setState({modalSpinning: nextProps.modalSpinning});
    }
    if(nextProps.calcData && nextProps.calcData.data) {
      this.setState({...nextProps.calcData.data, modalSpinning:nextProps.modalSpinning });
    }

    if(this.props.location.pathname !== nextProps.location.pathname) {
      this.init(nextProps);
    }
  }

  handleCellDBLClick = (record, field, e) => {
    e.target.focus();
    this.setState({
      editingItem: {
        id: record.id,
        field: field
      }
    })
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleUpdate();
    }
  }

  handleUpdate = () => {
    let value = document.querySelector('#input')['value'];
    const { updateData, getData } = this.props;
    const { editingItem, selectedTable, timeRange, searchedField, keyword } = this.state;
    // if (e.keyCode === 13) {
      (updateData(selectedTable, editingItem, value) as any).then(data => {
        if (!data.errMsg) {
          getData(selectedTable, timeRange, searchedField, keyword);
          message.success('更新成功');
        }
      })
      this.setState({
        editingItem: {}
      })
    // }
  }

  openReview = (date) => {
    const { getCalcData } = this.props;
    // const { timeRange } = this.state;
    this.setState({
      review: true,
      modalMonth: date
    })
    getCalcData(date)
    /** 获取计算数据 */
  }

  changeMonth = (date, dateString) => {
    // let month = new Date(date).getMonth() + 1;
    this.openReview(date);
  }

  closeReview = () => {
    this.setState({
      review: false
    })
  }

  handleSubmit = () => {
    /** 导出报表 */
    const { screenshot } = this.props;
    const target = document.querySelector('.reports-review');
    (screenshot(
      target.outerHTML,
      target.getBoundingClientRect().width,
      target.getBoundingClientRect().height
    ) as any).then(data => {
      if(!data.errMsg) {
        window.open(`${url}/download`, '_blank');
      }
    });

    this.closeReview();
  }

  handleTableChange = (value) => {
    this.setState({
      selectedTable: value,
      searchedField: _.reject(this[Columns[value]], { key: 'datelabel' })[0].key
    })
  }

  changeTimeRange = (value) => {
    this.setState({
      timeRange: value
    })
  }

  changeField = (value) => {
    this.setState({
      searchedField: value
    })
  }

  changeKeyword = (e) => {
    this.setState({
      keyword: e.target.value
    })
  }

  handleSearch = () => {
    const { getData } = this.props;
    const { selectedTable, timeRange, searchedField, keyword } = this.state;
    getData(selectedTable, timeRange, searchedField, keyword)
  }

  renderTables() {
    const { resultTables, originTables ,location: { pathname } } = this.props;
    const isMetaCenter = pathname.indexOf('metaCenter') > 0;
    const tables  = isMetaCenter ? originTables : resultTables;
    return (_.get(tables, 'data') || []).map(table => <Option key={table}>{TableDict[table]}</Option>)
  }

  renderOptions() {
    const { selectedTable } = this.state;
    return selectedTable && _.reject(this[Columns[selectedTable]], { key: 'datelabel' }).map(item => {
      return <Option key={item.key}>{item.key}</Option>
    })
  }

  

  // componentWillReceiveProps(nextProps) {
  //   if(nextProps.calcData && nextProps.calcData.data) {
  //     // this.setState({...nextProps.calcData.data});
  //   }
  // }

  render() {
    const { review, selectedTable, timeRange, keyword, searchedField, modalMonth, modalSpinning } = this.state;
    const { location: { pathname }, faultData, workingData, equipData, materialData, checkInData, calcData } = this.props;
    const isMetaCenter = pathname.indexOf('metaCenter') > 0;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return <div className='reports'>
      <div className="reports-toolkit">
        <Select value={selectedTable} style={{ width: 180, marginRight: 20 }} onChange={this.handleTableChange}>
          {this.renderTables()}
        </Select>
        <InputGroup compact>
          <RangePicker
            value={[timeRange[0], timeRange[1]]}
            onChange={this.changeTimeRange}
            placeholder={['起始月份', '结束月份']}
            format='YYYY/MM/DD'
          />
          <Select style={{ width: 150 }} onChange={this.changeField} value={searchedField}>
            {this.renderOptions()}
          </Select>
          <Input style={{ width: 200 }} value={keyword} onChange={this.changeKeyword} />
          <Button onClick={this.handleSearch}>查找</Button>
        </InputGroup>
        {!isMetaCenter && <Button className="screenshot" type='primary' style={{ float: 'right' }} onClick={() => this.openReview(timeRange[0])}>预览</Button>}
      </div>

      <Table
        className="reports-table" 
        style={{ width: '100%', padding: '20px' }} 
        scroll={{ x: this[Columns[selectedTable]] ? this[Columns[selectedTable]].reduce((pre, cur) => pre + cur.width, 0): 0 }} 
        rowSelection={isMetaCenter ? rowSelection : null} 
        columns={this[Columns[selectedTable]]} 
        dataSource={_.get(this.props[DataType[selectedTable]], 'data')} 
        locale={{emptyText: '暂无数据'}}
      />

      <Modal
        width={1200}
        style={{ height: 990 }}
        visible={review}
        onCancel={this.closeReview}
        onOk={this.handleSubmit}
        okText='导出报表'
        cancelText='取消'
        className='reports-review-modal'
      >
        <Spin spinning={modalSpinning}>
        <div className="modal-container">
          <MonthPicker 
            placeholder="请选择月份" 
            onChange={this.changeMonth}
            value={modalMonth}
            className="modal-select"
            locale={locale}
            getCalendarContainer={() => document.querySelector(".modal-select") }
            />
          <div className='reports-review' style={{ 
            padding: 30,
            color: '#ffffff',
            background:'#030b1e'
            // display: 'flex', 
            // justifyContent: 'space-between' 
          }}>
            {/*<div className='left-part' style={{ width: 550 }}>*/}
              <EquipCard data={this.state.equip || {}} />
              <MaterialCard data={this.state.material || {}}/>
              <CheckInCard data={this.state.polling || {}} timeRange={modalMonth} />
            {/*</div>*/}
            {/*<div className='right-part' style={{ width: 550 }}>*/}
              {<WorkingCard data={this.state.working || {}} timeRange={modalMonth} />}
              {<FaultCard 
                data = {this.state.fault || {}}
                timeRange={modalMonth}
                // data={_.get(faultData, 'data')} 
                />}
            {/*</div>*/}
          </div>

        </div>
                </Spin>
      </Modal>
    </div>
  }
}

export default connect(mapStateToProps, actions)(Reports)
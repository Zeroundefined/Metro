import * as React from 'react';
import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import * as canvg from 'canvg';
import * as _ from 'lodash';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { WorkingCard, EquipCard, MaterialCard, CheckInCard, FaultCard } from './ReportCard';
import { DatePicker, Button, Table, Input, Modal, message, Select } from 'antd';
import { actions, InitState, DataType } from './ReportsRedux';
import { url } from '../../utils/http';
import './Reports.scss';
const { RangePicker } = DatePicker;
const Option = Select.Option;
const InputGroup = Input.Group;

const mapStateToProps = (state) => ({
  ...state.reports
})

enum Columns {
  'breakdown_facility_result' = 'faultColumns',
  'construction_information_result' = 'workingColumns',
  'facility_information_result' = 'equipColumns',
  'material_information_result' = 'materialColumns',
  'polling_information_result' = 'checkInColumns',
  'breakdown_facility_origin' = 'originFaultColumns',
  'construction_information_origin' = 'originWorkingColumns',
  'facility_information_origin' = 'originEquipColumns',
  'material_information_origin' = 'originMaterialColumns',
  'polling_information_origin' = 'originCheckInColumns'
}

const dateFormat = 'YYYY/MM/DD';

class Reports extends React.Component<RouteComponentProps<any, any> & typeof actions & InitState> {
  /** 元数据表字段 */
  originFaultColumns = [{
    title: '发生日期',
    dataIndex: 'datelabel',
    key: 'datelabel',
    fixed: true,
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
    fixed: true,
    width: 150,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'fault_sequence') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'fault_sequence')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '故障线路',
    dataIndex: 'line',
    key: 'line',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '故障站点区间',
    dataIndex: 'range',
    key: 'range',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'range') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'range')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '故障设备',
    dataIndex: 'facility',
    key: 'facility',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'facility') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'facility')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '故障现象',
    dataIndex: 'phenomenon',
    key: 'phenomenon',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'phenomenon') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'phenomenon')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '故障处置延时',
    dataIndex: 'receive_delay',
    key: 'receive_delay',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'receive_delay') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'receive_delay')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '报修延时',
    dataIndex: 'fix_delay',
    key: 'fix_delay',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'fix_delay') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'fix_delay')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '接修延时',
    dataIndex: 'repair_delay',
    key: 'repair_delay',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'repair_delay') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'repair_delay')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '处理延时',
    dataIndex: 'processing_delay',
    key: 'processing_delay',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'processing_delay') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'processing_delay')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '闭环延时',
    dataIndex: 'closed_loop_delay',
    key: 'closed_loop_delay',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'closed_loop_delay') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'closed_loop_delay')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '报修单位',
    dataIndex: 'report_company',
    key: 'report_company',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'report_company') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'report_company')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '处置状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'status') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'status')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '处置经过',
    dataIndex: 'record',
    key: 'record',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'record') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'record')} style={{ cursor: 'pointer' }}>{text}</div>
  }];
  originWorkingColumns = [
    {
      title: '日期',
      dataIndex: 'datelabel',
      key: 'datelabel',
      fixed: true,
      render: text => text.slice(0, 10),
      width: 150
    }, {
      title: '计划编号',
      dataIndex: 'plan_id',
      key: 'plan_id',
      width: 100
    }, {
      title: '线路编号',
      dataIndex: 'line',
      key: 'line',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '区域类别',
      dataIndex: 'distinct_type',
      key: 'distinct_type',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'distinct_type') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'distinct_type')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '计划类别',
      dataIndex: 'plan_type',
      key: 'plan_type',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'plan_type') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'plan_type')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '车站名称',
      dataIndex: 'station_name',
      key: 'station_name',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'station_name') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'station_name')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '施工负责人姓名',
      dataIndex: 'station_worker_name',
      key: 'station_worker_name',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'station_worker_name') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'station_worker_name')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '计划起始时间',
      dataIndex: 'plan_start_time',
      key: 'plan_start_time',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'plan_start_time') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'plan_start_time')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '计划终止时间',
      dataIndex: 'plan_end_time',
      key: 'plan_end_time',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'plan_end_time') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'plan_end_time')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '计划用时',
      dataIndex: 'plan_hour',
      key: 'plan_hour',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'plan_hour') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'plan_hour')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '施工类别',
      dataIndex: 'construction_type',
      key: 'construction_type',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'construction_type') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'construction_type')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '登记站点名称',
      dataIndex: 'load_station_name',
      key: 'load_station_name',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'load_station_name') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'load_station_name')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '施工详细说明',
      dataIndex: 'construction_report',
      key: 'construction_report',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'construction_report') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'construction_report')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '是否停电',
      dataIndex: 'ispower',
      key: 'ispower',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'ispower') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'ispower')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '计划状态',
      dataIndex: 'plan_status',
      key: 'plan_status',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'plan_status') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'plan_status')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '实际开始时间',
      dataIndex: 'original_start_time',
      key: 'original_start_time',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'original_start_time') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'original_start_time')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '实际结束时间',
      dataIndex: 'original_end_time',
      key: 'original_end_time',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'original_end_time') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'original_end_time')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '实际用时',
      dataIndex: 'original_usetime',
      key: 'original_usetime',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'original_usetime') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'original_usetime')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '违规',
      dataIndex: 'job_type',
      key: 'job_type',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'job_type') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'job_type')} style={{ cursor: 'pointer' }}>{text}</div>
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
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '位置',
    dataIndex: 'position',
    key: 'position',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'position') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'position')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '位置描述',
    dataIndex: 'describ',
    key: 'describ',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'describ') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'describ')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '一级',
    dataIndex: 'level_01',
    key: 'level_01',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'level_01') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'level_01')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '二级',
    dataIndex: 'level_02',
    key: 'level_02',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'level_02') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'level_02')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '三级',
    dataIndex: 'level_03',
    key: 'level_03',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'level_03') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'level_03')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '四级',
    dataIndex: 'level_04',
    key: 'level_04',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'level_04') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'level_04')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '五级',
    dataIndex: 'level_05',
    key: 'level_05',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'level_05') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'level_05')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '六级',
    dataIndex: 'level_06',
    key: 'level_06',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'level_06') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'level_06')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '设备名称',
    dataIndex: 'facility_name',
    key: 'facility_name',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'facility_name') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'facility_name')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '管理粒度',
    dataIndex: 'granularity',
    key: 'granularity',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'granularity') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'granularity')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '设备数量',
    dataIndex: 'facility_num',
    key: 'facility_num',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'facility_num') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'facility_num')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '规格型号',
    dataIndex: 'model',
    key: 'model',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'model') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'model')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '制造厂商',
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'manufacturer') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'manufacturer')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '计量单位',
    dataIndex: 'unit',
    key: 'unit',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'unit') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'unit')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '安装地点',
    dataIndex: 'location',
    key: 'location',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'location') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'location')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }
];
  originMaterialColumns = [{
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
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'material_id') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'material_id')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'name') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'name')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '专业',
    dataIndex: 'major',
    key: 'major',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'major') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'major')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '系统',
    dataIndex: 'system',
    key: 'system',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'system') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'system')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '设备',
    dataIndex: 'facility',
    key: 'facility',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'facility') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'facility')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '入库时间',
    dataIndex: 'in_time',
    key: 'in_time',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'in_time') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'in_time')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '领用时间',
    dataIndex: 'use_time',
    key: 'use_time',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'use_time') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'use_time')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '物资属性',
    dataIndex: 'material_type',
    key: 'material_type',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'material_type') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'material_type')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'department') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'department')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'number') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'number')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
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
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'begin_time') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'begin_time')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '结束时间',
    dataIndex: 'end_time',
    key: 'end_time',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'end_time') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'end_time')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '线路',
    dataIndex: 'line',
    key: 'line',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '站点',
    dataIndex: 'charge',
    key: 'charge',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'charge') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'charge')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '巡检人',
    dataIndex: 'worker',
    key: 'worker',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'worker') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'worker')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '巡检时长',
    dataIndex: 'duration',
    key: 'duration',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'duration') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'duration')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }];

  /** 结果表字段 */
  state = {
    review: false,
    editingItem: {} as any,
    selectedTable: '',
    timeRange: [moment(new Date().toLocaleDateString(), dateFormat).subtract(7, 'days'), moment(new Date().toLocaleDateString(), dateFormat)],
    searchedField: '',
    keyword: '',
    fault: {
      "faultType": [
        [
          "type_comm",
          171
        ],
        [
          "type_net",
          36
        ],
        [
          "type_other",
          21
        ],
        [
          "type_signal",
          95
        ]
      ],
      "faultHandle": [
        [
          "state_closed",
          93
        ],
        [
          "state_fixed",
          79
        ],
        [
          "state_new",
          60
        ],
        [
          "state_processed",
          67
        ]
      ],
      "hourDivided": [{
        "key": "0-2点",
        "value": 15
      }, {
        "key": "10-12点",
        "value": 10
      }, {
        "key": "12-14点",
        "value": 5
      }, {
        "key": "14-16点",
        "value": 0
      }, {
        "key": "16-18点",
        "value": 0
      }, {
        "key": "18-20点",
        "value": 0
      }, {
        "key": "2-4点",
        "value": 0
      }, {
        "key": "20-22点",
        "value": 0
      }, {
        "key": "22-24点",
        "value": 0
      }, {
        "key": "4-6点",
        "value": 10
      }, {
        "key": "6-8点",
        "value": 30
      }, {
        "key": "8-10点",
        "value": 16
      }, {
        "key": "全天",
        "value": 469
      }],
      "lineDivided": {
        "hour": "全天",
        "line1": 28,
        "line2": 12,
        "line3": 38,
        "line4": 30,
        "line5": 8,
        "line6": 26,
        "line7": 30,
        "line8": 23,
        "line9": 90,
        "line10": 22,
        "line11": 28,
        "line12": 14,
        "line13": 8,
        "line14": 7,
        "line15": 13,
        "line16": 40,
        "line17": 52
      }
    },
    "working": {
      "reachRatio": 0.23809523809523808,
      "hourRatio": 0.01147959203947158,
      "updateRatio": 0,
      "illegal": 0,
      "lineDivided": [
        [
          "line1",
          90
        ],
        [
          "line2",
          15
        ],
        [
          "line3",
          30
        ],
        [
          "line4",
          0
        ],
        [
          "line5",
          0
        ],
        [
          "line6",
          0
        ],
        [
          "line7",
          0
        ],
        [
          "line8",
          0
        ],
        [
          "line9",
          0
        ],
        [
          "line10",
          0
        ],
        [
          "line11",
          0
        ],
        [
          "line12",
          0
        ],
        [
          "line13",
          0
        ],
        [
          "line14",
          0
        ],
        [
          "line15",
          0
        ],
        [
          "line16",
          0
        ],
        [
          "line17",
          0
        ]
      ],
      "hourDivided": [{
          "key": "0-2点",
          "value": 0
        },
        {
          "key": "10-12点",
          "value": 45
        },
        {
          "key": "12-14点",
          "value": 45
        },
        {
          "key": "14-16点",
          "value": 0
        },
        {
          "key": "16-18点",
          "value": 0
        },
        {
          "key": "18-20点",
          "value": 0
        },
        {
          "key": "2-4点",
          "value": 0
        },
        {
          "key": "20-22点",
          "value": 0
        },
        {
          "key": "22-24点",
          "value": 0
        },
        {
          "key": "4-6点",
          "value": 0
        },
        {
          "key": "6-8点",
          "value": 0
        },
        {
          "key": "8-10点",
          "value": 45
        },
        {
          "key": "全天",
          "value": 135
        }
      ]
    },
    "equip": {
      "thirdClass": {
        "信号": [{
            "first_class": "信号",
            "third_class": "信号小类1",
            "ratio": 0.08
          },
          {
            "first_class": "信号",
            "third_class": "信号小类2",
            "ratio": 0.03
          },
          {
            "first_class": "信号",
            "third_class": "信号小类3",
            "ratio": 0.01
          },
          {
            "first_class": "信号",
            "third_class": "信号小类4",
            "ratio": 0.01
          }
        ],
        "信息": [{
            "first_class": "信息",
            "third_class": "信息小类1",
            "ratio": 0.06
          },
          {
            "first_class": "信息",
            "third_class": "信息小类2",
            "ratio": 0.04
          },
          {
            "first_class": "信息",
            "third_class": "信息小类3",
            "ratio": 0.01
          },
          {
            "first_class": "信息",
            "third_class": "信息小类4",
            "ratio": 0.01
          }
        ],
        "系统": [{
            "first_class": "系统",
            "third_class": "系统小类1",
            "ratio": 0.05
          },
          {
            "first_class": "系统",
            "third_class": "系统小类2",
            "ratio": 0.03
          },
          {
            "first_class": "系统",
            "third_class": "系统小类3",
            "ratio": 0.03
          },
          {
            "first_class": "系统",
            "third_class": "系统小类4",
            "ratio": 0.03
          }
        ],
        "通信": [{
            "first_class": "通信",
            "third_class": "通信小类1",
            "ratio": 0.05
          },
          {
            "first_class": "通信",
            "third_class": "通信小类2",
            "ratio": 0.04
          },
          {
            "first_class": "通信",
            "third_class": "通信小类3",
            "ratio": 0.03
          },
          {
            "first_class": "通信",
            "third_class": "通信小类4",
            "ratio": 0.01
          }
        ]
      },
      "firstClass": [{
          "key": "信号",
          "value": 0.06
        },
        {
          "key": "信息",
          "value": 0.05
        },
        {
          "key": "系统",
          "value": 0.03
        },
        {
          "key": "通信",
          "value": 0.05
        }
      ]
    },
    "material": {
      "thirdClass": {
        "其他": [
          {
            "first_class": "其他",
            "third_class": "C库占比",
            "ratio": 0.16
          },
          {
            "first_class": "其他",
            "third_class": "帐内占比",
            "ratio": 0.04
          },
          {
            "first_class": "其他",
            "third_class": "帐外占比",
            "ratio": 0
          }
        ],
        "物资": [
          {
            "first_class": "物资",
            "third_class": "C库占比",
            "ratio": 0.14
          },
          {
            "first_class": "物资",
            "third_class": "帐内占比",
            "ratio": 0.03
          },
          {
            "first_class": "物资",
            "third_class": "帐外占比",
            "ratio": 0.03
          }
        ],
        "入库": [
          {
            "first_class": "入库",
            "third_class": "仪器仪表占比",
            "ratio": 0
          },
          {
            "first_class": "入库",
            "third_class": "信号占比",
            "ratio": 0.07
          },
          {
            "first_class": "入库",
            "third_class": "工器具占比",
            "ratio": 0
          },
          {
            "first_class": "入库",
            "third_class": "未分配占比",
            "ratio": 0.01
          },
          {
            "first_class": "入库",
            "third_class": "电源占比",
            "ratio": 0.01
          },
          {
            "first_class": "入库",
            "third_class": "耗材占比",
            "ratio": 0
          },
          {
            "first_class": "入库",
            "third_class": "计算机网络占比",
            "ratio": 0.02
          },
          {
            "first_class": "入库",
            "third_class": "通信占比",
            "ratio": 0.1
          },
          {
            "first_class": "入库",
            "third_class": "附属设备占比",
            "ratio": 0
          }
        ],
        "出库": [
          {
            "first_class": "出库",
            "third_class": "仪器仪表占比",
            "ratio": 0
          },
          {
            "first_class": "出库",
            "third_class": "信号占比",
            "ratio": 0.06
          },
          {
            "first_class": "出库",
            "third_class": "工器具占比",
            "ratio": 0
          },
          {
            "first_class": "出库",
            "third_class": "未分配占比",
            "ratio": 0
          },
          {
            "first_class": "出库",
            "third_class": "电源占比",
            "ratio": 0
          },
          {
            "first_class": "出库",
            "third_class": "耗材占比",
            "ratio": 0
          },
          {
            "first_class": "出库",
            "third_class": "计算机网络占比",
            "ratio": 0.03
          },
          {
            "first_class": "出库",
            "third_class": "通信占比",
            "ratio": 0.12
          },
          {
            "first_class": "出库",
            "third_class": "附属设备占比",
            "ratio": 0
          }
        ]
      }
    },
    "polling": {
      "hourDivided": [
        {
          "key": "0-2点",
          "value": 0.89
        },
        {
          "key": "10-12点",
          "value": 0.89
        },
        {
          "key": "12-14点",
          "value": 0.44
        },
        {
          "key": "14-16点",
          "value": 0
        },
        {
          "key": "16-18点",
          "value": 0
        },
        {
          "key": "18-20点",
          "value": 0
        },
        {
          "key": "2-4点",
          "value": 0
        },
        {
          "key": "20-22点",
          "value": 0
        },
        {
          "key": "22-24点",
          "value": 0
        },
        {
          "key": "4-6点",
          "value": 0.89
        },
        {
          "key": "6-8点",
          "value": 2.67
        },
        {
          "key": "8-10点",
          "value": 1.33
        },
        {
          "key": "全天",
          "value": 7.11
        }
      ],
      "frequent": [
        {
          "frequent": 6.22
        }
      ]
    }
  }

  componentDidMount() {
    const { getResultTables, getOriginTables , getData, location: { pathname } } = this.props;
    const { timeRange, keyword } = this.state;
    const isMetaCenter = pathname.indexOf('metaCenter') > 0;
    const request  = isMetaCenter ? getOriginTables : getResultTables;
    (request() as any).then(data => {
      this.setState({
        selectedTable: data.data[0],
        searchedField: _.reject(this[Columns[data.data[0]]], { key: 'datelabel' })[0].key
      })
      data.data.forEach(table => {
        getData(table, timeRange, this[Columns[data.data[0]]][0].key, keyword);
      })
    });
  }

  handleCellDBLClick = (record, field) => {
    this.setState({
      editingItem: {
        id: record.id,
        field: field
      }
    })
  }

  handleUpdate = (e) => {
    const { updateData, getData } = this.props;
    const { editingItem, selectedTable, timeRange, searchedField, keyword } = this.state;
    if (e.keyCode === 13) {
      (updateData(selectedTable, editingItem, e.target.value) as any).then(data => {
        if (!data.errMsg) {
          getData(selectedTable, timeRange, searchedField, keyword);
          message.success('更新成功');
        }
      })
      this.setState({
        editingItem: {}
      })
    }
  }

  openReview = () => {
    const { getCalcData } = this.props;
    const { timeRange } = this.state;
    this.setState({
      review: true
    })
    getCalcData(timeRange)
    /** 获取计算数据 */
  }

  closeReview = () => {
    this.setState({
      review: false
    })
  }

  handleSubmit = () => {
    /** 导出报表 */
    const { screenshot } = this.props;
    
    (screenshot(document.querySelector('.reports-review').outerHTML) as any).then(data => {
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
    return (_.get(tables, 'data') || []).map(table => <Option key={table}>{table}</Option>)
  }

  renderOptions() {
    const { selectedTable } = this.state;
    return selectedTable && _.reject(this[Columns[selectedTable]], { key: 'datelabel' }).map(item => {
      return <Option key={item.key}>{item.key}</Option>
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.calcData && nextProps.calcData.data) {
      this.setState({...nextProps.calcData.data});
    }
  }

  render() {
    const { review, selectedTable, timeRange, keyword, searchedField } = this.state;
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
        {!isMetaCenter && <Button className="screenshot" type='primary' style={{ float: 'right' }} onClick={this.openReview}>预览</Button>}
      </div>

      <Table 
        style={{ width: '100%' }} 
        scroll={{ x: 2500 }} 
        rowSelection={isMetaCenter ? rowSelection : null} 
        columns={this[Columns[selectedTable]]} 
        dataSource={_.get(this.props[DataType[selectedTable]], 'data')} 
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
        <div className='reports-review' style={{ 
          margin: 30
          // display: 'flex', 
          // justifyContent: 'space-between' 
        }}>
          {/*<div className='left-part' style={{ width: 550 }}>*/}
            <EquipCard data={this.state.equip || {}} />
            <MaterialCard data={this.state.material || {}}/>
            <CheckInCard data={this.state.polling || {}}/>
          {/*</div>*/}
          {/*<div className='right-part' style={{ width: 550 }}>*/}
            {<WorkingCard data={this.state.working || {}} />}
            {<FaultCard 
              data = {this.state.fault || {}}
              // data={_.get(faultData, 'data')} 
              />}
          {/*</div>*/}
        </div>
      </Modal>
    </div>
  }
}

export default connect(mapStateToProps, actions)(Reports)
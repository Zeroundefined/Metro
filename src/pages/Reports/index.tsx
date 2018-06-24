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
  'polling_information_result' = 'checkInColumns'
}

const dateFormat = 'YYYY/MM/DD';

class Reports extends React.Component<RouteComponentProps<any, any> & typeof actions & InitState> {
  faultColumns = [{
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    fixed: true,
    render: text => text.slice(0, 10),
    width: 150
  }, {
    title: '时间段',
    dataIndex: 'hour',
    key: 'hour',
    width: 150
  }, {
    title: '一号线',
    dataIndex: 'line1',
    key: 'line1',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line1') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line1')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '二号线',
    dataIndex: 'line2',
    key: 'line2',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line2') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line2')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '三号线',
    dataIndex: 'line3',
    key: 'line3',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line3') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line3')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '四号线',
    dataIndex: 'line4',
    key: 'line4',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line4') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line4')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '五号线',
    dataIndex: 'line5',
    key: 'line5',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line5') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line5')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '六号线',
    dataIndex: 'line6',
    key: 'line6',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line6') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line6')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '七号线',
    dataIndex: 'line7',
    key: 'line7',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line7') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line7')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '八号线',
    dataIndex: 'line8',
    key: 'line8',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line8') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line8')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '九号线',
    dataIndex: 'line9',
    key: 'line9',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line9') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line9')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '十号线',
    dataIndex: 'line10',
    key: 'line10',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line10') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line10')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '十一号线',
    dataIndex: 'line11',
    key: 'line11',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line11') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line11')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '十二号线',
    dataIndex: 'line12',
    key: 'line12',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line12') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line12')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '十三号线',
    dataIndex: 'line13',
    key: 'line13',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line13') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line13')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '十四号线',
    dataIndex: 'line14',
    key: 'line14',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line14') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line14')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '十五号线',
    dataIndex: 'line15',
    key: 'line15',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line15') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line15')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '十六号线',
    dataIndex: 'line16',
    key: 'line16',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line16') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line16')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '十七号线',
    dataIndex: 'line17',
    key: 'line17',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line17') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line17')} style={{ cursor: 'pointer' }}>{text}</div>
  }, {
    title: '通信故障',
    dataIndex: 'type_comm',
    key: 'type_comm',
    width: 120,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'type_comm') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'type_comm')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '网络故障',
    dataIndex: 'type_net',
    key: 'type_net',
    width: 120,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'type_net') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'type_net')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '信号故障',
    dataIndex: 'type_signal',
    key: 'type_signal',
    width: 120,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'type_signal') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'type_signal')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '其他故障',
    dataIndex: 'type_other',
    key: 'type_other',
    width: 120,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'type_other') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'type_other')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '故障状态-已修复',
    dataIndex: 'state_fixed',
    key: 'state_fixed',
    width: 125,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'state_fixed') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'state_fixed')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '故障状态-已完结',
    dataIndex: 'state_closed',
    key: 'state_closed',
    width: 125,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'state_closed') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'state_closed')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '故障状态-新报修',
    dataIndex: 'state_new',
    key: 'state_new',
    width: 125,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'state_new') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'state_new')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }, {
    title: '故障状态-在处理',
    dataIndex: 'state_processed',
    key: 'state_processed',
    width: 125,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'state_processed') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'state_processed')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }];
  workingColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      fixed: true,
      render: text => text.slice(0, 10),
      width: 150
    }, {
      title: '时间段',
      dataIndex: 'hour',
      key: 'hour',
      width: 100
    }, {
      title: '兑现率',
      dataIndex: 'construction_reach_ratio',
      key: 'construction_reach_ratio',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'construction_reach_ratio') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'construction_reach_ratio')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '工时利用率',
      dataIndex: 'construction_hour_ratio',
      key: 'construction_hour_ratio',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'construction_hour_ratio') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'construction_hour_ratio')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '变更率',
      dataIndex: 'construction_update_ratio',
      key: 'construction_update_ratio',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'construction_update_ratio') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'construction_update_ratio')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '违规项',
      dataIndex: 'construction_illegal',
      key: 'construction_illegal',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'construction_illegal') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'construction_illegal')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '施工数量',
      dataIndex: 'construction_num',
      key: 'construction_num',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'construction_num') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'construction_num')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
    }, {
      title: '一号线',
      dataIndex: 'line1',
      key: 'line1',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line1') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line1')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '二号线',
      dataIndex: 'line2',
      key: 'line2',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line2') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line2')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '三号线',
      dataIndex: 'line3',
      key: 'line3',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line3') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line3')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '四号线',
      dataIndex: 'line4',
      key: 'line4',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line4') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line4')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '五号线',
      dataIndex: 'line5',
      key: 'line5',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line5') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line5')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '六号线',
      dataIndex: 'line6',
      key: 'line6',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line6') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line6')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '七号线',
      dataIndex: 'line7',
      key: 'line7',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line7') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line7')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '八号线',
      dataIndex: 'line8',
      key: 'line8',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line8') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line8')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '九号线',
      dataIndex: 'line9',
      key: 'line9',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line9') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line9')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '十号线',
      dataIndex: 'line10',
      key: 'line10',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line10') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line10')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '十一号线',
      dataIndex: 'line11',
      key: 'line11',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line11') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line11')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '十二号线',
      dataIndex: 'line12',
      key: 'line12',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line12') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line12')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '十三号线',
      dataIndex: 'line13',
      key: 'line13',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line13') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line13')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '十四号线',
      dataIndex: 'line14',
      key: 'line14',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line14') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line14')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '十五号线',
      dataIndex: 'line15',
      key: 'line15',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line15') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line15')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '十六号线',
      dataIndex: 'line16',
      key: 'line16',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line16') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line16')} style={{ cursor: 'pointer' }}>{text}</div>
    }, {
      title: '十七号线',
      dataIndex: 'line17',
      key: 'line17',
      width: 100,
      render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'line17') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'line17')} style={{ cursor: 'pointer' }}>{text}</div>
    }
  ];

  equipColumns = [{
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    fixed: true,
    render: text => text.slice(0, 10),
    width: 150
  }, {
    title: '通信大类',
    dataIndex: 'first_class',
    key: 'first_class',
    width: 100,
  }, {
    title: '通信小类',
    dataIndex: 'third_class',
    key: 'third_class',
    width: 100,
  }, {
    title: '占比',
    dataIndex: 'third_class_ratio',
    key: 'third_class_ratio',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'third_class_ratio') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'third_class_ratio')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }];

  materialColumns = [{
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    fixed: true,
    render: text => text.slice(0, 10),
    width: 150
  }, {
    title: '通信大类',
    dataIndex: 'first_class',
    key: 'first_class',
    width: 100,
  }, {
    title: '通信小类',
    dataIndex: 'third_class',
    key: 'third_class',
    width: 100,
  }, {
    title: '占比',
    dataIndex: 'third_class_ratio',
    key: 'third_class_ratio',
    width: 100,
    render: (text, record) => (this.state.editingItem.id === record.id && this.state.editingItem.field === 'third_class_ratio') ? <Input style={{ height: 22 }} defaultValue={text} onKeyDown={this.handleUpdate} /> : <div onDoubleClick={this.handleCellDBLClick.bind(this, record, 'third_class_ratio')} style={{ cursor: 'pointer' }}>{text || '-'}</div>
  }];

  checkInColumns= [{
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    fixed: true,
    render: text => text.slice(0, 10),
    width: 150
  }, {
    title: '时间段',
    dataIndex: 'hour',
    key: 'hour',
    width: 100
  }, {
    title: '巡检次数',
    dataIndex: 'duration',
    key: 'duration',
    width: 100,
  }, {
    title: '平均巡检时长',
    dataIndex: 'frequent',
    key: 'frequent',
    width: 100,
  }];

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
    }
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
    const { getResultTables, getData } = this.props;
    const { timeRange, keyword } = this.state;
    (getResultTables() as any).then(data => {
      this.setState({
        selectedTable: data.data[0],
        searchedField: _.reject(this[Columns[data.data[0]]], { key: 'date' })[0].key
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
    screenshot(document.querySelector('.reports-review').outerHTML);

    this.closeReview();
  }

  handleTableChange = (value) => {
    this.setState({
      selectedTable: value,
      searchedField: _.reject(this[Columns[value]], { key: 'date' })[0].key
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
    const { resultTables, location: { pathname } } = this.props;
    /** 报表管理页面 */
    if (pathname.indexOf('reports') > -1) {
      return (_.get(resultTables, 'data') || []).map(table => <Option key={table}>{table}</Option>)
    }

    return null;
  }

  renderOptions() {
    const { selectedTable } = this.state;
    return selectedTable && _.reject(this[Columns[selectedTable]], { key: 'date' }).map(item => {
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
    console.log(this.props);
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

      <Table style={{ width: 1500 }} scroll={{ x: 2500 }} rowSelection={isMetaCenter ? rowSelection : null} columns={this[Columns[selectedTable]]} dataSource={_.get(this.props[DataType[selectedTable]], 'data')} />
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
          // display: 'flex', 
          // justifyContent: 'space-between' 
        }}>
          {/*<div className='left-part' style={{ width: 550 }}>*/}
            <EquipCard data={this.state.equip || {}}  />
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
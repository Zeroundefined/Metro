import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';

interface Props {
  data: any
}

export class FaultCard extends React.Component < Props > {

  handleFaultPercentConfig = () => {
    /** 故障类型占比 */
    const {
      data
    } = this.props;
    const faultType = data.faultType;
    const total = faultType.reduce((tol, cur) => tol + cur[1], 0)
    const final = [];
    faultType.map(type => {
      if (type[0] == 'type_comm') {
        final.push(['故障类型-通信类', type[1] / total]);
      }
      if (type[0] == 'type_net') {
        final.push(['故障类型-网络类', type[1] / total]);
      }
      if (type[0]=='type_signal') {
        final.push(['故障类型-信号类', type[1] / total]);
      }
      if (type[0]== 'type_other') {
        final.push(['故障类型-其他类', type[1] / total]);
      }
    })

    return {
      chart: {
        spacing: [40, 0, 40, 0]
      },
      title: {
        floating: true,
        text: '故障类型占比'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: 'black'
            }
          }
        }
      },
      series: [{
        type: 'pie',
        innerSize: '60%',
        name: '故障占比',
        data: final
      }]
    }
  }

  handle24HourConfig = () => {
    /** 24小时故障情况 */
    const {
      data
    } = this.props;
    const hourDivided = data.hourDivided;
    let categories = [];
    let faults =[];

    hourDivided.map(divid => {
      categories.push(divid.key);
      faults.push(divid.value)
    })
    return {
      chart: {
        type: 'area'
      },
      title: {
        text: '24小时故障情况'
      },
      xAxis: {
        allowDecimals: false,
        categories: categories,
      },
      yAxis: {
        title: {
          text: '故障数量'
        },
      },
      tooltip: {
        pointFormat: '{series.name} 发生故障 <b>{point.y:,.0f}</b>次'
      },
      series: [{
        name: '故障情况',
        data: faults
      }]
    }
  }

  handleFaultStatusConfig = () => {
    const {
      data
    } = this.props;
    const final = [];
    const faultHandle = data.faultHandle;
    faultHandle.map(handle => {
      if (handle[0] == 'state_closed') {
        final.push(['故障状态-已完结', handle[1]]);
      }
      if (handle[0] == 'state_fixed') {
        final.push(['故障状态-已修复', handle[1]]);
      }
      if (handle[0]=='state_new') {
        final.push(['故障状态-新报修', handle[1]]);
      }
      if (handle[0]=='state_processed') {
        final.push(['故障状态-在处理', handle[1]]);
      }
    })



    return {
      chart: {
        spacing: [40, 0, 40, 0]
      },
      title: {
        text: '故障处理状态',
        margin: 30
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        type: 'pie',
        innerSize: '60%',
        name: '故障处理状态',
        data: final
      }]
    }
  }

  handleLineFaultConfig = () => {
    const {
      data
    } = this.props;
    const lineDivided = data.lineDivided;
    const final = [];
    for (var i = 1; i <= 17; i++) {
      final.push(lineDivided[`line${i}`]);
    }

    return {
      chart: {
        type: 'column'
      },
      title: {
        text: '各线路故障情况'
      },
      xAxis: {
        categories: [
          '一号线', '二号线', '三号线', '四号线', '五号线', '六号线', '七号线', '八号线', '九号线', '十号线', '十一号线', '十二号线', '十三号线', '十四号线', '十五号线', '十六号线', '十七号线'
        ],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: '故障数量（个）'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: 发生故障<b>{point.y}个</b>'
      },
      plotOptions: {
        column: {
          borderWidth: 0
        }
      },
      series: [{
        name: '故障数量',
        data: final
      }]
    }
  }

  render() {
    // const {
    //   data
    // } = this.props;

    return <div className = 'fault-card' >
      <ReactHighcharts config = {
        this.handleFaultPercentConfig()
      }
    /> 
    <ReactHighcharts config = {
      this.handle24HourConfig()
    }/> 
    <ReactHighcharts config = {
      this.handleFaultStatusConfig()
    }/> 
    <ReactHighcharts config = {
      this.handleLineFaultConfig()
    }/> 
    </div>
  }
}
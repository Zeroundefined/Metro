import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import {
  Card
} from 'src/components';
import {linesList, hoursList} from '../../../constant/tableConst';
interface Props {
  data: any
}


export class FaultCard extends React.Component < Props > {
  state = {
    lineFault:''
  }
  handleFaultPercentConfig = () => {
    /** 故障类型占比 */
    const {
      data
    } = this.props;
    const faultType = data.faultType || [];
    const total = faultType.reduce((tol, cur) => tol + cur[1], 0)
    const final = [];
    faultType.map(type => {
      // if (type[0] == 'type_comm') {
      //   final.push(['故障类型-通信类', type[1] / total]);
      // }
      // if (type[0] == 'type_net') {
      //   final.push(['故障类型-网络类', type[1] / total]);
      // }
      // if (type[0]=='type_signal') {
      //   final.push(['故障类型-信号类', type[1] / total]);
      // }
      // if (type[0]== 'type_other') {
      //   final.push(['故障类型-其他类', type[1] / total]);
      // }
      final.push([type.type, type.count]);
    })

    return {
      chart: {
        spacing: [40, 0, 40, 0],
        backgroundColor : '#030B1E'
      },
      title: {
        // floating: true,
        text: '故障类型占比',
        style: {
          color: '#ffffff'
        }
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
              color: '#ffffff'
            }
          }
        }
      },
      series: [{
        type: 'pie',
        innerSize: '60%',
        name: '故障占比',
        data: final
      }],
      colors: ['#9A52A4', '#E4A15A', '#CA476F', '#68A788']
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
    hoursList.map(hour => {
      let currentHour = hourDivided.find(item => item.hour == hour);
      categories.push(`${hour}点`);
      faults.push(currentHour ? currentHour.count : 0)
    })
    return {
      chart: {
        type: 'area',
        backgroundColor : '#030B1E'
      },
      title: {
        text: '24小时故障情况',
        style: {
          color: '#ffffff'
        }
      },
      xAxis: {
        allowDecimals: false,
        categories: categories,
      },
      yAxis: {
        title: {
          text: '故障数量',
          style: {
            color: '#ffffff'
          }
        },
      },
      tooltip: {
        pointFormat: '{series.name} 发生故障 <b>{point.y:,.0f}</b>次'
      },
      series: [{
        name: '故障情况',
        data: faults,
        style: {
          color: '#ffffff'
        }
      }],
    }
  }

  handleFaultStatusConfig = () => {
    const {
      data
    } = this.props;
    const final = [];
    const faultHandle = data.faultHandle;
    faultHandle && faultHandle.map(handle => {
      // if (handle[0] == 'state_closed') {
      //   final.push(['故障状态-已完结', handle[1]]);
      // }
      // if (handle[0] == 'state_fixed') {
      //   final.push(['故障状态-已修复', handle[1]]);
      // }
      // if (handle[0]=='state_new') {
      //   final.push(['故障状态-新报修', handle[1]]);
      // }
      // if (handle[0]=='state_processed') {
      //   final.push(['故障状态-在处理', handle[1]]);
      // }
        final.push([handle.status, handle.count]);

    })



    return {
      chart: {
        spacing: [40, 0, 40, 0],
        backgroundColor : '#030B1E'
      },
      title: {
        text: '故障处理状态',
        margin: 30,
        style: {
          color: '#ffffff'
        }
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
    const lineFault = [];
    const categories = [
      '一号线', '二号线', '三号线', '四号线', '五号线', '六号线', '七号线', '八号线', '九号线', '十号线', '十一号线', '十二号线', '十三号线', '十四号线', '十五号线', '十六号线', '十七号线'
    ];
    if(lineDivided) {
      linesList.map(line => {
        let currentLine = lineDivided.find(item => item.line == line.name);
        final.push(currentLine ? currentLine['count'] : '0')
        lineFault.push(`${line.name}${currentLine ? currentLine['count'] : '0'}`)
      })
    }

    return [{
      chart: {
        type: 'column',
        backgroundColor : '#030B1E'
      },
      title: {
        text: '各线路故障情况',
        style: {
          color: '#ffffff'
        }
      },
      xAxis: {
        categories,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: '故障数量（个）',
          style: {
            color: '#ffffff'
          }
        }
      },
      tooltip: {
        pointFormat: '{series.name}: 发生故障<b>{point.y}个</b>'
      },
      plotOptions: {
        column: {
            colorByPoint:true,
            borderWidth: 0
        }
      },
      series: [{
        name: '故障数量',
        data: final
      }],
      colors: ['#CE0000', '#8BCB1F', '#FECD06', '#502E84', '#9A52A4', '#E80378', '#F66F15', '#089BDE', '#7DC8E8', '#B1A0C4', '#8E162F', '#03795F', '#E794BF', '#89CFBD', '#BB786F']
    }, lineFault]
  }


  render() {
    const {
      data
    } = this.props;
    const { faultType, hourDivided, faultHandle, lineDivided} = data;
    // let text = this.state.lineFault.join(',')
    let [config, lineFault] = this.handleLineFaultConfig();

    return <div className='fault-card' style={{ marginBottom: 30 }}>
      <Card className='equip-card' title='故障信息'>
          
        <div style={{ minWidth: '220px', width: '50%' }}>
          {
            faultType && faultType.length ?
            <ReactHighcharts config={
              this.handleFaultPercentConfig()
            }/> :
            <div style={{flex: 1, textAlign: 'center', margin: '50px 0', color: '#827f7f' }}> 暂无故障类型占比</div>
          }
        </div>

        <div style={{ minWidth: '220px', width: '50%' }}>
          {hourDivided && hourDivided.length ?
            <ReactHighcharts config={
              this.handle24HourConfig()
            } />:
            <div style={{flex: 1, textAlign: 'center', margin: '50px 0', color: '#827f7f' }}> 暂无24小时故障情况</div>
          }
        </div>
        <div style={{ minWidth: '220px', width: '50%' }}>
          {
            faultHandle && faultHandle.length ?
            <ReactHighcharts config={
              this.handleFaultStatusConfig()
            } /> :
            <div style={{flex: 1, textAlign: 'center', margin: '50px 0', color: '#827f7f' }}> 暂无故障处理状态</div>
          }
          <div style={{padding: '20px 40px'}}>XX年XX月故障接报系统共计接报XX起故障，较去年同比增长（减少）XX%，较上月环比增长（减少）XX%，引起五分钟晚点X起，全年累计X起，全年累计X起，十五分钟晚点X起。其中信号专业故障XX起，通信专业故障XX起，信息专业故障XX起，平均故障处置用时X小时X分钟，故障修复率XX%，闭环率XX%。</div>
        </div>
        <div style={{ minWidth: '220px', width: '50%' }}>
          {
            lineDivided && lineDivided.length ?
            <ReactHighcharts config={config} />:
            <div style={{flex: 1, textAlign: 'center', margin: '50px 0', color: '#827f7f' }}> 暂无各线路故障情况</div>
          }
          <div style={{padding: '20px 40px'}}>各线路故障数：{lineFault}</div>
        </div>
      </Card>

    </div>
  }
}
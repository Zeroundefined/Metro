import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { Card } from '../../../components';
import './WorkingCard.scss';
import { Divider } from 'antd';
import {linesList, hoursList} from '../../../constant/tableConst';

interface Props {
  data: any;
  timeRange: any;
}

export class WorkingCard extends React.Component<Props> {
  fixNumber = num => {
    return num && Number((num * 100).toFixed(2))
  }
  handleReachRatioConfig = () => {
    const { data } = this.props;
    let { reachRatio } = data;
    return {
      chart:{
        backgroundColor : '#030B1E'
      },
      title: {
        text: '施工计划兑现率',
        style: {
          color: '#ffffff'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      colors: ['#40a9ff', 'rgba(0,0,0,0.05)'],
      series: [{
        type: 'pie',
        data: [
          {
            name: '施工计划兑现率',
            y: this.fixNumber(reachRatio),
            sliced: true,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  color: '#ffffff'
                }
            },
            color: '#4B99A5'
          },
          {
            name: 'Useless',
            y: this.fixNumber(1-reachRatio),
            dataLabels: {
              enabled: false,
            },
          },
        ]
      }]
    }
  }

  handleWorkingTimeRateConfig = () => {
    const { data } = this.props;
    let { hourRatio } = data;
    return {
      chart:{
        backgroundColor : '#030B1E'
      },
      title: {
        text: '施工计划工时利用率',
        style: {
          color: '#ffffff'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      colors: ['#40a9ff', 'rgba(0,0,0,0.05)'],
      series: [{
        name: '比例',
        type: 'pie',
        data: [
          {
            name: '施工计划工时利用率',
            y: this.fixNumber(hourRatio),
            sliced: true,
            dataLabels: {
              enabled: false,
            },
            color: '#DF5A5A'
          },
          {
            name: 'Userless',
            y: this.fixNumber(1-hourRatio),
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
          },
        ]
      }]
    }
  }

  handleUpdateRatioConfig = () => {
    const { data } = this.props;
    let { updateRatio } = data;
    return {
      chart: {
        backgroundColor : '#030B1E'
      },
      title: {
        text: '施工计划变更率',
        style: {
          color: '#ffffff'
        }
      },
      colors: ['#40a9ff', 'rgba(0,0,0,0.05)'],
      series: [{
        type: 'pie',
        data: [
          {
            name: '施工计划变更率',
            y: this.fixNumber(updateRatio),
            sliced: true,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
            color: '#6BB582'
          },
          {
            name: 'Useless',
            y: this.fixNumber(1-updateRatio),
            dataLabels: {
              enabled: false,
            },
          },
        ]
      }]
    }
  }

  handleLineDividedConfig = () => {
    const {
      data
    } = this.props;
    const lineDivided = data.lineDivided;
    const list = [];
    const lineWorking = [];
    const categories = [
      '一号线', '二号线', '三号线', '四号线', '五号线', '六号线', '七号线', '八号线', '九号线', '十号线', '十一号线', '十二号线', '十三号线', '十四号线', '十五号线', '十六号线', '十七号线'
    ];
    if(lineDivided) {
      linesList.map(line => {
        let currentLine = lineDivided.find(item => item.line == line.id);
        list.push(currentLine ? currentLine['count'] : '0')
        lineWorking.push(`${line.name}${currentLine ? currentLine['count'] : '0'}起`)
      })
    }

    return [{
      chart: {
        type: 'column',
        backgroundColor : '#030B1E',
      },
      title: {
        text: '施工数量(路线)',
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
          text: '施工数量',
          style: {
            color: '#ffffff'
          }
        }
      },
      tooltip: {
        // head + 每个 point + footer 拼接成完整的 table
        headerFormat: `<span style='font-size:10px'>{point.key}</span><table>`,
        pointFormat: `<tr><td style='color:{series.color};padding:0'>{series.name}: </td>' +
          '<td style='padding:0'><b>{point.y:.1f} mm</b></td></tr>`,
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
            colorByPoint:true
        }
      },
      series: [{
        data: list,
        name: '路线'
      }],
      colors: ['#CE0000', '#8BCB1F', '#FECD06', '#502E84', '#9A52A4', '#E80378', '#F66F15', '#089BDE', '#7DC8E8', '#B1A0C4', '#8E162F', '#03795F', '#E794BF', '#89CFBD', '#BB786F']
    }, lineWorking.join('， ')]
  }

  handleHourDividedConfig = () => {
    const { data } = this.props;
    let { hourDivided } = data;
    let categories = [];
    let datas =[];
    hoursList.map(hour => {
      let currentHour = hourDivided.find(item => item.hour == hour);
      categories.push(`${hour}点`);
      datas.push(currentHour ? currentHour.count : 0)
    })
    // hourDivided && hourDivided.map(divid => {
    //   categories.push(divid.key);
    //   datas.push(divid.value)
    // })

    return {
      chart: {
        type: 'area',
        backgroundColor : '#030B1E'
      },
      title: {
        text: '施工数量（每小时）',
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
          text: '施工小时',
          style: {
            color: '#ffffff'
          }
        },
        labels: {
          formatter: function () {
            return this.value + 'h';
          }
        }
      },
      series: [{
        data: datas,
        name: '时间'
      }],
      colors: ['#f5ab24']
    }
  }



  render() {
    const { data, timeRange } = this.props;
    const {reachRatio, hourRatio, updateRatio, illegal, hourDivided, workingActual, lineDivided, informations} = data;
    let fromMonth = new Date(timeRange).getMonth() + 1;
    let [LineDividedConfig, lineWorking] = this.handleLineDividedConfig();
    return <Card className='working-card' title='施工模块' style={{ marginBottom: 30}}>
      <div style={{minWidth: '220px', width: '50%'}}>
        {
          reachRatio !== null ? <ReactHighcharts config={this.handleReachRatioConfig()} /> : <div style={{textAlign: 'center', margin: '50px 0', color: '#827f7f' }}>暂无施工计划兑现率</div>
        }
      </div>

      <div style={{minWidth: '220px', width: '50%'}}>
        {
          hourRatio !== null ? <ReactHighcharts config={this.handleWorkingTimeRateConfig()} /> : <div style={{textAlign: 'center', margin: '50px 0', color: '#827f7f' }}>暂无施工计划工时利用率</div>
        }
      </div>

      <div style={{minWidth: '220px', width: '50%'}}>
        {
          updateRatio !== null ? <ReactHighcharts config={this.handleUpdateRatioConfig()} /> : <div style={{textAlign: 'center', margin: '50px 0', color: '#827f7f' }}>暂无施工计划变更率</div> 
        }
      </div>

      <div style={{minWidth: '220px', width: '50%'}}>
      {illegal ?
        <div className="illegal" style={{textAlign: 'center', margin: 'auto', minHeight: '220px'}}>
          <div className="text" style={{color: '#ffffff', fontSize: '18px'}}>施工违规项</div>
          <div className="content" style={{color: '#3cc5d4', marginTop: '40px', fontSize: '30px'}}>
            违规施工<span style={{margin: '0 10px', fontSize: '50px', color: '#f5be25'}}>{data.illegal}</span>起</div>
        </div>:
        <div style={{textAlign: 'center', margin: '50px 0', color: '#827f7f' }}>暂无施工违规数据</div>
      }
      </div>

      <div style={{minWidth: '220px', width: '50%'}}>
        {lineDivided && lineDivided.length ?
          <ReactHighcharts config={LineDividedConfig} /> :
          <div style={{textAlign: 'center', margin: '50px 0', color: '#827f7f' }}>暂无施工数量(路线)</div>
        }
        {
          lineWorking ?
          <div style={{padding: '20px 40px'}}>各线路施工数{lineWorking}</div> : ''  
        }
      </div>

      <div style={{minWidth: '220px', width: '50%'}}>
        {hourDivided && hourDivided.length ?
          <div>
            <ReactHighcharts config={this.handleHourDividedConfig()} />
          </div> :
          <div style={{textAlign: 'center', margin: '50px 0', color: '#827f7f' }}>暂无施工数量(时间)</div>
        }
        {informations && informations.length ?
          <div style={{padding: '20px 40px'}}>
            {fromMonth}月施工管理系统共办理{informations[0].construction_num}起施工
            ，其中日常巡检施工{informations[0].day_polling_num}起，
            项目施工{informations[0].project_contruction_num}起，
            二级重大施工{informations[0].a}起
            。施工兑现率{(informations[0].b * 100).toFixed(2)}%，
            工时利用率{(informations[0].c * 100).toFixed(2)}%，
            实施规范率{(informations[0].d * 100).toFixed(2)}%，
            计划变更率{(informations[0].e * 100).toFixed(2)}%。
          </div> :''
        }
      </div>
    </Card>
  }
}
import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { Card } from '../../../components';
import './WorkingCard.scss';

interface Props {
  data: any;
}

export class WorkingCard extends React.Component<Props> {
  fixNumber = num => {
    return num && Number((num * 100).toFixed(2))
  }
  handleReachRatioConfig = () => {
    const { data } = this.props;
    let { reachRatio } = data;
    return {
      title: {
        text: '施工计划兑现率'
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

            },
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
      title: {
        text: '施工计划工时利用率'
      },
      colors: ['#40a9ff', 'rgba(0,0,0,0.05)'],
      series: [{
        type: 'pie',
        data: [
          {
            name: '施工计划工时利用率',
            y: this.fixNumber(hourRatio),
            sliced: true,
            dataLabels: {
              enabled: false,
            },
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
      title: {
        text: '施工计划变更率'
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
      for (var i = 1; i <= 17; i++) {
        list.push(lineDivided[i-1][1]);
        lineWorking.push(`${categories[i-1]}${lineDivided[i-1][1]}个`)
      }
    }

    return [{
      chart: {
        type: 'column'
      },
      title: {
        text: '施工数量(路线)'
      },
      xAxis: {
        categories,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: '施工数量'
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
      series: [{
        data: list
      }]
    }, lineWorking.join(',')]
  }

  handleHourDividedConfig = () => {
    const { data } = this.props;
    let { hourDivided } = data;
    let categories = [];
    let datas =[];

    hourDivided && hourDivided.map(divid => {
      categories.push(divid.key);
      datas.push(divid.value)
    })

    return {
      chart: {
        type: 'area'
      },
      title: {
        text: '施工数量（每小时）'
      },
      xAxis: {
        allowDecimals: false,
        categories: categories,
      },
      yAxis: {
        title: {
          text: '施工小时'
        },
        labels: {
          formatter: function () {
            return this.value + 'h';
          }
        }
      },
      series: [{
        data: datas
      }]
    }
  }



  render() {
    const { data } = this.props;
    let [LineDividedConfig, lineWorking] = this.handleLineDividedConfig();
    return <Card className='working-card' title='施工模块' style={{ marginBottom: 30}}>
      <div style={{minWidth: '220px', width: '50%'}}><ReactHighcharts config={this.handleReachRatioConfig()} /></div>
      <div style={{minWidth: '220px', width: '50%'}}><ReactHighcharts config={this.handleWorkingTimeRateConfig()} /></div>
      <div style={{minWidth: '220px', width: '50%'}}><ReactHighcharts config={this.handleUpdateRatioConfig()} /></div>
      <div className="illegal" style={{textAlign: 'center', margin: 'auto'}}>
        <div className="text" style={{color: '#333333', fontSize: '18px'}}>施工违规项</div>
        <div className="content" style={{color: '#3cc5d4', marginTop: '40px', fontSize: '30px'}}>
          违规施工<span style={{margin: '0 10px', fontSize: '50px', color: '#f5be25'}}>{data.illegal}</span>起</div>
      </div>
      <div style={{minWidth: '220px', width: '50%'}}><ReactHighcharts config={LineDividedConfig} />
        <div style={{padding: '20px 40px'}}>各线路施工数{lineWorking}</div>   
      </div>
      <div style={{minWidth: '220px', width: '50%'}}><ReactHighcharts config={this.handleHourDividedConfig()} />
        <div style={{padding: '20px 40px'}}>XX年XX月施工管理系统共办理XX起施工，其中日常巡检施工XX起，项目施工XX起，二级重大施工XX起。施工兑现率XX，工时利用率XX，实施规范率XX，计划变更率XX。</div>
      </div>
    </Card>
  }
}
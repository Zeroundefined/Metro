import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { Card } from '../../../components';
import './WorkingCard.scss';

interface Props {
  data: any;
}

export class WorkingCard extends React.Component<Props> {
  fixNumber = num => {
    return Number((num * 100).toFixed(2))
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
            name: 'Userless',
            y: this.fixNumber(1-reachRatio),
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
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
            name: '施工计划兑现率',
            y: this.fixNumber(hourRatio),
            sliced: true,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
          },
          {
            name: 'Userless',
            y: this.fixNumber(1-hourRatio),
            dataLabels: {
              enabled: true,
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
            name: 'Userless',
            y: this.fixNumber(1-updateRatio),
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
          },
        ]
      }]
    }
  }

  handleLineDividedConfig = () => {
    const { data } = this.props;
    let { lineDivided } = data;
    let list = lineDivided.reduce((tol, cur) => {
      tol.push(cur[1])
      return tol
    }, [])
    return {
      chart: {
        type: 'column'
      },
      title: {
        text: '施工数量(路线)'
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
    }
  }

  handleHourDividedConfig = () => {
    const { data } = this.props;
    let { hourDivided } = data;
    let categories = [];
    let datas =[];

    hourDivided.map(divid => {
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
    const cashRate = {
      title: {
        text: '兑现率（日）'
      },
      colors: ['#40a9ff', 'rgba(0,0,0,0.05)'],
      series: [{
        type: 'pie',
        data: [
          {
            name: 'Useful',
            y: 66.0,
            sliced: true,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
          },
          {
            name: 'Userless',
            y: 34.0,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
          },
        ]
      }]
    }

    const workingTimeRate = {
      title: {
        text: '工时利用率（日）'
      },
      colors: ['#f5222d', 'rgba(0,0,0,0.05)'],
      series: [{
        type: 'pie',
        data: [
          {
            name: 'Useful',
            y: 44.0,
            sliced: true,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
          },
          {
            name: 'Userless',
            y: 56.0,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
          },
        ]
      }]
    }

    const standardRate = {
      title: {
        text: '实施规范率（日）'
      },
      colors: ['#f5222d', 'rgba(0,0,0,0.05)'],
      series: [{
        type: 'pie',
        data: [
          {
            name: 'Useful',
            y: 26.0,
            sliced: true,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
          },
          {
            name: 'Userless',
            y: 74.0,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
          },
        ]
      }]
    }

    const changeRate = {
      title: {
        text: '计划变更率（日）'
      },
      chart: {
        borderColor: '#eee'
      },
      colors: ['#fa8c16', 'rgba(0,0,0,0.05)'],
      series: [{
        type: 'pie',
        data: [
          {
            name: 'Useful',
            y: 26.0,
            sliced: true,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
          },
          {
            name: 'Userless',
            y: 74.0,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',

            },
          },
        ]
      }]
    }

    const lineConstConf = {
      chart: {
        type: 'column'
      },
      title: {
        text: '月平均降雨量'
      },
      subtitle: {
        text: '数据来源: WorldClimate.com'
      },
      xAxis: {
        categories: [
          '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: '降雨量 (mm)'
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
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      }]
    }

    const hourConstConf = {
      chart: {
        type: 'area'
      },
      title: {
        text: '施工数量（每小时）'
      },
      xAxis: {
        allowDecimals: false
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
        data: [14, 12, 1, 3, 22, 6, 11, 22, 18, 12, 23, 23,
          18, 14, 18, 18, 18, 18, 14, 22, 18, 18,
          18, 14, 14, 18, 18, 18, 14, 17, 14,
          18, 18, 14, 21, 21, 19, 14, 23, 16,
          22, 19, 22, 14, 19, 19, 19, 19, 19,
          19, 21, 17, 21, 14, 17, 14, 18, 17,
          17, 17, 17, 17, 17, 14, 17, 17, 17]
      }]
    }

    return <Card className='working-card' title='施工模块'>
      <ReactHighcharts config={this.handleReachRatioConfig()} />
      <ReactHighcharts config={this.handleWorkingTimeRateConfig()} />
      <ReactHighcharts config={this.handleUpdateRatioConfig()} />
      <div>
        <div>施工违规项</div>
        <div>违规施工{data.illegal}起</div>
      </div>
      <ReactHighcharts config={this.handleLineDividedConfig()} />
      <ReactHighcharts config={this.handleHourDividedConfig()} />
    </Card>
  }
}
import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import './EquipCard.scss';
import {
  Card
} from 'src/components';

export class EquipCard extends React.Component {
  render() {

    const handleConf = () => {
      const {
        data
      } = this.props;
      const {
        thirdClass
      } = data
      let conf = [];
      Object.entries(thirdClass).map(data => {
        let materials = [];
        data[1].map(item => {
          materials.push([item.third_class, item.ratio * 100])
        });
        conf.push({
          chart: {
            spacing: [0, 20, 20, 0]
          },
          title: {
            useHTML: true,
            text: `<div>${data[0]}</div><div>40%</div>`
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
            name: '市场份额',
            data: materials
          }])
      })
      return conf;
    }

    const conf1 = {
      chart: {
        spacing: [0, 20, 20, 0]
      },
      title: {
        useHTML: true,
        text: '<div>信号</div><div>40%</div>'
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
        name: '市场份额',
        data: [
          ['信息小类1', 26],
          ['信息小类2', 24],
          ['信息小类3', 40],
          ['信息小类4', 10]
        ]
      }]
    }
    const conf2 = {
      chart: {
        spacing: [0, 20, 20, 0]
      },
      title: {
        useHTML: true,
        text: '<div>系统</div><div>30%</div>'
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
        name: '市场份额',
        data: [
          ['信息小类1', 26],
          ['信息小类2', 24],
          ['信息小类3', 40],
          ['信息小类4', 10]
        ]
      }]
    }
    const conf3 = {
      chart: {
        spacing: [0, 20, 20, 0]
      },
      title: {
        useHTML: true,
        text: '<div>信息</div><div>20%</div>'
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
        name: '市场份额',
        data: [
          ['信息小类1', 26],
          ['信息小类2', 24],
          ['信息小类3', 40],
          ['信息小类4', 10]
        ]
      }]
    }
    const conf4 = {
      chart: {
        spacing: [0, 20, 20, 0]
      },
      title: {
        useHTML: true,
        text: '<div>通信</div><div>10%</div>'
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
        name: '市场份额',
        data: [
          ['信息小类1', 26],
          ['信息小类2', 24],
          ['信息小类3', 40],
          ['信息小类4', 10]
        ]
      }]
    }
    console.log(handleConf())
    return <Card className='equip-card' title='设备模块' >
    {
      handleConf().map(data => {
        return <ReactHighcharts config={data}/>
      })
    }
    </Card>
  }
}
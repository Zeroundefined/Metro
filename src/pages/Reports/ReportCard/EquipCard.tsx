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
        thirdClass, firstClass
      } = data
      let conf = [];
      thirdClass && Object.entries(thirdClass).map(data => {
        let materials = [];
        data[1].map(item => {
          materials.push([item.third_class, item.ratio * 100])
        });
        let total = firstClass.reduce((tol, cur) => tol + cur.value, 0);
        let percent = ((firstClass.find(item => item.key == data[0]).value/total) * 100).toFixed(2) ;
        conf.push({
          chart: {
            spacing: [0, 20, 20, 0]
          },
          title: {
            useHTML: true,
            text: `<div>${data[0]}</div><div>${percent}%</div>`
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
    return <div>
    <Card className='equip-card' title='设备信息'>
    {
      handleConf().map(data => {
        return <div style={{minWidth: '220px'; width: '50%';}}><ReactHighcharts config={data}/></div>
      })
    }
    </Card>
    </div>
  }
}
import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import './MaterialCard.scss';
import {
  Card
} from 'src/components';

export class MaterialCard extends React.Component {
  render() {
    const handleConf = () => {
      const {
        data
      } = this.props;
      const {
        thirdClass
      } = data
      let conf = [];
      thirdClass && Object.entries(thirdClass).map(data => {
        let materials = [];
        data[1].map(item => {
          materials.push([item.third_class, item.ratio * 100])
        });
        conf.push({
          chart: {
            spacing: [0, 20, 20, 0]
          },
          title: {
            text: data[0]
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
          }]
        })
      })
      return conf;
    }


    const conf1 = {
      chart: {
        spacing: [0, 20, 20, 0]
      },
      title: {
        text: '物资'
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
        text: '其他'
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
        text: '入库'
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
        text: '出库'
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
    var text = handleConf()
    return <Card className = 'material-card' title = '物资模块' >
    {
      handleConf().map(chart => {
        return <div style={{minWidth: '220px'; width: '50%';}}><ReactHighcharts config={chart}/></div>
      })
    }
      {/*<
      ReactHighcharts config = {
        conf1
      }
    /> <
    ReactHighcharts config = {
      conf2
    }
    /> <
    ReactHighcharts config = {
      conf3
    }
    /> <
    ReactHighcharts config = {
      conf4
    }
    /> */}
    </Card>
  }
}
import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import './MaterialCard.scss';
import {
  Card
} from 'src/components';

interface Props {
  data: any
}

export class MaterialCard extends React.Component<Props> {
  handleConf = () => {
    const { data: { thirdClass } } = this.props;
    let conf = [];
    thirdClass && Object.entries(thirdClass).map(data => {
      let materials = [];
      (data[1] as any).map(item => {
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
  render() {

    var text = this.handleConf()
    return <Card className='material-card' title='物资模块' style={{ marginBottom: 30}}>
      {
        this.handleConf().map(chart => {
          return <div style={{ minWidth: '220px', width: '50%' }}><ReactHighcharts config={chart} /></div>
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
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
    const { data } = this.props;
    let conf = [];
    data && Object.entries(data).map(list => {
      let materials = [];
      (list[1] as any).map(item => {
        materials.push([item.staut, item.ratio])
      });
      conf.push({
        chart: {
          spacing: [0, 20, 20, 0],
          backgroundColor : '#030B1E',
        },
        title: {
          text: list[0],
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
          name: '市场份额',
          data: materials
        }],
        colors: ['#E09343', '#55F4F0', '#53BFFD', '#03795F', '#E794BF', '#9A52A4', '#7DC8E8']
      })
    })
    return conf;
  }
  render() {
    const { data } = this.props;
    return <Card className='material-card' title='物资模块' style={{ marginBottom: 30}}>
      {
        Object.keys(data).length ? 
        this.handleConf().map(chart => {
          return <div style={{ minWidth: '220px', width: '50%' }}><ReactHighcharts config={chart} /></div>
        }) :
        <div style={{textAlign: 'center', margin: '50px 0', color: '#827f7f'}}>暂无物资数据</div>
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
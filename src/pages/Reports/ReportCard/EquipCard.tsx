import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import './EquipCard.scss';
import {
  Card
} from 'src/components';
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';

interface Props {
  data: any
}

export class EquipCard extends React.Component<Props> {
  render() {
    const {
      data
    } = this.props;
    const {
      thirdClass, firstClass
    } = data

    const handleConf = () => {
      let conf = [];
      thirdClass && Object.entries(thirdClass).map(data => {
        let materials = [];
        (data[1] as any).map(item => {
          materials.push([item.third_class, item.ratio * 100])
        });
        let total = firstClass.reduce((tol, cur) => tol + cur.value, 0);
        let percent = ((firstClass.find(item => item.key == data[0]).value/total) * 100).toFixed(2) ;
        conf.push({
          chart: {
            spacing: [0, 20, 20, 0],
            backgroundColor : '#030B1E',
          },
          title: {
            useHTML: true,
            text: `<div>${data[0]}</div><div>${percent}%</div>`,
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
          colors: ['#F78055', '#934D98', '#66A6CA', '#FE5486'] 
        })
      })
      return conf;
    }

    return <div style={{ marginBottom: 30}}>
    <Card className='equip-card' title='设备模块'>
    {
      Object.keys(thirdClass).length ? 
      handleConf().map((data, key) => {
        return <div style={{minWidth: '220px', width: '50%'}} key={key}>
            <ReactHighcharts config={data}/>
          </div> 
    }) : 
    <div style={{textAlign: 'center', margin: '50px 0', color: '#827f7f'}}>暂无设备模块信息</div>
    }
    </Card>
    </div>
  }
}
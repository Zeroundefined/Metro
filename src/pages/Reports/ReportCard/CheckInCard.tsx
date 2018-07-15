import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import './CheckInCard.scss';
import { Card } from 'src/components';
import { relative } from 'path';
import { Divider } from 'antd';
import {hoursList} from '../../../constant/tableConst';

interface Props {
  data: any
  timeRange: any
}
export class CheckInCard extends React.Component<Props> {
  render() {
    const {data, timeRange} = this.props;
    let fromMonth = new Date(timeRange).getMonth() + 1;
    const { hourDivided, duration, count, informations } = data;
    let categories = [];
    let datas =[];

    hoursList.map(hour => {
      let currentHour = hourDivided && hourDivided.find(item => item.key == hour);
      categories.push(`${hour}点`);
      datas.push(currentHour ? currentHour.value : 0)
    })

    const line = {
      chart: {
        type: 'column',
        backgroundColor : '#030B1E',
      },
      title: {
        text: '巡检信息',
        style: {
          color: '#ffffff'
        }
      },
      xAxis: {
        categories: categories,
        lables: {
          style: {
            color: '#ffffff'
          }
        }
      },
      yAxis: {
        title: {
          text: '巡检信息',
          style: {
            color: '#ffffff'
          }
        },
        lables: {
          style: {
            color: '#ffffff'
          }
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            // 开启数据标签
            enabled: true
          },
          // 关闭鼠标跟踪，对应的提示框、点击事件会失效
          enableMouseTracking: false
        }
      },
      series: [{
        name: '时间',
        data: datas
      }],
      legend: {
        itemStyle: {
          color: '#ffffff'
        }
      },
      colors: ['#63DFFB']
    }

    // const cyclic = {
    //   chart: {
    //     spacing: [40, 0, 40, 0],
    //     backgroundColor : '#030B1E',
    //   },
    //   title: {
    //     floating: true,
    //     text: '圆心显示的标题'
    //   },
    //   tooltip: {
    //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    //   },
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       cursor: 'pointer',
    //       dataLabels: {
    //         enabled: true,
    //         format: '<b>{point.name}</b>: {point.percentage:.1f} %',
    //         style: {
    //           color: 'black'
    //         }
    //       }
    //     }
    //   },
    //   series: [{
    //     type: 'pie',
    //     innerSize: '80%',
    //     name: '市场份额',
    //     data: [
    //       { name: 'Firefox', y: 45.0, url: 'http://bbs.hcharts.cn' },
    //       ['IE', 26.8],
    //       {
    //         name: 'Chrome',
    //         y: 12.8,
    //         sliced: true,
    //         selected: true,
    //         url: 'http://www.hcharts.cn'
    //       },
    //       ['Safari', 8.5],
    //       ['Opera', 6.2],
    //       ['其他', 0.7]
    //     ]
    //   }]
    // }

    return <div style={{marginBottom: 30}}>
      <Card className='equip-card' title='巡检信息'>
        <div style={{ minWidth: '220px', width: '50%' }}>
          {hourDivided && hourDivided.length ?
            <ReactHighcharts config={line} />
            :
            <div style={{ textAlign: 'center', margin: '50px 0', color: '#827f7f' }}> 暂无巡检信息</div>
          }
          {informations && informations.length ?
            <div style={{padding: '20px 40px'}}>
              {fromMonth}月移动点巡检系统共计处理
              {informations[0].polling_num}次点巡检作业，
              共计耗时{(informations[0].polling_duration).toFixed(2)}分钟，
              平均每次巡检耗时{informations[0].polling_avg_duration.toFixed(2)}分钟。
            </div> : ''
          }
        </div>
        <div style={{ minWidth: '220px', width: '50%' }}>
          {
            duration !==null ? 
            <div style={{ margin: '40px 0 0', textAlign: 'center'}}>
              <div className="frequent" style={{fontSize: '60px', color: '#3cc5d4'}}>{duration}</div>
              <div className="text" style={{fontSize: '30px'}}>平均时长</div>
              <div>今日移动巡检共 {count || 0} 起</div>
          </div>
            :
            <div style={{textAlign: 'center', margin: '50px 0', color: '#827f7f'}}>暂无平均时长信息</div>
          }
        </div> 
        
          
      </Card>
    </div>
  }
}
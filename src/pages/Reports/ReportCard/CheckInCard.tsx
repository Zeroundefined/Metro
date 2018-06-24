import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';

export class CheckInCard extends React.Component {
  render() {
    const {data} = this.props;
    const { hourDivided, frequent } = data;
    let categories = [];
    let datas =[];

    hourDivided.map(divid => {
      categories.push(divid.key);
      datas.push(divid.value)
    })

    const line = {
      chart: {
        type: 'line'
      },
      title: {
        text: '巡检信息'
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: '巡检信息'
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
      }]
    }

    const cyclic = {
      chart: {
        spacing: [40, 0, 40, 0]
      },
      title: {
        floating: true,
        text: '圆心显示的标题'
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
        innerSize: '80%',
        name: '市场份额',
        data: [
          { name: 'Firefox', y: 45.0, url: 'http://bbs.hcharts.cn' },
          ['IE', 26.8],
          {
            name: 'Chrome',
            y: 12.8,
            sliced: true,
            selected: true,
            url: 'http://www.hcharts.cn'
          },
          ['Safari', 8.5],
          ['Opera', 6.2],
          ['其他', 0.7]
        ]
      }]
    }

    return <div className='checkin-card'>
      <ReactHighcharts config={line} />
      <div>
        <div>{frequent[0].frequent}</div>
        <div>平均时长</div>
      </div>
    </div>
  }
}
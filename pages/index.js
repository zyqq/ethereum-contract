import React from 'react';
import { Grid, Button, Typography, Card, CardContent, CardActions, LinearProgress } from '@material-ui/core';

import { Link } from '../routes';
import web3 from '../libs/web3';
import withRoot from '../libs/withRoot';
import Layout from '../components/Layout';
import InfoBlock from '../components/InfoBlock';
import Logs from '../libs/logs';
import Log from '../libs/log';
import echarts from 'echarts'

class Index extends React.Component {
  static async getInitialProps({ req }) {
    const addressList = await Logs.methods.getLogs().call();
    const summaryList = await Promise.all(
      addressList.map(address =>
        Log(address)
          .methods.getLog()
          .call()
      )
    );
    console.log({ summaryList });
    let logs = addressList.map((address, i) => {
      const [temp, time, owner] = Object.values(
        summaryList[i]
      );

      return {
        address,
        temp,
        time,
        owner,
      };
    });

    console.log(logs);
    // 最新的日志排在最前
    logs = logs.reverse()
    return { logs };
  }

  constructor(props) {
    super(props)
    this.state = {
      logs: this.props.logs,
      lineChart: null
    }
  }

  componentDidMount() {
    this.setState({
      lineChart: echarts.init(document.getElementById('lineChart'))
    })
    // 绘制图表
    this.lineChart.setOption({
      title: {
          text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
      }]
    });
  }

  render() {
    const logs  = this.state.logs;

    console.log(logs)
    return (
      <Layout>
        <div id="lineChart"></div>
        <Grid container spacing={16}>
          {logs.length === 0 && <p>还没有操作日志，快去操控树莓派吧</p>}
          {logs.length > 0 && logs.map(this.renderLog)}
        </Grid>
      </Layout>
    );
  }

  renderLog(log) {
    let { address, temp, time, owner } = log
    return (
      <Grid item md={12} key={address}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              { '日志地址：' + address }
            </Typography>
            <Grid container spacing={16}>
              <InfoBlock md={12} title={`${owner}`} description="操作人账户地址" />
              <InfoBlock md={6} title={`${time}`} description="日期" />
              <InfoBlock md={6} title={`${temp}`} description="温度" />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default withRoot(Index);

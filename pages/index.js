import React from 'react';
import { Grid, Button, Typography, Card, CardContent, CardActions, LinearProgress } from '@material-ui/core';

import { Link } from '../routes';
import web3 from '../libs/web3';
import withRoot from '../libs/withRoot';
import Layout from '../components/Layout';
import InfoBlock from '../components/InfoBlock';
import Logs from '../libs/logs';
import Log from '../libs/log';

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
    const logs = addressList.map((address, i) => {
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

    return { logs };
  }

  constructor(props) {
    super(props)
    this.state = {
      logs: this.props.logs
    }
  }

  render() {
    const logs  = this.state.logs;

    console.log(logs)
    return (
      <Layout>
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
      <Grid item md={6} key={address}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              { address }
            </Typography>
            <Grid container spacing={16}>
              <InfoBlock title={`${owner}`} description="操作人地址" />
              <InfoBlock title={`${time}`} description="日期" />
              <InfoBlock title={`${temp}`} description="温度" />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default withRoot(Index);

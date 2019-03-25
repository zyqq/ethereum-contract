import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent, IconButton, CircularProgress} from '@material-ui/core';

import web3 from '../libs/web3';
import Logs from '../libs/logs';

const styles = {
  wrapper: {
    margin: '0 auto',
    width: '80%',
    maxWidth: '1200px',
    display: 'flex',
  },
  brand: {
    borderRight: '2px solid #CCCCCC',
    paddingRight: '1em',
    marginRight: '1em',
  },
  toolbar: {
    padding: 0,
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    display: 'flex',
  },
  anchor: {
    display: 'block',
    textDecoration: 'none',
    marginRight: '16px',
  },
  success: {
    backgroundColor: '#43a047'
  },
  close: {
    padding: 4,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
};

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errmsg: '',
      loading: false,
      open: false
    };

    this.toggleLedStatus = this.toggleLedStatus.bind(this);
  }

  handleClick = () => {
    this.setState({ open: true });
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  }

  async toggleLedStatus() {
    try {
      this.setState({ loading: true, errmsg: '' });

      // 获取账户
      const accounts = await web3.eth.getAccounts();
      const owner = accounts[0];

      // 点灯
      const ledResult = await Logs.methods
        .toggleLedStatus(1)
        .send({ from: owner, gas: '5000001' });
      this.setState({ errmsg: '点灯成功', open: true });
      console.log(ledResult);

      // 记录温度
      const logResult = await Logs.methods
        .createLogs(this.randomFrom(20, 25), new Date().toLocaleString())
        .send({ from: owner, gas: '5000001' });
      console.log('记录成功' + logResult);
      window.location.reload();
    } catch (err) {
      console.error(err);
      this.setState({ errmsg: err.message || err.toString });
    } finally {
      this.setState({ loading: false });
    }
  }

  //获取指定区间范围随机数，包括lowerValue和upperValue
  randomFrom(lowerValue,upperValue){
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
  }

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="static" color="default">
        <div className={classes.wrapper}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="title" color="inherit" className={classes.brand}>
              以太坊与树莓派
            </Typography>
            <p className={classes.flexContainer}>
              <a href="/" className={classes.anchor}>
                <Typography variant="title" color="inherit">
                  操作日志
                </Typography>
              </a>
            </p>
            {/* <Link route="/projects/create"> */}
              <Button 
              onClick={this.toggleLedStatus} 
              variant="raised" color="primary">
                {this.state.loading ? <CircularProgress color="secondary" size={24} /> : '点灯'}
              </Button>
            {/* </Link> */}
          </Toolbar>
          <Snackbar
            // className={classes.success}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
        >
       <SnackbarContent
          className={classes.success}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              {this.state.errmsg}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="secondary"
              className={classes.close}
              onClick={this.handleClose}
            >
            X
            </IconButton>,
          ]}
        />
        </Snackbar>
        </div>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);

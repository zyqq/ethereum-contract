import web3 from './web3';
import Logs from '../compiled/Logs.json';
import address from '../logsAddress.json';

const contract = new web3.eth.Contract(JSON.parse(Logs.interface), address);

export default contract;

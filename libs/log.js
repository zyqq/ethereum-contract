import web3 from './web3';
import Log from '../compiled/Log.json';

const getContract = address => new web3.eth.Contract(JSON.parse(Log.interface), address);

export default getContract;

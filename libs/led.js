import web3 from './web3';
import Led from '../compiled/Led.json';
import address from '../ledAddress.json';

const contract = new web3.eth.Contract(JSON.parse(Led.interface), address);

export default contract;

/**
 * @desc: { 树莓派的日志合约 } 
 * @author: zhengyiqiu 
 * @Create Date: 2019-03-23 19:24:58 
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-03-23 20:42:45
 */
pragma solidity ^0.4.17;

// 树莓派全部操作日志
contract Logs {
    // 存储日志地址列表
    address[] public logs;

    function createLogs(uint _temp, string _time) public {
        address newLog = new Log(_temp, _time, msg.sender);
        logs.push(newLog);
    }

    function getLogs() public view returns(address[]) {
        return logs;
    }
}

// 树莓派单个操作日志
contract Log {
    uint public temp;
    string public time;
    address public owner;

    // 存储树莓派点灯的日志内容

    // led灯状态，1 是开启，0是关闭, 事件监听时判断此值
    uint public ledStatus = 0;
    event ReturnLedStatus(address indexed _from, uint _ledStatus);

    constructor(uint _temp, string _time, address _owner) public {
        temp = _temp;
        time = _time;
        owner = _owner;
    }

    function toggleLedStatus (uint _ledStatus) public {
        ledStatus = _ledStatus;
        emit ReturnLedStatus(msg.sender, ledStatus);
    }

    function updateTemp (uint _temp, string _time) public {
        temp = _temp;
        time = _time;
    }

    function getLog() public view returns (uint, string, address) {
        return (
            temp,
            time,
            owner
        );
    }
}

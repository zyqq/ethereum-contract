pragma solidity ^0.4.17;

contract Led {
    // led灯状态，1 是开启，0是关闭
    uint public ledStatus = 0;
    event ReturnLedStatus(address indexed _from, uint _ledStatus);

    function toggleLedStatus (uint _ledStatus) public returns(uint) {
        ledStatus = _ledStatus;
        emit ReturnLedStatus(msg.sender, ledStatus);
        return ledStatus;
    }
    
    /*执行不会写入数据，所以允许`call`的方式执行。*/
    function getLedStatus() public constant returns (uint) {
        return ledStatus;
    }
}

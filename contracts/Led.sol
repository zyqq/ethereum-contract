pragma solidity ^0.4.17;

contract Led {
    string public ledStatus;

    constructor () public {
        ledStatus = '0';
    }

    function toogleLedStatus (string _ledStatus) public {
        ledStatus = _ledStatus;
    }
}

pragma solidity ^0.4.17;

contract Led {
    string public ledStatus = "0";

    function toggleLedStatus (string memory _ledStatus) public {
        ledStatus = _ledStatus;
    }
}

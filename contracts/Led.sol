pragma solidity ^0.4.17;

contract Led {
    bool public isLight;

    constructor() public {
        isLight = false;
    }

    function toogleLedStatus(bool _isLight) public {
        isLight = _isLight;
    }
}

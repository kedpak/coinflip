pragma solidity 0.5.12;

contract Ownable {

   address public owner;

    // Sets the sender address as the `owner`.
    constructor() public{
        owner = msg.sender;
    }
    
    // Throws an exception if called by any account other than the `owner`.
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

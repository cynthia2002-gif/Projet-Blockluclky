//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract LivreDOR {
    uint256 nbMessages;

    struct Messages {
        uint256 date;
        string[] messages;
       // mapping (string => mapping  ( uint256 => mapping  ( bytes32 => string ))) Test;
    }

    mapping (address => Messages) messagesParAuteur;


    constructor() {
        nbMessages=0;
    }

    function setMessage ( string calldata _message) external {
        address _addrAuteur = msg.sender;
        messagesParAuteur[_addrAuteur].date = block.timestamp ;
        messagesParAuteur[_addrAuteur].messages.push (_message);
        ++ nbMessages;
    }

    function getMessage ( address _addrAuteur ) external view returns (string[] memory _messages){
        _messages = messagesParAuteur[_addrAuteur].messages;
    }
}
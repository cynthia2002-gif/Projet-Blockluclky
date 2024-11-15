//SPDX-License-Identifier : UNLICENSED

pragma solidity 0.8.0;

contract Test {
    uint256 nbMots;

    string mot; 

    address[] addrs;
    string[] mots;

    constructor(){
        nbMots=0;
    }

/* 
    Cette fonction inscrit l'adresse eth et le mot '_nom'
*/
    function setInfos(string calldata _mot) public {
        
        address auteur = msg.sender; // l'adresse eth est contenue dans la variables msg.sender 
        addrs.push(auteur); // On pousse l'adresse eth de l'auteur dans addrs 

        mots.push(_mot); // On pousse le message dans le livre d'or 

        nbMots ++;
    }
    function getInfos() public view  returns  (address[] memory _addrs, string[] memory _mots) {
    
        _addrs = addrs;
        _mots=mots;
    }

}
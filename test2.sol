//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract test2{
    uint256 nbMots;

    mapping( uint256 => string) motByNb;
    mapping( string => uint256) nbByMot;

    constructor(){
        nbMots=0;

    }

    function setMot ( string calldata _mot) external {

        motByNb[nbMots] = _mot;
        nbByMot[_mot] = nbMots;

        ++ nbMots;

    }

    function getMot (uint256 _nb) external view returns ( string memory _mot) {
        _mot = motByNb[_nb];
    }

    function getNb ( string calldata _mot ) external view returns ( uint256 _nb) {
        _nb = nbByMot[_mot];
    }

    function getNb () external view returns (uint256 _nbMots) {
        _nbMots = nbMots;
    }
}
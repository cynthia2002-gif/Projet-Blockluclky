// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract BlockLuckyLoterie {
    address  manager;
    address[] private participants;
    address public gagnant;
    uint public ticketPrice;
    uint private minParticipants;
    uint public deadline;
    mapping(address => bool) public whitelist;

    event TicketAchat(address indexed participant, uint montant);
    event GagnantChoisi(address indexed gagnant, uint montant);

    modifier onlyManager() {
        require(msg.sender == manager, "Seul le manager peut executer cette fonction");
        _;
    }

    modifier lotteryActive() {
        require(block.timestamp <= deadline, "La loterie est terminee");
        _;
    }

    constructor(uint _minParticipants, uint _durationInMinutes) {
        manager = msg.sender;
        ticketPrice = 2* 1 finney ;
        minParticipants = _minParticipants;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    // Fonction pour acheter un ticket avec vérification d'âge et de résidence
    function acheterTicket(uint age, string memory adresse) public payable lotteryActive {
        require(age >= 18, "Vous devez avoir au moins 18 ans pour participer");
        require(keccak256(abi.encodePacked(adresse)) == keccak256(abi.encodePacked("etherbay")), "Vous devez habiter a EtherBay pour participer");
        require(msg.value == ticketPrice, "Le montant du ticket est incorrect");

        participants.push(msg.sender);
        emit TicketAchat(msg.sender, msg.value);

    // Vérifie si le tirage au sort peut être déclenché
    if (participants.length >= minParticipants && block.timestamp >= deadline) {
        tirageAuSort();
    }

        participants.push(msg.sender);
        emit TicketAchat(msg.sender, msg.value);

        // Vérifie si le tirage au sort peut être déclenché
        if (participants.length >= minParticipants && block.timestamp >= deadline) {
            tirageAuSort();
        }
    }

    // Fonction pour tirer un gagnant
    function tirageAuSort() internal {
        require(participants.length >= minParticipants, "Nombre minimum de participants non atteint");
        require(block.timestamp >= deadline, "Le delai n'est pas encore ecoule");
        
        uint indexGagnant = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, participants))) % participants.length;
        gagnant = participants[indexGagnant];

        emit GagnantChoisi(gagnant, address(this).balance);
        payable(gagnant).transfer(address(this).balance);

        delete participants;
    }

    // Fonction pour consulter la cagnotte
    function getCagnotte() external  view returns (uint) {
        return address(this).balance;
    }

    // Fonction pour obtenir le nombre de participants
    function getParticipants() external  view returns (uint) {
        return participants.length;
    }

    // Fonction pour vérifier si la loterie est terminée
    function isLoterieTerminee() external  view returns (bool) {
        return block.timestamp > deadline && participants.length >= minParticipants;
    }
    
}

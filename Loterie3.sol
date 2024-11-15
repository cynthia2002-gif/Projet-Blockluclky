// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

contract BlockLuckyLoterie {
    address manager;
    address[] private participants;
    address private charityAddress;
    uint private gagnantPercentage = 90;
    uint private charityPercentage = 10;
    address public gagnant;
    uint private ticketPrice;
    uint public prixticket;
    uint private minParticipants;
    uint public deadline;

    event TicketAchat(address indexed participant, uint montant);
    event GagnantChoisi(address indexed gagnant, uint montantGagnant, uint montantCharite);
    event TirageEffectue(address gagnant, uint indexGagnant);

    modifier onlyManager() {
        require(msg.sender == manager, "Seul le manager peut executer cette fonction");
        _;
    }

    modifier lotteryActive() {
        require(block.timestamp <= deadline, "La loterie est terminee");
        _;
    }

    constructor(uint _minParticipants, uint _durationInDays, address _charityAddress) {
        manager = msg.sender;
        ticketPrice = 2 * 10**15; // 2 finney
        prixticket = ticketPrice / 10**15;
        minParticipants = _minParticipants;
        deadline = block.timestamp + (_durationInDays * 1 days);
        charityAddress = _charityAddress;
    }

    function acheterTicket(uint age, string memory adresse) public payable lotteryActive {
        require(age >= 18, "Vous devez avoir au moins 18 ans pour participer");
        require(keccak256(abi.encodePacked(adresse)) == keccak256(abi.encodePacked("etherbay")), "Vous devez habiter a EtherBay pour participer");
        require(msg.value == ticketPrice, "Le montant du ticket doit etre exactement de 2 finney");

        participants.push(msg.sender);
        emit TicketAchat(msg.sender, msg.value);

        // Si les conditions sont remplies, tirage automatique
        if (participants.length >= minParticipants && block.timestamp >= deadline) {
            tirageAuSort();
        }
    }

    // Fonction pour tirer un gagnant et distribuer les fonds
    function tirageAuSort() internal {
        require(participants.length >= minParticipants, "Nombre minimum de participants non atteint");
        require(block.timestamp >= deadline, "Le delai n'est pas encore ecoule");

        uint indexGagnant = random() % participants.length;
        gagnant = participants[indexGagnant]; // Stocker l'adresse du gagnant

        uint balanceTotal = address(this).balance;
        uint montantGagnant = (balanceTotal * gagnantPercentage) / 100;
        uint montantCharite = (balanceTotal * charityPercentage) / 100;

        emit GagnantChoisi(gagnant, montantGagnant, montantCharite);
        emit TirageEffectue(gagnant, indexGagnant); // Émettre un événement pour confirmer l'appel

        // Transfère les fonds
        payable(gagnant).transfer(montantGagnant);
        payable(charityAddress).transfer(montantCharite);

        delete participants; // Réinitialiser les participants pour le prochain tirage
    }

    // Fonction pour générer un nombre pseudo-aléatoire
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, participants)));
    }

    // Fonction publique pour permettre au manager de tirer le gagnant manuellement
    function tirerGagnant() external onlyManager {
        tirageAuSort();
    }

    function getCagnotte() external view returns (uint) {
        return address(this).balance;
    }

    function getParticipants() external view returns (uint) {
        return participants.length;
    }

    function isLoterieTerminee() external view returns (bool) {
        return block.timestamp > deadline && participants.length >= minParticipants;
    }

    function terminerLoterie() external onlyManager {
        require(block.timestamp < deadline, "La loterie est deja terminee");
        deadline = block.timestamp;
    }
}

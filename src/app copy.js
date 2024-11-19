const ethToEurRate = 3000; // Exemple : 1 ETH = 3000 €

// Adresse et ABI de votre smart contract
const contractAddress = "0x77833Ab54272768159F1EAd8a831599c9a635e14"; // Remplacez par l'adresse déployée
const contractABI = [
    {
      "inputs": [],
      "name": "acheterTicket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_ticketPrice",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "participant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "montant",
          "type": "uint256"
        }
      ],
      "name": "TicketAchat",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getCagnotte",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getParticipants",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "manager",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "participants",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ticketPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  

let web3;
let contract;

if (typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
  console.log("Web3 détecté !");
} else {
  alert("Installez MetaMask pour utiliser cette application !");
}

// Initialiser le contrat
async function initContract() {
  try {
    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Afficher le prix du ticket
    const ticketPrice = await contract.methods.ticketPrice().call();
    document.getElementById("ticketPrice").textContent = web3.utils.fromWei(ticketPrice.toString(), "ether");

    // Charger le nombre de participants
    afficherParticipants();
  } catch (error) {
    console.error("Erreur d'initialisation :", error);
  }
}

// Acheter un ticket
async function acheterTicket() {
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const ticketPrice = await contract.methods.ticketPrice().call();

    await contract.methods.acheterTicket().send({
      from: account,
      value: ticketPrice
    });

    alert("Ticket acheté avec succès !");
    afficherParticipants();
  } catch (error) {
    console.error("Erreur lors de l'achat du ticket :", error);
  }
}

// Afficher le nombre de participants
async function afficherParticipants() {
  try {
    const participantCount = await contract.methods.getParticipants().call();
    document.getElementById("participants").textContent = `Nombre total de participants : ${participantCount}`;
  } catch (error) {
    console.error("Erreur lors de l'affichage des participants :", error);
  }
}

// Initialisation
initContract();

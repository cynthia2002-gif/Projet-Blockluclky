const ethToEurRate = 3000; // Exemple : 1 ETH = 3000 €

// Adresse et ABI de votre smart contract
const contractAddress = "0xDaE2724A4aE9832A2D8760116edEfdF722aec8dE"; // Remplacez par l'adresse déployée
const contractABI = [
    {
        "inputs": [],
        "name": "acheterTicket",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "terminerLoterie",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_ticketPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_frequenceTirageEnJours",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_charityAddress",
                "type": "address"
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
                "name": "gagnant",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "montantGagnant",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "montantCharite",
                "type": "uint256"
            }
        ],
        "name": "GagnantChoisi",
        "type": "event"
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
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "gagnant",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "indexGagnant",
                "type": "uint256"
            }
        ],
        "name": "TirageEffectue",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "tirerGagnant",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deadline",
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
        "name": "frequenceTirage",
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
        "name": "gagnant",
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
        "name": "getDeadline",
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
  
      // Obtenez le prix du ticket en wei
      const ticketPriceWei = await contract.methods.ticketPrice().call();
      const ticketPriceEth = web3.utils.fromWei(ticketPriceWei.toString(), "ether");
  
      // Convertir en euros
      const ticketPriceEur = (ticketPriceEth * ethToEurRate).toFixed(2); // 2 décimales
  
      // Afficher le prix en euros
      document.getElementById("ticketPrice").textContent = `${ticketPriceEur} €`;
    } catch (error) {
      console.error("Erreur lors de l'initialisation :", error);
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

async function afficherDeadline() {
    try {
      // Récupérer la deadline depuis le contrat
      const deadlineTimestamp = await contract.methods.getDeadline().call();
      const currentTimestamp = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
  
      // Convertir BigInt en Number pour les calculs
      const deadline = Number(deadlineTimestamp);
  
      // Calculer le temps restant
      let timeRemaining = deadline - currentTimestamp;
  
      if (timeRemaining <= 0) {
        document.getElementById("deadline").textContent = "La loterie est terminée.";
        return;
      }
  
      // Convertir le temps restant en jours, heures, minutes
      const days = Math.floor(timeRemaining / (3600 * 24)); // Jours
      timeRemaining %= 3600 * 24;
      const hours = Math.floor(timeRemaining / 3600); // Heures
      timeRemaining %= 3600;
      const minutes = Math.floor(timeRemaining / 60); // Minutes
  
      // Afficher le temps restant
      document.getElementById("deadline").textContent = `${days}j ${hours}h ${minutes}m`;
    } catch (error) {
      console.error("Erreur lors de l'affichage du temps restant :", error);
    }
}

// Afficher la cagnotte actuelle
async function afficherCagnotte() {
    try {
      const cagnotteWei = await contract.methods.getCagnotte().call(); // Obtenez la cagnotte en wei
      const cagnotteEth = web3.utils.fromWei(cagnotteWei.toString(), "ether"); // Convertir en ETH
  
      // Convertir en euros
      const cagnotteEur = (cagnotteEth * ethToEurRate).toFixed(2);
  
      // Afficher la cagnotte en ETH et en euros
      document.getElementById("cagnotte").textContent = `${cagnotteEth} ETH (${cagnotteEur} €)`;
    } catch (error) {
      console.error("Erreur lors de l'affichage de la cagnotte :", error);
    }
  }
  
  
// Initialisation
initContract();
afficherDeadline(); // Appel fct
afficherCagnotte(); // Appel fct
// Mettre à jour le temps restant toutes les secondes
setInterval(afficherDeadline, 1000);
setInterval(afficherCagnotte, 1000);

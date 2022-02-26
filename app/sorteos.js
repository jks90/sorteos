// var contractInstance;
const initialize = () => {
    const Web3 = require('web3')
    const rpcURL = 'HTTP://127.0.0.1:7545' // Guvant Chain
        //const rpcURL = 'https://rpc-mumbai.maticvigil.com' //  Munbai Tesnet

    const web3 = new Web3(rpcURL)
    const abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "win", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "number", "type": "uint256" }], "name": "__ganador", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "addPlayer", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_nameGame", "type": "string" }, { "internalType": "uint256", "name": "_maxPlayers", "type": "uint256" }], "name": "addSorteo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "getSorteo", "outputs": [{ "internalType": "string", "name": "_nameGame", "type": "string" }, { "internalType": "uint256", "name": "_maxPlayers", "type": "uint256" }, { "internalType": "uint256", "name": "_players", "type": "uint256" }, { "internalType": "uint256", "name": "_premio", "type": "uint256" }, { "internalType": "bool", "name": "_active", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "sortear", "outputs": [], "stateMutability": "payable", "type": "function" }]


    //Munbai testnet
    //0x1eE9846CB9efE6fc90553e3d6908bE62e5bA3023

    // Guvant Chain
    //0x894eeEc2E62EF889bcb707b9d93e506EeF330F80
    const addressContract = '0x894eeEc2E62EF889bcb707b9d93e506EeF330F80' // addressContract desplegado en GuvantChain

    const contractInstance = new web3.eth.Contract(abi, addressContract)
};



// fromAddress -> 0x15d5c5FB2c3E2f28b15cc0AF458dd81Dd02E2A37
function viewSorteos(numSorteo, fromAddress) {
    const abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "win", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "number", "type": "uint256" }], "name": "__ganador", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "addPlayer", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_nameGame", "type": "string" }, { "internalType": "uint256", "name": "_maxPlayers", "type": "uint256" }], "name": "addSorteo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "getSorteo", "outputs": [{ "internalType": "string", "name": "_nameGame", "type": "string" }, { "internalType": "uint256", "name": "_maxPlayers", "type": "uint256" }, { "internalType": "uint256", "name": "_players", "type": "uint256" }, { "internalType": "uint256", "name": "_premio", "type": "uint256" }, { "internalType": "bool", "name": "_active", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "sortear", "outputs": [], "stateMutability": "payable", "type": "function" }]


    //Munbai testnet
    //0x1eE9846CB9efE6fc90553e3d6908bE62e5bA3023

    // Guvant Chain
    //0x894eeEc2E62EF889bcb707b9d93e506EeF330F80
    const addressContract = '0x894eeEc2E62EF889bcb707b9d93e506EeF330F80' // addressContract desplegado en GuvantChain

    const contractInstance = new web3.eth.Contract(abi, addressContract)
    contractInstance.methods.getSorteo(numSorteo).call({ from: fromAddress }, (err, result) => { console.log(result) })
}

//4, "sorteo", 10
//address -> 0x1afC40Ed16E4a1114f99893F0697e2C2F48676FB
//privateKeyAddress -> 89bb97762e2e3ebdcd47a85a9d83f02210284c056cf5797a14c75afa2a681893
function addSorteos(idSorteo, description, maxPlayers, address, privateKeyAddress) {

    const Tx = require('ethereumjs-tx').Transaction
    const privateKey = Buffer.from(privateKeyAddress, 'hex')

    web3.eth.getTransactionCount(address, (err, txNum) => {
        contractInstance.methods.addSorteo(idSorteo, description, maxPlayers).estimateGas({ from: address }, (err, gasAmount) => {
                let rawTx = {
                    nonce: web3.utils.toHex(txNum),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')),
                    gasLimit: web3.utils.toHex(6721975),
                    to: addressContract,
                    value: web3.utils.toHex(web3.utils.toWei('1', 'ether')),
                    data: contractInstance.methods.addSorteo(idSorteo, description, maxPlayers).encodeABI()
                }

                const tx = new Tx(rawTx)
                tx.sign(privateKey)
                const serializedTx = tx.serialize().toString('hex')
                web3.eth.sendSignedTransaction('0x' + serializedTx)
            }

        )
    })
}

//address -> 0x1afC40Ed16E4a1114f99893F0697e2C2F48676FB
//privateKeyAddress -> 89bb97762e2e3ebdcd47a85a9d83f02210284c056cf5797a14c75afa2a681893
function addPlayer(idSorteo, address, privateKeyAddress) {

    const Tx = require('ethereumjs-tx').Transaction

    const privateKey = Buffer.from(privateKeyAddress, 'hex')

    web3.eth.getTransactionCount(address, (err, txNum) => {
        contractInstance.methods.addPlayer(idSorteo).estimateGas({ from: address }, (err, gasAmount) => {
            let rawTx = {
                nonce: web3.utils.toHex(txNum),
                gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')),
                gasLimit: web3.utils.toHex(6721975), //6721975 '0x2710',
                to: addressContract,
                value: web3.utils.toHex(web3.utils.toWei('1', 'ether')), //1000000000000000, //'0x00',
                data: contractInstance.methods.addPlayer(idSorteo).encodeABI()
            }

            const tx = new Tx(rawTx)
            tx.sign(privateKey)
            const serializedTx = tx.serialize().toString('hex')
            web3.eth.sendSignedTransaction('0x' + serializedTx)
        })
    })
}

//
function sortear() {

}




//addSorteos(4, "sorteo", 10,'0x1afC40Ed16E4a1114f99893F0697e2C2F48676FB',89bb97762e2e3ebdcd47a85a9d83f02210284c056cf5797a14c75afa2a681893'');
//addPlayer(1,'0x1afC40Ed16E4a1114f99893F0697e2C2F48676FB','89bb97762e2e3ebdcd47a85a9d83f02210284c056cf5797a14c75afa2a681893')
//viewSorteos(1, '0xaFA028554C01264BDA466Ce865A041a7899F5108');
//window.addEventListener('DOMContentLoaded', initialize);
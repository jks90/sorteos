// const Web3 = require('web3')
// const rpcURL = 'HTTP://127.0.0.1:7545' // Your RPC URL goes here
// const web3 = new Web3(rpcURL)
// const address = '0xEC593e922FFBb39feeab70Be46C0E532b857CD4E' // Your account address goes here


// web3.eth.getBalance(address, (err, wei) => {
//     balance = web3.utils.fromWei(wei, 'ether')
//     console.log(balance)
// })


// const Web3 = require('web3')
// const rpcURL = 'HTTP://127.0.0.1:7545' // Your RCP URL goes here
// const web3 = new Web3(rpcURL)

// const abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "win", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "number", "type": "uint256" }], "name": "__ganador", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "addPlayer", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_nameGame", "type": "string" }, { "internalType": "uint256", "name": "_maxPlayers", "type": "uint256" }], "name": "addSorteo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "getSorteo", "outputs": [{ "internalType": "string", "name": "_nameGame", "type": "string" }, { "internalType": "uint256", "name": "_maxPlayers", "type": "uint256" }, { "internalType": "uint256", "name": "_players", "type": "uint256" }, { "internalType": "uint256", "name": "_premio", "type": "uint256" }, { "internalType": "bool", "name": "_active", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "sortear", "outputs": [], "stateMutability": "payable", "type": "function" }]
// const address = '0x894eeEc2E62EF889bcb707b9d93e506EeF330F80'

// const contract = new web3.eth.Contract(abi, address)
// contract.methods.getSorteo(1).call({ from: '0x15d5c5FB2c3E2f28b15cc0AF458dd81Dd02E2A37' }, (err, result) => { console.log(result) })
// contract.methods.totalSupply().call((err, result) => { console.log(result) })
// contract.methods.name().call((err, result) => { console.log(result) })
// contract.methods.symbol().call((err, result) => { console.log(result) })
// contract.methods.balanceOf('0xEC593e922FFBb39feeab70Be46C0E532b857CD4E').call((err, result) => { console.log(result) })

SNIPETS

function remove(uint256[] memory array, uint256 index) internal pure returns(uint256[] memory value) {
        uint256[] memory arrayNew;
        for (uint256 i = 0; i<array.length; i++){
            if(array[i] != index){
                arrayNew[i] = array[i];
            }
        }
        delete array;
        return arrayNew;
    }



GuvantChain
0x63594cA10098EfF75e9c8D0C8A86864147208ef3 owner -> 0x2443ca6821e28574bB9AF9e194e63cFa4fB9c72D

//Munbai testnet
//0x1eE9846CB9efE6fc90553e3d6908bE62e5bA3023 owner -> 0xaFA028554C01264BDA466Ce865A041a7899F5108
let currentAccount = null;
let web3;
let abi;
let contractInstance;

//Munbai testnet
//0x3f868fC6F89b9c9cBcEb929D06C89E5E0Eacd82D

let contactAddress = '0x3f868fC6F89b9c9cBcEb929D06C89E5E0Eacd82D'

function handleAccountsChanged(accounts) {
    // console.log('Calling HandleChanged')

    if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
        $('#enableMetamask').html('Connect with Metamask')
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        $('#enableMetamask').html(currentAccount)
        $('#status').html('')

        if (currentAccount != null) {
            // Set the button label
            $('#enableMetamask').html(currentAccount)
        }
    }
    // console.log('WalletAddress in HandleAccountChanged =' + currentAccount)
}

function connect() {
    // console.log('Calling connect()')
    ethereum
        .request({
            method: 'eth_requestAccounts'
        })
        .then(handleAccountsChanged)
        .catch((err) => {
            if (err.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                console.log('Please connect to MetaMask.');
                $('#status').html('You refused to connect Metamask')
            } else {
                console.error(err);
            }
        });
}

function detectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        return true
    } else {
        return false
    }
}

async function viewSorteos() {
    const contractInstance = new web3.eth.Contract(abi, contactAddress);
    contractInstance.methods.getIdsSorteos().call({ from: currentAccount }, (err, result) => {
        var arrayDeCadenas = result.split(',');
        for (var i = 0; i < arrayDeCadenas.length; i++) {
            if (arrayDeCadenas[i] != '') {
                viewSorteo(arrayDeCadenas[i], true);
            }
        }
    })
}

async function viewSorteo(numSorteo, print) {
    const contractInstance = new web3.eth.Contract(abi, contactAddress)
    contractInstance.methods.getSorteo(numSorteo).call({ from: currentAccount }, (err, result) => {
        console.log(result);
        if (print) {
            if (result._active) {
                printSorteorInTable(numSorteo, result._nameGame, result._maxPlayers, result._players, result._premio, result._active, result._ownerSorteo);
            }
        }
    })
}

async function addSorteos(idSorteo, description, maxPlayers) {

    const contractInstance = new web3.eth.Contract(abi, contactAddress)

    const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')), // customizable by user during MetaMask confirmation.
        gas: web3.utils.toHex(6721975), // customizable by user during MetaMask confirmation.
        to: contactAddress, // Required except during contract publications.
        from: ethereum.selectedAddress, // must match user's active address.
        value: web3.utils.toHex(web3.utils.toWei('1', 'ether')), // Only required to send ether to the recipient from the initiating external account.
        data: contractInstance.methods.addSorteo(idSorteo, description, maxPlayers).encodeABI(), // Optional, but used for defining smart contract creation and interaction.
        chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };

    const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        }).then((txHash) => {
            console.log(txHash);
            viewSorteo(idSorteo, true);
        })
        .catch((error) => console.error);

}

async function addPlayer(idSorteo) {

    const contractInstance = new web3.eth.Contract(abi, contactAddress)

    const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')), // customizable by user during MetaMask confirmation.
        gas: web3.utils.toHex(6721975), // customizable by user during MetaMask confirmation.
        to: contactAddress, // Required except during contract publications.
        from: ethereum.selectedAddress, // must match user's active address.
        value: web3.utils.toHex(web3.utils.toWei('1', 'ether')), // Only required to send ether to the recipient from the initiating external account.
        data: contractInstance.methods.addPlayer(idSorteo).encodeABI(), // Optional, but used for defining smart contract creation and interaction.
        chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };

    const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        }).then((txHash) => {
            console.log(txHash);
            //viewSorteos(idSorteo, true);
        })
        .catch((error) => console.error);
}

async function sortear(idSorteo) {

    const contractInstance = new web3.eth.Contract(abi, contactAddress)

    const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')), // customizable by user during MetaMask confirmation.
        gas: web3.utils.toHex(6721975), // customizable by user during MetaMask confirmation.
        to: contactAddress, // Required except during contract publications.
        from: ethereum.selectedAddress, // must match user's active address.
        value: web3.utils.toHex(web3.utils.toWei('1', 'ether')), // Only required to send ether to the recipient from the initiating external account.
        data: contractInstance.methods.sortear(idSorteo).encodeABI(), // Optional, but used for defining smart contract creation and interaction.
        chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };

    const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        }).then((txHash) => {
            // console.log(txHash);
        })
        .catch((error) => console.error);
}

$.getJSON("../build/contracts/Sorteos.json", function(result) {
    abi = result.abi
        // console.log("abi");
});

$(document).ready(function() {
    m = detectMetaMask()
    if (m) {
        $('#metaicon').removeClass('meta-gray')
        $('#metaicon').addClass('meta-normal')
        $('#enableMetamask').attr('disabled', false)
        connect() // Make sure the connected wallet is being returned
    } else {
        $('#enableMetamask').attr('disabled', true)
        $('#metaicon').removeClass('meta-normal')
        $('#metaicon').addClass('meta-gray')
    }

    $('#enableMetamask').click(function() {
        connect()
    });

    $('#setValue').click(function() {
        // setValue()
    });

    getValueFromCrearSorteo();
    try {
        web3 = new Web3(new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com"));
        viewSorteos();
    } catch (error) {
        alert(error)
    }

    setInterval(() => {
        listenEventLastBlock();
    }, 5000);

})

async function listenEventLastBlock() {
    web3.eth.getBlockNumber().then(n => listenEvent(n));
}

async function listenEvent(lastBlock) {
    const contractInstance = new web3.eth.Contract(abi, contactAddress)
    contractInstance.getPastEvents('__addSorteo', {
            fromBlock: lastBlock,
            toBlock: 'latest'
        })
        .then(function(events) {
            updateData(events)
        })
        .catch(function(e) { throw new Error(e) })

    contractInstance.getPastEvents('__addPlayer', {
            fromBlock: lastBlock,
            toBlock: 'latest'
        })
        .then(function(events) {
            updateData(events)
        })
        .catch(function(e) { throw new Error(e) })

    contractInstance.getPastEvents('__ganador', {
            fromBlock: lastBlock,
            toBlock: 'latest'
        })
        .then(function(events) {
            updateData(events)
        })
        .catch(function(e) { throw new Error(e) })
}

function updateData(event) {
    console.log(event);
}

function getValueFromCrearSorteo() {
    const form = document.getElementById('formCrearSorteo');
    form.addEventListener('submit', (event) => {
        const titulo = form.elements['title-name'];
        const maxplayers = form.elements['max-player'];
        console.log(titulo.value);
        console.log(maxplayers.value);

        var id = getRandomInt(0, 999999);
        console.log(id);

        addSorteos(id, titulo.value, maxplayers.value, currentAccount, '');
        event.preventDefault();
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function printSorteorInTable(id, title, maxPlayer, numPlayer, Premio, Active, owner) {
    var tbodyRef = document.getElementById('sorteos').getElementsByTagName('tbody')[0];

    // Insert a row at the end of table
    var row = tbodyRef.insertRow();

    // Insert a cell at the end of the row
    var cellId = row.insertCell();
    var cellTitle = row.insertCell();
    var cellmaxPlayer = row.insertCell();
    var cellnumPlayer = row.insertCell();
    var cellPremio = row.insertCell();
    var cellActive = row.insertCell();


    // Append a text node to the cell
    var textId = document.createTextNode(id);
    var textTitle = document.createTextNode(title);
    var textmaxPlayer = document.createTextNode(maxPlayer);
    var textnumPlayer = document.createTextNode(numPlayer);
    var textPremio = document.createTextNode(Premio);
    var textActive = document.createTextNode(Active);

    cellId.appendChild(textId);
    cellTitle.appendChild(textTitle);
    cellmaxPlayer.appendChild(textmaxPlayer);
    cellnumPlayer.appendChild(textnumPlayer);
    cellPremio.appendChild(textPremio);
    cellActive.appendChild(textActive);

    if (Active) {
        var cellButtonAdd = row.insertCell();
        var inputAdd = document.createElement("input");
        inputAdd.setAttribute('type', 'button');
        inputAdd.setAttribute('value', 'add');
        inputAdd.setAttribute('name', id);
        inputAdd.setAttribute('onclick', 'addPlayer(' + id + ')');
        inputAdd.setAttribute('class', 'btn btn-info btn-lg');
        inputAdd.setAttribute('id', 'buttonAddPlayer');
        cellButtonAdd.appendChild(inputAdd);

        // console.log("o: " + owner);
        // console.log("c: " + currentAccount);

        if (compareAddress(owner, currentAccount) && numPlayer > 0) {
            var cellButtonSortear = row.insertCell();
            var inputSortear = document.createElement("input");
            inputSortear.setAttribute('type', 'button');
            inputSortear.setAttribute('value', 'sortear');
            inputSortear.setAttribute('onclick', 'sortear(' + id + ')');
            inputSortear.setAttribute('class', 'btn btn-info btn-lg');

            cellButtonSortear.appendChild(inputSortear);
        }
        // var cellOwner = row.insertCell();
        // var textOwner = document.createTextNode(owner);
        // cellOwner.appendChild(textOwner);
        // cellButtonSortear.appendChild(cellOwner);
    }

    function compareAddress(owner, currentAccount) {
        // console.log("o: " + owner);
        // console.log("c: " + currentAccount);
        var state = false;
        var t = "";
        for (var i = 0; i < owner.length; i++) {
            if (owner[i] == currentAccount[i]) {
                if (owner[i] == currentAccount[i].toLowerCase()) {
                    t += owner[i];
                } else {
                    state = false;
                }
            } else {
                if (owner[i] == currentAccount[i].toUpperCase()) {
                    t += owner[i];
                    state = true;
                } else {
                    console.log(owner[i]);
                    console.log(currentAccount[i]);
                    state = false;
                }
            }
        }
        if (owner == '0x0000000000000000000000000000000000000000') {
            state = false;
        }
        // console.log(state + " state: " + t);
        return state;
    }
}
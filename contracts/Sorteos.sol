//SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.4.4 < 0.7.0;



contract Sorteos{

    //1,"TEST1",5
    address owner;
    
    mapping(uint256 => Sorteo) sorteos;

    event __addPlayer(uint256 idSorteo);
    event __addSorteo(string _nameGame, uint256 _maxPlayers, uint256 _players, uint256 _premio, bool _active,address _ownerSorteo);
    event __ganador(address win, uint number);

    uint256[]  idSorteos;

    struct Sorteo {
        address ownerSorteo;
        string nameGame;
        uint256 maxPlayers;
        uint256 premio;
        address[] players;
        bool active;
    }

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner(address _direccion){
        require(_direccion == owner,"No tienes permisos para ejecutar esta funcion");
        _;
    }

    modifier onlyOwnerSorteo(uint256 _id,address _direccion){
        require(_direccion == sorteos[_id].ownerSorteo,"No eres owner para ejecutar esta funcion");
        _;
    }

    modifier sorteoActive(uint256 _id){
        require(sorteos[_id].active == true, "Sorteo no disponible.");
        _;
    }

    modifier minPayPlayGame(uint256 _money){
        require(_money > 0.1 ether, "Saldo insuficiente.");
        _;
    }

    modifier requirePlayers(uint256 _maxPlayers){
        require(_maxPlayers > 0, "necesita minimo un player");
        _;
    }

    modifier existSorteo(uint256 _id){
        for(uint i=0; i < idSorteos.length; i++) {
            require(idSorteos[i] != _id, "id ya existe");
        }
        _;
    }

    function getIdsSorteos() public view returns(string memory){
        string memory listado = "";
        for(uint i=0; i < idSorteos.length; i++) {
            string memory obj = uintToString(idSorteos[i]);
            
            listado = concat(listado,obj);
            listado = concat(listado,",");
        }
        return listado;
    }

    function concat(string memory _x, string memory _y) pure internal returns (string memory) {
        bytes memory _xBytes = bytes(_x);
        bytes memory _yBytes = bytes(_y);
        
        string memory _tmpValue = new string(_xBytes.length + _yBytes.length);
        bytes memory _newValue = bytes(_tmpValue);
        
        uint i;
        uint j;
        
        for(i=0;i<_xBytes.length;i++) {
            _newValue[j++] = _xBytes[i];
        }
        
        for(i=0;i<_yBytes.length;i++) {
            _newValue[j++] = _yBytes[i];
        }
        
        return string(_newValue);
    }

    function uintToString(uint v) internal pure returns (string memory) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - 1 - j];
        }
        return string(s);
    }

    function addSorteo(uint256 _id, string memory _nameGame, uint256 _maxPlayers) external payable minPayPlayGame(msg.value) requirePlayers(_maxPlayers) existSorteo(_id){
        idSorteos.push(_id);
        sorteos[_id].nameGame = _nameGame;
        sorteos[_id].maxPlayers = _maxPlayers;
        sorteos[_id].premio = msg.value;
        sorteos[_id].ownerSorteo = msg.sender;
        sorteos[_id].active = true;
        emit __addSorteo(_nameGame, _maxPlayers, 0, msg.value, true, msg.sender);
    }

    function getSorteo(uint256 _id) external view returns(string memory _nameGame, uint256 _maxPlayers, uint256 _players, uint256 _premio, bool _active,address _ownerSorteo) {
        _nameGame = sorteos[_id].nameGame;
        _maxPlayers = sorteos[_id].maxPlayers;
        _players = sorteos[_id].players.length;
        _premio = sorteos[_id].premio;
        _active = sorteos[_id].active;

        if(sorteos[_id].ownerSorteo != msg.sender){
            _ownerSorteo = address(0);
        }else{
            _ownerSorteo = sorteos[_id].ownerSorteo;
        }
    }

    function addPlayer(uint256 _id) external payable sorteoActive(_id) minPayPlayGame(msg.value){
        sorteos[_id].players.push(msg.sender);
        sorteos[_id].premio += msg.value;
        emit __addPlayer(_id);
    }

    function sortear(uint256 _id) external payable onlyOwnerSorteo(_id,msg.sender){
        uint nwin = _random(_id);
        address win = sorteos[_id].players[nwin];
        sorteos[_id].active = false;
        sorteos[_id].premio = 0;
        payable(win).transfer(sorteos[_id].premio);
        emit __ganador(win,nwin);
    }

    function _random(uint256 _id) private view returns (uint){
       return uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,_id))) % sorteos[_id].players.length;
    }
}

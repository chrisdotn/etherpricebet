pragma solidity ^0.4.0;

import './Bet.sol';
import './lib/usingOraclize.sol';
import './lib/StringLib.sol';

contract OraclizeBet is Bet, usingOraclize {

    event Info(string msg);

    function OraclizeBet() {
        OAR = OraclizeAddrResolverI(0xbaedea311445c09489ba3e5cb8cee812a89099c4);
    }

    function queryOracle(string price, string startdate) {

        string memory apiCall = strConcat('json(https://api.kraken.com/0/public/OHLC).result.XETHZUSD[?(@[2]>',
            price,
            ')][0]');
        string memory postData = strConcat('{ "pair": "ETHUSD", "interval": 1440, "since":',
            startdate,
            ' }');

        /*bytes32 apiCall = StringLib.uintToBytes(price);
        bytes32 postData = StringLib.uintToBytes(123);*/

        Info(apiCall);
        Info(postData);

        //oraclize_query('URL', apiCall, postData );
    }

    // Callback to be called by once the oracle Query has been resolved
    function __callback(bytes32 myid, string result) public {
        //Info(strConcat('Query result: ', result));
    }
}

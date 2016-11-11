pragma solidity ^0.4.0;

import './Bet.sol';
import '../lib/usingOraclize.sol';

contract OraclizeBet is usingOraclize {

    event Info(string msg);

    function queryOracle(uint price) constant {
        //TODO call oracle
        Info("called OraclizeBet.queryOracle");
    }
}

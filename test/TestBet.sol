pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Bet.sol";

contract TestBet {
    function testInitalBalanceUsingDeployedContract() {
        uint expected = 0;
        uint balance = DeployedAddresses.Bet().balance;

        Assert.equal(balance, expected, "Bet should have 0 ether initially");
    }
}

pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Bet.sol";

contract TestBet {

    function testInitalBalanceUsingDeployedContract() {
        uint expected = 0;
        address betAddress = DeployedAddresses.Bet();

        Assert.equal(betAddress.balance, expected, "Bet should have 0 ether initially");
    }

    function testInitalBalanceUsingNewContract() {
        uint expected = 0;
        Bet bet = new Bet();

        Assert.equal(bet.balance, expected, "Bet should have 0 ether initially");
    }

}

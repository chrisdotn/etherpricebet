pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Bet.sol";

contract TestBet_PlaceBet {

    Bet bet;
    uint weiValue = 0;
    uint priceLevel = 12;

    function beforeAll() {
        bet = new Bet();
        bet.create.value(weiValue)(priceLevel);
    }

    function testPlaceBet() {
        bet.placeBet(1476655200000);
        Assert.equal(bet.bets(this), 1476655200000, 'Bet is not 1476655200000');
    }
}

pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Bet.sol";

contract TestBet_Create {

    Bet bet;
    //uint weiValue = 10000000000000000000;
    uint weiValue = 0;
    uint priceLevel = 12;

    function beforeAll() {
        bet = new Bet();

        bet.create.value(weiValue)(priceLevel);
        //bet.create(priceLevel);
    }

    function testCreatePricelevelUsingNewContract() {
        Assert.equal(bet.pricelevel(), priceLevel, 'Pricelevel should be 12 $ now');
    }

    function testCreatePrizeUsingNewContract() {
        Assert.equal(bet.balance, weiValue, 'Bet should have 10000000000000000000 wei now');
    }

}

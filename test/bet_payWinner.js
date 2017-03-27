contract('Bet payout()', function(accounts) {
    var StatusEnum = {
        NEW: 0,
        OPEN: 1,
        CLOSED: 2,
        WON: 3
    };

    var priceLevel = '100';
    var weiValue = web3.toWei(10, 'ether');
    var betDate1 = new Date(Date.UTC(2016, 9, 17));
    var betDate2 = new Date(Date.UTC(2016, 9, 20));
    var betEpoch1 = betDate1.getTime() / 1000;
    var betEpoch2 = betDate2.getTime() / 1000;

    var resultDate = new Date(Date.UTC(2016, 9, 19));
    var resultEpoch = resultDate.getTime() / 1000;

    before('should be created and have two bets first', function() {
        var bet = Bet.deployed();
        bet.create(priceLevel, {
            from: accounts[0],
            value: weiValue
        });

        bet.placeBet(betEpoch1, {
            from: accounts[0]
        });

        bet.placeBet(betEpoch2, {
            from: accounts[1]
        });

        bet.closeBetting({
            from: accounts[0]
        });

        bet.evaluateBet({
            from: accounts[0]
        });

        bet.__callback('testID', resultEpoch.toString(), {
            from: accounts[0]
        });
    })

    it('pay the winner 10 ether', function(done) {
        var bet = Bet.deployed();

        var balanceWinnerBefore = web3.eth.getBalance(accounts[1]);
        var balanceContractBefore = web3.eth.getBalance(bet.address);

        bet.payout({
            from: accounts[0]
        }).then(function(txHash) {
            assert.notEqual(txHash, '', 'txHash should not be empty');
        }).then(function() {
            var balanceWinnerAfter = parseInt(web3.eth.getBalance(accounts[1]));
            var balanceContractAfter = parseInt(web3.eth.getBalance(bet.address));
            //assert.equal(balanceWinnerAfter, balanceWinnerBefore + weiValue, 'Winner\'s balance is wrong');
            assert.equal(balanceContractAfter, balanceContractBefore - weiValue, 'Contract\'s balance is wrong');
            assert.equal(balanceContractAfter, 0, 'Contract\'s balance is not zero.')
        }).then(done).catch(done);
    });

    it('should be in state NEW', function(done) {
        var bet = Bet.deployed();
        bet.state().then(function(state) {
            assert.equal(parseInt(state), StatusEnum.NEW, 'Status is not \'NEW\'');
        }).then(done).catch(done);
    });

});

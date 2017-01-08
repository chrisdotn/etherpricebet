contract('Bet after closeBetting()', function(accounts) {
    var StatusEnum = {
        NEW: 0,
        OPEN: 1,
        CLOSED: 2,
        WON: 3
    };

    var priceLevel = '100';
    var weiValue = web3.toWei(10, 'ether');
    var betDate1 = 1476655200000;
    var betDate2 = 1876655200000;

    before('should be created and have two bets first', function (done) {
        var bet = Bet.deployed();
        bet.create(priceLevel, {
            from: accounts[0],
            value: weiValue
        });
        bet.placeBet(betDate1, {
            from: accounts[0]
        });

        bet.placeBet(betDate2, {
            from: accounts[1]
        }).then(function(txHash){}).then(done).catch(done);
    })

    it('should be able to be closed', function(done) {
        var bet = Bet.deployed();
        bet.closeBetting({
            from: accounts[0]
        }).then(function(txHash) {
            assert.notEqual(txHash, '', 'txHash should not be empty');
        }).then(done).catch(done);
    });

    it('should be in state CLOSED', function (done) {
        var bet = Bet.deployed();
        bet.state().then(function (state) {
            assert.equal(parseInt(state), StatusEnum.CLOSED, 'Status is not \'CLOSED\'');
        }).then(done).catch(done);
    })

});

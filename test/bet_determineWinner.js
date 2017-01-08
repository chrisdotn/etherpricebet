contract('Bet winnerDetermination()', function(accounts) {
    var StatusEnum = {
        NEW: 0,
        OPEN: 1,
        CLOSED: 2,
        WON: 3
    };

    var priceLevel = '100';
    var weiValue = web3.toWei(10, 'ether');
    var betDate1 = new Date(Date.UTC(2016,9,17));
    var betDate2 = new Date(Date.UTC(2016,9,20));
    var betEpoch1 = betDate1.getTime() / 1000;
    var betEpoch2 = betDate2.getTime() / 1000;

    before('should be created and have two bets first', function (done) {
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

        bet.closeBetting({from:accounts[0]}).then(function(txHash){}).then(done).catch(done);
    })

    it('should be able to call evaluateBet', function(done) {
        var bet = Bet.deployed();
        bet.evaluateBet({
            from: accounts[0]
        }).then(function(txHash) {
            assert.notEqual(txHash, '', 'txHash should not be empty');
        }).then(done).catch(done);
    });

    it('should not reveal a winner for an empty callback', function (done) {
        var bet = Bet.deployed();
        bet.__callback('testID', '', {from:accounts[0]}).then(function (txHash) {
            assert.notEqual(txHash, '', 'txHash should not be empty');
        }).then(function() {
            return bet.winner()
        }).then(function(winner){
            assert.equal(winner, '0x0000000000000000000000000000000000000000', 'winner should not be set');
        }).then(done).catch(done);
    });

    it('should set a winner for a callback with a date', function(done) {
        var bet = Bet.deployed();
        var resultDate = new Date(Date.UTC(2016,9,19));
        var resultEpoch = resultDate.getTime() / 1000;

        bet.__callback('testID', resultEpoch.toString(), {from:accounts[0]}).then(function (txHash) {
            assert.notEqual(txHash, '', 'txHash should not be empty');
        }).then(function() {
            return bet.winner()
        }).then(function(winner){
            assert.equal(winner, accounts[1], 'winner should be set');
        }).then(done).catch(done);
    });

    it('should be in state WON', function (done) {
        var bet = Bet.deployed();
        bet.state().then(function (state) {
            assert.equal(parseInt(state), StatusEnum.WON, 'Status is not \'WON\'');
        }).then(done).catch(done);
    });

});

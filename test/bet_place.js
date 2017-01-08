contract('Bet after placeBet()', function(accounts) {
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

    before('should be created first', function(done) {
        var bet = Bet.deployed();
        bet.create(priceLevel, {
                from: accounts[0],
                value: weiValue
            })
            .then(function(txHash) {})
            .then(done)
            .catch(done);
    })

    it('should be able to place a bet', function(done) {
        var bet = Bet.deployed();
        bet.placeBet(betEpoch1, {
                from: accounts[0]
            }).then(function(txHash) {
                assert.notEqual(txHash, '', 'txHash should not be empty');
            })
            .then(done)
            .catch(done);
    });

    it('should be able to place a second bet from another account', function(done) {
        var bet = Bet.deployed();
        bet.placeBet(betEpoch2, {
                from: accounts[1]
            })
            .then(function(txHash) {
                assert.notEqual(txHash, '', 'txHash should not be empty');
            })
            .then(done)
            .catch(done);
    });

    it('should be in state \'OPEN\'', function(done) {
        var bet = Bet.deployed();
        bet.state().then(function(state) {
            assert.equal(parseInt(state), StatusEnum.OPEN, 'Status is not \'OPEN\'');
        }).then(done).catch(done);
    });

    it('should a bet date of ' + betDate1.toISOString().slice(0, 10) + ' for ' + accounts[0], function(done) {
        var bet = Bet.deployed();
        bet.bets(accounts[0]).then(function(betDate) {
            assert.equal(parseInt(betDate), betEpoch1, 'The date from bet 1 has been corrupted');
        }).then(done).catch(done);
    });

    it('should a bet date of ' + betDate2.toISOString().slice(0, 10) + ' for ' + accounts[1], function(done) {
        var bet = Bet.deployed();
        bet.bets(accounts[1]).then(function(betDate) {
            assert.equal(parseInt(betDate), betEpoch2, 'The date from bet 2 has been corrupted');
        }).then(done).catch(done);
    });

    it('must not allow creating another bet', done => {
        var bet = Bet.deployed();
        bet.create(priceLevel, {
                from: accounts[1],
                value: weiValue
            })
            .then(() => done(null, 'Did not throw error as expected'))
            .catch(() => done())
    });

});

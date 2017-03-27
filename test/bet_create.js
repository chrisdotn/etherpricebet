contract('Bet after create()', function(accounts) {
    var StatusEnum = {
        NEW: 0,
        OPEN: 1,
        CLOSED: 2,
        WON: 3
    };

    var priceLevel = '100';
    var weiValue = web3.toWei(10, 'ether');

    it('should be able to create a new bet', function(done) {
        var bet = Bet.deployed();
        bet.create(priceLevel, {
            from: accounts[0],
            value: weiValue
        }).then(function(txHash) {
            assert.notEqual(txHash, '', 'txHash should not be empty');
        }).then(done).catch(done);
    });

    it('should be in state \'OPEN\'', function(done) {
        var bet = Bet.deployed();
        bet.state().then(function(state) {
            assert.equal(parseInt(state), StatusEnum.OPEN, 'Status is not \'OPEN\'');
        }).then(done).catch(done);
    });

    it('should have price level 100', function(done) {
        var bet = Bet.deployed();
        bet.pricelevel().then(function(betPriceLevel) {
            assert.equal(parseInt(betPriceLevel), parseInt(priceLevel), 'Pricelevel is not correct');
        }).then(done).catch(done);
    });

    it('should have a balance of 10 ether', function(done) {
        var bet = Bet.deployed();
        new Promise(function(resolve, reject) {
            web3.eth.getBalance(bet.address, function(error, balance) {
                (!error) ? resolve(balance): reject(error);
            });
        }).then(function(balance) {
            assert.equal(parseInt(balance), weiValue, 'Prize is not right');
        }).then(done).catch(done);
    });
});

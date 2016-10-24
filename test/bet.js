contract('Bet', function(accounts) {
    var StatusEnum = {
        NEW: 0,
        OPEN: 1,
        CLOSED: 2,
        ENDED: 3
    };

    it('should be in status \'NEW\'', function(done) {
        var bet = Bet.deployed();

        bet.state().then(function(value) {
            assert.equal(parseInt(value), StatusEnum.NEW, 'Status is not \'NEW\'');
        }).then(done).catch(done);
    });

    it('should have 0 balance', function(done) {
        var bet = Bet.deployed();

        new Promise(function(resolve, reject) {
            web3.eth.getBalance(bet.address, function (error, balance) {
                if (!error) {
                    resolve(balance);
                } else {
                    reject(error);
                }
            });
        }).then(function(value) {
            assert.equal(parseInt(value), 0, 'Value is ≠ 0');
        }).then(done).catch(done);
    });
});

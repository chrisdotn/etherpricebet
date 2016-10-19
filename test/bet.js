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

  it('should have 0 balance', function (done) {
      var bet = Bet.deployed();

      bet.getBalance().then(function(balance) {
          assert.equal(parseInt(balance), 0, 'Balance is ≠ 0');
      }).then(done).catch(done);
  });
});

var StatusEnum = {
    NEW: 0,
    OPEN: 1,
    CLOSED: 2,
    ENDED: 3,
    properties: {
        0: {
            name: 'new'
        },
        1: {
            name: 'open'
        },
        2: {
            name: 'closed'
        },
        3: {
            name: 'ended'
        }
    }
};

var AlertType = {
    ALERT: 0,
    SUCCESS: 1,
    WARNING: 2,
    ERROR: 3
};

function updateHtmlValue(id, value) {
    var htmlElement = document.getElementById(id);
    htmlElement.innerHTML = value;
}

function refreshDashboard() {
    var bet = Bet.deployed();

    bet.getBalance().then(function(balance) {
        updateHtmlValue('balance', web3.fromWei(balance, 'ether'));
    }).catch(function(e) {
        console.error(e);
    })

    bet.state().then(function(value) {
        updateHtmlValue('state', StatusEnum.properties[value.valueOf()].name);
    }).catch(function(e) {
        console.error(e);
    });

    bet.pricelevel().then(function(value) {
        updateHtmlValue('pricelevel', value.valueOf());
    }).catch(function(e) {
        console.error(e);
    });

};

function getAccount(index) {
    return new Promise(function(resolve) {
        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
                throw 'Error fetching accounts.';
            }

            if (accs.length == 0) {
                throw 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.';
            }

            if (index < 0 || index > accs.length - 1) {
                throw 'Index out of bounds, set an existing value for the index.';
            }

            resolve(accs[index]);
        });
    });
}

function updateButtons() {
    var bet = Bet.deployed();
    bet.state().then(function(state) {
        switch (parseInt(state)) {
            case StatusEnum.NEW:
                document.getElementById('create_new_bet').disabled = false;
                document.getElementById('place_bet').disabled = true;
                document.getElementById('close_betting').disabled = true;
                document.getElementById('pay').disabled = true;
                break;
            case StatusEnum.OPEN:
                document.getElementById('create_new_bet').disabled = true;
                document.getElementById('place_bet').disabled = false;
                document.getElementById('close_betting').disabled = false;
                document.getElementById('pay').disabled = true;
                break;
            case StatusEnum.CLOSED:
                document.getElementById('create_new_bet').disabled = true;
                document.getElementById('place_bet').disabled = true;
                document.getElementById('close_betting').disabled = true;
                document.getElementById('pay').disabled = false;
                break;
            case StatusEnum.ENDED:
                document.getElementById('create_new_bet').disabled = false;
                document.getElementById('place_bet').disabled = true;
                document.getElementById('close_betting').disabled = true;
                document.getElementById('pay').disabled = true;
                break;
            default:
                document.getElementById('create_new_bet').disabled = true;
                document.getElementById('place_bet').disabled = true;
                document.getElementById('close_betting').disabled = true;
                document.getElementById('pay').disabled = true;
        }
    });
}

function createBet() {
    var dollarValue = parseInt(document.getElementById('dollar_value').value);
    var endBettingDate = document.getElementById('end_betting_date').value;
    var prizeAmount = parseInt(document.getElementById('prize_amount').value);

    if (isNaN(dollarValue) || endBettingDate == '' || isNaN(prizeAmount)) {
        setStatus(AlertType.ERROR, 'Must specify a dollar value and/or enddate.');
        throw 'Must specify a dollar value and/or enddate.';
    }

    var dateElements = endBettingDate.split('-');
    var endDate = new Date(dateElements[0], dateElements[1], dateElements[2]);
    var prizeInWei = web3.toWei(prizeAmount, 'ether');

    getAccount(0).then(function(account) {
        var bet = Bet.deployed();

        // start watching for event
        var creationEvent = bet.Creation();

        creationEvent.watch(function(error, result) {
            if (!error) {
                console.log('Bet created.');
                setStatus(AlertType.SUCCESS, 'Tx mined: Bet created.');
                refreshDashboard();
                updateButtons();
            } else {
                console.error(error);
            }
        });
        return bet.create.sendTransaction(dollarValue, endDate.getTime(), {
            value: prizeInWei,
            from: account
        });
    }).catch(function(e) {
        setStatus(AlertType.ERROR, 'An error occured in the transaction. See log for further information.');
        console.error('Something went wrong: ' + e);
    });
}

function placeBet() {
    var betDateHtml = document.getElementById('bet_date').value;

    if (betDateHtml == '') {
        setStatus(AlertType.ERROR, 'Must specify a date.');
        throw 'Must specify a date.';
    }

    var dateElements = betDateHtml.split('-');
    var betDate = new Date(dateElements[0], dateElements[1], dateElements[2]);

    getAccount(0).then(function(account) {
        var bet = Bet.deployed();
        return bet.placeBet.sendTransaction(betDate.getTime(), {
            from: account
        });
    }).then(function(txHash) {
        setStatus(AlertType.WARNING, 'Sent transaction', 'TxHash: ' + txHash);
        console.log('Sent transaction', 'TxHash: ' + txHash);
        return web3.eth.getTransaction(txHash);
    }).then(function(transaction) {
        setStatus(AlertType.SUCCESS, 'Bet placed.');
        console.log('Bet placed.');
        updateButtons();
    }).catch(function(e) {
        setStatus(AlertType.ERROR, 'An error occured in the transaction. See log for further information.');
        console.error('Something went wrong: ' + e);
    });

}

function closeBetting() {
    getAccount(0).then(function(account) {
        var bet = Bet.deployed();
        bet.closeBetting.sendTransaction({
            from: account
        })
    }).then(function(txHash) {
        setStatus(AlertType.WARNING, 'Sent transaction', 'TxHash: ' + txHash);
        console.log('Sent transaction', 'TxHash: ' + txHash);
        return web3.eth.getTransaction(txHash);
    }).then(function(transaction) {
        setStatus(AlertType.SUCCESS, 'Betting closed.');
        console.log('Betting closed.');
        refreshDashboard();
        updateButtons();
    }).catch(function(e) {
        setStatus(AlertType.ERROR, 'An error occured in the transaction. See log for further information.');
        console.error('Something went wrong: ' + e);
    });
}

function payPrize() {
    getAccount(0).then(function(account) {
        var bet = Bet.deployed();
        bet.payout.sendTransaction(account, {
            from: account
        })
    }).then(function(txHash) {
        setStatus(AlertType.WARNING, 'Sent transaction', 'TxHash: ' + txHash);
        console.log('Sent transaction', 'TxHash: ' + txHash);
        return web3.eth.getTransaction(txHash);
    }).then(function(transaction) {
        setStatus(AlertType.SUCCESS, 'Prize paid out.');
        console.log('Prize paid out.');
        refreshDashboard();
        updateButtons();
    }).catch(function(e) {
        setStatus(AlertType.ERROR, 'An error occured in the transaction. See log for further information.');
        console.error('Something went wrong: ' + e);
    });
}

function hideMessage() {
    var statusMsgElement = document.getElementById('status_message');
    statusMsgElement.classList.add('hidden');
}

function setStatus(type, message) {
    var statusMsgElement = document.getElementById('status_message');
    statusMsgElement.classList.remove('hidden');

    var alertBoxElement = document.getElementById('alert_box');
    alertBoxElement.classList.remove('alert--success');
    alertBoxElement.classList.remove('alert--error');
    alertBoxElement.classList.remove('alert--warning');

    var iconElement = document.getElementById('status_icon');
    var messageElement = document.getElementById('message_content');

    switch (type) {
        case AlertType.SUCCESS:
            alertBoxElement.classList.add('alert--success');
            iconElement.innerHTML = 'stars';
            break;
        case AlertType.WARNING:
            alertBoxElement.classList.add('alert--warning');
            iconElement.innerHTML = 'warning';
            break;
        case AlertType.ERROR:
            alertBoxElement.classList.add('alert--error');
            iconElement.innerHTML = 'error_outline';
            break;
        default:
            iconElement.innerHTML = 'info_outline';
            // standard alerts do not need a special class
    };

    messageElement.innerHTML = message;
}

window.onload = function() {
    refreshDashboard();
    updateButtons();
}

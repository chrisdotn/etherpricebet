import "./Mortal.sol";

contract Bet is Mortal {
    enum State { New, Open, Closed, Won }

    State public state;
    uint public pricelevel;
    uint public round;
    address[] betters;
    address winner;

    mapping (address => uint) public bets;
    mapping (address => uint) public rounds;

    event Creation(
        address indexed creator,
        uint indexed price,
        uint jackpot,
        uint round
    );

    event ClosingBetting(
        address indexed creator
    );

    event PlacedBet(
        address indexed creator,
        uint indexed date,
        uint round
    );

    event Payout(
        address indexed creator,
        address indexed winner,
        uint indexed prize
    );

    event DeterminedWinner(
        address indexed winner,
        uint bet,
        uint result,
        uint difference
    );

    event Error(
        string message
    );

    function Bet() {
        state = State.New;
        pricelevel = 0;
    }

    function getBalance() constant returns (uint balance) {
        return this.balance;
    }

    function setPriceLevel(uint level) {
        pricelevel = level;
    }

    function create(uint price) {

        // new bets are only allowed in state State.New
        if (state != State.New) {
            throw;
        }

        betters.length = 0;
        pricelevel = price;
        state = State.Open;
        round++;

        Creation(msg.sender, price, this.balance, round);
    }

    function closeBetting() {

        // closing the betting period is allowed during State.Open only
        if (state != State.Open) {
            throw;
        }

        state = State.Closed;

        ClosingBetting(msg.sender);
    }

    function placeBet (uint date) {

        // bet are allowed during State.Open only
        if (state != State.Open) {
            throw;
        }

        // only one bet allowed, else throw
        if (rounds[msg.sender] == round) {
            throw;
        }

        betters.push(msg.sender);
        bets[msg.sender] = date;
        rounds[msg.sender] = round;

        PlacedBet(msg.sender, date, round);
    }

    function determineWinner(uint date) returns(address) {

        address currentWinner;
        uint currentDiff = 999999999999;

        for (uint i=0; i<betters.length; i++) {

            uint difference = 0;

            if (bets[betters[i]] > date) {
                difference = bets[betters[i]] - date;
            } else {
                difference = date - bets[betters[i]];
            }

            if (difference < currentDiff) {
                currentDiff = difference;
                currentWinner = betters[i];
            }
        }

        return currentWinner;
    }

    function evaluateBet() returns (bool) {

        // determine winner is allowed in State.Closed only
        if (state != State.Closed) {
            throw;
        }

        // 1476655200000 is 2016-10-17
        uint result = 1476655200000;
        winner = determineWinner(result);

        uint difference = 0;
        if (result > bets[winner]) {
            difference = result - bets[winner];
        } else {
            difference = bets[winner] - result;
        }

        DeterminedWinner(winner, bets[winner], result, difference);

        state = State.Won;

        return true;
    }

    function payout() returns (bool) {

        // payout is allowed in State.Won only
        if (state != State.Won) {
            Error('State is not WON');
            throw;
        }


        if (rounds[winner] != round) {
            Error('Rounds is not proper');
            throw;
        }

        uint jackpot = this.balance;

        if (winner.send(this.balance)) {
            Payout(msg.sender, winner, jackpot);
            pricelevel = 0;
            state = State.New;
            return true;
        } else {
            Error('Payout failed.');
            return false;
        }
    }
}

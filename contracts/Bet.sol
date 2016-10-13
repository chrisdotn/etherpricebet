import "./Mortal.sol";

contract Bet is Mortal {
    enum State { New, Open, Closed }

    State public state;
    uint public pricelevel;
    uint public round;
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

        // new bets are only allowed in state State.New or State.Ended
        if (state != State.New) {
            throw;
        }

        pricelevel = price;
        state = State.Open;
        round++;

        Creation(msg.sender, price, this.balance, round);
    }

    function closeBetting() {

        // closing the betting period is allowd during State.Open bet only
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

        bets[msg.sender] = date;
        rounds[msg.sender] = round;

        PlacedBet(msg.sender, date, round);
    }

    function payout(address winner) returns (bool) {
        if (rounds[winner] != round) {
            throw;
        }

        pricelevel = 0;
        state = State.New;

        if (winner.send(this.balance)) {
            Payout(msg.sender, winner, bets[winner]);
            return true;
        } else {
            return false;
        }
    }
}

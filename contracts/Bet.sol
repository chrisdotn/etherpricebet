import "./Mortal.sol";

contract Bet is Mortal {
    enum State { New, Open, Closed, Ended }

    State public state;
    uint public pricelevel;
    uint public enddate;
    mapping (address => uint) public bets;

    event Creation(
        address indexed creator,
        uint indexed price,
        uint indexed end
    );

    event ClosingBetting(
        address indexed creator
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

    function create(uint price, uint end) {

        // new bets are only allowed in state State.New or State.Ended
        if (state != State.New) {
            throw;
        }

        pricelevel = price;
        enddate = end;
        state = State.Open;

        Creation(msg.sender, price, end);
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
        if (bets[msg.sender] != 0) {
            throw;
        }

        bets[msg.sender] = date;
    }

    function payout(address winner) returns (bool) {
        if (bets[winner] == 0) {
            throw;
        }

        pricelevel = 0;
        enddate = 0;
        state = State.Ended;

        // send money to winner
        //uint amount = this.balance;
        //this.balance = 0;

        if (winner.send(this.balance)) {
            return true;
        } else {
            //this.balance = amount;
            return false;
        }
    }
}

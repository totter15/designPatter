// class GumballMachine {
//   SOLD_OUT: number = 0;
//   NO_QUARTER: number = 1;
//   HAS_QUATER: number = 2;
//   SOLD: number = 3;

//   state: number = this.SOLD_OUT;
//   count: number = 0;

//   constructor(count: number) {
//     this.count = count;
//     if (this.count > 0) {
//       this.state = this.NO_QUARTER;
//     }
//   }

//   // 동전이 투입된경우
//   insertQuarter(): void {
//     if (this.state === this.HAS_QUATER) {
//       console.log("동전은 한 개만 넣어주세요");
//     } else if (this.state === this.NO_QUARTER) {
//       this.state = this.HAS_QUATER;
//       console.log("동전이 투입되었습니다.");
//     } else if (this.state === this.SOLD_OUT) {
//       console.log("매진되었습니다. 다음 기회에 이용해주세요.");
//     } else if (this.state === this.SOLD) {
//       console.log("알맹이를 내보내고 있습니다.");
//     }
//   }

//   // 사용자가 동전을 반환받으려는 경우
//   ejectQuater(): void {
//     if (this.state === this.HAS_QUATER) {
//       console.log("동전이 반환됩니다.");
//       this.state = this.NO_QUARTER;
//     } else if (this.state === this.NO_QUARTER) {
//       console.log("동전을 넣어주세요");
//     } else if (this.state === this.SOLD) {
//       console.log("이미 알맹이를 뽑으셨습니다.");
//     } else if (this.state === this.SOLD_OUT) {
//       console.log("동전을 넣지 않으셨습니다. 동전이 반환되지 않습니다. ");
//     }
//   }

//   // 손잡이를 돌리려는 경우
//   turnCrank(): void {
//     if (this.state === this.SOLD) {
//       console.log("손잡이는 한 번만 돌려 주세요.");
//     } else if (this.state === this.NO_QUARTER) {
//       console.log("동전을 넣어주세요");
//     } else if (this.state === this.SOLD_OUT) {
//       console.log("매진되었습니다. 다음 기회에 이용해주세요.");
//     } else if (this.state === this.HAS_QUATER) {
//       console.log("손잡이를 돌리셨습니다.");
//       this.state = this.SOLD;
//       this.dispense();
//     }
//   }

//   dispense(): void {
//     console.log(this.state);
//     if (this.state === this.SOLD) {
//       console.log("알맹이를 내보내고 있습니다.");
//       this.count--;
//       if (this.count === 0) {
//         console.log("더 이상 알맹이가 없습니다.");
//         this.state = this.SOLD_OUT;
//       } else {
//         this.state = this.NO_QUARTER;
//       }
//     } else if (this.state === this.NO_QUARTER) {
//       console.log("동전을 넣어주세요");
//     } else if (this.state === this.SOLD_OUT) {
//       console.log("매진입니다.");
//     } else if (this.state === this.HAS_QUATER) {
//       console.log("알맹이를 내보낼 수 없습니다.");
//     }
//   }
// }

// const gumballMachine = new GumballMachine(5);
// console.log(gumballMachine);

// gumballMachine.insertQuarter();
// gumballMachine.turnCrank();

// console.log(gumballMachine);

// gumballMachine.insertQuarter();
// gumballMachine.ejectQuater();
// gumballMachine.turnCrank();

// console.log(gumballMachine);

// gumballMachine.insertQuarter();
// gumballMachine.turnCrank();
// gumballMachine.insertQuarter();
// gumballMachine.turnCrank();
// gumballMachine.ejectQuater();

// console.log(gumballMachine);

// gumballMachine.insertQuarter();
// gumballMachine.insertQuarter();
// gumballMachine.turnCrank();
// gumballMachine.insertQuarter();
// gumballMachine.turnCrank();
// gumballMachine.insertQuarter();
// gumballMachine.turnCrank();

// console.log(gumballMachine);

// 뽑기기계 코드 수정 요청
// 10번에 1번꼴로 손잡이를 돌릴때 알맹이 2개가 나오도록 수정

// 위의 코드에서 WINNER상태 추가및 inserQuarter, ejectQuarter, turnCrank, dispense 메서드에 WINNER일때 조건문 추가 필요

// -------------------------------------------------

class GumballMachine {
  soldOutState: State;
  noQuarterState: State;
  hasQuarterState: State;
  soldState: State;
  winnerState: State;

  state: State;
  count: number = 0;

  constructor(numberOfGumballs: number) {
    this.soldOutState = new SoldOutState(this);
    this.noQuarterState = new NoQuarterState(this);
    this.hasQuarterState = new HasQuarterState(this);
    this.soldState = new SoldState(this);
    this.winnerState = new WinnerState(this);

    this.count = numberOfGumballs;

    if (numberOfGumballs > 0) {
      this.state = this.noQuarterState;
    } else {
      this.state = this.soldOutState;
    }
  }

  insertQuarter(): void {
    this.state.insertQuarter();
  }
  ejectQuarter(): void {
    this.state.ejectQuarter();
  }
  turnCrank(): void {
    this.state.turnCrank();
    this.state.dispense();
  }
  setState(state: State): void {
    this.state = state;
  }
  releaseBall(): void {
    console.log("알맹이를 내보내고 있습니다.");
    if (this.count > 0) {
      this.count--;
    }
  }
  getSoldOutState(): State {
    return this.soldOutState;
  }
  getNoQuarterState(): State {
    return this.noQuarterState;
  }
  getHasQuarterState(): State {
    return this.hasQuarterState;
  }
  getSoldState(): State {
    return this.soldState;
  }
  getWinnerState(): State {
    return this.winnerState;
  }
  getCount(): number {
    return this.count;
  }
}
interface State {
  insertQuarter(): void;
  ejectQuarter(): void;
  turnCrank(): void;
  dispense(): void;
}

class NoQuarterState implements State {
  gumballMachine: GumballMachine;
  constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine;
  }

  insertQuarter(): void {
    console.log("동전을 넣으셨습니다.");
    this.gumballMachine.setState(this.gumballMachine.getHasQuarterState());
  }
  ejectQuarter(): void {
    console.log("동전을 넣어주세요");
  }
  turnCrank(): void {
    console.log("동전을 넣어주세요");
  }
  dispense(): void {
    console.log("동전을 넣어주세요");
  }
}

class HasQuarterState implements State {
  randomWinner: () => number = () => Math.floor(Math.random() * 10);
  gumballMachine: GumballMachine;
  constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine;
  }
  insertQuarter(): void {
    console.log("동전은 한개만 넣어 주세요.");
  }

  ejectQuarter(): void {
    console.log("동전이 반환됩니다.");
    this.gumballMachine.setState(this.gumballMachine.getNoQuarterState());
  }

  turnCrank(): void {
    console.log("손잡이를 돌리셨습니다.");
    const winner = this.randomWinner();
    console.log("winner: ", winner);
    if (winner === 3 && this.gumballMachine.getCount() > 1) {
      this.gumballMachine.setState(this.gumballMachine.getWinnerState());
    } else {
      this.gumballMachine.setState(this.gumballMachine.getSoldState());
    }
  }

  dispense(): void {
    console.log("알맹이를 내보낼 수 없습니다.");
  }
}
class SoldState implements State {
  gumballMachine: GumballMachine;
  constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine;
  }
  insertQuarter(): void {
    console.log("알맹이를 내보내고 있습니다.");
  }
  ejectQuarter(): void {
    console.log("이미 알맹이를 뽑으셨습니다.");
  }
  turnCrank(): void {
    console.log("손잡이는 한 번만 돌려 주세요.");
  }

  dispense(): void {
    console.log("알맹이를 내보내고 있습니다.");
    this.gumballMachine.releaseBall();
    if (this.gumballMachine.getCount() > 0) {
      this.gumballMachine.setState(this.gumballMachine.getNoQuarterState());
    } else {
      console.log("Oops, out of gumballs!");
      this.gumballMachine.setState(this.gumballMachine.getSoldOutState());
    }
  }
}

class SoldOutState implements State {
  gumballMachine: GumballMachine;
  constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine;
  }
  insertQuarter(): void {
    console.log("매진되었습니다.");
  }
  ejectQuarter(): void {
    console.log("매진되었습니다.");
  }
  turnCrank(): void {
    console.log("매진되었습니다.");
  }
  dispense(): void {
    console.log("매진되었습니다.");
  }
}

class WinnerState implements State {
  gumballMachine: GumballMachine;
  constructor(gumballMachine: GumballMachine) {
    this.gumballMachine = gumballMachine;
  }
  insertQuarter(): void {
    console.log("알맹이를 내보내고 있습니다.");
  }
  ejectQuarter(): void {
    console.log("이미 알맹이를 뽑으셨습니다.");
  }
  turnCrank(): void {
    console.log("손잡이는 한 번만 돌려 주세요.");
  }
  dispense(): void {
    this.gumballMachine.releaseBall();
    if (this.gumballMachine.getCount() === 0) {
      this.gumballMachine.setState(this.gumballMachine.getSoldOutState());
    } else {
      this.gumballMachine.releaseBall();
      console.log("축하드립니다! 알맹이를 하나 더 받으실 수 있습니다.");
      if (this.gumballMachine.getCount() > 0) {
        this.gumballMachine.setState(this.gumballMachine.getNoQuarterState());
      } else {
        console.log("더 이상 알맹이가 없습니다.");
        this.gumballMachine.setState(this.gumballMachine.getSoldOutState());
      }
    }
  }
}

// -------------------------------------------------

// 상태 패턴 정의
// 객체 내부 상태가 바뀜에 따라서 객체의 행동을 바꿀 수 있다.
// - 상태를 별도의 클래스로 캡슐화하고 상태를 나타내는 객체에 행동을 위임

// 마치 객체의 클래스가 바뀌는 것과 같은 결과를 얻을 수 있다.
// - 여러상태 객체를 바꿔가며 사용하기때문에

// 상태 패턴과 전략 패턴
// 상태 패턴을 사용할 때는 상태 객체에 일련의 행동이 캡슐화
// 클라이언트는 상태객체를 몰라도됨

// 전략패턴을 사용할때는 클라이언트가 Context 객체에게 어떤 전략 객체를 사용할지를 지정
// 전략 패턴은 주로 실행 시에 전략 객체를 변경할 수 있는 유연성을 제공하는 용도

const gumballMachine = new GumballMachine(5);

console.log(gumballMachine.getCount());

gumballMachine.insertQuarter();
gumballMachine.turnCrank();

console.log(gumballMachine.getCount());

gumballMachine.insertQuarter();
gumballMachine.turnCrank();
gumballMachine.insertQuarter();
gumballMachine.turnCrank();

console.log(gumballMachine.getCount());

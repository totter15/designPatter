class GumballMachine {
  SOLD_OUT: number = 0;
  NO_QUARTER: number = 1;
  HAS_QUATER: number = 2;
  SOLD: number = 3;

  state: number = this.SOLD_OUT;
  count: number = 0;

  constructor(count: number) {
    this.count = count;
    if (this.count > 0) {
      this.state = this.NO_QUARTER;
    }
  }

  // 동전이 투입된경우
  insertQuarter(): void {
    if (this.state === this.HAS_QUATER) {
      console.log("동전은 한 개만 넣어주세요");
    } else if (this.state === this.NO_QUARTER) {
      this.state = this.HAS_QUATER;
      console.log("동전이 투입되었습니다.");
    } else if (this.state === this.SOLD_OUT) {
      console.log("매진되었습니다. 다음 기회에 이용해주세요.");
    } else if (this.state === this.SOLD) {
      console.log("알맹이를 내보내고 있습니다.");
    }
  }

  ejectQuater(): void {
    if (this.state === this.HAS_QUATER) {
      console.log("동전이 반환됩니다.");
    } else if (this.state === this.NO_QUARTER) {
      console.log("동전을 넣어주세요");
    } else if (this.state === this.SOLD) {
      console.log("이미 알맹이를 뽑으셨습니다.");
    } else if (this.state === this.SOLD_OUT) {
      console.log("동전을 넣지 않으셨습니다. 동전이 반환되지 않습니다. ");
    }
  }
}

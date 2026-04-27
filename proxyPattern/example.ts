// 프록시 패턴

class GumballMachine {
	location: string;
	count: number;
	state: string;

	constructor(location: string, count: number) {
		this.location = location;
		this.count = count;
		this.state = 'sold out';
	}

	getLocation(): string {
		return this.location;
	}

	getCount(): number {
		return this.count;
	}

	getState(): string {
		return this.state;
	}
}

class GumballMonitor {
	machine: GumballMachine;

	constructor(machine: GumballMachine) {
		this.machine = machine;
	}

	report() {
		console.log(`뽑기 기계 위치: ${this.machine.getLocation()}`);
		console.log(`현재 재고: ${this.machine.getCount()} 개`);
		console.log(`현재 상태: ${this.machine.getState()}`);
	}
}

const gumballMachine = new GumballMachine('서울', 100);
const gumballMonitor = new GumballMonitor(gumballMachine);
gumballMonitor.report();

// --------------------------------------------------------

// 원격 프록시의 역할
// 원격 프록시는 원격 객체의 로컬 대변자 역할
// 원격 객체: 다른 자바 가상 머신의 힙에서 살고 있는 객체(다른 주소에서 돌아가는 객체)
// 로컬 대변자: 어떤 메소드를 호출하면 다른 원격 객체에게 그 메소드 호출을 전달해 주는 객체

// 클라이언트 객체는 원격 객체의 메소드를 호출하는 것처럼 행동
// 실제로는 로컬 힙에 들어있는 '프록시' 객체의 메소드를 호출
// 네트워크 통신과 관련된 저수준 작업을 이 프로시 객체에서 처리

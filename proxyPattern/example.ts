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

// --------------------------------------------------------

// 원격 서비스 만들기
// 1. 원격 인터페이스 만들기
// - 원격 인터페이스 - 클라이언트가 원격으로 호출할 메소드 정의, 스텁과 실제 서비스에 이 인터페이스 구현
// 2. 서비스 구현 클래스 만들기
// - 실제 작업을 처리하는 클래스
// 3. RMI 레지스트리 실행하기
// 4. 원격 서비스 실행하기

// --------------------------------------------------------

// 프록시 패턴
// 특정 객체로의 접근을 제어하는 대리인(특정 객체를 대변하는 객체)을 제공

// 원격 프록시
// 다른 JVM에 들어있는 객체의 대리엔에 해당하는 로컬 객체. 프록시의 메소드를 호출하면  원격 객체의 메소드가 호출.

// 가상 프록시
// 가상 프록시는 생성하듣네 많은 비용이 드는 객체를 대신. 진짜 객체가 필요한 상황이 오기전까지 객체의 생성을 미루는 기능 제공.
// 객체 생성 전이나 객체 생성 도중에 객체를 대신.
// 객체 생성이 끝나면 RealSubject에 직접 요청 전달

// ImageProxy

interface Icon {
	getIconWidth(): number;
	getIconHeight(): number;
	printIcon(): void;
}

class ImageProxy implements Icon {
	imageIcon: Icon;
	imageURL: string;
	retrievalThread: Thread;
	retrieving: boolean;

	constructor(url: URL) {
		this.imageURL = url.toString();
	}

	getIconWidth(): number {
		return this.imageIcon.getIconWidth();
	}

	getIconHeight(): number {
		return this.imageIcon.getIconHeight();
	}

	setImageIcon(icon: Icon) {
		this.imageIcon = icon;
	}

	printIcon(c:CompletionEntry, g:Graphics, y:number): void {
		if(imageIcon != null){
			retrievalThread = new Thread(this.imageURL);
			retrievalThread.start();
			retrieving = true;
		}
		
	}
}

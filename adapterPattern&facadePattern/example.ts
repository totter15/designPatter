// 어댑터 사용 방법 알아보기

interface Duck {
	quack(): void;
	fly(): void;
}

class MallardDuck implements Duck {
	quack(): void {
		console.log('꽥꽥');
	}
	fly(): void {
		console.log('날고 있어요!!');
	}
}

interface Turkey {
	gobble(): void;
	fly(): void;
}

class WildTurkey implements Turkey {
	gobble(): void {
		console.log('골골');
	}
	fly(): void {
		console.log('짧은 거리를 날고 있어요!');
	}
}

// Duck 객체가 모자라서 Turkey 객체를 사용해야하는 상황

class TurkeyAdapter implements Duck {
	turkey: Turkey;

	constructor(turkey: Turkey) {
		this.turkey = turkey;
	}

	quack(): void {
		this.turkey.gobble();
	}

	fly(): void {
		for (let i = 0; i < 5; i++) {
			this.turkey.fly();
		}
	}
}

// 오리 어댑터 테스트

const duck = new MallardDuck();

const turkey = new WildTurkey();
const turkeyAdapter = new TurkeyAdapter(turkey);

const testDuck = (duck: Duck) => {
	duck.quack();
	duck.fly();
};

console.log('\n칠면조가 말하길');
turkey.gobble();
turkey.fly();

console.log('\n오리가 말하길');
testDuck(duck);

console.log('\n칠면조 어댑터가 말하길');
testDuck(turkeyAdapter);

// 칠면조가 말하길
// 골골
// 짧은 거리를 날고 있어요!

// 오리가 말하길
// 꽥꽥
// 날고 있어요!!

// 칠면조 어댑터가 말하길
// 골골
// 짧은 거리를 날고 있어요!
// 짧은 거리를 날고 있어요!
// 짧은 거리를 날고 있어요!
// 짧은 거리를 날고 있어요!
// 짧은 거리를 날고 있어요!

// --------------------------------------------------------

// 어댑터 패턴 알아보기

// 클라이언트 - 타깃 인터페이스에 맞게 구현
// | request()
// 어댑터 - 타깃 인터페이스를 구현, 어탭티(adaptee) 인스턴스가 들어있음
// | translatedRequest()
// 어댑티 - 모든 요청은 어댑티에 위임

// 01. 클라이언트에서 타깃 인터페이스로 메소드를 호출해 어댑터에 요청을 보냄
// 02. 어댑터는 어댑티 인터페이스로 그 요청을 어댑티에 관한 메소드 호출로 변환
// 03. 클라이언트는 호출 결과를 받긴 하지만 중간에 어댑터가 있음을 모름

// 어댑터 패턴은 특정 인터페이스를 클라이언트에서 요구하는 다른 인터페이스로 변환.
// 인터페이스가 호환되지 않아 같이 쓸수 없었던 클래스를 사용할 수 있게 도와줌.

// 객체 어댑터
// 구성방식: 합성을 사용
// 객체 어댑터는 어댑티를 포함하는 방식

// 클래스 어댑터
// 구성발식: 다중상속을 사용
// 클래스 어댑터는 Target인터페이스를 구현하면서 동시에 Adaptee를 상속받는 방식

// --------------------------------------------------------

// Enimeration을 Iterator에 적응시키기

interface Iterator {
	hasNext(): boolean;
	next(): any;
	remove(): void;
}

interface Enumeration {
	hasMoreElements(): boolean;
	nextElement(): any;
}

class EnumerationAdapter implements Iterator {
	enumeration: Enumeration;
	constructor(enumeration: Enumeration) {
		this.enumeration = enumeration;
	}
	hasNext(): boolean {
		return this.enumeration.hasMoreElements();
	}
	next(): any {
		return this.enumeration.nextElement();
	}
	remove(): void {
		// Enumeration에는 remove() 메소드가 없기 때문에 예외 발생
		throw new Error('Method not implemented.');
	}
}

// --------------------------------------------------------

// 파사드 패턴
// 쓰기 쉬운 인터페이스를 제공하는 파사드 클래스를 구현함으로써 복잡한 시스템을 편리하게 사용가능.

class HomeTheaterFacade {
	amplifier: Amplifier;
	turner: Turner;
	player: Player;
	projector: Projector;
	lights: Lights;
	screen: Screen;
	popcorn: PopcornPopper;

	constructor(
		amplifier: Amplifier,
		turner: Turner,
		player: Player,
		projector: Projector,
		lights: Lights,
		screen: Screen,
		popcorn: PopcornPopper,
	) {
		this.amplifier = amplifier;
		this.turner = turner;
		this.player = player;
		this.projector = projector;
		this.lights = lights;
		this.screen = screen;
		this.popcorn = popcorn;
	}

	watchMovie(movie: string) {
		this.lights.dim(10);
		this.turner.on();
		this.turner.setInput(this.turner.TunerInput.DVD);
		this.amplifier.on();
		this.amplifier.setVolume(5);
		this.amplifier.setInput(this.amplifier.Input.DVD);
		this.projector.on();
		this.projector.setInput(this.projector.Input.DVD);
		this.screen.down();
		this.popcorn.on();
		this.popcorn.pop();
	}

	endMovie() {
		this.lights.on();
		this.turner.off();
		this.turner.setInput(this.turner.TunerInput.DVD);
		this.amplifier.off();
		this.amplifier.setVolume(0);
		this.amplifier.setInput(this.amplifier.Input.DVD);
		this.projector.off();
		this.projector.setInput(this.projector.Input.DVD);
	}
}

const amplifier = new Amplifier();
const turner = new Turner();
const player = new Player();
const projector = new Projector();
const lights = new Lights();
const screen = new Screen();
const popcorn = new PopcornPopper();

const homeTheater = new HomeTheaterFacade(
	amplifier,
	turner,
	player,
	projector,
	lights,
	screen,
	popcorn,
);

homeTheater.watchMovie('The Dark Knight');
homeTheater.endMovie();

// --------------------------------------------------------

// 파사드 패턴의 정의
// 파사드 패턴은 서브 시스템에 있는 일련의 인터페이스를 통합 인터페이스로 묶어줌.
// 또한 고수준 인터페이스도 정의하므로 서브시스템을 더 편리하게 사용가능

// --------------------------------------------------------

// 최소 지식 원칙
// 객체 사이의 상호작용은 될 수 있으면 아주 가까운 '친구' 사이에만 허용하는 편이 좋다.

//규칙: 메소드 호출은 다음 4가지 경우에만 허용
// 어떤 메소드에서 호출 가능한 객체는:
class MyClass {
	method() {
		// 1. 객체 자신의 메소드
		this.anotherMethod();

		// 2. 메소드에 매개변수로 전달된 객체의 메소드
		function doSomething(obj: SomeClass) {
			obj.someMethod();
		}

		// 3. 그 메소드에서 생성하거나 인스턴스를 만든 객체의 메소드
		const newObj = new AnotherClass();
		newObj.someMethod();

		// 4. 그 객체에 속하는 구성 요소(인스턴스 변수)의 메소드
		this.component.someMethod();
	}
}

// 나쁜예
// 여러 객체를 거쳐서 메소드를 호출하는 경우
class BadExample {
	getTemp(): number {
		// station에서 thermometer를 받아오고
		// 다시 thermometer에서 temperature를 받아옴
		// 너무 많은 객체와 결합됨!
		return this.station.getThermometer().getTemperature();
	}
}

// 좋은예
class GoodExample {
	getTemp(): number {
		// station에게 직접 요청
		// station 내부 구조를 알 필요 없음
		return this.station.getTemperature();
	}
}

// Station 클래스 내부에서 처리
class Station {
	thermometer: Thermometer;

	getTemperature(): number {
		// 외부에 thermometer를 노출하지 않음
		return this.thermometer.getTemperature();
	}
}

// 파사드 패턴과의 관계
// 현재 파일의 HomeTheaterFacade 클래스가 바로 최소 지식 원칙을 잘 적용한 예
// 클라이언트 코드는 복잡한 내부 시스템을 알 필요없이 파사드를 통해서만 상호작용함.

// 장점
// 결합도 감소: 시스템 간의 의존성이 줄어듦
// 유지보수 용이: 한 부분의 변경이 다른 부분에 영향을 덜 미침
// 이해하기 쉬움: 각 객체가 간단한 인터페이스만 제공

// 단점
// 래퍼 클래스를 더 만들어야 할 수 있어 복잡성 증가
// 실행 시간이 느려질 수 있음

//커맨드 패턴
//

// 첫번째 커맨드 객체 만들기

// 커멘드 객체는 모두 같은 인터페이스를 구현.
interface Command {
	execute(): void;
}

class Light {
	on(): void {
		console.log('Light on');
	}

	off(): void {
		console.log('Light off');
	}
}

class LightonCommand implements Command {
	light: Light;

	// 생성자에 이 커맨드 객체로 제어할 특정 조명의 정보 전달
	constructor(light: Light) {
		this.light = light;
	}

	execute(): void {
		this.light.on();
	}
}

// 커맨드 객체 사용
class SimpleRemoteControl {
	slot: Command;

	constructor() {}

	setCommand(command: Command) {
		this.slot = command;
	}

	buttonWasPressed() {
		this.slot.execute();
	}
}

const remote = new SimpleRemoteControl(); //인보커
const light = new Light(); //리시버
const lightOn = new LightonCommand(light); //커맨드 객체 생성

remote.setCommand(lightOn); //커맨드 객체를 인보커에게 전달
remote.buttonWasPressed(); //버튼을 누르면 커맨드 객체의 execute() 메서드 호출

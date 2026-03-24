//커맨드 패턴

// 첫번째 커맨드 객체 만들기

// 커멘드 객체는 모두 같은 인터페이스를 구현.
interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  on(): void {
    console.log(`${this.name} light on`);
  }

  off(): void {
    console.log(`${this.name} light off`);
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

  undo(): void {
    this.light.off();
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
const light = new Light("Living Room"); //리시버
const lightOn = new LightonCommand(light); //커맨드 객체 생성 (행동 + 리시버). 커맨드객체는 execute() 메서드 제공

remote.setCommand(lightOn); //커맨드 객체를 인보커에게 전달
remote.buttonWasPressed(); //버튼을 누르면 커맨드 객체의 execute() 메서드 호출

// 커맨드 패턴의 정의
// 커맨드 패턴을 사용하면 요청 내역을 객체로 캡슐화해서 개체를 서로 다른 요청 내역에 따라 매개변수화 할 수 있음
// 이러면 요청을 큐에 저장하거나 로그를 기록하거나 작업 취소 기능을 사용할 수 있다

// 클라이언트 : ConcreateCommand 객체를 생성하고 Receiver를 설정
// 인보커 : 명령이 들어있으며, execute() 메서드를 호출함으로써 커맨드 객체에게 특정 작업을 수행해 달라는 요구를 하게 됨
// 리시버 : 요구 사항을 수행할 때 어떤일을 처리해야하는지 알고 있는 객체
// ConcreateCommand : 특정 행동과 리시버를 연결, 인보터에서 execute() 메서드를 호출하면 ConcreateCommand 객체에서 리시버에 잇는 메소드를 호출해서 작업 처리

// 리시버(기능)와 인보커(리모컨)로 관리하는게 커맨드 패턴인감?

//--------------------------------------------------------

// 슬롯에 명령 할당하기

class NoCommand implements Command {
  execute(): void {
    console.log("No command");
  }
  undo(): void {
    console.log("No command");
  }
}

class ConcreateCommand implements Command {
  execute(): void {
    console.log("Command");
  }
  undo(): void {
    console.log("Command");
  }
}

class RemoteControl {
  // 이 리모컨 코드는 7개의 On/Off 버튼을 가지고 있음.
  onCommands: Command[];
  offCommands: Command[];

  constructor() {
    this.onCommands = new Array<ConcreateCommand>(7);
    this.offCommands = new Array<ConcreateCommand>(7);

    const noCommand = new NoCommand();
    for (let i = 0; i < 7; i++) {
      this.onCommands[i] = new NoCommand();
      this.offCommands[i] = new NoCommand();
    }
  }

  // 각 커맨드 객체는 나중에 사용하기 편하게 onCommands와 offCommands 배열에 저장
  setCommand(slot: number, onCommand: Command, offCommand: Command) {
    this.onCommands[slot] = onCommand;
    this.offCommands[slot] = offCommand;
  }

  // 사용자가 On/Off 버튼을 누르면 해당 슬롯의 커맨드 객체의 execute() 메서드 호출
  onButtonWasPushed(slot: number) {
    this.onCommands[slot]?.execute();
  }

  offButtonWasPushed(slot: number) {
    this.offCommands[slot]?.execute();
  }

  toString() {
    return `
	----- Remote Control -----
	${this.onCommands.map((command, index) => `[slot ${index}] ${command.constructor.name} ${command.toString()}`).join("\n")}
	${this.offCommands.map((command, index) => `[slot ${index}] ${command.constructor.name} ${command.toString()}`).join("\n")}
	`;
  }
}

class LightOffCommand implements Command {
  light: Light;

  constructor(light: Light) {
    this.light = light;
  }

  execute(): void {
    this.light.off();
  }

  undo(): void {
    this.light.on();
  }
}

class Stereo {
  on(): void {
    console.log("Stereo on");
  }
  off(): void {
    console.log("Stereo off");
  }
  setCD(): void {
    console.log("Stereo set CD");
  }
  setVolume(volume: number): void {
    console.log(`Stereo set volume to ${volume}`);
  }
}

class StereoOnWithCDCommand implements Command {
  stereo: Stereo;

  constructor(stereo: Stereo) {
    this.stereo = stereo;
  }

  // 전원을 키고, CDO를 재생하고, 볼륨을 11로 설정
  execute(): void {
    this.stereo.on();
    this.stereo.setCD();
    this.stereo.setVolume(11);
  }

  undo(): void {
    this.stereo.off();
  }
}

class StereoOffWithCDCommand implements Command {
  stereo: Stereo;

  constructor(stereo: Stereo) {
    this.stereo = stereo;
  }

  execute(): void {
    this.stereo.off();
  }

  undo(): void {
    this.stereo.on();
    this.stereo.setCD();
    this.stereo.setVolume(11);
  }
}

const remoteControl = new RemoteControl();

const livingRoomLight = new Light("Living Room");
const kitchenLight = new Light("Kitchen");

const livingRoomLightOn = new LightonCommand(livingRoomLight);
const kitchenLightOn = new LightonCommand(kitchenLight);
const livingRoomLightOff = new LightOffCommand(livingRoomLight);
const kitchenLightOff = new LightOffCommand(kitchenLight);

const stereo = new Stereo();
const stereoOnWithCDCommand = new StereoOnWithCDCommand(stereo);
const stereoOffWithCDCommand = new StereoOffWithCDCommand(stereo);

remoteControl.setCommand(0, livingRoomLightOn, livingRoomLightOff);
remoteControl.setCommand(1, kitchenLightOn, kitchenLightOff);
remoteControl.setCommand(2, stereoOnWithCDCommand, stereoOffWithCDCommand);

console.log(remoteControl.toString());

remoteControl.onButtonWasPushed(0);
remoteControl.offButtonWasPushed(0);
remoteControl.onButtonWasPushed(1);
remoteControl.offButtonWasPushed(1);
remoteControl.onButtonWasPushed(2);
remoteControl.offButtonWasPushed(2);

//--------------------------------------------------------

// 작업 취소기능 추가하기

// interface Command {
// 	execute(): void;
// 	undo(): void; <---추가
//   }

class RemoteControlWithUndo {
  onCommands: Command[];
  offCommands: Command[];
  undoCommand: Command;

  constructor() {
    this.onCommands = new Array<Command>(7);
    this.offCommands = new Array<Command>(7);
    this.undoCommand = new NoCommand();
  }

  setCommand(slot: number, onCommand: Command, offCommand: Command) {
    this.onCommands[slot] = onCommand;
    this.offCommands[slot] = offCommand;
  }

  onButtonWasPushed(slot: number) {
    this.onCommands[slot]?.execute();
    this.undoCommand = this.onCommands[slot] ?? new NoCommand();
  }

  offButtonWasPushed(slot: number) {
    this.offCommands[slot]?.execute();
    this.undoCommand = this.offCommands[slot] ?? new NoCommand();
  }

  undoButtonWasPushed() {
    this.undoCommand?.undo();
  }
}

// 복합패턴
// 여러 패턴을 함께 사용해서 다양한 디자인 문제를 해결하는 방법

// 오리 시뮬레이션 게임

interface Quackable {
  quack(): void;
}

class MallardDuck implements Quackable {
  quack(): void {
    console.log("꽥꽥");
  }
}

class RedheadDuck implements Quackable {
  quack(): void {
    console.log("꽥꽥");
  }
}

class DuckCall implements Quackable {
  quack(): void {
    console.log("꽥꽥");
  }
}

class RubberDuck implements Quackable {
  quack(): void {
    console.log("삑삑");
  }
}

// 거위
class Goose {
  honk(): void {
    console.log("끽끽");
  }
}

// 거위용 어댑터
class GooseAdapter implements Quackable {
  goose: Goose;
  constructor(goose: Goose) {
    this.goose = goose;
  }
  quack(): void {
    this.goose.honk();
  }
}

// 꽥꽥소리를 낸 횟수를 세주는 기능
// 데코레이터 패턴을 사용해서 행동(꽥꽥)에 횟수를 세는 기능을 추가
class QuackCounter implements Quackable {
  duck: Quackable;
  static numberOfQuacks: number = 0;

  constructor(duck: Quackable) {
    this.duck = duck;
  }

  quack(): void {
    this.duck.quack();
    QuackCounter.numberOfQuacks++;
  }

  static getQuacks(): number {
    return QuackCounter.numberOfQuacks;
  }
}

class DuckSimulator {
  constructor() {
    this.simulate();
  }

  simulate() {
    const mallarDuck = new MallardDuck();
    const redheadDuck = new RedheadDuck();
    const duckCall = new DuckCall();
    const rubberDuck = new RubberDuck();
    const gooseDuck = new GooseAdapter(new Goose()); // 어댑터를 이용해서 오리의 탈을 쓴 거위

    console.log("오리  시뮬레이션 게임");

    this.simulate_(mallarDuck);
    this.simulate_(redheadDuck);
    this.simulate_(duckCall);
    this.simulate_(rubberDuck);
    this.simulate_(gooseDuck);
  }

  simulate_(duck: Quackable) {
    duck.quack();
  }
}

// const simulator = new DuckSimulator();

class DuckSimulatorWithCounter {
  constructor() {
    this.simulate();
  }

  simulate() {
    const mallarDuck = new QuackCounter(new MallardDuck());
    const redheadDuck = new QuackCounter(new RedheadDuck());
    const duckCall = new QuackCounter(new DuckCall());
    const rubberDuck = new QuackCounter(new RubberDuck());
    const gooseDuck = new GooseAdapter(new Goose());

    console.log("오리  시뮬레이션 게임 (+데코레이터)");

    this.simulate_(mallarDuck);
    this.simulate_(redheadDuck);
    this.simulate_(duckCall);
    this.simulate_(rubberDuck);
    this.simulate_(gooseDuck);

    console.log(`오리 소리 낸 횟수: ${QuackCounter.getQuacks()} 번`);
  }

  simulate_(duck: Quackable) {
    duck.quack();
  }
}

// const simulatorWithCounter = new DuckSimulatorWithCounter();

// 새로운 행동을 활용하려면 객체를 데코레이터로 감싸야함.
// 오리 객체를 생성하는 작업을 한군데에서 몰아서 하기

abstract class AbstractDuckFactory {
  abstract createMallardDuck(): Quackable;
  abstract createRedheadDuck(): Quackable;
  abstract createDuckCall(): Quackable;
  abstract createRubberDuck(): Quackable;
}

// 데코레이터가 없는 오리 팩토리
class DuckFactory extends AbstractDuckFactory {
  createMallardDuck(): Quackable {
    return new MallardDuck();
  }
  createRedheadDuck(): Quackable {
    return new RedheadDuck();
  }
  createDuckCall(): Quackable {
    return new DuckCall();
  }
  createRubberDuck(): Quackable {
    return new RubberDuck();
  }
}

// 카운트 기능이 있는 오리 팩토리
class CoutingDuckFactory extends AbstractDuckFactory {
  createMallardDuck(): Quackable {
    return new QuackCounter(new MallardDuck());
  }
  createRedheadDuck(): Quackable {
    return new QuackCounter(new RedheadDuck());
  }
  createDuckCall(): Quackable {
    return new QuackCounter(new DuckCall());
  }
  createRubberDuck(): Quackable {
    return new QuackCounter(new RubberDuck());
  }
}

class DuckSimulatorWithFactory {
  constructor() {
    const duckFactory = new DuckFactory();
    this.simulate(duckFactory);
  }

  simulate(duckFactory: AbstractDuckFactory) {
    const mallarDuck = duckFactory.createMallardDuck();
    const redheadDuck = duckFactory.createRedheadDuck();
    const duckCall = duckFactory.createDuckCall();
    const rubberDuck = duckFactory.createRubberDuck();
    const gooseDuck = new GooseAdapter(new Goose());

    console.log("오리 시뮬레이션 게임 (+추상 팩토리)");

    this.simulate_(mallarDuck);
    this.simulate_(redheadDuck);
    this.simulate_(duckCall);
    this.simulate_(rubberDuck);
    this.simulate_(gooseDuck);

    console.log(`오리 소리 낸 횟수: ${QuackCounter.getQuacks()} 번`);
  }

  simulate_(duck: Quackable) {
    duck.quack();
  }
}

// const simulatorWithFactory = new DuckSimulatorWithFactory();

// 오리무리 만들기
// 개게들로 구성된 컬렉션을 개별 객체와 같은 방식으로 다룰수 있게 해주는 컴포지트 패턴 사용

class Flock implements Quackable {
  quackers: Quackable[] = [];

  add(quacker: Quackable) {
    this.quackers.push(quacker);
  }

  quack(): void {
    for (const quacker of this.quackers) {
      quacker.quack();
    }
  }
}

class DuckSimulatorWithFlock {
  constructor() {
    const duckFactory = new CoutingDuckFactory();
    this.simulate(duckFactory);
  }

  simulate(duckFactory: AbstractDuckFactory) {
    const redheadDuck = duckFactory.createRedheadDuck();
    const duckCall = duckFactory.createDuckCall();
    const rubberDuck = duckFactory.createRubberDuck();
    const gooseDuck = new GooseAdapter(new Goose());

    console.log("오리 시뮬레이션 게임: 무리 (+컴포지트");

    const flockDucks = new Flock();

    flockDucks.add(redheadDuck);
    flockDucks.add(duckCall);
    flockDucks.add(rubberDuck);
    flockDucks.add(gooseDuck);

    const flockOfWallards = new Flock();

    const mallardOne = duckFactory.createMallardDuck();
    const mallardTwo = duckFactory.createMallardDuck();
    const mallardThree = duckFactory.createMallardDuck();
    const mallardFour = duckFactory.createMallardDuck();

    flockOfWallards.add(mallardOne);
    flockOfWallards.add(mallardTwo);
    flockOfWallards.add(mallardThree);
    flockOfWallards.add(mallardFour);

    flockDucks.add(flockOfWallards);

    console.log("오리 시뮬레이션 게임: 전체무리");
    this.simulate_(flockDucks);

    console.log("오리 시뮬레이션 게임: 물오리 무리");
    this.simulate_(flockOfWallards);

    console.log("오리가 소리 낸 횟수:", QuackCounter.getQuacks());
  }

  simulate_(duck: Quackable) {
    duck.quack();
  }
}

const simulatorWithFlock = new DuckSimulatorWithFlock();

// 개별 오리의 행동을 관찰
// 객체의 행동을 관흐

interface QuackObservable {
  registerObserver(observer: Observer): void;
  notifyObservers(): void;
}

interface QuackableObservable extends QuackObservable {
  quack(): void;
}

class Observable implements QuackObservable {
  observers: Observer[] = [];

  registerObserver(observer: Observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    this.observers.forEach((observer) => observer.update(this));
  }
}

class MallardDuckObservable implements QuackableObservable {
  observable: Observable;

  constructor() {
    this.observable = new Observable();
  }

  quack() {
    console.log("꽥꽥");
    this.notifyObservers();
  }

  registerObserver(observer: Observer) {
    this.observable.registerObserver(observer);
  }

  notifyObservers() {
    this.observable.notifyObservers();
  }
}

interface Observer {
  update(duck: QuackObservable): void;
}

class Quackologist implements Observer {
  update(duck: QuackObservable) {
    console.log("Quackologist: " + duck + " just quacked");
  }
}

const mallardDuck = new MallardDuckObservable();
const quackologist = new Quackologist();

mallardDuck.registerObserver(quackologist);

mallardDuck.quack();

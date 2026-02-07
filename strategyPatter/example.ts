//steractegyPatter 책 예시
//오리 클래스 만들기

class Duck {
    quack() {
        console.log("꽥꽥");
    }
    display(){
        console.log('오리 모양');
    }
}


class RedheadDuck extends Duck {
    display() {
        console.log('붉은머리 오리 모양');
    }
}

//--------------------------------------------------------
// 요구사항 추가: 오리가 날수도 있게 기능 추가 요청 + 고무 오리 추가, 모형 오리 추가

class Duck_1 {
    quack() {
        console.log("꽥꽥");
    }
    display(){
        console.log('오리 모양');
    }
    fly(){
        console.log('날기');
    }
}


class RedheadDuck_1 extends Duck_1 {
    display() {
        console.log('붉은머리 오리 모양');
    }
}

class RubberDuck_1 extends Duck_1 {
    display() {
        console.log('고무 오리 모양');
    }
    quack(){
        console.log('삑삑');
    }
    fly(){
        console.log('날 수 없음');
    }
}

class DecoyDuck_1 extends Duck_1 {
    display() {
        console.log('모형 오리 모양');
    }
    quack(){
        console.log('소리낼 수 없음');
    }
    fly(){
        console.log('날 수 없음');
    }
}

// 위의 코드의 문제점:
// 1. 날수 없는 오리나 소리내는 방식이 다른 오리를 추가시 항상 override 해야 함
// 2. 오리의 종류가 추가될수록 코드가 복잡해짐
// 3. 오리가 어떤 기능을 가지고 있는지 코드만으로 파악하기 어려움


//--------------------------------------------------------
// 해결방법1: quack 과 fly 메서드를 인터페이스로 분리

interface QuackBehavior {
    quack(): void;
}

interface FlyBehavior {
    fly(): void;
}

class Duck_2 {
    display(){
        console.log('오리 모양');
    }
}

class RedheadDuck_2 extends Duck_2 implements QuackBehavior, FlyBehavior {
    display() {
        console.log('붉은머리 오리 모양');
    }
    quack(): void {
        console.log('꽥꽥');
    }
    fly(): void {
        console.log('날기');
    }
}

class RubberDuck_2 extends Duck_2 implements QuackBehavior {
    display() {
        console.log('고무 오리 모양');
    }
    quack(){
        console.log('삑삑');
    }
}

class DecoyDuck_2 extends Duck_2 {
    display() {
        console.log('모형 오리 모양');
    }
}

// 위의 코드의 문제점:
// fly, quack 메서드를 재사용하지 않으므로 동작을 바꾸기 위해서는 모든 오리 클래스를 고쳐야함


//--------------------------------------------------------
// 해결방법2: fly, quack 메서드를 클래스로 분리
// 달라지는 부분(fly, quack)을 찾아서 나머지 코드에 영향을 주지 않게 '캡슐화'

interface QuackBehavior {
    quack(): void;
}

interface FlyBehavior {
    fly(): void;
}

// 구체적인 행동을 구현하는 클래스
class FlyWithWings implements FlyBehavior {
    fly(): void {
        console.log('오리 날아요~');
    }
}

class FlyNoWay implements FlyBehavior {
    fly(): void {
        console.log('날 수 없어요');
    }
}

class Quack implements QuackBehavior {
    quack(): void {
        console.log('꽥꽥!');
    }
}

class Spueak implements QuackBehavior {
    quack(): void {
        console.log('삑삑!');
    }
}

class MuteQuack implements QuackBehavior {
    quack(): void {
        console.log('무음');
    }
}

// Context 클래스
class Duck_3 {
    quackBehavior: QuackBehavior;
    flyBehavior: FlyBehavior;

    constructor(quackBehavior: QuackBehavior, flyBehavior: FlyBehavior) {
        this.quackBehavior = quackBehavior;
        this.flyBehavior = flyBehavior;
    }
    performQuack() {
        this.quackBehavior.quack();
    }
    performFly() {
        this.flyBehavior.fly();
    }
    display() {
        console.log('오리 모양');
    }
}


class RedheadDuck_3 extends Duck_3 {
    constructor() {
        super(new Quack(), new FlyWithWings());
    }
    display() {
        console.log('붉은머리 오리 모양');
    }
}

class RubberDuck_3 extends Duck_3 {
    constructor() {
        super(new Spueak(), new FlyNoWay());
    }
    display() {
        console.log('고무 오리 모양');
    }
}

class DecoyDuck_3 extends Duck_3 {
    constructor() {
        super(new MuteQuack(), new FlyNoWay());
    }
    display() {
        console.log('모형 오리 모양');
    }
}


const duck = new RubberDuck_3()
duck.performQuack();
duck.performFly();

// 출력:
// 삑삑!
// 날 수 없어요

// 위의 코드에서 동적으로 행동을 지정할수 있게 하려면 setter를 사용하면 된다.

class Duck_4 {
    quackBehavior: QuackBehavior;
    flyBehavior: FlyBehavior;

    constructor(quackBehavior: QuackBehavior, flyBehavior: FlyBehavior) {
        this.quackBehavior = quackBehavior;
        this.flyBehavior = flyBehavior;
    }
    setQuackBehavior(quackBehavior: QuackBehavior) {
        this.quackBehavior = quackBehavior;
    }
    setFlyBehavior(flyBehavior: FlyBehavior) {
        this.flyBehavior = flyBehavior;
    }
    performQuack() {
        this.quackBehavior.quack();
    }
    performFly() {
        this.flyBehavior.fly();
    }
    display() {
        console.log('오리 모양');
    }
}

class RubberDuck_4 extends Duck_4 {
    constructor() {
        super(new Spueak(), new FlyNoWay());
    }
    display() {
        console.log('고무 오리 모양');
    }
}

const duck_4 = new RubberDuck_4()
duck_4.performQuack()
duck_4.performFly()

duck_4.setQuackBehavior(new Quack())
duck_4.setFlyBehavior(new FlyWithWings())
duck_4.performQuack()
duck_4.performFly()

// 출력:
// 삑삑!
// 날 수 없어요
// 꽥꽥!
// 오리 날아요~


//--------------------------------------------------------
// 위의 예시를 함수로 구현한다면?

type QuackBehaviorFn = () => void;
type FlyBehaviorFn = () => void;

const flyBehaviors = {
  withWings: (): void => console.log('오리 날아요~'),
  noWay: (): void => console.log('날 수 없어요'),
} as const;

const quackBehaviors = {
  quack: (): void => console.log('꽥꽥!'),
  squeak: (): void => console.log('삑삑!'),
  mute: (): void => console.log('무음'),
} as const;

const createDuck = (
  name: string, 
  quackBehavior: QuackBehaviorFn, 
  flyBehavior: FlyBehaviorFn
) => ({
  name,
  quack: quackBehavior,
  fly: flyBehavior,
  display: () => console.log(`${name} 오리 모양`),
});

// 사용
const prettyDuck = createDuck('예쁜', quackBehaviors.quack, flyBehaviors.withWings);
prettyDuck.display();
prettyDuck.quack();
prettyDuck.fly();
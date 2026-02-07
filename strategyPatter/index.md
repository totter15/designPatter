# 전략 패턴

## 개념
전략패턴은 알고리즘군을 정의하고 캡슐화해서 각각의 알고리즘군을 수정해서 쓸수 있게 해준다.
전략 패턴을 사용하면 클라이언트로부터 알고리즘을 분리해서 독립적으로 변경이 가능하다.

행동을 사용하는 쪽(Context)과 실제 구현(Strategy)을 분리해서, 상황에 따라 다른 로직을 쉽게 바꿔 끼울 수 있게 하는 것이 핵심이다. 아래 3가지의 핵심구조를 가진다.

## 구조

**Strategy 인터페이스**

공통 동작 정의

**Concrete Strategy**

실제 알고리즘 구현

**Context**

전략을 주입받아 실행만 담당

```
Context
  └─ strategy.execute()

Strategy (interface)
  ├─ flyWithWing
  ├─ flyWithRocket
  └─ canNotFly

```

> "무엇을 할지"는 Context가 알고 "어떻게 할지"는 Strategy가 결정한다

## 예시(Class형)
결제 모듈 구현

1) 전략 인터페이스
```js
interface PaymentStrategy {
  pay(amount: number): void;
}
```

2) 전략 구현체
```js
class CardPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`카드 결제: ${amount}`);
  }
}

class KakaoPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`카카오페이 결제: ${amount}`);
  }
}

class NaverPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`네이버페이 결제: ${amount}`);
  }
}
```

3) Context
```js
class PaymentContext {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  execute(amount: number) {
    this.strategy.pay(amount);
  }
}
```

4) 사용
```js
const context = new PaymentContext(new CardPayment());
context.execute(10000);

context.setStrategy(new KakaoPayment());
context.execute(20000);
```

## 예시(함수형)
결제 모듈 구현

1) 전략 인터페이스
```js
type PaymentStrategy = (amount: number) => void;
```

2) 전략 구현체
```js
const paymentStractegy = {
    cardPay: (amount: number) => console.log(`카드 결제: ${amount}`);
    kakaoPay: (amount: number) => console.log(`카카오페이 결제: ${amount}`);
    naverPay: (amount: number) => console.log(`네이버페이 결제: ${amount}`);
}
```

3) Context
```js
const payment = (amount: number, strategy: PaymentStrategy) => strategy(amount);
```

4) 사용
```js
payment(1000, paymentStractegy.naverPay);
```

## 언제 사용하면 좋은가?

**✔ 조건문이 많아질 때**

if / switch 분기 폭증

**✔ 알고리즘이 자주 바뀔 때**

할인 정책

결제 방식

정렬 방식

인증 로직

**✔ 런타임에 동작을 바꿔야 할 때**

사용자 선택 기반

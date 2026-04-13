// function orderPizza(type: string) {
//   const pizza = new Pizza();

//   // ifelse문 부분이 바뀌는 부분 => 피자 종류가 바뀔때마다 코드를 계속 고쳐야함
//   if (type === "cheese") {
//     pizza = new CheesePizza();
//   } else if (type === "greek") {
//     pizza = new GreekPizza();
//   } else if (type === "pepperoni") {
//     pizza = new PepperoniPizza();
//   }

//   // 이부분은 바뀌지 않는 부분 => 피자를 굽고, 자르고, 포장하는 일은 항상 해야하는 일임. 이코드는 고칠일이 거의 없음
//   pizza.prepare();
//   pizza.bake();
//   pizza.cut();
//   pizza.box();

//   return pizza;
// }

// // 위의 코드에서 문제인 부분은 인스턴스를 만드는 구상 클래스를 선택하는 부분임
// // 객체생성 부분을 orderPizza에서 뽑아내서 피자객체를 만드는 일만 전담하는 객체에 넣기 => 팩토리 패턴
// // orderPizza(클라이언트) -> PizzaFactory
// // orderPizza는 더이상 어떤 피자를 만들지를 고민하지 않아도 됨

// // --------------------------------

// // 객체 생성 팩토리 만들기
// class SimplePizzaFactory {
//   createPizza(type: string) {
//     let pizza;
//     if (type === "cheese") {
//       pizza = new CheesePizza();
//     } else if (type === "pepperoni") {
//       pizza = new PepperoniPizza();
//     } else if (type === "clam") {
//       pizza = new ClamPizza();
//     } else if (type === "veggie") {
//       pizza = new VeggiePizza();
//     }
//     return pizza;
//   }
// }

// // 클라이언트 코드 수정
// class PizzaStore {
//   factory: SimplePizzaFactory;

//   constructor(factory: SimplePizzaFactory) {
//     this.factory = factory;
//   }

//   orderPizza(type: string) {
//     const pizza = this.factory.createPizza(type);
//     pizza.prepare();
//     pizza.bake();
//     pizza.cut();
//     pizza.box();

//     return pizza;
//   }
// }

// const pizzaStore = new PizzaStore(new SimplePizzaFactory());
// const pizza = pizzaStore.orderPizza("cheese");

// // --------------------------------

// // 다양한 팩토리 만들기
// // 피자의 각 지역마다 지점이 생기면서 지역의 특성에 맞춘 피자를 만들어야함

// // NYPizzaFactory => 뉴욕 스타일 피자를 만드는 팩토리
// const nyFactory = new NYPizzaFactory();
// const nyStore: PizzaStore = new PizzaStore(nyFactory);
// nyStore.orderPizza("Veggie");

// // ChicagoPizzaFactory => 시카고 스타일 피자를 만드는 팩토리
// const chicagoFactory = new ChicagoPizzaFactory();
// const chicagoStore: PizzaStore = new PizzaStore(chicagoFactory);
// chicagoStore.orderPizza("Pepperoni");

// --------------------------------

// 피자가게 프레임워크 만들기
// 피자를 만드는일 자체는 전부 PizzaStore 클래스에서 진행하면서 각지점의 스타을 살리기

abstract class PizzaStore_frameowrk {
  orderPizza(type: string) {
    // 팩토리 객체가 아닌 PizzaStore에 있는 createPizza 메서드를 호출하여 피자를 만듦
    // createPizza의 구현은 모름
    const pizza = this.createPizza(type);

    pizza.prepare();
    pizza.bake();
    pizza.cut();
    pizza.box();
    return pizza;
  }

  abstract createPizza(type: string): Pizza;
}

abstract class Pizza {
  name: string;
  dough: string;
  sauce: string;
  toppings: string[];

  constructor(name: string, dough: string, sauce: string, toppings: string[]) {
    this.name = name;
    this.dough = dough;
    this.sauce = sauce;
    this.toppings = toppings;
  }

  prepare() {
    console.log("준비 중:" + this.name);
    console.log("도우 만드는 중...");
    console.log("소스 뿌리는 중...");
    console.log("토핑 추가 중...");
    for (const topping of this.toppings) {
      console.log("  " + topping);
    }
  }
  bake() {
    console.log("175도에서 25분간 굽기");
  }
  cut() {
    console.log("피자를 사선으로 자르기");
  }
  box() {
    console.log("상자에 피자를 담기");
  }
  getName() {
    return this.name;
  }
}

class NYStyleCheesePizza extends Pizza {
  constructor() {
    super("뉴욕 스타일 소스와 치즈 피자", "씬 크런치 도우", "마리나라 소스", [
      "잘게 썬 레지아노 치즈",
    ]);
  }
}

class ChicagoStyleCheesePizza extends Pizza {
  constructor() {
    super(
      "시카고 스타일 소스와 치즈 피자",
      "아주 두꺼운 크러스트 도우",
      "플럼 토마토 소스",
      ["잘게 조각낸 모짜렐라 치즈"]
    );
  }

  cut() {
    console.log("피자를 네모난 모양으로 자르기");
  }
}

class NYStyleVeggiePizza extends Pizza {
  constructor() {
    super("뉴욕 스타일 야채 피자", "씬 크런치 도우", "마리나라 소스", [
      "잘게 썬 레지아노 치즈",
      "조각낸 야채",
    ]);
  }
}

class NYStylePepperoniPizza extends Pizza {
  constructor() {
    super("뉴욕 스타일 페퍼로니 피자", "씬 크런치 도우", "마리나라 소스", [
      "잘게 썬 레지아노 치즈",
      "조각낸 페퍼로니",
    ]);
  }
}

// 피자 스타일 서브클래스
// createPizza는 Pizza 객체를 return 하여, Pizza의 서브 클래스 가운데 어느 구상 클래스 객체의 인스턴스를 만들어 return 할지는
// 전적으로 PizzaStore_frameowrk의 서브클래스에 의해 결정됨
class NYPizzaStore extends PizzaStore_frameowrk {
  createPizza(type: string): Pizza {
    if (type === "cheese") {
      return new NYStyleCheesePizza();
    } else if (type === "veggie") {
      return new NYStyleVeggiePizza();
    } else if (type === "pepperoni") {
      return new NYStylePepperoniPizza();
    }
    throw new Error(`지원하지 않는 피자 타입입니다: ${type}`);
  }
}

class ChicagoPizzaStore extends PizzaStore_frameowrk {
  createPizza(type: string): Pizza {
    if (type === "cheese") {
      return new ChicagoStyleCheesePizza();
    }
    throw new Error(`지원하지 않는 피자 타입입니다: ${type}`);
  }
}

const nyPizzaStore = new NYPizzaStore();
nyPizzaStore.orderPizza("cheese");

const nyStore = new NYPizzaStore();
const chicagoStore = new ChicagoPizzaStore();

const pizza = nyStore.orderPizza("cheese");
console.log("에단이 주문한" + pizza.getName() + `\n`);

const pizza2 = chicagoStore.orderPizza("cheese");
console.log("조엘이 주문한" + pizza2.getName() + `\n`);

// 결과

// 준비 중:뉴욕 스타일 소스와 치즈 피자
// 도우 만드는 중...
// 소스 뿌리는 중...
// 토핑 추가 중...
//   잘게 썬 레지아노 치즈
// 175도에서 25분간 굽기
// 피자를 사선으로 자르기
// 상자에 피자를 담기
// 에단이 주문한뉴욕 스타일 소스와 치즈 피자

// 준비 중:시카고 스타일 소스와 치즈 피자
// 도우 만드는 중...
// 소스 뿌리는 중...
// 토핑 추가 중...
//   잘게 조각낸 모짜렐라 치즈
// 175도에서 25분간 굽기
// 피자를 네모난 모양으로 자르기
// 상자에 피자를 담기
// 조엘이 주문한시카고 스타일 소스와 치즈 피자]

// --------------------------------

// 팩토리 메소드 패턴
// 모든팩토리 패턴은 객체 생성을 캡슐화함.
// 팩토리 메소드 패턴은 서브클래스에서 어떤 클래스를 만들지 결정함으로써 객체 생성을 캡슐화함.

// - 생성자(Creator) 클래스 : PizzaStore(추상 생산자 클래스), NYPizzaStore(서브 클래스, 구상 생산자), ChicagoPizzaStore(서브 클래스, 구상 생산자)
// - 제품(Product) 클래스 : 팩토리는 제품을 생산(PizzaStore -> Pizza 생산)

// 생산자 클래스와 거기에 대응되는 제품 클래스는 병렬 계층구조
// - NyPizzaStore에는 뉴욕 스타일 피자를 만드는 모든 방법이 캡슐화
// - ChicagoPizzaStore에는 시카고 스타일 피자를 만드는 모든 방법이 캡슐화

// --------------------------------

// 팩토리 메소드 패턴의 정의
// 객체를 생성할때 필요한 인터페이스를 만든다.
// 어떤 클래스의 인스턴스를 만들지는 서브 클래스에서 결정.
// 팩토리 메소드 패턴을 사용하면 클래스 인스턴스 만드는 일을 서브클래스에서 맡기게 됨.
// 사용하는 서브 클래스에 따라 생산되는 객체 인스턴스가 결정

// --------------------------------

// 의존성 뒤집기 원칙
// 추상화된 것에 의존하게 만들고 구상 클래스에 의존하지 않게 만든다
// 고수준 구성요소가 저수준 구성요소에 의존하면 안되며, 항상 추상화에 의존하게 만들어야 함.
// PizzStore: 고수준 구성 요소
// 피자 클래스: 저수준 구성 요소

// 팩토리 메서드를 사용하지 않고 모든 피자에 대한 구상을 PizzaStore에서 하게되면, PizzaStore는 피자 클래스에 의존하게 됨.
// 팩토리 메서드를 적용하면 고수준 구성요소인 PizzaStore와 저수준 구성 요소인 피자 객체가 모두 추상 클래스인 Pizza에 의존하게 됨.

//PizzaStore -> Pizza(추상 클래스) <- NYPizzaStore, ChicagoPizzaStore

// 의존성 뒤집기 원칙을 지키는 방법
// - 변수에 구상 클래스의 레퍼런스를 저장하지 않는다.
// - 구상 클래스에서 유도된 클래스를 저장하지 않는다
// - 베이스 클래스에 이미 구현되어 있는 메소드를 오버라이딩 하지 않는다.

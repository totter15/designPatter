// 템플릿 메소드 패턴

// 커피와 홍차 만들기

// class Coffee {
// 	prepareRecipe() {
// 		this.boilWater();
// 		this.brewCoffeeGrinds();
// 		this.pourInCup();
// 		this.addSugarAndMilk();
// 	}

// 	boilWater() {
// 		console.log('물 끓이는 중');
// 	}

// 	brewCoffeeGrinds() {
// 		console.log('커피 우려내는 중');
// 	}

// 	pourInCup() {
// 		console.log('컵에 따르는 중');
// 	}

// 	addSugarAndMilk() {
// 		console.log('설탕과 우유를 추가하는 중');
// 	}
// }

// class Tea {
// 	prepareRecipe() {
// 		this.boilWater();
// 		this.steepTeaBag();
// 		this.pourInCup();
// 		this.addLemon();
// 	}

// 	boilWater() {
// 		console.log('물 끓이는 중');
// 	}

// 	steepTeaBag() {
// 		console.log('찻잎을 우려내는 중');
// 	}

// 	addLemon() {
// 		console.log('레몬을 추가하는 중');
// 	}

// 	pourInCup() {
// 		console.log('컵에 따르는 중');
// 	}
// }

// steepTeaBag() addLemon() 메소드는 홍차 전용 메소드

// --------------------------------------------------------

// Coffe 클래스와 Tea 클래스 추상화하기

// 커피와 홍차 제조법은 알고리즘이 똑같음.
// 01. 물을 끓인다.
// 02. 뜨거운 물을 사용해서 커피 또는 찻잎을 우려낸다.
// 03. 만들어진 음료를 컵에 따른다.
// 04. 각 음료에 맞는 첨가물을 추가한다.

// prepareReceipe() 메소드 추상화하기
abstract class CaffeineBeverage {
	prepareRecipe() {
		this.boilWater();
		this.brew();
		this.pourInCup();
		this.addCondiments();
	}

	// coffee와 tea에서 두 메소드를 다른 방식으로 처리하므로 추상 메소드로 선언
	abstract brew(): void;
	abstract addCondiments(): void;

	boilWater() {
		console.log('물 끓이는 중');
	}

	pourInCup() {
		console.log('컵에 따르는 중');
	}
}

class Tea extends CaffeineBeverage {
	brew(): void {
		console.log('찻잎을 우려내는 중');
	}

	addCondiments(): void {
		console.log('레몬을 추가하는 중');
	}
}

class Coffee extends CaffeineBeverage {
	brew(): void {
		console.log('필터로 커피를 우려내는 중');
	}

	addCondiments(): void {
		console.log('설탕과 우유를 추가하는 중');
	}
}

// --------------------------------------------------------

// 템플릿 메소드 패턴 알아보기
// 템플릿 메소드는 알고리즘의 각 단계를 정의하며, 서브클래스에서 일부 단계를 구현할 수 있도록 유도

// 템플릿 메소드 패턴의 장점
// - CaffeineBeverage 클래스에서 작업을 처리함. 알고리즘을 독점
// - 서브클래스에서 코드 재사용 가능.
// - 알고리즘이 한군데에 모여 있으므로 한 부분만 고치면 됨.
// - 다른 음료도 쉽게 추가할 수 있는 프레임워크 제공.
// - CaffeineBeverage 클래스에 알고리즘 지식이 집중되어 있으며 일부 구현만 서브클래스에 의존.

// 템플릿 메소드 패턴의 정의
// 알고리즘의 골격을 정의. 알고리즘의 일부 단계를 서브클래스에서 구현할 수 있으며,
// 알고리즘의 구조는 그대로 유지하면서 알고리즘의 특성단계를 서브클래스에서 재정의 가능.

abstract class AbstractClass {
	templateMethod() {
		this.primitiveOperation1();
		this.primitiveOperation2();
		this.concreteOperation();
		this.hook();
	}

	abstract primitiveOperation1(): void;
	abstract primitiveOperation2(): void;

	// 구상 단계는 추상 클래스 내에서 정의
	concreteOperation(): void {
		console.log('concreteOperation');
	}

	// 서브클래스에서 오버라이드할 수 있는 메서드
	hook(): void {}
}

class ConcreateClass extends AbstractClass {
	primitiveOperation1() {
		console.log('primitiveOperation1');
	}

	primitiveOperation2() {
		console.log('primitiveOperation2');
	}
}

// 템플릿 메소드 속 후크

// 후크(hook)는 추상 클래스에서 선언되지만 기본적인 내용만 구현되어 있거나 아무 코드도 들어있지 않은 메소드.
// 서브클래스는 다양한 위치에서 알고리즘에 끼어들 수있음.

abstract class CaffeineBeverageWithHook {
	prepareRecipe() {
		this.boilWater();
		this.brew();
		this.pourInCup();
		if (this.customerWantsCondiments()) {
			this.addCondiments();
		}
	}

	abstract brew(): void;
	abstract addCondiments(): void;

	boilWater() {
		console.log('물 끓이는 중');
	}

	pourInCup() {
		console.log('컵에 따르는 중');
	}

	// 이 메소드는 서브클래스에서 필요할 때 오버라이드할 수 있는 메소드이므로 hook임
	customerWantsCondiments(): boolean {
		return true;
	}
}

class CoffeWithHook extends CaffeineBeverageWithHook {
	brew(): void {
		console.log('필터로 커피를 우려내는 중');
	}

	addCondiments(): void {
		console.log('설탕과 우유를 추가하는 중');
	}

	customerWantsCondiments(): boolean {
		const answer = this.getUserInput();

		if (answer) {
			return true;
		} else {
			return false;
		}
	}

	getUserInput() {
		let answer = null;

		answer = window.confirm('커피에 우유와 설탕을 넣을까요?');
		return answer;
	}
}

// 서브클래스가 알고리즘의 특정 단계를 제공해야한다면 추상 메서드 사용.
// 알고리즘의 특정 단계가 선택적으로 적용된다면 후크 사용.

// --------------------------------------------------------

// 할리우드 원칙
// 먼저 연락하지 마세요. 저희가 연락 드리겠습니다.

// 할리우드 원칙을 활용하면 의존성 부패를 방지할 수 있음.
// 의존성부패: 고수준 구성요소 -> 저수준 구성요소에 의존 -> 고수준 구성요소에 의존등 의존성이 복잡하게 꼬여있는 상황
// 할리우드 원칙을 사용하면 저수준 구성요소가 시스템에 접속할 수는 있지만 언제, 어떻게 그 구성요소를 사용할지는 고수준 구성요소가 결정함.

// CaffeinBeverage는 고수준 구성요소. 음료를 만드는 방법에 해당하는 알고리즘을 장악하고 있고, 메소드 구현이 필요한 상황에만 서브 클래스를 불러냄.
// 서브 클래스는 메소드 구현을 제공하는 용도로만 쓰임. **호출 당하기 전**까지는 추상클래스를 직접 호출하지 않음

// 템플릿 메소드 패턴 & 전략 패턴 & 팩토리 메소드 패턴

// 템플릿 메소드 패턴 : 알고리즘의 어떤 단계를 구현하는 방법을 서브클래스에서 결정
// 전략 패턴 : 바꿔 쓸 수 있는 행동을 캡슐화하고, 어떤 행동을 사용할지는 서브클래스에 맡김.
// 팩토리 메소드 패턴 : 구상 클래스의 인스턴스 생성을 서브클래스에서 결정

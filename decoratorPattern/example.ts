// 커피 주문 시스템 만들기
abstract class Beverage_old {
	description: string = '제목 없음';

	getDescription(): string {
		return this.description;
	}
	abstract cost(): number;
}

class Espresso_old extends Beverage_old {
	description = '에스프레소';

	cost(): number {
		return 1.99;
	}
}

class HouseBlend_old extends Beverage_old {
	description = '하우스 블렌드 커피';

	cost(): number {
		return 0.89;
	}
}

class EspressoWithWhip extends Beverage_old {
	description = '에스프레소 휘핑크림';

	cost(): number {
		return 2.19;
	}
}

class HouseBlendWithWhip extends Beverage_old {
	description = '하우스 블렌드 커피 휘핑크림';

	cost(): number {
		return 1.09;
	}
}

// 커피 + 서브주문(우유/두유/s모카등을 추가) class를 계속 생성
// 문제: 커피 종류가 추가될수록 클래스가 계속 추가되어 코드가 복잡해짐

// ------------------------------------------------------------

// 인스턴스 변수와 슈퍼클래스 상속을 사용해서 첨가물을 관리하는 방식으로 변경

abstract class Beverage_02 {
	description: string = '제목 없음';
	milk: boolean = false;
	soy: boolean = false;
	mocha: boolean = false;
	whip: boolean = false;

	getDescription(): string {
		return this.description;
	}
	cost(): number {
		let cost = 0;
		if (this.hasMilk()) {
			cost += 0.15;
		}
		if (this.hasSoy()) {
			cost += 0.1;
		}
		if (this.hasMocha()) {
			cost += 0.2;
		}
		if (this.hasWhip()) {
			cost += 0.1;
		}
		return cost;
	}

	hasMilk(): boolean {
		return this.milk;
	}
	hasSoy(): boolean {
		return this.soy;
	}
	hasMocha(): boolean {
		return this.mocha;
	}
	hasWhip(): boolean {
		return this.whip;
	}
	setMilk(milk: boolean) {
		this.milk = milk;
	}
	setSoy(soy: boolean) {
		this.soy = soy;
	}
	setMocha(mocha: boolean) {
		this.mocha = mocha;
	}
	setWhip(whip: boolean) {
		this.whip = whip;
	}
}

class Espresso_02 extends Beverage_02 {
	description = '에스프레소';

	cost(): number {
		return super.cost() + 1.99;
	}
}

class HouseBlend_02 extends Beverage_02 {
	description = '하우스 블렌드 커피';

	cost(): number {
		return super.cost() + 0.89;
	}
}

const espresso_02 = new Espresso_02();
espresso_02.setMilk(true);
espresso_02.setWhip(true);
console.log(espresso_02.getDescription() + ' $' + espresso_02.cost());

const houseBlend_02 = new HouseBlend_02();
houseBlend_02.setWhip(true);
console.log(houseBlend_02.getDescription() + ' $' + houseBlend_02.cost());

//---------------------------------------------------------

//추상 구성요소
abstract class Beverage {
	description: string = '제목 없음';

	getDescription(): string {
		return this.description;
	}
	abstract cost(): number;
}

// 첨가물 추상 클래스
abstract class CondimentDecorator extends Beverage {
	beverage: Beverage;

	constructor(beverage: Beverage) {
		super();
		this.beverage = beverage;
	}

	abstract getDescription(): string;
	abstract cost(): number;
}

// 음료코드(구상 구성요소)
class Espresso extends Beverage {
	description = '에스프레소';

	cost(): number {
		return 1.99;
	}
}

class HouseBlend extends Beverage {
	description = '하우스 블렌드 커피';

	cost(): number {
		return 0.89;
	}
}

//첨가물 코드(데코레이터)
class Mocha extends CondimentDecorator {
	constructor(beverage: Beverage) {
		super(beverage);
	}

	getDescription(): string {
		return this.beverage.getDescription() + ', 모카';
	}

	cost(): number {
		return Math.round((this.beverage.cost() + 0.2) * 100) / 100;
	}
}

class Whip extends CondimentDecorator {
	constructor(beverage: Beverage) {
		super(beverage);
	}

	getDescription(): string {
		return this.beverage.getDescription() + ', 휘핑크림';
	}

	cost(): number {
		return Math.round((this.beverage.cost() + 0.1) * 100) / 100;
	}
}

class Soy extends CondimentDecorator {
	constructor(beverage: Beverage) {
		super(beverage);
	}

	getDescription(): string {
		return this.beverage.getDescription() + ', 두유';
	}

	cost(): number {
		return Math.round((this.beverage.cost() + 0.15) * 100) / 100;
	}
}

const beverage = new Espresso();
console.log(beverage.getDescription() + ' $' + beverage.cost());

let beverage2 = new HouseBlend();
beverage2 = new Mocha(beverage2);
console.log(beverage2.getDescription() + ' $' + beverage2.cost());
beverage2 = new Mocha(beverage2);
console.log(beverage2.getDescription() + ' $' + beverage2.cost());
beverage2 = new Whip(beverage2);
console.log(beverage2.getDescription() + ' $' + beverage2.cost());

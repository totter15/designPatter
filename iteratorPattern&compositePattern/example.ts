// 컬렉션 관리
// 반복자 패턴과 컴포지트 패턴

// 요구사항: 아침엔 팬케이크 하우스 메뉴, 점심에는 객체마을 메뉴 사용

class MenuItem {
	name: string;
	description: string;
	vegetarian: boolean;
	price: number;

	constructor(name: string, description: string, vegetarian: boolean, price: number) {
		this.name = name;
		this.description = description;
		this.vegetarian = vegetarian;
		this.price = price;
	}

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	isVegetarian(): boolean {
		return this.vegetarian;
	}

	getPrice(): number {
		return this.price;
	}
}

class PancakeHouseMenu {
	menuItems: Map<number, MenuItem> = new Map<number, MenuItem>();
	count = 0;

	constructor() {
		this.addItem('K&B 팬케이크 세트', '스크램블드 에그와 토스트가 곁들여진 팬케이크', false, 2.99);
		this.addItem('레귤러 팬케이크 세트', '달걀 후라이와 소시지가 곁들여진 팬케이크', false, 3.49);
		this.addItem('브레드 팬케이크', '취향에 따라 브레드를 선택할 수 있는 팬케이크', true, 3.59);
	}

	addItem(name: string, description: string, vegetarian: boolean, price: number) {
		this.menuItems.set(this.count, new MenuItem(name, description, vegetarian, price));
		this.count++;
	}

	getMenuItems(): Map<number, MenuItem> {
		return this.menuItems;
	}

	//....기타 메소드들
}

class DinerMenu {
	static readonly MAX_ITEMS = 6;
	numberOfItems = 0;
	menuItems: MenuItem[];

	constructor() {
		this.menuItems = new Array<MenuItem>(DinerMenu.MAX_ITEMS);

		this.addItem('채식주의자용 채식주의자용 메뉴', '채식주의자용 메뉴', true, 3.99);
		this.addItem('채식주의자용 채식주의자용 메뉴', '채식주의자용 메뉴', true, 3.99);
	}

	addItem(name: string, description: string, vegetarian: boolean, price: number) {
		const menuItem = new MenuItem(name, description, vegetarian, price);
		if (this.numberOfItems >= DinerMenu.MAX_ITEMS) {
			console.log('죄송합니다, 메뉴가 꽉 찼습니다. 더 이상 추가할 수 없습니다.');
		} else {
			this.menuItems[this.numberOfItems] = menuItem;
			this.numberOfItems++;
		}
	}

	getMenuItems(): MenuItem[] {
		return this.menuItems;
	}

	//....기타 메소드들
}

// 자바 종업원의 자격 요건
// printMenu: 메뉴에 있는 모든 항목 출력
// printBreakfastMenu: 아침 식사 항목만 출력
// printLunchMenu: 점심 식사 항목만 출력
// printVegetarianMenu: 채식주의자용 메뉴 출력
// isItemVegetarian: 항목이 채식주의자용인지 확인

// 1차시도

const pancakeHouseMenu = new PancakeHouseMenu();
const breakfastItems = pancakeHouseMenu.getMenuItems();

const dinerMenu = new DinerMenu();
const lunchItems = dinerMenu.getMenuItems();

console.log('=== 아침 메뉴 ===');
for (let i = 0; i < breakfastItems.size; i++) {
	console.log(breakfastItems.get(i)?.getName());
	console.log(breakfastItems.get(i)?.getDescription());
	console.log(breakfastItems.get(i)?.getPrice());
}

console.log('\n=== 점심 메뉴 ===');
for (let i = 0; i < lunchItems.length; i++) {
	console.log(lunchItems[i]?.getName());
	console.log(lunchItems[i]?.getDescription());
	console.log(lunchItems[i]?.getPrice());
}

// 위코드의 문제점: 두 메소드의 리턴 형식이 다르기에 각 항목에서 반복 작업을 수행하려면 2개의 순환문을 써야힘

// 반복화를 캡슐화 하기
interface Iterator<T> {
	hasNext(): boolean; //반복 작업을 적용할 대상이 있는지 확인
	next(): T; // 다음 객체를 return
}

// 이 인터페이스가 있으면 배열, 리스트, 해시테이블등 모든 종류의 객체 컬렉션에 반복자를 구현할 수 있음.

class DinerMenuIterator implements Iterator<MenuItem> {
	items: MenuItem[];
	position = 0;

	constructor(items: MenuItem[]) {
		this.items = items;
	}

	next(): MenuItem {
		const menuItem = this.items[this.position];
		this.position++;
		return menuItem!;
	}

	hasNext(): boolean {
		if (this.position >= this.items.length || this.items[this.position] === undefined) {
			return false;
		} else {
			return true;
		}
	}
}

class PancakeHouseMenuIterator implements Iterator<MenuItem> {
	items: Map<number, MenuItem>;
	position = 0;

	constructor(items: Map<number, MenuItem>) {
		this.items = items;
	}

	hasNext(): boolean {
		if (this.position >= this.items.size || this.items.get(this.position) === undefined) {
			return false;
		} else {
			return true;
		}
	}

	next(): MenuItem {
		const menuItem = this.items.get(this.position);
		this.position++;
		return menuItem!;
	}
}

class DinerMenu_ {
	static readonly MAX_ITEMS = 6;
	numberOfItems = 0;
	menuItems: MenuItem[];

	constructor() {
		this.menuItems = new Array<MenuItem>(DinerMenu.MAX_ITEMS);

		this.addItem('채식주의자용 BLT', '통밀 위에 베이컨, 상추, 토마토를 얹은 메뉴', true, 3.99);
		this.addItem('BLT', '통밀 위에 베이컨, 상추, 토마토를 얹은 메뉴', false, 2.99);
		this.addItem('오늘의 스프', '감자 조림과 토마토 샐러드', false, 3.29);
		this.addItem('핫도그', '핫도그와 감자튀김', false, 3.05);
	}

	addItem(name: string, description: string, vegetarian: boolean, price: number) {
		const menuItem = new MenuItem(name, description, vegetarian, price);
		if (this.numberOfItems >= DinerMenu.MAX_ITEMS) {
			console.log('죄송합니다, 메뉴가 꽉 찼습니다. 더 이상 추가할 수 없습니다.');
		} else {
			this.menuItems[this.numberOfItems] = menuItem;
			this.numberOfItems++;
		}
	}

	// getMenuItems(): MenuItem[] {
	// 	return this.menuItems;
	// }

	createIterator(): Iterator<MenuItem> {
		return new DinerMenuIterator(this.menuItems);
	}
}

class PancakeHouseMenu_ {
	menuItems: Map<number, MenuItem> = new Map<number, MenuItem>();
	count = 0;

	constructor() {
		this.addItem('K&B 팬케이크 세트', '스크램블드 에그와 토스트가 곁들여진 팬케이크', false, 2.99);
		this.addItem('레귤러 팬케이크 세트', '달걀 후라이와 소시지가 곁들여진 팬케이크', false, 3.49);
		this.addItem('브레드 팬케이크', '취향에 따라 브레드를 선택할 수 있는 팬케이크', true, 3.59);
	}

	addItem(name: string, description: string, vegetarian: boolean, price: number) {
		this.menuItems.set(this.count, new MenuItem(name, description, vegetarian, price));
		this.count++;
	}

	createIterator(): Iterator<MenuItem> {
		return new PancakeHouseMenuIterator(this.menuItems);
	}

	//....기타 메소드들
}

class Waitress {
	pancakeHouseMenu: Menu;
	dinerMenu: Menu;

	constructor(pancakeHouseMenu: Menu, dinerMenu: Menu) {
		this.pancakeHouseMenu = pancakeHouseMenu;
		this.dinerMenu = dinerMenu;
	}

	printMenu() {
		const pancakeHouseMenuIterator = this.pancakeHouseMenu.createIterator();
		const dinerMenuIterator = this.dinerMenu.createIterator();

		console.log('=== 아침 메뉴 ===');
		this.printMenu_(pancakeHouseMenuIterator);

		console.log('=== 점심 메뉴 ===');
		this.printMenu_(dinerMenuIterator);
	}

	printMenu_(iterator: Iterator<MenuItem>) {
		while (iterator.hasNext()) {
			const menuItem = iterator.next();
			console.log(menuItem.getName(), ', ');
			console.log(menuItem.getPrice(), ' -- ');
			console.log(menuItem.getDescription());
		}
	}
}

const pancakeHouseMenu_ = new PancakeHouseMenu_();
const dinerMenu_ = new DinerMenu_();
const waitress = new Waitress(pancakeHouseMenu_, dinerMenu_);
waitress.printMenu();

// 반복자 패턴의 특징
// 메뉴 구현법이 캡슐화됨. 종업원은 매뉴 항목의 컬렉션을 어떤식으로 저장하는지 알필요 없음.
// 반복자만 구현한다면 어떤 컬렉션이든 1개의 순환문으로 처리 가능
// 종업원은 iterator 인터페이스만 알면됨.

// -------------------------------------------------------------

// 인터페이스 개선

// Java에는 Iterable 기본 인터페이스가 있음

interface Menu {
	createIterator(): Iterator<MenuItem>;
}

// PancakeHoutMenu -----> Menu <--- Waitress ----> Iterator<MenuItem> <--- DinerMenuIterator
// DinerMenu ----------->                                             <--- PancakeHouseMenuIterator

// 반복자 패턴
// 컬렌션의 구현방법을 노출하지 않으면서 집합체 내의 모든 항목에 접근하는 방법을 제공
// 이 패턴을 사용하면 집합체 내에서 어떤 식으로 일이 처리되는지 전혀 모르는 상태에서 그 안에 들어있는 모든 항목을 대상으로 반복 작업을 수행할 수 있음.
// 모든 항목에 일일이 접근하는 작업을 컬렉션 객체가 아니라 반복자 객체가 맡게됨.
// 집합체의 인터페이스와 구현이 간단해지고 반복작업에는 손을 떼고 원래 자신이 할일(객체 컬렉션 관리)에만 전념가능

// 반복자 패턴의 구조
// 이미지 추가 필요

// 단일 역할 원칙
// 어떤 클래스가 바뀌는 이유는 하나뿐이어야 한다
// 집합체 관리외에 반복자 메소드도 처리하면 2가지 이유로 그 클래스가 바뀔수 있음.
// 1) 컬렉션이 어떤 이유로 바뀔때 클래스가 변경
// 2) 반복자 관련 기능이 바뀔때 클래스가 변경

// 응집도
// 한클래스 또는 모듈이 특정 목적이나 역할을 얼마나 일관되게 지원하는지를 나타내는 척도
// 어떤 모듈이나 클래스의 응집도가 높다는 것은 서로 연관된 기능이 묶여있다는것.

// TODO: 자바스크립트 iterator 기능과 연관이 있는지?

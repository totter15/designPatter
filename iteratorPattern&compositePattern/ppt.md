# 반복자 패턴(IteratorPattern) & 컴포지트 패턴(CompositePattern)

---

# 반복자 패턴이란?

- 컬렌션의 구현방법을 노출하지 않으면서 집합체 내의 모든 항목에 접근하는 방법을 제공

**특징**

- 이 패턴을 사용하면 집합체 내에서 어떤 식으로 일이 처리되는지 전혀 모르는 상태에서 그 안에 들어있는 모든 항목을 대상으로 반복 작업을 수행할 수 있음.
- 모든 항목에 일일이 접근하는 작업을 컬렉션 객체가 아니라 반복자 객체가 맡게됨.
- 집합체의 인터페이스와 구현이 간단해지고 반복작업에는 손을 떼고 원래 자신이 할일(객체 컬렉션 관리)에만 전념가능

---

# 책 예시 살펴보기

**요구사항**

리스트를 다르게 다루고 있는 팬케이크하우스, 객체마을 메뉴를 한번에 조회가 되어야함

```ts
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

// 팬케이크 하우스 메뉴
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

// 객체마을 메뉴
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
```

---

```ts
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
```

**위 코드의 문제**

두 메소드의 리턴 형식이 다르기에 각 항목에서 반복 작업을 수행하려면 2개의 순환문을 써야힘

---

# 반복화를 캡슐화

```ts
interface Iterator<T> {
	hasNext(): boolean; //반복 작업을 적용할 대상이 있는지 확인
	next(): T; // 다음 객체를 return
}
```

이 인터페이스가 있으면 배열, 리스트, 해시테이블등 모든 종류의 객체 컬렉션에 반복자를 구현할 수 있음.

```ts
class DinerMenuIterator implements Iterator<MenuItem> {
	items: MenuItem[];
	position = 0;

    constructor(items: MenuItem[]) {
		this.items = items;
	}

	next(): MenuItem {...}
	hasNext(): boolean {...}
}

class PancakeHouseMenuIterator implements Iterator<MenuItem> {
	items: Map<number, MenuItem>;
	position = 0;

	constructor(items: Map<number, MenuItem>) {
		this.items = items;
	}

	hasNext(): boolean {...}
	next(): MenuItem {...}
}

class DinerMenu {
    ...

	createIterator(): Iterator<MenuItem> {
		return new DinerMenuIterator(this.menuItems);
	}
}

class PancakeHouseMenu_ {
	...

	createIterator(): Iterator<MenuItem> {
		return new PancakeHouseMenuIterator(this.menuItems);
	}
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

	printMenu_(iterator: Iterator<MenuItem>) {...}
}
```

---

**반복자 패턴의 특징**

- 메뉴 구현법이 캡슐화됨. 종업원은 매뉴 항목의 컬렉션을 어떤식으로 저장하는지 알필요 없음.
- 반복자만 구현한다면 어떤 컬렉션이든 1개의 순환문으로 처리 가능
- 종업원은 iterator 인터페이스만 알면됨.

**단일 역할 원칙**

- 어떤 클래스가 바뀌는 이유는 하나뿐이어야 한다
- 집합체 관리외에 반복자 메소드도 처리하면 2가지 이유로 그 클래스가 바뀔수 있음.
  1. 컬렉션이 어떤 이유로 바뀔때 클래스가 변경
  2. 반복자 관련 기능이 바뀔때 클래스가 변경

반복자 패턴을 사용하면 단일 역할 원칙을 지키게 됨

---

# Javascript에서 Iterator

**Interator**
이터레이터는 데이터를 하나씩 순회하기 위한 표준 인터페이스

**기본구조**

```ts
{
  value: any,
  done: boolean
}
```

**코드 예시**

```ts
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

- Symbol.iterator를 가지고 있으면 → iterable
- next()를 호출해서 값을 하나씩 꺼냄
- 내부 상태를 기억함 (몇 번째까지 읽었는지)

---

# 컴포지트 패턴

객체를 트리구조로 구성해서 부분-전체 계층구조를 구현
컴포지트 패턴을 사용하면 클라이언트에서 개별 객체와 복합 객체를 똑같은 방법으로 다룰 수 있음

**복합객체(composite)의 구성요소** - Leaf: 자식이 없는 요소 - Composite: 자식이 있는 구성요소의 행동 정의, 자식 구성요소 저장

```ts
interface Component {
	operation(): void;
	add(component: Component): void;
	remove(component: Component): void;
	getChild(index: number): Component;
}

class Leaf implements Component {
	operation(): void {
		console.log('Leaf operation');
	}
	add(component: Component): void {
		console.log('Leaf cannot add component');
	}
	remove(component: Component): void {
		console.log('Leaf cannot remove component');
	}
	getChild(index: number): Component {
		throw new Error('Leaf cannot get child');
	}
}

class Composite implements Component {
	operation(): void {
		console.log('Composite operation');
	}
	add(component: Component): void {
		console.log('Composite can add component');
	}
	remove(component: Component): void {
		console.log('Composite can remove component');
	}
	getChild(index: number): Component {
		console.log('Composite can get child');
		return new Leaf();
	}
}
```

---

# 컴포지트 패턴으로 메뉴 디자인하기

```ts
abstract class MenuComponent implements MenuComponent {
	// 메뉴 아이템 추가/제거/가져오기
	add(component: MenuComponent): void {
		throw new Error('Method not implemented.');
	}
	remove(component: MenuComponent): void {
		throw new Error('Method not implemented.');
	}
	getChild(index: number): MenuComponent {
		throw new Error('Method not implemented.');
	}

	// MenuItem에서 작업처리
	getName(): string {
		throw new Error('Method not implemented.');
	}
	getDescription(): string {
		throw new Error('Method not implemented.');
	}
	getPrice(): number {
		throw new Error('Method not implemented.');
	}
	isVegetarian(): boolean {
		throw new Error('Method not implemented.');
	}
	print(): void {
		throw new Error('Method not implemented.');
	}
}

class MenuItem_ extends MenuComponent {
	name: string;
	description: string;
	vegetarian: boolean;
	price: number;

	constructor(name: string, description: string, vegetarian: boolean, price: number) {
		super();
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
	getPrice(): number {
		return this.price;
	}
	isVegetarian(): boolean {
		return this.vegetarian;
	}
	print(): void {
		console.log(
			this.getName(),
			', ',
			this.isVegetarian() ? '(v)' : '',
			this.getPrice(),
			' -- ',
			this.getDescription(),
		);
	}
}

class Menu_ extends MenuComponent {
	menuComponents: MenuComponent[] = [];
	name: string;
	description: string;

	constructor(name: string, description: string) {
		super();
		this.name = name;
		this.description = description;
	}

	add(component: MenuComponent): void {
		this.menuComponents.push(component);
	}
	remove(component: MenuComponent): void {
		this.menuComponents = this.menuComponents.filter((c) => c !== component);
	}
	getChild(index: number): MenuComponent {
		return this.menuComponents[index]!;
	}
	getName(): string {
		return this.name;
	}
	getDescription(): string {
		return this.description;
	}
	print(): void {
		console.log(this.getName(), ', ', this.getDescription());
		console.log('--------------------------------');

		this.menuComponents.forEach((component) => {
			component.print();
		});
	}
}

class Waitress_ {
	allMenus: MenuComponent;

	constructor(allMenus: MenuComponent) {
		this.allMenus = allMenus;
	}

	printMenu() {
		this.allMenus.print();
	}
}

const pancakeHouseMenu_ = new Menu_('팬케이크 하우스 메뉴', '아침 메뉴');
const dinerMenu_ = new Menu_('객체마을 식당 메뉴', '점심 메뉴');
const cafeMenu_ = new Menu_('카페 메뉴', '저녁 메뉴');
const dessertMenu = new Menu_('디저트 메뉴', '디저트를 즐겨 보세요');

const allMenus = new Menu_('전체 메뉴', '전체 메뉴');

allMenus.add(pancakeHouseMenu_ as MenuComponent);
allMenus.add(dinerMenu_ as MenuComponent);
allMenus.add(cafeMenu_ as MenuComponent);

// 메뉴 항목을 추가하는 부분

dinerMenu_.add(
	new MenuItem_('채식주의자용 BLT', '통밀 위에 베이컨, 상추, 토마토를 얹은 메뉴', true, 3.99),
);
dinerMenu_.add(dessertMenu);
dessertMenu.add(new MenuItem_('애플 파이', '애플 파이', true, 1.59));

const waitress_ = new Waitress_(allMenus);
waitress_.printMenu();

// 전체 메뉴 ,  전체 메뉴
// --------------------------------
// 팬케이크 하우스 메뉴 ,  아침 메뉴
// --------------------------------
// 객체마을 식당 메뉴 ,  점심 메뉴
// --------------------------------
// 채식주의자용 BLT ,  (v) 3.99  --  통밀 위에 베이컨, 상추, 토마토를 얹은 메뉴
// 디저트 메뉴 ,  디저트를 즐겨 보세요
// --------------------------------
// 애플 파이 ,  (v) 1.59  --  애플 파이
// 카페 메뉴 ,  저녁 메뉴
// --------------------------------
```

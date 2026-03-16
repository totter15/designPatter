// 고전적인 싱글턴 패턴 구현법

class Singleton {
	// 여기에 하나뿐인 인스턴스가 저장됨
	private static uniqueInstance: Singleton;

	// 기타 인스턴스 변수

	// private 생성자를 통해 외부에서 인스턴스 생성 불가능
	private constructor() {}

	public static getInstance(): Singleton {
		if (!this.uniqueInstance) {
			this.uniqueInstance = new Singleton();
		}
		return this.uniqueInstance;
	}

	// 기타 메소드
}

//--------------------------------

// 초콜릿 보일러 코드 살펴보기
class ChocolateBoiler {
	private empty: boolean;
	private boiled: boolean;

	private constructor() {
		this.empty = true;
		this.boiled = false;
	}

	public fill(): void {
		if (this.isEmpty()) {
			this.empty = false;
			this.boiled = false;
			// 보일러에 우유와 초콜릿을 혼합한 재료를 넣음
		}
	}

	public drain(): void {
		if (!this.isEmpty() && this.isBoiled()) {
			// 끓인 재료를 다음 단계로 넘김
			this.empty = true;
		}
	}

	public boil(): void {
		if (!this.isEmpty() && !this.isBoiled()) {
			// 재료를 끓임
			this.boiled = true;
		}
	}

	public isEmpty(): boolean {
		return this.empty;
	}

	public isBoiled(): boolean {
		return this.boiled;
	}
}

// 위의 코드를 싱글턴으로 변경해보기
class ChocolateBoiler_Singleton {
	private static uniqueInstance: ChocolateBoiler_Singleton;
	private empty: boolean;
	private boiled: boolean;

	private constructor() {
		this.empty = true;
		this.boiled = false;
	}

	public static getInstance(): ChocolateBoiler_Singleton {
		if (!this.uniqueInstance) {
			this.uniqueInstance = new ChocolateBoiler_Singleton();
		}
		return this.uniqueInstance;
	}

	public fill(): void {
		if (this.isEmpty()) {
			this.empty = false;
			this.boiled = false;
		}
	}

	public drain(): void {
		if (!this.isEmpty() && this.isBoiled()) {
			this.empty = true;
		}
	}

	public boil(): void {
		if (!this.isEmpty() && !this.isBoiled()) {
			this.boiled = true;
		}
	}

	public isEmpty(): boolean {
		return this.empty;
	}

	public isBoiled(): boolean {
		return this.boiled;
	}
}

//--------------------------------

// 싱글턴 패턴의 정의
// 클래스 인스턴스를 하나만 만들고, 그 인스턴스로의 전역 접근을 제공

//- 클래스에서 하나뿐인 인스턴스를 관리하도록 만듦. 인스턴스가 필요하다면 반드시 클래스 자신을 거침
//- 어디서든 그 인스턴스에 접근할 수 있도록 전역 접근 지점을 제공.

//--------------------------------

// 멀티스레딩 문제
// 두 스레드세어 getInstance()를 호출하면 두 스레드가 동시에 인스턴스를 생성하려고 시도할 수 있음
// 이러한 경우 인스턴스가 두 개 이상 생성될 수 있음
// 이를 방지하기 위해서는 인스턴스를 생성하는 부분을 동기화 처리해야 함

//--------------------------------

// 멀티스레딩 문제 해결 방법
// getInstance()메서드에 synchronized 키워드 추가하면 한 스레드가 메소드 사용을 완료할 때까지 다른 스레드가 메소드 사용을 못하도록 막음
// js는 기본적으로 단일 스레드이기 때문에 synchronized 키워드를 사용할 필요가 없음

// 1. getInstance() 메소드를 동기화(synchronized) 처리
// 2. 인스턴스를 시작하자마자 만드는 방법

class ChocolateBoiler_Singleton_02 {
	private static uniqueInstance = new ChocolateBoiler_Singleton_02();
	// ...
}

// 3. DCL(Double-Checked Locking) 기법 사용

//--------------------------------

// 순수 JavaScript 싱글톤 패턴

// 1. 클래스 기반 싱글톤 (가장 기본)
class Database {
	private static instance: Database;
	private connection: any;

	private constructor() {
		this.connection = null;
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	connect() {
		if (!this.connection) {
			this.connection = { status: 'connected' };
			console.log('DB 연결됨');
		}
	}
}

// 사용
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true

// 2. 즉시 실행 함수(IIFE)를 사용한 싱글톤
const UserManager = (() => {
	let instance: any;

	function createInstance() {
		return {
			users: [] as string[],
			addUser(name: string) {
				this.users.push(name);
			},
			getUsers() {
				return this.users;
			},
		};
	}

	return {
		getInstance() {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		},
	};
})();

// 사용
const userMgr1 = UserManager.getInstance();
const userMgr2 = UserManager.getInstance();
console.log(userMgr1 === userMgr2); // true

// 3. 객체 리터럴 싱글톤 (가장 간단)
const AppConfig = {
	apiUrl: 'https://api.example.com',
	timeout: 5000,
	setApiUrl(url: string) {
		this.apiUrl = url;
	},
	getApiUrl() {
		return this.apiUrl;
	},
};

// 객체 리터럴은 그 자체로 싱글톤이며, 추가 인스턴스 생성 불가
// 사용: AppConfig.setApiUrl('https://new-api.com');

// 4. ES6 모듈 싱글톤 (권장 방법)
class SessionManager {
	private sessionData: Map<string, any> = new Map();

	setSession(key: string, value: any) {
		this.sessionData.set(key, value);
	}

	getSession(key: string) {
		return this.sessionData.get(key);
	}

	clearSession() {
		this.sessionData.clear();
	}
}

// 모듈에서 단 하나의 인스턴스만 생성하고 export
export const sessionManager = new SessionManager();
// 다른 파일에서: import { sessionManager } from './session';
// ES6 모듈은 캐싱되므로 항상 같은 인스턴스를 반환

// 5. WeakMap을 활용한 private 싱글톤 (고급)
const instances = new WeakMap();

class ApiClient {
	constructor() {
		if (instances.has(ApiClient)) {
			return instances.get(ApiClient);
		}
		instances.set(ApiClient, this);
		return this;
	}

	request(endpoint: string) {
		console.log(`API 요청: ${endpoint}`);
	}
}

// 사용
const api1 = new ApiClient();
const api2 = new ApiClient();
console.log(api1 === api2); // true

// 6. Symbol을 활용한 싱글톤 (타입스크립트에서 더 안전)
const SINGLETON_KEY = Symbol('singleton');

class ThemeManager {
	private static [SINGLETON_KEY]: ThemeManager;
	private theme: string = 'light';

	private constructor() {}

	public static getInstance(): ThemeManager {
		if (!ThemeManager[SINGLETON_KEY]) {
			ThemeManager[SINGLETON_KEY] = new ThemeManager();
		}
		return ThemeManager[SINGLETON_KEY];
	}

	setTheme(theme: string) {
		this.theme = theme;
	}

	getTheme() {
		return this.theme;
	}
}

// 사용
const theme = ThemeManager.getInstance();

//--------------------------------

// JavaScript 싱글톤 패턴 비교 및 추천

// ✅ 추천 순위:
// 1위: ES6 모듈 방식 (방법 4) - 가장 간단하고 자연스러움
// 2위: 클래스 기반 (방법 1) - 전통적이고 명확함
// 3위: 객체 리터럴 (방법 3) - 간단한 설정/상수에 적합
// 4위: IIFE (방법 2) - 클로저가 필요할 때
// 5위: WeakMap/Symbol (방법 5, 6) - 특수한 경우에만

// 주의사항:
// - JavaScript는 싱글 스레드이므로 멀티스레딩 문제 없음
// - 하지만 Web Workers를 사용하면 각 워커마다 별도 인스턴스 생성됨
// - 모듈 방식이 가장 "JavaScript답고" 코드가 깔끔함

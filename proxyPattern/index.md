# 프록시 패턴

## 개념

프록시 패턴은 **특정 객체로의 접근을 제어하는 대리인(대변자) 객체를 제공하는 패턴**이다.

클라이언트는 실제 객체를 직접 다루는 것처럼 코드를 작성하지만, 실제로는 프록시 객체의 메서드를 호출한다.  
프록시는 네트워크 통신, 생성 비용, 접근 제어 등 클라이언트가 신경 쓰지 않아야 할 저수준 작업을 대신 처리한다.

## 구조

**Subject**

실제 객체와 프록시 모두 구현하는 공통 인터페이스 — 클라이언트는 이 인터페이스를 통해 프록시나 실제 객체와 통신한다.

**RealSubject**

프록시가 대변하는 실제 객체. 진짜 작업이 처리되는 곳이다.

**Proxy**

RealSubject와 동일한 인터페이스를 구현하며, 실제 객체에 대한 참조를 보유한다.  
접근 제어, 생성 지연, 원격 통신 등 부가 로직을 담당한다.

```txt
Client
  └─ Subject (Interface)
       ├─ RealSubject       // 실제 작업 처리
       └─ Proxy             // RealSubject로의 접근을 제어하는 대리인
            └─ realSubject: RealSubject
```

## 프록시 종류

### 원격 프록시 (Remote Proxy)

다른 네트워크 주소(다른 JVM, 다른 서버)에 있는 원격 객체의 로컬 대변자 역할을 한다.

- **원격 객체**: 다른 주소 공간(JVM 힙, 원격 서버)에 살고 있는 객체
- **로컬 대변자**: 어떤 메서드를 호출하면 원격 객체에게 그 호출을 전달해 주는 객체

클라이언트는 로컬 프록시를 통해 원격 객체의 메서드를 호출하는 것처럼 행동하고, 네트워크 통신과 관련된 저수준 작업은 프록시가 처리한다.

**원격 서비스 만들기 (Java RMI 기준)**

1. **원격 인터페이스 만들기** — 클라이언트가 원격으로 호출할 메서드 정의
2. **서비스 구현 클래스 만들기** — 실제 작업을 처리하는 클래스
3. **RMI 레지스트리 실행하기**
4. **원격 서비스 실행하기**

### 가상 프록시 (Virtual Proxy)

생성하는 데 많은 비용이 드는 객체를 대신한다.  
진짜 객체가 필요한 상황이 오기 전까지 객체 생성을 미루며, 생성이 끝나면 이후 요청은 실제 객체로 직접 전달한다.

## 예시

### 원격 프록시 — GumballMachine 모니터링

뽑기 기계(`GumballMachine`)의 상태를 원격에서 조회한다고 가정한다.  
`GumballMonitor`는 실제 기계 객체를 가리키는 프록시처럼 동작하며, 로컬에서 원격 기계의 정보를 출력한다.

```ts
class GumballMachine {
  location: string;
  count: number;
  state: string;

  constructor(location: string, count: number) {
    this.location = location;
    this.count = count;
    this.state = 'sold out';
  }

  getLocation(): string { return this.location; }
  getCount(): number { return this.count; }
  getState(): string { return this.state; }
}

class GumballMonitor {
  machine: GumballMachine;

  constructor(machine: GumballMachine) {
    this.machine = machine;
  }

  report() {
    console.log(`뽑기 기계 위치: ${this.machine.getLocation()}`);
    console.log(`현재 재고: ${this.machine.getCount()} 개`);
    console.log(`현재 상태: ${this.machine.getState()}`);
  }
}

// 사용
const gumballMachine = new GumballMachine('서울', 100);
const gumballMonitor = new GumballMonitor(gumballMachine);
gumballMonitor.report();
// 뽑기 기계 위치: 서울
// 현재 재고: 100 개
// 현재 상태: sold out
```

### 가상 프록시 — ImageProxy

이미지가 로딩되는 동안 실제 이미지 객체 대신 프록시가 자리를 차지하며 로딩 상태를 처리한다.  
이미지 로딩이 완료되면 이후 요청은 실제 이미지 객체에 위임한다.

```ts
interface Icon {
  getIconWidth(): number;
  getIconHeight(): number;
  printIcon(): void;
}

class ImageProxy implements Icon {
  imageIcon: Icon | null;
  imageURL: string;
  retrieving: boolean;

  constructor(url: URL) {
    this.imageURL = url.toString();
    this.imageIcon = null;
    this.retrieving = false;
  }

  // 이미지 로딩 전이면 기본값, 완료 후엔 실제 아이콘에 위임
  getIconWidth(): number {
    if (this.imageIcon !== null) {
      return this.imageIcon.getIconWidth();
    }
    return 800; // 기본값
  }

  getIconHeight(): number {
    if (this.imageIcon !== null) {
      return this.imageIcon.getIconHeight();
    }
    return 600; // 기본값
  }

  setImageIcon(icon: Icon) {
    this.imageIcon = icon;
  }

  printIcon(): void {
    if (this.imageIcon !== null) {
      // 로딩 완료 → 실제 객체에 위임
      this.imageIcon.printIcon();
    } else if (!this.retrieving) {
      // 로딩 시작
      this.retrieving = true;
      setTimeout(() => {
        console.log(`이미지 로딩 완료: ${this.imageURL}`);
        this.retrieving = false;
      }, 1000);
      console.log(`이미지 로딩 중: ${this.imageURL}`);
    }
  }
}
```

**동작 흐름**

```txt
Client → ImageProxy.printIcon()
  ├─ [imageIcon === null, retrieving === false]
  │    → "이미지 로딩 중..." 출력
  │    → 비동기 로딩 시작 (retrieving = true)
  ├─ [imageIcon === null, retrieving === true]
  │    → 이미 로딩 중이므로 무시
  └─ [imageIcon !== null]
       → 실제 Icon 객체에 printIcon() 위임
```

## 언제 사용하면 좋은가?

**✔ 원격 서버나 다른 환경의 객체에 접근해야 할 때**

네트워크 통신 코드를 클라이언트에서 숨기고, 마치 로컬 객체처럼 다루고 싶을 때

**✔ 생성 비용이 비싼 객체를 필요한 시점까지 미루고 싶을 때**

대용량 이미지, 무거운 DB 연결, 파일 로드 등을 실제로 필요하기 전에는 생성하지 않을 때

**✔ 객체에 대한 접근을 제어해야 할 때**

권한 검사, 로깅, 캐싱 등의 로직을 실제 객체를 변경하지 않고 추가하고 싶을 때

## 프록시 패턴 vs 데코레이터 패턴

두 패턴은 구조가 유사하지만 의도가 다르다.

**프록시 패턴**

- 접근 제어가 목적이다
- 프록시가 실제 객체의 생명주기를 직접 관리하기도 한다
- 클라이언트는 실제 객체와 프록시를 구분하지 못한다

**데코레이터 패턴**

- 기능 추가가 목적이다
- 데코레이터는 래핑할 객체를 외부에서 주입받는다
- 여러 데코레이터를 겹쳐 기능을 조합할 수 있다

> 프록시: "내가 대신 접근을 제어해줄게"  
> 데코레이터: "내가 기능을 추가해줄게"

## 프론트엔드 활용 예시

### 이미지 Lazy Loading

```ts
class LazyImageProxy {
  private realImage: HTMLImageElement | null = null;
  private src: string;

  constructor(src: string) {
    this.src = src;
  }

  load(container: HTMLElement): void {
    if (this.realImage === null) {
      const placeholder = document.createElement('div');
      placeholder.textContent = '이미지 로딩 중...';
      container.appendChild(placeholder);

      this.realImage = new Image();
      this.realImage.onload = () => {
        container.replaceChild(this.realImage!, placeholder);
      };
      this.realImage.src = this.src;
    }
  }
}
```

### API 캐싱 프록시

```ts
interface UserService {
  getUser(id: number): Promise<User>;
}

class RealUserService implements UserService {
  async getUser(id: number): Promise<User> {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  }
}

class CachingUserServiceProxy implements UserService {
  private cache = new Map<number, User>();
  private realService = new RealUserService();

  async getUser(id: number): Promise<User> {
    if (this.cache.has(id)) {
      console.log(`캐시에서 반환: ${id}`);
      return this.cache.get(id)!;
    }
    const user = await this.realService.getUser(id);
    this.cache.set(id, user);
    return user;
  }
}

// 클라이언트 코드는 변경 없이 캐싱 동작을 얻는다
const userService: UserService = new CachingUserServiceProxy();
await userService.getUser(1); // 실제 API 호출
await userService.getUser(1); // 캐시에서 반환
```

### JavaScript Proxy 객체

JavaScript 내장 `Proxy` 객체는 프록시 패턴을 언어 수준에서 지원한다.

```ts
const handler = {
  get(target: Record<string, unknown>, key: string) {
    console.log(`[접근 로그] ${key} 속성 읽힘`);
    return key in target ? target[key] : `${key} 없음`;
  },
  set(target: Record<string, unknown>, key: string, value: unknown) {
    console.log(`[변경 로그] ${key} = ${value}`);
    target[key] = value;
    return true;
  },
};

const data = new Proxy({} as Record<string, unknown>, handler);
data.name = '뽑기 기계'; // [변경 로그] name = 뽑기 기계
console.log(data.name);  // [접근 로그] name 속성 읽힘 → 뽑기 기계
```

Vue 3의 반응형 시스템(`reactive()`, `ref()`)이 내부적으로 JavaScript `Proxy`를 사용하여 데이터 변경을 감지하고 화면을 자동으로 업데이트한다.

# 옵저버 패턴

옵저버 패턴은 한 객체의 상태가 바뀌면 그 객체에 의존하는 다른 객체에게 연락이 가고 자동으로 내용이 갱신되는 방식으로 일대다 의존성을 정의 

## 옵저버 패턴의 구조

```typescript
interface ActionSubject {
    registerObserver(observer: ActionListener): void;
    removeObserver(observer: ActionListener): void;
    notifyObserver(): void;
}

interface ActionListener {
    update(): void;
}

class ConcreteSubject {
    private observers: Observer[] = [];
    private state: number;

    registerObserver(observer:Observer){
        this.observers.push(observer);
    }

    removeObserver(observer: Observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }

    notifyObserver() {
        this.observers.forEach(observer => observer.update(this.state));
    }
}

class ConcreteObserver {
    update(state:number){
        // 최신 state값 조회
    }
}
```

### Pull 방식을 사용한다면?

옵저버에게 데이터를 전달하는 방식은 크게 **Push**와 **Pull** 두 가지가 있다.

#### Push 방식
```typescript
interface Observer {
    update(temperature: number, humidity: number, pressure: number): void;
}

// Subject가 변경된 데이터를 직접 전달
notifyObserver() {
    this.observers.forEach(observer => 
        observer.update(this.temperature, this.humidity, this.pressure)
    );
}
```

**장점**: 옵저버가 Subject를 참조할 필요 없음  
**단점**: 모든 데이터를 전달해야 하므로 유연성이 떨어짐

#### Pull 방식 (권장)
```typescript
interface Observer {
    update(): void;
}

// Subject는 변경 사실만 알리고, 옵저버가 필요한 데이터를 가져옴
notifyObserver() {
    this.observers.forEach(observer => observer.update());
}

// 옵저버에서
update() {
    this.temperature = this.weatherData.getTemperature();
    this.humidity = this.weatherData.getHumidity();
    // 필요한 데이터만 선택적으로 가져옴
}
```

**장점**: 옵저버가 필요한 데이터만 선택적으로 가져올 수 있어 유연함  
**단점**: 옵저버가 Subject를 참조해야 함

## 옵저버 패턴의 장점

1. **느슨한 결합(Loose Coupling)**
   - Subject와 Observer는 서로 독립적으로 재사용 가능
   - Subject는 Observer의 구체적인 구현을 알 필요 없음

2. **동적 구독 관리**
   - 런타임에 옵저버를 자유롭게 추가/제거 가능
   - 유연한 시스템 구성

3. **개방-폐쇄 원칙(OCP)**
   - 새로운 옵저버 추가 시 기존 코드 수정 불필요
   - 확장에는 열려있고 변경에는 닫혀있음

4. **자동 동기화**
   - 상태 변경 시 모든 의존 객체에 자동으로 알림
   - 데이터 일관성 유지

## 실제 사용 예제

### 날씨 모니터링 시스템
```typescript
interface Subject{
    // 옵저버 등록/삭제 메소드
    registerObserver:(observer: Observer)=>void;
    removeObserver:(observer: Observer)=>void;
    // 옵저버의 상태가 변경되었을때, 모든 옵저버에게 변경 내용을 알리는 메소드
    notifyObserver:()=>void;
}

interface Observer {
    // 모든 옵저버 클래스에서 구현해야 하는 메소드
    update:()=>void;
}

interface DisplayElement {
    // 디스플레이 항목을 화면에 표시해야 하는 메소드
    display:()=>void;
}

class WeatherData implements Subject {
    private observers: Observer[] = [];
    private temperature: number;
    private humidity: number;
    private pressure: number;

    constructor() {
        this.temperature = 0;
        this.humidity = 0;
        this.pressure = 0;
    }

    registerObserver(observer: Observer) {
        this.observers.push(observer);
    }

    removeObserver(observer: Observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }

    notifyObserver() {
        this.observers.forEach(observer => observer.update());
    }
    
    measurementsChanged() {
        this.notifyObserver();
    }

    getTemperature() {
        return this.temperature;
    }

    getHumidity() {
        return this.humidity;
    }

    setMeasurements(temperature: number, humidity: number, pressure: number) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        this.measurementsChanged();
    }
}

class CurrentConditionsDisplay implements Observer, DisplayElement {
    private temperature: number;
    private humidity: number;
    private weatherData: WeatherData;

    constructor(weatherData: WeatherData) {
        this.temperature = 0;
        this.humidity = 0;

        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }

    update() {
        this.temperature = weatherData.getTemperature();
        this.humidity = weatherData.getHumidity();
        this.display();
    }

    display() {
        console.log(`현재 상태: 온도 ${this.temperature}F, 습도 ${this.humidity}%`);
    }
}

class StatisticsDisplay implements Observer, DisplayElement {
    private maxTemperature: number;
    private minTemperature: number;
    private temperatures: number[] = [];
    private weatherData: WeatherData;

    constructor(weatherData: WeatherData) {
        this.maxTemperature = 0;
        this.minTemperature = 0;
        this.temperatures = [];

        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }

    update() {
        console.log('update statistics display');
        this.temperatures.push(weatherData.getTemperature());

        this.maxTemperature = Math.max(...this.temperatures);
        this.minTemperature = Math.min(...this.temperatures);
        this.display();
    }
    
    display() {
        console.log(`평균/최고/최저 온도: ${this.temperatures.reduce((sum, temperature) => sum + temperature, 0) / this.temperatures.length}F, ${this.maxTemperature}F, ${this.minTemperature}F`);
    }
}

const weatherData = new WeatherData();
const currentConditionsDisplay = new CurrentConditionsDisplay(weatherData);
const statisticsDisplay = new StatisticsDisplay(weatherData);

weatherData.setMeasurements(80, 65, 30.4);
weatherData.setMeasurements(82, 70, 29.2);
weatherData.setMeasurements(78, 90, 29.2);
```

### 이벤트 리스너 시스템

```typescript
class ActionEvent {
    constructor(
        public source: any,
        public timestamp: number = Date.now()
    ) {}
}

interface ActionListener {
    actionPerformed(event: ActionEvent): void;
}

class Button {
    private listeners: ActionListener[] = [];

    addActionListener(listener: ActionListener): void {
        this.listeners.push(listener);
    }

    removeActionListener(listener: ActionListener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    click(): void {
        const event = new ActionEvent(this);
        this.listeners.forEach(listener => listener.actionPerformed(event));
    }
}

class AngelListener implements ActionListener {
    actionPerformed(event: ActionEvent): void {
        console.log('하지마! 아마 후회할 걸?');
    }
}

class DevilListener implements ActionListener {
    actionPerformed(event: ActionEvent): void {
        console.log('그냥 저질러 버렷!!');
    }
}

// 사용 예시
const button = new Button();
button.addActionListener(new AngelListener());
button.addActionListener(new DevilListener());

button.click();
```

## 주요 사용 사례

### Java/Desktop 애플리케이션

#### GUI 이벤트 처리
Swing/JavaFX의 버튼 클릭, 키보드 입력 등

```java
// Java Swing 예제
JButton button = new JButton("클릭");

// 옵저버 등록 (ActionListener)
button.addActionListener(e -> {
    System.out.println("버튼이 클릭되었습니다!");
});
```

#### MVC 패턴
Model의 변경사항을 View에 자동 반영

```typescript
// TypeScript MVC 예제
class Model implements Subject {
    private observers: Observer[] = [];
    private data: string;
    
    setData(data: string) {
        this.data = data;
        this.notifyObserver();
    }
}

class View implements Observer {
    update() {
        // Model이 변경되면 UI 자동 업데이트
        this.render();
    }
}
```

### HTML/JavaScript (웹)

#### DOM 이벤트
`addEventListener`를 통한 클릭, 입력, 마우스 이벤트

```javascript
const button = document.querySelector('#myButton');

// 여러 개의 옵저버 등록 가능
button.addEventListener('click', () => {
    console.log('첫 번째 리스너');
});

button.addEventListener('click', () => {
    console.log('두 번째 리스너');
});

// 버튼 클릭 시 → 모든 리스너 실행
```

#### IntersectionObserver
요소 가시성 감시 (무한 스크롤, 이미지 지연 로딩)

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 이미지가 화면에 보이면 로딩
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img); // 로딩 후 감시 중단
        }
    });
});

// 모든 이미지에 옵저버 등록
document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
});
```

#### MutationObserver
DOM 변경 감시

```javascript
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        console.log('DOM 변경:', mutation.type);
    });
});

const targetNode = document.querySelector('#app');
observer.observe(targetNode, {
    childList: true,    // 자식 노드 변경
    attributes: true,   // 속성 변경
    subtree: true       // 하위 트리 전체
});
```

#### React
`useState`, `useEffect`를 통한 상태 변경 → UI 자동 업데이트

```typescript
function Counter() {
    const [count, setCount] = useState(0);
    
    // count 변경 감시 (옵저버)
    useEffect(() => {
        console.log('Count가 변경됨:', count);
        document.title = `클릭 ${count}번`;
    }, [count]); // count를 구독
    
    return (
        <button onClick={() => setCount(count + 1)}>
            클릭 {count}번
        </button>
    );
}
```

#### Vue
반응형 시스템 (`watch`, `computed`)

```javascript
export default {
    data() {
        return {
            message: 'Hello'
        }
    },
    watch: {
        // message 변경 감시
        message(newValue, oldValue) {
            console.log(`${oldValue} → ${newValue}`);
        }
    },
    computed: {
        // message가 변경되면 자동으로 재계산
        reversedMessage() {
            return this.message.split('').reverse().join('');
        }
    }
}
```

#### Custom EventEmitter
커스텀 이벤트 시스템

```typescript
class EventEmitter {
    private events: Map<string, Function[]> = new Map();
    
    on(event: string, callback: Function) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);
    }
    
    emit(event: string, data?: any) {
        const callbacks = this.events.get(event);
        callbacks?.forEach(cb => cb(data));
    }
}

// 사용 예제
const emitter = new EventEmitter();

emitter.on('userLogin', (user) => {
    console.log('환영합니다:', user.name);
});

emitter.on('userLogin', (user) => {
    console.log('로그 기록:', user.name);
});

emitter.emit('userLogin', { name: 'Jina' });
// 출력:
// 환영합니다: Jina
// 로그 기록: Jina
```

### 일반적인 사용 사례

#### 실시간 모니터링
주식 가격, 센서 데이터, 날씨 정보

```typescript
class StockPrice implements Subject {
    private observers: Observer[] = [];
    private price: number = 0;
    
    setPrice(price: number) {
        this.price = price;
        this.notifyObserver();
    }
    
    notifyObserver() {
        this.observers.forEach(observer => observer.update());
    }
}

class StockDisplay implements Observer {
    constructor(private stock: StockPrice) {
        stock.registerObserver(this);
    }
    
    update() {
        console.log(`현재 주가: ${this.stock.getPrice()}원`);
    }
}

class AlertSystem implements Observer {
    constructor(private stock: StockPrice, private threshold: number) {
        stock.registerObserver(this);
    }
    
    update() {
        if (this.stock.getPrice() > this.threshold) {
            console.log('🚨 목표가 도달!');
        }
    }
}
```

#### WebSocket 실시간 통신
```javascript
const socket = new WebSocket('ws://example.com/socket');

// 여러 이벤트 리스너 등록 (옵저버 패턴)
socket.addEventListener('message', (event) => {
    console.log('메시지 수신:', event.data);
});

socket.addEventListener('message', (event) => {
    // UI 업데이트
    updateUI(event.data);
});

socket.addEventListener('message', (event) => {
    // 로그 저장
    saveLog(event.data);
});
```

## 옵저버 저장 방식

옵저버를 저장하는 자료구조는 상황에 따라 다르게 선택할 수 있다.

### 1. 배열 (Array) - 가장 단순

```typescript
class Subject {
    private observers: Observer[] = [];
    
    registerObserver(observer: Observer) {
        this.observers.push(observer);
    }
    
    removeObserver(observer: Observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }
    
    notifyObserver() {
        this.observers.forEach(observer => observer.update());
    }
}
```

**장점**:
- 구현이 가장 간단
- 순서 보장 (등록 순서대로 알림)

**단점**:
- 중복 등록 가능 (같은 옵저버를 여러 번 등록 가능)
- `removeObserver` 시 O(n) 시간 복잡도
- 삭제 시 새 배열 생성 (메모리 비효율)

### 2. Set - 실무 권장 ⭐

```typescript
class Subject {
    private observers: Set<Observer> = new Set();
    
    registerObserver(observer: Observer) {
        this.observers.add(observer); // 자동으로 중복 제거
    }
    
    removeObserver(observer: Observer) {
        this.observers.delete(observer); // O(1) 시간 복잡도
    }
    
    notifyObserver() {
        this.observers.forEach(observer => observer.update());
    }
}
```

**장점**:
- **중복 방지**: 같은 옵저버를 여러 번 등록해도 하나만 유지
- **빠른 삭제**: `delete()`는 O(1) 시간 복잡도
- **메모리 효율적**: 삭제 시 새 객체 생성하지 않음
- **존재 확인 빠름**: `has()` 메서드로 O(1)

**단점**:
- 순서가 보장되긴 하지만 배열만큼 직관적이지 않음
- 인덱스 접근 불가

### 3. Map - 우선순위나 메타데이터가 필요할 때

```typescript
class Subject {
    private observers: Map<Observer, { priority: number }> = new Map();
    
    registerObserver(observer: Observer, priority: number = 0) {
        this.observers.set(observer, { priority });
    }
    
    removeObserver(observer: Observer) {
        this.observers.delete(observer);
    }
    
    notifyObserver() {
        // 우선순위 순으로 정렬해서 알림
        const sorted = Array.from(this.observers.entries())
            .sort((a, b) => b[1].priority - a[1].priority);
        
        sorted.forEach(([observer]) => observer.update());
    }
}

// 사용 예제
subject.registerObserver(criticalObserver, 10); // 높은 우선순위
subject.registerObserver(normalObserver, 1);    // 낮은 우선순위
```

**장점**:
- 각 옵저버에 메타데이터(우선순위, ID 등) 저장 가능
- O(1) 추가/삭제
- 중복 방지

**단점**:
- 구현이 복잡
- 메모리 사용량 많음

### 자료구조 선택 가이드

| 상황 | 자료구조 | 이유 |
|------|---------|------|
| 일반적인 경우 | **Set** ⭐ | 중복 방지, 빠른 성능 |
| 순서가 중요한 경우 | Array | 등록 순서 명확 |
| 우선순위가 필요한 경우 | Map | 메타데이터 저장 가능 |
| 간단한 프로토타입 | Array | 빠른 구현 |
| 실무 프로덕션 | **Set** | 안전하고 효율적 |

### 실제 라이브러리 사례

- **Node.js EventEmitter**: 내부적으로 배열 사용
- **RxJS Observable**: 배열 사용하지만 중복 체크 로직 포함
- **React**: Set과 유사한 구조 사용 (중복 방지)


## 디자인 원칙

> **옵저버 패턴은 다음 디자인 원칙을 따른다:**
> - 상호작용하는 객체 사이에는 가능하면 느슨한 결합을 사용해야 한다
> - 인터페이스에 맞춰서 프로그래밍한다 (구현보다는 인터페이스)

## 주의사항

1. **순서 의존성**: 옵저버들의 알림 순서에 의존하지 않도록 설계
2. **메모리 누수**: 사용하지 않는 옵저버는 반드시 제거
3. **성능**: 옵저버가 많을 경우 알림 비용 고려
4. **순환 참조**: Subject와 Observer 간 순환 참조 주의

// 가상 모니터링 애플리케이션 만들기
// Weather-O-Ramda -> WeatherData -> Display

// class WeatherData {
//     private temperature: number;
//     private humidity: number;
//     private pressure: number;

//     constructor() {
//         this.temperature = 0;
//         this.humidity = 0;
//         this.pressure = 0;
//     }

//     getTemperature() {
//         return this.temperature;
//     }

//     getHumidity() {
//         return this.humidity;
//     }

//     getPressure() {
//         return this.pressure;
//     }

//     // 측정값이 변경되면 measurementsChanged 호출
//     measurementsChanged() {
//         const temperature = this.getTemperature();
//         const humidity = this.getHumidity();
//         const pressure = this.getPressure();

//         // 측정값이 변경되면 각 디스플레이에 업데이트 요청
//         currentConditionsDisplay.update(temperature, humidity, pressure);
//         statisticsDisplay.update(temperature, humidity, pressure);
//         forecastDisplay.update(temperature, humidity, pressure);
//     }
// }

// ------------------------------
// 옵저버 패턴을 사용해서 구현예시

// interface Subject{
//     // 옵저버 등록/삭제 메소드
//     registerObserver:(observer: Observer)=>void;
//     removeObserver:(observer: Observer)=>void;
//     // 옵저버의 상태가 변경되었을때, 모든 옵저버에게 변경 내용을 알리는 메소드
//     notifyObserver:()=>void;
// }

// interface Observer {
//     // 모든 옵저버 클래스에서 구현해야 하는 메소드
//     update:(temp: number, humidity: number, pressure: number)=>void;
// }

// interface DisplayElement {
//     // 디스플레이 항목을 화면에 표시해야 하는 메소드
//     display:()=>void;
// }

// class WeatherData implements Subject {
//     private observers: Observer[] = [];
//     private temperature: number;
//     private humidity: number;
//     private pressure: number;

//     constructor() {
//         this.temperature = 0;
//         this.humidity = 0;
//         this.pressure = 0;
//     }

//     registerObserver(observer: Observer) {
//         this.observers.push(observer);
//     }

//     removeObserver(observer: Observer) {
//         this.observers = this.observers.filter(o => o !== observer);
//     }

//     notifyObserver() {
//         this.observers.forEach(observer => observer.update(this.temperature, this.humidity, this.pressure));
//     }
    
//     measurementsChanged() {
//         this.notifyObserver();
//     }

//     setMeasurements(temperature: number, humidity: number, pressure: number) {
//         this.temperature = temperature;
//         this.humidity = humidity;
//         this.pressure = pressure;
//         this.measurementsChanged();
//     }
// }

// class CurrentConditionsDisplay implements Observer, DisplayElement {
//     private temperature: number;
//     private humidity: number;
//     private weatherData: WeatherData;

//     constructor(weatherData: WeatherData) {
//         this.temperature = 0;
//         this.humidity = 0;

//         this.weatherData = weatherData;
//         weatherData.registerObserver(this);
//     }

//     update(temperature: number, humidity: number) {
//         this.temperature = temperature;
//         this.humidity = humidity;
//         this.display();
//     }

//     display() {
//         console.log(`현재 상태: 온도 ${this.temperature}F, 습도 ${this.humidity}%`);
//     }
// }

// class StatisticsDisplay implements Observer, DisplayElement {
//     private maxTemperature: number;
//     private minTemperature: number;
//     private temperatures: number[] = [];
//     private weatherData: WeatherData;

//     constructor(weatherData: WeatherData) {
//         this.maxTemperature = 0;
//         this.minTemperature = 0;
//         this.temperatures = [];

//         this.weatherData = weatherData;
//         weatherData.registerObserver(this);
//     }

//     update(temperature: number) {
//         console.log('update statistics display');
//         this.temperatures.push(temperature);

//         this.maxTemperature = Math.max(...this.temperatures);
//         this.minTemperature = Math.min(...this.temperatures);
//         this.display();
//     }
    
//     display() {
//         console.log(`평균/최고/최저 온도: ${this.temperatures.reduce((sum, temperature) => sum + temperature, 0) / this.temperatures.length}F, ${this.maxTemperature}F, ${this.minTemperature}F`);
//     }
// }

// const weatherData = new WeatherData();
// const currentConditionsDisplay = new CurrentConditionsDisplay(weatherData);
// const statisticsDisplay = new StatisticsDisplay(weatherData);

// weatherData.setMeasurements(80, 65, 30.4);
// weatherData.setMeasurements(82, 70, 29.2);
// weatherData.setMeasurements(78, 90, 29.2);


// --------------------------------
//인생을 바꿀 애플리케이션 만들기

// Swing의 ActionEvent를 모방
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

// --------------------------------
// 풀 방식으로 코드 바꾸기

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
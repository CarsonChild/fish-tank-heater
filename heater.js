const sensor1 = new OneWire(D13); //D7 on the board
const sensor2 = new OneWire(D12); //D6 on the board
const therm1 = require("DS18B20").connect(sensor1);
const therm2 = require("DS18B20").connect(sensor2);
const RELAY = D5; //D1 on the board
const DESIRED_TEMPERATURE = 77;

function celciusToF(temp){
  return temp * (9 / 5) + 32;
}

function belowDesiredTemp(desiredTemp, callback) {
  therm1.getTemp(s1 => {
    const temp1 = celciusToF(s1);
    console.log("temp1:" + temp1 + "°F");
    therm2.getTemp(s2 => {
      const temp2 = celciusToF(s2);
      console.log("temp2:" + temp2 + "°F");
      callback(
        (temp1 + temp2) / 2 < desiredTemp,
        temp1,
        temp2
      );
    });
  });
}

function start(){
  setInterval(() => {
    belowDesiredTemp(DESIRED_TEMPERATURE, (isBelowDesiredTemp, temp1, temp2) => {
      if(isBelowDesiredTemp && (temp1 != 32 && temp1 != 185 && temp2 != 32 && temp2 != 185)) {
        digitalWrite(RELAY, 1); 
      }
      else digitalWrite(RELAY, 0); 
    });
  }, 1000);
}

function onInit() {
  digitalWrite(RELAY, 0); //default off
  setTimeout(() => {
    try{
      start();
    }
    catch(error){
      console.log(error);
      digitalWrite(RELAY, 0);
    }
  }, 3000 );
}

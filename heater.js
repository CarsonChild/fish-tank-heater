var sensor1 = new OneWire(D13); //D7 on the board
var sensor2 = new OneWire(D12); //D6 on the board
var therm1 = require("DS18B20").connect(sensor1);
var therm2 = require("DS18B20").connect(sensor2);
var relay = D5; //D1 on the board
var temp1=81, temp2=81; //Temp higher than 81 as another default off

function celciusToF(temp){
  return temp * (9 / 5) + 32;
}

function belowDesiredTemp(desiredTemp) {
  therm1.getTemp(function (s1) {
    temp1 = celciusToF(s1);
    console.log("temp1:" + temp1 + "°F");
  });
  therm2.getTemp(function (s2) {
    temp2 = celciusToF(s2);
    console.log("temp2:" + temp2 + "°F");
  }); 
  return (temp1 + temp2) / 2 < desiredTemp;
}

function start(){
  setInterval(function() {
    if(belowDesiredTemp(77) && (temp1 != 32 && temp1 != 185 && temp2 != 32 && temp2 != 185)){
      digitalWrite(relay, 1); 
    }
    else digitalWrite(relay, 0); 
  }, 1000);
}

function onInit() {
  digitalWrite(relay, 0); //default off
  setTimeout( function() {
    try{
      start();
    }
    catch(error){
      console.log(error);
      digitalWrite(relay, 0);
    }
  }, 3000 );
}

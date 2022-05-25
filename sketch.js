let interpolationValue = 0.00;
let journeyDuration = 60;
let interpolationSpeed = 0.00;
let beginningInhaleValue  = 4;
let endInhaleValue = 6;
let beginningExhaleValue = 6;
let endExhaleValue = 2;
let interpolateR = 0;
let interpolateG = 0;
let interpolateB = 0;
let interpolate = true;
let beginningR = 86
let beginningG = 139
let beginningB = 34

let endR = 200
let endG = 3
let endB =10

let breathingStarted;

let inhale = false;
let pastBreathValue;
let breathingScaleRange = 100;
let breathingValue =0.0000; 
let breathingValueSmoothed = 0;
let inhaleDuration = 4;
let exhaleDuration = 6;

let timer = 0;
let momentToPlay = 50;

let remoteNoteCounter =0;
let bigGapThreshold = 3;


let whichRemoteInstrument = 2;

let beginningMoodPicker;
let endMoodPicker;
let durationPicker;

let whichBeginningMood = 1;
let whichEndMood = 4;

let begginingMoodText = 'Calm';
let endMoodText = 'Active';
let journeyDurationText = "1:00";
let vibrationPatternText = "Bottom Up"
let sonicAvatarText = "Sizzling View"

let whichJourneyDuration = 1;

let  vibrationMotorA1 = 0;
let  vibrationMotorB1 = 0;
let  vibrationMotorB2 = 0;
let  vibrationMotorC1 = 0;
let  vibrationMotorD1 = 0;
let  vibrationMotorD2 = 0;
let  vibrationMotorE1 = 0;

let blinkTimer = 0;
let whenToBlink = 0;
let whenToBlinkIncrement = 0;
let vibrationFlashIntensity = 1;


let whichVibrationPattern = 1;


   let doFlashingFadeIn;
   let doFlashingFadeOut;




function setup() {
  createCanvas(400, 700);
  //whichRemoteInstrument = int(random()*3) + 2;
  Play();
    textSize(32);

  // Adding Buttons
  beginningMoodPicker = createButton('Beginning Mood');
  beginningMoodPicker.position(width/3 * 0.5, 0);
  beginningMoodPicker.mousePressed(swipeBeginningMood);
  
  endMoodPicker = createButton('End Mood');
  endMoodPicker.position(width/3 * 1.5, 0);
  endMoodPicker.mousePressed(swipeEndMood);
  
  journeyDurationPicker = createButton('Journey Duration');
  journeyDurationPicker.position(width/3 * 2.5, 0);
  journeyDurationPicker.mousePressed(swipeJourneyDurationTime);
  
  vibrationPatternPicker = createButton('Vibration Pattern');
  vibrationPatternPicker.position(width/3 * 1.5, 60);
  vibrationPatternPicker.mousePressed(swipeVibrationPattern);
  
  remoteSoundAlgoPicker = createButton('Sonic-Avatar Algo');
  remoteSoundAlgoPicker.position(width/3 * 0.2, 410);
  remoteSoundAlgoPicker.mousePressed(swipeSonicAvatarAlgo);
  
    remoteSoundAlgoPicker = createButton('Play Sonic Avatar');
  remoteSoundAlgoPicker.position(width/3 * 1.2, 450);
  remoteSoundAlgoPicker.mousePressed(playSonicAvatar);
  
  remoteSoundParameter1 = createSlider(0, 1, 0, 0.01);
  remoteSoundParameter1.position(width/3 * 1.2, 410);
  remoteSoundParameter1.style('width', '80px');
  
  remoteSoundParameter2 = createSlider(0, 1,0, 0.01);
  remoteSoundParameter2.position(width/3 * 2.2, 410);
  remoteSoundParameter2.style('width', '80px');
  
  startButton = createButton('Start');
  startButton.position(width/3 * 1.5, 270);
  startButton.mousePressed(startBreathing);

}

function draw() {
  
  background(220);

  //When you press start this becomes true
  if (breathingStarted) performBreathing();
  
  //Changing text to match option picked in button
  text(begginingMoodText, width/3 * 0.5, 20, 70, 80);
  text(endMoodText, width/3 * 1.5, 20, 70, 80);
  text(journeyDurationText, width/3 * 2.5, 20, 70, 80);
  text(vibrationPatternText, width/3 * 1.5, 90, 70, 80);
  text(sonicAvatarText, width/3 * 0.2, 450, 70, 80);


  
  // Smoothing breathing animation value
  breathingValueSmoothed = breathingValue *0.3 +                       breathingValueSmoothed *0.7;

  
  remoteUserSoundAlgo();
  
  sendValuesToArduino();
  
  if(interpolationValue >= 1) interpolationValue = 1;
  if(interpolationValue <= 0)interpolationValue = 0;
  
  vibrationPatterns();
  
  drawPrototypingMotors();
  
  csound.SetChannel("Social11", remoteSoundParameter1.value());
  csound.SetChannel("Social12", remoteSoundParameter2.value());
  csound.SetChannel("Social21", remoteSoundParameter1.value());
  csound.SetChannel("Social22", remoteSoundParameter2.value());
  csound.SetChannel("Social31", remoteSoundParameter1.value());
  csound.SetChannel("Social32", remoteSoundParameter2.value());
  
}



function drawPrototypingMotors(){
  
  let motorDiameter = 20; 
  let colorRange = 250;
  
        noStroke();
    push()
    fill(vibrationMotorA1 * colorRange)
    circle(300 ,350, motorDiameter)
    pop()
  
        noStroke();
    push()
    fill(vibrationMotorB1* colorRange)
    circle(250 ,300, motorDiameter)
    pop()
  
        noStroke();
    push()
    fill(vibrationMotorB2 * colorRange)
    circle(350 ,300, motorDiameter)
    pop()
  
        noStroke();
    push()
    fill(vibrationMotorC1 * colorRange)
    circle(300 ,250, motorDiameter)
    pop()
  
        noStroke();
    push()
    fill(vibrationMotorD1 * colorRange)
    circle(250 ,200, motorDiameter)
    pop()
  
        noStroke();
    push()
    fill(vibrationMotorD2 * colorRange)
    circle(350 ,200, motorDiameter)
    pop()
  
        noStroke();
    push()
    fill(vibrationMotorE1 * colorRange)
    circle(300 ,150, motorDiameter)
    pop()
}

function swipeVibrationPattern(){
  
  whichVibrationPattern++;
    
  if(whichVibrationPattern > 2){
    whichVibrationPattern = 1;
  }
  
    switch(whichVibrationPattern){
    case 01:
      vibrationPatternText = "Bottom Up"
      break;
    case 02:
      vibrationPatternText = "Flashing Pattern"
      break;
    case 03:
      vibrationPatternText = "Irradiating"
      break;
    case 04:
      vibrationPatternText = "Bottom Up + Social"
      break;
  }
  
  
}

function vibrationPatterns(){
  
  switch(whichVibrationPattern){
    case 01:
      bottomUpPattern();
      break;
    case 02:
      flashingPattern();
      break;
    case 03:
      break;
    case 04:
      break;
  }
  
}

function bottomUpPattern(){
  
  vibrationMotorA1 = breathingValueSmoothed;
  vibrationMotorB1 = breathingValueSmoothed;
  vibrationMotorB2 = breathingValueSmoothed;
  vibrationMotorC1 = breathingValueSmoothed;
  vibrationMotorD1 = breathingValueSmoothed;
  vibrationMotorD2 = breathingValueSmoothed;
  vibrationMotorE1 = breathingValueSmoothed;
  
    
  //vibrationMotorA1
  if(breathingValueSmoothed > 0.2) vibrationMotorA1 = 0.2;
  
  vibrationMotorA1 = vibrationMotorA1/0.2;
  
  //vibrationMotorB1 and B2
  if(breathingValueSmoothed < 0.2){
    vibrationMotorB1 = 0.2;
    vibrationMotorB2 = 0.2;
    } 
  if(breathingValueSmoothed > 0.4) {
    vibrationMotorB1 = 0.4;
    vibrationMotorB2 = 0.4;
    }
  
  vibrationMotorB1 = (vibrationMotorB1-0.2)/0.2;
  vibrationMotorB2 = (vibrationMotorB2-0.2)/0.2;

  //vibrationMotorC1
  if(breathingValueSmoothed < 0.4) vibrationMotorC1 = 0.4;
  if(breathingValueSmoothed > 0.6) vibrationMotorC1 = 0.6;
  
  vibrationMotorC1 = (vibrationMotorC1-0.4)/0.2;
  
  //vibrationMotorD1 and D2
  if(breathingValueSmoothed < 0.6) {
    vibrationMotorD1 = 0.6;
    vibrationMotorD2 = 0.6;
    }
  if(breathingValueSmoothed > 0.8) {
    vibrationMotorD1 = 0.8;
    vibrationMotorD2 = 0.8;
    }
  
  vibrationMotorD1 = (vibrationMotorD1-0.6)/0.2;
  vibrationMotorD2 = (vibrationMotorD2-0.6)/0.2;
  
  //vibrationMotorE1
  if(breathingValueSmoothed < 0.6) {
    vibrationMotorE1 = 0.8;
    vibrationMotorE1 = 0.8;
    }
  if(breathingValueSmoothed > 1) {
    vibrationMotorE1 = 1;
    vibrationMotorE1 = 1;
    }
  
  vibrationMotorE1 = (vibrationMotorE1-0.8)/0.2;

  
}

function flashingPattern(){
  
  if(inhale || breathingValueSmoothed > 0.6){
    
      
      let fadeOut = 100;
      let fadeIn = 100;
    
   
    
      blinkTimer += (1/60)*frameRate();

      whenToBlinkIncrement = ( ((1 - breathingValue * 0.87) + 0.13) ) * 50;
      
      if(blinkTimer > whenToBlink){
        blinkTimer = 0;
        whenToBlink = whenToBlinkIncrement;
        
        //console.log( "Blink Increment Is" + whenToBlinkIncrement);
                    
        
        doFlashingFadeIn = true;
        doFlashingFadeOut = false; 
      }
      
      if(doFlashingFadeIn)
      {
        if(vibrationFlashIntensity <= 1){
        vibrationFlashIntensity += 0.1;
        //console.log("DoFadeIn Is Running" + vibrationFlashIntensity)

        }
        
        if(vibrationFlashIntensity >= 1){
        //console.log("DoFadeIn Is Done" + vibrationFlashIntensity)

          doFlashingFadeIn = false;
          doFlashingFadeOut = true;
        }
      }
    
      if(doFlashingFadeOut)
      {
        vibrationFlashIntensity -= 0.1;
        //console.log("DoFadeOut Is Running" + vibrationFlashIntensity)
        
        
        if(vibrationFlashIntensity <= 0){
        doFlashingFadeOut = false;
        //console.log("DoFadeOut Is False")
        }
        

      }

      if(vibrationFlashIntensity <= 0){
        vibrationFlashIntensity = 0;
      }
    
    if(vibrationFlashIntensity >= 1){
      vibrationFlashIntensity = 1;
    }
    
  
  }
  
  if(breathingValueSmoothed < 0.6 && !inhale){
    vibrationFlashIntensity = 0;
  }

  
  vibrationMotorA1 = vibrationFlashIntensity;
  vibrationMotorB1 = vibrationFlashIntensity;
  vibrationMotorB2 = vibrationFlashIntensity;
  vibrationMotorC1 = vibrationFlashIntensity;
  vibrationMotorD1 = vibrationFlashIntensity;
  vibrationMotorD2 = vibrationFlashIntensity;
  vibrationMotorE1 = vibrationFlashIntensity;
     
}


function swipeBeginningMood(){
  
  whichBeginningMood++;
  if(whichBeginningMood > 5) whichBeginningMood = 1;
  
  switch(whichBeginningMood){
    case 1:
      begginingMoodText = "Calm"
     beginningInhaleValue = 4;
     beginningExhaleValue = 6;
      
      beginningR = 86;
      beginningG = 139;
      beginningB = 34;
    
      break;
    case 2:
      begginingMoodText = "Relaxed"

      beginningInhaleValue = 4;
      beginningExhaleValue = 8;
      
      
        beginningR = 130;
        beginningG = 10;
        beginningB = 200;
      
      break;
    case 3:
      begginingMoodText = "Sleepy"
      
      beginningInhaleValue = 5;
      beginningExhaleValue = 15;
      
      beginningR = 20;
      beginningG = 0;
      beginningB = 170;
      
      break;
    case 4:
      begginingMoodText = "Active"

      
      beginningInhaleValue = 6;
      beginningExhaleValue = 2;
      
       interpolatebut1.r = 130;
        interpolatebut1.g = 10;
        interpolatebut1.b = 200;
      
       beginningR = 200;
       beginningG = 3;
       beginningB = 10;
      
      break;
    case 5:
      begginingMoodText = "Focused"

      
      beginningInhaleValue = 15;
      beginningExhaleValue = 15;
      
        beginningR = 200;
        beginningG = 190;
        beginningB = 10;
      
      
      break;    
  }
}

function swipeEndMood(){
  
  whichEndMood++;
  if(whichEndMood > 5) whichEndMood = 1;
  
  
  switch(whichEndMood){
    case 1:
      endMoodText = "Calm"
      
      endInhaleValue = 4;
      endExhaleValue = 6;
      
      
      endR = 86;
      endG = 139;
      endB = 34;
      break;
    case 2:
      endMoodText = "Relaxed"

      
      endInhaleValue = 4;
      endExhaleValue = 8;
      
        endR = 130;
        endG = 10;
        endB = 200;
      break;
    case 3:
      endMoodText = "Sleepy"

      endInhaleValue = 5;
      endExhaleValue = 15;
      
      endR = 20;
      endG = 0;
      endB = 170;
      break;
    case 4:
      endMoodText = "Active"
 
      endInhaleValue = 6;
      endExhaleValue = 2;
      
       endR = 200;
       endG = 3;
       endB = 10;
      break;
    case 5:
      endMoodText = "Focused"
      
      endInhaleValue = 15;
      endExhaleValue = 15;
      
        endR = 200;
        endG = 190;
        endB = 10;
      break;    
  }
}

function swipeJourneyDurationTime(){
  whichJourneyDuration++;
  if(whichJourneyDuration > 5) whichJourneyDuration = 1;
  
  
  switch(whichJourneyDuration){
    case 1:
      journeyDuration = 60;
      journeyDurationText = "1:00"
      break;
    case 2:
      journeyDuration = 90;
      journeyDurationText = "1:30"
      break;
    case 3:
      journeyDuration = 120;
      journeyDurationText = "2:00"
      break;
    case 4:
      journeyDuration = 160;
      journeyDurationText = "2:30"
      break;
    case 5:
      journeyDuration = 180;
      journeyDurationText = "3:00"
      break;    
  }
}


function sendValuesToArduino(){
      if(!port){
  }
  else{

      let view = new Uint8Array(7);
      view[0] = parseInt(255 * vibrationMotorA1);
      view[1] = parseInt(255 * vibrationMotorB1);
      view[2] = parseInt(255 * vibrationMotorB2);
      view[3] = parseInt(255 * vibrationMotorC1);
      view[4] = parseInt(255 * vibrationMotorD1);
      view[5] = parseInt(255 * vibrationMotorD2);
      view[6] = parseInt(255 * vibrationMotorE1);
      port.send(view);
  }
  }

function playSonicAvatar(){
  
  csound.Event("i" + whichRemoteInstrument + " 0 3");
  
}

//Sonic Avatar Creation
function swipeSonicAvatarAlgo(){
  whichRemoteInstrument++;
  
  if(whichRemoteInstrument > 4) whichRemoteInstrument = 2;

  switch(whichRemoteInstrument)
  {
      
    case 02:
      
      //whichRemoteInstrument = 2;
      sonicAvatarText = "Sizzling View";
      break;
    case 03:
      //whichRemoteInstrument = 3;
      sonicAvatarText = "Beyond Bells";
      break;
    case 04:
      //whichRemoteInstrument = 4;
      sonicAvatarText = "Crystal Droplets";
      break;
  }
  
}

//This is the algorithm should be called when a remote user joins
function remoteUserSoundAlgo(){
      
  

    if (frameCount % 6 == 0 ) {
      timer++;
    }
  
    if(timer > momentToPlay){
      timer = 0;
      momentToPlay = random()* 100;
      csound.Event("i" + whichRemoteInstrument + " 0 3");
      remoteNoteCounter++;
        if(remoteNoteCounter > bigGapThreshold){
      remoteNoteCounter = 0;
      //whichRemoteInstrument = int(random()*3) + 2;
      bigGapThreshold = random() * 5 + 2;
      momentToPlay = random()* 600 + 100;
      console.log(momentToPlay)
      } 
  
    }
  

}


function updateMode(){

    if(!interpolate)
    {
    interpolationValue = 0; 
      //console.log(interpolationValue)
    switch(mode){
      case 01:
     inhaleDuration = 4;
     exhaleDuration = 6;
        break;
      case 02:
      inhaleDuration = 4;
      exhaleDuration = 8;
        break;
      case 03:
      inhaleDuration = 5;
      exhaleDuration = 15;
        break;
      case 04:
      inhaleDuration = 6;
      exhaleDuration = 2;
        break;
      case 05:
      inhaleDuration = 15;
      exhaleDuration = 15;
        break;
      case 06:
        inhaleDuration = 30;
        exhaleDuration = 30;
        break;
        

    }
  }
    else
    {
      interpolationValue += (1/journeyDuration)/frameRate();

      
      interpolateR = beginningR * (1 - interpolationValue) + (endR * interpolationValue);
      interpolateG = beginningG * (1 - interpolationValue) + (endG * interpolationValue);      
      interpolateB = beginningB * (1 - interpolationValue) + (endB * interpolationValue); 

      bgColor = color(interpolateR,interpolateG,interpolateB);  


      //console.log( interpolationValue);
      
      inhaleDuration = beginningInhaleValue * (1 - interpolationValue) + (endInhaleValue * interpolationValue);
      exhaleDuration = beginningExhaleValue * (1 - interpolationValue) + (endExhaleValue * interpolationValue);
    }
  }

//This function gets called once breathing has started
function performBreathing(){
    
    updateMode();// This function does the interpolation
    csound.SetChannel("filter", 1500 * breathingValueSmoothed); //this sends the values of the breathing to the sound filter

    
    if(inhale){
      doInhale(inhaleDuration);
    }
    else if(!inhale){
      doExhale(exhaleDuration);
    }
    
    //This does makes the circle change size accounding to the breathing value
    noStroke();
    push()
    fill(bgColor)
    circle(100, width/2, 100 + breathingScaleRange*breathingValueSmoothed)
    pop()
    
  }

//This function calls the functions that performs breathing
function startBreathing(){
  breathingStarted = true;
  
  
  interpolationSpeed = 1/60;
  
  if(moduleDidLoadBool){
     csound.CompileOrc(document.getElementById('instruments').value);
        csound.Play();
      csound.Event("i1 0 10000000");

        csound.SetChannel("mute", 1);
        CsoundLoaded = true;
  }
  
}

//This function gets called when is time to inhale
function doInhale(duration1){
      let speed = 1/duration1;
      let frameIncrement = speed/frameRate();
      breathingValue += frameIncrement;


      if(breathingValue>= 1)
      {
        breathingValue = 1;
        inhale = false;
      }
      
  }

//This function gets called when is time to exhale
function doExhale(duration2){

    let speed = 1/duration2;
    let frameIncrement = speed/frameRate();
    breathingValue -= frameIncrement;

    if(breathingValue<= 0)
    {
      breathingValue = 0;
      inhale = true;
    }
  }


let port;



/// WEB USB CODE

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {

    function connect() {
      port.connect().then(() => {
        //statusDisplay.textContent = '';
        //connectButton.textContent = 'Disconnect';
        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          console.log(textDecoder.decode(data));
        }
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        //statusDisplay.textContent = error;
      });
    }



    // connectButton.addEventListener('click', function() {
    //   if (port) {
    //     port.disconnect();
    //     connectButton.textContent = 'Connect';
    //     statusDisplay.textContent = '';
    //     port = null;
    //   } else {
    //     serial.requestPort().then(selectedPort => {
    //       port = selectedPort;
    //       connect();
    //     }).catch(error => {
    //       statusDisplay.textContent = error;
    //     });
    //   }
    // });

    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        //statusDisplay.textContent = 'No device found.';
      } else {
        //statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });
  });
})();


///// CSOUND CODE

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source;

    var pre = document.querySelector('pre');
    var myScript = document.querySelector('script');
    var play = document.querySelector('.play');
    var stop = document.querySelector('.stop');
    var table;


    ///Declaring Variables
    
    let app;
    let isDoneLoading;
    let hasPlayed;
    let CsoundLoaded = false;
    let replaceXVal = 400;
    let replaceYVal = 400;
    
let moduleDidLoadBool = false;
    
function moduleDidLoad() {

                moduleDidLoadBool = true;   

    }

var started = false;

function Play() {
      if (started == false) {
        CsoundObj.CSOUND_AUDIO_CONTEXT.resume();
        started = true;

        //csound.Event("i1 0 1000");
        csound.Event("i1000 0 10000000");

      SetFilter()

      }



    }

function SetFilter(){

        csound.SetChannel("filter",((replaceXVal -100) * 25) + 0);
        csound.SetChannel("pwm", ((replaceXVal -150) / 200));

        //console.log(((replaceXVal -100) / 200));

        console.log("filter value is: " + ((replaceXVal -100) * 25) + 0) 
    console.log("pwm value is: " + ((replaceXVal -150) / 200))
    console.log("lfo value is: " + ((replaceYVal -50)/ 800)+ 0.13)
    console.log("lfoRange value is: " + (0.4-(((replaceYVal -50)/ 550)/4)))
    console.log("distort value is: " + ((replaceYVal -50)/ 550)*2)
    }

function SetLfo(){

    csound.SetChannel("lfo", ((50 -50)/ 800)+ 0.13);
    csound.SetChannel("lfoRange", 0.4-(((50 -50)/ 550)/4));
    csound.SetChannel("distort", ((50 -50)/ 550)*2);


    }

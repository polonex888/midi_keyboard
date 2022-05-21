'use strict';
let inputSelector = null;
let outputSelector = null;
let keys = null;
let midi={"inputs":[], "outputs":[]};
let Playing=[];
let outputSelectorIdx=-1;
let inputSelectorIdx=-1;
let sampleBuffer = null;
const NOTEON = 0x90;
const NOTEOFF = 0x80;
const MAX_VELOCITY = 127;

function load(){
    // MIDIデバイスへのアクセス要求
    navigator.requestMIDIAccess()
    // アクセス許可（成功）
    .then(requestSuccess)
    // アクセス拒否（失敗）
    .catch(e => {
        console.log(e);
    });

    loadSamples([samplePath]).then(buffers => {
        sampleBuffer = buffers.get(samplePath);
    });
}

function requestSuccess(access){
    let inputs = access.inputs.values();
    for (let entry of inputs){
        midi.inputs.push(entry);
    }
    let outputs = access.outputs.values();
    for(let entry of outputs){
        midi.outputs.push(entry);
    }

    // MIDI Inputデバイスのリスト表示と選択く時の処理
    for(var i=0; i<midi.inputs.length; i++) {
        inputSelector.options[i+1] = new Option(midi.inputs[i].name, i+1);
    }
    inputSelector.addEventListener("change", function(event){
        if(inputSelectorIdx!=-1) {
            midi.inputs[inputSelectorIdx].onmidimessage=null;
        }
        inputSelectorIdx=event.target.value-1;
        if(inputSelectorIdx!=-1){
            midi.inputs[inputSelectorIdx].onmidimessage=onMessage;
        }
        handleMessage();
    });

    // MIDI Outputデバイスのリスト表示と選択時の処理
    for(var i=0; i<midi.outputs.length; i++) {
        outputSelector.options[i+1] = new Option(midi.outputs[i].name, i+1);
    }
    outputSelector.addEventListener("change", function(event){
        outputSelectorIdx=event.target.value-1;
        handleMessage();
    });
    keysSetting();
    handleMessage();
}

//MIDIメッセージ（没）
function handleMIDIMessage(event) {
    switch (event.data[0] & 0xf0) {
        case NOTEON :
            noteOn();
            break;
        case NOTEOFF :
            noteoff();
            break;
        default :
            break;
    }
}
let thereBeSound = true;
//MIDIメッセージ（TODO）
function onMessage(msg) {
    console.log(msg.data);
    const type = msg.data[0];
    const note = msg.data[1];
    const velocity = msg.data[2];
    const key = document.getElementById('midi-' + note);
    console.log(key);
    if (!key) {
      return;
    }
    if (type === NOTEON) {
      if (velocity === 0) {
        key.classList.remove('activekey');
        if (Playing[note]) {
          stopSound(Playing[note]);
          delete Playing[note];
        }
      } else {
        if (thereBeSound && !Playing[note]) { // just play once
          console.log("playsound");
          Playing[note] = playSample(midi2rate(note), velocity / 127);
        }
        key.classList.add('activekey');  
      }
    }
    if (type === NOTEOFF) {
      key.classList.remove('activekey');
      if (Playing[note]) {
        stopSound(Playing[note]);
        delete Playing[note];
      }
    }
} 
function keysSetting(){
    keys.onmousedown = keys.ontouchstart = keys.ondblclick = e => {
        onMessage({data: [NOTEON, Number(e.target.id.replace('midi-', '')), MAX_VELOCITY]});
        e.target.classList.add('activekey');
    };
    
    keys.onmouseup = keys.ontouchend = e => {
        onMessage({data: [NOTEOFF, Number(e.target.id.replace('midi-', '')), MAX_VELOCITY]});
        e.target.classList.remove('activekey');
    };
    
    document.addEventListener('keydown', event => {
        const note = keysToMidi[event.key];
        if (note) {
        onMessage({data: [NOTEON, note, MAX_VELOCITY]});
        }
    }, false);

    document.addEventListener('keyup', event => {
        const note = keysToMidi[event.key];
        if (note) {
        onMessage({data: [NOTEOFF, note, MAX_VELOCITY]});
        }
    }, false);
}
const keysToMidi = {
    z: 48,
    s: 49,
    x: 50,
    d: 51,
    c: 52,
    v: 53,
    g: 54,
    b: 55,
    h: 56,
    n: 57,
    j: 58,
    m: 59,
    ',': 60,
    l: 61,
    '.': 62,
    q: 60,
    '2': 61,
    w: 62,
    '3': 63,
    e: 64,
    r: 65,
    '5': 66,
    t: 67,
    '6': 68,
    y: 69,
    '7': 70,
    u: 71,
    i: 72,
    '9': 73,
    o: 74,
    '0': 75,
    p: 76,
    '[': 77,
};
'use strict';
const audioCtx = window.AudioContext ? new AudioContext() : new webkitAudioContext();

const sampleMidi = 60;
const samplePath = './c4.mp3';
const attackTime = 0.005;
const releaseTime = 0.1;


function midi2rate(midi) {
    const interval = midi - sampleMidi;
    return Math.pow(2, interval / 12);   
}

function loadSamples(files) {
    return new Promise((resolve, reject) => {
        const buffers = new Map;
        files.forEach(element => {
            fetch(element)
                .then(res => res.arrayBuffer())
                .then(arrayBuffer => {
                    return audioCtx.decodeAudioData(arrayBuffer);
                })
                .then(audioBuffer => {
                    buffers.set(element, audioBuffer);
                    if (buffers.size === files.length) {
                        resolve(buffers);
                    }
                })
                .catch(e => console.log(e));
        });
    })
};

function playSample(rate, volume) {
    const sampleSource = audioCtx.createBufferSource();
    sampleSource.buffer = sampleBuffer;
    sampleSource.playbackRate.value = rate;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = volume;
    gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + attackTime);
    
    sampleSource.connect(gainNode);
    gainNode.connect(audioCtx.destination);
      
    sampleSource.start();
    return gainNode;
}

function stopSound(gainNode) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + releaseTime);
}
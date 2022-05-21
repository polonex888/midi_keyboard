'use strict';
let message; //ログ内容

//スクロール処理
function scrollToMid() {
    window.scrollTo((keys.offsetWidth - document.body.offsetWidth)/2, 0);    
}

//メッセージ表示処理（TODO:参照の関数化）
function handleMessage(){
    message.innerText = "input_device:";
//    message.innerText += midi.inputs[inputSelectorIdx].name;
    message.innerText += inputSelectorIdx;
    message.innerText += "\n";
    message.innerText += "output_device:";
//    message.innerText += midi.outputs[outputSelectorIdx].name;
    message.innerText += outputSelectorIdx;
    message.innerText += "\n"
}

//ウィンドウサイズ変更処理
window.addEventListener('resize', () => {
    setTimeout(scrollToMid, 100);
    setTimeout(() => {
        if(window.innerWidth === screen.width) {
            document.body.classList.add('fullscreen');
        } else {
            document.body.classList.remove('fullscreen');
        }
    }, 50);
});

//DOMロード後処理
window.addEventListener('DOMContentLoaded', () => {
	inputSelector = document.getElementById('input_selector');
	outputSelector = document.getElementById('output_selector');
	keys = document.getElementById('keys');
    message = document.getElementById('log');
    load();
});




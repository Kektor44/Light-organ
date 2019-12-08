const field = document.getElementById('field');
const searchValue = document.getElementById('searchValue');
const searchBtn = document.getElementById('searchBtn');
const audio = document.getElementById('audio');
const musicForms = document.getElementById('musicForms');
const inputFieldSize = document.getElementById('input-field-size');
const editSizeBtn = document.getElementById('editSizeBtn');
const nowPlayingInfo = document.getElementById('nowPlayingInfo');
const nowPlayingBlock = document.getElementById('nowPlayingBlock');
const trackInfo = document.getElementsByClassName('trackInfo');
let innerContainer;
let duration;
let order = 0;
let colorBlock;
let timer;

const editFieldSizeFn = () => {
  field.innerHTML = '';

  for (let i = 0; i < inputFieldSize.value * inputFieldSize.value; i++) {
    innerContainer = document.createElement('div');
    innerContainer.classList.add('inner-container');
    innerContainer.style.width = 100 / inputFieldSize.value + '%';
    innerContainer.style.height = 100 / inputFieldSize.value + '%';
    /*if (innerContainer.style.width < innerContainer.style.height){
      innerContainer.style.width = innerContainer.style.height
    } else {
      innerContainer.style.height = innerContainer.style.width
    }*/
    innerContainer.style.backgroundColor = colorBlock;
    field.appendChild(innerContainer);
  }

};
editSizeBtn.addEventListener('click', editFieldSizeFn);

for (let i = 0; i < 25; i++) {
  let div = document.createElement("div");
  div.classList.add('trackInfo');
  div.setAttribute('title', i + 1);
  musicForms.appendChild(div);
}

for (let i = 0; i < 144; i++) {
  innerContainer = document.createElement('div');
  innerContainer.classList.add('inner-container');
  innerContainer.style.backgroundColor = colorBlock;
  field.appendChild(innerContainer);
}

const block = document.getElementsByClassName('inner-container');

/*let promiseReq = new Promise((resolve, reject) => {*/
  const request = () => {
    musicForms.style.display = 'block';
    nowPlayingBlock.style.display = 'block';
    let data = null;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;



    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        const arr = JSON.parse(this.responseText);
        duration = arr.data[order].duration;
        console.log(arr);
        audio.src = arr.data[order].preview;
        console.log(order);
        nowPlayingInfo.innerHTML = '';
        nowPlayingInfo.innerHTML += arr.data[order].artist.name + '<br/>' + arr.data[order].album.title;
        for (let i = 0; i < arr.data.length; i++) {
          if (musicForms.childNodes.length !== arr.data.length) {
            trackInfo[i].innerHTML = [i + 1] + ') Artist: ' + arr.data[i].artist.name + '<br/>' + 'Name: ' + arr.data[i].album.title;
            trackInfo[i].style.borderTop = '2px solid grey';
          }

        }
      }
    });
    xhr.open("GET", "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + searchValue.value);
    xhr.setRequestHeader("x-rapidapi-host", "deezerdevs-deezer.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "d556ed49bamsh11f375fa68a80fbp14d9d9jsn5d442ccbe6e0");

    xhr.send(data);
  };
/*});*/
searchBtn.addEventListener('click', request);

const targetFn = (event) => {
  order = event.target.getAttribute('title') - 1;
  audio.setAttribute('autoplay', '');
  request();

};
for (let i = 0; i < trackInfo.length; i++) {
  trackInfo[i].addEventListener('click', targetFn);
}
audio.addEventListener('pause', () => clearInterval(timer))
// audio.addEventListener('play', () => {timer = setInterval(playMusicAnimation, 500)});



const audioCtx = window.AudioContext || window.webkitAudioContext;
let analyser;
let canvas;
let audioContext, canvasContext;
let width, height;
let dataArray, bufferLength;

window.onload = function() {
    audioContext= new audioCtx();
    canvas = document.querySelector("#myCanvas");
    width = canvas.width;
    height = canvas.height;
    canvasContext = canvas.getContext('2d');

    buildAudioGraph();
    requestAnimationFrame(visualize);
};
const buildAudioGraph = () => {
    audio.onplay = (e) => {audioContext.resume()};

    audio.addEventListener('play',() => audioContext.resume());

    const sourceNode =   audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();

    analyser.fftSize = 512;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    const playMusicAnimation = () => {

        for (let i = 0; i < block.length; i++) {
            colorBlock = 'rgb(' + dataArray[i] + ',' + 0 + ',' + 0 + ')';
            block[i].style.backgroundColor = colorBlock
        }
    };
    clearInterval(timer);
    timer = setInterval(playMusicAnimation, 33);

    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
};

function visualize() {
    canvasContext.clearRect(0, 0, width, height);
    analyser.getByteFrequencyData(dataArray);
    const barWidth = width / bufferLength;
    let barHeight;
    let x = 0;
    heightScale = height/128;

    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        canvasContext.fillStyle = 'rgb(' + (barHeight+0) + ',4,160)';
        barHeight *= heightScale;
        canvasContext.fillRect(x, height-barHeight/2, barWidth, barHeight/2);
        x += barWidth + 2;
    }
    requestAnimationFrame(visualize);

}


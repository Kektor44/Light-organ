const field = document.getElementById('field');
const searchValue = document.getElementById('searchValue');
const searchBtn = document.getElementById('searchBtn');
const audio = document.getElementById('audio');
const musicForms = document.getElementById('musicForms');
const inputFieldSize = document.getElementById('input-field-size');
const editSizeBtn = document.getElementById('editSizeBtn');
const nowPlayingInfo = document.getElementById('nowPlayingInfo');
const nowPlayingBlock = document.getElementById('nowPlayingBlock');
const settings = document.getElementById('settings');
const selectColor = document.getElementById('selectColor');
const inputRange = document.getElementById('inputRange');
const trackInfo = document.getElementsByClassName('trackInfo');
let innerContainer;
let order = 0;
let colorBlock;
let timer;
let defaultFieldSize = 16 * 9;
let quantitySongsReq = 25;

for (let i = 0; i < defaultFieldSize; i++) {
  innerContainer = document.createElement('div');
  innerContainer.classList.add('inner-container');
  innerContainer.style.backgroundColor = colorBlock;
  field.appendChild(innerContainer);
}
const block = document.getElementsByClassName('inner-container');

for (let i = 0; i < quantitySongsReq; i++) {
  let div = document.createElement("div");
  div.classList.add('trackInfo');
  div.setAttribute('title', i + 1);
  musicForms.appendChild(div);
}

const editFieldSizeFn = () => {
  field.innerHTML = '';
  let arrFieldSize = inputFieldSize.value.split('x');

  if(arrFieldSize[0] * arrFieldSize[1] < 190) {
    for (let i = 0; i < arrFieldSize[0] * arrFieldSize[1]; i++) {
      innerContainer = document.createElement('div');
      innerContainer.classList.add('inner-container');
      innerContainer.style.width = 100 / Number(arrFieldSize[0]) + '%';
      innerContainer.style.height = 100 / Number(arrFieldSize[1]) + '%';
      innerContainer.style.backgroundColor = colorBlock;
      field.appendChild(innerContainer);
    }
  } else {
    alert('Wrong input!! Use NUMxNUM format or less values.');
    audio.pause()
  }
};
editSizeBtn.addEventListener('click', editFieldSizeFn);

const request = () => {
  let data = null;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      musicForms.style.display = 'block';
      nowPlayingBlock.style.display = 'block';
      settings.style.display = 'block';
      const arr = JSON.parse(this.responseText);
      audio.src = arr.data[order].preview;
      nowPlayingInfo.innerHTML = '';
      nowPlayingInfo.innerHTML += arr.data[order].artist.name + '<br/>' + arr.data[order].album.title;
      for (let i = 0; i < arr.data.length; i++) {
        if (musicForms.childNodes.length !== arr.data.length) {
          trackInfo[i].innerHTML = [i + 1] + ') Artist: ' + arr.data[i].artist.name + '<br/>' + 'Name: ' + arr.data[i].album.title;
          if (trackInfo[i].innerHTML.length > 100) {
            trackInfo[i].innerHTML = trackInfo[i].innerHTML.slice(0, 97) + '...';
          }
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
searchBtn.addEventListener('click', request);

const targetFn = (event) => {
  order = event.target.getAttribute('title') - 1;
  audio.setAttribute('autoplay', '');
  request();
};

for (let i = 0; i < trackInfo.length; i++) {
  trackInfo[i].addEventListener('click', targetFn);
}

const audioCtx = window.AudioContext || window.webkitAudioContext;
let analyser;
let canvas;
let audioContext, canvasContext;
let width, height;
let dataArray, bufferLength;
let r, g, b;

window.onload = function () {
  audioContext = new audioCtx();
  canvas = document.querySelector("#myCanvas");
  width = canvas.width;
  height = canvas.height;
  canvasContext = canvas.getContext('2d');

  buildAudioGraph();
  requestAnimationFrame(visualize);
};
const buildAudioGraph = () => {
  audio.onplay = (e) => {
    audioContext.resume()
  };
  audio.addEventListener('play', () => audioContext.resume());

  const sourceNode = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
console.log(dataArray);
  const playMusicAnimation = () => {
    for (let i = 0; i < block.length; i++) {
      let dataColor = Math.ceil(dataArray[i] / inputRange.value) * inputRange.value;
      if (selectColor.options[selectColor.selectedIndex].value === 'red') {
        r = dataColor;
        g = 0;
        b = 0;
      }
      if (selectColor.options[selectColor.selectedIndex].value === 'green') {
        g = dataColor;
        r = 0;
        b = 0;
      }
      if (selectColor.options[selectColor.selectedIndex].value === 'blue') {
        g = 0;
        r = 0;
        b = dataColor;
      }
      if (selectColor.options[selectColor.selectedIndex].value === 'white') {
        b = dataColor;
        r = dataColor;
        g = dataColor;
      }
      if (selectColor.options[selectColor.selectedIndex].value === 'purple') {
        b = dataColor;
        r = dataColor;
        g = 0;
      }
      colorBlock = 'rgb(' + r + ',' + g + ',' + b + ')';
      block[i].style.backgroundColor = colorBlock
    }
  };
  clearInterval(timer);
  timer = setInterval(playMusicAnimation, 33);
  sourceNode.connect(analyser);
  analyser.connect(audioContext.destination);
};

const visualize = () => {
  canvasContext.clearRect(0, 0, width, height);
  analyser.getByteFrequencyData(dataArray);
  const barWidth = width / bufferLength;
  let barHeight;
  let x = 0;
  heightScale = height / 128;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    canvasContext.fillStyle = 'rgb(' + (barHeight + 0) + ',4,160)';
    barHeight *= heightScale;
    canvasContext.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);
    x += barWidth + 2;
  }
  requestAnimationFrame(visualize);
};

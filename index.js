const field = document.getElementById('field');
const searchValue = document.getElementById('searchValue');
const searchBtn = document.getElementById('searchBtn');
const audio = document.getElementById('audio');
const musicForms = document.getElementById('musicForms');
const inputFieldSize = document.getElementById('input-field-size');
const editSizeBtn = document.getElementById('editSizeBtn');
// const nowPlayingInfo = document.getElementById('nowPlayingInfo');
const trackInfo = document.getElementsByClassName('trackInfo');
let innerContainer;
let duration;
let timer;
let order = 0;
let colorBlock;

const editFieldSizeFn = () => {
  field.innerHTML = '';

  for (let i = 0; i < inputFieldSize.value * inputFieldSize.value; i++) {
    innerContainer = document.createElement('div');
    innerContainer.classList.add('inner-container');
    colorBlock = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    innerContainer.style.width = 100 / inputFieldSize.value + '%';
    innerContainer.style.height = 100 / inputFieldSize.value + '%';
    innerContainer.style.backgroundColor = colorBlock;

    innerContainer.innerHTML = i + 1;
    field.appendChild(innerContainer);
  }
  console.log(Number(inputFieldSize.value * inputFieldSize.value))

};
editSizeBtn.addEventListener('click', editFieldSizeFn);

for (let i = 0; i < 25; i++) {
  let div = document.createElement("div");
  div.classList.add('trackInfo');
  div.setAttribute('title', i);
  musicForms.appendChild(div);
}

for (let i = 0; i < 144; i++) {
  innerContainer = document.createElement('div');
  innerContainer.classList.add('inner-container');
  colorBlock = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
  innerContainer.style.backgroundColor = colorBlock;

  innerContainer.innerHTML = i + 1;
  field.appendChild(innerContainer);
}

const block = document.getElementsByClassName('inner-container');

const request = () => {
  musicForms.style.display = 'block';
  let data = null;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  const playMusicAnimation = () => {
    for (let i = 0; i < block.length; i++) {
      colorBlock = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
      block[i].style.backgroundColor = colorBlock
    }
  };
  setInterval(playMusicAnimation, 500);
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const arr = JSON.parse(this.responseText);
      duration = arr.data[order].duration;
      console.log(arr);
      audio.src = arr.data[order].preview;
      console.log(order);
      // nowPlayingInfo.innerHTML = arr.data[order].artist.name + '<br/>' + arr.data[order].album.title;
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

searchBtn.addEventListener('click', request);

const targetFn = (event) => {
  order = event.target.getAttribute('title');
  audio.setAttribute('autoplay', '');
  request();
  clearTimeout(timer);

};
for (let i = 0; i < trackInfo.length; i++) {
  trackInfo[i].addEventListener('click', targetFn);
}

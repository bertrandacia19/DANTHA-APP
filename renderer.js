const background = document.querySelector('#background'); // background derived from album cover below
const thumbnail = document.querySelector('#thumbnail'); // album cover 
const song = document.querySelector('#song'); // audio object
const Fs = require('fs');
const util = require('util');
var jsmediatags = require("jsmediatags");
const songArtist = document.querySelector('.song-artist'); // element where track artist appears
const songTitle = document.querySelector('.song-title'); // element where track title appears
const progressBar = document.querySelector('#progress-bar'); // element where progress bar appears
const navprogressBar = document.querySelector('nav #progress-bar')
const enlaces = document.getElementsByClassName('item-menu');
var archivos = 0;
const cancion = document.getElementById('Alitas0101');
let html = "";
const album = document.getElementById('album');

for (let i = 0; i < enlaces.length; i++) {
    enlaces[i].addEventListener('click', function(e) {
        cargar()
        e.preventDefault();
        const idElemento = e.currentTarget.getAttribute('data-elemento');
        console.log(idElemento);
        const paginas = document.getElementsByClassName('pagina');
        const canciones = document.getElementsByClassName('cancion');
        for (let j = 0; j < paginas.length; j++) {
            paginas[j].classList.add('esconder')
            for (let j = 0; j < canciones.length; j++) {
                canciones[j].classList.add('esconder')
            }
        }
        document.getElementById(idElemento).classList.remove('esconder');
        if(idElemento === "musica"){
            for (let j = 0; j < canciones.length; j++) {
                canciones[j].classList.remove('esconder')
            }
        }
    })        
}

let pPause = document.querySelector('#play-pause'); // element where play and pause image appears
songIndex = 0;
var songs = []; // object storing paths for audio objects


thumbnails = []; // object storing paths for album covers and backgrounds

var songArtists = []; // object storing track artists
var songTitles = []; // object storing track titles

// function where pp (play-pause) element changes based on playing boolean value - if play button clicked, change pp.src to pause button and call song.play() and vice versa.
const directoryPath = '/Users/Usuario/Music';
Fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 
  files.forEach(function (file) {
    if(file.indexOf(".mp3")=== -1){
      return
    }
    archivos += 1; 
    jsmediatags.read(directoryPath+"/"+file, {
      onSuccess: function(tag) {
        var image = tag.tags.picture;
        songs.push(`${directoryPath+"/"+file}`);
        songTitles.push(`${tag.tags.title ?? file}`);
        songArtists.push(`${tag.tags.artist ?? "no definido"}`);
          if (image) {
            var base64String = "";
            for (var i = 0; i < image.data.length; i++) {
                base64String += String.fromCharCode(image.data[i]);
            }
            var base64 = "data:" + image.format + ";base64," +
                    window.btoa(base64String);
                    thumbnails.push(`${base64}`);
          }else{
            thumbnails.push(`./assets/images/unknown.jpeg`)
          }
      },
      onError: function(error) {
        console.log(':(', error.type, error.info);
      }
    });
  });
  
  cargar_cancion()
});

function cargar() {
    for (var i = 0; i < songTitles.length; i++){
        html += "<div class=swiper-slide>";
        html += "<div class=imgBx id=SanBenito onclick=cargar_cancion()>";
        html += "<img src="+thumbnails[i]+">";
        html += "<h2 class= titulo>"+songTitles[i]+"</h2>";
        html += "<h3 class= art>"+songArtists[i]+"</h3>";
        html += "</div>";
        html += "</div>";
        console.log(html)
        
    }
    cancion.innerHTML = html;
    cargar_cancion()
}


let playing = true;
function playPause() {
    if (playing) {
        const song = document.querySelector('#song'),
        thumbnail = document.querySelector('#thumbnail');

        pPause.src = "./assets/icons/pause.png"
        thumbnail.style.transform = "scale(1.15)";
        
        song.play();
        playing = false;
    } else {
        pPause.src = "./assets/icons/play.png"
        thumbnail.style.transform = "scale(1)"
        
        song.pause();
        playing = true;
    }
}

// automatically play the next song at the end of the audio object's duration
song.addEventListener('ended', function(){
    nextSong();
});

// function where songIndex is incremented, song/thumbnail image/background image/song artist/song title changes to next index value, and playPause() runs to play next track 
function nextSong() {
    songIndex++;
    if (songIndex < archivos) {
        songIndex = 0;
    };
    song.src = songs[songIndex];
    thumbnail.src = thumbnails[songIndex];
    background.src = thumbnails[songIndex];
    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];
    playing = true;
    playPause();
}

// function where songIndex is decremented, song/thumbnail image/background image/song artist/song title changes to previous index value, and playPause() runs to play previous track 
function previousSong() {
    songIndex--;
    if (songIndex < 1) {
        songIndex = archivos;
    };
    song.src = songs[songIndex];
    thumbnail.src = thumbnails[songIndex];
    background.src = thumbnails[songIndex];
    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];
    playing = true;
    playPause();
}

// update progressBar.max to song object's duration, same for progressBar.value, update currentTime/duration DOM
function updateProgressValue() {
    progressBar.max = song.duration;
    progressBar.value = song.currentTime;
    document.querySelector('.currentTime').innerHTML = (formatTime(Math.floor(song.currentTime)));
    if (document.querySelector('.durationTime').innerHTML === "NaN:NaN") {
        document.querySelector('.durationTime').innerHTML = "0:00";
    } else {
        document.querySelector('.durationTime').innerHTML = (formatTime(Math.floor(song.duration)));
    }
};

// convert song.currentTime and song.duration into MM:SS format
function formatTime(seconds) {
    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));
    if (sec < 10){ 
        sec  = `0${sec}`;
    };
    return `${min}:${sec}`;
};

// run updateProgressValue function every 1/2 second to show change in progressBar and song.currentTime on the DOM
setInterval(updateProgressValue, 500);

// function where progressBar.value is changed when slider thumb is dragged without auto-playing audio
function changeProgressBar() {
    song.currentTime = progressBar.value;
};

const barra = document.getElementsByClassName('Down-Bar')
function cargar_cancion(){
    const canciones = document.getElementsByClassName('imgBx');
    const titulo = document.getElementsByClassName('titulo');
    for (let i = 0; i < canciones.length; i++) {
        canciones[i].addEventListener('click', function(e) {
            e.preventDefault();
            barra[0].setAttribute("style", "display: block;");
            var a = songTitles.indexOf(titulo[i].textContent)
            console.log(a)
            song.src = songs[a];
            thumbnail.src = thumbnails[a];
            background.src = thumbnails[a];
            songArtist.innerHTML = songArtists[a];
            songTitle.innerHTML = songTitles[a];
            playing = true;
            playPause();
        })
    }
    
}

/* $(window).resize(function(){
    $(window).height();
    $(window).width();
}); */


/* var content = document.getElementById('contenedor')
    content.style.display="none"
    setTimeout(function(){
      content.style.display="block"
    }, 5000) */


    window.onresize = doALoadOfStuff;

    function doALoadOfStuff() {
        //do a load of stuff
    }
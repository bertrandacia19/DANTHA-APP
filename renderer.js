const background = document.querySelector('#background'); 
const thumbnail = document.querySelector('#thumbnail'); 
const thumbnail2 = document.querySelector('menu img.thumbnail');
const song = document.querySelector('#song'); 
const Fs = require('fs');
const util = require('util');
var jsmediatags = require("jsmediatags");
const songArtist = document.querySelector('.song-artist'); 
const songTitle = document.querySelector('.song-title');
const songArtist2 = document.querySelector('.song-artist2'); 
const songTitle2 = document.querySelector('.song-title2'); 
const progressBar = document.querySelector('#progress-bar'); 
const Bar = document.querySelector('#bar'); 
const navprogressBar = document.querySelector('nav #progress-bar')
const navBar = document.querySelector('nav #bar')
const enlaces = document.getElementsByClassName('item-menu');
const albumes = document.getElementsByClassName('albumes');
const cantante = document.getElementsByClassName('artistas');
const genero_folder = document.getElementsByClassName('genero');
const casilla = document.getElementsByClassName('casilla')
const playlists = document.getElementsByClassName('playlist')
var archivos = 0;
const cancion = document.getElementById('musica');
let html = "";
const album = document.getElementById('album');
let html2 = "";
const artistas = document.getElementById('cantante');
let html3 = "";
const generos = document.getElementById('genero');
let html4 = "";
const playlis = document.getElementById('playlist');
let html5 = "";



for (let i = 0; i < enlaces.length; i++) {
    enlaces[i].addEventListener('click', function(e) {
        e.preventDefault();
        const idElemento = e.currentTarget.getAttribute('data-elemento');
        const paginas = document.getElementsByClassName('pagina');
        const canciones = document.getElementsByClassName('cancion');
        for (let j = 0; j < paginas.length; j++) {
            paginas[j].classList.add('esconder')
            for (let j = 0; j < canciones.length; j++) {
                canciones[j].classList.add('esconder')
            }
            for (let j = 0; j < albumes.length; j++) {
                albumes[j].classList.add('esconder')
            }
            for (let j = 0; j < cantante.length; j++) {
                cantante[j].classList.add('esconder')
            }
            for (let j = 0; j < genero_folder.length; j++) {
                genero_folder[j].classList.add('esconder')
            }
            for (let j = 0; j < casilla.length; j++) {
                casilla[j].classList.add('esconder')
            }
            for (let j = 0; j < playlists.length; j++) {
                playlists[j].classList.add('esconder')
            }
        }
        document.getElementById(idElemento).classList.remove('esconder');
        if(idElemento === "musica"){
            for (let j = 0; j < canciones.length; j++) {
                canciones[j].classList.remove('esconder')
            }
        }
        if(idElemento === "album"){
            for (let j = 0; j < albumes.length; j++) {
                albumes[j].classList.remove('esconder')
            }
        }
        if(idElemento === "cantante"){
            for (let j = 0; j < cantante.length; j++) {
                cantante[j].classList.remove('esconder')
            }
        }
        if(idElemento === "genero"){
            for (let j = 0; j < genero_folder.length; j++) {
                genero_folder[j].classList.remove('esconder')
            }
        }
        if(idElemento === "playlist"){
            for (let j = 0; j < casilla.length; j++) {
                casilla[j].classList.remove('esconder')
            }
            for (let j = 0; j < playlists.length; j++) {
                playlists[j].classList.remove('esconder')
            }
        }
    })        
}

let pPause = document.querySelector('#play-pause'); // element where play and pause image appears
let pPause1 = document.querySelector('menu #play-pause'); // element where play and pause image appears
songIndex = 0;
var songs = []; // object storing paths for audio objects
var distinct = [];
var albums = [];
var genero_dist = [];
var genero = [];
thumbnails = []; // object storing paths for album covers and backgrounds
var cantantes = [];
var songArtists = []; // object storing track artists
var songTitles = []; // object storing track titles

// function where pp (play-pause) element changes based on playing boolean value - if play button clicked, change pp.src to pause button and call song.play() and vice versa.
const directoryPath = '/Users/Usuario/Music';

function browseResult(e){
    var fileselector = document.getElementById('fileselector');
    console.log(fileselector.value);
  }

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
        albums.push(`${tag.tags.album ?? "no definido"}`);
        genero.push(`${tag.tags.genre ?? "no definido"}`);
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
        html += "<div class=cancion onclick=cargar_cancion()>";
        html += "<img src="+thumbnails[i]+">";
        html += "<h2 class= titulo>"+songTitles[i]+"</h2>";
        html += "<h3 class= art>"+songArtists[i]+"</h3>";
        html += "</div>";
    }
    cancion.innerHTML = html;
    cargar_album();
    cargar_cantantes();
    cargar_genero();
    crear_playlist();
    cargar_playlist();
    cargar_cancion();
    song.src = songs[songIndex];
    thumbnail.src = thumbnails[songIndex];
    background.src = thumbnails[songIndex];
    thumbnail2.src = thumbnails[songIndex];
    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];
    songArtist2.innerHTML = songArtists[songIndex];
    songTitle2.innerHTML = songTitles[songIndex];
}


let playing = true;
function playPause() {
    if (playing) {
        const song = document.querySelector('#song'),
        thumbnail = document.querySelector('#thumbnail');
                                         
        pPause.src = "./assets/icons/pause.png"
        thumbnail.style.transform = "scale(1.15)";
        
        pPause1.src = "./assets/icons/pause.png"
        thumbnail2.style.transform = "scale(1.15)";

        song.play();
        playing = false;
    } else {
        pPause.src = "./assets/icons/play.png"
        thumbnail.style.transform = "scale(1)"

        pPause1.src = "./assets/icons/play.png"
        thumbnail2.style.transform = "scale(1)"
        
        song.pause();
        playing = true;
    }
}

var count = 0;
var start = false;
function cargar_album(){
    for(let i = 0;i<albums.length; i++){
        for(let j = 0;j<albums.length; j++){
            if(albums[i] === distinct[j]){
                start = true;
            }
        }
        count++; 
        if (count == 1 && start == false) { 
            distinct.push(albums[i]); 
        } 
        start = false; 
        count = 0; 
    }
    for(let j = 0;j<distinct.length; j++){
        var cont = 0;
        html2 += "<div class=albumes>"
        for (let i = 0; i < songTitles.length; i++){
            if(distinct[j] === albums[i] && cont == 0){
                html2 += "<img src="+thumbnails[i]+">";
                cont++
            }
        }
        html2 += "<h2 class= titulo>"+distinct[j]+"</h2>";
        for (var i = 0; i < songTitles.length; i++){
            if(distinct[j] === albums[i]){
                html2 += "<div class=esconder onclick=cargar_cancion()>";
                html2 += "<img src="+thumbnails[i]+">";
                html2 += "<h2 class= titulo>"+songTitles[i]+"</h2>";
                html2 += "<h3 class= art>"+songArtists[i]+"</h3>";
                html2 += "</div>";
            }
        }
        html2 +="</div>"
    }
    album.innerHTML = html2;
    for (let j = 0; j < albumes.length; j++) {
        albumes[j].classList.add('esconder');
    }
    cargar_cancion()
}

var count2 = 0;
var start2 = false;
function cargar_cantantes(){
    for(let i = 0;i<songArtists.length; i++){
        for(let j = 0;j<songArtists.length; j++){
            if(songArtists[i] === cantantes[j]){
                start2 = true;
            }
        }
        count2++; 
        if (count2 == 1 && start2 == false) { 
            cantantes.push(songArtists[i]); 
        } 
        start2 = false; 
        count2 = 0; 
    }
    for(let j = 0;j<cantantes.length; j++){
        var cont = 0;
        html3 += "<div class=artistas>"
        for (let i = 0; i < songTitles.length; i++){
            if(cantantes[j] === songArtists[i] && cont == 0){
                html3 += "<img src="+thumbnails[i]+">";
                cont++
            }
        }
        html3 += "<h2 class= titulo>"+cantantes[j]+"</h2>";
        for (var i = 0; i < songTitles.length; i++){
            if(cantantes[j] === songArtists[i]){
                html3 += "<div class=esconder onclick=cargar_cancion()>";
                html3 += "<img src="+thumbnails[i]+">";
                html3 += "<h2 class= titulo>"+songTitles[i]+"</h2>";
                html3 += "<h3 class= art>"+songArtists[i]+"</h3>";
                html3 += "</div>";
            }
        }
        html3 +="</div>"
    }
    artistas.innerHTML = html3;
    for (let j = 0; j < cantante.length; j++) {
        cantante[j].classList.add('esconder');
    }
    cargar_cancion()
}

var count3 = 0;
var start3 = false;
function cargar_genero(){
    for(let i = 0;i<genero.length; i++){
        for(let j = 0;j<genero.length; j++){
            if(genero[i] === genero_dist[j]){
                start3 = true;
            }
        }
        count3++; 
        if (count3 == 1 && start3 == false) { 
            genero_dist.push(genero[i]); 
        } 
        start3 = false; 
        count3 = 0; 
    }
    for(let j = 0;j<genero_dist.length; j++){
        var cont = 0;
        html4 += "<div class=genero>"
        for (let i = 0; i < songTitles.length; i++){
            if(genero_dist[j] === genero[i] && cont == 0){
                html4 += "<img src="+thumbnails[i]+">";
                cont++
            }
        }
        html4 += "<h2 class= titulo>"+genero_dist[j]+"</h2>";
        for (var i = 0; i < songTitles.length; i++){
            if(genero_dist[j] === genero[i]){
                html4 += "<div class=esconder onclick=cargar_cancion()>";
                html4 += "<img src="+thumbnails[i]+">";
                html4 += "<h2 class= titulo>"+songTitles[i]+"</h2>";
                html4 += "<h3 class= art>"+songArtists[i]+"</h3>";
                html4 += "</div>";
            }
        }
        html4 +="</div>"
    }
    generos.innerHTML = html4;
    for (let j = 0; j < genero_folder.length; j++) {
        genero_folder[j].classList.add('esconder');
    }
    cargar_cancion()
}

function crear_playlist(){
    html5 += "<input class=casilla type=button id=Guardar value=Guardar onclick=crear()>"
    html5 += "<input class=casilla type=text id=Nombre_playlist>"
    for (var i = 0; i < songTitles.length; i++){
        html5 += "<div class=casilla>";
        html5 += "<input type=checkbox class=checked>";
        html5 += "<p class=titulo>"+songTitles[i]+"</p>";
        html5 += "</div>";
    }
    playlis.innerHTML = html5;
    for (let j = 0; j < casilla.length; j++) {
        casilla[j].classList.add('esconder');
    }
}
var content = "";
function crear(){
    const checkbox = document.getElementsByClassName('checked');
    const rola = document.getElementById('Nombre_playlist');
    Fs.open("./Playlist/"+rola.value+".txt", 'a', function(err,archivo){
        if(err){
            return;
        }
        var linea = "";
        for(let i = 0; i < checkbox.length; i++){
            if(checkbox[i].checked == true){
                linea += ""+songTitles[i]+"\n";
            }
        }
        Fs.write(archivo, linea, function(err,writeten,string){
            if(err){
                return;
            }
        })
        Fs.readFile("./Playlist/"+rola.value+".txt", "utf8", function read(err, data) {
            if (err) {
                throw err;
            }
            content = data.split("\n");
            console.log(content);
        });
    });
    cargar_playlist()
}

const playli_final = document.getElementById('playlists');
function cargar_playlist(){
    Fs.readdir('./Playlist', function (err, files) {
        if (err) {
          return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            let html6 = "";
          if(file.indexOf(".txt")=== -1){
            return
          }
          html6 += "<div class=playlist>"
          var playlis_songs = ""; 
          var cont = 0;
          Fs.readFile("./Playlist/"+file+"", "utf8", function read(err, data) {
            if (err) {
                throw err;
            }
            playlis_songs = data.split("\n");
            for(let j = 0;j<playlis_songs.length; j++){
                for (let i = 0; i < songTitles.length; i++){
                    if(playlis_songs[j] === songTitles[i] && cont == 0){
                        html6 += "<img src="+thumbnails[i]+">";
                        html6 += "<h2 class= titulo>"+file.substr(0, file.lastIndexOf('.'))+"</h2>";
                        cont++
                    }
                }
                for (var i = 0; i < songTitles.length; i++){
                    if(playlis_songs[j] === songTitles[i]){
                        html6 += "<div class=esconder onclick=cargar_cancion()>";
                        html6 += "<img src="+thumbnails[i]+">";
                        html6 += "<h2 class= titulo>"+songTitles[i]+"</h2>";
                        html6 += "<h3 class= art>"+songArtists[i]+"</h3>";
                        html6 += "</div>";
                    }
                }
            }
            html6 +="</div>"
            playlis.innerHTML += html6;
            });
        });
    });
}

// automatically play the next song at the end of the audio object's duration
song.addEventListener('ended', function(){
    nextSong();
});

// function where songIndex is incremented, song/thumbnail image/background image/song artist/song title changes to next index value, and playPause() runs to play next track 
function nextSong() {
    songIndex++;
    if (songIndex >= archivos) {
        songIndex = 0;
    };
    song.src = songs[songIndex];
    thumbnail.src = thumbnails[songIndex];
    background.src = thumbnails[songIndex];
    thumbnail2.src = thumbnails[songIndex];
    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];
    songArtist2.innerHTML = songArtists[songIndex];
    songTitle2.innerHTML = songTitles[songIndex];
    playing = true;
    playPause();
    for (let i = 0; i<movimiento.length; i++){
         movimiento[i].removeAttribute("behavior")
         movimiento[i].removeAttribute("scrollamount")
         movimiento[i].removeAttribute("direction")
        
         console.log(movimiento[i])
    }
}
var movimiento = document.getElementsByClassName("move")

// function where songIndex is decremented, song/thumbnail image/background image/song artist/song title changes to previous index value, and playPause() runs to play previous track 
function previousSong() {
    songIndex--;
    if (songIndex <= 0) {
        songIndex = archivos - 1;
    };
    song.src = songs[songIndex];
    thumbnail.src = thumbnails[songIndex];
    background.src = thumbnails[songIndex];
    thumbnail2.src = thumbnails[songIndex];
    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];
    songArtist2.innerHTML = songArtists[songIndex];
    songTitle2.innerHTML = songTitles[songIndex];
    playing = true;
    playPause();
}

// update progressBar.max to song object's duration, same for progressBar.value, update currentTime/duration DOM
function updateProgressValue() {
    progressBar.max = song.duration;
    progressBar.value = song.currentTime;
    Bar.max = song.duration;
    Bar.value = song.currentTime;
    
    document.querySelector('.currentTime').innerHTML = (formatTime(Math.floor(song.currentTime)));
    tiempo_inicial[1].innerHTML = (formatTime(Math.floor(song.currentTime)));
    if (document.querySelector('.durationTime').innerHTML === "NaN:NaN") {
        document.querySelector('.durationTime').innerHTML = "0:00";
        tiempo[1].innerHTML = "0:00";
    } else {
        document.querySelector('.durationTime').innerHTML = (formatTime(Math.floor(song.duration)));
        tiempo[1].innerHTML = (formatTime(Math.floor(song.duration)));
    }
};
var tiempo_inicial = document.getElementsByClassName('currentTime');
var tiempo = document.getElementsByClassName('durationTime');
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
    song.currentTime = progressBar.value,bar.value;
};


const barra = document.getElementsByClassName('Down-Bar')
function cargar_cancion(){
    const canciones = document.getElementsByClassName('cancion');
    const titulo = document.getElementsByClassName('titulo');
    for (let i = 0; i < canciones.length; i++) {
        canciones[i].addEventListener('click', function(e) {
            e.preventDefault();
            barra[0].setAttribute("style", "display: block;");
            var a = songTitles.indexOf(titulo[i].textContent)
            songIndex = a
            song.src = songs[a];
            thumbnail.src = thumbnails[a];
            background.src = thumbnails[a];
            thumbnail2.src = thumbnails[a];
            songArtist.innerHTML = songArtists[a];
            songTitle.innerHTML = songTitles[a];
            songArtist2.innerHTML = songArtists[a];
            songTitle2.innerHTML = songTitles[a];
            playing = true;
            playPause();
        })
    }
}

function SetVolume(val){
    const volumen = document.getElementById('song')
    volumen.volume = val / 100;
}

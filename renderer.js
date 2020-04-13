const background = document.querySelector('#background'); // background derived from album cover below
const thumbnail = document.querySelector('#thumbnail'); // album cover 
const song = document.querySelector('#song'); // audio object

const songArtist = document.querySelector('.song-artist'); // element where track artist appears
const songTitle = document.querySelector('.song-title'); // element where track title appears
const progressBar = document.querySelector('#progress-bar'); // element where progress bar appears
const navprogressBar = document.querySelector('nav #progress-bar')
const Bar = document.querySelector('#bar'); // element where progress bar appears
const navBar = document.querySelector('nav #bar')
const enlaces = document.getElementsByClassName('item-menu');
for (let i = 0; i < enlaces.length; i++) {
    enlaces[i].addEventListener('click', function(e) {
        e.preventDefault();
        const idElemento = e.currentTarget.getAttribute('data-elemento');
        console.log(idElemento);
        const paginas = document.getElementsByClassName('pagina');
        for (let j = 0; j < paginas.length; j++) {
            paginas[j].classList.add('esconder')
        }
        document.getElementById(idElemento).classList.remove('esconder');
        
    })
    
}


let pPause = document.querySelector('#play-pause'); // element where play and pause image appears
songIndex = 0;
songs = ['./assets/music/the_weeknd_blinding_lights_lyrics_mp3_4961.mp3','./assets/music/avicii_ft._nicky_romero_i_could_be_the_one_lyrics_mp3_83879.mp3', './assets/music/blame.mp3', './assets/music/dontstartnow.mp3', './assets/music/Calvin Harris - Outside (Official Video) ft. Ellie Goulding (MUSICAQ).mp3', './assets/music/SAINt JHN - ROSES (IMANBEK REMIX) (MUSICAQ).mp3', './assets/music/Tones and I - Dance Monkey (Lyrics) 🎵 (MUSICAQ).mp3']; // object storing paths for audio objects


thumbnails = ['./assets/images/blinding.jpg','./assets/images/avicii.jpg', './assets/images/71CQOBu6sWL._SS500_.jpg', './assets/images/dontstartnow.png', './assets/images/outside.png', './assets/images/roses.jpg', './assets/images/DanceMonkey.jpg']; // object storing paths for album covers and backgrounds

songArtists = ["The Weeknd",'Avicii vs Nicky Romero', 'Calvin Harris', 'Dua Lipa', 'Calvin Harris', 'SAINt JHN', 'Tones & I']; // object storing track artists
songTitles = ["Blinding Lights","I could be the one","Blame", "Don't Start Now", "Outside", "Imanbek Remix", "Dance Monkey", ]; // object storing track titles

// function where pp (play-pause) element changes based on playing boolean value - if play button clicked, change pp.src to pause button and call song.play() and vice versa.
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
    if (songIndex < 0) {
        songIndex = 5;
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
    if (songIndex < 0) {
        songIndex = 5;
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
    Bar.max = song.duration;
    Bar.value = song.currentTime;
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
    song.currentTime = progressBar.value, Bar.value;
};









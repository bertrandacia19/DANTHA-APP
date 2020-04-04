const Fs = require('fs')
const util = require('util');
var mp3Duration = require('mp3-duration');
var jsmediatags = require("jsmediatags");
const cancion = document.getElementById('cancion');


function createdDate (file) {  
  const { birthtime } = Fs.statSync(file)
  return birthtime
}

mp3Duration('./musica/JekK_-_You_and_Me.mp3', function (err, duration) {
  if (err) return console.log(err.message);
  let html = '<div id="cancion">';
  html += `<h4>${time_convert(duration)}</h4>`;
  html += "</div>"
  cancion.innerHTML = html;
});

function time_convert(num)
 { 
  var minutes = Math.floor(num / 60);
  var residual = Math.floor(num % 60);
  if(residual < 10){
    seconds = "0"+residual+""
    return minutes + ":" + seconds;
  }else{
    return minutes + ":" + residual;
  }
           
}


document.addEventListener("DOMContentLoaded", function() { startplayer(); }, false);
var player;

function startplayer() 
{
 player = document.getElementById('music_player');
 player.controls = false;
}

function play_aud() 
{
 player.play();
} 
function pause_aud() 
{
 player.pause();
}
function stop_aud() 
{
 player.pause();
 player.currentTime = 0;
}
function change_vol()
{
 player.volume=document.getElementById("change_vol").value;
}

const directoryPath = '/Users/Usuario/Music';
Fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 
  let html = '<div id="cancion">';
  files.forEach(function (file) {
    if(file.indexOf(".mp3")=== -1){
      return
    }
    jsmediatags.read(directoryPath+"/"+file, {
      onSuccess: function(tag) {
        console.log(tag);
        var image = tag.tags.picture;
        html += `<h1 class="title">${tag.tags.title ?? "no definido"}</h1>`;
        html += `<h2 class="artist">${tag.tags.artist ?? "no definido"}</h2>`;
        mp3Duration(directoryPath+"/"+file, function (err, duration) {
          if (err) return console.log(err.message);
          html += `<h4 class="tiempo">${time_convert(duration)}</h4>`;
        });
          if (image) {
            var base64String = "";
            for (var i = 0; i < image.data.length; i++) {
                base64String += String.fromCharCode(image.data[i]);
            }
            var base64 = "data:" + image.format + ";base64," +
                    window.btoa(base64String);
            html += `<img src="${base64}" class="picture">`
          }
      },
      onError: function(error) {
        console.log(':(', error.type, error.info);
      }
    });
  });
  html +="</div>"
  console.log(html);
  cancion.innerHTML = html;
});

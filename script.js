
var spotifyApi = new SpotifyWebApi();
spotifyApi.getToken().then(function(response) {
  spotifyApi.setAccessToken(response.token);
});


// DIVS del HTML
var queryInput = document.querySelector('#query'),
    result = document.querySelector('#result'),
    text = document.querySelector('#text'),
    info = document.querySelector('#info'),
    audioTag = document.querySelector('#audio'),
    caratula = document.querySelector('#caratula'),
    playButton = document.querySelector('#play_music');


function update_play_pausa() {


        playButton.innerHTML = audioTag.paused ? 'Play' : 'Pause';
        playButton.classList = audioTag.paused ? 'boton button special icon fa-play' : 'boton button special icon fa-pause';




}

audioTag.addEventListener('play', update_play_pausa);
audioTag.addEventListener('playing', update_play_pausa);
audioTag.addEventListener('pause', update_play_pausa);
audioTag.addEventListener('ended', update_play_pausa);

playButton.addEventListener('click', function() {
  if (audioTag.paused) {
    audioTag.play();
  } else {
    audioTag.pause();
  }
});

result.style.display = 'none';

document.querySelector('form').addEventListener('submit', hello);

function hello (formEvent) {
  formEvent.preventDefault();
  result.style.display = 'none';
  var song = 'Thunderstruck'

  spotifyApi.searchTracks(song.trim(), {limit: 1})
    .then(function(results) {
      var track = results.tracks.items[0];


      // Obtenim les Audio Features
    spotifyApi.getAudioFeaturesForTrack(track.id)
        .then(function(results) {
            var afeature = results.audio_features[0];






      // Selecció de la preview de la música
      if (track.preview_url != null) var previewUrl = track.preview_url;
      else var previewUrl = "./assets/audio.mp3";
      audioTag.src = previewUrl;



      // Iniciem la request
      var request = new XMLHttpRequest();
      request.open('GET', previewUrl, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {


          text.innerHTML = '<h2>' + track.name + '<br></h2>' +
            '<h3>' + track.artists[0].name + '</h3>';

          caratula.src = track.album.images[1].url;

        info.innerHTML = 'Energy: ' + afeature.energy*100 + '% <br>'
    + 'Danceability: ' + afeature.danceability*100 + '%';

          result.style.display = 'block';



      };
      request.send();
    });
          });
};

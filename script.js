
var spotifyApi = new SpotifyWebApi();
spotifyApi.getToken().then(function(response) {
  spotifyApi.setAccessToken(response.token);
});

var queryInput = document.querySelector('#query'),
    result = document.querySelector('#result'),
    text = document.querySelector('#text'),
    audioTag = document.querySelector('#audio'),
    playButton = document.querySelector('#play');

function updateProgressState() {
  if (audioTag.paused) {
    return;
  }
  var progressIndicator = document.querySelector('#progress');
  if (progressIndicator && audioTag.duration) {
    progressIndicator.setAttribute('x', (audioTag.currentTime * 100 / audioTag.duration) + '%');
  }
  requestAnimationFrame(updateProgressState);
}

audioTag.addEventListener('play', updateProgressState);
audioTag.addEventListener('playing', updateProgressState);

function updatePlayLabel() {
  playButton.innerHTML = audioTag.paused ? 'Play track' : 'Pause track';
   
}

audioTag.addEventListener('play', updatePlayLabel);
audioTag.addEventListener('playing', updatePlayLabel);
audioTag.addEventListener('pause', updatePlayLabel);
audioTag.addEventListener('ended', updatePlayLabel);

playButton.addEventListener('click', function() {
  if (audioTag.paused) {
    audioTag.play();
  } else {
    audioTag.pause();
  }
});

result.style.display = 'none';



document.querySelector('form').addEventListener('submit', function(formEvent) {
  formEvent.preventDefault();
  result.style.display = 'none';
  spotifyApi.searchTracks(
    queryInput.value.trim(), {limit: 1})
    .then(function(results) {
      var track = results.tracks.items[0];
      

    
      
    if (track.preview_url != null) var previewUrl = track.preview_url;
    else var previewUrl = "./assets/audio.mp3";
      
      audioTag.src = previewUrl;

      var request = new XMLHttpRequest();
      request.open('GET', previewUrl, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {

        // Create offline context
        var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        var offlineContext = new OfflineContext(2, 30 * 44100, 44100);

        offlineContext.decodeAudioData(request.response, function(buffer) {

          // Create buffer source
          var source = offlineContext.createBufferSource();
          source.buffer = buffer;

          source.start(0);
          offlineContext.startRendering();
        });

        offlineContext.oncomplete = function(e) {
          var buffer = e.renderedBuffer;
         

          text.innerHTML = '<div><h2>' + track.name + '<br></h2>' +
            '<h3>' + track.artists[0].name + '</h3>';

          text.innerHTML += '<div class="small">'  + '<img src="' + results.tracks.items[0].album.images[1].url + '">'
            
            '</div>';

         
          result.style.display = 'block';
        };
      };
      request.send();
    });
});
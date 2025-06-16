
let nameElem = document.getElementById("beat-name-h1");


function downloadMP3() {
    const link = document.createElement('a');
    link.href = '/download';
    link.download = 'download'; // Not strictly necessary — server sets filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

var wavesurfer = WaveSurfer.create({
    container: "#wave-div",
    waveColor: "#0BFFC2",
    progressColor: "#FF9305",
    width: 450,
    barWidth: 4,
    barGap: 1.5,
    cursorWidth: 0,
     hideScrollbar: true,
});

var playButton = document.getElementById("play-button");
let isPlaying = false;

// Fetch the audio filename from JSON and create Audio object
fetch('/data.json')
  .then(response => response.json())
  .then(data => {
    wavesurfer.load('/downy/' + data.current_audio); // !!
    nameElem.innerText =  data.current_audio;
  })
  .catch(err => console.error('Failed to load audio file from JSON:', err));

  // loop audio
  wavesurfer.on('finish', () => {
  wavesurfer.play();
});

function playAudio(){
  if(isPlaying){
    playButton.src = '/images/play-button.png';
    wavesurfer.pause(); // ✅ Pause WaveSurfer
    isPlaying = false;
  }
  else{
    playButton.src = '/images/pause-button.png';
    wavesurfer.play(); // ✅ Play WaveSurfer
    isPlaying = true;
  }
}

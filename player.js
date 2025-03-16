const musicFolder = "Music/";  // Dossier contenant les musiques
const trackList = [
    "BEENDO Z - PAS BÊTE.mp3",
    "Camila Cabello - Shameless (Official Video).mp3",
    "Can't Hold Us - Macklemore & Ryan Lewis (feat. Ray Dalton).mp3",
    "CAN'T HOLD 17% - LETO X MACKLEMORE.mp3",
    "Dakiti-speed up [Bad Bunny].mp3",
    "DARK ARIA.mp3",
    "Egzod & Maestro Chives - Royalty (ft. Neoni) [Official Lyric Video].mp3",
    "La vie qu'on mène.mp3",
    "My Hero Academia OST - You Say Run.mp3",
    "One Punch Man OST - Seigi Shikkou (Original).mp3"
];

let currentTrackIndex = 0;

const audio = new Audio();
const playPauseBtn = document.getElementById("play-pause");
const prevTrackBtn = document.getElementById("prev-track");
const nextTrackBtn = document.getElementById("next-track");
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");
const trackInfo = document.getElementById("track-info");

function loadTrack(index) {
    if (index < 0) index = trackList.length - 1;
    if (index >= trackList.length) index = 0;
    currentTrackIndex = index;

    let trackName = trackList[currentTrackIndex].replace(".mp3", "");
    trackInfo.textContent = trackName;

    audio.src = musicFolder + encodeURIComponent(trackList[currentTrackIndex]);
    audio.load();
    audio.play();
    playPauseBtn.textContent = "⏸";
}

playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = "⏸";
    } else {
        audio.pause();
        playPauseBtn.textContent = "▶";
    }
});

prevTrackBtn.addEventListener("click", () => {
    loadTrack(currentTrackIndex - 1);
});

nextTrackBtn.addEventListener("click", () => {
    loadTrack(currentTrackIndex + 1);
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        totalTimeDisplay.textContent = formatTime(audio.duration);
    }
});

progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
    loadTrack(currentTrackIndex + 1);
});

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Charger et lire la première piste
loadTrack(currentTrackIndex);

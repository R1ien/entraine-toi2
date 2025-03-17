const exercises = [
    { name: "Jumping Jacks", reps: 60 }, // 1 minute = 60 secondes
    { name: "Burpees", reps: 60 }, // 1 minute = 60 secondes
    { name: "Grip (poids à augmenter)", reps: "Variable" },
    { name: "Traction", reps: 4  },
    { name: "Rowing inversé", reps: 10  },
    { name: "Traction biceps", reps: 4 },
    { name: "Rester sur la barre", reps: 15 }, // 15 secondes
    { name: "Dips", reps: 8 },
    { name: "Pompes", reps: 15  },
    { name: "Pompe incliné", reps: 20 },
    { name: "Pompe décliné", reps: 16  },
    { name: "Pompe serré", reps: 15 },
    { name: "Squat", reps: 30 },
    { name: "Fente alternée", reps: 25  },
    { name: "Abdos crunchs", reps: 10  },
    { name: "Abdos levée", reps: 10  },
    { name: "Gainage", reps: 1 } // 1 minute = 60 secondes
];

// Récupérer les éléments de la page
const exercisesList = document.getElementById("exercises-list");
const editBox = document.getElementById("edit-box");
const exerciseName = document.getElementById("exercise-name");
const newRepsInput = document.getElementById("new-reps");
const saveEditBtn = document.getElementById("save-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

let currentEditIndex = null;

// Charger les exercices dans la liste
function loadExercises() {
    exercisesList.innerHTML = "";
    exercises.forEach((ex, index) => {
        let savedReps = localStorage.getItem(`exercise_${index}`) || ex.reps;
        let checked = localStorage.getItem(`checked_${index}`) === "true";

        // Pour les exercices de type "min" et "s", on ajoute "min" ou "s" selon le cas
        if (ex.name === "Jumping Jacks" || ex.name === "Burpees" || ex.name === "Gainage") {
            savedReps = `${savedReps} min`;
        } else if (ex.name === "Rester sur la barre") {
            savedReps = `${savedReps} s`;
        }

        const li = document.createElement("li");
        li.innerHTML = `
            <span>${ex.name} - ${savedReps}</span>
            <div>
                <button class="edit-btn" data-index="${index}">Modifier</button>
                <input type="checkbox" ${checked ? "checked" : ""} data-index="${index}">
            </div>
        `;
        exercisesList.appendChild(li);
    });
}

// Ouvrir la boîte de modification
exercisesList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        currentEditIndex = e.target.dataset.index;
        exerciseName.textContent = exercises[currentEditIndex].name;

        let savedReps = localStorage.getItem(`exercise_${currentEditIndex}`) || exercises[currentEditIndex].reps;

        // Afficher la valeur de reps pour modification
        newRepsInput.value = savedReps;

        editBox.style.display = "block";
    }
});

// Sauvegarder la nouvelle valeur
saveEditBtn.addEventListener("click", () => {
    let newReps = newRepsInput.value.trim();

    // Sauvegarder la nouvelle valeur dans localStorage
    if (newReps !== "") {
        localStorage.setItem(`exercise_${currentEditIndex}`, newReps);
        editBox.style.display = "none";
        loadExercises();
    }
});

// Annuler la modification
cancelEditBtn.addEventListener("click", () => {
    editBox.style.display = "none";
});

// Gestion des cases cochées
exercisesList.addEventListener("change", (e) => {
    const index = e.target.dataset.index;
    if (e.target.type === "checkbox") {
        localStorage.setItem(`checked_${index}`, e.target.checked);
    }
});

// Mettre à jour le chrono
function startTimer() {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0); // Minuit

    let timeLeft = Math.floor((nextMidnight - now) / 1000); // Différence en secondes
    const timerElement = document.getElementById("timer");

    function updateTimer() {
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }

    updateTimer();

    const interval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(interval);
            if (!localStorage.getItem("skip_day")) {
                alert("Tu as raté l'entraînement ! Répétitions doublées !");
            }
        } else {
            timeLeft--;
            localStorage.setItem("timeLeft", timeLeft);
            updateTimer();
        }
    }, 1000);
}

window.onload = () => {
    loadExercises();
    startTimer();
};


const skipDayBtn = document.getElementById("skip-day");
const resetBtn = document.getElementById("reset");
const exceptionMessage = document.getElementById("exception-message");
const undoExceptionBtn = document.getElementById("undo-exception");

// Réinitialiser l'entraînement
resetBtn.addEventListener("click", () => {
    localStorage.clear();
    alert("L'entraînement a été réinitialisé !");
    location.reload();
});

// Annuler l'entraînement pour aujourd'hui
skipDayBtn.addEventListener("click", () => {
    localStorage.setItem("skip_day", "true");
    exceptionMessage.classList.remove("hidden");
});

// Annuler l'exception et reprendre l'entraînement
undoExceptionBtn.addEventListener("click", () => {
    localStorage.removeItem("skip_day");
    exceptionMessage.classList.add("hidden");
});

// Vérifier si l'entraînement est annulé
window.onload = () => {
    if (localStorage.getItem("skip_day")) {
        exceptionMessage.classList.remove("hidden");
    }
    loadExercises();
    startTimer();
};

// Sélectionner l'élément titre et le lecteur MP3
const musicTitle = document.getElementById("music-title");
const mp3Player = document.getElementById("mp3-player");

// Ajouter un écouteur d'événement pour l'élément titre
musicTitle.addEventListener("click", () => {
    // Vérifier si le lecteur a la classe 'enlarged' ou non
    if (mp3Player.classList.contains("enlarged")) {
        // Si le lecteur est agrandi, on le rétrécit
        mp3Player.classList.remove("enlarged");
        mp3Player.classList.add("shrunk");
    } else {
        // Sinon, on l'agrandit
        mp3Player.classList.remove("shrunk");
        mp3Player.classList.add("enlarged");
    }
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker enregistré"))
        .catch((err) => console.log("Erreur Service Worker:", err));
}
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log("L'application est en mode standalone");
} else {
    console.log("L'application est ouverte depuis un navigateur");
}

window.addEventListener("load", function () {
    if (navigator.standalone) {
        console.log("L'application est en mode standalone sur iOS");
    } else if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
        // Afficher un message pour dire à l'utilisateur d'ajouter l'application
        const addToHomeScreen = document.createElement("div");
        addToHomeScreen.innerHTML = `
            <div id="a2hs-message" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: white; color: black; padding: 10px; border-radius: 5px; text-align: center;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.3); font-size: 14px;">
                📌 Pour ajouter cette application sur l'écran d'accueil : <br>
                <strong>Appuie sur "Partager" puis "Ajouter à l'écran d'accueil".</strong>
                <button id="close-a2hs" style="display: block; margin-top: 5px; background: black; color: white;
                border: none; padding: 5px; cursor: pointer;">OK</button>
            </div>
        `;
        document.body.appendChild(addToHomeScreen);

        document.getElementById("close-a2hs").addEventListener("click", function () {
            document.getElementById("a2hs-message").style.display = "none";
        });
    }
});

window.addEventListener("load", function () {
    if (window.navigator.standalone) {
        // Corrige le problème de scroll en s'assurant que le body peut défiler
        document.body.style.overflowY = "auto";
        document.documentElement.style.overflowY = "auto";
    }
});

window.addEventListener("load", function () {
    if ("standalone" in window.navigator && window.navigator.standalone) {
        // Mode iOS standalone activé → assure le scroll
        document.documentElement.style.overflowY = "auto";
        document.body.style.overflowY = "auto";
    } else {
        // Mode normal (PC, Android) → garde le comportement par défaut
        document.documentElement.style.overflowY = "";
        document.body.style.overflowY = "";
    }
});



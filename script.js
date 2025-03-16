const exercises = [
    { name: "Jumping Jacks", reps: "1min" },
    { name: "Burpees", reps: "1min" },
    { name: "Grip (poids à augmenter)", reps: "Variable" },
    { name: "Traction", reps: 4 * 4 },
    { name: "Rowing inversé", reps: 10 * 4 },
    { name: "Traction biceps", reps: 4 * 4 },
    { name: "Rester sur la barre", reps: "15s" },
    { name: "Dips", reps: 8 * 4 },
    { name: "Pompes", reps: 15 * 4 },
    { name: "Pompe incliné", reps: 20 * 4 },
    { name: "Pompe décliné", reps: 16 * 4 },
    { name: "Pompe serré", reps: 15 * 4 },
    { name: "Squat", reps: 30 },
    { name: "Fente alternée", reps: 25 * 4 },
    { name: "Abdos crunchs", reps: 10 * 5 },
    { name: "Abdos levée", reps: 10 * 4 },
    { name: "Gainage", reps: "1min" }
];

const exercisesList = document.getElementById("exercises-list");
const editBox = document.getElementById("edit-box");
const exerciseName = document.getElementById("exercise-name");
const newRepsInput = document.getElementById("new-reps");
const saveEditBtn = document.getElementById("save-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

let currentEditIndex = null;

function loadExercises() {
    exercisesList.innerHTML = "";
    exercises.forEach((ex, index) => {
        let savedReps = localStorage.getItem(`exercise_${index}`) || ex.reps;
        let checked = localStorage.getItem(`checked_${index}`) === "true";

        const li = document.createElement("li");
        li.innerHTML = `
            <span>${ex.name} - ${savedReps} reps</span>
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
        newRepsInput.value = localStorage.getItem(`exercise_${currentEditIndex}`) || exercises[currentEditIndex].reps;
        editBox.style.display = "block";
    }
});

// Sauvegarder la nouvelle valeur
saveEditBtn.addEventListener("click", () => {
    let newReps = newRepsInput.value;
    if (newReps.trim() !== "") {
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

// Démarrer le chrono
function startTimer() {
    let timeLeft = localStorage.getItem("timeLeft") || 86400;
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

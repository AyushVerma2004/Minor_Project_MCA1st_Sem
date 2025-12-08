// -------------------------
// PROGRESS BAR
// -------------------------
const steps = document.querySelectorAll("fieldset");
const progressBar = document.getElementById("progressBar");

let currentStep = 0;

function updateProgress() {
  const percent = ((currentStep + 1) / steps.length) * 100;
  if (progressBar) progressBar.style.width = percent + "%";
}

steps.forEach((fs, i) => {
  fs.addEventListener("change", () => {
    currentStep = i;
    updateProgress();
  });
});

// -------------------------
// CHECKBOX GLOW EFFECT
// -------------------------
document.querySelectorAll("input[type='checkbox']").forEach(cb => {
  cb.addEventListener("change", () => {
    cb.parentElement.style.boxShadow = cb.checked
      ? "0 0 10px #0b84ff"
      : "none";
  });
});

// -------------------------
// FIELDSET ANIMATION
// -------------------------
steps.forEach(fs => {
  fs.addEventListener("change", () => {
    fs.style.animation = "pulse 0.4s ease";
    setTimeout(() => (fs.style.animation = ""), 400);
  });
});

// Animation style
const style = document.createElement("style");
style.innerHTML = `
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}`;
document.head.appendChild(style);

// -------------------------
// SUCCESS ANIMATION + REDIRECT
// -------------------------
const form = document.getElementById("surveyForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const success = document.createElement("div");
    success.innerHTML = "✔ Plan Created Successfully!";
    success.className = "successAnimation";
    document.body.appendChild(success);

    success.style.opacity = "1";
    success.style.transform = "scale(1)";

    setTimeout(() => form.submit(), 1200);
  });
}

// -------------------------
// GET USER INPUT
// -------------------------
const params = new URLSearchParams(window.location.search);
const goal = params.get("goal");
const fitness = params.get("fitness_level");
const days = params.getAll("days");

const container = document.getElementById("workoutGrid");

// -------------------------
// WORKOUT DATABASE
// -------------------------
const DB = {
  "Lose weight": [
    {
      title: "HIIT + Conditioning",
      exercises: [
        "Warm-up: 3 min dynamic mobility",
        "Burpees – 30 sec × 3",
        "Mountain Climbers – 45 sec × 3",
        "Squat Jumps – 20 reps",
        "High Knees – 45 sec",
        "Plank – 40 sec × 2",
        "Cool down: 2 min breathing"
      ]
    },
    {
      title: "Lower Body Fat Burn",
      exercises: [
        "Warm-up: 2 min walking",
        "Bodyweight Squats – 20 reps × 3",
        "Reverse Lunges – 12 reps each × 3",
        "Glute Bridges – 20 reps × 3",
        "Calf Raises – 25 reps × 3",
        "Wall Sit – 1 min",
        "Cool down: Leg mobility 2 min"
      ]
    },
    {
      title: "Cardio + Core Shred",
      exercises: [
        "Warm-up: 2 min dynamic stretch",
        "Skipping – 2 min",
        "Russian Twists – 25 reps × 3",
        "Bicycle Crunches – 20 reps × 3",
        "Heel Touches – 20 reps",
        "Plank Shoulder Taps – 20 each",
        "Cool down: 1 min breathing"
      ]
    },
    {
      title: "Active Mobility Flow",
      exercises: [
        "Cat-Cow – 10 reps",
        "Hip Circles – 20 reps",
        "Child Pose – 1 min",
        "Quad Stretch – 45 sec each",
        "Forward Fold – 1 min",
        "Light Yoga Flow – 5 min"
      ]
    },
    {
      title: "Upper Body + Cardio Mix",
      exercises: [
        "Push-ups – 10-20 reps × 3",
        "Incline Push-ups – 15 reps",
        "Tricep Dips – 12 reps × 3",
        "Shadow Boxing – 2 min",
        "Core: Leg Raises – 15 reps × 2",
        "Plank – 45 sec",
      ]
    },
    {
      title: "Long Duration Cardio",
      exercises: [
        "Light jog – 10 min",
        "Fast walk – 10 min",
        "Shadow boxing – 2 min",
        "Core: Flutter Kicks – 30 sec",
        "Cool down: Stretch 3 min"
      ]
    }
  ],

  "Build muscle": [
    {
      title: "Chest + Triceps",
      exercises: [
        "Warm-up: 2 min shoulder mobility",
        "Push-ups / Bench Press – 4×10",
        "Incline Press – 3×10",
        "Chest Flys – 3×12",
        "Dips – 3×8-10",
        "Tricep Rope Pushdown – 3×12"
      ]
    },
    {
      title: "Back + Biceps",
      exercises: [
        "Pull-ups / Lat Pulldown – 4×8",
        "Seated Row – 3×12",
        "Deadlifts – 4×6",
        "Bicep Curls – 3×12",
        "Hammer Curls – 3×12",
        "Face Pulls – 3×15"
      ]
    },
    {
      title: "Legs + Glutes",
      exercises: [
        "Squats – 4×10",
        "Romanian Deadlift – 4×8",
        "Leg Press – 4×12",
        "Lunges – 3×12 each",
        "Calf Raises – 4×20",
        "Core: Leg Raises – 3×15"
      ]
    },
    {
      title: "Shoulders + Abs",
      exercises: [
        "Shoulder Press – 4×10",
        "Lateral Raises – 3×15",
        "Front Raises – 3×12",
        "Shrugs – 4×12",
        "Hanging Leg Raises – 3×10",
        "Plank – 1 min"
      ]
    },
    {
      title: "Arm Day Strength",
      exercises: [
        "Barbell Curls – 4×10",
        "Skull Crushers – 3×10",
        "Incline Dumbbell Curls – 3×12",
        "Tricep Rope Extensions – 3×12",
        "Hammer Curls – 3×12",
        "Close Grip Push-ups – 12 reps"
      ]
    },
    {
      title: "Active Recovery",
      exercises: [
        "Foam Rolling – 5 min",
        "Full Body Stretch – 5 min",
        "Light Walk – 10 min"
      ]
    }
  ]
};

// -------------------------
// INTENSITY LOGIC
// -------------------------
function modifyIntensity(exercises, level) {
  return exercises.map(e => {
    if (level === "Beginner") return e + " (Beginner)";
    if (level === "Intermediate") return e + " (Intermediate)";
    if (level === "Advanced") return e + " (Advanced)";
    return e;
  }).join("<br>");
}

// -------------------------
// GENERATE PLAN
// -------------------------
const selectedPlan = DB[goal] || DB["Lose weight"];
const totalDays = days.length > 0 ? days.length : 6;

if (container) {
  container.innerHTML = "";

  for (let i = 0; i < totalDays; i++) {
    const day = selectedPlan[i % selectedPlan.length];
    const workoutHTML = modifyIntensity(day.exercises, fitness);

    container.innerHTML += `
      <div class="workout-card">
        <h3>${day.title}</h3>
        <p>${workoutHTML}</p>
      </div>
    `;
  }
}

// -------------------------
// PDF DOWNLOAD
// -------------------------
document.getElementById("downloadBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "pt", format: "a4" });

  pdf.html(document.getElementById("planContainer"), {
    callback: function (pdf) {
      pdf.save("Your_Workout_Plan.pdf");
    },
    margin: [20, 20, 20, 20],
    autoPaging: "text",
  });
});

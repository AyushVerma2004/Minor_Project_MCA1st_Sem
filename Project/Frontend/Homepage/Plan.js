// Read survey data from URL
const params = new URLSearchParams(window.location.search);

const goal = params.get("goal");
const fitness = params.get("fitness_level");
const days = params.getAll("days");

// DOM container
const container = document.getElementById("workoutGrid");


// -------------------------
// 1. FULL DETAILED WORKOUT DATABASE
// -------------------------

const WORKOUTS = {
  "Lose weight": [
    {
      title: "Full Body HIIT + Cardio",
      exercises: [
        "Warm-up: 3 min jogging in place",
        "Jumping Jacks – 40 sec",
        "Mountain Climbers – 40 sec",
        "Burpees – 30 sec",
        "High Knees – 45 sec",
        "Bodyweight Squats – 15 reps × 3 sets",
        "Plank – 30 sec × 3 sets",
        "Cool down: Stretch 3 mins"
      ]
    },
    {
      title: "Lower Body Fat Burn",
      exercises: [
        "Warm-up: 2 min fast walking",
        "Squats – 15 reps × 3 sets",
        "Lunges – 12 reps each × 3 sets",
        "Glute Bridges – 20 reps × 3 sets",
        "Calf Raises – 25 reps × 2 sets",
        "Wall Sit – 45 sec",
        "Leg Raises – 15 reps",
        "Cool down: Hamstring stretch 1 min"
      ]
    },
    {
      title: "Cardio + Core Shred",
      exercises: [
        "Warm-up: Dynamic stretching 2 min",
        "Skipping – 2 min",
        "Russian Twists – 20 reps × 3 sets",
        "Bicycle Crunches – 15 reps × 3 sets",
        "Plank Shoulder Taps – 20 reps",
        "Side Plank – 30 sec each side",
        "Mountain Climbers – 40 sec",
        "Cool down: Deep breathing"
      ]
    },
    {
      title: "Active Recovery",
      exercises: [
        "Cat-Cow Mobility – 10 reps",
        "Child Pose – 1 min",
        "Hamstring Stretch – 1 min",
        "Quad Stretch – 45 sec each",
        "Shoulder Mobility Circles – 20 reps",
        "Light Yoga Flow – 5 minutes"
      ]
    },
    {
      title: "Upper Body + Arms",
      exercises: [
        "Push-ups – 10/15/20 reps",
        "Incline Push-ups – 12 reps",
        "Tricep Dips – 15 reps × 3 sets",
        "Pike Push-up – 10 reps",
        "Plank – 40 sec",
        "Crunches – 20 reps × 3 sets",
        "Cool down: Full upper body stretch"
      ]
    },
    {
      title: "Full Body Endurance",
      exercises: [
        "Warm-up: 3 min walk",
        "Squat → Burpee combo – 10 reps",
        "Step-ups – 20 reps",
        "Shadow Boxing – 2 min",
        "Slow Jog – 5 mins",
        "Core: Flutter Kicks – 30 sec",
        "Cool down: Stretch 3 minutes"
      ]
    }
  ],

  "Build muscle": [
    {
      title: "Chest + Triceps",
      exercises: [
        "Warm-up: Shoulder rolls + arm circles",
        "Bench Press / Push-ups – 4×10",
        "Incline Press – 3×10",
        "Chest Flys – 3×12",
        "Dips – 3×10",
        "Tricep Rope Pushdown – 3×12",
        "Plank – 1 minute"
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
        "Back Extensions – 2×15"
      ]
    },
    {
      title: "Leg Day",
      exercises: [
        "Squats – 4×10",
        "Romanian Deadlift – 4×8",
        "Leg Press – 4×12",
        "Lunges – 3×12 each leg",
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
        "Plank – 1 minute"
      ]
    },
    {
      title: "Arms Day",
      exercises: [
        "Barbell Curls – 4×10",
        "Skull Crushers – 3×10",
        "Cable Curls – 3×12",
        "Tricep Rope Extensions – 3×12",
        "Hammer Curls – 3×12",
        "Close Grip Push-ups – 15 reps"
      ]
    },
    {
      title: "Active Recovery",
      exercises: [
        "Foam rolling – 5 min",
        "Deep Stretch – 5 min",
        "Light walking – 10 minutes"
      ]
    }
  ]
};



// -------------------------
// 2. INTENSITY MODIFIER BASED ON FITNESS LEVEL
// -------------------------

function modifyForLevel(exercises, level) {
  if (level === "Beginner") {
    return exercises.map(e => e + " (Beginner: slow pace, more rest)").join("<br>");
  }
  if (level === "Intermediate") {
    return exercises.map(e => e + " (Intermediate: normal rest)").join("<br>");
  }
  if (level === "Advanced") {
    return exercises.map(e => e + " (Advanced: reduce rest + increase reps)").join("<br>");
  }
  return exercises.join("<br>");
}



// -------------------------
// 3. GENERATE AND DISPLAY PLAN
// -------------------------

let plan = WORKOUTS[goal] || WORKOUTS["Lose weight"];
let totalDays = days.length > 0 ? days.length : 6;

container.innerHTML = "";

for (let i = 0; i < totalDays; i++) {
  const day = plan[i % plan.length]; // loop through plan
  const workoutHTML = modifyForLevel(day.exercises, fitness);

  container.innerHTML += `
    <div class="box">
      <h3>${day.title}</h3>
      <p>${workoutHTML}</p>
    </div>
  `;
}

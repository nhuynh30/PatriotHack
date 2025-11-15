function goBack() {
    window.location.href = "userInput.html";   
}

const dataRaw = localStorage.getItem("userData");
if (!dataRaw) {
    document.body.innerHTML = "<p style='color:white;padding:20px;text-align:center'>No user data found. Go back to the input page.</p>";
    throw new Error("No user data");
}
const data = JSON.parse(dataRaw);

// show summary
document.getElementById("userSummary").innerHTML = `
  <strong>Age:</strong> ${data.age}<br>
  <strong>Height:</strong> ${data.height} cm<br>
  <strong>Weight:</strong> ${data.weight} kg<br>
  <strong>Experience:</strong> ${capitalize(data.experience)}<br>
  <strong>Goal:</strong> ${formatGoal(data.goal)}<br>
  <strong>Target:</strong> ${data.target || "—"}<br>
  <strong>Workout Days/Week:</strong> ${data.days}
`;


document.getElementById("workoutPlan").innerHTML = generateWorkoutPlan(
  Number(data.age),
  Number(data.height),
  Number(data.weight),
  data.experience,
  data.goal,
  Number(data.days)
);

document.getElementById("nutritionPlan").innerHTML = generateNutritionPlan(
  Number(data.age),
  Number(data.height),
  Number(data.weight),
  data.goal
);

document.getElementById("weeklyGoals").innerHTML = generateWeeklyGoals(data.goal, Number(data.days));


function capitalize(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
function formatGoal(g){
  if(g==="lose_weight") return "Lose Weight";
  if(g==="build_muscle") return "Build Muscle";
  return "Maintain Health";
}
function bmi(weight, height){
  const h = height/100;
  return +(weight / (h*h));
}


function generateWorkoutPlan(age, height, weight, level, goal, days) {
  if (!days || days < 1) days = 3;
  let b = bmi(weight, height);
  let intensity = "Moderate";
  if (level === "advanced") intensity = "High";
  if (level === "beginner") intensity = "Low";
  if (age < 25) intensity = "High";
  if (age > 50) intensity = "Low";

  let plan = `<strong>Intensity:</strong> ${intensity}<br><br>`;
  plan += `<strong>Weekly Schedule (${days} days/week)</strong><br>`;


  const schedule = (parts) => {
    let assigned = parts.map(p => ({...p, days: p.minDays || 0}));
    let total = assigned.reduce((s,p)=>s+p.days,0);
    let i=0;
    while(total < days){
      assigned[i%assigned.length].days++;
      total++;
      i++;
    }

    let out = "<ul>";
    for (const a of assigned){
      if (a.days === 0) continue;
      out += `<li>${a.days} ${a.label}${a.days>1?"s":""}</li>`;
    }
    out += "</ul>";
    return out;
  };

  if (goal === "lose_weight") {
    // prioritize cardio then strength then mobility
    let parts = [
      {label: "cardio session (20–40 min)", minDays: Math.max(1, Math.floor(days*0.6))},
      {label: "strength session (full-body)", minDays: Math.max(0, Math.floor(days*0.25))},
      {label: "mobility / walk / recovery", minDays: 0}
    ];
    plan += schedule(parts);
    if (b > 27) plan += `<div class="note"><strong>Note:</strong> BMI ${b.toFixed(1)} — suggest slightly longer cardio.</div>`;
    return plan;
  }

  if (goal === "build_muscle") {
    let parts = [];
    if (days === 1) {
      parts = [{label: "full-body heavy lifting", minDays:1}];
    } else if (days === 2) {
      parts = [
        {label: "upper/body or compound lifting", minDays:1},
        {label: "lower/body or compound lifting", minDays:1}
      ];
    } else if (days === 3) {
      parts = [
        {label: "push (chest/shoulders/triceps)", minDays:1},
        {label: "pull (back/biceps)", minDays:1},
        {label: "legs", minDays:1}
      ];
    } else {
      parts = [
        {label: "upper body strength", minDays: Math.floor(days/2)},
        {label: "lower body strength", minDays: Math.floor(days/2)},
        {label: "light cardio / mobility", minDays: 0}
      ];
    }
    plan += schedule(parts);
    if (b < 20) plan += `<div class="note"><strong>Note:</strong> BMI ${b.toFixed(1)} — you may need extra calories to gain muscle.</div>`;
    return plan;
  }


  {
    let parts = [
      {label: "mixed session: cardio + strength (balanced)", minDays: Math.max(1, Math.floor(days*0.5))},
      {label: "mobility / yoga / recovery", minDays: 0},
      {label: "light cardio", minDays: Math.max(0, days - Math.max(1, Math.floor(days*0.5)))}
    ];
    plan += schedule(parts);
    return plan;
  }
}


function generateNutritionPlan(age, height, weight, goal) {
  // simple TDEE-ish estimate (quick formula)
  const bmiVal = bmi(weight, height).toFixed(1);
  // rough calories: weight(kg)*22 + age*3 (very rough)
  let cal = Math.round(weight * 22 + age * 3);
  let protein_g = Math.round(weight * 1.6); // baseline

  let out = `<strong>BMI:</strong> ${bmiVal} &nbsp;&nbsp; <strong>Est. calories:</strong> ${cal} kcal/day<br><strong>Protein:</strong> ${protein_g} g/day<br><br>`;

  if (goal === "lose_weight") {
    out += `<ul>
      <li>Target deficit: 300–500 kcal/day</li>
      <li>High protein, lots of vegetables</li>
      <li>Prefer cardio on alternate days or after strength</li>
      <li>Water: 2–3L/day</li>
    </ul>`;
    return out;
  }
  if (goal === "build_muscle") {
    out += `<ul>
      <li>Target surplus: +250–350 kcal/day</li>
      <li>Protein: ${protein_g}–${protein_g + 25} g/day</li>
      <li>Carbs around workouts; eat 3–4 meals</li>
      <li>Consider creatine (optional)</li>
    </ul>`;
    return out;
  }
  
  out += `<ul>
    <li>Eat around maintenance calories</li>
    <li>Balanced macros: protein + carbs + healthy fats</li>
    <li>Fruit & veg daily; hydrate</li>
  </ul>`;
  return out;
}


function generateWeeklyGoals(goal, days) {
  if (goal === "lose_weight") {
    return `<ul>
      <li>Complete ${days} workouts</li>
      <li>Aim for 1–1.5 lb loss/week</li>
      <li>10k steps on workout days if possible</li>
      <li>Track calories consistently</li>
    </ul>`;
  }
  if (goal === "build_muscle") {
    return `<ul>
      <li>Complete ${days} lifting sessions</li>
      <li>Progressive overload: small weight/rep increases weekly</li>
      <li>Hit protein target daily</li>
      <li>7–9 hours sleep/night</li>
    </ul>`;
  }
  return `<ul>
    <li>${days} workouts/week</li>
    <li>Stay consistent with activity</li>
    <li>Include mobility & recovery</li>
  </ul>`;
}

const workoutHTML = generateWorkoutPlan(
  Number(data.age),
  Number(data.height),
  Number(data.weight),
  data.experience,
  data.goal,
  Number(data.days)
);


document.getElementById("workoutPlan").innerHTML = workoutHTML;


localStorage.setItem("fullWorkoutPlan", workoutHTML);

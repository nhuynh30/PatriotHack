
let backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click',()=>{
    window.history.back();
})

const editBtn = document.getElementById('editBtn');
editBtn.addEventListener('click', () => {
    // Go to user input page (form)
    window.location.href = 'userInput.html';
});





const dataRaw = localStorage.getItem("userData");
if (!dataRaw) {
    document.getElementById("fullWorkoutContent").innerHTML =
        "<p>No user data found. Return to the input page.</p>";
    throw new Error("No user data");
}
const user = JSON.parse(dataRaw);

function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function bmi(weight, height) {
    const h = height / 100;
    return +(weight / (h * h)).toFixed(1);
}


function generateWarmup(level) {
    if (level === "beginner") {
        return `
            <strong>Warm-up (5–7 min)</strong>
            <ul>
                <li>Light cardio: 2 min (walk, bike)</li>
                <li>Dynamic stretches: arm circles, leg swings</li>
                <li>1 light set of each first exercise</li>
            </ul>
        `;
    }
    if (level === "intermediate") {
        return `
            <strong>Warm-up (7–10 min)</strong>
            <ul>
                <li>Cardio: 3 min jog/bike</li>
                <li>Mobility: hip openers, T-spine rotations</li>
                <li>2 light warm-up sets for first movement</li>
            </ul>
        `;
    }
    return `
        <strong>Warm-up (10 min)</strong>
        <ul>
            <li>Cardio: 4 min moderate intensity</li>
            <li>Mobility + activation: bands, core bracing</li>
            <li>2–3 progressive warm-up sets for compound lift</li>
        </ul>
    `;
}

function generateWorkoutSplit(goal, days) {
    if (goal === "lose_weight") {
        if (days <= 2)
            return ["Full Body", "Cardio + Core"];
        if (days === 3)
            return ["Full Body", "Cardio Conditioning", "Full Body (Light)"];
        if (days === 4)
            return ["Upper Body", "Lower Body", "Cardio", "Full Body"];
        return ["Upper", "Lower", "Cardio HIIT", "Full Body", "Core + Mobility"];
    }

    if (goal === "build_muscle") {
        if (days <= 2)
            return ["Full Body Strength", "Full Body Hypertrophy"];
        if (days === 3)
            return ["Push", "Pull", "Legs"];
        if (days === 4)
            return ["Upper", "Lower", "Push", "Pull"];
        return ["Push", "Pull", "Legs", "Upper", "Arms + Delts"];
    }

    // Maintain
    if (days <= 2)
        return ["Full Body", "Cardio + Strength Mix"];
    if (days === 3)
        return ["Strength Mix", "Cardio", "Mobility + Light Strength"];
    return ["Upper", "Lower", "Cardio", "Full Body"];
}

function generateExercises(dayType, level, goal) {
    const lvl = level;

    const rest = lvl === "beginner" ? "60–90 sec"
        : lvl === "intermediate" ? "90 sec"
        : "2 minutes";

    // Exercise templates
    const templates = {
        "Push": [
            ["Barbell Bench Press", "4×6–8"],
            ["Shoulder Press", "3×8–10"],
            ["Incline Dumbbell Press", "3×10–12"],
            ["Lateral Raises", "3×12–15"],
            ["Triceps Pushdowns", "3×12–15"]
        ],
        "Pull": [
            ["Lat Pulldown", "4×8–10"],
            ["Barbell Rows", "3×6–8"],
            ["Seated Cable Row", "3×10–12"],
            ["Face Pulls", "3×12–15"],
            ["Bicep Curls", "3×10–12"]
        ],
        "Legs": [
            ["Squats", "4×6–8"],
            ["Romanian Deadlift", "3×8–10"],
            ["Leg Press", "3×10–12"],
            ["Leg Curls", "3×12–15"],
            ["Calf Raises", "3×15–20"]
        ],
        "Upper": [
            ["Bench Press", "4×6–8"],
            ["Rows (any type)", "4×8–10"],
            ["Shoulder Press", "3×10"],
            ["Lat Pulldown", "3×10–12"],
            ["Triceps Dips or Pushdowns", "3×12"]
        ],
        "Lower": [
            ["Deadlift or RDL", "3×5–8"],
            ["Hip Thrust", "3×10"],
            ["Leg Press", "3×12"],
            ["Hamstring Curl", "3×12–15"],
            ["Calves", "4×15–20"]
        ],
        "Full Body": [
            ["Squats", "3×8"],
            ["Bench Press", "3×8"],
            ["Rows", "3×10"],
            ["Lunges", "3×12"],
            ["Plank", "3×45 sec"]
        ],
        "Full Body Hypertrophy": [
            ["Incline Bench", "4×8–10"],
            ["Leg Press", "4×10–12"],
            ["Cable Rows", "4×10–12"],
            ["Shoulder Raises", "3×15"],
            ["Hammer Curls", "3×12–15"]
        ],
        "Cardio + Core": [
            ["Moderate Cardio (bike/run)", "20–30 min"],
            ["Planks", "3×45 sec"],
            ["Russian Twists", "3×20"],
            ["Hanging Knee Raises", "3×12"]
        ],
        "Cardio": [
            ["Steady State Cardio", "25–40 min"],
            ["Optional HIIT: 30s fast / 30s slow × 8–10"]
        ],
        "Cardio HIIT": [
            ["Sprint HIIT", "20 min"],
            ["Cooldown Walk", "10 min"]
        ],
        "Arms + Delts": [
            ["Barbell Curls", "3×10"],
            ["Tricep Rope Extensions", "3×12"],
            ["Hammer Curls", "3×12"],
            ["Delt Raises", "3×15"],
            ["Face Pulls", "3×15"]
        ]
    };

    let list = templates[dayType] || [["Walking", "20 min"]];

    // Adjustments based on goals
    if (goal === "lose_weight") {
        list.push(["Cool-down walk", "5–10 min"]);
    }

    // Generate HTML
    let html = `<strong>${dayType}</strong> (Rest: ${rest})<ul>`;
    for (const ex of list) {
        html += `<li>${ex[0]} — <strong>${ex[1]}</strong></li>`;
    }
    html += "</ul>";

    return html;
}



function buildFullWorkout(user) {
    const { age, height, weight, experience, goal, days } = user;

    const bmiVal = bmi(weight, height);
    const split = generateWorkoutSplit(goal, Number(days));

    let html = `
        <h3>Your Detailed Weekly Plan</h3>
        <p><strong>Experience:</strong> ${cap(experience)}<br>
        <strong>Goal:</strong> ${goal.replace("_", " ")}<br>
        <strong>BMI:</strong> ${bmiVal}</p>

        ${generateWarmup(experience)}
        <hr>
    `;

    html += `<h3>Weekly Schedule (${days} days/week)</h3>`;

    split.forEach((dayType, idx) => {
        html += `
            <div class="day-block">
                <h4>Day ${idx + 1}: ${dayType}</h4>
                ${generateExercises(dayType, experience, goal)}
            </div>
        `;
    });

    html += `
        <hr>
        <h3>Progression Tips</h3>
        <ul>
            <li>Add +1–2 reps weekly OR +2.5–5 lbs when possible</li>
            <li>Focus on slow, controlled form</li>
            <li>Track weights in a notebook or app</li>
            <li>Rest 7–9 hours/night for best recovery</li>
        </ul>
    `;

    return html;
}


document.getElementById("fullWorkoutContent").innerHTML = buildFullWorkout(user);



const printBtn = document.getElementById("printBtn");
printBtn.addEventListener("click", () => {
    window.print();
});

const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    const header = document.getElementById("planHeader").innerText;
    const content = document.getElementById("fullWorkoutContent").innerText;

    // Combine header + content as plain text
    const fullText = header + "\n\n" + content;

    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 14;
    const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

    const lines = doc.splitTextToSize(fullText, 550);
    let cursor = margin;

    lines.forEach((line, i) => {
        if (cursor + lineHeight > pageHeight - margin) {
            doc.addPage();
            cursor = margin;
        }
        doc.text(line, margin, cursor);
        cursor += lineHeight;
    });

    doc.save("full-workout-plan.pdf");
});




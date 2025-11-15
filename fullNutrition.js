
const userData = JSON.parse(localStorage.getItem("userData")) || {};

const heightCm = Number(userData.height) || 0;
const weightKg = Number(userData.weight) || 0;
const age = Number(userData.age) || 20;
const goal = userData.goal || "maintain";


const heightM = heightCm / 100;
const bmi = (weightKg / (heightM * heightM)).toFixed(1);


function dailyCaloriesCalc(weightKg, heightCm, age, goal) {
    let base = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;

    if (goal === "lose_weight") base -= 300;
    if (goal === "build_muscle") base += 300;

    return Math.round(base);
}

const dailyCalories = dailyCaloriesCalc(weightKg, heightCm, age, goal);
const caloriesPerMeal = Math.round(dailyCalories / 3);


document.getElementById("nutritionSummary").innerHTML = `
    <strong>Height:</strong> ${heightCm} cm<br>
    <strong>Weight:</strong> ${weightKg} kg<br>
    <strong>BMI:</strong> ${bmi}<br>
    <strong>Daily Calories Needed:</strong> ${dailyCalories} kcal<br>
    <strong>Goal:</strong> ${goal.replace("_", " ")}
`;


document.getElementById("calorieBreakdown").innerHTML = `
    <strong>Total Calories Per Day:</strong> ${dailyCalories} kcal<br>
    <strong>Calories Per Meal:</strong> ${caloriesPerMeal} kcal
`;


function generateMealPlan(calories) {
    return `
        <ul>
            <li><strong>Protein:</strong> ${Math.round(calories * 0.30)} kcal  
                (Chicken breast / Eggs / Greek yogurt)</li>
            <li><strong>Carbs:</strong> ${Math.round(calories * 0.45)} kcal  
                (Rice / Oats / Pasta / Fruit)</li>
            <li><strong>Fats:</strong> ${Math.round(calories * 0.25)} kcal  
                (Avocado / Nuts / Olive oil)</li>
        </ul>

        <div class="note">
            Example foods:<br>
            • 150g chicken breast<br>
            • 1 cup cooked rice<br>
            • Vegetables<br>
            • 1 fruit<br>
        </div>
    `;
}


document.getElementById("mealBreakfast").innerHTML = generateMealPlan(caloriesPerMeal);
document.getElementById("mealLunch").innerHTML = generateMealPlan(caloriesPerMeal);
document.getElementById("mealDinner").innerHTML = generateMealPlan(caloriesPerMeal);

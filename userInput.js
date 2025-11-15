function submitForm() {
    const userData = {
        age: document.getElementById("age").value,
        height: document.getElementById("height").value,
        weight: document.getElementById("weight").value,
        experience: document.getElementById("experience").value,
        goal: document.getElementById("goal").value,
        target: document.getElementById("target").value,
        days: document.getElementById("days").value
    };

    // Save to local storage
    localStorage.setItem("userData", JSON.stringify(userData));

    // Go to results page
    window.location.href = "result.html";
}


window.addEventListener("DOMContentLoaded", () => {
    const savedDataRaw = localStorage.getItem("userData");
    if (!savedDataRaw) return;

    const savedData = JSON.parse(savedDataRaw);

    document.getElementById("age").value = savedData.age || "";
    document.getElementById("height").value = savedData.height || "";
    document.getElementById("weight").value = savedData.weight || "";
    document.getElementById("experience").value = savedData.experience || "beginner";
    document.getElementById("goal").value = savedData.goal || "lose_weight";
    document.getElementById("target").value = savedData.target || "";
    document.getElementById("days").value = savedData.days || "";
});

let backBtn= document.getElementById('gobackBtn');
backBtn.addEventListener('click',()=>{
    window.location.href='homepage.html';
})
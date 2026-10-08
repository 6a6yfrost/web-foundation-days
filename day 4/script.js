const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");
const body = document.body;

function updateCounts() {
    const text = noteText.value;

    // Count characters
    const characters = text.length;

    // Count words
    const words = text.trim() === ""
        ? 0
        : text.trim().split(/\s+/).length;

    // Update the counters
    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    // Remove old warning classes
    charCount.classList.remove("warning", "over");

    // Add warning when over 180 characters
    if (characters > 180 && characters <= 200) {
        charCount.classList.add("warning");
    }

    // Add over class when over 200 characters
    if (characters > 200) {
        charCount.classList.add("over");
    }
}

// Save draft whenever the user types
noteText.addEventListener("input", () => {
    updateCounts();

    localStorage.setItem("draft", noteText.value);
});

// Clear everything
function clearNote() {
    noteText.value = "";

    updateCounts();

    localStorage.removeItem("draft");
}

// Clear button
clearBtn.addEventListener("click", clearNote);

// Press Escape inside textarea to clear
noteText.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        clearNote();
    }
});

// Theme toggle
themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "Dark mode";
        localStorage.setItem("theme", "light");
    }
});

// Restore saved data when page loads
const savedDraft = localStorage.getItem("draft");

if (savedDraft !== null) {
    noteText.value = savedDraft;
}

// Restore saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    body.classList.add("dark");
    themeToggle.textContent = "Light mode";
} else {
    themeToggle.textContent = "Dark mode";
}

// Update counters when page loads
updateCounts();
const images = ["cat.jpg", "dog.jpg", "fish.png", "rabbit.jpg"];
const words = ["cat", "dog", "fish", "rabbit"];
let currentCardIndex = 0;
const cardImage = document.getElementById("card-image");
const microphoneButton = document.getElementById("microphone-button");
const replayButton = document.getElementById("replay-button");
const reviewCells = [
    document.getElementById("review-cell-1"),
    document.getElementById("review-cell-2"),
    document.getElementById("review-cell-3"),
    document.getElementById("review-cell-4")
];
const correctCells = [
    document.getElementById("correct-cell-1"),
    document.getElementById("correct-cell-2"),
    document.getElementById("correct-cell-3"),
    document.getElementById("correct-cell-4")
];
const scoreElement = document.getElementById("score");
let reviewIndex = 0;
let correctIndex = 0;

function loadCard() {
    if (cardImage) {
        if (currentCardIndex < images.length) {
            cardImage.src = images[currentCardIndex];
            cardImage.classList.remove("correct-answer", "incorrect-answer");
        } else {
            cardImage.style.display = "none";
            microphoneButton.style.display = "none";
            replayButton.style.display = "block";  // Display the replay button
            displayScore(); // Display the score at the end
        }
    } else {
        console.error("cardImage is null");
    }
}

function appendImageToCell(cells, index, imageClass) {
    if (index < cells.length) {
        const cloneImage = cardImage.cloneNode(true);
        cloneImage.classList.add(imageClass);
        cells[index].appendChild(cloneImage);
    }
}

function displayScore() {
    const score = correctIndex;
    const total = images.length;
    scoreElement.textContent = `You scored: ${score}/${total}`;
    scoreElement.style.display = "block"; // Show the score box
}

microphoneButton.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US"; // Set the language to English (United States)

    recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.toLowerCase();
        if (spokenWord === words[currentCardIndex]) {
            appendImageToCell(correctCells, correctIndex, "correct-answer");
            correctIndex++;
        } else {
            appendImageToCell(reviewCells, reviewIndex, "incorrect-answer");
            reviewIndex++;
        }
        currentCardIndex++;
        loadCard();
    };
    recognition.start();
});

replayButton.addEventListener("click", () => {
    currentCardIndex = 0;
    correctIndex = 0;
    reviewIndex = 0;
    cardImage.style.display = "block";
    microphoneButton.style.display = "block";
    replayButton.style.display = "none";  // Hide the replay button
    reviewCells.forEach(cell => cell.innerHTML = "");
    correctCells.forEach(cell => cell.innerHTML = "");
    scoreElement.textContent = ""; // Clear the score
    scoreElement.style.display = "none"; // Hide the score box
    loadCard();
});

document.addEventListener("DOMContentLoaded", () => {
    loadCard();
});
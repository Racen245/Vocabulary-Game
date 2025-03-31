const images = ["cat.jpg", "dog.jpg", "fish.png", "rabbit.jpg"];
const words = ["cat", "dog", "fish", "rabbit"];
let currentCardIndex = 0;
const cardImage = document.getElementById("card-image");
const microphoneButton = document.getElementById("microphone-button");
const replayButton = document.getElementById("replay-button");
const speakerButton = document.getElementById("speaker-button");
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
const instructionAudio = document.getElementById("instruction-audio"); // Reference to the audio element
let reviewIndex = 0;
let correctIndex = 0;

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.lang = "en-US";

function loadCard() {
    if (currentCardIndex < images.length) {
        cardImage.src = images[currentCardIndex];
        cardImage.classList.remove("correct-answer", "incorrect-answer");
    } else {
        cardImage.style.display = "none";
        replayButton.style.display = "block";
        displayScore();
        recognition.stop();
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
    scoreElement.style.display = "block";
}

recognition.onresult = (event) => {
    const spokenWord = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log(`Recognized word: ${spokenWord}, Expected word: ${words[currentCardIndex]}`);
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

recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
};

microphoneButton.addEventListener("click", () => {
    recognition.start();
    microphoneButton.style.display = "none";
});

replayButton.addEventListener("click", () => {
    currentCardIndex = 0;
    correctIndex = 0;
    reviewIndex = 0;
    cardImage.style.display = "block";
    microphoneButton.style.display = "block";
    replayButton.style.display = "none";
    reviewCells.forEach(cell => cell.innerHTML = "");
    correctCells.forEach(cell => cell.innerHTML = "");
    scoreElement.textContent = "";
    scoreElement.style.display = "none";
    loadCard();
});

speakerButton.addEventListener("click", () => {
    if (instructionAudio) {
        instructionAudio.play().catch(error => {
            console.error("Error playing audio:", error);
            // Fallback to text-to-speech if audio playback fails
            const utterance = new SpeechSynthesisUtterance(instructionsElement.textContent);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadCard();
    if (instructionAudio) {
        instructionAudio.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    }
});
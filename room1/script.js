
let totalCount = 0; 
let answersSubmitted = false; // Flag to track whether answers have been submitted
let countdownTimer; // Variable to store the countdown timer

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    countdownTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdownTimer);
            submitAnswers();
        }
    }, 1000);
}

document.getElementById('submittext').style.display = 'none';
document.getElementById('answerSheet').style.display = 'none';
document.getElementById('chatBubble').style.display = 'none';

const questionNumber = gucco1.length;
const timeInseconds = questionNumber * 20;
const timerDuration = timeInseconds / 60;

// const resultDiv = document.querySelector('.container');
const resultDiv = document.getElementById('noteIt');
const message = `Number of questions: ${questionNumber} <br> You will get 👉 ${timerDuration} minutes to give this exam`;
resultDiv.innerHTML = message;

function generateAnswerSheet() {
    const questionNumber = gucco1.length;
    const timeInseconds = questionNumber * 20;
    const timerDuration = timeInseconds / 60;

    let answerSheetHTML = '<h2>OMR Answer Sheet</h2>';
    for (let i = 1; i <= questionNumber; i++) {
        answerSheetHTML += `<div id="question${i}"><strong> ${i}:</strong> `;
        for (let j = 0; j < 4; j++) { // Changed loop limit to 4 for 4 options
            const option = String.fromCharCode(97 + j); // Convert ASCII code to letters 'a', 'b', 'c', 'd'
            answerSheetHTML += `<div class="option" onclick="selectOption(this, '${option}', ${i})">${option}</div>`;
        }
        answerSheetHTML += `</div>`;
    }
    document.getElementById('answerSheet').innerHTML = answerSheetHTML;

    hideAll();
    document.getElementById('submittext').style.display = 'block';
    document.getElementById('answerSheet').style.display = 'block';
    document.getElementById('chatBubble').style.display = 'block';

    // Start the timer when generating the answer sheet
    const timerDisplay = document.getElementById('timer');
    startTimer(timerDuration * 60, timerDisplay); // Convert minutes to seconds

    totalCount = parseInt(questionNumber);
}

function selectOption(option, letter, questionNumber) {
    if (answersSubmitted) return; // Prevent selection after answers have been submitted

    const options = option.parentNode.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    // Store the question number associated with the selected option
    option.dataset.questionNumber = questionNumber;

    console.log(`Selected option ${letter} for Question ${questionNumber}`);
}

let tTaArray = [0];

function submitAnswers() {
    const idToHide = document.getElementById('submittext');
    idToHide.style.display = 'none';
    if (answersSubmitted) return; // Prevent submitting answers multiple times
    answersSubmitted = true; // Set flag to true after answers have been submitted
    clearInterval(countdownTimer); // Stop the countdown timer
    const selectedOptions = document.querySelectorAll('.option.selected');
    const correctAnswers = gucco1.split('');
    let totalMarks = 0;
    let answeredQuestions = []; // Array to store question numbers that have been answered

    selectedOptions.forEach(option => {
        const selectedLetter = option.textContent.trim();
        const correctLetter = correctAnswers[option.dataset.questionNumber - 1].trim();
        const questionNumber = parseInt(option.dataset.questionNumber);
        if (selectedLetter === correctLetter) {
            option.classList.add('correct');
            totalMarks += 1; // Increment totalMarks for each correct answer
        } else {
            option.classList.add('incorrect');
            totalMarks -= 0.25; // Deduct 0.25 marks for each incorrect answer
        }

        option.classList.remove('selected');
        answeredQuestions.push(questionNumber); // Store answered question numbers
    });

    // Check for unanswered questions and mark them as "skip"
    for (let i = 1; i <= totalCount; i++) {
        if (!answeredQuestions.includes(i)) {
            const questionDiv = document.getElementById(`question${i}`);
            questionDiv.innerHTML += `<div class="option skip">skipped</div>`;
        }
    }

    console.log(totalMarks);
    const lastElementDisplay = document.createElement('div');
    lastElementDisplay.textContent = "Marks: " + totalMarks.toFixed(2) + "/" + totalCount;
    lastElementDisplay.classList.add('last-element-display');
    const answerSheetContainer = document.getElementById('answerSheet');
    answerSheetContainer.appendChild(lastElementDisplay);
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.onclick = null);
    for (let i = 1; i <= correctAnswers.length; i++) {
        const correctLetter = correctAnswers[i - 1];
        const questionDiv = document.getElementById(`question${i}`);
        questionDiv.innerHTML += `<div class="correct-answer">Correct Answer: ${correctLetter}</div>`;
    }
}

function hideAll() {
    const divIdsToHide = ['questionNumber', 'timerDuration', 'generatedText', 'questionnumbertext', 'timetext', 'headtext'];

    divIdsToHide.forEach(id => {
        const divToHide = document.getElementById(id);
        if (divToHide) { // Check if the element exists
            divToHide.style.display = 'none';
        }
    });
}








document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const overlay = document.getElementById('overlay');

    chatBubble.addEventListener('click', (event) => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            chatWindow.style.display = 'flex';
            overlay.style.display = 'block';
            setTimeout(() => {
                chatWindow.style.opacity = '1';
                chatWindow.style.transform = 'scale(1)';
            }, 10);
        } else {
            chatWindow.style.opacity = '0';
            chatWindow.style.transform = 'scale(0.8)';
            setTimeout(() => {
                chatWindow.style.display = 'none';
                overlay.style.display = 'none';
            }, 300);
        }
        event.stopPropagation();
    });

    closeChat.addEventListener('click', () => {
        closeChatWindow();
    });

    let isDragging = false;
    let offsetX, offsetY;

    chatBubble.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - chatBubble.getBoundingClientRect().left;
        offsetY = event.clientY - chatBubble.getBoundingClientRect().top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(event) {
        if (isDragging) {
            chatBubble.style.left = `${event.clientX - offsetX}px`;
            chatBubble.style.top = `${event.clientY - offsetY}px`;
            chatBubble.style.bottom = 'auto';
            chatBubble.style.right = 'auto';
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    overlay.addEventListener('click', (event) => {
        closeChatWindow();
        event.stopPropagation();
    });

    function closeChatWindow() {
        chatWindow.classList.remove('open');
        chatWindow.style.opacity = '0';
        chatWindow.style.transform = 'scale(0.8)';
        setTimeout(() => {
            chatWindow.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }

    chatWindow.addEventListener('click', (event) => {
        closeChatWindow();
        event.stopPropagation();
    });
});






/*


document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const overlay = document.getElementById('overlay');

    chatBubble.addEventListener('click', (event) => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            chatWindow.style.display = 'flex';
            overlay.style.display = 'block';
            setTimeout(() => {
                chatWindow.style.opacity = '1';
                chatWindow.style.transform = 'scale(1)';
            }, 10);
        } else {
            chatWindow.style.opacity = '0';
            chatWindow.style.transform = 'scale(0.8)';
            setTimeout(() => {
                chatWindow.style.display = 'none';
                overlay.style.display = 'none';
            }, 300);
        }
        event.stopPropagation();
    });

    closeChat.addEventListener('click', () => {
        closeChatWindow();
    });

    let isDragging = false;
    let offsetX, offsetY;

    chatBubble.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - chatBubble.getBoundingClientRect().left;
        offsetY = event.clientY - chatBubble.getBoundingClientRect().top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(event) {
        if (isDragging) {
            chatBubble.style.left = `${event.clientX - offsetX}px`;
            chatBubble.style.top = `${event.clientY - offsetY}px`;
            chatBubble.style.bottom = 'auto';
            chatBubble.style.right = 'auto';
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    overlay.addEventListener('click', (event) => {
        closeChatWindow();
        event.stopPropagation();
    });

    function closeChatWindow() {
        chatWindow.classList.remove('open');
        chatWindow.style.opacity = '0';
        chatWindow.style.transform = 'scale(0.8)';
        setTimeout(() => {
            chatWindow.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }

    chatWindow.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});



*/

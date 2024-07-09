
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
document.getElementById('timer').style.display = 'none';

const questionNumber = gucco1.length;
const timeInseconds = questionNumber * 20;
const timeInMinutes= timeInseconds / 60;
const timerDuration = Math.ceil(timeInMinutes);

// const resultDiv = document.querySelector('.container');
const resultDiv = document.getElementById('noteIt');
const message = `Number of questions: <span class="highlight"> ${questionNumber} </span> <br> You will get 👉<span class="highlight"> ${timerDuration} minutes </span> to give this exam`;
resultDiv.innerHTML = message;

function generateAnswerSheet() {
    
  

    const questionNumber = gucco1.length;
    const timeInseconds = questionNumber * 20;
    const timeInMinutes= timeInseconds / 60;
    const timerDuration = Math.ceil(timeInMinutes);
    // Confirmation before generating answer sheet
    if (!answersSubmitted && !confirm("Are you ready for the exam? Ok, Lets start....")) {
        return;
    }


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
    document.getElementById('timer').style.display = 'block';

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

// Function to submit answers
function submitAnswers() {
    const idToHide = document.getElementById('submittext');

    // Confirmation before submitting answers
    if (!confirm("Are you sure you want to submit your answers? You won't be able to change them later.")) {
        return;
    }

    if (answersSubmitted) return; // Prevent submitting answers multiple times
    answersSubmitted = true; // Set flag to true after answers have been submitted
    clearInterval(countdownTimer); // Stop the countdown timer

    // Hide submit button after confirmation
    idToHide.style.display = 'none';

    const selectedOptions = document.querySelectorAll('.option.selected');
    const correctAnswers = gucco1.split('');
    let totalMarks = 0;
    let answeredQuestions = [];

    selectedOptions.forEach(option => {
        const selectedLetter = option.textContent.trim();
        const correctLetter = correctAnswers[option.dataset.questionNumber - 1].trim();
        const questionNumber = parseInt(option.dataset.questionNumber);
        if (selectedLetter === correctLetter) {
            option.classList.add('correct');
            totalMarks += 1;
        } else {
            option.classList.add('incorrect');
            totalMarks -= 0.25;
        }

        option.classList.remove('selected');
        answeredQuestions.push(questionNumber);
    });

    // Check for unanswered questions and mark them as "skip"
    for (let i = 1; i <= totalCount; i++) {
        if (!answeredQuestions.includes(i)) {
            const questionDiv = document.getElementById(`question${i}`);
            questionDiv.innerHTML += `<div class="option skip">skipped</div>`;
        }
    }

    const lastElementDisplay = document.createElement('div');
    lastElementDisplay.textContent = "Marks: " + totalMarks.toFixed(2) + "/" + totalCount;
    lastElementDisplay.classList.add('last-element-display');

    // Get feedback message based on marks
    const original_marks = (totalMarks * 100) / totalCount;
    const actual_marks = original_marks.toFixed(2);
    console.log(original_marks);

    const feedbackMessage = getFeedbackMessage(actual_marks);

    // Create and append the feedback message element
    const feedbackElement = document.createElement('div');
    feedbackElement.textContent = feedbackMessage;
    feedbackElement.classList.add('feedback-message');
    const answerSheetContainer = document.getElementById('answerSheet');
    answerSheetContainer.appendChild(lastElementDisplay);
    answerSheetContainer.appendChild(feedbackElement);

    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.onclick = null);
    for (let i = 1; i <= correctAnswers.length; i++) {
        const correctLetter = correctAnswers[i - 1];
        const questionDiv = document.getElementById(`question${i}`);
        questionDiv.innerHTML += `<div class="correct-answer">Correct Answer: ${correctLetter}</div>`;
    }

    // Set onbeforeunload handler initially
    window.onbeforeunload = function () {
        if (!answersSubmitted) {
            return "Are you sure you want to leave? Your answers will be lost.";
        }
        else{
            return "Are you sure you want to leave? Your answers will be lost.";
        }
    };


    
}

document.addEventListener('DOMContentLoaded', () => {
    // Set the onbeforeunload handler to prompt user before leaving or refreshing
    window.onbeforeunload = function () {
        if (!answersSubmitted) {
            return "Are you sure you want to leave? Your answers will be lost.";
        }
    };

    // Other existing code within the DOMContentLoaded event listener...
});


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

    let isDragging = false;
    let offsetX, offsetY;

    // Function to handle both mouse and touch move events
    function handleMove(event) {
        if (isDragging) {
            const currentX = event.clientX || event.touches[0].clientX;
            const currentY = event.clientY || event.touches[0].clientY;
            chatBubble.style.left = `${currentX - offsetX}px`;
            chatBubble.style.top = `${currentY - offsetY}px`;
            chatBubble.style.bottom = 'auto';
            chatBubble.style.right = 'auto';
        }
    }

    // Function to open/close chat window
    function toggleChatWindow() {
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
    }

    // Toggle chat window visibility on bubble click
    chatBubble.addEventListener('click', (event) => {
        toggleChatWindow();
        event.stopPropagation(); // Prevent bubbling to body
    });

    // Close chat window on overlay click
    overlay.addEventListener('click', () => {
        toggleChatWindow();
    });

    // Dragging the chat bubble
    chatBubble.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - chatBubble.getBoundingClientRect().left;
        offsetY = event.clientY - chatBubble.getBoundingClientRect().top;

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.removeEventListener('mousemove', handleMove);
        });
    });

    // Touch events for dragging on mobile devices
    chatBubble.addEventListener('touchstart', (event) => {
        isDragging = true;
        const touch = event.touches[0];
        offsetX = touch.clientX - chatBubble.getBoundingClientRect().left;
        offsetY = touch.clientY - chatBubble.getBoundingClientRect().top;

        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', () => {
            isDragging = false;
            document.removeEventListener('touchmove', handleMove);
        });
    });

    // Close chat window on close button click
    closeChat.addEventListener('click', (event) => {
        toggleChatWindow();
        event.stopPropagation(); // Prevent bubbling to body
    });

    // Prevent chat window from closing on internal clicks
    chatWindow.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Function to close chat window when clicking anywhere inside it
    chatWindow.addEventListener('click', () => {
        toggleChatWindow();
    });

    // Function to close chat window when clicking on overlay
    overlay.addEventListener('click', () => {
        toggleChatWindow();
    });

    // Function to close chat window
    function closeChatWindow() {
        chatWindow.classList.remove('open');
        chatWindow.style.opacity = '0';
        chatWindow.style.transform = 'scale(0.8)';
        setTimeout(() => {
            chatWindow.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }
});



function getFeedbackMessage(marks){
    if (marks >= 85 && marks <= 100) {
        return `You will top in any national level exam InsaAllah. You Obtained: ${marks}/100`;
    } else if (marks >= 88 && marks <= 89) {
        return `You will rank good position in any national level exam InsaAllah. You Obtained: ${marks}/100`;
    } else if (marks >= 75 && marks < 85) {
        return `Keep going, you're doing well.At least you will get a good subject in university exams InsaAllah! You obtained: ${marks}/100`;
    } else if (marks >= 50 && marks < 75) {
        return `You can do better, keep practicing.Have to do better ! You obtained: ${marks}/100`;
    } else {
        return `Don't give up, keep working hard! Your Position is not good.   You obtained: ${marks}/100`;
    }
}



let questions = [];
let currentQuestionIndex = 0;

// Fetch the questions from the JSON file
fetch('./questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        displayQuestion();
    })
    .catch(error => console.error('Error loading questions:', error));

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showCompletionMessage();
        return;
    }

    const questionData = questions[currentQuestionIndex];
    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; // Clear previous content

    // Display question
    const questionElem = document.createElement('div');
    questionElem.className = 'question';
    questionElem.textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;
    container.appendChild(questionElem);

    // Display options
    const optionsList = document.createElement('ul');
    optionsList.className = 'options';

    questionData.options.forEach((option, index) => {
        const optionItem = document.createElement('li');

        const optionLabel = document.createElement('label');
        optionLabel.style.cursor = 'pointer';

        const optionInput = document.createElement('input');
        optionInput.type = questionData.correct_answers.length > 1 ? 'checkbox' : 'radio';
        optionInput.name = 'option';
        optionInput.value = option;

        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(document.createTextNode(` ${option}`));
        optionItem.appendChild(optionLabel);
        optionsList.appendChild(optionItem);
    });

    container.appendChild(optionsList);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Answer';
    submitButton.className = 'submit-button';
    submitButton.onclick = checkAnswer;
    container.appendChild(submitButton);
}

function checkAnswer() {
    const selectedOptions = document.querySelectorAll('input[name="option"]:checked');
    const feedbackElem = document.createElement('div');
    feedbackElem.className = 'feedback';

    if (selectedOptions.length === 0) {
        alert('Please select at least one answer.');
        return;
    }

    const userAnswers = Array.from(selectedOptions).map(input => input.value);
    const correctAnswers = questions[currentQuestionIndex].correct_answers;

    // Sort both arrays for comparison
    userAnswers.sort();
    correctAnswers.sort();

    const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);

    if (isCorrect) {
        feedbackElem.textContent = 'Correct!';
        feedbackElem.classList.add('correct');
    } else {
        feedbackElem.textContent = `Incorrect! The correct answer(s): ${correctAnswers.join(', ')}.`;
        feedbackElem.classList.add('incorrect');
    }

    const container = document.getElementById('quiz-container');
    container.appendChild(feedbackElem);

    // Disable input after submission
    const inputs = document.querySelectorAll('input[name="option"]');
    inputs.forEach(input => input.disabled = true);

    // Remove submit button after submission
    const submitButton = document.querySelector('.submit-button');
    submitButton.disabled = true;

    // Move to the next question after a delay
    currentQuestionIndex++;
    setTimeout(displayQuestion, 3000);
}

function showCompletionMessage() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '<p>You have completed the quiz! Thanks for participating.</p>';
}

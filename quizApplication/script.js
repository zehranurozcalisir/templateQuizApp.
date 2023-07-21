const quizContainer = document.getElementById("container");
const questionElement = document.getElementById("question");
const answersList = document.getElementById("answersList");
const nextButton = document.getElementById("nextBtn");
const resultContainer = document.getElementById("resultContainer");
const resultBody = document.getElementById("resultBody");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let questionIndices = [];
let countdownInterval; 
let isAnswerSelectable = false; 

function startQuiz() {
  // Fetch data from the JSONPlaceholder API
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => {
      // Map the received data to create an array of question objects
      questions = data.map((item, index) => {
        const questionText = item.title;
        const answerOptions = parseAnswerOptions(item.body);
        const correctAnswer = item.userId;

        // Create a question object with question text, answer options, correct answer, and user answer set to null
        return {
          question: questionText,
          answers: answerOptions,
          correctAnswer: correctAnswer,
          userAnswer: null
        };
      });

      // Generate random indices to select 10 questions for the quiz
      questionIndices = generateRandomIndices(questions.length, 10);

      // Display the first question on the screen
      showQuestion();

      // Disable answer buttons temporarily and wait for 10 seconds before enabling them
      const answerButtons = document.getElementsByClassName("answer-btn");
      for (let i = 0; i < answerButtons.length; i++) {
        answerButtons[i].disabled = true; 
      }

      setTimeout(() => {
        nextButton.disabled = false; // Enable the "Next" button
        isAnswerSelectable = true; // Allow answer selection
        for (let i = 0; i < answerButtons.length; i++) {
          answerButtons[i].disabled = false; // Enable answer buttons
        }
      }, 10000);
    })
    .catch(error => {
      console.log(error);
    });
}

// Function to generate an array of random indices within a specified range
function generateRandomIndices(maxRange, count) {
  const indices = [];

  // Loop until the desired number of unique random indices is reached
  while (indices.length < count) {
    // Generate a random index between 0 and maxRange (exclusive)
    const randomIndex = Math.floor(Math.random() * maxRange);

    // Check if the generated index is not already in the indices array (to ensure uniqueness)
    if (!indices.includes(randomIndex)) {
      // Add the random index to the indices array
      indices.push(randomIndex);
    }
  }

  // Return the array of random indices
  return indices;
}

// Function to parse answer options from a given string and assign letters (A, B, C, D) to each option
function parseAnswerOptions(body) {
  // Split the input string into an array of options based on newlines
  const options = body.split("\n");

  // Map the array of options to create an array of answer objects
  const answerOptions = options.map((option, index) => {
    // Assign letters A, B, C, D to the options based on their index in the array
    const letter = String.fromCharCode(65 + index); // 65 is the ASCII code for 'A'

    // Return an answer object with the option text and its corresponding letter
    return {
      text: option.trim(), // Trim any leading or trailing white spaces from the option text
      letter: letter
    };
  });

  // Return the array of answer objects
  return answerOptions;
}


function showQuestion() {
  // Check if all the questions have been displayed. If yes, show the quiz result and return.
  if (currentQuestionIndex >= questionIndices.length) {
    showResult();
    return;
  }

  // Get the current question object from the questions array using the index stored in questionIndices.
  const currentQuestion = questions[questionIndices[currentQuestionIndex]];

  // Set the text content of the questionElement to display the current question.
  questionElement.textContent = currentQuestion.question;

  // Clear any existing answer options displayed in the answersList by removing all its child elements.
  while (answersList.firstChild) {
    answersList.removeChild(answersList.firstChild);
  }

  // Loop through each answer option in the current question and create corresponding buttons for them.
  currentQuestion.answers.forEach(answer => {
    // Create a new list item element to represent the answer option.
    const answerItem = document.createElement("li");
    
    // Create a new button element for the answer option.
    const answerButton = document.createElement("button");

    // Set the text content of the button to display the answer option with its corresponding letter.
    answerButton.textContent = `${answer.letter}. ${answer.text}`;
    
    // Add the "answer-btn" class to the button for styling purposes.
    answerButton.classList.add("answer-btn");
    
    // Add an event listener to the button to handle answer selection when clicked.
    answerButton.addEventListener("click", () => {
      selectAnswer(answer.letter);
    });

    // Append the button as a child to the list item.
    answerItem.appendChild(answerButton);
    
    // Append the list item as a child to the answersList to display the answer option.
    answersList.appendChild(answerItem);
  });

  // Disable the "Next" button while displaying the current question.
  nextButton.disabled = true;

  // Get all the answer buttons and disable them to prevent answer selection at the beginning.
  const answerButtons = document.getElementsByClassName("answer-btn");
  for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].disabled = true;
  }

  // Reset the countdown timer for each question.
  resetCountdown();
  
  // Start the countdown timer for the current question.
  startCountdown();

  // Enable the "Next" button and answer selection after 10 seconds.
  setTimeout(() => {
    nextButton.disabled = false;
    isAnswerSelectable = true;
    for (let i = 0; i < answerButtons.length; i++) {
      answerButtons[i].disabled = false;
    }
  }, 10000);
}


function selectAnswer(userAnswer) {
  // Check if the answer selection is currently allowed.
  if (!isAnswerSelectable) {
    return; // If not allowed, exit the function without performing any further actions.
  }

  // Get the current question object from the questions array using the index stored in questionIndices.
  const currentQuestion = questions[questionIndices[currentQuestionIndex]];

  // Store the user's selected answer in the current question object.
  currentQuestion.userAnswer = userAnswer;

  // Enable the "Next" button since the user has selected an answer.
  nextButton.disabled = false;

  // Disable answer selection for the next 10 seconds by setting isAnswerSelectable to false.
  isAnswerSelectable = false;

  // After 10 seconds, re-enable answer selection by setting isAnswerSelectable to true.
  setTimeout(() => {
    isAnswerSelectable = true;
  }, 10000);
}

function showResult() {
  // Hide the quiz container and show the result container to display the quiz result.
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  // Clear any existing content in the resultBody.
  resultBody.innerHTML = "";

  // Loop through each question in the questions array to display the user's answers in a table.
  questions.forEach((question, index) => {
    // Check if the user has provided an answer to the question and if the question is included in the questionIndices.
    if (question.userAnswer !== null && questionIndices.includes(index)) {
      // Create a new row (table row) element to represent the question and its user answer.
      const row = document.createElement("tr");
      const questionCell = document.createElement("td"); // Create a new cell for the question.
      const userAnswerCell = document.createElement("td"); // Create a new cell for the user's answer.

      // Set the text content of the cells to display the question and the user's answer.
      questionCell.textContent = question.question;
      userAnswerCell.textContent = question.userAnswer;

      // Append the cells as children to the row.
      row.appendChild(questionCell);
      row.appendChild(userAnswerCell);

      // Append the row as a child to the resultBody to display the question and its user answer in the table.
      resultBody.appendChild(row);
    }
  });
}


function handleNextQuestion() {
  // Increase the currentQuestionIndex to move to the next question.
  currentQuestionIndex++;

  // Call the showQuestion function to display the next question or show the result if all questions are answered.
  showQuestion();
}

function startCountdown() {
  // Set the initial countdown time to 30 seconds.
  let seconds = 30;

  // Start the countdown by setting an interval that decrements the seconds value every 1000 milliseconds (1 second).
  countdownInterval = setInterval(() => {
    seconds--;

    // If the countdown reaches 0 or goes below 0, stop the interval and proceed to the next question.
    if (seconds < 0) {
      clearInterval(countdownInterval);
      handleNextQuestion();
    }
  }, 1000);

  // Disable the "Next" button at the start of the countdown to prevent clicking while answering the question.
  nextButton.disabled = true;
}

function resetCountdown() {
  // Clear the countdownInterval to stop the ongoing countdown.
  clearInterval(countdownInterval);
}

// Add an event listener to the "Next" button to call the handleNextQuestion function when the button is clicked.
nextButton.addEventListener("click", handleNextQuestion);

// Call the startQuiz function to initiate the quiz when the page is loaded.
startQuiz();

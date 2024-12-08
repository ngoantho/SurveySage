/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Connect to the database
db = db.getSiblingDB('surveySageSample')

db.createCollection('analyses')

// Create the 'surveys' collection
db.createCollection('surveys')
surveysCollection = db.getCollection("surveys")
surveysCollection.remove({})

// Insert a survey into the 'surveys' collection
surveysCollection.insert(
  {
    surveyId: 1,
    name: "Customer Feedback Survey",
    description: "Survey to gather customer feedback on our products and services.",
    owner: "VSomwanshi",
    status: "active" // Added status field
  }
)
surveysCollection.insert(
  {
    surveyId: 2,
    name: "HVAC Usage Survey",
    description: "Survey to gather customer feedback on their HVAC usage",
    owner: "QTran",
    status: "active" // Added status field
  }
)

surveysCollection.insert(
  {
    surveyId: 3,
    name: "Favorite Game Survey",
    description: "Survey to gather customer feedback on their favorite PC games",
    owner: "Anthony Ngo",
    status: "active" // Added status field
  }
)
// Create the 'questions' collection
db.createCollection('questions')
questionsCollection = db.getCollection("questions")
questionsCollection.remove({})

// Insert questions into the 'questions' collection for Survey 1
questionsCollection.insert(
  {
    surveyId: 1,
    questions: [
      {
        questionId: 1,
        type: "text-response",
        isRequired: true,
        text: "What do you think about our product?",
        payload: [],
      },
      {
        questionId: 2,
        type: "single-choice",
        isRequired: true,
        text: "How satisfied are you with our service?",
        payload: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very Unsatisfied"]
      },
      {
        questionId: 3,
        type: "single-choice",
        isRequired: true,
        text: "Would you recommend our product to others?",
        payload: ["Yes", "No"]
      },
      {
        questionId: 4,
        type: "text-response",
        isRequired: true,
        text: "What improvements would you like to see?",
        payload: []
      }
    ]
  }
)
questionsCollection.insert(
  {
    surveyId: 2,
    questions: [
      {
        questionId: 1,
        type: "multiple-choice",
        isRequired: true,
        text: "Which energy source is your HVAC system(s)?",
        payload: ["Gas", "Electric", "Oil"]
      },
      {
        questionId: 2,
        type: "text-response",
        isRequired: false,
        text: "Please input your ZIP code: ",
        payload: []
      },
      {
        questionId: 3,
        type: "single-choice",
        isRequired: true,
        text: "Are you interested in convert all your HVAC to electric?",
        payload: ["Yes", "No"]
      },
      {
        questionId: 4,
        type: "text-response",
        isRequired: true,
        text: "Is there anything you would like to share about your HVAC?",
        payload: []
      }
    ]
  }
)

questionsCollection.insert(
  {
    surveyId: 3,
    questions: [
      {
        questionId: 1,
        type: "multiple-choice",
        isRequired: true,
        text: "Which type of games are you usually playing?",
        payload: ["FPS", "AAA", "ESport", "RPG", "TabletopGame"]
      },
      {
        questionId: 2,
        type: "text-response",
        isRequired: false,
        text: "Please tell us a bit more about your gaming experience on your PC",
        payload: []
      },
      {
        questionId: 3,
        type: "single-choice",
        isRequired: true,
        text: "Do you feel like you need a better PC?",
        payload: ["Yes", "No"]
      },
      {
        questionId: 4,
        type: "single-choice",
        isRequired: true,
        text: "How many hours do you usually spend for gaming?",
        payload: ["1", "2", "3", "4", "5"]
      }
    ]
  }
)
// Create the 'answers' collection
db.createCollection('answers')
answersCollection = db.getCollection("answers")
answersCollection.remove({})

// Insert answers into the 'answers' collection for Survey 1, Question 1
answersCollection.insert(
  {
    surveyId: 1,
    questionId: 1,
    answers: [
      {
        answerId: 1,
        payload: ["It's great!"]
      },
      {
        answerId: 2,
        payload: ["Could be better."]
      }
    ]
  }
)

// Insert answers into the 'answers' collection for Survey 1, Question 2
answersCollection.insert(
  {
    surveyId: 1,
    questionId: 2,
    answers: [
      {
        answerId: 1,
        payload: ["Satisfied"]
      },
      {
        answerId: 2,
        payload: ["Neutral"]
      }
    ]
  }
)

// Insert answers into the 'answers' collection for Survey 1, Question 3
answersCollection.insert(
  {
    surveyId: 1,
    questionId: 3,
    answers: [
      {
        answerId: 1,
        payload: ["Yes"]
      },
      {
        answerId: 2,
        payload: ["No"]
      }
    ]
  }
)

// Insert answers into the 'answers' collection for Survey 1, Question 4
answersCollection.insert(
  {
    surveyId: 1,
    questionId: 4,
    answers: [
      {
        answerId: 1,
        payload: ["More color options."]
      },
      {
        answerId: 2,
        payload: ["Better customer support."]
      }
    ]
  }
)

answersCollection.insert(
  {
    surveyId: 2,
    questionId: 1,
    answers: [
      {
        answerId: 1,
        payload: ["Gas"]
      },
      {
        answerId: 2,
        payload: ["Gas", "Electric"]
      },
      {
        answerId: 3,
        payload: ["Oil"]
      }
    ]
  }
)

answersCollection.insert(
  {
    surveyId: 2,
    questionId: 2,
    answers: [
      {
        answerId: 1,
        payload: ["98178"]
      },
      {
        answerId: 2,
        payload: ["98092"]
      },
      {
        answerId: 3,
        payload: ["98108"]
      }
    ]
  }
)

answersCollection.insert(
  {
    surveyId: 2,
    questionId: 3,
    answers: [
      {
        answerId: 1,
        payload: ["Yes"]
      },
      {
        answerId: 2,
        payload: ["No"]
      },
      {
        answerId: 3,
        payload: ["Yes"]
      }
    ]
  }
)
answersCollection.insert(
  {
    surveyId: 2,
    questionId: 4,
    answers: [
      {
        answerId: 1,
        payload: ["It's not blowing enough cool air in the hot days"]
      },
      {
        answerId: 2,
        payload: ["My system works good. But I prefer to have programmable thermostat for my convenience."]
      }
    ]
  }
)

answersCollection.insert(
  {
    surveyId: 3,
    questionId: 1,
    answers: [
      {
        answerId: 1,
        payload: ["RPG"]
      },
      {
        answerId: 2,
        payload: ["ESport"]
      },
      {
        answerId: 3,
        payload: ["RPG"]
      }
    ]
  }
)

answersCollection.insert(
  {
    surveyId: 3,
    questionId: 2,
    answers: [
      {
        answerId: 1,
        payload: ["It's all good. I spent a lot on my PC and games collection"]
      },
      {
        answerId: 2,
        payload: ["My PC is kinda slow. But it is good enough for average games."]
      },
      {
        answerId: 3,
        payload: ["No Comment"]
      }
    ]
  }
)

answersCollection.insert(
  {
    surveyId: 3,
    questionId: 3,
    answers: [
      {
        answerId: 1,
        payload: ["Yes"]
      },
      {
        answerId: 2,
        payload: ["No"]
      },
      {
        answerId: 3,
        payload: ["No"]
      }
    ]
  }
)

answersCollection.insert(
  {
    surveyId: 3,
    questionId: 4,
    answers: [
      {
        answerId: 1,
        payload: ["5"]
      },
      {
        answerId: 2,
        payload: ["5"]
      },
      {
        answerId: 3,
        payload: ["2"]
      }
    ]
  }
)
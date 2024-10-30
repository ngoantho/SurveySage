// Connect to the database
db = db.getSiblingDB('surveySageSample')

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
        payload: null,
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
        payload: null
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
        payload: null
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
        payload: null
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
        Payload: ["Satisfied"]
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
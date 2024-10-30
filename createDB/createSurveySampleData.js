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
     isRequired: TRUE,
     payload: "What do you think about our product?"
    },
    {
      questionId: 2,
     type: "single-choice",
     isRequired: TRUE,
      text: "How satisfied are you with our service?",
      payload: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very Unsatisfied"]
    },
    {
      questionId: 3,
     type: "single-choice",
     isRequired: TRUE,
      payload: "Would you recommend our product to others?",
    },
    {
      questionId: 4,
     type: "text-response",
    isRequired: TRUE,
      payload: "What improvements would you like to see?",
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
# Multilingual FAQ API with Redis

A REST API for storing and retrieving FAQs in multiple languages using Node.js, Express, MongoDB, and Redis.

##  Features
-  Multilingual support (English, Hindi, Bengali)
-  Redis caching for fast responses
-  Simple REST API (`GET` & `POST` requests)
-  Easy deployment & testing

##  Installation
```sh
git clone https://github.com/Shubhammal/BharatFDAssignment
npm install
```
## Start MongoDB and Redis
```sh
redis-server
mongod
```
## Run API
``` sh
npm install
```
## POST /faqs
``` sh
{
  "question": "What is Redis?",
  "answer": "Redis is an in-memory database.",
  "translations": {
    "question_hi": "रेडिस क्या है?",
    "answer_hi": "रेडिस एक इन-मेमोरी डेटाबेस है।"
  }
}
```
## GET /faqs?lang=hi
``` sh
[
  { "question": "रेडिस क्या है?", "answer": "रेडिस एक इन-मेमोरी डेटाबेस है।" }
]
```

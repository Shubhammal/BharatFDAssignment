const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: {
    question_hi: String,
    answer_hi: String,
    question_bn: String,
    answer_bn: String,
  },
});

FAQSchema.methods.getTranslatedText = function(lang) {
  const translation = this.translations[`question_${lang}`] ? {
    question: this.translations[`question_${lang}`],
    answer: this.translations[`answer_${lang}`],
  } : {
    question: this.question,
    answer: this.answer,
  };
  return translation;
};

module.exports = mongoose.model('FAQ', FAQSchema);
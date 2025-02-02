const translate = require('google-translate-api');

exports.translateText = async (text, lang) => {
  try {
    const res = await translate(text, { to: lang });
    return res.text;
  } catch (err) {
    console.error('Translation error:', err);
    return text; // Fallback to original text
  }
};
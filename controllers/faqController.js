const FAQ = require('../models/FAQ');
const cache = require('../utils/cache');

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, translations } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }


    const existingFAQ = await FAQ.findOne({
      $or: [
        { question },
        { "translations.question_hi": question },
        { "translations.question_bn": question }
      ]
    });

    if (existingFAQ) {
      return res.status(409).json({ message: 'FAQ with this question already exists', faq: existingFAQ });
    }



    // Create and save FAQ
    const newFAQ = new FAQ({ question, answer, translations: translations || {} });
    await newFAQ.save();

    console.log("New FAQ created:", newFAQ);

    // Fetch all FAQs from DB
    const allFAQs = await FAQ.find();
    
    console.log("All FAQs fetched from DB:", allFAQs);

    // Update caches for each language
    const languages = ['en', 'hi', 'bn'];
    for (const lang of languages) {
      const translatedFAQs = allFAQs.map(faq => faq.getTranslatedText(lang));
      await cache.set(`faqs_${lang}`, JSON.stringify(translatedFAQs),{EX : 3600});
    }

    res.status(201).json({ message: 'FAQ created successfully', faq: newFAQ });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





exports.getFAQs = async (req, res) => {
  const { lang = 'en' } = req.query;
  const cacheKey = `faqs_${lang}`;

  try {
    // Check if cached data exists
    const cachedFAQs = await cache.get(cacheKey);

    if (cachedFAQs) {
      try {
        const parsedData = JSON.parse(cachedFAQs);
        console.log("Cache hit, returning cached data:", parsedData);
        return res.json(parsedData);
      } catch (parseError) {
        console.error("❌ Error parsing cached data:", parseError);
      }
    }

    // If no cache, fetch from DB and cache it
    const faqs = await FAQ.find();
    const translatedFAQs = faqs.map(faq => faq.getTranslatedText(lang));

    console.log("Fetched from DB:", translatedFAQs);

    // Cache the new FAQ data
    await cache.set(cacheKey, translatedFAQs);

    res.json(translatedFAQs);
  } catch (err) {
    console.error('Error fetching FAQs:', err);
    res.status(500).json({ error: err.message });
  }
};


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Translate } = require('@google-cloud/translate');

// Set up the Google Cloud Translation API client
const translate = new Translate({ projectId: '<your-project-id>' });

app.use(bodyParser.json());

// Translation endpoint
app.post('/translate', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;
    const [translation] = await translate.translate(text, {
      from: sourceLanguage,
      to: targetLanguage
    });
    res.status(200).json({ translation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
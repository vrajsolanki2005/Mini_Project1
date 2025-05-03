export async function translateTextHandler(req, res) {
    try {
      const { text, sourceLang, targetLang } = req.body;
  
      // Validate input
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }
  
      if (!sourceLang || !targetLang) {
        return res.status(400).json({ error: "Source and target languages are required" });
      }
  
      // LibreTranslate API endpoint (no API key required for many public instances)
      const url = "https://libretranslate.de/translate";
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang.split("-")[0], // Extract 'en' from 'en-US'
          target: targetLang.split("-")[0],
          format: "text",
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Translation API error:", errorData);
        return res.status(response.status).json({ error: "Translation service error" });
      }
  
      const data = await response.json();
      const translatedText = data.translatedText;
  
      return res.json({ translatedText });
    } catch (error) {
      console.error("Translation error:", error);
      return res.status(500).json({ error: "Failed to translate text" });
    }
  }
  
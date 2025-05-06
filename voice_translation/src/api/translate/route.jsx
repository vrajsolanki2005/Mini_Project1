const languageCodeMap = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  ja: "ja",
  ko: "ko",
  zh: "zh",
  ru: "ru",
  pt: "pt",
  ar: "ar",
  hi: "hi",
  nl: "nl",
  pl: "pl",
  tr: "tr",
};



export async function translateText(text, sourceLang, targetLang) {
  try {
    if (!text) {
      return { error: "Text is required" };
    }

    if (!sourceLang || !targetLang) {
      return { error: "Source and target languages are required" };
    }

    const sourceLanguageCode = sourceLang.split("-")[0];
    const targetLanguageCode = targetLang.split("-")[0];

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLanguageCode}|${targetLanguageCode}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Translation API error:", errorData);
      return { error: `Translation service error: ${response.status}` };
    }

    const data = await response.json();

    if (!data.responseData || !data.responseData.translatedText) {
      console.error("Unexpected API response:", data);
      return { error: "Translation failed or returned unexpected result" };
    }

    if (
      data.responseStatus === 429 ||
      (data.quotaFinished && data.quotaFinished === true)
    ) {
      return {
        error: "Translation quota exceeded. Please try again tomorrow.",
      };
    }

    return { translatedText: data.responseData.translatedText };
  } catch (error) {
    console.error("Translation error:", error);
    return { error: "Failed to translate text" };
  }
}

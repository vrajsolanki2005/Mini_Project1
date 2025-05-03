import React, { useState, useEffect, useRef } from "react";
import "./voice_translation.css"; // simple css file
const LANGUAGES = [
  { code: "en-US", name: "English" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "it-IT", name: "Italian" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "ru-RU", name: "Russian" },
  { code: "pt-BR", name: "Portuguese" },
  { code: "ar-SA", name: "Arabic" },
  { code: "hi-IN", name: "Hindi" },
  { code: "nl-NL", name: "Dutch" },
  { code: "pl-PL", name: "Polish" },
  { code: "tr-TR", name: "Turkish" },
];

async function translateText(text, fromLang, toLang) {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang: fromLang, targetLang: toLang }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Translation failed");
    return data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}


async function fallbackTranslate(text, fromLang, toLang) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `[DEMO] ${text}`;
}

export default function Translator() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [sourceLang, setSourceLang] = useState("en-US");
  const [targetLang, setTargetLang] = useState("es-ES");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputMode, setInputMode] = useState("voice");
  const [textInput, setTextInput] = useState("");
  const [error, setError] = useState(null);
  const [apiConfigured, setApiConfigured] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "test", sourceLang: "en-US", targetLang: "es-ES" }),
        });
        const data = await res.json();
        setApiConfigured(!data.error?.includes("not configured"));
      } catch {
        setApiConfigured(false);
      }
    };
    checkApi();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = sourceLang;

        recognition.onresult = (event) => {
          let current = "";
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
        };

        recognition.onerror = (event) => {
          console.error("Speech error", event.error);
          setIsListening(false);
          setError(`Speech error: ${event.error}`);
        };

        recognition.onend = () => {
          if (isListening) recognition.start();
        };

        recognitionRef.current = recognition;
      } else {
        setError("Speech recognition not supported. Use text input.");
      }
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [sourceLang, isListening]);

  useEffect(() => {
    if (recognitionRef.current) recognitionRef.current.lang = sourceLang;
  }, [sourceLang]);

  const toggleListening = () => {
    setError(null);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setTranslation("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        setError("Microphone error. Check permissions.");
      }
    }
  };

  const handleTranslate = async () => {
    const text = inputMode === "voice" ? transcript : textInput;
    if (!text) return;

    setIsTranslating(true);
    setError(null);
    try {
      const result = apiConfigured ? await translateText(text, sourceLang, targetLang) : await fallbackTranslate(text, sourceLang, targetLang);
      setTranslation(result);
    } catch (error) {
      setError(error.message || "Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const speakTranslation = () => {
    if (!translation || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = targetLang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="card">
      <h2>Translator</h2>

      <div className="mode-toggle">
        <button onClick={() => setInputMode("voice")} className={inputMode === "voice" ? "active" : ""}>Voice</button>
        <button onClick={() => setInputMode("text")} className={inputMode === "text" ? "active" : ""}>Text</button>
      </div>

      {apiConfigured === false && <div className="alert">Running in demo mode. Add API key.</div>}
      {error && <div className="error">{error}</div>}

      <div className="row">
        <div className="col">
          <label>Source Language</label>
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label>Target Language</label>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-area">
        <label>{inputMode === "voice" ? "Your Speech" : "Your Text"}</label>
        {inputMode === "voice" ? (
          <div className="output-box">{transcript || "Speak now..."}</div>
        ) : (
          <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Type here..." />
        )}
      </div>

      <div className="text-area">
        <label>Translation</label>
        <div className="output-box">{translation || "Translation will appear here..."}</div>
      </div>

      <div className="actions">
        {inputMode === "voice" && (
          <button onClick={toggleListening}>
            {isListening ? "Stop Listening" : "Start Listening"}
          </button>
        )}
        <button onClick={handleTranslate} disabled={isTranslating}>
          {isTranslating ? "Translating..." : "Translate"}
        </button>
        <button onClick={isSpeaking ? stopSpeaking : speakTranslation} disabled={!translation}>
          {isSpeaking ? "Stop Speaking" : "Speak"}
        </button>
      </div>
    </div>
  );
}

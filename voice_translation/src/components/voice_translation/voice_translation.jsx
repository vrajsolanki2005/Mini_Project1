  
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import  "./voice_translation.css";

const LANGUAGES = [
  { code: "en-US", name: "English" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "it-IT", name: "Italian" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "zh-CN", name: "Chinese" },
  { code: "ru-RU", name: "Russian" },
  { code: "pt-BR", name: "Portuguese" },
];

const translateText = async (text, fromLang, toLang) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockTranslations = {
    "en-US": {
      "es-ES": "Hola, esto es una traducción de demostración.",
      "fr-FR": "Bonjour, c'est une traduction de démonstration.",
      "de-DE": "Hallo, dies ist eine Demo-Übersetzung.",
      "it-IT": "Ciao, questa è una traduzione dimostrativa.",
      "ja-JP": "こんにちは、これはデモ翻訳です。",
      "ko-KR": "안녕하세요, 이것은 데모 번역입니다。",
      "zh-CN": "你好，这是一个演示翻译。",
      "ru-RU": "Привет, это демонстрационный перевод.",
      "pt-BR": "Olá, esta é uma tradução de demonstração.",
      
    },
  };

  if (mockTranslations[fromLang] && mockTranslations[fromLang][toLang]) {
    return mockTranslations[fromLang][toLang];
  }
  return `[Translation from ${fromLang} to ${toLang}]: ${text}`;
};

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
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = sourceLang;

        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          if (isListening) {
            recognition.start();
          }
        };

        recognitionRef.current = recognition;
      } else {
        console.error("Speech recognition not supported");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [sourceLang, isListening]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = sourceLang;
    }
  }, [sourceLang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current && recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setTranslation("");
      recognitionRef.current && recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleTranslate = async () => {
    if (!transcript) return;
    setIsTranslating(true);
    try {
      const result = await translateText(transcript, sourceLang, targetLang);
      setTranslation(result);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTextTranslate = async () => {
    if (!textInput) return;
    setIsTranslating(true);
    try {
      const result = await translateText(textInput, sourceLang, targetLang);
      setTranslation(result);
    } catch (error) {
      console.error("Translation error:", error);
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
    <div className="translator-container">
      <h2>Translator</h2>
      
      <div className="mode-switch">
        <button className={inputMode === "voice" ? "active" : ""} onClick={() => setInputMode("voice")}>
          Voice
        </button>
        <button className={inputMode === "text" ? "active" : ""} onClick={() => setInputMode("text")}>
          Text
        </button>
      </div>

      <div className="selectors">
        <div>
          <label>Source Language:</label>
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Target Language:</label>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="input-section">
        <label>{inputMode === "voice" ? "Your Speech" : "Your Text"}</label>
        {inputMode === "voice" ? (
          <div className="text-box">
            {transcript || "Speak something..."}
          </div>
        ) : (
          <textarea
            className="text-area"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your text here..."
          />
        )}
      </div>

      <div className="input-section">
        <label>Translation</label>
        <div className="text-box">
          {translation || "Translation will appear here..."}
        </div>
      </div>

      <div className="buttons">
        {inputMode === "voice" ? (
          <>
            <button onClick={toggleListening}>
              {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <button onClick={handleTranslate} disabled={!transcript || isTranslating}>
              Translate
            </button>
          </>
        ) : (
          <button onClick={handleTextTranslate} disabled={!textInput || isTranslating}>
            Translate
          </button>
        )}
        <button onClick={isSpeaking ? stopSpeaking : speakTranslation} disabled={!translation}>
          {isSpeaking ? "Stop Speaking" : "Speak Translation"}
        </button>
      </div>
    </div>
  );
}

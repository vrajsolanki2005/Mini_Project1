"use client";
import "./voice_translation.css";
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  TextField,
  MenuItem,
  Alert
} from "@mui/material";
import {
  Mic,
  MicOff,
  StopCircle,
  Languages,
  Volume2,
  Type,
  AlertCircle,
  Copy,
  Check
} from "lucide-react";

// List of supported languages
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
  { code: "gu-IN", name: "Gujarati"}

];

const translateText = async (text, fromLang, toLang) => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
    );

    const responseBody = await response.text();
    console.log("API Response Body:", responseBody);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Translation service error with status: ${response.status}`);
    }

    if (!responseBody) {
      throw new Error("Received empty response from translation API");
    }

    const data = JSON.parse(responseBody);

    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    } else {
      throw new Error("Unexpected response format from translation API");
    }
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

export default function Translator() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [translation, setTranslation] = useState("")
  const [sourceLang, setSourceLang] = useState("en-US")
  const [targetLang, setTargetLang] = useState("es-ES")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [inputMode, setInputMode] = useState("voice")
  const [textInput, setTextInput] = useState("")
  const [error, setError] = useState(null)
  const [copiedSource, setCopiedSource] = useState(false)
  const [copiedTranslation, setCopiedTranslation] = useState(false)
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(null)
  const [microphonePermission, setMicrophonePermission] = useState(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setSpeechRecognitionSupported(!!SpeechRecognition)
      if (!SpeechRecognition) {
        setInputMode("text")
      }
    }
  }, [])

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        if (navigator.permissions) {
          const permissionStatus = await navigator.permissions.query({ name: "microphone" })
          setMicrophonePermission(permissionStatus.state)
          permissionStatus.onchange = () => {
            setMicrophonePermission(permissionStatus.state)
          }
        }
      } catch (error) {
        console.error("Error checking microphone permission:", error)
      }
    }

    checkMicrophonePermission()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && speechRecognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition()
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = sourceLang

          recognition.onresult = (event) => {
            let currentTranscript = ""
            for (let i = 0; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript
            }
            setTranscript(currentTranscript)
          }

          recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error)
            setIsListening(false)

            if (event.error === "not-allowed") {
              setError("Microphone access denied. Please check your browser permissions.")
              setMicrophonePermission("denied")
            } else if (event.error === "no-speech") {
              setError("No speech detected. Please try speaking again.")
            } else {
              setError(`Speech recognition error: ${event.error}`)
            }
          }

          recognition.onend = () => {
            if (isListening) {
              try {
                recognition.start()
              } catch (error) {
                console.error("Failed to restart speech recognition:", error)
                setIsListening(false)
                setError("Speech recognition stopped unexpectedly.")
              }
            }
          }

          recognitionRef.current = recognition
        } catch (error) {
          console.error("Failed to initialize speech recognition:", error)
          setSpeechRecognitionSupported(false)
          setInputMode("text")
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error("Error stopping speech recognition:", error)
        }
      }
    }
  }, [sourceLang, speechRecognitionSupported])

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = sourceLang
    }
  }, [sourceLang])

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicrophonePermission("granted")
      return true
    } catch (error) {
      console.error("Microphone access denied:", error)
      setMicrophonePermission("denied")
      setError("Microphone access denied. Please check your browser permissions.")
      return false
    }
  }

  const toggleListening = async () => {
    setError(null)

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
          setIsListening(false)
        } catch (error) {
          console.error("Failed to stop speech recognition:", error)
        }
      }
    } else {
      if (microphonePermission !== "granted") {
        const granted = await requestMicrophoneAccess()
        if (!granted) return
      }

      setTranscript("")
      setTranslation("")

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
          setIsListening(true)
        } catch (error) {
          console.error("Failed to start speech recognition:", error)
          setError("Failed to start speech recognition. Please try again or use text input instead.")
        }
      } else {
        setError("Speech recognition is not available. Please use text input instead.")
        setInputMode("text")
      }
    }
  }

  const handleTranslate = async () => {
    const textToTranslate = inputMode === "voice" ? transcript : textInput
    if (!textToTranslate) return

    setError(null)
    setIsTranslating(true)
    try {
      const result = await translateText(textToTranslate, sourceLang, targetLang)
      setTranslation(result)
    } catch (error) {
      console.error("Translation error:", error)
      setError(`Translation failed: ${error.message || "Unknown error"}`)
    } finally {
      setIsTranslating(false)
    }
  }

  const speakTranslation = () => {
    if (!translation || isSpeaking) return

    setError(null)
    try {
      const utterance = new SpeechSynthesisUtterance(translation)
      utterance.lang = targetLang
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (event) => {
        setIsSpeaking(false)
        setError(`Speech synthesis error: ${event.error}`)
      }

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Speech synthesis error:", error)
      setError(`Failed to speak translation: ${error.message || "Unknown error"}`)
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const handleTextInputChange = (e) => {
    setTextInput(e.target.value)
  }

  const copyToClipboard = async (text, isSource) => {
    try {
      await navigator.clipboard.writeText(text)
      if (isSource) {
        setCopiedSource(true)
        setTimeout(() => setCopiedSource(false), 2000)
      } else {
        setCopiedTranslation(true)
        setTimeout(() => setCopiedTranslation(false), 2000)
      }
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="title">Translator</h2>
        <div className="mode-toggle">
          <button
            className={`mode-button ${inputMode === "voice" ? "active" : ""}`}
            onClick={() => setInputMode("voice")}
          >
            <Mic className="icon" />
            Voice
          </button>
          <button
            className={`mode-button ${inputMode === "text" ? "active" : ""}`}
            onClick={() => setInputMode("text")}
          >
            <Type className="icon" />
            Text
          </button>
        </div>
      </div>

      <div className="card-content">
        {error && (
          <div className="alert">
            <AlertCircle className="icon" />
            <span>{error}</span>
          </div>
        )}

        <div className="lang-select">
          <div>
            <label>Source Language</label>
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Target Language</label>
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-area">
          <div className="input-header">
            <label>{inputMode === "voice" ? "Your Speech" : "Your Text"}</label>
            <div className="input-actions">
              {inputMode === "voice" && isListening && <span className="recording-dot" />}
              {inputMode === "voice" && (
                <span className="recording-text">{isListening ? "Recording..." : "Not recording"}</span>
              )}
              {(transcript || textInput) && (
                <button
                  onClick={() => copyToClipboard(inputMode === "voice" ? transcript : textInput, true)}
                >
                  {copiedSource ? <Check className="icon" /> : <Copy className="icon" />}
                </button>
              )}
            </div>
          </div>
          {inputMode === "voice" ? (
            <div className="input-box">{transcript || "Speak to see your words here..."}</div>
          ) : (
            <textarea
              className="input-box"
              value={textInput}
              onChange={handleTextInputChange}
              placeholder="Type your text here..."
              rows={4}
            />
          )}
        </div>

        <div className="output-area">
          <div className="input-header">
            <label>Translation</label>
            <div className="input-actions">
              {isTranslating && <span className="recording-text">Translating...</span>}
              {translation && (
                <button onClick={() => copyToClipboard(translation, false)}>
                  {copiedTranslation ? <Check className="icon" /> : <Copy className="icon" />}
                </button>
              )}
            </div>
          </div>
          <div className="input-box">{translation || "Translation will appear here..."}</div>
        </div>
      </div>

      <div className="card-footer">
        {inputMode === "voice" ? (
          <>
            <button
              onClick={toggleListening}
              className={`primary-button ${isListening ? "danger" : ""}`}
            >
              {isListening ? <MicOff className="icon" /> : <Mic className="icon" />}
              {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <button
              onClick={handleTranslate}
              disabled={!transcript || isTranslating}
              className="primary-button blue"
            >
              <Languages className="icon" />
              Translate
            </button>
          </>
        ) : (
          <button
            onClick={handleTranslate}
            disabled={!textInput || isTranslating}
            className="primary-button blue"
          >
            <Languages className="icon" />
            Translate
          </button>
        )}
        <button
          onClick={isSpeaking ? stopSpeaking : speakTranslation}
          disabled={!translation}
          className="primary-button green"
        >
          {isSpeaking ? <StopCircle className="icon" /> : <Volume2 className="icon" />}
          {isSpeaking ? "Stop Speaking" : "Speak Translation"}
        </button>
      </div>
    </div>
  );
}
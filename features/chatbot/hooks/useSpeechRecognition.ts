"use client";

// features/chatbot/hooks/useSpeechRecognition.ts
//
// Dictado por voz con la Web Speech API del NAVEGADOR: la voz se convierte a texto acá mismo y
// al backend solo llega texto (con input_type "voice"). No cuesta nada ni manda audio a ningún
// servidor. Limitación: funciona en Chrome/Edge (y Safari parcial); en Firefox no existe, y
// `isSupported` queda en false → el botón del micrófono no se muestra.
//
// Si más adelante quieres transcripción en el servidor (ej. Whisper), este hook es lo único que
// cambia: grabar con MediaRecorder, mandar el audio al backend y recibir el texto.

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// El soporte del navegador no cambia en vida de la página: no hay nada a qué suscribirse.
const noopSubscribe = () => () => {};

// Tipos mínimos: la Web Speech API no viene en lib.dom de TypeScript.
type SpeechRecognitionResultLike = { isFinal: boolean; 0: { transcript: string } };
type SpeechRecognitionEventLike = { resultIndex: number; results: ArrayLike<SpeechRecognitionResultLike> };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Options = {
  lang?: string;
  // Texto parcial mientras se habla (para ir mostrándolo en el input).
  onInterim?: (text: string) => void;
  // Texto final al terminar de hablar.
  onFinal: (text: string) => void;
};

export function useSpeechRecognition({ lang = "es-PE", onInterim, onFinal }: Options) {
  // En el servidor (y en el primer render de hidratación) es false; en el cliente se consulta
  // al navegador. useSyncExternalStore evita el mismatch de hidratación sin setState en efecto.
  const isSupported = useSyncExternalStore(
    noopSubscribe,
    () => getRecognitionCtor() !== null,
    () => false
  );
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // Refs para que el reconocimiento siempre llame a los callbacks más recientes.
  const onFinalRef = useRef(onFinal);
  const onInterimRef = useRef(onInterim);
  useEffect(() => {
    onFinalRef.current = onFinal;
    onInterimRef.current = onInterim;
  });

  // Al desmontar (cerrar el panel) se corta el dictado si estaba activo.
  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor || recognitionRef.current) return;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    let finalText = "";
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interim += result[0].transcript;
      }
      onInterimRef.current?.((finalText + interim).trim());
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Permite el acceso al micrófono para dictar tu mensaje.");
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        setError("No pudimos escucharte. Inténtalo otra vez.");
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
      const text = finalText.trim();
      if (text) onFinalRef.current(text);
    };

    setError(null);
    recognitionRef.current = recognition;
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [lang]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { isSupported, isListening, error, start, stop };
}

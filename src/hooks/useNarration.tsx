import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const extractTextFromContent = (content: any): string => {
  if (!content.blocks) return "";

  return content.blocks
    .map((block: any) => block.text)
    .join(" ")
    .trim();
};

const stripHtml = (html: string) => {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

const useNarration = () => {
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );

  const location = useLocation();

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
    setIsPaused(false);
    setCurrentVoice(null);
  }, [location.pathname]);

  useEffect(() => {
    const populateVoices = () => {
      const voices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang === "en-US");
      setAvailableVoices(voices);
      if (!selectedVoice && voices.length) {
        setSelectedVoice(voices[0]);
      }
    };
    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null; // Cleanup the event listener
    };
  }, [selectedVoice]);

  const getRandomVoice = (): SpeechSynthesisVoice | null => {
    if (!availableVoices.length) return null;

    const randomIndex = Math.floor(Math.random() * availableVoices.length);
    return availableVoices[randomIndex];
  };

  const toggleNarration = (text: string) => {
    if (isNarrating && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }
    if (isNarrating && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(text);
    } catch {
      parsedContent = text;
    }

    const pureContent = stripHtml(extractTextFromContent(parsedContent));
    const narrationEndMessage =
      "The narration for this post has ended. Thank you for listening!";
    const utteranceContent = `${pureContent} ${narrationEndMessage}`;
    const utterance = new SpeechSynthesisUtterance(utteranceContent);

    const chosenVoice = selectedVoice || getRandomVoice();
    if (chosenVoice) {
      setCurrentVoice(chosenVoice);
      utterance.voice = chosenVoice;
    } else {
      console.warn("No English (US) voices available!");
      return;
    }

    utterance.onend = () => setIsNarrating(false);
    window.speechSynthesis.speak(utterance);
    setIsNarrating(true);
  };

  const getButtonLabel = () => {
    if (isNarrating && isPaused) {
      return (
        <>
          <span className="material-symbols-outlined">voice_over_off</span>
          Resume
        </>
      );
    }
    if (isNarrating) {
      return (
        <>
          <span className="material-symbols-outlined">record_voice_over</span>
          Pause
        </>
      );
    }
    return (
      <>
        <span className="material-symbols-outlined">play_arrow</span>
        Narrate
      </>
    );
  };

  const changeSelectedVoice = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);

    if (isNarrating) {
      window.speechSynthesis.cancel(); // Stop the current narration
      setIsNarrating(false); // Set narration state to false
    }
  };

  return {
    isNarrating,
    isPaused,
    toggleNarration,
    getButtonLabel,
    currentVoice,
    availableVoices,
    changeSelectedVoice,
    selectedVoice,
  };
};

export default useNarration;

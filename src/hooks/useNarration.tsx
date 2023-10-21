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
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);

  const getFemaleVoice = (): SpeechSynthesisVoice | null => {
    return (
      availableVoices.find((voice) =>
        voice.name.includes("Google US English Female")
      ) ||
      availableVoices[0] ||
      null
    );
  };

  const location = useLocation();

  useEffect(() => {
    // Stop the narration if the route changes
    window.speechSynthesis.cancel();
    setIsNarrating(false);
    setIsPaused(false);
  }, [location.pathname]);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const populateVoices = () => {
        setAvailableVoices(window.speechSynthesis.getVoices());
      };

      window.speechSynthesis.onvoiceschanged = populateVoices;
      populateVoices(); // Call once immediately
    }

    // This function will be called when the component using the hook is unmounted
    return () => {
      if (isNarrating) {
        window.speechSynthesis.cancel(); // Stops the current narration
      }
    };
  }, [isNarrating]); // Re-run the effect if `isNarrating` state changes

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
    utterance.voice = getFemaleVoice();
    utterance.onend = () => setIsNarrating(false);

    window.speechSynthesis.speak(utterance);
    setIsNarrating(true);
  };

  const getButtonLabel = () => {
    if (isNarrating && isPaused)
      return (
        <>
          <span className="material-symbols-outlined">voice_over_off</span>
          Resume Narration
        </>
      );

    if (isNarrating)
      return (
        <>
          <span className="material-symbols-outlined">record_voice_over</span>
          Pause Narration
        </>
      );

    return (
      <>
        <span className="material-symbols-outlined">play_arrow</span>
        Start Narration
      </>
    );
  };

  return { isNarrating, isPaused, toggleNarration, getButtonLabel };
};

export default useNarration;

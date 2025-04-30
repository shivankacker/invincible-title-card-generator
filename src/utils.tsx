import { useEffect, useRef, useState } from "react";

export const SOUND_FILES = [
  "/sounds/hmm.mp3",
  // Add more sound files here as they become available
] as const;

export const useRandomSound = (probability: number = 0.3) => {
  const [hasPlayed, setHasPlayed] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (hasPlayed) return;
    // choose a random sound file
    const randomSound =
      SOUND_FILES[Math.floor(Math.random() * SOUND_FILES.length)];
    audio.current = new Audio(randomSound);
    const audioElement = audio.current;
    audioElement.preload = "auto";
    audioElement.loop = false;
    audioElement.volume = 0.5;

    const handleInteraction = () => {
      if (Math.random() < probability) {
        audioElement.currentTime = 0; // Reset to the beginning
        audioElement.play().catch((error) => {
          console.error("Error playing sound:", error);
        });
      }
      setHasPlayed(true);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasPlayed]);
};

function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    platform: "web",
    os: "unknown",
    isApple: false,
    browser: "unknown",
  });

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    // 1. Determine if device is mobile or web
    const platform = /iphone|ipad|ipod|android/i.test(userAgent)
      ? "mobile"
      : "web";

    // 2. Determine operating system and whether it's an Apple device
    let os = "unknown";
    let isApple = false;

    if (/windows/i.test(userAgent)) {
      os = "windows";
    } else if (/mac os/i.test(userAgent)) {
      os = "mac";
      isApple = true;
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      os = "ios";
      isApple = true;
    } else if (/android/i.test(userAgent)) {
      os = "android";
    } else if (/linux/i.test(userAgent)) {
      os = "linux";
    }

    // 3. Determine browser
    let browser = "unknown";
    if (/edg/i.test(userAgent)) {
      browser = "edge";
    } else if (/opr/i.test(userAgent)) {
      browser = "opera";
    } else if (/chrome/i.test(userAgent)) {
      // Must check Chrome before Safari to avoid capturing Safari in Chrome-based user agents
      browser = "chrome";
    } else if (/safari/i.test(userAgent)) {
      browser = "safari";
    } else if (/firefox/i.test(userAgent)) {
      browser = "firefox";
    } else if (/msie/i.test(userAgent) || /trident/i.test(userAgent)) {
      browser = "ie";
    }

    setDeviceInfo({ platform, os, isApple, browser });
  }, []);

  return deviceInfo;
}

export default useDeviceInfo;

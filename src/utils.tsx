import { useEffect, useState } from "react";

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

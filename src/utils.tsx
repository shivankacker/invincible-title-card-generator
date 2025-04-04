import { useEffect, useState } from "react";

function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    platform: "web",
    os: "unknown",
    isApple: false,
  });

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    // Determine if device is mobile or web
    const platform = /iphone|ipad|ipod|android/i.test(userAgent)
      ? "mobile"
      : "web";

    // Determine operating system and whether it's an Apple device
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

    setDeviceInfo({ platform, os, isApple });
  }, []);

  return deviceInfo;
}

export default useDeviceInfo;

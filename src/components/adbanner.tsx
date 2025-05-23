import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function AdBanner(props: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const { className, style = {}, ...otherProps } = props;

  const development = process.env.NODE_ENV === "development";
  const hideAdBanner =
    development && import.meta.env.VITE_SHOW_AD_BANNERS !== "true";

  useEffect(() => {
    if (development) {
      return;
    }
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div
      className={twMerge(
        `shrink-0 ${development && "bg-gray-600"}`,
        className,
        hideAdBanner && "hidden",
      )}
    >
      {development && <div className="text-white">Ad Banner</div>}
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...style,
        }}
        data-ad-client="ca-pub-5462061436024339"
        {...otherProps}
      />
    </div>
  );
}

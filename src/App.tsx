import { useRef, useState } from "react";
import "./App.css";
import Header from "./components/header";
import { EditorState } from "./types";
import { Preview } from "./components/preview";
import { Toolbar } from "./components/toolbar";
import { Footer } from "./components/footer";
import { Analytics } from "@vercel/analytics/react";
import { useRandomSound } from "./utils";
import AdBanner from "./components/adbanner";

function App() {
  useRandomSound(0.001); // Now only needs probability parameter

  const [state, setState] = useState<EditorState>({
    text: "Invincible",
    color: "#ebed00",
    showCredits: true,
    showWatermark: true,
    background: "url('/backgrounds/blue.jpg') no-repeat center center / cover",
    fontSize: 24,
    outline: 0,
    outlineColor: "black",
    effect: null,
    generating: false,
    smallSubtitle: "BASED ON THE COMIC BOOK BY",
    subtitle: "Robert Kirkman, Cory Walker, & Ryan Ottley",
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Analytics />
      <div className="flex flex-col items-center justify-center md:h-screen">
        <Header />
        <div className="flex md:flex-row flex-col md:items-center md:justify-center md:flex-1 px-4 gap-4 md:gap-0 md:px-10 w-full">
          <div className="w-full md:w-2/3 flex flex-col-reverse md:flex-col gap-4">
            <Preview canvasRef={canvasRef} state={state} />
            <AdBanner
              data-ad-format="rectangle"
              data-ad-slot="6767948661"
              data-full-width-responsive="true"
              style={{
                width: "100%",
                minHeight: 100,
                maxHeight: 100,
              }}
            />
          </div>
          <Toolbar canvasRef={canvasRef} state={state} setState={setState} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;

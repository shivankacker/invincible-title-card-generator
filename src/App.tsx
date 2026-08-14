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
    subtitleOffset: -5,
    outlineColor: "black",
    effect: null,
    aspectRatio: "16:9",
    smallSubtitle: "BASED ON THE COMIC BOOK BY",
    subtitle: "Robert Kirkman, Cory Walker, & Ryan Ottley",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <Analytics />
      <div className="flex flex-col h-dvh overflow-hidden">
        <Header />
        <div className="flex flex-col md:flex-row flex-1 min-h-0 px-4 gap-4 md:gap-0 md:px-10 w-full overflow-hidden">
          <div className="w-full md:w-2/3 flex flex-col-reverse md:flex-col gap-4 min-h-0 shrink-0 md:flex-none">
            <Preview canvasRef={canvasRef} state={state} />
            <AdBanner
              data-ad-format="fluid"
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

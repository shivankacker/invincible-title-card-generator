import { useRef, useState } from "react";
import "./App.css";
import Header from "./components/header";
import { EditorState } from "./types";
import { Preview } from "./components/preview";
import { Toolbar } from "./components/toolbar";
import { Footer } from "./components/footer";
import { Analytics } from "@vercel/analytics/react";
import { useRandomSound } from "./utils";

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
      <Header />
      <div className="flex md:flex-row flex-col md:items-center md:justify-center md:h-screen p-4 gap-4 md:gap-0 md:p-12">
        <Preview canvasRef={canvasRef} state={state} />
        <Toolbar canvasRef={canvasRef} state={state} setState={setState} />
      </div>
      <Footer />
    </>
  );
}

export default App;

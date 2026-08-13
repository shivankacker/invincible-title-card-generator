export type AspectRatio = "16:9" | "9:16";

export interface EditorState {
  text: string;
  smallSubtitle: string;
  subtitle: string;
  showCredits: boolean;
  showWatermark: boolean;
  color: string;
  background: string;
  fontSize: number;
  outline: number;
  outlineColor: string;
  effect: string | null;
  subtitleOffset: number;
  aspectRatio: AspectRatio;
}

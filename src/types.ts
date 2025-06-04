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
  generating: boolean;
  subtitleOffset: number;
}

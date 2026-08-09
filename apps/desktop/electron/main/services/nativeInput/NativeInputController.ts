export interface INativeInputController {
  moveMouse(x: number, y: number): Promise<void>;
  mouseDown(button: "left" | "right" | "middle"): Promise<void>;
  mouseUp(button: "left" | "right" | "middle"): Promise<void>;
  mouseClick(button: "left" | "right" | "middle", doubleClick?: boolean): Promise<void>;
  mouseWheel(deltaX: number, deltaY: number): Promise<void>;
  keyDown(key: string): Promise<void>;
  keyUp(key: string): Promise<void>;
  releaseAll(): Promise<void>;
}

/** Windows input integration boundary. A verified native adapter must implement this before control is enabled. */
export interface NativeInputController {
  moveMouse(x: number, y: number): Promise<void>
  click(button: 'left' | 'right' | 'middle'): Promise<void>
  scroll(deltaX: number, deltaY: number): Promise<void>
  keyDown(key: string): Promise<void>
  keyUp(key: string): Promise<void>
  releaseAll(): Promise<void>
}

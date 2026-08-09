import { mouse, keyboard, Point, Button, Key, screen as nutScreen } from "@nut-tree-fork/nut-js";
import type { INativeInputController } from "../NativeInputController";

export class WindowsInputController implements INativeInputController {
  private pressedKeys = new Set<Key>();
  private pressedMouseButtons = new Set<Button>();

  // Map incoming string keys to nut.js Key enum
  private mapKey(keyString: string): Key | null {
    const keyMap: Record<string, Key> = {
      Enter: Key.Enter,
      Escape: Key.Escape,
      Backspace: Key.Backspace,
      Tab: Key.Tab,
      " ": Key.Space,
      Space: Key.Space,
      ArrowUp: Key.Up,
      ArrowDown: Key.Down,
      ArrowLeft: Key.Left,
      ArrowRight: Key.Right,
      Shift: Key.LeftShift,
      Control: Key.LeftControl,
      Alt: Key.LeftAlt,
      Meta: Key.LeftSuper,
      Windows: Key.LeftSuper,
      CapsLock: Key.CapsLock,
      Delete: Key.Delete,
      Home: Key.Home,
      End: Key.End,
      PageUp: Key.PageUp,
      PageDown: Key.PageDown,
      Insert: Key.Insert,
      F1: Key.F1,
      F2: Key.F2,
      F3: Key.F3,
      F4: Key.F4,
      F5: Key.F5,
      F6: Key.F6,
      F7: Key.F7,
      F8: Key.F8,
      F9: Key.F9,
      F10: Key.F10,
      F11: Key.F11,
      F12: Key.F12,
    };

    if (keyMap[keyString]) return keyMap[keyString];

    // Map A-Z (nut-js Key enum usually has Key.A, Key.B etc)
    if (keyString.length === 1) {
      const upper = keyString.toUpperCase();
      if (upper >= "A" && upper <= "Z") {
        return (Key as any)[upper] as Key;
      }
      if (upper >= "0" && upper <= "9") {
        return (Key as any)[`Num${upper}`] as Key;
      }
    }

    return null;
  }

  private mapMouseButton(button: "left" | "right" | "middle"): Button {
    switch (button) {
      case "right":
        return Button.RIGHT;
      case "middle":
        return Button.MIDDLE;
      case "left":
      default:
        return Button.LEFT;
    }
  }

  async moveMouse(x: number, y: number): Promise<void> {
    try {
      const width = await nutScreen.width();
      const height = await nutScreen.height();
      
      const targetX = Math.max(0, Math.min(width, x * width));
      const targetY = Math.max(0, Math.min(height, y * height));

      await mouse.setPosition(new Point(targetX, targetY));
    } catch (e) {
      console.error("[WindowsInputController] Failed to move mouse", e);
    }
  }

  async mouseDown(button: "left" | "right" | "middle"): Promise<void> {
    try {
      const btn = this.mapMouseButton(button);
      await mouse.pressButton(btn);
      this.pressedMouseButtons.add(btn);
    } catch (e) {
      console.error("[WindowsInputController] Failed to press mouse button", e);
    }
  }

  async mouseUp(button: "left" | "right" | "middle"): Promise<void> {
    try {
      const btn = this.mapMouseButton(button);
      await mouse.releaseButton(btn);
      this.pressedMouseButtons.delete(btn);
    } catch (e) {
      console.error("[WindowsInputController] Failed to release mouse button", e);
    }
  }

  async mouseClick(button: "left" | "right" | "middle", doubleClick = false): Promise<void> {
    try {
      const btn = this.mapMouseButton(button);
      if (doubleClick) {
        await mouse.doubleClick(btn);
      } else {
        await mouse.click(btn);
      }
    } catch (e) {
      console.error("[WindowsInputController] Failed to click mouse", e);
    }
  }

  async mouseWheel(deltaX: number, deltaY: number): Promise<void> {
    try {
      if (deltaY > 0) await mouse.scrollDown(deltaY);
      else if (deltaY < 0) await mouse.scrollUp(Math.abs(deltaY));

      if (deltaX > 0) await mouse.scrollRight(deltaX);
      else if (deltaX < 0) await mouse.scrollLeft(Math.abs(deltaX));
    } catch (e) {
      console.error("[WindowsInputController] Failed to scroll mouse", e);
    }
  }

  async keyDown(key: string): Promise<void> {
    try {
      const nutKey = this.mapKey(key);
      if (nutKey) {
        await keyboard.pressKey(nutKey);
        this.pressedKeys.add(nutKey);
      } else if (key.length === 1) {
        // Fallback for untracked characters
        await keyboard.type(key);
      }
    } catch (e) {
      console.error("[WindowsInputController] Failed to press key", e);
    }
  }

  async keyUp(key: string): Promise<void> {
    try {
      const nutKey = this.mapKey(key);
      if (nutKey) {
        await keyboard.releaseKey(nutKey);
        this.pressedKeys.delete(nutKey);
      }
    } catch (e) {
      console.error("[WindowsInputController] Failed to release key", e);
    }
  }

  async releaseAll(): Promise<void> {
    console.log("[WindowsInputController] Releasing all stuck keys and buttons");
    for (const key of this.pressedKeys) {
      try {
        await keyboard.releaseKey(key);
      } catch (e) {
        console.error("Failed to release key", key, e);
      }
    }
    this.pressedKeys.clear();

    for (const button of this.pressedMouseButtons) {
      try {
        await mouse.releaseButton(button);
      } catch (e) {
        console.error("Failed to release button", button, e);
      }
    }
    this.pressedMouseButtons.clear();
  }
}

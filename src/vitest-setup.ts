import "@testing-library/jest-dom";
import * as warning from "./utils/warning";

beforeEach(() => {
  if ((console.error as any).mockRestore) {
    (console.error as any).mockRestore();
  }

  if ((console.warn as any).mockRestore) {
    (console.warn as any).mockRestore();
  }

  if ((warning.warning as any).mockRestore) {
    (warning.warning as any).mockRestore();
  }

  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(warning, "warning").mockImplementation(() => {});

  warning.resetCodeCache();
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("shows error when API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not reach the translation service/i,
    );
  });

  it("shows successful translation from API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ translation: "Hello" }),
      }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Hello")).toBeInTheDocument();
  });
});

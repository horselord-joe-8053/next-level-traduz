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

  it("shows API detail message when translate returns an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ detail: "LLM_API_KEY is not configured" }),
      }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "LLM_API_KEY is not configured",
    );
  });

  it("clears a prior error when a later submit succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ translation: "Hello again" }),
      });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(await screen.findByText("Hello again")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("clears a prior translation when a later submit fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ translation: "First" }),
      })
      .mockRejectedValueOnce(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/portuguese text/i), "Olá");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(await screen.findByText("First")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not reach the translation service/i,
    );
    expect(screen.queryByText("First")).not.toBeInTheDocument();
  });
});

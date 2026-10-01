import { FormEvent, useState } from "react";

import { translateText } from "./api/translate";

export function App() {
  const [source, setSource] = useState("");
  const [translation, setTranslation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setTranslation(null);

    const result = await translateText(source);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setTranslation(result.translation);
  }

  return (
    <main>
      <h1>Traduz</h1>
      <p>Brazilian Portuguese → English</p>
      <form onSubmit={(e) => void onSubmit(e)}>
        <label htmlFor="source">Text</label>
        <textarea
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          aria-label="Portuguese text"
        />
        <p>
          <button type="submit" disabled={loading}>
            {loading ? "Translating…" : "Submit"}
          </button>
        </p>
      </form>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      {translation ? (
        <section className="translation" aria-live="polite">
          {translation}
        </section>
      ) : null}
    </main>
  );
}

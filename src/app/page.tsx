"use client";

import {useState} from "react";

export default function Home() {
  // Getting the variables ready that utilize useState hook (will use these a lot during this)
  const [alias, setAlias] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  // This will run when the form is submitted
  const Submit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from reloading after a submission
    // Makes a Post rrequest to the API route and gives it the alias and url
    const res = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({ alias, url }),
      headers: {"Content-Type": "application/json"},
    }
    );

    const data = await res.json(); // Getting the data of course

    if (data.error)
    {
      setMessage("Error: " + String(data.error));
    }
    else
    {
      setMessage("Short URL created");
    }
  };

  return (
      <main>
        <h1>URL Shortener</h1>
        <form onSubmit={Submit}>
          <input
              type="text"
              placeholder="Custom alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
          />
          <input
              type="url"
              placeholder="Long URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
          />
          <br />
          <button type="submit">Shorten the URL</button>
        </form>
        <p>{message}</p>
      </main>
  );
}
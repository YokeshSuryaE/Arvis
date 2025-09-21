// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { messages } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: "messages array required" });

  try {
    const recent = messages.slice(-12);
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: recent,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || "";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
}

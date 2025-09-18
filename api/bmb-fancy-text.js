export default function handler(req, res) {
  const { text, font = "Roboto", size = "48", weight = "400", align = "left" } = req.query;
  if (!text) return res.status(400).json({ error: "text required" });

  const safeText = String(text).replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const googleHref = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@100;400;700&display=swap`;

  const html = `<!doctype html><html><head>
<link href="${googleHref}" rel="stylesheet">
<style>.fancy-preview{ font-family:'${font}',system-ui; font-weight:${weight}; font-size:${size}px; text-align:${align};}</style>
</head><body><div class="fancy-preview">${safeText}</div></body></html>`;

  res.setHeader("Content-Type","text/html");
  res.status(200).send(html);
}

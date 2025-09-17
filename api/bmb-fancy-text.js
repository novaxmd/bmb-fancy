// api/bmb-facny-text.js
export default function handler(req, res) {
  const { text, font = "Roboto", size = "48", weight = "400", align = "left" } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Query param 'text' is required" });
  }

  const safeText = String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cssFontFamily = font.replace(/\+/g, " ");
  const googleHref = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    font
  )}:wght@100;200;300;400;500;600;700;800;900&display=swap`;

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="${googleHref}" rel="stylesheet">
<style>
  .fancy-preview {
    font-family: '${cssFontFamily}', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    font-weight: ${weight};
    font-size: ${parseInt(size)}px;
    text-align: ${align};
  }
</style>
</head>
<body>
  <div class="fancy-preview">${safeText}</div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}

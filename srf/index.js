addEventListener("fetch", event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  const url = new URL(request.url)
  const res = await fetch(request)
  const ct = res.headers.get("Content-Type") || ""
  if (!ct.includes("text/html")) return res

  let html = await res.text()
  const canonicalTag = `<link rel="canonical" href="${url.origin + url.pathname}" />`
  html = html.replace(/<\/head>/i, canonicalTag + "\n</head>")

  return new Response(html, {
    status: res.status,
    headers: res.headers
  })
}

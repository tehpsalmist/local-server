console.log('Starting up!')

Deno.serve(async (req) => {
  console.log('serving', req.url)

  const { pathname } = new URL(req.url)

  if (pathname.includes('..') || pathname.endsWith('/')) {
    return new Response('Ah ah aaah, nice try, buddy!', { status: 400 })
  }

  const fileName = `.${decodeURIComponent(pathname)}`

  const file = await Deno.open(fileName, { read: true })
    .catch((err) => err instanceof Error ? err : new Error(JSON.stringify(err)))

  if (file instanceof Error) {
    return new Response('Not Found', { status: 404 })
  }

  return new Response(file.readable, { headers: { 'Access-Control-Allow-Origin': '*' } })
})

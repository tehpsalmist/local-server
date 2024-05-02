console.log('Starting up!')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

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

  return new Response(file.readable, {
    headers: corsHeaders,
  })
})

// Resolves a 6-digit PIN code to its district and state for the address form.
// Tries India Post first and falls back to Zippopotam, because the postal API is
// frequently rate-limited or down; either source is enough to auto-fill.
async function fromIndiaPost(pincode) {
  const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  if (!res.ok) return null;
  const data = await res.json();
  const po = Array.isArray(data) && data[0]?.Status === 'Success' ? data[0]?.PostOffice?.[0] : null;
  if (!po) return null;
  return { city: po.District || po.Block || po.Name || '', state: po.State || '' };
}

async function fromZippopotam(pincode) {
  const res = await fetch(`https://api.zippopotam.us/in/${pincode}`);
  if (!res.ok) return null;
  const data = await res.json();
  const place = data?.places?.[0];
  if (!place) return null;
  return { city: place['place name'] || '', state: place.state || '' };
}

export default async function (req, ctx) {
  const db = ctx.db;
  try {
        const user = await db.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const pincode = body?.pincode;
    if (!pincode || !/^\d{6}$/.test(String(pincode))) {
      return Response.json({ error: 'Invalid pincode' }, { status: 400 });
    }
    let place = null;
    for (const lookup of [fromIndiaPost, fromZippopotam]) {
      place = await lookup(pincode).catch(() => null);
      if (place?.city || place?.state) break;
    }
    if (place?.city || place?.state) {
      return Response.json({ city: place.city || '', state: place.state || '' });
    }
    return Response.json({ error: 'Pincode not found' }, { status: 404 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

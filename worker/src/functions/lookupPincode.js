
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
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (!res.ok) {
      return Response.json({ error: 'Postal API error' }, { status: 502 });
    }
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length) {
      const po = data[0].PostOffice[0];
      return Response.json({ city: po.District || '', state: po.State || '' });
    }
    return Response.json({ error: 'Pincode not found' }, { status: 404 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
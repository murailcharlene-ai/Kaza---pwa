export default async function handler(req, res) {
  const { email, password } = req.body;

  const response = await fetch(
    'https://aspmfjmkwzwytiknqlih.supabase.co/auth/v1/token?grant_type=password',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'sb_publishable_hH3MLBYsjKjM6KkQYpxjpQ_GWqIJtSQ'
      },
      body: JSON.stringify({ email, password })
    }
  );

  const data = await response.json();
  res.json(data);
}

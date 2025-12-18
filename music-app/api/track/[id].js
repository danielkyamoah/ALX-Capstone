export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Track ID is required' });
  }

  try {
    const response = await fetch(`https://api.deezer.com/track/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Track not found' });
      }
      throw new Error(`Deezer API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Track API error:', error);
    res.status(500).json({ error: 'Failed to fetch track details' });
  }
}

export default async function handler(req, res) {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(q)}`);

        if (!response.ok) {
            throw new Error(`Deezer API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Search API error:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
}

export default async function handler(req, res) {
    try {
        const response = await fetch('https://api.deezer.com/chart');

        if (!response.ok) {
            throw new Error(`Deezer API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Chart API error:', error);
        res.status(500).json({ error: 'Failed to fetch charts' });
    }
}

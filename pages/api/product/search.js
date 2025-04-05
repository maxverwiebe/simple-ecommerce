export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Missing search query" });
  }

  const query = q.toLowerCase().trim();

  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    const results = products.filter((p) => {
      const matchName = p.title.toLowerCase().includes(query);
      const matchId = p.id.toString() === query;
      return matchName || matchId;
    });

    const formattedResults = results.map(({ id, title, price, description }) => ({
      id,
      title,
      price,
      description,
    }));

    return res.status(200).json(formattedResults);
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Abrufen der Produkte" });
  }
}

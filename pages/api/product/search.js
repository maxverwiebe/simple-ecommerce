import products from "../../../data/products";

export default function handler(req, res) {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Missing search query" });
  }

  const query = q.toLowerCase().trim();

  const results = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(query);
    const matchId = p.id.toString() === query;
    return matchName || matchId;
  });

  const response = results.map(({ id, name, price, description }) => ({
    id,
    name,
    price,
    description,
  }));

  return res.status(200).json(response);
}

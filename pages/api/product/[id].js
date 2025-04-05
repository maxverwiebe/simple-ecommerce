export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Ungültige Produkt-ID" });
  }

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) {
      return res.status(404).json({ message: "Produkt nicht gefunden" });
    }

    const product = await response.json();
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Abrufen des Produkts" });
  }
}

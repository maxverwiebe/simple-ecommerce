// pages/api/products.js

export default async function handler(req, res) {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    const products = await response.json();
    res.status(200).json(products);
  } catch (error) {
    console.error("Fehler beim Abrufen der Produkte:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Produkte" });
  }
}

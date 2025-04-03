// pages/api/checkout.js
export default function handler(req, res) {
  if (req.method === "POST") {
    // Hier wird der Warenkorb (als Array) per POST empfangen
    console.log("Eingehende Bestellung:", req.body);
    res
      .status(200)
      .json({
        success: true,
        message: "Kauf simuliert. Vielen Dank für Ihre Bestellung!",
      });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

import products from "../../../data/products";

export default function handler(req, res) {
  const { id } = req.query;

  // not the most RESTful stlye
  if (req.method == "GET" && id == "*") {
    // only id, name, price, description
    const productsRes = products.map(({ id, name, price, description }) => ({
      id,
      name,
      price,
      description,
    }));
    return res.status(200).json(productsRes);
  }

  if (req.method == "GET") {
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    // check if details is set to 1
    const showDetails = req.query.details === "1";

    // If details=1, return all product info otherwise just the basic fields
    const productRes = showDetails
      ? { ...product }
      : {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
        };

    return res.status(200).json(productRes);
  }
}

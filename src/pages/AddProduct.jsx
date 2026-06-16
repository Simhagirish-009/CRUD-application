import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import { addProduct, getCategories } from "../services/product_api"; // Using your exact path

const AddProduct = () => {
  // Form input states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 1,
    description: "",
  });

  // App states
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch categories on component mount for the dropdown list
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(
          "Failed to load categories. Please check your authentication.",
        );
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Handle generic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert quantity to an integer immediately
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "quantity" ? parseInt(value, 10) || "" : value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation mirroring your Django validators
    if (formData.quantity < 1 || formData.quantity > 1000) {
      setError("Quantity must be between 1 and 1000.");
      return;
    }
    if (!formData.category) {
      setError("Please select a valid category.");
      return;
    }

    setLoading(true);
    try {
      await addProduct(formData);
      setSuccess("Product added successfully!");
      // Reset form (keeping quantity default at 1)
      setFormData({
        name: "",
        category: "",
        quantity: 1,
        description: "",
      });
    } catch (err) {
      // Capture DRF field validation errors if available, otherwise use a generic message
      const serverError = err.response?.data;
      if (serverError && typeof serverError === "object") {
        setError(
          Object.entries(serverError)
            .map(([key, val]) => `${key}: ${val}`)
            .join(", "),
        );
      } else {
        setError("Failed to add product. Make sure you are logged in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4 d-flex justify-content-center">
      <Card
        className="w-100 border border-secondary-subtle shadow-sm"
        style={{ maxWidth: "500px" }}
      >
        <Card.Body className="p-4">
          <h2 className="mb-4 text-center">Add New Product</h2>

          {/* Error and Success Alerts */}
          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" onClose={() => setSuccess("")} dismissible>
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Product Name */}
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Product Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </Form.Group>

            {/* Category Dropdown */}
            <Form.Group className="mb-3" controlId="productCategory">
              <Form.Label>Category:</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Quantity */}
            <Form.Group className="mb-3" controlId="productQuantity">
              <Form.Label>Quantity (1-1000):</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min="1"
                max="1000"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-4" controlId="productDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Enter product description..."
              />
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100 py-2 d-flex align-items-center justify-content-center"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProduct;

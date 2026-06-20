import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Container,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import * as XLSX from "xlsx"; // Import SheetJS
import {
  getProducts,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../services/product_api"; // Adjust paths

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    category: "",
    quantity: 1,
    description: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to fetch data. Please check your login session.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoryName = (categoryId) => {
    const found = categories.find((cat) => cat.id === categoryId);
    return found ? found.name : "Unknown";
  };

  // --- Excel Export Logic ---
  const handleExcelExport = () => {
    try {
      setError("");
      setSuccess("");

      if (products.length === 0) {
        setError("There is no product data available to export.");
        return;
      }

      // Map data to clean user-friendly column headers
      const exportData = products.map((product) => ({
        "Product ID": product.id,
        "Product Name": product.name,
        Category: getCategoryName(product.category), // Resolves ID to actual Name
        Quantity: product.quantity,
        Description: product.description,
      }));

      // Create worksheet and workbook structure
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

      // Auto-adjust column widths so data isn't clipped
      const maxProps = [
        { wch: 12 },
        { wch: 25 },
        { wch: 18 },
        { wch: 10 },
        { wch: 35 },
      ];
      worksheet["!cols"] = maxProps;

      // Generate file and trigger download
      XLSX.writeFile(
        workbook,
        `Product_Inventory_${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      setSuccess("Inventory exported to Excel successfully!");
    } catch (err) {
      setError("An error occurred while exporting data.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setSuccess("Product deleted successfully!");
        setProducts(products.filter((product) => product.id !== id));
      } catch (err) {
        setError("Failed to delete the product.");
      }
    }
  };

  const handleEditClick = (product) => {
    setEditFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      description: product.description,
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value, 10) || "" : value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (editFormData.quantity < 1 || editFormData.quantity > 1000) {
      setError("Quantity must be between 1 and 1000.");
      return;
    }

    try {
      const updatedProduct = await updateProduct(editFormData.id, editFormData);
      setSuccess("Product updated successfully!");
      setProducts(
        products.map((p) => (p.id === editFormData.id ? updatedProduct : p)),
      );
      setShowEditModal(false);
    } catch (err) {
      setError("Failed to update product. Verify your fields.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading inventory...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Top Header Row with Export Button */}
      <Row className="align-items-center mb-4">
        <Col sm={6}>
          <h2>Product Management Grid</h2>
        </Col>
        <Col sm={6} className="text-sm-end mt-2 mt-sm-0">
          <Button variant="success" onClick={handleExcelExport}>
            <i className="bi bi-file-earmark-excel me-2"></i> Export to Excel
            (.xlsx)
          </Button>
        </Col>
      </Row>

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

      <Table
        striped
        bordered
        hover
        responsive
        className="animate__animated animate__fadeIn"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{getCategoryName(product.category)}</td>
                <td>{product.quantity}</td>
                <td>{product.description}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* EDIT PRODUCT MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product (ID: {editFormData.id})</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={editFormData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity (1-1000)</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min="1"
                max="1000"
                value={editFormData.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editFormData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ViewProduct;

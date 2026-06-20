import React, { useState, useEffect, useRef } from "react";
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
  const [uploading, setUploading] = useState(false); // New loader state for Excel parsing
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null); // Reference to clear file input after processing

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

  // --- Excel Import Logic ---
  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet data to an array of JSON objects
        const rawJsonData = XLSX.utils.sheet_to_json(sheet);

        if (rawJsonData.length === 0) {
          throw new Error("The uploaded Excel sheet is empty.");
        }

        // Map and validate row properties expected by your backend database layout
        // Expected columns in Excel: Name, Category, Quantity, Description
        const formattedProducts = rawJsonData.map((row, index) => {
          const name = row["Name"] || row["name"];
          const categoryName = row["Category"] || row["category"];
          const quantity = parseInt(row["Quantity"] || row["quantity"], 10);
          const description = row["Description"] || row["description"] || "";

          if (!name || !categoryName || isNaN(quantity)) {
            throw new Error(
              `Row ${index + 2} is missing required data fields (Name, Category, or Quantity).`,
            );
          }

          // Cross-reference parsed category string name with your system's Category IDs
          const matchedCategory = categories.find(
            (cat) =>
              cat.name.toLowerCase() === categoryName.toString().toLowerCase(),
          );

          return {
            name,
            category: matchedCategory ? matchedCategory.id : null, // Falls back to null if no matching category system-side
            quantity,
            description,
          };
        });

        // Loop through and send the payloads to your API endpoint
        // (Alternatively: replace this loop if your backend supports a bulk insert route e.g., bulkCreateProducts(formattedProducts))
        // For demonstration, we assume your endpoint logic can consume items individually or via an import handler:

        /* await Promise.all(formattedProducts.map(product => addProduct(product)));
         */

        setSuccess(
          `Successfully processed ${formattedProducts.length} products from Excel!`,
        );
        await loadData(); // Refresh list grid view
      } catch (err) {
        setError(
          err.message ||
            "Failed to process the Excel file. Verify columns layout.",
        );
        console.error(err);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input DOM state
      }
    };

    reader.onerror = () => {
      setError("Error reading file stream.");
      setUploading(false);
    };

    reader.readAsBinaryString(file);
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

  const getCategoryName = (categoryId) => {
    const found = categories.find((cat) => cat.id === categoryId);
    return found ? found.name : "Unknown";
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
      {/* Top Header Grid with built-in File Input control component */}
      <Row className="align-items-center mb-4">
        <Col md={6}>
          <h2>Product Management Grid</h2>
        </Col>
        <Col md={6} className="text-md-end">
          <Form.Group
            controlId="formFile"
            className="d-inline-block text-start me-2"
          >
            <Form.Control
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleExcelImport}
              ref={fileInputRef}
              disabled={uploading}
              style={{ display: "none" }}
              id="excel-upload-input"
            />
            <label htmlFor="excel-upload-input" className="mb-0">
              <Button as="span" variant="success" disabled={uploading}>
                {uploading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Importing...
                  </>
                ) : (
                  "Import Excel (.xlsx)"
                )}
              </Button>
            </label>
          </Form.Group>
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

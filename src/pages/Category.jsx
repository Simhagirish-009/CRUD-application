import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/product_api";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState({ id: "", name: "" });
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryTodelete, setcategoryTodelete] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching category:", error);
        setMessage("Error fetching category");
        toast.error("Error fetching category");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  const handleDeleteConfirm = (category) => {
    setcategoryTodelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!categoryTodelete) return;
    setLoading(true);
    try {
      await deleteCategory(categoryTodelete.id);
      setCategories(
        categories.filter((category) => category.id !== categoryTodelete.id),
      );
      toast.success("Category Deleted Successfully");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage("There are staff members currently in this category");
      toast.error("There was an error while deleting");
    } finally {
      setLoading(false);
      setcategoryTodelete(null);
    }
  };

  const showModal = () => {
    setShow(true);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateCategory(editCategory.id, {
        name: editCategory.name,
      });
      const updatedCategories = categories.map((category) =>
        category.id === editCategory.id
          ? { ...category, name: editCategory.name }
          : category,
      );
      setCategories(updatedCategories);
      setShowEditModal(false);
      toast.success("Category Updated Successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage("Error updating category");
      toast.error("Error While Editing The Category");
    } finally {
      setLoading(false);
    }
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCategory = await addCategory({ name });
      setCategories((prev) => [...prev, newCategory]);
      setName(""); // Clear input on success
      setShow(false);
      toast.success("Category Added successfully");
    } catch (error) {
      setName("");
      toast.error("Category Adding Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="root">
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <div className="flex-grow-1 p-3">
          <h2>Manage Categories</h2> <br />
          <div className="btnn">
            <Button className="bttn px-5" onClick={showModal}>
              <FaPlus /> Add Category
            </Button>
            <br />
          </div>
          <div className="dash-container mt-3">
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <Table
                bordered
                striped
                hover
                className="animate__animated animate__fadeIn"
              >
                <thead>
                  <tr style={{ textAlign: "center" }}>
                    <th>Sno</th>
                    <th>Category Name</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category.id || index}
                      style={{ textAlign: "center" }}
                    >
                      <td>{index + 1}</td>
                      <td>{category.name}</td>
                      <td>
                        <Button onClick={() => handleEdit(category)}>
                          <FaEdit /> Edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteConfirm(category)}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
          {message && (
            <Alert variant="danger" className="mt-3">
              <p className="text-danger mb-0">{message}</p>
            </Alert>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandle}>
            <Form.Group>
              <Form.Label>Category Name :</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeholder="Add category name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <br />
            <div className="btnn d-flex justify-content-center">
              <Button className="bttn px-5" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Add Category"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <Form.Group>
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="px-5"
            variant="secondary"
            onClick={() => setShowEditModal(false)}
          >
            Close
          </Button>
          <Button
            className="px-5"
            variant="primary"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Update"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the Category "{categoryTodelete?.name}
          "?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Category;

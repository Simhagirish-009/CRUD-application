import axios from "axios";

const API_URL = "https://crud-application-rxyd.onrender.com/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/addcategory/`, getAuthConfig());
  return response.data;
};

export const addCategory = async (data) => {
  const response = await axios.post(
    `${API_URL}/addcategory/`,
    data,
    getAuthConfig(),
  );
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/addcategory/${id}/`,
    data,
    getAuthConfig(),
  );
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(
    `${API_URL}/addcategory/${id}/`,
    getAuthConfig(),
  );
  return response.data;
};

// POST a new product
export const addProduct = async (productData) => {
  const response = await axios.post(
    `${API_URL}/addproduct/`,
    productData,
    getAuthConfig(),
  );
  return response.data;
};

// GET all products
export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/addproduct/`, getAuthConfig());
  return response.data;
};

// PUT (update) an existing product
export const updateProduct = async (id, productData) => {
  const response = await axios.put(
    `${API_URL}/addproduct/${id}/`,
    productData,
    getAuthConfig(),
  );
  return response.data;
};

// DELETE a product
export const deleteProduct = async (id) => {
  const response = await axios.delete(
    `${API_URL}/addproduct/${id}/`,
    getAuthConfig(),
  );
  return response.data;
};

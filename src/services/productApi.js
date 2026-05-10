import API_URL from "./api";
import { getAdminHeaders } from "./adminApi";

export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return response.json();
};

export const deleteProductRequest = async (productId) => {
  return fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    headers: getAdminHeaders()
  });
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  return response.json();
};
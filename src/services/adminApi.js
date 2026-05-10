import API_URL from "./api";

export const getAdminHeaders = () => {
  const token = localStorage.getItem("eloria_admin_token");

  return {
    "x-admin-token": token || ""
  };
};

export const getAdminJsonHeaders = () => {
  const token = localStorage.getItem("eloria_admin_token");

  return {
    "Content-Type": "application/json",
    "x-admin-token": token || ""
  };
};

export const adminLogin = async (password) => {
  const response = await fetch(`${API_URL}/admin-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });

  return response;
};
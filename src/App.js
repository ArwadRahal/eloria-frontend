import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import defaultProductImage from "./images/default-product.png";
import heroVideo from "./videos/hero-video.mp4";
import eloriaLogo from "./images/eloria-logo.png";

function App() {
  const API_URL =
    process.env.REACT_APP_API_URL || "https://eloria-backend.onrender.com";

  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(defaultProductImage);
  const [adminStatusFilter, setAdminStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [adminView, setAdminView] = useState("dashboard");
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [newProductImage, setNewProductImage] = useState(null);
  const [newProductImage2, setNewProductImage2] = useState(null);
  const [newProductImage3, setNewProductImage3] = useState(null);

  const [editProductImage, setEditProductImage] = useState(null);
  const [editProductImage2, setEditProductImage2] = useState(null);
  const [editProductImage3, setEditProductImage3] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);

  const [adminProductSearch, setAdminProductSearch] = useState("");
  const [adminStockFilter, setAdminStockFilter] = useState("all");

  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "1",
    image_url: "",
    image_url_2: "",
    image_url_3: ""
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    notes: ""
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders-with-items`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
        setShowEditPopup(false);
        setShowCart(false);
        setShowCheckout(false);
        setShowFavorites(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("eloria_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const showToastMessage = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success"
      });
    }, 2500);
  };

  const getCategoryName = (categoryId) => {
    const categories = {
      1: "Lip Liner",
      2: "Eyeliner",
      3: "Mascara",
      6: "Blush",
      7: "Lips"
    };
    return categories[categoryId] || "Unknown";
  };

  const handleHiddenAdminEntry = () => {
    logoClickCountRef.current += 1;

    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }

    logoClickTimerRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 1500);

    if (logoClickCountRef.current >= 5) {
      logoClickCountRef.current = 0;
      const password = prompt("Enter admin password:");

      if (password === null) return;

      if (password === "eloria-admin") {
        setIsAdmin(true);
        setAdminView("dashboard");
        showToastMessage("Admin mode activated 🔐", "success");
      } else {
        showToastMessage("Wrong password ❌", "error");
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminView("dashboard");
    setShowEditPopup(false);
    setEditingProduct(null);
    showToastMessage("Logged out from admin", "success");
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      if (existingProduct.quantity >= product.stock) {
        showToastMessage("No more stock available ⚠️", "error");
        return;
      }

      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      setCart(updatedCart);
      showToastMessage(`${product.name} added to cart 🛒`, "success");
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
        showToastMessage(`${product.name} added to cart 🛒`, "success");
      }
    }
  };

  const removeFromCart = (productId) => {
    const removedItem = cart.find((item) => item.id === productId);
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);

    if (removedItem) {
      showToastMessage(`${removedItem.name} removed from cart`, "error");
    }
  };

  const increaseQuantity = (productId) => {
    let updatedItemName = "";

    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        const productInStock = products.find(
          (product) => product.id === productId
        );

        if (productInStock && item.quantity < productInStock.stock) {
          updatedItemName = item.name;
          return { ...item, quantity: item.quantity + 1 };
        }

        if (productInStock && item.quantity >= productInStock.stock) {
          showToastMessage("No more stock available ⚠️", "error");
        }
      }

      return item;
    });

    setCart(updatedCart);

    if (updatedItemName) {
      showToastMessage(`Increased quantity for ${updatedItemName}`, "success");
    }
  };

  const decreaseQuantity = (productId) => {
    let updatedItemName = "";

    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          updatedItemName = item.name;
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);

    if (updatedItemName) {
      showToastMessage(`Updated quantity for ${updatedItemName}`, "success");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: value
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      category_id: String(product.category_id || "1"),
      image_url: product.image_url || "",
      image_url_2: product.image_url_2 || "",
      image_url_3: product.image_url_3 || ""
    });

    setEditProductImage(null);
    setEditProductImage2(null);
    setEditProductImage3(null);
    setShowEditPopup(true);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      showToastMessage("Please fill all required product fields.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("category_id", newProduct.category_id);

      if (newProductImage) formData.append("image", newProductImage);
      if (newProductImage2) formData.append("image2", newProductImage2);
      if (newProductImage3) formData.append("image3", newProductImage3);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Product added successfully ✨", "success");

        setNewProduct({
          name: "",
          price: "",
          stock: "",
          category_id: "1",
          image_url: "",
          image_url_2: "",
          image_url_3: ""
        });

        setNewProductImage(null);
        setNewProductImage2(null);
        setNewProductImage3(null);
        fetchProducts();
      } else {
        showToastMessage(data.error || "Failed to add product.", "error");
      }
    } catch (error) {
      console.log(error);
      showToastMessage("Error adding product.", "error");
    }
  };

  const handleUpdateProduct = async () => {
  if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.stock) {
    showToastMessage("Please fill all required edit fields.", "error");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("name", editingProduct.name);
    formData.append("price", editingProduct.price);
    formData.append("stock", editingProduct.stock);
    formData.append("category_id", editingProduct.category_id);

    formData.append("image_url", editingProduct.image_url || "");
    formData.append("image_url_2", editingProduct.image_url_2 || "");
    formData.append("image_url_3", editingProduct.image_url_3 || "");

    if (editProductImage) formData.append("image", editProductImage);
    if (editProductImage2) formData.append("image2", editProductImage2);
    if (editProductImage3) formData.append("image3", editProductImage3);

    const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
      method: "PUT",
      body: formData
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (response.ok) {
      showToastMessage("Product updated ✨", "success");
      setShowEditPopup(false);
      setEditingProduct(null);
      fetchProducts();
    } else {
      console.log("Update error details:", data);
      showToastMessage(data.details || data.error || "Update failed ❌", "error");
    }
  } catch (err) {
    console.log(err);
    showToastMessage("Error updating product ❌", "error");
  }
};

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Product deleted successfully 🗑️", "success");
        fetchProducts();
      } else {
        showToastMessage(data.error || "Failed to delete product.", "error");
      }
    } catch (error) {
      console.log(error);
      showToastMessage("Error deleting product.", "error");
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToastMessage("Your cart is empty.", "error");
      return;
    }

    if (
      !customerInfo.fullName ||
      !customerInfo.phone ||
      !customerInfo.city ||
      !customerInfo.address
    ) {
      showToastMessage("Please fill in all required fields.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
         headers: {
    "Content-Type": "application/json"
  },
        body: JSON.stringify({
          customerInfo,
          cart,
          totalPrice
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Order placed successfully!", "success");

        setCart([]);
        setCustomerInfo({
          fullName: "",
          phone: "",
          city: "",
          address: "",
          notes: ""
        });
        setShowCheckout(false);
        fetchProducts();
        fetchOrders();
      } else {
        showToastMessage(data.error || "Failed to place order.", "error");
      }
    } catch (error) {
      console.log("Error sending order:", error);
      showToastMessage(
        "Something went wrong while sending the order.",
        "error"
      );
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
    "Content-Type": "application/json"
  },
        body: JSON.stringify({
          status: newStatus
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Order status updated successfully!", "success");
        fetchOrders();
        fetchProducts();
      } else {
        showToastMessage(
          data.error || "Failed to update order status.",
          "error"
        );
      }
    } catch (error) {
      console.log("Error updating order status:", error);
      showToastMessage(
        "Something went wrong while updating the order status.",
        "error"
      );
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        showToastMessage("Order deleted successfully 🗑️", "success");
        fetchOrders();
        fetchProducts();
      } else {
        showToastMessage("Failed to delete order", "error");
      }
    } catch (error) {
      console.log(error);
      showToastMessage("Error deleting order", "error");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToastMessage("Copied to clipboard ✅", "success");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortOrder("default");
    showToastMessage("Filters cleared", "success");
  };

  const toggleFavorite = (product) => {
    const isAlreadyFavorite = favorites.some((item) => item.id === product.id);

    let updatedFavorites;

    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter((item) => item.id !== product.id);
      showToastMessage(`${product.name} removed from favorites`, "error");
    } else {
      updatedFavorites = [...favorites, product];
      showToastMessage(`${product.name} added to favorites ❤️`, "success");
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("eloria_favorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  const handleShopNow = () => {
  const section = document.getElementById("categories-section");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);

    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      setTimeout(() => {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const filteredOrders = orders.filter((order) => {
    if (adminStatusFilter === "all") return true;
    return order.status === adminStatusFilter;
  });

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        String(product.category_id) === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "low-to-high") {
        return a.price - b.price;
      }
      if (sortOrder === "high-to-low") {
        return b.price - a.price;
      }
      return 0;
    });

  const featuredProducts = useMemo(() => {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, [products]);

  const filteredAdminProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(adminProductSearch.toLowerCase());

    const matchesStock =
      adminStockFilter === "all" ||
      (adminStockFilter === "low" && product.stock > 0 && product.stock <= 3) ||
      (adminStockFilter === "out" && product.stock === 0) ||
      (adminStockFilter === "available" && product.stock > 3);

    return matchesSearch && matchesStock;
  });

  const totalProductsCount = products.length;
  const lowStockProductsCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 3
  ).length;
  const outOfStockProductsCount = products.filter(
    (product) => product.stock === 0
  ).length;

  const renderAdminDashboardCards = () => {
    return (
      <div className="admin-home-grid">
        <div className="admin-home-card">
          <h3>{totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="admin-home-card">
          <h3>{pendingOrders}</h3>
          <p>Pending Orders</p>
        </div>
        <div className="admin-home-card">
          <h3>{deliveredOrders}</h3>
          <p>Delivered Orders</p>
        </div>
        <div className="admin-home-card">
          <h3>{totalProductsCount}</h3>
          <p>Total Products</p>
        </div>
        <div className="admin-home-card">
          <h3>{lowStockProductsCount}</h3>
          <p>Low Stock</p>
        </div>
        <div className="admin-home-card">
          <h3>{outOfStockProductsCount}</h3>
          <p>Out of Stock</p>
        </div>
      </div>
    );
  };

  const renderAdminOrders = () => {
    return (
      <>
        <div className="admin-filter-box">
          <button
            className={adminStatusFilter === "all" ? "active-admin-filter" : ""}
            onClick={() => setAdminStatusFilter("all")}
          >
            All
          </button>

          <button
            className={
              adminStatusFilter === "pending" ? "active-admin-filter" : ""
            }
            onClick={() => setAdminStatusFilter("pending")}
          >
            Pending
          </button>

          <button
            className={
              adminStatusFilter === "delivered" ? "active-admin-filter" : ""
            }
            onClick={() => setAdminStatusFilter("delivered")}
          >
            Delivered
          </button>

          <button
            className={
              adminStatusFilter === "cancelled" ? "active-admin-filter" : ""
            }
            onClick={() => setAdminStatusFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>

        <div className="admin-orders-wrapper">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`admin-order-card status-card-${order.status}`}
              >
                <h3>Order #{order.id}</h3>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>

                <div className="customer-info-box">
                  <p>
                    <strong>Name:</strong> {order.customer_name}
                  </p>

                  <p>
                    <strong>Phone:</strong> {order.phone}{" "}
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(order.phone)}
                    >
                      Copy
                    </button>
                  </p>

                  <p>
                    <strong>City:</strong> {order.city}
                  </p>

                  <p>
                    <strong>Address:</strong> {order.address}{" "}
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(order.address)}
                    >
                      Copy
                    </button>
                  </p>

                  <button
                    className="copy-order-details-btn"
                    onClick={() =>
                      copyToClipboard(
                        `${order.customer_name} - ${order.city} - ${order.address} - ${order.phone}`
                      )
                    }
                  >
                    Copy Full Delivery Info
                  </button>
                </div>

                <p>
                  <strong>Total:</strong> {order.total_price} ₪
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </p>

                <div style={{ marginTop: "10px" }}>
                  <strong>Items:</strong>
                  {order.items &&
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        style={{ marginTop: "6px", paddingLeft: "10px" }}
                      >
                        <p style={{ margin: "4px 0" }}>
                          - {item.product_name} | Qty: {item.quantity} | Price:{" "}
                          {item.price} ₪
                        </p>
                      </div>
                    ))}
                </div>

                <div className="admin-order-actions">
                  <button
                    onClick={() => deleteOrder(order.id)}
                    style={{ background: "#fde8e8", color: "#d9534f" }}
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => updateOrderStatus(order.id, "delivered")}
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() => updateOrderStatus(order.id, "cancelled")}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-admin-orders-message">
              No orders in this category yet.
            </p>
          )}
        </div>
      </>
    );
  };

  const renderAdminProducts = () => {
    return (
      <div className="admin-products-section">
        <h3 className="admin-products-title">Manage Products</h3>

        <div className="admin-products-tools">
          <input
            type="text"
            placeholder="Search product..."
            value={adminProductSearch}
            onChange={(e) => setAdminProductSearch(e.target.value)}
            className="admin-products-search"
          />

          <select
            value={adminStockFilter}
            onChange={(e) => setAdminStockFilter(e.target.value)}
            className="admin-products-stock-filter"
          >
            <option value="all">All Stock</option>
            <option value="available">Available</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div className="admin-products-mini-stats">
          <div className="mini-stat-card">
            <span>{totalProductsCount}</span>
            <p>Total Products</p>
          </div>

          <div className="mini-stat-card">
            <span>{lowStockProductsCount}</span>
            <p>Low Stock</p>
          </div>

          <div className="mini-stat-card">
            <span>{outOfStockProductsCount}</span>
            <p>Out of Stock</p>
          </div>
        </div>

        <div className="admin-products-table-wrapper">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAdminProducts.length > 0 ? (
                filteredAdminProducts.map((product) => {
                  const imageCount = [
                    product.image_url,
                    product.image_url_2,
                    product.image_url_3
                  ].filter(Boolean).length;

                  return (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image_url || defaultProductImage}
                          alt={product.name}
                          className="admin-table-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultProductImage;
                          }}
                        />
                      </td>

                      <td className="product-name-cell">{product.name}</td>
                      <td>{getCategoryName(product.category_id)}</td>
                      <td>{product.price} ₪</td>

                      <td>
                        <span
                          className={`stock-badge-admin ${
                            product.stock === 0
                              ? "stock-out"
                              : product.stock <= 3
                              ? "stock-low"
                              : "stock-ok"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td>{imageCount}</td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="no-products-row">
                    No matching products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAddProduct = () => {
    return (
      <div className="add-product-form admin-form-page">
        <h3>Add New Product</h3>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleNewProductChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleNewProductChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={handleNewProductChange}
        />

        <select
          name="category_id"
          value={newProduct.category_id}
          onChange={handleNewProductChange}
        >
          <option value="1">Lip Liner</option>
          <option value="2">Eyeliner</option>
          <option value="3">Mascara</option>
          <option value="6">Blush</option>
          <option value="7">Lips</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewProductImage(e.target.files[0])}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewProductImage2(e.target.files[0])}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewProductImage3(e.target.files[0])}
        />

        <button className="submit-order-btn" onClick={handleAddProduct}>
          Save Product
        </button>
      </div>
    );
  };

  const renderStoreProductCard = (product) => (
    <div
      key={product.id}
      className="product-card"
      onClick={() => {
        setSelectedProduct(product);
        setSelectedImage(
          product.image_url ||
            product.image_url_2 ||
            product.image_url_3 ||
            defaultProductImage
        );
      }}
    >
      <button
        className={`favorite-btn ${
          isFavorite(product.id) ? "active-favorite" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product);
        }}
      >
        {isFavorite(product.id) ? "❤" : "♡"}
      </button>

      <div className="product-image-wrap">
        <img
          src={product.image_url || defaultProductImage}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultProductImage;
          }}
        />
      </div>

      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p className="product-price">{product.price} ₪</p>

        {product.stock === 0 && (
          <span className="product-out-badge">Out of Stock</span>
        )}

        <button
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <div className="admin-dashboard-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">ELORIA Admin</div>

          <button
            className={
              adminView === "dashboard" ? "sidebar-link active" : "sidebar-link"
            }
            onClick={() => setAdminView("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={
              adminView === "orders" ? "sidebar-link active" : "sidebar-link"
            }
            onClick={() => setAdminView("orders")}
          >
            Orders
          </button>

          <button
            className={
              adminView === "products" ? "sidebar-link active" : "sidebar-link"
            }
            onClick={() => setAdminView("products")}
          >
            Products
          </button>

          <button
            className={
              adminView === "add-product"
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={() => setAdminView("add-product")}
          >
            Add Product
          </button>

          <button className="sidebar-link logout" onClick={handleAdminLogout}>
            Logout
          </button>
        </aside>

        <main className="admin-main">
          <div className="admin-main-header">
            <h2>
              {adminView === "dashboard" && "Admin Dashboard"}
              {adminView === "orders" && "Orders Management"}
              {adminView === "products" && "Products Management"}
              {adminView === "add-product" && "Add New Product"}
            </h2>
          </div>

          {adminView === "dashboard" && renderAdminDashboardCards()}
          {adminView === "orders" && renderAdminOrders()}
          {adminView === "products" && renderAdminProducts()}
          {adminView === "add-product" && renderAddProduct()}
        </main>

        {showEditPopup && editingProduct && (
          <div
            className="edit-popup-overlay"
            onClick={() => setShowEditPopup(false)}
          >
            <div
              className="edit-popup-box"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-product-btn"
                onClick={() => setShowEditPopup(false)}
              >
                ✕
              </button>

              <h3>Edit Product</h3>

              <input
                name="name"
                placeholder="Product Name"
                value={editingProduct.name}
                onChange={handleEditChange}
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={editingProduct.price}
                onChange={handleEditChange}
              />

              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={editingProduct.stock}
                onChange={handleEditChange}
              />

              <select
                name="category_id"
                value={editingProduct.category_id}
                onChange={handleEditChange}
              >
                <option value="1">Lip Liner</option>
                <option value="2">Eyeliner</option>
                <option value="3">Mascara</option>
                <option value="6">Blush</option>
                <option value="7">Lips</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditProductImage(e.target.files[0])}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditProductImage2(e.target.files[0])}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditProductImage3(e.target.files[0])}
              />

              <div className="edit-product-actions">
                <button
                  onClick={handleUpdateProduct}
                  className="submit-order-btn"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setShowEditPopup(false)}
                  className="delete-product-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {toast.show && (
          <div className={`toast-message toast-${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="navbar">
       <div className="logo" onClick={handleHiddenAdminEntry}>
  <img src={eloriaLogo} alt="ELORIA Logo" />
</div>

        <div className="navbar-actions">
          <div className="favorites-icon" onClick={() => setShowFavorites(true)}>
            ❤️ {favorites.length}
          </div>

          <div className="cart-icon" onClick={() => setShowCart(true)}>
            🛒 {totalItems}
          </div>
        </div>
      </div>

      <div className="hero-video-section">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <p className="hero-badge">ELORIA BEAUTY</p>
          <h1>Soft beauty, bold confidence ✨</h1>
          <p className="hero-description">
            Discover curated beauty favorites designed to make every look feel
            elegant, modern, and uniquely yours.
          </p>
<button className="hero-shop-btn" onClick={handleShopNow}>
  Shop Now
</button>
        </div>
      </div>

      <section className="who-we-are-section">
        <div className="who-we-are-container">
          <div className="who-we-are-text">
            <p className="section-tag">WHO WE ARE</p>
            <h2>Two best friends, one soft dream — ELORIA</h2>
            <p className="who-we-are-description">
              ELORIA began in 2026 with two best friends, Ayman and Arwad, who
              wanted to turn their friendship into something beautiful and
              meaningful. What started with shared ideas, love for beauty, and
              soft feminine details slowly became a little dream we decided to
              build together.
            </p>
            <p className="who-we-are-description">
              For us, ELORIA is more than a beauty store. It is a space full of
              glow, warmth, confidence, and lovely little details. Every product
              we choose carries a piece of our style, our friendship, and the
              feeling we want every girl to experience while shopping with us.
            </p>
          </div>

          <div className="who-we-are-logo-box">
            <img src={eloriaLogo} alt="ELORIA logo" className="who-we-are-logo" />
            <p className="who-we-are-year">Founded in 2026</p>
          </div>
        </div>
      </section>

      <section className="instagram-section">
        <div className="instagram-box">
          <p className="section-tag">CONNECT WITH US</p>
          <h2>Follow our glow on Instagram</h2>
          <p>
            Stay close to ELORIA for updates, new arrivals, soft beauty vibes,
            and all the little lovely details we share with our community.
          </p>

          <a
            href="https://instagram.com/theeloriaglow"
            target="_blank"
            rel="noreferrer"
            className="instagram-link-btn"
          >
            @theeloriaglow
          </a>
        </div>
      </section>

      <section
        className="featured-products-section"
        id="featured-products-section"
      >
        <div className="featured-products-header">
          <p className="section-tag">FEATURED PICKS</p>
          <h2>A little taste of ELORIA</h2>
          <p>
            A small random selection of products to discover first before
            exploring the full collection.
          </p>
        </div>

        <div className="featured-products-grid two-featured-grid">
          {featuredProducts.map((product) => renderStoreProductCard(product))}
        </div>
      </section>

<section id="categories-section" className="shop-categories-section">
          <div className="shop-categories-header">
          <p className="section-tag">SHOP BY CATEGORY</p>
          <h2>Find your favorites your way</h2>
          <p>
            Browse the collection by category and explore only the products you
            are looking for.
          </p>
        </div>

        <div className="shop-categories-grid">
          <button className="category-card" onClick={() => handleCategorySelect("1")}>
            <span>💄</span>
            <h4>Lip Liner</h4>
          </button>

          <button className="category-card" onClick={() => handleCategorySelect("2")}>
            <span>👁️</span>
            <h4>Eyeliner</h4>
          </button>

          <button className="category-card" onClick={() => handleCategorySelect("3")}>
            <span>✨</span>
            <h4>Mascara</h4>
          </button>

          <button className="category-card" onClick={() => handleCategorySelect("6")}>
            <span>🌷</span>
            <h4>Blush</h4>
          </button>

          <button className="category-card" onClick={() => handleCategorySelect("7")}>
            <span>💋</span>
            <h4>Lips</h4>
          </button>
        </div>
      </section>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      

      <div className="sort-box">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      <div className="clear-filters-box">
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div id="products-section">
       <p className="products-count">
  {selectedCategory === "all"
    ? "Choose a category to view products"
    : `Showing ${filteredProducts.length} products`}
</p>
      </div>

      <div className="products-container">
        {selectedCategory === "all" ? (
  <p className="no-products-message">
    Choose a category above to start shopping 💕
  </p>
) : loading ? (
  <div className="loader"></div>
) : filteredProducts.length > 0 ? (
  filteredProducts.map((product) => renderStoreProductCard(product))
) : (
  <p className="no-products-message">No products found 💔</p>
)}
      </div>

      {showFavorites && (
        <div className="favorites-overlay" onClick={() => setShowFavorites(false)}>
          <div className="favorites-popup" onClick={(e) => e.stopPropagation()}>
            <div className="favorites-popup-header">
              <h2>My Favorites ❤️</h2>
              <button
                className="close-cart-btn"
                onClick={() => setShowFavorites(false)}
              >
                ✕
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="favorites-empty">
                <h3>No favorites yet</h3>
                <p>Save the products you love and come back to them anytime.</p>
              </div>
            ) : (
              <div className="favorites-grid">
                {favorites.map((item) => (
                  <div key={item.id} className="favorite-product-card">
                    <img
                      src={item.image_url || defaultProductImage}
                      alt={item.name}
                      className="favorite-product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultProductImage;
                      }}
                    />

                    <h4>{item.name}</h4>
                    <p className="favorite-price">{item.price} ₪</p>

                    <div className="favorite-actions">
                      <button
                        className="confirm-btn"
                        onClick={() => {
                          addToCart(item);
                          setShowFavorites(false);
                        }}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="cart-remove-btn"
                        onClick={() => toggleFavorite(item)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
            <div className="cart-popup-header">
              <h2>Shopping Cart 🛒</h2>
              <button
                className="close-cart-btn"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="empty-cart-text">Your cart is empty.</p>
            ) : (
              <>
                <div className="cart-popup-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item-card">
                      <h4>{item.name}</h4>
                      <p>Price: {item.price} ₪</p>
                      <p>Quantity: {item.quantity}</p>

                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>

                        <button
                          className="qty-btn"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          -
                        </button>
                      </div>

                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <h3 style={{ textAlign: "center", marginTop: "20px" }}>
                  Total: {totalPrice} ₪
                </h3>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    className="confirm-btn"
                    onClick={() => {
                      setShowCheckout(true);
                      setShowCart(false);
                    }}
                  >
                    Confirm Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showCheckout && (
        <div
          className="checkout-overlay"
          onClick={() => setShowCheckout(false)}
        >
          <div className="checkout-popup" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-popup-header">
              <h2>Customer Information</h2>
              <button
                className="close-product-btn"
                onClick={() => setShowCheckout(false)}
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={customerInfo.fullName}
              onChange={handleInputChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={customerInfo.phone}
              onChange={handleInputChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={customerInfo.city}
              onChange={handleInputChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={customerInfo.address}
              onChange={handleInputChange}
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={customerInfo.notes}
              onChange={handleInputChange}
            ></textarea>

            <button className="submit-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div
          className="product-modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-product-btn"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>
<button
  className={`modal-favorite-btn ${
    isFavorite(selectedProduct.id) ? "active-favorite" : ""
  }`}
  onClick={() => toggleFavorite(selectedProduct)}
>
  {isFavorite(selectedProduct.id) ? "❤" : "♡"}
</button>
            <img
              src={selectedImage}
              alt={selectedProduct.name}
              className="product-modal-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProductImage;
              }}
            />

            <p className="gallery-label">Product Gallery</p>

            <div className="product-thumbnails">
              {[
                selectedProduct.image_url,
                selectedProduct.image_url_2,
                selectedProduct.image_url_3
              ]
                .filter(Boolean)
                .map((image, index) => (
                  <img
                    key={index}
                    src={image || defaultProductImage}
                    alt={`thumbnail-${index}`}
                    className={`product-thumbnail ${
                      selectedImage === image ? "active-thumb" : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProductImage;
                    }}
                  />
                ))}
            </div>

            <h2>{selectedProduct.name}</h2>
            <p className="product-shade-label">
              Shade / Variant details included in product name
            </p>
            <p className="product-modal-description">
              A beautiful ELORIA pick designed to add a soft, elegant touch to
              your makeup collection.
            </p>
            <p>
              <strong>Price:</strong> {selectedProduct.price} ₪
            </p>

            <span
              className={`stock-badge ${
                selectedProduct.stock === 0 ? "out-stock" : "in-stock"
              }`}
            >
              {selectedProduct.stock === 0 ? "Out of Stock" : "Available"}
            </span>

            <div style={{ marginTop: "16px" }}>
              <button
                className="confirm-btn"
                onClick={() => addToCart(selectedProduct)}
                disabled={selectedProduct.stock === 0}
              >
                {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`toast-message toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="final-brand-message">
        <h3>Thank you for visiting ELORIA 💕</h3>
        <p>We hope you find your next beauty favorite with us.</p>
      </div>

      <footer className="site-footer">
        <p>ELORIA © 2026 — Beauty with a soft elegant touch ✨</p>
      </footer>
    </div>
  );
}

export default App;
import { useEffect, useRef, useState } from "react";
import "./App.css";
import defaultProductImage from "./images/default-product.png";

function App() {
  const API_URL = process.env.REACT_APP_API_URL || "https://eloria-backend.onrender.com";

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
      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders-with-items`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Product updated ✨", "success");
        setEditingProduct(null);
        setEditProductImage(null);
        setEditProductImage2(null);
        setEditProductImage3(null);
        setShowEditPopup(false);
        fetchProducts();
      } else {
        showToastMessage(data.error || "Failed to update product", "error");
      }
    } catch (err) {
      console.log(err);
      showToastMessage("Error updating product", "error");
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
                  <p><strong>Name:</strong> {order.customer_name}</p>

                  <p>
                    <strong>Phone:</strong> {order.phone}{" "}
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(order.phone)}
                    >
                      Copy
                    </button>
                  </p>

                  <p><strong>City:</strong> {order.city}</p>

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

                <p><strong>Total:</strong> {order.total_price} ₪</p>

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

  if (isAdmin) {
    return (
      <div className="admin-dashboard-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">ELORIA Admin</div>

          <button
            className={adminView === "dashboard" ? "sidebar-link active" : "sidebar-link"}
            onClick={() => setAdminView("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={adminView === "orders" ? "sidebar-link active" : "sidebar-link"}
            onClick={() => setAdminView("orders")}
          >
            Orders
          </button>

          <button
            className={adminView === "products" ? "sidebar-link active" : "sidebar-link"}
            onClick={() => setAdminView("products")}
          >
            Products
          </button>

          <button
            className={adminView === "add-product" ? "sidebar-link active" : "sidebar-link"}
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
        <h2 className="logo" onClick={handleHiddenAdminEntry}>
          ELORIA 💄
        </h2>

        <div className="navbar-actions">
          <div className="cart-icon" onClick={() => setShowCart(true)}>
            🛒 {totalItems}
          </div>
        </div>
      </div>

      <div className="hero-section">
        <p className="subtitle">Glow in your own way ✨</p>
        <p className="hero-description">
          Discover your beauty favorites at ELORIA — curated makeup products
          with a soft, elegant touch.
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-filter">
        <button
          className={selectedCategory === "all" ? "active-filter" : ""}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>

        <button
          className={selectedCategory === "1" ? "active-filter" : ""}
          onClick={() => setSelectedCategory("1")}
        >
          Lip Liner
        </button>

        <button
          className={selectedCategory === "2" ? "active-filter" : ""}
          onClick={() => setSelectedCategory("2")}
        >
          Eyeliner
        </button>

        <button
          className={selectedCategory === "3" ? "active-filter" : ""}
          onClick={() => setSelectedCategory("3")}
        >
          Mascara
        </button>

        <button
          className={selectedCategory === "6" ? "active-filter" : ""}
          onClick={() => setSelectedCategory("6")}
        >
          Blush
        </button>

        <button
          className={selectedCategory === "7" ? "active-filter" : ""}
          onClick={() => setSelectedCategory("7")}
        >
          Lips
        </button>
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

      <p className="products-count">
        Showing {filteredProducts.length} products
      </p>

      <div className="products-container">
        {loading ? (
          <div className="loader"></div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
              <img
                src={product.image_url || defaultProductImage}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultProductImage;
                }}
              />
              <h3>{product.name}</h3>
              <p>💰 {product.price} ₪</p>
              <p>📦 Stock: {product.stock}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          ))
        ) : (
          <p className="no-products-message">No products found 💔</p>
        )}
      </div>

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
        <div className="checkout-overlay" onClick={() => setShowCheckout(false)}>
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
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-product-btn"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
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
            <p><strong>Price:</strong> {selectedProduct.price} ₪</p>
            <p><strong>Stock:</strong> {selectedProduct.stock}</p>

            <span
              className={`stock-badge ${
                selectedProduct.stock === 0 ? "out-stock" : "in-stock"
              }`}
            >
              {selectedProduct.stock === 0 ? "Out of Stock" : "In Stock"}
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
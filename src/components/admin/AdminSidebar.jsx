function AdminSidebar({ adminView, setAdminView, handleAdminLogout }) {
  return (
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
        className={adminView === "categories" ? "sidebar-link active" : "sidebar-link"}
        onClick={() => setAdminView("categories")}
      >
        Categories
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
  );
}

export default AdminSidebar;

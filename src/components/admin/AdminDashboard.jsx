function AdminDashboardCards({
  totalOrders,
  pendingOrders,
  deliveredOrders,
  totalProductsCount,
  lowStockProductsCount,
  outOfStockProductsCount
}) {
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
}

export default AdminDashboardCards;

function AdminOrders({
  filteredOrders,
  adminStatusFilter,
  setAdminStatusFilter,
  deleteOrder,
  updateOrderStatus,
  copyToClipboard
}) {
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
          className={adminStatusFilter === "pending" ? "active-admin-filter" : ""}
          onClick={() => setAdminStatusFilter("pending")}
        >
          Pending
        </button>

        <button
          className={adminStatusFilter === "delivered" ? "active-admin-filter" : ""}
          onClick={() => setAdminStatusFilter("delivered")}
        >
          Delivered
        </button>

        <button
          className={adminStatusFilter === "cancelled" ? "active-admin-filter" : ""}
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

                <button onClick={() => updateOrderStatus(order.id, "delivered")}>
                  Delivered
                </button>

                <button onClick={() => updateOrderStatus(order.id, "cancelled")}>
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
}

export default AdminOrders;

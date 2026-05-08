function OrderSuccessPopup({
  showOrderSuccess,
  setShowOrderSuccess,
  lastOrderId,
  handleShopNow
}) {
  if (!showOrderSuccess) return null;

  return (
    <div
      className="checkout-overlay premium-success-overlay"
      onClick={() => setShowOrderSuccess(false)}
    >
      <div className="order-success-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="premium-close-btn success-close-btn"
          onClick={() => setShowOrderSuccess(false)}
          aria-label="Close success message"
        >
          ✕
        </button>

        <div className="success-icon">✓</div>
        <h2>Order placed successfully</h2>
        <p>
          Thank you for shopping with ELORIA. We will contact you soon to confirm delivery.
        </p>

        <button
          className="confirm-btn premium-checkout-btn"
          onClick={() => {
            setShowOrderSuccess(false);
            handleShopNow();
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccessPopup;

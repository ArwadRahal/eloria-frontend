import defaultProductImage from "../images/default-product.png";
import { getImageUrl } from "../utils/imageUtils";
import { getDisplayProductName, getShadeName } from "../utils/productUtils";

function CartDrawer({
  showCart,
  setShowCart,
  setShowCheckout,
  cart,
  totalItems,
  totalPrice,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  handleShopNow,
  API_URL,
  t,
  language
}) {
  if (!showCart) return null;

  return (
    <div className="cart-overlay premium-cart-overlay" onClick={() => setShowCart(false)}>
      <aside className="cart-popup premium-cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-popup-header premium-cart-header">
          <div>
            <p className="cart-mini-label">Your ELORIA bag</p>
            <h2>{t[language].cart}</h2>
          </div>

          <button
            className="close-cart-btn premium-close-btn"
            onClick={() => setShowCart(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="premium-empty-cart">
            <div className="empty-cart-icon">♡</div>
            <h3>Your bag is empty</h3>
            <p>Add your favorite ELORIA picks and come back here to complete your order.</p>

            <button
              className="confirm-btn"
              onClick={() => {
                setShowCart(false);
                handleShopNow();
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-popup-items premium-cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card premium-cart-item">
                  <img
                    src={getImageUrl(item.image_url, API_URL)}
                    alt={item.name}
                    className="cart-item-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProductImage;
                    }}
                  />

                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <div>
                        <h4>{getDisplayProductName(item.name)}</h4>
                        {getShadeName(item.name) && (
                          <p className="cart-item-shade">{getShadeName(item.name)}</p>
                        )}
                      </div>

                      <button
                        className="cart-item-remove-x"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="quantity-controls premium-quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="cart-quantity-number">{item.quantity}</span>

                        <button
                          className="qty-btn"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <strong className="cart-line-total">
                        {(Number(item.price) * item.quantity).toFixed(2)} ₪
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="premium-cart-footer">
              <div className="cart-total-line">
                <span>Items</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="cart-total-line cart-grand-total">
                <span>Total</span>
                <strong>{Number(totalPrice).toFixed(2)} ₪</strong>
              </div>

              <p className="cart-delivery-note">Payment is collected on delivery.</p>

              <button
                className="confirm-btn premium-checkout-btn"
                onClick={() => {
                  setShowCheckout(true);
                  setShowCart(false);
                }}
              >
                Continue to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;

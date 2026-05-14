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

  const isArabic = language === "ar";

  return (
    <div className="cart-overlay premium-cart-overlay" onClick={() => setShowCart(false)}>
      <aside className="cart-popup premium-cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-popup-header premium-cart-header">
          <div>
            <p className="cart-mini-label">
              {isArabic ? "حقيبة ELORIA الخاصة بك" : "Your ELORIA bag"}
            </p>
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
            <h3>{isArabic ? "السلة فارغة" : "Your bag is empty"}</h3>
            <p>
              {isArabic
                ? "أضيفي منتجاتك المفضلة من ELORIA ثم عودي لإكمال الطلب."
                : "Add your favorite ELORIA picks and come back here to complete your order."}
            </p>

            <button
              className="confirm-btn"
              onClick={() => {
                setShowCart(false);
                handleShopNow();
              }}
            >
              {isArabic ? "ابدئي التسوق" : "Start Shopping"}
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
                        <h4>{getDisplayProductName(item, language)}</h4>
                        {getShadeName(item.name) && (
                          <p className="cart-item-shade">
                            {isArabic ? "الدرجة: " : "Shade: "}
                            {getShadeName(item.name)}
                          </p>
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
                <span>{isArabic ? "عدد المنتجات" : "Items"}</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="cart-total-line cart-grand-total">
                <span>{isArabic ? "المجموع" : "Total"}</span>
                <strong>{Number(totalPrice).toFixed(2)} ₪</strong>
              </div>

              <p className="cart-delivery-note">
                {isArabic
                  ? "يتم الدفع عند الاستلام."
                  : "Payment is collected on delivery."}
              </p>

              <button
                className="confirm-btn premium-checkout-btn"
                onClick={() => {
                  setShowCheckout(true);
                  setShowCart(false);
                }}
              >
                {isArabic ? "المتابعة للدفع" : "Continue to Checkout"}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
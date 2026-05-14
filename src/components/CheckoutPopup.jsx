import defaultProductImage from "../images/default-product.png";
import { getImageUrl } from "../utils/imageUtils";
import { getDisplayProductName, getShadeName } from "../utils/productUtils";

function CheckoutPopup({
  showCheckout,
  setShowCheckout,
  customerInfo,
  checkoutErrors,
  handleInputChange,
  cart,
  totalItems,
  totalPrice,
  handlePlaceOrder,
  isCheckoutValid,
  isSubmittingOrder,
  API_URL,
  t,
  language
}) {
  if (!showCheckout) return null;

  const isArabic = language === "ar";

  return (
    <div
      className="checkout-overlay premium-checkout-overlay"
      onClick={() => setShowCheckout(false)}
    >
      <div className="checkout-popup premium-checkout-popup" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-popup-header premium-checkout-header">
          <div>
            <p className="checkout-step-label">
              {isArabic ? "تفاصيل الطلب الآمنة" : "Secure order details"}
            </p>
            <h2>{t[language].checkout}</h2>
            <span>
              {isArabic
                ? "املئي تفاصيل التوصيل لإرسال الطلب."
                : "Fill your delivery details to place the order."}
            </span>
          </div>

          <button
            className="close-product-btn premium-close-btn"
            onClick={() => setShowCheckout(false)}
            aria-label="Close checkout"
          >
            ✕
          </button>
        </div>

        <div className="checkout-layout-grid premium-checkout-grid">
          <div className="checkout-form-fields premium-checkout-form">
            <label>{isArabic ? "الاسم الكامل *" : "Full Name *"}</label>
            <input
              type="text"
              name="fullName"
              placeholder={isArabic ? "اكتبي اسمك الكامل" : "Your full name"}
              value={customerInfo.fullName}
              onChange={handleInputChange}
              className={checkoutErrors.fullName ? "input-error" : ""}
            />
            {checkoutErrors.fullName && (
              <small className="field-error">{checkoutErrors.fullName}</small>
            )}

            <label>{isArabic ? "رقم الهاتف *" : "Phone Number *"}</label>
            <input
              type="tel"
              name="phone"
              placeholder="05X-XXXXXXX"
              value={customerInfo.phone}
              onChange={handleInputChange}
              className={checkoutErrors.phone ? "input-error" : ""}
            />
            {checkoutErrors.phone && (
              <small className="field-error">{checkoutErrors.phone}</small>
            )}

            <label>{isArabic ? "المدينة *" : "City *"}</label>
            <input
              type="text"
              name="city"
              placeholder={isArabic ? "المدينة" : "City"}
              value={customerInfo.city}
              onChange={handleInputChange}
              className={checkoutErrors.city ? "input-error" : ""}
            />
            {checkoutErrors.city && (
              <small className="field-error">{checkoutErrors.city}</small>
            )}

            <label>{isArabic ? "العنوان *" : "Address *"}</label>
            <input
              type="text"
              name="address"
              placeholder={isArabic ? "الشارع، رقم البيت، الطابق" : "Street, building, floor"}
              value={customerInfo.address}
              onChange={handleInputChange}
              className={checkoutErrors.address ? "input-error" : ""}
            />
            {checkoutErrors.address && (
              <small className="field-error">{checkoutErrors.address}</small>
            )}

            <label>{isArabic ? "ملاحظات" : "Notes"}</label>
            <textarea
              name="notes"
              placeholder={isArabic ? "أي ملاحظات للتوصيل؟" : "Any notes for delivery?"}
              value={customerInfo.notes}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="checkout-summary-card premium-checkout-summary">
            <h3>{isArabic ? "ملخص الطلب" : "Order Summary"}</h3>

            <div className="checkout-summary-items">
              {cart.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <img
                    src={getImageUrl(item.image_url, API_URL)}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProductImage;
                    }}
                  />

                  <div>
                    <strong>{getDisplayProductName(item, language)}</strong>
                    {getShadeName(item.name) && (
                      <span>
                        {isArabic ? "الدرجة: " : "Shade: "}
                        {getShadeName(item.name)}
                      </span>
                    )}
                    <p>
                      {isArabic ? "الكمية" : "Qty"}: {item.quantity} ·{" "}
                      {(Number(item.price) * item.quantity).toFixed(2)} ₪
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-total-row">
              <span>{isArabic ? "عدد المنتجات" : "Items"}</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="checkout-total-row checkout-final-total">
              <span>{isArabic ? "المجموع" : "Total"}</span>
              <strong>{Number(totalPrice).toFixed(2)} ₪</strong>
            </div>

            <p className="checkout-payment-note">
              {isArabic
                ? "طريقة الدفع: الدفع عند الاستلام."
                : "Payment method: cash on delivery."}
            </p>

            <button
              className="submit-order-btn premium-submit-order-btn"
              onClick={handlePlaceOrder}
              disabled={!isCheckoutValid || isSubmittingOrder}
            >
              {isSubmittingOrder
                ? isArabic
                  ? "جارٍ إرسال الطلب..."
                  : "Sending order..."
                : isArabic
                ? "إرسال الطلب"
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPopup;
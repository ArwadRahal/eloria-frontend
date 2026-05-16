import defaultProductImage from "../images/default-product.png";
import { getImageUrl } from "../utils/imageUtils";
import { getDisplayProductName } from "../utils/productUtils";

function FavoritesPopup({
  showFavorites,
  setShowFavorites,
  favorites,
  addToCart,
  toggleFavorite,
  API_URL,
  language
}) {
  if (!showFavorites) return null;

  const isArabic = language === "ar";

  return (
    <div className="favorites-overlay" onClick={() => setShowFavorites(false)}>
      <div className="favorites-popup premium-favorites-popup" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-popup-header">
          <div>
            <p className="cart-mini-label">
              {isArabic ? "منتجاتك المحفوظة" : "Saved beauty picks"}
            </p>
            <h2>{isArabic ? "المفضلة ❤️" : "My Favorites ❤️"}</h2>
          </div>

          <button
            className="close-product-btn premium-favorites-close"
            onClick={() => setShowFavorites(false)}
            aria-label="Close favorites"
          >
            ✕
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <div className="empty-cart-icon">♡</div>
            <h3>{isArabic ? "لا توجد منتجات مفضلة بعد" : "No favorites yet"}</h3>
            <p>
              {isArabic
                ? "احفظي منتجات ELORIA المفضلة لديكِ وعودي إليها في أي وقت."
                : "Save your favorite ELORIA products and come back to them anytime."}
            </p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div key={item.id} className="favorite-product-card">
                <img
                  src={getImageUrl(item.image_url, API_URL)}
                  alt={item.name}
                  className="favorite-product-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProductImage;
                  }}
                />

                <h4>{getDisplayProductName(item, language)}</h4>
                <p className="favorite-price">{item.price} ₪</p>

                <div className="favorite-actions">
                  <button
                    className="confirm-btn"
                    onClick={() => {
                      addToCart(item);
                      setShowFavorites(false);
                    }}
                  >
                    {isArabic ? "أضيفي للسلة" : "Add to Cart"}
                  </button>

                  <button
                    className="cart-remove-btn"
                    onClick={() => toggleFavorite(item)}
                  >
                    {isArabic ? "إزالة" : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPopup;
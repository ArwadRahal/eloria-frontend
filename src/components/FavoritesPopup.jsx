import defaultProductImage from "../images/default-product.png";
import { getImageUrl } from "../utils/imageUtils";

function FavoritesPopup({
  showFavorites,
  setShowFavorites,
  favorites,
  addToCart,
  toggleFavorite,
  API_URL
}) {
  if (!showFavorites) return null;

  return (
    <div className="favorites-overlay" onClick={() => setShowFavorites(false)}>
      <div className="favorites-popup" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-popup-header">
          <h2>My Favorites ❤️</h2>

          <button
            className="close-product-btn"
            onClick={() => setShowFavorites(false)}
          >
            ✕
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <h3>No favorites yet</h3>
            <p>Save your favorite ELORIA products and come back to them anytime.</p>
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
  );
}

export default FavoritesPopup;

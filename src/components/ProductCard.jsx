import defaultProductImage from "../images/default-product.png";
import { getImageUrl, getProductImages } from "../utils/imageUtils";
import {
  getAllProductVariants,
  getDisplayProductName,
  getShadeName
} from "../utils/productUtils";

function ProductCard({
  product,
  products,
  API_URL,
  hoveredVariantByProductId,
  setHoveredVariantByProductId,
  isFavorite,
  toggleFavorite,
  addToCart,
  setSelectedProduct,
  setSelectedImage,
  setPage,
  t,isNewProduct,
  language
}) {
  const variantProducts = getAllProductVariants(product, products);
  const hoveredVariantId = hoveredVariantByProductId[product.id];
  const previewProduct =
    variantProducts.find(
      (variant) => String(variant.id) === String(hoveredVariantId)
    ) || product;

  const openProductPage = (productToOpen) => {
    setSelectedProduct(productToOpen);
    setSelectedImage(getProductImages(productToOpen, API_URL)[0]);
    setPage("product");

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  return (
    <div
      key={product.id}
      className="product-card"
      onMouseLeave={() => {
        setHoveredVariantByProductId((prev) => ({
          ...prev,
          [product.id]: null
        }));
      }}
      onClick={() => openProductPage(previewProduct)}
    >
      <button
        className={`favorite-btn ${
          isFavorite(previewProduct.id) ? "active-favorite" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(previewProduct);
        }}
      >
        {isFavorite(previewProduct.id) ? "❤" : "♡"}
      </button>

      <div className="product-image-wrap">
        {isNewProduct && (
  <div className="new-badge">
    NEW
  </div>
)}
    <img
  src={getImageUrl(previewProduct.image_url, API_URL)}
  alt={previewProduct.name}
  className="product-image"
  loading="lazy"
  decoding="async"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = defaultProductImage;
  }}
/>
      </div>

      <div className="product-card-body">
        <h3>{getDisplayProductName(product.name)}</h3>

        {variantProducts.length > 1 && (
          <div className="product-variants-preview">
            <div className="variant-dots">
              {variantProducts.slice(0, 6).map((variant) => (
                <button
                  key={variant.id}
                  className={`variant-dot ${
                    variant.id === previewProduct.id ? "active-variant-dot" : ""
                  }`}
                  title={getShadeName(variant.name) || variant.name}
                  onMouseEnter={() => {
                    setHoveredVariantByProductId((prev) => ({
                      ...prev,
                      [product.id]: variant.id
                    }));
                  }}
                  onFocus={() => {
                    setHoveredVariantByProductId((prev) => ({
                      ...prev,
                      [product.id]: variant.id
                    }));
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openProductPage(variant);
                  }}
                >
                  <img
  src={getImageUrl(variant.image_url, API_URL)}
  alt={variant.name}
  loading="lazy"
  decoding="async"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = defaultProductImage;
  }}
/>
                </button>
              ))}
            </div>

            <span className="variants-count">
              {variantProducts.length} shades available
            </span>
          </div>
        )}

        {getShadeName(previewProduct.name) && (
          <p className="card-shade-name">{getShadeName(previewProduct.name)}</p>
        )}

        <p className="product-price">{previewProduct.price} ₪</p>

        {previewProduct.stock === 0 && (
          <span className="product-out-badge">{t[language].outOfStock}</span>
        )}

        <button
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(previewProduct);
          }}
          disabled={previewProduct.stock === 0}
        >
          {previewProduct.stock === 0
            ? t[language].outOfStock
            : t[language].addToCart}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

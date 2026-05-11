import defaultProductImage from "../images/default-product.png";
import { getImageUrl, getProductImages } from "../utils/imageUtils";
import {
  getAllProductVariants,
  getBaseProductName,
  getDisplayProductName,
  getShadeName
} from "../utils/productUtils";
import ProductCard from "./ProductCard";

function ProductDetails({
  selectedProduct,
  selectedImage,
  setSelectedProduct,
  setSelectedImage,
  setPage,
  uniqueProducts,
  products,
  API_URL,
  getCategoryName,
  addToCart,
  isFavorite,
  toggleFavorite,
  hoveredVariantByProductId,
  setHoveredVariantByProductId,
  t,
  language
}) {
  if (!selectedProduct) return null;

  const galleryImages = getProductImages(selectedProduct, API_URL);
  const currentImageIndex = galleryImages.findIndex((image) => image === selectedImage);
  const safeImageIndex = currentImageIndex === -1 ? 0 : currentImageIndex;

  const goToPreviousImage = () => {
    const previousIndex =
      safeImageIndex === 0 ? galleryImages.length - 1 : safeImageIndex - 1;
    setSelectedImage(galleryImages[previousIndex]);
  };

  const goToNextImage = () => {
    const nextIndex =
      safeImageIndex === galleryImages.length - 1 ? 0 : safeImageIndex + 1;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const selectedBaseName = getBaseProductName(selectedProduct.name);

  const relatedProducts = uniqueProducts
    .filter(
      (product) =>
        product.id !== selectedProduct.id &&
        String(product.category_id) === String(selectedProduct.category_id) &&
        getBaseProductName(product.name) !== selectedBaseName
    )
    .slice(0, 4);

  const fallbackRelatedProducts = uniqueProducts
    .filter(
      (product) =>
        product.id !== selectedProduct.id &&
        getBaseProductName(product.name) !== selectedBaseName
    )
    .slice(0, 4);

  const productsToShow =
    relatedProducts.length > 0 ? relatedProducts : fallbackRelatedProducts;

  return (
    <main className="product-details-page">
      <button
        className="continue-shopping-btn"
        onClick={() => {
          setPage("shop");
          setSelectedProduct(null);
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 50);
        }}
      >
        ← Continue Shopping
      </button>

      <section className="product-details-layout">
        <div className="product-details-gallery">
          <div className="product-details-main-image-box">
            {galleryImages.length > 1 && (
              <button
                className="image-arrow image-arrow-left"
                onClick={goToPreviousImage}
                aria-label="Previous product image"
              >
                ‹
              </button>
            )}

            <img
              src={getImageUrl(galleryImages[safeImageIndex], API_URL)}
              alt={selectedProduct.name}
              className="product-details-main-image"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProductImage;
              }}
            />
{isNewProduct(selectedProduct) && (
  <div className="details-new-badge">
    {language === "ar" ? "جديد" : "NEW"}
  </div>
)}
            {galleryImages.length > 1 && (
              <button
                className="image-arrow image-arrow-right"
                onClick={goToNextImage}
                aria-label="Next product image"
              >
                ›
              </button>
            )}

            {galleryImages.length > 1 && (
              <div className="image-counter">
                {safeImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>

          <div className="product-details-thumbnails">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                className={`product-details-thumb-btn ${
                  galleryImages[safeImageIndex] === image ? "active-detail-thumb" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
  src={getImageUrl(image, API_URL)}
  alt={`${selectedProduct.name} ${index + 1}`}
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
        </div>

        <div className="product-details-info">
          <p className="section-tag">{getCategoryName(selectedProduct.category_id)}</p>
          <h1>{getDisplayProductName(selectedProduct.name)}</h1>

          <p className="product-details-shade">
            {getShadeName(selectedProduct.name)
              ? `Shade: ${getShadeName(selectedProduct.name)}`
              : "Soft ELORIA beauty pick"}
          </p>

          {getAllProductVariants(selectedProduct, products).length > 1 && (
            <div className="details-variants-box">
              <p>Choose shade</p>

              <div className="details-variant-list">
                {getAllProductVariants(selectedProduct, products).map((variant) => (
                  <button
                    key={variant.id}
                    className={`details-variant-btn ${
                      variant.id === selectedProduct.id ? "active-details-variant" : ""
                    }`}
                    onClick={() => {
                      setSelectedProduct(variant);
                      setSelectedImage(getProductImages(variant, API_URL)[0]);
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
                    <span>{getShadeName(variant.name) || variant.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="product-details-description">
            A beautiful ELORIA pick designed to add a soft, elegant touch to
            your makeup collection. Browse the gallery, check availability,
            and add it to your bag when you are ready.
          </p>

          <div className="product-details-price-row">
            <span className="product-details-price">{selectedProduct.price} ₪</span>
            <span
              className={`stock-badge ${
                selectedProduct.stock === 0 ? "out-stock" : "in-stock"
              }`}
            >
              {selectedProduct.stock === 0
                ? t[language].outOfStock
                : t[language].available}
            </span>
          </div>

          <div className="product-details-actions">
            <button
              className="details-add-cart-btn"
              onClick={() => addToCart(selectedProduct)}
              disabled={selectedProduct.stock === 0}
            >
              {selectedProduct.stock === 0
                ? t[language].outOfStock
                : t[language].addToCart}
            </button>

            <button
              className={`details-favorite-btn ${
                isFavorite(selectedProduct.id) ? "active-favorite" : ""
              }`}
              onClick={() => toggleFavorite(selectedProduct)}
            >
              {isFavorite(selectedProduct.id) ? "❤ Saved" : "♡ Save"}
            </button>
          </div>
        </div>
      </section>

      <section className="related-products-section">
        <div className="home-strip-header">
          <p className="section-tag">RELATED PRODUCTS</p>
          <h2>You may also like</h2>
          <button
            className="view-all-btn"
            onClick={() => {
              setPage("shop");
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 50);
            }}
          >
            View all products
          </button>
        </div>

        <div className="home-products-row">
          {productsToShow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              products={products}
              API_URL={API_URL}
              hoveredVariantByProductId={hoveredVariantByProductId}
              setHoveredVariantByProductId={setHoveredVariantByProductId}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              addToCart={addToCart}
              setSelectedProduct={setSelectedProduct}
              setSelectedImage={setSelectedImage}
              setPage={setPage}
              t={t}
              language={language}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;

import defaultProductImage from "../../images/default-product.png";
import { getImageUrl } from "../../utils/imageUtils";

function EditProductPopup({
  showEditPopup,
  setShowEditPopup,
  editingProduct,
  handleEditChange,
  categories,
  setEditProductImage,
  setEditProductImage2,
  setEditProductImage3,
  previewImages,
  setPreviewImages,
  handleUpdateProduct,
  API_URL
}) {
  if (!showEditPopup || !editingProduct) return null;

  return (
    <div className="edit-popup-overlay" onClick={() => setShowEditPopup(false)}>
      <div className="edit-popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-product-btn" onClick={() => setShowEditPopup(false)}>
          ✕
        </button>

        <h3>Edit Product</h3>

        <label>Product Name</label>
        <input
          name="name"
          placeholder="Product Name"
          value={editingProduct.name}
          onChange={handleEditChange}
        />

        <label>Price</label>
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={editingProduct.price}
          onChange={handleEditChange}
        />

        <label>Stock</label>
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={editingProduct.stock}
          onChange={handleEditChange}
        />

        <label>Category</label>
        <select
          name="category_id"
          value={editingProduct.category_id}
          onChange={handleEditChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label>Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setEditProductImage(file);
            setPreviewImages((prev) => ({
              ...prev,
              image: URL.createObjectURL(file)
            }));
          }}
        />

        <label>Second Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setEditProductImage2(file);
            setPreviewImages((prev) => ({
              ...prev,
              image2: URL.createObjectURL(file)
            }));
          }}
        />

        <label>Third Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setEditProductImage3(file);
            setPreviewImages((prev) => ({
              ...prev,
              image3: URL.createObjectURL(file)
            }));
          }}
        />

        <div className="preview-images">
          {(previewImages.image || editingProduct.image_url) && (
            <img
              src={previewImages.image || getImageUrl(editingProduct.image_url, API_URL)}
              alt="preview 1"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProductImage;
              }}
            />
          )}

          {(previewImages.image2 || editingProduct.image_url_2) && (
            <img
              src={
                previewImages.image2 ||
                getImageUrl(editingProduct.image_url_2, API_URL)
              }
              alt="preview 2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProductImage;
              }}
            />
          )}

          {(previewImages.image3 || editingProduct.image_url_3) && (
            <img
              src={
                previewImages.image3 ||
                getImageUrl(editingProduct.image_url_3, API_URL)
              }
              alt="preview 3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProductImage;
              }}
            />
          )}
        </div>

        <div className="edit-product-actions">
          <button onClick={handleUpdateProduct} className="submit-order-btn">
            Save Changes
          </button>

          <button
            onClick={() => setShowEditPopup(false)}
            className="delete-product-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProductPopup;

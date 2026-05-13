function AddProductForm({
  newProduct,
  handleNewProductChange,
  categories,
  handleImagePreview,
  previewImages,
  handleAddProduct
}) {
  return (
    <div className="add-product-form admin-form-page">
      <h3>Add New Product</h3>

      <div className="admin-form-section">
        <h4>English Content</h4>

        <label>Product Name EN</label>
        <input
          type="text"
          name="name"
          placeholder="English product name"
          value={newProduct.name || ""}
          onChange={handleNewProductChange}
        />

        <label>Description EN</label>
        <textarea
          name="description_en"
          placeholder="Product description in English"
          value={newProduct.description_en || ""}
          onChange={handleNewProductChange}
        />
      </div>

      <div className="admin-form-section">
        <h4>Arabic Content</h4>

        <label>اسم المنتج بالعربي</label>
        <input
          type="text"
          name="name_ar"
          placeholder="اسم المنتج بالعربي"
          value={newProduct.name_ar || ""}
          onChange={handleNewProductChange}
          dir="rtl"
        />

        <label>الوصف بالعربي</label>
        <textarea
          name="description_ar"
          placeholder="وصف المنتج بالعربي"
          value={newProduct.description_ar || ""}
          onChange={handleNewProductChange}
          dir="rtl"
        />
      </div>

      <div className="admin-form-section">
        <h4>Product Details</h4>

        <label>Price</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price || ""}
          onChange={handleNewProductChange}
        />

        <label>Stock</label>
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={newProduct.stock || ""}
          onChange={handleNewProductChange}
        />

        <label>Category</label>
        <select
          name="category_id"
          value={newProduct.category_id || "1"}
          onChange={handleNewProductChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-form-section">
        <h4>Product Images</h4>

        <label>Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImagePreview(e, "image")}
        />

        <label>Second Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImagePreview(e, "image2")}
        />

        <label>Third Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImagePreview(e, "image3")}
        />

        <div className="preview-images">
          {previewImages.image && (
            <img src={previewImages.image} alt="preview 1" />
          )}
          {previewImages.image2 && (
            <img src={previewImages.image2} alt="preview 2" />
          )}
          {previewImages.image3 && (
            <img src={previewImages.image3} alt="preview 3" />
          )}
        </div>
      </div>

      <button className="submit-order-btn" onClick={handleAddProduct}>
        Save Product
      </button>
    </div>
  );
}

export default AddProductForm;
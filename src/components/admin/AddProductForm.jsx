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

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={handleNewProductChange}
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newProduct.price}
        onChange={handleNewProductChange}
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={newProduct.stock}
        onChange={handleNewProductChange}
      />

      <select
        name="category_id"
        value={newProduct.category_id}
        onChange={handleNewProductChange}
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
        {previewImages.image && <img src={previewImages.image} alt="preview 1" />}
        {previewImages.image2 && <img src={previewImages.image2} alt="preview 2" />}
        {previewImages.image3 && <img src={previewImages.image3} alt="preview 3" />}
      </div>

      <button className="submit-order-btn" onClick={handleAddProduct}>
        Save Product
      </button>
    </div>
  );
}

export default AddProductForm;

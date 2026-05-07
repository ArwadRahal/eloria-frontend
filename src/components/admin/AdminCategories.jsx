function AdminCategories({
  categories,
  products,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
  handleDeleteCategory
}) {
  return (
    <div className="admin-form-page admin-categories-page">
      <h3>Manage Categories</h3>

      <div className="category-add-row">
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddCategory();
            }
          }}
        />

        <button className="submit-order-btn" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <p className="categories-note">
        You can delete a category only if it has no products connected to it.
      </p>

      <div className="categories-list">
        {categories.length > 0 ? (
          categories.map((category) => {
            const productCount = products.filter(
              (product) => String(product.category_id) === String(category.id)
            ).length;

            return (
              <div key={category.id} className="category-admin-card">
                <div className="category-admin-info">
                  <span className="category-admin-id">#{category.id}</span>
                  <strong>{category.name}</strong>
                  <small>{productCount} products</small>
                </div>

                <button
                  className="delete-category-btn"
                  onClick={() => handleDeleteCategory(category)}
                  disabled={productCount > 0}
                  title={
                    productCount > 0
                      ? "Move or delete products from this category first"
                      : "Delete category"
                  }
                >
                  Delete
                </button>
              </div>
            );
          })
        ) : (
          <p className="no-admin-orders-message">No categories found yet.</p>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;

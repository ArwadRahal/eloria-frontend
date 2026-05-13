function AdminCategories({
  categories,
  products,
  newCategoryName,
  setNewCategoryName,
  newCategoryNameAr,
  setNewCategoryNameAr,
  editingCategory,
  setEditingCategory,
  handleAddCategory,
  handleUpdateCategory,
  handleDeleteCategory
}) {
  return (
    <div className="admin-form-page admin-categories-page">
      <h3>Manage Categories</h3>

      <div className="admin-form-section">
        <h4>Add New Category</h4>

        <label>Category Name EN</label>
        <input
          type="text"
          placeholder="English category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />

        <label>Category Name AR</label>
        <input
          type="text"
          placeholder="اسم الفئة بالعربي"
          value={newCategoryNameAr}
          onChange={(e) => setNewCategoryNameAr(e.target.value)}
          dir="rtl"
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

            const isEditing = editingCategory?.id === category.id;

            return (
              <div key={category.id} className="category-admin-card">
                <div className="category-admin-info">
                  <span className="category-admin-id">#{category.id}</span>

                  {isEditing ? (
                    <div className="category-edit-fields">
                      <label>Name EN</label>
                      <input
                        type="text"
                        value={editingCategory.name || ""}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            name: e.target.value
                          })
                        }
                      />

                      <label>Name AR</label>
                      <input
                        type="text"
                        value={editingCategory.name_ar || ""}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            name_ar: e.target.value
                          })
                        }
                        dir="rtl"
                      />
                    </div>
                  ) : (
                    <>
                      <strong>{category.name}</strong>
                      <small>{category.name_ar || "No Arabic name yet"}</small>
                      <small>{productCount} products</small>
                    </>
                  )}
                </div>

                <div className="category-actions">
                  {isEditing ? (
                    <>
                      <button
                        className="submit-order-btn category-small-btn"
                        onClick={() => handleUpdateCategory(editingCategory)}
                      >
                        Save
                      </button>

                      <button
                        className="delete-category-btn"
                        onClick={() => setEditingCategory(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="category-edit-btn"
                        onClick={() =>
                          setEditingCategory({
                            id: category.id,
                            name: category.name || "",
                            name_ar: category.name_ar || ""
                          })
                        }
                      >
                        Edit
                      </button>

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
                    </>
                  )}
                </div>
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
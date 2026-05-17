import defaultProductImage from "../../images/default-product.png";
import { getImageUrl } from "../../utils/imageUtils";

function AdminProducts({
  filteredAdminProducts,
  adminProductSearch,
  setAdminProductSearch,
  adminStockFilter,
  setAdminStockFilter,
  totalProductsCount,
  lowStockProductsCount,
  outOfStockProductsCount,
  getCategoryName,
  handleEditProduct,
  deleteProduct,
  API_URL
}) {
  return (
    <div className="admin-products-section">
      <h3 className="admin-products-title">Manage Products</h3>

      <div className="admin-products-tools">
        <input
          type="text"
          placeholder="Search product..."
          value={adminProductSearch}
          onChange={(e) => setAdminProductSearch(e.target.value)}
          className="admin-products-search"
        />

        <select
          value={adminStockFilter}
          onChange={(e) => setAdminStockFilter(e.target.value)}
          className="admin-products-stock-filter"
        >
          <option value="all">All Stock</option>
          <option value="available">Available</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div className="admin-products-mini-stats">
        <div className="mini-stat-card">
          <span>{totalProductsCount}</span>
          <p>Total Products</p>
        </div>

        <div className="mini-stat-card">
          <span>{lowStockProductsCount}</span>
          <p>Low Stock</p>
        </div>

        <div className="mini-stat-card">
          <span>{outOfStockProductsCount}</span>
          <p>Out of Stock</p>
        </div>
      </div>

      <div className="admin-products-table-wrapper">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>NEW</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAdminProducts.length > 0 ? (
              filteredAdminProducts.map((product) => {
                const imageCount = [
                  product.image_url,
                  product.image_url_2,
                  product.image_url_3
                ].filter(Boolean).length;

                return (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={getImageUrl(product.image_url, API_URL)}
                        alt={product.name}
                        className="admin-table-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultProductImage;
                        }}
                      />
                    </td>

                    <td className="product-name-cell">
                      {product.name}
                      {product.name_ar && <small>{product.name_ar}</small>}
                    </td>

                    <td>
                      {Number(product.is_new) === 1 ? (
                        <span className="admin-new-badge">NEW</span>
                      ) : (
                        <span className="admin-normal-badge">—</span>
                      )}
                    </td>

                    <td>{getCategoryName(product.category_id)}</td>
                    <td>{product.price} ₪</td>

                    <td>
                      <span
                        className={`stock-badge-admin ${
                          product.stock === 0
                            ? "stock-out"
                            : product.stock <= 3
                            ? "stock-low"
                            : "stock-ok"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td>{imageCount}</td>

                    <td>
                      <div className="table-actions">
                        <button className="edit-btn" onClick={() => handleEditProduct(product)}>
                          Edit
                        </button>

                        <button className="delete-btn" onClick={() => deleteProduct(product.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="no-products-row">
                  No matching products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
import eloriaLogo from "../images/eloria-logo.png";

function Navbar({
  isArabic,
  categories,
  selectedCategory,
  favoritesCount,
  totalItems,
  setPage,
  setSelectedCategory,
  handleHiddenAdminEntry,
  handleShopNow,
  handleCategorySelect,
  setShowFavorites,
  setShowCart,
  setLanguage,
  startDrag,
  onDrag,
  stopDrag
}) {
  return (
    <div className="luxury-navbar">
      <div className="nav-left">
        <div
          className="logo luxury-logo"
          onClick={() => {
            setPage("home");
            setSelectedCategory("all");
            handleHiddenAdminEntry();
          }}
        >
          <img src={eloriaLogo} alt="ELORIA Logo" />
        </div>
      </div>

      <div
        className="nav-center"
        onMouseDown={(e) => startDrag(e)}
        onMouseMove={(e) => onDrag(e)}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div className="nav-marquee">
          <button
            className={selectedCategory === "all" ? "active-nav-category" : ""}
            onClick={handleShopNow}
          >
            Shop All
          </button>

          {categories.map((category) => (
            <button
              key={`main-${category.id}`}
              className={
                String(selectedCategory) === String(category.id)
                  ? "active-nav-category"
                  : ""
              }
              onClick={() => handleCategorySelect(String(category.id))}
            >
              {category.name}
            </button>
          ))}

          <button
            className={selectedCategory === "all" ? "active-nav-category" : ""}
            onClick={handleShopNow}
            aria-hidden="true"
            tabIndex="-1"
          >
            Shop All
          </button>

          {categories.map((category) => (
            <button
              key={`copy-${category.id}`}
              className={
                String(selectedCategory) === String(category.id)
                  ? "active-nav-category"
                  : ""
              }
              onClick={() => handleCategorySelect(String(category.id))}
              aria-hidden="true"
              tabIndex="-1"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="nav-right">
        <button className="nav-icon-btn" onClick={() => setShowFavorites(true)}>
          ♡ {favoritesCount}
        </button>

        <button className="nav-icon-btn" onClick={() => setShowCart(true)}>
          Bag ({totalItems})
        </button>

        <button
          className="language-toggle clean-language-btn"
          onClick={() => setLanguage(isArabic ? "en" : "ar")}
        >
          {isArabic ? "EN" : "AR"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;

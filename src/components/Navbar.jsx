import eloriaLogo from "../images/eloria-logo.png";

function Navbar({
  isArabic,
  language,
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
  const getCategoryLabel = (category) => {
    return language === "ar"
      ? category.name_ar || category.name
      : category.name;
  };

  return (
    <div className="luxury-navbar">
      <div className="nav-left">
        <div
          className="logo luxury-logo"
          onClick={() => {
            setPage("home");
            setSelectedCategory("all");
          }}
        >
          <img src={eloriaLogo} alt="ELORIA Logo" />
        </div>
      </div>
<div className="nav-center">
  <div className="nav-marquee">
    {[0, 1, 2, 3].map((loopIndex) => (
      <div className="nav-category-loop" key={loopIndex}>
        <button
          className={selectedCategory === "all" ? "active-nav-category" : ""}
          onClick={handleShopNow}
          tabIndex={loopIndex === 0 ? "0" : "-1"}
        >
          {language === "ar" ? "كل المنتجات" : "Shop All"}
        </button>

        {categories.map((category) => (
          <button
            key={`${loopIndex}-${category.id}`}
            className={
              String(selectedCategory) === String(category.id)
                ? "active-nav-category"
                : ""
            }
            onClick={() => handleCategorySelect(String(category.id))}
            tabIndex={loopIndex === 0 ? "0" : "-1"}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>
    ))}
  </div>
</div>

      <div className="nav-right">
        <button className="nav-icon-btn" onClick={() => setShowFavorites(true)}>
          ♡ {favoritesCount}
        </button>

        <button className="nav-icon-btn" onClick={() => setShowCart(true)}>
          {language === "ar" ? `السلة (${totalItems})` : `Bag (${totalItems})`}
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
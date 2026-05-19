import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import defaultProductImage from "./images/default-product.png";
import heroVideo from "./videos/hero-video.mp4";
import eloriaLogo from "./images/eloria-logo.png";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import CartDrawer from "./components/CartDrawer";
import CheckoutPopup from "./components/CheckoutPopup";
import OrderSuccessPopup from "./components/OrderSuccessPopup";
import FavoritesPopup from "./components/FavoritesPopup";
import Navbar from "./components/Navbar";
import AdminSidebar from "./components/admin/AdminSidebar";
import AdminDashboardCards from "./components/admin/AdminDashboard.jsx";
import AdminOrders from "./components/admin/AdminOrders";
import AdminProducts from "./components/admin/AdminProducts";
import AdminCategories from "./components/admin/AdminCategories";
import AddProductForm from "./components/admin/AddProductForm";
import EditProductPopup from "./components/admin/EditProductPopup";
import API_URL from "./services/api";
import {getAdminHeaders,getAdminJsonHeaders,adminLogin} from "./services/adminApi";
import {
  fetchProducts as fetchProductsRequest,
  fetchCategories as fetchCategoriesRequest,
  deleteProductRequest
} from "./services/productApi";
function App() {
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef(null);
  const navIsDraggingRef = useRef(false);
  const navStartXRef = useRef(0);
  const navScrollLeftRef = useRef(0);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(defaultProductImage);
  const [hoveredVariantByProductId, setHoveredVariantByProductId] = useState({});
  const [adminStatusFilter, setAdminStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [adminView, setAdminView] = useState("dashboard");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newProductImage, setNewProductImage] = useState(null);
  const [newProductImage2, setNewProductImage2] = useState(null);
  const [newProductImage3, setNewProductImage3] = useState(null);
  const [editProductImage, setEditProductImage] = useState(null);
  const [editProductImage2, setEditProductImage2] = useState(null);
  const [editProductImage3, setEditProductImage3] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminProductSearch, setAdminProductSearch] = useState("");
  const [adminStockFilter, setAdminStockFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [page, setPage] = useState("home");
const [language, setLanguage] = useState("en");
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryNameAr, setNewCategoryNameAr] = useState("");
const [editingCategory, setEditingCategory] = useState(null);
const ADMIN_TIMEOUT = 5 * 60 * 1000;
const isArabic = language === "ar";
const PRODUCTS_CACHE_KEY = "eloria_products_cache_v2";
const CATEGORIES_CACHE_KEY = "eloria_categories_cache_v2";
const CART_STORAGE_KEY = "eloria_cart_v1";
const getImageUrl = (url) => {
  if (!url) return defaultProductImage;
  if (url.startsWith("blob:") || url.startsWith("data:")) { return url;}
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://"); }
  if (url.startsWith("/uploads/")) {
    return `${API_URL}${url}`;}return url;};
const getProductImages = (product) => {
  const images = [product?.image_url,product?.image_url_2,product?.image_url_3 ]
    .filter(Boolean) .map(getImageUrl);
  return images.length > 0 ? images : [defaultProductImage];};
const getBaseProductName = (name = "") => {
  return name
    .replace(/\s+[–—-]\s+[^–—-]+$/, "")
    .trim()
    .toLowerCase();};
const getDisplayProductName = (name = "") => {
  return name.replace(/\s+[–—-]\s+[^–—-]+$/, "").trim();};
const getShadeName = (name = "") => {
  const parts = name.split(/\s+[–—-]\s+/);
  return parts.length > 1 ? parts[parts.length - 1].trim() : "";};
const getProductVariants = (product) => {
  if (!product?.name) return [];
  const baseName = getBaseProductName(product.name);
  return products.filter(
    (item) =>
      item.id !== product.id &&
      String(item.category_id) === String(product.category_id) &&
      getBaseProductName(item.name) === baseName );};
const getAllProductVariants = (product) => {if (!product?.name) return [];
  const variants = [product, ...getProductVariants(product)];
  return variants.sort((a, b) => a.name.localeCompare(b.name));};
const getProductGroupKey = (product) => {
  return `${product?.category_id || ""}-${getBaseProductName(product?.name || "")}`;};
const getRepresentativeProducts = (items = []) => {
  const seenGroups = new Set();
  return items.filter((product) => {
    const groupKey = getProductGroupKey(product);
    if (seenGroups.has(groupKey)) return false;
    seenGroups.add(groupKey);
    return true;  });};
const [previewImages, setPreviewImages] = useState({
  image: null,image2:null,image3: null});
const handleImagePreview = (e, field) => {
  const file = e.target.files[0];
  if (!file) return;
  const previewURL = URL.createObjectURL(file);
  setPreviewImages((prev) => ({
    ...prev,
    [field]: previewURL
  }));
  if (field === "image") setNewProductImage(file);
  if (field === "image2") setNewProductImage2(file);
  if (field === "image3") setNewProductImage3(file);
};
const t = {
  en: {
    heroBadge: "ELORIA BEAUTY",
    heroTitle: "Soft beauty, bold confidence ✨",
    heroDescription:
      "Discover curated beauty favorites designed to make every look feel elegant, modern, and uniquely yours.",
    shopNow: "Shop Now",
    whoTag: "WHO WE ARE",
    whoTitle: "Two best friends, one soft dream — ELORIA",
    whoP1:
      "ELORIA began in 2026 with two best friends, Ayman and Arwad, who wanted to turn their friendship into something beautiful and meaningful.",
    whoP2:
      "For us, ELORIA is more than a beauty store. It is a space full of glow, warmth, confidence, and lovely little details.",
    founded: "Founded in 2026",
    connectTag: "CONNECT WITH US",
    instagramTitle: "Follow our glow on Instagram",
    instagramText:
      "Stay close to ELORIA for updates, new arrivals, soft beauty vibes, and all the little lovely details we share with our community.",
    featuredTag: "FEATURED PICKS",
    featuredTitle: "A little taste of ELORIA",
    featuredText:
      "A small random selection of products to discover first before exploring the full collection.",
    categoryTag: "SHOP BY CATEGORY",
    categoryTitle: "Find your favorites your way",
    categoryText:
      "Browse the collection by category and explore only the products you are looking for.",
    searchPlaceholder: "Search products...",
    sortDefault: "Sort by",
    lowToHigh: "Price: Low to High",
    highToLow: "Price: High to Low",
    clearFilters: "Clear Filters",
    chooseCategory: "Choose a category to view products",
    chooseStart: "Choose a category above to start shopping 💕",
    noProducts: "No products found 💔",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    available: "Available",
    favorites: "My Favorites ❤️",
    cart: "Shopping Cart 🛒",
    checkout: "Customer Information",
    finalTitle: "Thank you for visiting ELORIA 💕",
    finalText: "We hope you find your next beauty favorite with us.",
    footer: "ELORIA © 2026 — Beauty with a soft elegant touch ✨",
    newArrivalsTag: "NEW ARRIVALS",
    freshBeautyPicks: "Fresh beauty picks",
    viewAllProducts: "View all products",
    softBeautyPicksTag: "SOFT BEAUTY PICKS",
    everydayGlow: "Made for your everyday glow",
    shopCollection: "Shop collection",
    youMayAlsoLoveTag: "YOU MAY ALSO LOVE",
    moreFavorites: "A few more ELORIA favorites",
    continueShopping: "Continue shopping",
    shopHeroTag: "SHOP ELORIA",
    shopHeroTitle: "Explore the full collection",
    shopHeroText: "Browse all products, search by name, or choose a category from the top menu."
  },
  ar: {
    heroBadge: "إلوريا بيوتي",
    heroTitle: "جمالك الناعم… وثقتك الأقوى ✨",
    heroDescription:
      "اكتشفي منتجات مختارة بعناية لتضيف لمستك الأنثوية الناعمة لكل إطلالة.",
    shopNow: "تسوّقي الآن",
    whoTag: "من نحن",
    whoTitle: "صديقتان وحلم جميل اسمه ELORIA",
    whoP1:
      "بدأت ELORIA في عام 2026 على يد صديقتين، أيمان وأرواد، قررتا تحويل الصداقة والحب للجمال إلى مشروع يحمل روحًا ناعمة ومميزة.",
    whoP2:
      "بالنسبة لنا، ELORIA ليست مجرد متجر. هي مساحة مليئة بالدفء، الثقة، اللمعان، والتفاصيل الصغيرة التي تجعل تجربة التسوق ألطف.",
    founded: "تأسست عام 2026",
    connectTag: "تواصلي معنا",
    instagramTitle: "تابعي لمعتنا على إنستغرام",
    instagramText:
      "كوني قريبة من ELORIA لتشاهدي المنتجات الجديدة، التحديثات، والأجواء الناعمة التي نشاركها مع مجتمعنا.",
    featuredTag: "اختيارات مميزة",
    featuredTitle: "لمحة صغيرة من ELORIA",
    featuredText:
      "اختيار عشوائي صغير من منتجاتنا قبل استكشاف المجموعة كاملة.",
    categoryTag: "تسوقي حسب الفئة",
    categoryTitle: "اختاري منتجاتك بطريقتك",
    categoryText:
      "تصفحي المنتجات حسب النوع واختاري فقط الفئة التي تبحثين عنها.",
    searchPlaceholder: "ابحثي عن منتج...",
    sortDefault: "ترتيب حسب",
    lowToHigh: "السعر: من الأقل للأعلى",
    highToLow: "السعر: من الأعلى للأقل",
    clearFilters: "مسح الفلاتر",
    chooseCategory: "اختاري فئة لعرض المنتجات",
    chooseStart: "اختاري فئة من الأعلى لتبدأي التسوق 💕",
    noProducts: "لا توجد منتجات 💔",
    addToCart: "أضيفي للسلة",
    outOfStock: "نفدت الكمية",
    available: "متوفر",
    favorites: "المفضلة ❤️",
    cart: "سلة التسوق 🛒",
    checkout: "معلومات الزبونة",
    finalTitle: "شكرًا لزيارتك ELORIA 💕",
    finalText: "نتمنى أن تجدي معنا منتجك المفضل القادم.",
    footer: "ELORIA © 2026 — جمال ناعم بلمسة أنيقة ✨",
    newArrivalsTag: "وصل حديثًا",
    freshBeautyPicks: "اختيارات جمال جديدة",
    viewAllProducts: "عرض كل المنتجات",
    softBeautyPicksTag: "اختيارات ناعمة",
    everydayGlow: "لإطلالة يومية ناعمة",
    shopCollection: "تسوقي المجموعة",
    youMayAlsoLoveTag: "قد يعجبك أيضًا",
    moreFavorites: "المزيد من مفضلات ELORIA",
    continueShopping: "متابعة التسوق",
    shopHeroTag: "تسوّقي ELORIA",
    shopHeroTitle: "استكشفي المجموعة كاملة",
    shopHeroText: "تصفحي كل المنتجات، ابحثي بالاسم، أو اختاري فئة من القائمة العلوية."
  }
};
  const [newProduct, setNewProduct] = useState({
    name: "",
    name_ar: "",
    is_new: 0,
    price: "",
    stock: "",
    category_id: "",
    description_en: "",
description_ar: "",
    image_url: "",
    image_url_2: "",
    image_url_3: ""
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    notes: ""
  });

  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [lastOrderId, setLastOrderId] = useState(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

const fetchCategories = async () => {
  try {
    const cachedCategories = sessionStorage.getItem(CATEGORIES_CACHE_KEY);

    if (cachedCategories && categories.length === 0) {
      setCategories(JSON.parse(cachedCategories));
    }

    const data = await fetchCategoriesRequest();
    const safeCategories = Array.isArray(data) ? data : [];

    setCategories(safeCategories);
    sessionStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(safeCategories));
  } catch (err) {
    const cachedCategories = sessionStorage.getItem(CATEGORIES_CACHE_KEY);

    if (cachedCategories) {
      setCategories(JSON.parse(cachedCategories));
    } else {
      setCategories([]);
    }
  }
};


const handleAddCategory = async () => {
  const trimmedName = newCategoryName.trim();
  const trimmedNameAr = newCategoryNameAr.trim();

  if (!trimmedName) {
    showToastMessage("Please enter category name in English.", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: getAdminJsonHeaders(),
      body: JSON.stringify({
        name: trimmedName,
        name_ar: trimmedNameAr
      })
    });

    const data = await response.json();

    if (response.ok) {
      showToastMessage("Category added successfully ✨", "success");
      setNewCategoryName("");
      setNewCategoryNameAr("");
      fetchCategories();
    } else {
      showToastMessage(data.error || "Failed to add category.", "error");
    }
  } catch (err) {
    showToastMessage("Error adding category.", "error");
  }
};

const handleUpdateCategory = async (category) => {
  if (!category.name.trim()) {
    showToastMessage("Category English name is required.", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/categories/${category.id}`, {
      method: "PUT",
      headers: getAdminJsonHeaders(),
      body: JSON.stringify({
        name: category.name.trim(),
        name_ar: category.name_ar?.trim() || ""
      })
    });

    const data = await response.json();

    if (response.ok) {
      showToastMessage("Category updated successfully ✨", "success");
      setEditingCategory(null);
      fetchCategories();
    } else {
      showToastMessage(data.error || "Failed to update category.", "error");
    }
  } catch (err) {
    showToastMessage("Error updating category.", "error");
  }
};

  const handleDeleteCategory = async (category) => {
    const productsInCategory = products.filter(
      (product) => String(product.category_id) === String(category.id)
    );

    if (productsInCategory.length > 0) {
      showToastMessage(
        `Cannot delete ${language === "ar"
  ? category.name_ar || category.name
  : category.name}. It has ${productsInCategory.length} products.`,
        "error"
      );
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${language === "ar"
  ? category.name_ar || category.name
  : category.name}"?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/categories/${category.id}`, {
  method: "DELETE",
  headers: getAdminHeaders()
});

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Category deleted successfully 🗑️", "success");

        if (String(selectedCategory) === String(category.id)) {
          setSelectedCategory("all");
        }

        fetchCategories();
      } else {
        showToastMessage(data.error || "Failed to delete category.", "error");
      }
    } catch (err) {
      showToastMessage("Error deleting category.", "error");
    }
  };

  const fetchProducts = async () => {
  try {
    const cachedProducts = sessionStorage.getItem(PRODUCTS_CACHE_KEY);

    if (cachedProducts && products.length === 0) {
      setProducts(JSON.parse(cachedProducts));
      setLoading(false);
    } else {
      setLoading(true);
    }

    const data = await fetchProductsRequest();
    const safeProducts = Array.isArray(data) ? data : [];

    setProducts(safeProducts);
    sessionStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(safeProducts));
  } catch (err) {
    const cachedProducts = sessionStorage.getItem(PRODUCTS_CACHE_KEY);

    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
    } else {
      setProducts([]);
    }
  } finally {
    setLoading(false);
  }
};


  const fetchOrders = async () => {
    try {
const res = await fetch(`${API_URL}/orders-with-items`, {
  headers: getAdminHeaders()
});
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("eloria_admin_token");
        setIsAdmin(false);
        setOrders([]);
        showToastMessage("Admin session expired. Please login again.", "error");
        return;
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
        setShowEditPopup(false);
        setShowCart(false);
        setShowCheckout(false);
        setShowFavorites(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("eloria_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (err) {
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (products.length === 0) return;

    products.slice(0, 18).forEach((product) => {
      getProductImages(product).forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, [products]);

  useEffect(() => {
    if (!selectedProduct) return;

    getProductImages(selectedProduct).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [selectedProduct]);

  const showToastMessage = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success"
      });
    }, 2500);
  };

  const getCategoryName = (categoryId) => {
    const foundCategory = categories.find(
      (category) => String(category.id) === String(categoryId)
    );

    return foundCategory ? foundCategory.name : "Unknown";
  };
// const handleHiddenAdminEntry = async () => {
//   logoClickCountRef.current += 1;

//   if (logoClickTimerRef.current) {
//     clearTimeout(logoClickTimerRef.current);
//   }

//   logoClickTimerRef.current = setTimeout(() => {
//     logoClickCountRef.current = 0;
//   }, 1500);

//   if (logoClickCountRef.current >= 5) {
//     logoClickCountRef.current = 0;

//     const password = prompt("Enter admin password:");
//     if (password === null) return;

//     try {
//       const response = await adminLogin(password);
//       const data = await response.json();

//       if (response.ok && data.success) {
//         localStorage.setItem("eloria_admin_token", data.token);

//         setIsAdmin(true);
//         setAdminView("dashboard");

//         showToastMessage("Admin mode activated 🔐", "success");
//       } else {
//         showToastMessage(data.message || "Wrong password ❌", "error");
//       }
//     } catch (error) {
//       showToastMessage("Admin login failed. Try again.", "error");
//     }
//   }
// };
  const handleAdminLogout = () => {
    localStorage.removeItem("eloria_admin_token");
    setIsAdmin(false);
    setAdminView("dashboard");
    setShowEditPopup(false);
    setEditingProduct(null);
    showToastMessage("Logged out from admin", "success");
  };
useEffect(() => {
  if (!isAdmin) return;
  let timeoutId;
  const resetAdminTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      localStorage.removeItem("eloria_admin_token");
      setIsAdmin(false);
      setAdminView("dashboard");
      setShowEditPopup(false);
      setEditingProduct(null);
      showToastMessage("Admin session expired. Please login again.", "error");
    }, ADMIN_TIMEOUT);
  };
  resetAdminTimer();
  window.addEventListener("mousemove", resetAdminTimer);
  window.addEventListener("keydown", resetAdminTimer);
  window.addEventListener("click", resetAdminTimer);
  window.addEventListener("scroll", resetAdminTimer);
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener("mousemove", resetAdminTimer);
    window.removeEventListener("keydown", resetAdminTimer);
    window.removeEventListener("click", resetAdminTimer);
    window.removeEventListener("scroll", resetAdminTimer);
  };
}, [isAdmin]);

useEffect(() => {
  const openAdminFromSecretLink = async () => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("admin") !== "eloria") return;

    const password = prompt("Enter admin password:");
    if (password === null) {
      window.history.replaceState({}, "", "/");
      return;
    }

    try {
      const response = await adminLogin(password);
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("eloria_admin_token", data.token);
        setIsAdmin(true);
        setAdminView("dashboard");
        window.history.replaceState({}, "", "/");
        showToastMessage("Admin mode activated 🔐", "success");
      } else {
        showToastMessage(data.message || "Wrong password ❌", "error");
        window.history.replaceState({}, "", "/");
      }
    } catch (error) {
      showToastMessage("Admin login failed. Try again.", "error");
      window.history.replaceState({}, "", "/");
    }
  };

  openAdminFromSecretLink();
}, []);

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      if (existingProduct.quantity >= product.stock) {
        showToastMessage("Unavailable quantity 💗", "error");
        return;
      }
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      showToastMessage(`${product.name} added to cart 🛒`, "success");
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
        showToastMessage(`${product.name} added to cart 🛒`, "success"); }}  };
  const removeFromCart = (productId) => {
    const removedItem = cart.find((item) => item.id === productId);
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    if (removedItem) {
      showToastMessage(`${removedItem.name} removed from cart`, "error"); } };
  const increaseQuantity = (productId) => {
    let updatedItemName = "";
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        const productInStock = products.find(
          (product) => product.id === productId
        );
        if (productInStock && item.quantity < productInStock.stock) {
          updatedItemName = item.name;
          return { ...item, quantity: item.quantity + 1 };
        }

        if (productInStock && item.quantity >= productInStock.stock) {
          showToastMessage("Unavailable quantity 💗", "error");
        }
      }

      return item;
    });

    setCart(updatedCart);

    if (updatedItemName) {
      showToastMessage(`Increased quantity for ${updatedItemName}`, "success");
    }
  };

  const decreaseQuantity = (productId) => {
    let updatedItemName = "";

    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          updatedItemName = item.name;
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);

    if (updatedItemName) {
      showToastMessage(`Updated quantity for ${updatedItemName}`, "success");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });

    if (checkoutErrors[name]) {
      setCheckoutErrors({
        ...checkoutErrors,
        [name]: ""
      });
    }
  };

  const handleNewProductChange = (e) => {
  const { name, value, type, checked } = e.target;

  setNewProduct({
    ...newProduct,
    [name]: type === "checkbox" ? (checked ? 1 : 0) : value
  });
};

 const handleEditChange = (e) => {
  const { name, value, type, checked } = e.target;

  setEditingProduct({
    ...editingProduct,
    [name]: type === "checkbox" ? (checked ? 1 : 0) : value
  });
};

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,

      category_id: String(product.category_id || "1"),
      name_ar: product.name_ar || "",
      is_new: Number(product.is_new) === 1 ? 1 : 0,
      description_en: product.description_en || "",
description_ar: product.description_ar || "",
      image_url: product.image_url || "",
      image_url_2: product.image_url_2 || "",
      image_url_3: product.image_url_3 || ""
    });

    setEditProductImage(null);
    setEditProductImage2(null);
    setEditProductImage3(null);
    setPreviewImages({
  image: null,
  image2: null,
  image3: null
});
    setShowEditPopup(true);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      showToastMessage("Please fill all required product fields.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("name_ar", newProduct.name_ar);
      formData.append("is_new", newProduct.is_new || 0);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("category_id", newProduct.category_id);
formData.append("description_en", newProduct.description_en);
formData.append("description_ar", newProduct.description_ar);
      if (newProductImage) formData.append("image", newProductImage);
      if (newProductImage2) formData.append("image2", newProductImage2);
      if (newProductImage3) formData.append("image3", newProductImage3);

      const response = await fetch(`${API_URL}/products`, {
  method: "POST",
  headers: getAdminHeaders(),
  body: formData
});

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Product added successfully ✨", "success");

        setNewProduct({
          name: "",name_ar: "",
          price: "",
          stock: "",
          category_id: "1",
          description_en: "",
description_ar: "",
          image_url: "",
          image_url_2: "",
          image_url_3: "",
          is_new: 0
        });

        setNewProductImage(null);
        setNewProductImage2(null);
        setNewProductImage3(null);
setPreviewImages({
  image: null,
  image2: null,
  image3: null
});

        fetchProducts();
      } else {
        showToastMessage(data.error || "Failed to add product.", "error");
      }
    } catch (error) {
      showToastMessage("Error adding product.", "error");
    }
  };

  const handleUpdateProduct = async () => {
  if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.stock) {
    showToastMessage("Please fill all required edit fields.", "error");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("name", editingProduct.name);
    formData.append("name_ar", editingProduct.name_ar || "");
    formData.append("is_new", editingProduct.is_new || 0);
    formData.append("price", editingProduct.price);
    formData.append("stock", editingProduct.stock);
    formData.append("category_id", editingProduct.category_id);
formData.append("description_en", editingProduct.description_en || "");
formData.append("description_ar", editingProduct.description_ar || "");
    formData.append("image_url", editingProduct.image_url || "");
    formData.append("image_url_2", editingProduct.image_url_2 || "");
    formData.append("image_url_3", editingProduct.image_url_3 || "");
    if (editProductImage) formData.append("image", editProductImage);
    if (editProductImage2) formData.append("image2", editProductImage2);
    if (editProductImage3) formData.append("image3", editProductImage3);

    const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
  method: "PUT",
  headers: getAdminHeaders(),
  body: formData
});

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (response.ok) {
      showToastMessage("Product updated ✨", "success");
      setShowEditPopup(false);
      setEditingProduct(null);
      fetchProducts();
    } else {
      showToastMessage(data.details || data.error || "Update failed ❌", "error");
    }
  } catch (err) {
    showToastMessage("Error updating product ❌", "error");
  }
};

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteProductRequest(productId);

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Product deleted successfully 🗑️", "success");
        fetchProducts();
      } else {
        showToastMessage(data.error || "Failed to delete product.", "error");
      }
    } catch (error) {
      showToastMessage("Error deleting product.", "error");
    }
  };

  const validateCheckoutForm = () => {
    const errors = {};
    const normalizedPhone = customerInfo.phone.replace(/\D/g, "");

    if (!customerInfo.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!customerInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^05\d{8}$/.test(normalizedPhone)) {
      errors.phone = "Phone number must start with 05 and contain 10 digits";
    }

    if (!customerInfo.city.trim()) {
      errors.city = "City is required";
    }

    if (!customerInfo.address.trim()) {
      errors.address = "Address is required";
    }

    setCheckoutErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (isSubmittingOrder) return;

    if (cart.length === 0) {
      showToastMessage("Your cart is empty.", "error");
      return;
    }

    if (!validateCheckoutForm()) {
      showToastMessage("Please check the highlighted fields.", "error");
      return;
    }

    try {
      setIsSubmittingOrder(true);

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
         headers: {
    "Content-Type": "application/json"
  },
        body: JSON.stringify({
          customerInfo,
          cart,
          totalPrice
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Order placed successfully!", "success");

        setCart([]);
        setCustomerInfo({
          fullName: "",
          phone: "",
          city: "",
          address: "",
          notes: ""
        });
        setLastOrderId(data.orderId || null);
        setShowOrderSuccess(true);
        setShowCheckout(false);
        setShowCart(false);
        fetchProducts();
        fetchOrders();
      } else {
        showToastMessage(data.error || "Failed to place order.", "error");
      }
    } catch (error) {
      showToastMessage(
        "Something went wrong while sending the order.",
        "error"
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: getAdminJsonHeaders(),
      body: JSON.stringify({
        status: newStatus
      })
    });

    const data = await response.json();

    if (response.ok) {
      showToastMessage("Order status updated successfully!", "success");
      fetchOrders();
      fetchProducts();
    } else {
      showToastMessage(
        data.error || "Failed to update order status.",
        "error"
      );
    }
  } catch (error) {
    showToastMessage(
      "Something went wrong while updating the order status.",
      "error"
    );
  }
};
const deleteOrder = async (orderId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      showToastMessage("Order deleted successfully 🗑️", "success");
      fetchOrders();
      fetchProducts();
    } else {
      showToastMessage(data.error || "Failed to delete order", "error");
    }
  } catch (error) {
    showToastMessage("Error deleting order", "error");
  }
};

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToastMessage("Copied to clipboard ✅", "success");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortOrder("default");
    showToastMessage("Filters cleared", "success");
  };

  const toggleFavorite = (product) => {
    const isAlreadyFavorite = favorites.some((item) => item.id === product.id);

    let updatedFavorites;

    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter((item) => item.id !== product.id);
      showToastMessage(`${product.name} removed from favorites`, "error");
    } else {
      updatedFavorites = [...favorites, product];
      showToastMessage(`${product.name} added to favorites ❤️`, "success");
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("eloria_favorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  const handleShopNow = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setSortOrder("default");
    setPage("shop");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage("shop");
    setTimeout(() => {
      const productsSection = document.getElementById("products-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 80);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const filteredOrders = orders.filter((order) => {
    if (adminStatusFilter === "all") return true;
    return order.status === adminStatusFilter;
  });

  const uniqueProducts = useMemo(() => getRepresentativeProducts(products), [products]);

  const filteredProducts = uniqueProducts
    .filter((product) => {
      const productSearchText = `${product.name || ""} ${product.name_ar || ""}`.toLowerCase();
      const matchesSearch = productSearchText.includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        String(product.category_id) === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "low-to-high") {
        return a.price - b.price;
      }
      if (sortOrder === "high-to-low") {
        return b.price - a.price;
      }
      return 0;
    });

 const latestProducts = useMemo(() => {
  const newProducts = uniqueProducts.filter(
    (product) => Number(product.is_new) === 1
  );

  const regularProducts = uniqueProducts.filter(
    (product) => Number(product.is_new) !== 1
  );

  return [...newProducts, ...regularProducts].slice(0, 4);
}, [uniqueProducts]);
  const softBeautyPicks = useMemo(() => {
    const picks = uniqueProducts.slice(4, 8);
    return picks.length > 0 ? picks : uniqueProducts.slice(0, 4);
  }, [uniqueProducts]);
  const finalHomeProducts = useMemo(() => {
    const picks = uniqueProducts.slice(8, 12);
    return picks.length > 0 ? picks : uniqueProducts.slice(0, 4);
  }, [uniqueProducts]);

  const filteredAdminProducts = products.filter((product) => {
    const adminProductSearchText = `${product.name || ""} ${product.name_ar || ""}`.toLowerCase();
    const matchesSearch = adminProductSearchText.includes(adminProductSearch.toLowerCase());

    const matchesStock =
      adminStockFilter === "all" ||
      (adminStockFilter === "low" && product.stock > 0 && product.stock <= 3) ||
      (adminStockFilter === "out" && product.stock === 0) ||
      (adminStockFilter === "available" && product.stock > 3);

    return matchesSearch && matchesStock;
  });

  const totalProductsCount = products.length;
  const lowStockProductsCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 3
  ).length;
  const outOfStockProductsCount = products.filter(
    (product) => product.stock === 0
  ).length;


const isNewProduct = (product) => {
  return Number(product?.is_new) === 1;
};

const renderProductSkeletons = () => {
  return Array.from({ length: 8 }).map((_, index) => (
    <div className="product-card product-skeleton-card" key={index}>
      <div className="skeleton-image"></div>
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-price"></div>
      <div className="skeleton-button"></div>
    </div>
  ));
};
const renderStoreProductCard = (product) => {
  return (
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
  isNewProduct={isNewProduct(product)}
/>
  );
};

const renderProductDetails = () => {
  return (
    <ProductDetails
  selectedProduct={selectedProduct}
  selectedImage={selectedImage}
  setSelectedProduct={setSelectedProduct}
  setSelectedImage={setSelectedImage}
  setPage={setPage}
  uniqueProducts={uniqueProducts}
  products={products}
  API_URL={API_URL}
  getCategoryName={getCategoryName}
  addToCart={addToCart}
  isFavorite={isFavorite}
  toggleFavorite={toggleFavorite}
  hoveredVariantByProductId={hoveredVariantByProductId}
  setHoveredVariantByProductId={setHoveredVariantByProductId}
  isNewProduct={isNewProduct}
  t={t}
  language={language}
/>
  );
};


  const normalizedCheckoutPhone = customerInfo.phone.replace(/\D/g, "");
  const isCheckoutValid =
    cart.length > 0 &&
    customerInfo.fullName.trim() &&
    /^05\d{8}$/.test(normalizedCheckoutPhone) &&
    customerInfo.city.trim() &&
    customerInfo.address.trim();

  const startDrag = (e) => {
    const slider = e.currentTarget;
    navIsDraggingRef.current = true;
    slider.classList.add("dragging");

    navStartXRef.current = e.pageX - slider.offsetLeft;
    navScrollLeftRef.current = slider.scrollLeft;
  };

  const onDrag = (e) => {
    if (!navIsDraggingRef.current) return;

    const slider = e.currentTarget;
    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - navStartXRef.current) * 1.5;

    slider.scrollLeft = navScrollLeftRef.current - walk;
  };

  const stopDrag = (e) => {
    navIsDraggingRef.current = false;

    if (e?.currentTarget) {
      e.currentTarget.classList.remove("dragging");
    }
  };

  if (isAdmin) {
    return (
      <div className="admin-dashboard-layout">
       <AdminSidebar
  adminView={adminView}
  setAdminView={setAdminView}
  handleAdminLogout={handleAdminLogout}
/>
        <main className="admin-main">
          <div className="admin-main-header">
            <h2>
              {adminView === "dashboard" && "Admin Dashboard"}
              {adminView === "orders" && "Orders Management"}
              {adminView === "products" && "Products Management"}
              {adminView === "categories" && "Categories Management"}
              {adminView === "add-product" && "Add New Product"}
            </h2>
          </div>

{adminView === "dashboard" && (
  <AdminDashboardCards
    totalOrders={totalOrders}
    pendingOrders={pendingOrders}
    deliveredOrders={deliveredOrders}
    totalProductsCount={totalProductsCount}
    lowStockProductsCount={lowStockProductsCount}
    outOfStockProductsCount={outOfStockProductsCount}
  />
)}    
     {adminView === "orders" && (
  <AdminOrders
    filteredOrders={filteredOrders}
    adminStatusFilter={adminStatusFilter}
    setAdminStatusFilter={setAdminStatusFilter}
    deleteOrder={deleteOrder}
    updateOrderStatus={updateOrderStatus}
    copyToClipboard={copyToClipboard}
  />
)}
{adminView === "products" && (
  <AdminProducts
    filteredAdminProducts={filteredAdminProducts}
    adminProductSearch={adminProductSearch}
    setAdminProductSearch={setAdminProductSearch}
    adminStockFilter={adminStockFilter}
    setAdminStockFilter={setAdminStockFilter}
    totalProductsCount={totalProductsCount}
    lowStockProductsCount={lowStockProductsCount}
    outOfStockProductsCount={outOfStockProductsCount}
    getCategoryName={getCategoryName}
    handleEditProduct={handleEditProduct}
    deleteProduct={deleteProduct}
    API_URL={API_URL}
  />
)}    
     {adminView === "categories" && (
  <AdminCategories
  categories={categories}
  products={products}
  newCategoryName={newCategoryName}
  setNewCategoryName={setNewCategoryName}
  newCategoryNameAr={newCategoryNameAr}
  setNewCategoryNameAr={setNewCategoryNameAr}
  editingCategory={editingCategory}
  setEditingCategory={setEditingCategory}
  handleAddCategory={handleAddCategory}
  handleUpdateCategory={handleUpdateCategory}
  handleDeleteCategory={handleDeleteCategory}
/>
)}
         {adminView === "add-product" && (
  <AddProductForm
    newProduct={newProduct}
    handleNewProductChange={handleNewProductChange}
    categories={categories}
    handleImagePreview={handleImagePreview}
    previewImages={previewImages}
    handleAddProduct={handleAddProduct}
  />
)}
        </main>

       <EditProductPopup
  showEditPopup={showEditPopup}
  setShowEditPopup={setShowEditPopup}
  editingProduct={editingProduct}
  handleEditChange={handleEditChange}
  categories={categories}
  setEditProductImage={setEditProductImage}
  setEditProductImage2={setEditProductImage2}
  setEditProductImage3={setEditProductImage3}
  previewImages={previewImages}
  setPreviewImages={setPreviewImages}
  handleUpdateProduct={handleUpdateProduct}
  API_URL={API_URL}
/>
  

        {toast.show && (
          <div className={`toast-message toast-${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    );
  
  }

  return (
    <div className={`app ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
      <Navbar
      language={language}
        isArabic={isArabic}
        categories={categories}
        selectedCategory={selectedCategory}
        favoritesCount={favorites.length}
        totalItems={totalItems}
        setPage={setPage}
        setSelectedCategory={setSelectedCategory}
        // handleHiddenAdminEntry={handleHiddenAdminEntry}
        handleShopNow={handleShopNow}
        handleCategorySelect={handleCategorySelect}
        setShowFavorites={setShowFavorites}
        setShowCart={setShowCart}
        setLanguage={setLanguage}
        startDrag={startDrag}
        onDrag={onDrag}
        stopDrag={stopDrag}
      />

      {page === "home" ? (
        <>
          <section className="hero-video-section">
            <video className="hero-video" autoPlay muted loop playsInline>
              <source src={heroVideo} type="video/mp4" />
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-content">
              <p className="hero-badge">{t[language].heroBadge}</p>
              <h1>{t[language].heroTitle}</h1>
              <p className="hero-description">{t[language].heroDescription}</p>

              <button className="hero-shop-btn" onClick={handleShopNow}>
                {t[language].shopNow}
              </button>
            </div>
          </section>

          <section className="home-product-strip">
            <div className="home-strip-header">
              <p className="section-tag">{t[language].newArrivalsTag}</p>
              <h2>{t[language].freshBeautyPicks}</h2>
              <button className="view-all-btn" onClick={handleShopNow}>
                {t[language].viewAllProducts}
              </button>
            </div>

            <div className="home-products-row">
              {latestProducts.map((product) => renderStoreProductCard(product))}
            </div>
          </section>

          <section className="who-we-are-section">
            <div className="who-we-are-container">
              <div className="who-we-are-text">
                <p className="section-tag">{t[language].whoTag}</p>
                <h2>{t[language].whoTitle}</h2>
                <p className="who-we-are-description">{t[language].whoP1}</p>
                <p className="who-we-are-description">{t[language].whoP2}</p>
              </div>

              <div className="who-we-are-logo-box">
                <img src={eloriaLogo} alt="ELORIA logo" className="who-we-are-logo" />
                <p className="who-we-are-year">{t[language].founded}</p>
              </div>
            </div>
          </section>

          <section className="home-product-strip home-product-strip-alt">
            <div className="home-strip-header">
              <p className="section-tag">{t[language].softBeautyPicksTag}</p>
              <h2>{t[language].everydayGlow}</h2>
              <button className="view-all-btn" onClick={handleShopNow}>
                {t[language].shopCollection}
              </button>
            </div>

            <div className="home-products-row">
              {softBeautyPicks.map((product) => renderStoreProductCard(product))}
            </div>
          </section>

          <section className="instagram-section">
            <div className="instagram-box">
              <p className="section-tag">{t[language].connectTag}</p>
              <h2>{t[language].instagramTitle}</h2>
              <p>{t[language].instagramText}</p>

              <a
                href="https://instagram.com/theeloriaglow"
                target="_blank"
                rel="noreferrer"
                className="instagram-link-btn"
              >
                @theeloriaglow
              </a>
            </div>
          </section>

          <section className="home-product-strip">
            <div className="home-strip-header">
              <p className="section-tag">{t[language].youMayAlsoLoveTag}</p>
              <h2>{t[language].moreFavorites}</h2>
              <button className="view-all-btn" onClick={handleShopNow}>
                {t[language].continueShopping}
              </button>
            </div>

            <div className="home-products-row">
              {finalHomeProducts.map((product) => renderStoreProductCard(product))}
            </div>
          </section>

          <div className="final-brand-message">
            <h3>{t[language].finalTitle}</h3>
            <p>{t[language].finalText}</p>
          </div>
        </>
      ) : page === "product" && selectedProduct ? (
        renderProductDetails()
      ) : (
        <main className="shop-page">
          <section className="shop-hero">
            <p className="section-tag">{t[language].shopHeroTag}</p>
            <h1>{t[language].shopHeroTitle}</h1>
            <p>{t[language].shopHeroText}</p>
          </section>

          <div className="search-box shop-search-box">
            <input
              type="text"
              placeholder={t[language].searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sort-box">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">{t[language].sortDefault}</option>
              <option value="low-to-high">{t[language].lowToHigh}</option>
              <option value="high-to-low">{t[language].highToLow}</option>
            </select>
          </div>

          <div className="clear-filters-box">
            <button
              className="clear-filters-btn"
              onClick={() => {
                clearFilters();
                setPage("shop");
              }}
            >
              {t[language].clearFilters}
            </button>
          </div>

          <div id="products-section" className="shop-products-anchor">
            <p className="products-count">
              {isArabic
                ? `عرض ${filteredProducts.length} منتجات`
                : `Showing ${filteredProducts.length} products`}
            </p>
          </div>

          <div className="products-container">
           {loading ? (
  renderProductSkeletons()
) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => renderStoreProductCard(product))
            ) : (
              <p className="no-products-message">{t[language].noProducts}</p>
            )}
          </div>
        </main>
      )}

      <FavoritesPopup
      language={language}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        favorites={favorites}
        addToCart={addToCart}
        toggleFavorite={toggleFavorite}
        API_URL={API_URL}
      />

      <CartDrawer
        showCart={showCart}
        setShowCart={setShowCart}
        setShowCheckout={setShowCheckout}
        cart={cart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        handleShopNow={handleShopNow}
        API_URL={API_URL}
        t={t}
        language={language}
      />

      <CheckoutPopup
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        customerInfo={customerInfo}
        checkoutErrors={checkoutErrors}
        handleInputChange={handleInputChange}
        cart={cart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        handlePlaceOrder={handlePlaceOrder}
        isCheckoutValid={isCheckoutValid}
        isSubmittingOrder={isSubmittingOrder}
        API_URL={API_URL}
        t={t}
        language={language}
      />

      <OrderSuccessPopup
        showOrderSuccess={showOrderSuccess}
        setShowOrderSuccess={setShowOrderSuccess}
        lastOrderId={lastOrderId}
        handleShopNow={handleShopNow}
      />

      {toast.show && (
        <div className={`toast-message toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <footer className="site-footer eloria-footer">
  <div className="footer-brand">
    <h3>ELORIA</h3>
    <p>{t[language].footer}</p>
  </div>

  <div className="footer-links">
    <button onClick={() => setPage("home")}>
      {language === "ar" ? "الرئيسية" : "Home"}
    </button>

    <button onClick={handleShopNow}>
      {language === "ar" ? "تسوّقي" : "Shop"}
    </button>

    <a
      href="https://instagram.com/theeloriaglow"
      target="_blank"
      rel="noreferrer"
    >
      Instagram
    </a>
  </div>

  <p className="footer-note">
    {language === "ar"
      ? "الدفع عند الاستلام • توصيل داخل البلاد"
      : "Cash on delivery • Local delivery"}
  </p>
</footer>
    </div>
  );
}
export default App;

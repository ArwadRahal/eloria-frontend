import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import defaultProductImage from "./images/default-product.png";
import heroVideo from "./videos/hero-video.mp4";
import eloriaLogo from "./images/eloria-logo.png";

function App() {
  const API_URL =
    process.env.REACT_APP_API_URL || "https://eloria-backend.onrender.com";
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef(null);

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

const isArabic = language === "ar";
const getImageUrl = (url, width = 900) => {
  if (!url) return defaultProductImage;

  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }

  let finalUrl = url;

  if (finalUrl.startsWith("http://")) {
    finalUrl = finalUrl.replace("http://", "https://");
  }

  if (finalUrl.startsWith("/uploads/")) {
    return `${API_URL}${finalUrl}`;
  }

  if (
    finalUrl.includes("res.cloudinary.com") &&
    finalUrl.includes("/image/upload/") &&
    !finalUrl.includes("/f_auto,")
  ) {
    return finalUrl.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,w_${width}/`
    );
  }

  return finalUrl;
};

const getProductImages = (product) => {
  const images = [
    product?.image_url,
    product?.image_url_2,
    product?.image_url_3
  ]
    .filter(Boolean)
    .map(getImageUrl);

  return images.length > 0 ? images : [defaultProductImage];
};

const getBaseProductName = (name = "") => {
  return name
    .replace(/\s+[–—-]\s+[^–—-]+$/, "")
    .trim()
    .toLowerCase();
};

const getDisplayProductName = (name = "") => {
  return name.replace(/\s+[–—-]\s+[^–—-]+$/, "").trim();
};

const getShadeName = (name = "") => {
  const parts = name.split(/\s+[–—-]\s+/);
  return parts.length > 1 ? parts[parts.length - 1].trim() : "";
};

const getProductVariants = (product) => {
  if (!product?.name) return [];

  const baseName = getBaseProductName(product.name);

  return products.filter(
    (item) =>
      item.id !== product.id &&
      String(item.category_id) === String(product.category_id) &&
      getBaseProductName(item.name) === baseName
  );
};

const getAllProductVariants = (product) => {
  if (!product?.name) return [];

  const variants = [product, ...getProductVariants(product)];

  return variants.sort((a, b) => a.name.localeCompare(b.name));
};

const getProductGroupKey = (product) => {
  return `${product?.category_id || ""}-${getBaseProductName(product?.name || "")}`;
};

const getRepresentativeProducts = (items = []) => {
  const seenGroups = new Set();

  return items.filter((product) => {
    const groupKey = getProductGroupKey(product);

    if (seenGroups.has(groupKey)) return false;

    seenGroups.add(groupKey);
    return true;
  });
};

const [previewImages, setPreviewImages] = useState({
  image: null,
  image2: null,
  image3: null
});

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
    footer: "ELORIA © 2026 — Beauty with a soft elegant touch ✨"
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
    footer: "ELORIA © 2026 — جمال ناعم بلمسة أنيقة ✨"
  }
};
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "1",
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

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setCategories([]);
    }
  };

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      showToastMessage("Please enter a category name.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: trimmedName })
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Category added successfully ✨", "success");
        setNewCategoryName("");
        fetchCategories();
      } else {
        showToastMessage(data.error || "Failed to add category.", "error");
      }
    } catch (err) {
      console.log(err);
      showToastMessage("Error adding category.", "error");
    }
  };

  const handleDeleteCategory = async (category) => {
    const productsInCategory = products.filter(
      (product) => String(product.category_id) === String(category.id)
    );

    if (productsInCategory.length > 0) {
      showToastMessage(
        `Cannot delete ${category.name}. It has ${productsInCategory.length} products.`,
        "error"
      );
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${category.name}"?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/categories/${category.id}`, {
        method: "DELETE"
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
      console.log(err);
      showToastMessage("Error deleting category.", "error");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders-with-items`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCategories();
  }, []);

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
  }, []);

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

  const handleHiddenAdminEntry = () => {
    logoClickCountRef.current += 1;

    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }

    logoClickTimerRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 1500);

    if (logoClickCountRef.current >= 5) {
      logoClickCountRef.current = 0;
      const password = prompt("Enter admin password:");

      if (password === null) return;

      if (password === "eloria-admin") {
        setIsAdmin(true);
        setAdminView("dashboard");
        showToastMessage("Admin mode activated 🔐", "success");
      } else {
        showToastMessage("Wrong password ❌", "error");
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminView("dashboard");
    setShowEditPopup(false);
    setEditingProduct(null);
    showToastMessage("Logged out from admin", "success");
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      if (existingProduct.quantity >= product.stock) {
        showToastMessage("No more stock available ⚠️", "error");
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
        showToastMessage(`${product.name} added to cart 🛒`, "success");
      }
    }
  };

  const removeFromCart = (productId) => {
    const removedItem = cart.find((item) => item.id === productId);
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);

    if (removedItem) {
      showToastMessage(`${removedItem.name} removed from cart`, "error");
    }
  };

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
          showToastMessage("No more stock available ⚠️", "error");
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
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: value
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      category_id: String(product.category_id || "1"),
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
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("category_id", newProduct.category_id);

      if (newProductImage) formData.append("image", newProductImage);
      if (newProductImage2) formData.append("image2", newProductImage2);
      if (newProductImage3) formData.append("image3", newProductImage3);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Product added successfully ✨", "success");

        setNewProduct({
          name: "",
          price: "",
          stock: "",
          category_id: "1",
          image_url: "",
          image_url_2: "",
          image_url_3: ""
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
      console.log(error);
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
    formData.append("price", editingProduct.price);
    formData.append("stock", editingProduct.stock);
    formData.append("category_id", editingProduct.category_id);

    formData.append("image_url", editingProduct.image_url || "");
    formData.append("image_url_2", editingProduct.image_url_2 || "");
    formData.append("image_url_3", editingProduct.image_url_3 || "");

    if (editProductImage) formData.append("image", editProductImage);
    if (editProductImage2) formData.append("image2", editProductImage2);
    if (editProductImage3) formData.append("image3", editProductImage3);

    const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
      method: "PUT",
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
      console.log("Update error details:", data);
      showToastMessage(data.details || data.error || "Update failed ❌", "error");
    }
  } catch (err) {
    console.log(err);
    showToastMessage("Error updating product ❌", "error");
  }
};

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Product deleted successfully 🗑️", "success");
        fetchProducts();
      } else {
        showToastMessage(data.error || "Failed to delete product.", "error");
      }
    } catch (error) {
      console.log(error);
      showToastMessage("Error deleting product.", "error");
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToastMessage("Your cart is empty.", "error");
      return;
    }

    const normalizedPhone = customerInfo.phone.replace(/\D/g, "");

    if (
      !customerInfo.fullName.trim() ||
      !customerInfo.phone.trim() ||
      !customerInfo.city.trim() ||
      !customerInfo.address.trim()
    ) {
      showToastMessage("Please fill in all required fields.", "error");
      return;
    }

    if (normalizedPhone.length < 7) {
      showToastMessage("Please enter a valid phone number.", "error");
      return;
    }

    try {
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
        setShowCheckout(false);
        fetchProducts();
        fetchOrders();
      } else {
        showToastMessage(data.error || "Failed to place order.", "error");
      }
    } catch (error) {
      console.log("Error sending order:", error);
      showToastMessage(
        "Something went wrong while sending the order.",
        "error"
      );
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
    "Content-Type": "application/json"
  },
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
      console.log("Error updating order status:", error);
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
        method: "DELETE"
      });

      if (response.ok) {
        showToastMessage("Order deleted successfully 🗑️", "success");
        fetchOrders();
        fetchProducts();
      } else {
        showToastMessage("Failed to delete order", "error");
      }
    } catch (error) {
      console.log(error);
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
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

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

  const latestProducts = useMemo(() => uniqueProducts.slice(0, 4), [uniqueProducts]);
  const softBeautyPicks = useMemo(() => {
    const picks = uniqueProducts.slice(4, 8);
    return picks.length > 0 ? picks : uniqueProducts.slice(0, 4);
  }, [uniqueProducts]);
  const finalHomeProducts = useMemo(() => {
    const picks = uniqueProducts.slice(8, 12);
    return picks.length > 0 ? picks : uniqueProducts.slice(0, 4);
  }, [uniqueProducts]);

  const filteredAdminProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(adminProductSearch.toLowerCase());

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

  const renderAdminDashboardCards = () => {
    return (
      <div className="admin-home-grid">
        <div className="admin-home-card">
          <h3>{totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="admin-home-card">
          <h3>{pendingOrders}</h3>
          <p>Pending Orders</p>
        </div>
        <div className="admin-home-card">
          <h3>{deliveredOrders}</h3>
          <p>Delivered Orders</p>
        </div>
        <div className="admin-home-card">
          <h3>{totalProductsCount}</h3>
          <p>Total Products</p>
        </div>
        <div className="admin-home-card">
          <h3>{lowStockProductsCount}</h3>
          <p>Low Stock</p>
        </div>
        <div className="admin-home-card">
          <h3>{outOfStockProductsCount}</h3>
          <p>Out of Stock</p>
        </div>
      </div>
    );
  };

  const renderAdminOrders = () => {
    return (
      <>
        <div className="admin-filter-box">
          <button
            className={adminStatusFilter === "all" ? "active-admin-filter" : ""}
            onClick={() => setAdminStatusFilter("all")}
          >
            All
          </button>

          <button
            className={
              adminStatusFilter === "pending" ? "active-admin-filter" : ""
            }
            onClick={() => setAdminStatusFilter("pending")}
          >
            Pending
          </button>

          <button
            className={
              adminStatusFilter === "delivered" ? "active-admin-filter" : ""
            }
            onClick={() => setAdminStatusFilter("delivered")}
          >
            Delivered
          </button>

          <button
            className={
              adminStatusFilter === "cancelled" ? "active-admin-filter" : ""
            }
            onClick={() => setAdminStatusFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>

        <div className="admin-orders-wrapper">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`admin-order-card status-card-${order.status}`}
              >
                <h3>Order #{order.id}</h3>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>

                <div className="customer-info-box">
                  <p>
                    <strong>Name:</strong> {order.customer_name}
                  </p>

                  <p>
                    <strong>Phone:</strong> {order.phone}{" "}
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(order.phone)}
                    >
                      Copy
                    </button>
                  </p>

                  <p>
                    <strong>City:</strong> {order.city}
                  </p>

                  <p>
                    <strong>Address:</strong> {order.address}{" "}
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(order.address)}
                    >
                      Copy
                    </button>
                  </p>

                  <button
                    className="copy-order-details-btn"
                    onClick={() =>
                      copyToClipboard(
                        `${order.customer_name} - ${order.city} - ${order.address} - ${order.phone}`
                      )
                    }
                  >
                    Copy Full Delivery Info
                  </button>
                </div>

                <p>
                  <strong>Total:</strong> {order.total_price} ₪
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </p>

                <div style={{ marginTop: "10px" }}>
                  <strong>Items:</strong>
                  {order.items &&
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        style={{ marginTop: "6px", paddingLeft: "10px" }}
                      >
                        <p style={{ margin: "4px 0" }}>
                          - {item.product_name} | Qty: {item.quantity} | Price:{" "}
                          {item.price} ₪
                        </p>
                      </div>
                    ))}
                </div>

                <div className="admin-order-actions">
                  <button
                    onClick={() => deleteOrder(order.id)}
                    style={{ background: "#fde8e8", color: "#d9534f" }}
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => updateOrderStatus(order.id, "delivered")}
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() => updateOrderStatus(order.id, "cancelled")}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-admin-orders-message">
              No orders in this category yet.
            </p>
          )}
        </div>
      </>
    );
  };

  const renderAdminProducts = () => {
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
                          src={getImageUrl(product.image_url)}
                          alt={product.name}
                          className="admin-table-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultProductImage;
                          }}
                        />
                      </td>

                      <td className="product-name-cell">{product.name}</td>
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
                          <button
                            className="edit-btn"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="no-products-row">
                    No matching products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

 const renderAdminCategories = () => {
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
};

 const renderAddProduct = () => {
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
};

  const renderStoreProductCard = (product) => {
    const variantProducts = getAllProductVariants(product);
    const hoveredVariantId = hoveredVariantByProductId[product.id];
    const previewProduct =
      variantProducts.find(
        (variant) => String(variant.id) === String(hoveredVariantId)
      ) || product;

    return (
      <div
        key={product.id}
        className="product-card"
        onMouseLeave={() => {
          setHoveredVariantByProductId((prev) => ({
            ...prev,
            [product.id]: null
          }));
        }}
        onClick={() => {
          setSelectedProduct(previewProduct);
          setSelectedImage(getProductImages(previewProduct)[0]);
          setPage("product");
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 50);
        }}
      >
        <button
          className={`favorite-btn ${
            isFavorite(previewProduct.id) ? "active-favorite" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(previewProduct);
          }}
        >
          {isFavorite(previewProduct.id) ? "❤" : "♡"}
        </button>

        <div className="product-image-wrap">
          <img
            src={getImageUrl(previewProduct.image_url, 700)}
            alt={previewProduct.name}
            className="product-image"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultProductImage;
            }}
          />
        </div>

        <div className="product-card-body">
          <h3>{getDisplayProductName(product.name)}</h3>

          {variantProducts.length > 1 && (
            <div className="product-variants-preview">
              <div className="variant-dots">
                {variantProducts.slice(0, 6).map((variant) => (
                  <button
                    key={variant.id}
                    className={`variant-dot ${
                      variant.id === previewProduct.id ? "active-variant-dot" : ""
                    }`}
                    title={getShadeName(variant.name) || variant.name}
                    onMouseEnter={() => {
                      setHoveredVariantByProductId((prev) => ({
                        ...prev,
                        [product.id]: variant.id
                      }));
                    }}
                    onFocus={() => {
                      setHoveredVariantByProductId((prev) => ({
                        ...prev,
                        [product.id]: variant.id
                      }));
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(variant);
                      setSelectedImage(getProductImages(variant)[0]);
                      setPage("product");
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }, 50);
                    }}
                  >
                    <img
                      src={getImageUrl(variant.image_url, 120)}
                      alt={variant.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultProductImage;
                      }}
                    />
                  </button>
                ))}
              </div>

              <span className="variants-count">
                {variantProducts.length} shades available
              </span>
            </div>
          )}

          {getShadeName(previewProduct.name) && (
            <p className="card-shade-name">{getShadeName(previewProduct.name)}</p>
          )}

          <p className="product-price">{previewProduct.price} ₪</p>

          {previewProduct.stock === 0 && (
            <span className="product-out-badge">{t[language].outOfStock}</span>
          )}

          <button
            className="add-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(previewProduct);
            }}
            disabled={previewProduct.stock === 0}
          >
            {previewProduct.stock === 0 ? t[language].outOfStock : t[language].addToCart}
          </button>
        </div>
      </div>
    );
  };


  const renderProductDetails = () => {
    if (!selectedProduct) return null;

    const galleryImages = getProductImages(selectedProduct);
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
               src={getImageUrl(galleryImages[safeImageIndex], 1000)}
                alt={selectedProduct.name}
                className="product-details-main-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultProductImage;
                }}
              />

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
                    src={getImageUrl(image, 160)}
                    alt={`${selectedProduct.name} ${index + 1}`}
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

            {getAllProductVariants(selectedProduct).length > 1 && (
              <div className="details-variants-box">
                <p>Choose shade</p>

                <div className="details-variant-list">
                  {getAllProductVariants(selectedProduct).map((variant) => (
                    <button
                      key={variant.id}
                      className={`details-variant-btn ${
                        variant.id === selectedProduct.id ? "active-details-variant" : ""
                      }`}
                      onClick={() => {
                        setSelectedProduct(variant);
                        setSelectedImage(getProductImages(variant)[0]);
                      }}
                    >
                      <img
                        src={getImageUrl(variant.image_url, 120)}
                        alt={variant.name}
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
            {productsToShow.map((product) => renderStoreProductCard(product))}
          </div>
        </section>
      </main>
    );
  };


  const normalizedCheckoutPhone = customerInfo.phone.replace(/\D/g, "");
  const isCheckoutValid =
    cart.length > 0 &&
    customerInfo.fullName.trim() &&
    normalizedCheckoutPhone.length >= 7 &&
    customerInfo.city.trim() &&
    customerInfo.address.trim();

  if (isAdmin) {
    return (
      <div className="admin-dashboard-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">ELORIA Admin</div>

          <button
            className={
              adminView === "dashboard" ? "sidebar-link active" : "sidebar-link"
            }
            onClick={() => setAdminView("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={
              adminView === "orders" ? "sidebar-link active" : "sidebar-link"
            }
            onClick={() => setAdminView("orders")}
          >
            Orders
          </button>

          <button
            className={
              adminView === "products" ? "sidebar-link active" : "sidebar-link"
            }
            onClick={() => setAdminView("products")}
          >
            Products
          </button>

          <button
            className={
              adminView === "categories" ? "sidebar-link active" : "sidebar-link"
            }
            onClick={() => setAdminView("categories")}
          >
            Categories
          </button>

          <button
            className={
              adminView === "add-product"
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={() => setAdminView("add-product")}
          >
            Add Product
          </button>

          <button className="sidebar-link logout" onClick={handleAdminLogout}>
            Logout
          </button>
        </aside>

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

          {adminView === "dashboard" && renderAdminDashboardCards()}
          {adminView === "orders" && renderAdminOrders()}
          {adminView === "products" && renderAdminProducts()}
          {adminView === "categories" && renderAdminCategories()}
          {adminView === "add-product" && renderAddProduct()}
        </main>

        {showEditPopup && editingProduct && (
  <div
    className="edit-popup-overlay"
    onClick={() => setShowEditPopup(false)}
  >
    <div className="edit-popup-box" onClick={(e) => e.stopPropagation()}>
      <button
        className="close-product-btn"
        onClick={() => setShowEditPopup(false)}
      >
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
            src={previewImages.image || getImageUrl(editingProduct.image_url)}
            alt="preview 1"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultProductImage;
            }}
          />
        )}

        {(previewImages.image2 || editingProduct.image_url_2) && (
          <img
            src={previewImages.image2 || getImageUrl(editingProduct.image_url_2)}
            alt="preview 2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultProductImage;
            }}
          />
        )}

        {(previewImages.image3 || editingProduct.image_url_3) && (
          <img
            src={previewImages.image3 || getImageUrl(editingProduct.image_url_3)}
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
)}

        {toast.show && (
          <div className={`toast-message toast-${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    );
  }
let isDown = false;
let startX;
let scrollLeft;

const startDrag = (e) => {
  const slider = e.currentTarget;
  isDown = true;
  slider.classList.add("dragging");

  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
};

const onDrag = (e) => {
  if (!isDown) return;

  const slider = e.currentTarget;
  e.preventDefault();

  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.5;

  slider.scrollLeft = scrollLeft - walk;
};

const stopDrag = () => {
  isDown = false;
};
  return (
    <div className={`app ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
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
>          <div className="nav-marquee">
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
            ♡ {favorites.length}
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
              <p className="section-tag">NEW ARRIVALS</p>
              <h2>Fresh beauty picks</h2>
              <button className="view-all-btn" onClick={handleShopNow}>View all products</button>
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
              <p className="section-tag">SOFT BEAUTY PICKS</p>
              <h2>Made for your everyday glow</h2>
              <button className="view-all-btn" onClick={handleShopNow}>Shop collection</button>
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
              <p className="section-tag">YOU MAY ALSO LOVE</p>
              <h2>A few more ELORIA favorites</h2>
              <button className="view-all-btn" onClick={handleShopNow}>Continue shopping</button>
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
            <p className="section-tag">SHOP ELORIA</p>
            <h1>Explore the full collection</h1>
            <p>
              Browse all products, search by name, or choose a category from the top menu.
            </p>
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
              <div className="loader"></div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => renderStoreProductCard(product))
            ) : (
              <p className="no-products-message">{t[language].noProducts}</p>
            )}
          </div>
        </main>
      )}
      {showFavorites && (
        <div className="favorites-overlay" onClick={() => setShowFavorites(false)}>
          <div className="favorites-popup" onClick={(e) => e.stopPropagation()}>
            <div className="favorites-popup-header">
              <h2>{t[language].favorites}</h2>
              <button
                className="close-cart-btn"
                onClick={() => setShowFavorites(false)}
              >
                ✕
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="favorites-empty">
                <h3>No favorites yet</h3>
                <p>Save the products you love and come back to them anytime.</p>
              </div>
            ) : (
              <div className="favorites-grid">
                {favorites.map((item) => (
                  <div key={item.id} className="favorite-product-card">
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={item.name}
                      className="favorite-product-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultProductImage;
                      }}
                    />

                    <h4>{item.name}</h4>
                    <p className="favorite-price">{item.price} ₪</p>

                    <div className="favorite-actions">
                      <button
                        className="confirm-btn"
                        onClick={() => {
                          addToCart(item);
                          setShowFavorites(false);
                        }}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="cart-remove-btn"
                        onClick={() => toggleFavorite(item)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
            <div className="cart-popup-header">
             <h2>{t[language].cart}</h2>
              <button
                className="close-cart-btn"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="empty-cart-text">Your cart is empty.</p>
            ) : (
              <>
                <div className="cart-popup-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item-card">
                      <h4>{item.name}</h4>
                      <p>Price: {item.price} ₪</p>
                      <p>Quantity: {item.quantity}</p>

                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>

                        <button
                          className="qty-btn"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          -
                        </button>
                      </div>

                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <h3 style={{ textAlign: "center", marginTop: "20px" }}>
                  Total: {totalPrice} ₪
                </h3>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    className="confirm-btn"
                    onClick={() => {
                      setShowCheckout(true);
                      setShowCart(false);
                    }}
                  >
                    Confirm Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showCheckout && (
        <div
          className="checkout-overlay"
          onClick={() => setShowCheckout(false)}
        >
          <div className="checkout-popup premium-checkout-popup" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-popup-header">
              <div>
                <p className="checkout-step-label">Secure order details</p>
                <h2>{t[language].checkout}</h2>
              </div>

              <button
                className="close-product-btn"
                onClick={() => setShowCheckout(false)}
              >
                ✕
              </button>
            </div>

            <div className="checkout-layout-grid">
              <div className="checkout-form-fields">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={customerInfo.fullName}
                  onChange={handleInputChange}
                />

                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                />

                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={customerInfo.city}
                  onChange={handleInputChange}
                />

                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                />

                <label>Notes</label>
                <textarea
                  name="notes"
                  placeholder="Notes"
                  value={customerInfo.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="checkout-summary-card">
                <h3>Order Summary</h3>

                <div className="checkout-summary-items">
                  {cart.map((item) => (
                    <div key={item.id} className="checkout-summary-item">
                      <img
                        src={getImageUrl(item.image_url, 120)}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultProductImage;
                        }}
                      />

                      <div>
                        <strong>{getDisplayProductName(item.name)}</strong>
                        {getShadeName(item.name) && <span>{getShadeName(item.name)}</span>}
                        <p>Qty: {item.quantity} · {item.price} ₪</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout-total-row">
                  <span>Total</span>
                  <strong>{totalPrice} ₪</strong>
                </div>

                <p className="checkout-payment-note">
                  Payment method: cash on delivery.
                </p>
              </div>
            </div>

            <button
              className="submit-order-btn premium-submit-order-btn"
              onClick={handlePlaceOrder}
              disabled={!isCheckoutValid}
            >
              Place Order
            </button>
          </div>
        </div>
      )}



      {toast.show && (
        <div className={`toast-message toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <footer className="site-footer">
        <p>{t[language].footer}</p>
      </footer>
    </div>
  );
}

export default App;

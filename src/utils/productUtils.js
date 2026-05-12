export const getBaseProductName = (name = "") => {
  return name
    .replace(/\s+[–—-]\s+[^–—-]+$/, "")
    .trim()
    .toLowerCase();
};

export const getDisplayProductName = (
  product,
  language = "en"
) => {
  const productName =
    language === "ar"
      ? product?.name_ar || product?.name || ""
      : product?.name || "";

  return productName
    .replace(/\s+[–—-]\s+[^–—-]+$/, "")
    .trim();
};
export const getShadeName = (name = "") => {
  const parts = name.split(/\s+[–—-]\s+/);
  return parts.length > 1 ? parts[parts.length - 1].trim() : "";
};

export const getProductGroupKey = (product) => {
  return `${product?.category_id || ""}-${getBaseProductName(product?.name || "")}`;
};

export const getRepresentativeProducts = (items = []) => {
  const seenGroups = new Set();

  return items.filter((product) => {
    const groupKey = getProductGroupKey(product);

    if (seenGroups.has(groupKey)) return false;

    seenGroups.add(groupKey);
    return true;
  });
};

export const getProductVariants = (product, products = []) => {
  if (!product?.name) return [];

  const baseName = getBaseProductName(product.name);

  return products.filter(
    (item) =>
      item.id !== product.id &&
      String(item.category_id) === String(product.category_id) &&
      getBaseProductName(item.name) === baseName
  );
};

export const getAllProductVariants = (product, products = []) => {
  if (!product?.name) return [];

  const variants = [product, ...getProductVariants(product, products)];

  return variants.sort((a, b) => a.name.localeCompare(b.name));
};

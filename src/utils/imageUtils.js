import defaultProductImage from "../images/default-product.png";

export const getImageUrl = (url, API_URL) => {
  if (!url) return defaultProductImage;

  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }

  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  if (url.startsWith("/uploads/")) {
    return `${API_URL}${url}`;
  }

  return url;
};

export const getProductImages = (product, API_URL) => {
  const images = [
    product?.image_url,
    product?.image_url_2,
    product?.image_url_3
  ]
    .filter(Boolean)
    .map((url) => getImageUrl(url, API_URL));

  return images.length > 0 ? images : [defaultProductImage];
};

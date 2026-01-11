/* eslint-disable no-useless-escape */
import Toast from "react-native-toast-message";
import { Linking, Share } from "react-native";
import { Discount, Variation } from "@/services/types/productTypes";
import { CartItem } from "@/services/types/cartTypes";
import store from "@/store";

interface ToastOptions {
  message?: string;
  color?: string;
  background?: string;
  type?: "default" | "success" | "warning" | "error";
}

export const showToast = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: "tomatoToast",
    text1: message,
    position: "bottom",
    props: { color, background, type: type || "default" },
  });
};
export const showSuccessAlert = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: "successToast",
    text1: message,
    position: "bottom",
    props: { color, background, type: type || "default" },
  });
};
export const showWarningToast = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: "warningToast",
    text1: message,
    position: "bottom",
    props: { color, background, type: type || "default" },
  });
};
export const showErrorToast = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: "errorToast",
    text1: message,
    position: "bottom",
    props: { color, background, type: type || "default" },
  });
};
export const showAlert = ({ message, color, background, type }: ToastOptions): void => {
  Toast.show({
    type: "warningToast",
    text1: message,
    position: "bottom",
    props: { color, background, type: type || "default" },
  });
};

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  // Show first 2 characters, then mask the rest before the @
  const visible = local.slice(0, 2);
  const masked = "*".repeat(Math.max(1, local.length - 2));

  return `${visible}${masked}@${domain}`;
};

export const handleOpenLink = (url: string) => {
  Linking.openURL(url);
};

export const onShare = async (message: string) => {
  try {
    const result = await Share.share({
      message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    console.log("error.message", JSON.stringify(error.message, null, 2));
  }
};
export function getCategoryStats(categories: any[]): {
  totalCategories: number;
  totalCourses: number;
  totalSubcategories: number;
  maxLevel: number;
} {
  let totalCategories = 0;
  let totalCourses = 0;
  let totalSubcategories = 0;
  let maxLevel = 0;

  function traverse(category: any, currentLevel: number) {
    // Count the current category
    totalCategories++;

    // Add course count for the current category
    totalCourses += category.courseCount || 0;

    // Update max level if current level is higher
    if (currentLevel > maxLevel) {
      maxLevel = currentLevel;
    }

    // Count subcategories and traverse children
    if (category.children && category.children.length > 0) {
      totalSubcategories += category.children.length;
      category.children.forEach((child: any) => traverse(child, currentLevel + 1));
    }
  }

  // Traverse all top-level categories
  categories.forEach((category) => traverse(category, 0));

  return {
    totalCategories,
    totalCourses,
    totalSubcategories,
    maxLevel,
  };
}
export const buildQueryParams = (params: Record<string, any>): string => {
  const parts: string[] = [];

  for (const key in params) {
    const value = params[key];

    // Skip undefined, null, or empty string
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      // Repeat key for each array item: status=APPROVED&status=PENDING
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
        }
      });
    } else {
      // Single value
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }

  return parts.length > 0 ? `?${parts.join("&")}` : "";
};
export const calculateDiscountedPrice = (price: number, discount?: Discount) => {
  if (!discount) return { original: price, final: price, discountAmt: 0, discountLabel: "" };
  const discountAmt = discount.type === "percent" ? (price * discount.value) / 100 : discount.value;
  const final = price - discountAmt;
  const discountLabel = discount.type === "percent" ? `${discount.value}% OFF` : `$${discount.value} OFF`;
  return { original: price, final, discountAmt, discountLabel };
};

export const calculateVariationPrice = (variation: Variation) => {
  const base = variation.price;

  if (!variation.discount) return base;

  if (variation.discount.type === "percent") {
    return base - base * (variation.discount.value / 100);
  }

  if (variation.discount.type === "flat") {
    return base - variation.discount.value;
  }

  return base;
};

export const calculateItemSubtotal = (item: CartItem) => {
  // if product has multiple variations → sum all
  const priceSum = item.variations.reduce((sum, v) => {
    return sum + calculateVariationPrice(v);
  }, 0);

  return priceSum * item.quantity;
};

export const generateSimpleUniqueId = () => {
  const timestamp = Date.now().toString(36); // Convert timestamp to base 36
  const randomness = Math.random().toString(36).substring(2); // Get random part
  return `${timestamp}${randomness}`;
};

export const token = new Proxy(
  {},
  {
    get(_, prop: string | symbol) {
      const currentToken = store.getState().auth.accessToken || null;

      if (prop === Symbol.toPrimitive || prop === "valueOf") {
        return () => currentToken;
      }
      if (prop === "toString") {
        return () => currentToken || "";
      }

      return currentToken?.[prop as keyof typeof currentToken];
    },
  }
) as unknown as string | null;

/**
 * Calculate final price after discount
 * Supports discount types: "percent" | "flat"
 * @param {number} price - base price
 * @param {{type: string, value: number} | undefined | null} discount
 * @returns {{finalPrice: number, discountAmount: number, originalPrice: number}}
 */
export function calculateFinalPrice(
  price: number,
  discount: { type: string; value: number }
): { finalPrice: number; discountAmount: number; originalPrice: number } {
  const originalPrice = Number(price) || 0;

  if (!discount || !discount.type || !discount.value) {
    return {
      finalPrice: originalPrice,
      discountAmount: 0,
      originalPrice,
    };
  }

  const value = Number(discount.value) || 0;
  let discountAmount = 0;

  if (discount.type === "percent") {
    discountAmount = (originalPrice * value) / 100;
  } else if (discount.type === "flat") {
    discountAmount = value;
  }

  // discount never more than price
  discountAmount = Math.min(discountAmount, originalPrice);

  const finalPrice = Math.round(originalPrice - discountAmount);

  return {
    finalPrice,
    discountAmount: Math.round(discountAmount),
    originalPrice,
  };
}

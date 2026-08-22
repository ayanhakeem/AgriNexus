import { toast } from "react-toastify";

/**
 * Initiates a Stripe Checkout session for purchasing a crop, sapling, or fish.
 *
 * @param {string} buyerClerkId - The Clerk ID of the buyer.
 * @param {string} farmerClerkId - The Clerk ID of the farmer/seller.
 * @param {object} item - The item being purchased (crop, sapling, or fish object).
 * @param {Function} setSelectedItem - State setter to clear the selected item modal.
 * @param {string} itemType - Explicit item type: "crop" | "sapling" | "fish".
 */
async function placeOrder(buyerClerkId, farmerClerkId, item, setSelectedItem, itemType) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Auto-detect itemType if not explicitly provided (fallback for backward compatibility)
  if (!itemType) {
    if (item?.age && item?.nurseryName) {
      itemType = "sapling";
    } else if (item?.harvestDate) {
      itemType = "fish";
    } else {
      itemType = "crop";
    }
  }

  try {
    // Strip the image field before sending to backend.
    // Farmer images are stored as base64 data URIs (data:image/...;base64,...)
    // which are 100,000+ characters long. Sending them causes Stripe's SDK to
    // throw "Invalid URL: URL must be 2048 characters or less".
    // The image is only needed for display and is irrelevant at checkout time.
    const { image: _stripped, ...itemWithoutImage } = item;

    const response = await fetch(
      `${backendUrl}/api/buyer/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerClerkId,
          farmerClerkId,
          item: itemWithoutImage,
          itemType,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to initiate payment session");
    }

    const data = await response.json();
    if (data.url) {
      toast.info("Redirecting to secure Stripe payment...");
      window.location.href = data.url;
    } else {
      throw new Error("No checkout URL returned from server");
    }

    setSelectedItem(null);
  } catch (error) {
    console.error("Error initiating payment session:", error);
    toast.error(error.message || "Error initiating payment session");
    setSelectedItem(null);
    throw error;
  }
}

export default placeOrder;

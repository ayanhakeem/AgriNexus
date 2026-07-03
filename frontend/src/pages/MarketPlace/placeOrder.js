import { toast } from "react-toastify";

async function placeOrder(buyerClerkId, farmerClerkId, crop, setSelectedCrop) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  try {
    let itemType = "crop";
    if (crop?.age) {
      itemType = "sapling";
    } else if (crop?.harvestDate) {
      itemType = "fish";
    }

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
          item: crop,
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
    
    setSelectedCrop(null);
  } catch (error) {
    console.error("Error initiating payment session:", error);
    toast.error(error.message || "Error initiating payment session");
    setSelectedCrop(null);
    throw error;
  }
}

export default placeOrder;

import express from "express";
import Buyer from "../models/buyerModel.js";
import Order from "../models/orderModel.js";
import Crop from "../models/cropModel.js";
import Stripe from "stripe";

const buyerRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Add buyer (create account)
buyerRouter.post("/add", async (req, res) => {
  try {
    const { clerkId, emailId } = req.body;
    const buyer = new Buyer({ clerkId, emailId, orders: [] });
    await buyer.save();
    res.status(201).json({ message: "Buyer added successfully", buyer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Place an order (Legacy direct route)
buyerRouter.post("/:clerkId/orders/place", async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { farmerClerkId, crop, sapling, fish } = req.body;
    // crops: [{ cropId, quantity }, ...]

    const buyer = await Buyer.findOne({ clerkId });
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    // Create new order
    const order = new Order({
      buyerClerkId: clerkId,
      farmerClerkId,
      crop: crop || undefined,
      sapling: sapling || undefined,
      fish: fish || undefined,
      status: "pending",
      orderDate: new Date(),
    });
    await order.save();

    // Add order reference to buyer's orders
    buyer.orders.push(order._id);
    await buyer.save();

    // Ideally, also push order id to Farmer orders array (not shown here)

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Fetch all previous orders by that buyer
buyerRouter.get("/:clerkId/orders", async (req, res) => {
  try {
    const { clerkId } = req.params;
    console.log("clerk", clerkId);
    const orders = await Order.find({ buyerClerkId: clerkId });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// 4. Create Stripe Checkout Session
buyerRouter.post("/create-checkout-session", async (req, res) => {
  try {
    const { buyerClerkId, farmerClerkId, item, itemType } = req.body;

    // Use item.farmerClerkId as a fallback if farmerClerkId is not passed directly
    const farmerId = farmerClerkId || (item && item.farmerClerkId);

    if (!buyerClerkId || !farmerId || !item || !itemType) {
      return res.status(400).json({ error: "Missing required fields (buyerClerkId, farmerClerkId, item, or itemType)" });
    }

    const name = item.name || "Agricultural Product";
    const price = Number(item.price);
    const quantity = Number(item.quantity) || 1;
    const imageUrl = item.image || null;

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid item price" });
    }

    // Create Checkout Session
    const lineItem = {
      price_data: {
        currency: "inr",
        product_data: {
          name: `${name} (${itemType.toUpperCase()})`,
          description: `Direct purchase from farmer.`,
        },
        unit_amount: Math.round(price * 100),
      },
      quantity: quantity,
    };

    if (imageUrl) {
      lineItem.price_data.product_data.images = [imageUrl];
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [lineItem],
      mode: "payment",
      metadata: {
        buyerClerkId,
        farmerClerkId: farmerId,
        itemType,
        itemId: item._id || "",
        itemDetails: JSON.stringify({
          ...item,
          farmerClerkId: farmerId,
        }),
      },
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment-cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating stripe checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Confirm Stripe Payment and Place Order
buyerRouter.post("/orders/confirm-payment", async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Check if order already processed
    let existingOrder = await Order.findOne({ paymentId: sessionId });
    if (existingOrder) {
      return res.status(200).json({ message: "Order already processed", order: existingOrder });
    }

    // Retrieve Stripe Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    // Extract metadata
    const { buyerClerkId, farmerClerkId, itemType, itemId, itemDetails: itemDetailsStr } = session.metadata;
    const itemDetails = JSON.parse(itemDetailsStr);

    const buyer = await Buyer.findOne({ clerkId: buyerClerkId });
    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    const orderData = {
      buyerClerkId,
      farmerClerkId,
      status: "pending",
      orderDate: new Date(),
      paymentId: sessionId,
    };

    if (itemType === "crop") {
      orderData.crop = itemDetails;
    } else if (itemType === "sapling") {
      orderData.sapling = itemDetails;
    } else if (itemType === "fish") {
      orderData.fish = itemDetails;
    }

    const order = new Order(orderData);
    await order.save();

    buyer.orders.push(order._id);
    await buyer.save();

    res.status(201).json({ message: "Order placed successfully after payment", order });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: error.message });
  }
});

export { buyerRouter };

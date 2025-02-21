import express from 'express';
import paypal from '@paypal/checkout-server-sdk';
import jwt from 'jsonwebtoken';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// PayPal client configuration
const environment =
  process.env.NODE_ENV === "production"
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );

const client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal order
router.post("/create-order", auth, async (req, res) => {
  try {
    const { projectId, amount, rewardId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status !== "active") {
      return res.status(400).json({ message: "Project is not active" });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toString(),
          },
          description: `Backing ${project.title}`,
          custom_id: `${projectId}:${rewardId}:${req.user._id}`,
        },
      ],
    });

    const order = await client.execute(request);
    res.json({ orderId: order.result.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ message: "Error creating payment" });
  }
});

// Capture PayPal payment
router.post("/capture-order", auth, async (req, res) => {
  try {
    const { orderId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.prefer("return=representation");

    const capture = await client.execute(request);
    const captureData = capture.result;

    if (captureData.status === "COMPLETED") {
      const customId = captureData.purchase_units[0].custom_id;
      const [projectId, rewardId, userId] = customId.split(":");
      const amount = parseFloat(captureData.purchase_units[0].amount.value);

      // Update project and user
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Add backer to project
      project.backers.push({
        user: userId,
        amount,
        date: new Date(),
      });

      // Update current amount
      project.currentAmount += amount;

      // Check if project is now funded
      if (project.currentAmount >= project.targetAmount) {
        project.status = "funded";
      }

      await project.save();

      // Update user's backed projects
      const user = await User.findById(userId);
      user.backedProjects.push({
        project: projectId,
        amount,
        date: new Date(),
      });

      await user.save();

      res.json({
        message: "Payment successful",
        captureId: captureData.id,
      });
    } else {
      throw new Error("Payment not completed");
    }
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
});

// Get payment history for a user
router.get("/history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "backedProjects.project",
      select: "title description images",
    });

    res.json(user.backedProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

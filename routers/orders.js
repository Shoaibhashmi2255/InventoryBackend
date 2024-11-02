const {Order} = require('../models/order');
const {OrderItem} = require('../models/orderItem');
const {Product} = require('../models/product');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get(`/`, async (req, res) => {
    const orderList = await Order.find()
      .populate("user","name")
      .populate("department", "name")
      .populate("branch", "name")
      .sort({ dateOrdered: -1 })
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });

      
  
    if (!orderList) {
      res.status(500).json({ success: false });
    }
    res.send(orderList);
  });
  
  router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate("department", "name")
      .populate("branch", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });
      
  
    if (!order) {
      res.status(500).json({ success: false });
    }
    res.send(order);
  });
  
  try {
    router.post("/", async (req, res, next) => {
      const orderItemsIds = await Promise.all(
        req.body.orderItems.map(async (orderItem) => {
          let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product,
          });
          newOrderItem = await newOrderItem.save();

          return newOrderItem._id;

        })
      );
  
      // Ensure department and branch are optional
      const department = req.body.department ? req.body.department : null;
      const branch = req.body.branch ? req.body.branch : null;
      const status = req.body.status || 'Pending';  // Set status to 'Pending' if not provided
      
  
      // Create new order with optional department and branch
      let order = new Order({
        orderItems: orderItemsIds,
        department: department,  // Will be null if not provided
        branch: branch,          // Will be null if not provided
        status: status,
        user: req.body.user,
        otherProduct: req.body.otherProduct || '', // Save the text area input
        dateOrdered: req.body.dateOrdered
      });
  
      order = await order.save();

      if (!order) {
        return res.status(500).send({ message: "Failed to create order" });
      }
  
      res.send(order);
    });
  } catch (error) {
    res.status(500).send(error);
  }
  

  router.get('/history/:year/:month', async (req, res) => {
    const { year, month } = req.params;
  
    // Calculate the start and end date for the given month
    const startDate = new Date(year, month - 1, 1);  // Start of the month
    const endDate = new Date(year, month, 1);        // Start of the next month
  
    try {
      // Query orders created within the month
      const orders = await Order.find({
        dateOrdered: { $gte: startDate, $lt: endDate }
      })
      .populate("user", "name")
      .populate("department", "name")
      .populate("branch", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });
  
      res.status(200).send(orders);
    } catch (error) {
      res.status(500).send({ success: false, message: "Error retrieving monthly orders", error });
    }
  });
  
  
  router.put("/:id", async (req, res) => {
    const order = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      {
        status: req.body.status,
      },
      { new: true }
    );
    if (!order) {
      return res.status(500).send("Order not found!");
    }
    res.send(order);
  });

  // router.put('/confirm-order/:id', async (req, res) => {
  //   try {
  //     const order = await Order.findById(req.params.id).populate('orderItems.product');
  //     if (!order) return res.status(404).send('Order not found');
  
  //     // Deduct stock for each product
  //     for (const item of order.orderItems) {
  //       const product = await Product.findById(item.product.id);
  //       if (!product) return res.status(404).send(`Product not found for ID: ${item.product.id}`);
  
  //       product.stockIssued = product.stockIssued || 0;
  //       product.stockRemaining = product.stockRemaining ?? product.quantity;
  
  //       if (product.stockRemaining < item.quantity) {
  //         return res.status(400).send(`Insufficient stock for product ${product.name}`);
  //       }
  
  //       product.stockIssued += item.quantity;
  //       product.stockRemaining -= item.quantity;
  //       await product.save();
  //     }
  
  //     order.status = 'confirmed';
  //     await order.save();
  
  //     res.status(200).send(order);
  //   } catch (error) {
  //     console.error('Error confirming order:', error);
  //     res.status(500).send('Failed to confirm order');
  //   }
  // });



  // i have to get it back if error accor
  
  // router.put('/confirm-order/:id', async (req, res) => {
  //   try {
  //     const order = await Order.findById(req.params.id).populate({
  //       path: "orderItems",
  //       populate: { path: "product", populate: "category" },
  //     });
  
  //     if (!order) return res.status(404).send('Order not found');
  
  //     for (let item of order.orderItems) {
  //       if (!item.product) {
  //         return res.status(400).send(`Product not found for order item: ${item._id}`);
  //       }
  
  //       const product = await Product.findById(item.product._id);
  //       if (!product) {
  //         return res.status(400).send(`Product not found with ID: ${item.product._id}`);
  //       }
    
  //       product.stockIssued = product.stockIssued || 0;
  //       product.stockRemaining = product.stockRemaining ?? product.quantity;
  
  //       if (product.stockRemaining < item.quantity) {
  //         return res.status(400).json({ 
  //           success: false, 
  //           message: `Insufficient stock for product: ${product.name}`, 
  //           product: product.name 
  //         });        }
  
  //       product.stockIssued += item.quantity;
  //       product.stockRemaining -= item.quantity;
  //       await product.save();
  //     }
  
  //     order.status = 'confirmed';
  //     await order.save();
  
  //     res.status(200).send(order);
  //   } catch (error) {
  //     res.status(500).send('Failed to confirm order');
  //   }
  // });
  
router.put('/confirm-order/:id', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    // Fetch the order and populate products inside orderItems
    const order = await Order.findById(req.params.id).populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
    
    if (!order) {
      await session.abortTransaction();
      return res.status(404).send('Order not found');
    }
    
    for (let item of order.orderItems) {
      if (!item.product) {
        await session.abortTransaction();
        return res.status(400).send(`Product not found for order item: ${item._id}`);
      }

      const product = await Product.findById(item.product._id).session(session);
      
      if (!product) {
        await session.abortTransaction();
        return res.status(400).send(`Product not found with ID: ${item.product._id}`);
      }
      
      product.stockIssued = product.stockIssued || 0;
      product.stockRemaining = product.stockRemaining ?? product.quantity;

      if (product.stockRemaining < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`,
          product: product.name
        });
      }

      // Update stock
      product.stockIssued += item.quantity;
      product.stockRemaining -= item.quantity;
      await product.save({ session });
    }

    // Mark the order as confirmed
    order.status = 'confirmed';
    await order.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    // Fetch the updated order with populated product data again
    const updatedOrder = await Order.findById(req.params.id)
      .populate({
        path: "orderItems",
        populate: { path: "product", select: "name stockIssued stockRemaining quantity" },
      });

    res.status(200).send(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send('Failed to confirm order');
  }
});


router.put('/update-order-item/:orderId/:itemId', async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { quantityIssue } = req.body;

    // Ensure the order and order item exist
    const order = await Order.findById(orderId).populate('orderItems');
    if (!order) return res.status(404).send('Order not found');

    const orderItem = await OrderItem.findById(itemId);
    if (!orderItem) return res.status(404).send('Order item not found');

    // Update the quantity issue
    orderItem.quantityIssue = quantityIssue;
    await orderItem.save();

    res.status(200).send(orderItem);
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to update quantity issue', error });
  }
});



  
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if the order is confirmed
    if (order.status === 'confirmed') {
      // Adjust stock for each product in the confirmed order
      await Promise.all(order.orderItems.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId);
        if (orderItem) {
          const product = await Product.findById(orderItem.product);
          if (product) {
            product.stockIssued -= orderItem.quantity;  // Revert the stockIssued
            product.stockRemaining += orderItem.quantity;  // Adjust stockRemaining
            await product.save();
          }
        }
      }));
    }

    // Delete the order and its items regardless of confirmation status
    await Promise.all(order.orderItems.map(async (orderItemId) => {
      await OrderItem.findByIdAndDelete(orderItemId);
    }));
    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: "Order and its items deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});


  
  
  router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({user : req.params.userid})
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      }).sort({ dateOrdered: -1 });
  
    if (!userOrderList) {
      res.status(500).json({ success: false });
    }
    res.send(userOrderList);
  });

module.exports = router;
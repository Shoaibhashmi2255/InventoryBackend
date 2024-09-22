const {Order} = require('../models/order');
const {orderItem} = require('../models/orderItem');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const orderList = await Order.find()
      .populate("user", "Name")
      .sort({ dateOrdered: -1 });
  
    if (!orderList) {
      res.status(500).json({ success: false });
    }
    res.send(orderList);
  });
  
  router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
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
          let neworderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product,
          });
          neworderItem = await neworderItem.save();
  
          return neworderItem._id;
        })
      );
  
      const orderItemsResolved = await orderItemsIds;
  
      const totalPrices = await Promise.all(orderItemsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product' , 'price');
        
        if (!orderItem || !orderItem.product) {
          throw new Error(`Product not found for OrderItem with ID ${orderItemId}`);
        }
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
      }))
  
      const totalPrice = totalPrices.reduce((a , b) => a + b , 0)
  
      let order = new Order({
        orderItems: orderItemsResolved,
        department: req.body.department,
        branch: req.body.branch,
        status: req.body.status,
      });
      order = await order.save();
  
      if (!order) {
        return res.status(500).send({ message: "No Order" });
      }
      res.send(order);
    });
  } catch (error) {
    res.status(500).send(error);
  }
  
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
  
  router.delete("/:id", (req, res) => {
    Order.findOneAndDelete({ _id: req.params.id })
      .then(async (order) => {
        if (order) {
          await order.orderItems.map(async (orderItem) => {
            await OrderItem.findByIdAndRemove(orderItem);
          });
          return res
            .status(200)
            .json({ success: true, message: "Order is deleted" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Order is not deleted" });
        }
      })
      .catch((err) => {
        return res.status(404).json({ success: false, error: err });
      });
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
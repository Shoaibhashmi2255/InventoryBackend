const express = require('express');
const router = express.Router();
const ProductHistory = require('../../models/productHistory'); // Adjust path as needed
const { resetProductStockMonthly } = require('../../tasks/monthlytasks/montly-reset-quantites');


// Function to fetch month-wise history
async function getMonthWiseHistory() {
  try {
    const history = await ProductHistory.aggregate([
      {
        $project: {
          year: { $year: "$resetDate" },
          month: { $month: "$resetDate" },
          name: 1,
          description: 1,
          vendor: 1,
          department: 1,
          category: 1,
          quantity: 1,
          stockIssued: 1,
          stockRemaining: 1,
          price: 1,
          marketPrice: 1,
          scrapPrice: 1,
          inventory: 1,
          totalIssued: 1,
          totalRemaining: 1,
          totalStock: 1,
          resetDate: 1
        }
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          products: { $push: "$$ROOT" },
          totalQuantity: { $sum: "$quantity" },
          totalStockIssued: { $sum: "$stockIssued" },
          totalStockRemaining: { $sum: "$stockRemaining" }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      }
    ]);

    return history;
  } catch (error) {
    console.error("Error fetching month-wise history:", error);
    throw error;
  }
}

// Function to get the date range for a specific month and year
function getDateRange(year, month) {
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 0, 23, 59, 59),
  };
}

// Manual reset route
router.post('/reset-stock', async (req, res) => {
  try {
      await resetProductStockMonthly();
      res.status(200).json({ message: "Stock reset successfully." });
  } catch (error) {
      console.error("Failed to reset stock:", error);
      res.status(500).json({ message: "Stock reset failed.", error });
  }
});

// Route to get history for a specified month and year
router.get('/:year/:month', async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10);
    const month = parseInt(req.params.month, 10);
    const { start, end } = getDateRange(year, month);

    const history = await ProductHistory.find({
      resetDate: { $gte: start, $lte: end },
    }).sort({ resetDate: -1 });

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching specified month history:", error);
    res.status(500).json({ error: 'Failed to fetch specified month history.' });
  }
});



module.exports = router;

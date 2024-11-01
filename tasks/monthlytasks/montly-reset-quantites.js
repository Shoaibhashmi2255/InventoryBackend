const cron = require('node-cron');
const { Product } = require('../../models/product');
const ProductHistory = require('../../models/productHistory');



// async function resetProductStockMonthly() {
//     try {
//         // Fetch products and save to history collection
//         const productsBefore = await Product.find({});
//         console.log("Before Reset:", productsBefore);

//         const productHistories = productsBefore.map(product => {
//             const productData = product.toObject();
//             delete productData._id;
//             productData.resetDate = new Date();
//             return productData;
//         });
//         await ProductHistory.insertMany(productHistories);

//         // Update each product to reset monthly fields
//         const products = await Product.find({});
//         for (const product of products) {
//             product.inventory = product.stockRemaining; // Set inventory to remaining stock
//             product.stockIssued = 0;
//             product.stockRemaining = product.totalStock;  // Reset stockRemaining to totalStock
//             product.quantity = 0;

//             // Saving product will trigger the pre-save middleware to update totalStock and stockRemaining
//             await product.save();
//         }

//         const productsAfterSave = await Product.find({});
//         console.log("After Reset:", productsAfterSave);

//         console.log("Monthly stock reset successful.");
//     } catch (error) {
//         console.error("Failed to reset stock:", error);
//     }
// }

// // Schedule the task for the first day of every month at midnight
// cron.schedule('* * * * *', () => {
//     console.log("Running monthly stock reset task...");
//     resetProductStockMonthly();
// });



async function resetProductStockMonthly() {
    try {
        const productsBefore = await Product.find({});
        console.log("Before Reset:", productsBefore);

        const productHistories = productsBefore.map(product => {
            const productData = product.toObject();
            delete productData._id;
            productData.resetDate = new Date();
            return productData;
        });
        await ProductHistory.insertMany(productHistories);

        const products = await Product.find({});
        for (const product of products) {
            product.inventory = product.stockRemaining;
            product.stockIssued = 0;
            product.stockRemaining = product.totalStock;
            product.quantity = 0;
            await product.save();
        }

        const productsAfterSave = await Product.find({});
        console.log("After Reset:", productsAfterSave);

        console.log("Monthly stock reset successful.");
    } catch (error) {
        console.error("Failed to reset stock:", error);
        throw error;  // Throw error to handle it in the route if needed
    }
}

module.exports = { resetProductStockMonthly };

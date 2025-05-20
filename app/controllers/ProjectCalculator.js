const simpleCalculation = (req, res) => {
    console.log(req.body)
    try {
        const { size } = req.body;
        console.log(!size);
        console.log(typeof size);
        console.log(size <= 0);
        // Input validation
        if (!size || isNaN(size) || parseFloat(size) <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid roof area provided'
            });
        }

        const products = {
            ibrSheets: {
                pointFour: {
                    price: 5,
                    width: 0.4
                },
                pointThree: {
                    price: 4,
                    width: 0.3
                },
            },
            steel: {
                pointFour: {
                    price: 5,
                    width: 0.4
                },
                pointThree: {
                    price: 4,  // Fixed the duplicate value
                    width: 0.3 // Fixed the duplicate value
                },
            },
            // ... rest of the products object
        };

        const calculationsForSheets = [];
        
        Object.entries(products).forEach(([productName, product]) => {
            Object.entries(product).forEach(([typeName, sheetType]) => {
                const totalCostPerSheetType = {
                    sheetType: productName,
                    sheetVariant: typeName,
                    width: sheetType.width,
                    price: Number((sheetType.price * sheetType.width * size).toFixed(2))
                };
                calculationsForSheets.push(totalCostPerSheetType);
            });
        });

        return res.status(200).json({
            success: true,
            data: calculationsForSheets
        });

    } catch (error) {
        console.error('Calculation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const complexCalculations = (req, res)=>{
    return "test";
}

module.exports = {
    simpleCalculation,
    complexCalculations
}
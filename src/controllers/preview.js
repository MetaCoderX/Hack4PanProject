const {pool} = require('../util/database');
let product = null;

exports.previewItem = (req, res, next) => {
    const data = req.body;
    const productId = data.id;
    console.log(productId);

    pool.connect()
    .then((client) => {
        function getPreviewPage(query) {
            return client.query(query, [productId])
            .then(results => {
                let result = results.rows;
                console.log(result);
                return result;
            })
            .then(result => {
                res.setHeader('Content-Type', 'application/json');
                product = result;
                console.log("Product is : " + product);
                res.json(result);
                // res.render('preview');
            })
            .catch(e => console.log("Error in query: \n" + e))
            .finally(() => {
                client.release();
                console.log("Connection ended");
            });
        }
        getPreviewPage(`SELECT * FROM ecom_products.products
                    WHERE id = $1`);
    })
    .catch(e => console.log("Error in connection: \n" + e));
}

exports.getProduct = () => {
    // console.log('hi');
    return product;
}
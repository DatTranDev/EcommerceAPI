const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const categoryRoutes = require('./routes/category.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const paymentRoutes = require('./routes/payment.route');

const errorHandler = require('./middlewares/errorHandler');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define routes
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.use(errorHandler);

module.exports = app;

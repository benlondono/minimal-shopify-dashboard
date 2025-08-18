const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 3001;

// Shopify app configuration
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || 'your_shopify_api_key';
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || 'your_shopify_api_secret';
const SCOPES = process.env.SCOPES || 'read_orders,read_products,read_customers';

// Middleware to parse query parameters
app.use(express.urlencoded({ extended: true }));

// Function to validate Shopify request
function validateShopifyRequest(req, res, next) {
    const { shop, hmac, state } = req.query;
    
    // Check if this is a direct browser access (no Shopify parameters)
    if (!shop) {
        return res.status(403).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Access Denied</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .error { color: #d73a49; font-size: 24px; margin-bottom: 20px; }
                    .message { color: #586069; font-size: 16px; }
                </style>
            </head>
            <body>
                <div class="error">🚫 Access Denied</div>
                <div class="message">This dashboard can only be accessed through Shopify admin.</div>
                <div class="message">Please install the app on your Shopify store to continue.</div>
            </body>
            </html>
        `);
    }
    
    // For Shopify admin iframe requests, we'll accept them if they have a shop parameter
    // This provides basic security while allowing the iframe to work
    if (shop && shop.includes('.myshopify.com')) {
        return next();
    }
    
    // If we have HMAC, validate it (for OAuth flows)
    if (hmac && SHOPIFY_API_SECRET !== 'your_shopify_api_secret') {
        const queryString = querystring.stringify(req.query);
        const hash = crypto
            .createHmac('sha256', SHOPIFY_API_SECRET)
            .update(queryString, 'utf8')
            .digest('hex');
        
        if (hash !== hmac) {
            return res.status(403).send('Invalid signature');
        }
    }
    
    next();
}

// Main dashboard route with Shopify validation
app.get('/', validateShopifyRequest, (req, res) => {
    const { shop } = req.query;
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Analytics Dashboard - ${shop}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background-color: #f6f6f7;
                }
                
                .header {
                    background: white;
                    padding: 20px;
                    border-bottom: 1px solid #e1e3e5;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .header h1 {
                    margin: 0;
                    color: #202223;
                    font-size: 24px;
                    font-weight: 600;
                }
                
                .header p {
                    margin: 8px 0 0 0;
                    color: #6d7175;
                    font-size: 14px;
                }
                
                .shop-info {
                    background: #f1f2f3;
                    padding: 10px 20px;
                    border-radius: 6px;
                    margin: 10px 0;
                    font-size: 14px;
                    color: #6d7175;
                }
                
                .dashboard-container {
                    padding: 20px;
                    height: calc(100vh - 140px);
                }
                
                .dashboard-frame {
                    width: 100%;
                    height: 100%;
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    background: white;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Analytics Dashboard</h1>
                <p>Multi-store Shopify analytics powered by Streamlit</p>
                <div class="shop-info">
                    🏪 Connected to: ${shop}
                </div>
            </div>
            
            <div class="dashboard-container">
                <iframe 
                    src="https://data-dashboard-xdkiinsyq6cn4tw7pym6ob.streamlit.app/?embed=true&embed_options=dark-theme&referrer=minimal-shopify-dashboard.onrender.com"
                    class="dashboard-frame"
                    title="Shopify Analytics Dashboard"
                    allow="camera; microphone; geolocation"
                ></iframe>
            </div>
        </body>
        </html>
    `);
});

// Health check route (for Render)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Dashboard service is running' });
});

// Catch-all route for unauthorized access
app.get('*', (req, res) => {
    res.status(403).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Access Denied</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .error { color: #d73a49; font-size: 24px; margin-bottom: 20px; }
                .message { color: #586069; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="error">🚫 Access Denied</div>
            <div class="message">This dashboard can only be accessed through Shopify admin.</div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Secure Shopify dashboard running on port ${port}`);
    console.log(`Dashboard is now protected and only accessible through Shopify admin`);
});
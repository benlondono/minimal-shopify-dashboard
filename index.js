const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Analytics Dashboard</title>
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
            
            .dashboard-container {
                padding: 20px;
                height: calc(100vh - 120px);
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
        </div>
        
        <div class="dashboard-container">
            <iframe 
                src="https://data-dashboard-xdkiinsyq6cn4tw7pym6ob.streamlit.app"
                class="dashboard-frame"
                title="Shopify Analytics Dashboard"
                allow="camera; microphone; geolocation"
            ></iframe>
        </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Dashboard app running on port ${port}`);
}); 
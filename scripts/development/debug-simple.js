const puppeteer = require('puppeteer');

async function debugApp() {
    console.log('🔍 Debugging React app...');

    const browser = await puppeteer.launch({
        headless: false, // Show browser for debugging
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Listen for console messages
        page.on('console', msg => {
            console.log('📝 Console:', msg.text());
        });

        // Listen for page errors
        page.on('pageerror', error => {
            console.log('❌ Page Error:', error.message);
        });

        // Navigate to the app
        console.log('🌐 Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', {
            waitUntil: 'networkidle0',
            timeout: 15000
        });

        // Wait a bit for any async operations
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if root element has content
        const rootContent = await page.$eval('#root', el => el.innerHTML);
        console.log('📦 Root content:', rootContent);

        // Check for any error messages
        const errorElements = await page.$$('[class*="error"], [class*="Error"]');
        if (errorElements.length > 0) {
            console.log('⚠️ Found error elements:', errorElements.length);
        }

        // Check if React is loaded
        const reactLoaded = await page.evaluate(() => {
            return typeof window.React !== 'undefined';
        });
        console.log('⚛️ React loaded:', reactLoaded);

        // Take a screenshot for debugging
        await page.screenshot({ path: 'debug-screenshot.png' });
        console.log('📸 Screenshot saved as debug-screenshot.png');

    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    } finally {
        // Keep browser open for a moment to see what's happening
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
    }
}

debugApp();
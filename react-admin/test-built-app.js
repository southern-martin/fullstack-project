const puppeteer = require('puppeteer');

async function testBuiltApp() {
    console.log('🔍 Testing built React app...');

    const browser = await puppeteer.launch({
        headless: true,
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

        // Navigate to the built app
        console.log('🌐 Navigating to http://localhost:8000...');
        await page.goto('http://localhost:8000', {
            waitUntil: 'networkidle0',
            timeout: 10000
        });

        // Wait for React to render
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if our custom content is there
        const content = await page.content();
        if (content.includes('React Admin Dashboard')) {
            console.log('✅ Custom content found in built app!');
        } else {
            console.log('❌ Custom content not found in built app');
        }

        // Get the root content
        const rootContent = await page.$eval('#root', el => el.innerHTML);
        console.log('📦 Root content:', rootContent);

        // Check if React is loaded
        const reactLoaded = await page.evaluate(() => {
            return typeof window.React !== 'undefined';
        });
        console.log('⚛️ React loaded:', reactLoaded);

        // Check for any JavaScript errors
        const errors = await page.evaluate(() => {
            return window.errors || [];
        });
        if (errors.length > 0) {
            console.log('❌ JavaScript errors:', errors);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testBuiltApp();
















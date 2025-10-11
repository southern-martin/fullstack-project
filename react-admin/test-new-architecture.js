const puppeteer = require('puppeteer');

async function testNewArchitecture() {
    console.log('🧪 Testing new React architecture...');

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

        // Navigate to the app
        console.log('🌐 Navigating to http://localhost:8000...');
        await page.goto('http://localhost:8000', {
            waitUntil: 'networkidle0',
            timeout: 10000
        });

        // Wait for React to render
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if login form is present (should redirect to login since not authenticated)
        const loginForm = await page.$('form');
        if (loginForm) {
            console.log('✅ Login form found - Authentication system working!');
        }

        // Check for dashboard elements
        const dashboardTitle = await page.$('h1');
        if (dashboardTitle) {
            const titleText = await page.$eval('h1', el => el.textContent);
            console.log('✅ Dashboard title found:', titleText);
        }

        // Check for routing
        const currentUrl = page.url();
        console.log('📍 Current URL:', currentUrl);

        // Check for React Router
        const reactRouter = await page.evaluate(() => {
            return typeof window.ReactRouter !== 'undefined';
        });
        console.log('🔄 React Router loaded:', reactRouter);

        // Check for authentication context
        const authContext = await page.evaluate(() => {
            return typeof window.React !== 'undefined';
        });
        console.log('⚛️ React loaded:', authContext);

        // Get the root content
        const rootContent = await page.$eval('#root', el => el.innerHTML);
        console.log('📦 Root content preview:', rootContent.substring(0, 200) + '...');

        console.log('🎉 New architecture test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testNewArchitecture();

















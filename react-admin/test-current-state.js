const puppeteer = require('puppeteer');

async function testCurrentState() {
    console.log('🔍 Testing current app state...');

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
        console.log('🌐 Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', {
            waitUntil: 'networkidle0',
            timeout: 10000
        });

        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Get the full HTML content
        const htmlContent = await page.content();
        console.log('📄 Full HTML length:', htmlContent.length);

        // Check if our custom content is there
        if (htmlContent.includes('React Admin Dashboard')) {
            console.log('✅ Custom content found!');
        } else {
            console.log('❌ Custom content not found');
        }

        // Check if default content is there
        if (htmlContent.includes('Edit src/App.tsx')) {
            console.log('⚠️ Default Create React App content still showing');
        }

        // Get the root content specifically
        const rootContent = await page.$eval('#root', el => el.innerHTML);
        console.log('📦 Root content preview:', rootContent.substring(0, 200) + '...');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testCurrentState();
















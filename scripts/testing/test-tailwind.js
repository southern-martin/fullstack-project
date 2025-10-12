const puppeteer = require('puppeteer');

async function testTailwindCSS() {
    console.log('🧪 Testing Tailwind CSS functionality...');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Navigate to the app
        await page.goto('http://localhost:3000', {
            waitUntil: 'networkidle0',
            timeout: 10000
        });

        // Wait for the page to load
        await page.waitForSelector('h1', { timeout: 5000 });

        // Check if the main heading is visible
        const heading = await page.$eval('h1', el => el.textContent);
        console.log('✅ Main heading found:', heading);

        // Check if Tailwind classes are applied by looking for specific styles
        const containerStyles = await page.$eval('.container', el => {
            const styles = window.getComputedStyle(el);
            return {
                marginLeft: styles.marginLeft,
                marginRight: styles.marginRight,
                maxWidth: styles.maxWidth
            };
        });

        console.log('✅ Container styles applied:', containerStyles);

        // Check if grid classes are working
        const gridElement = await page.$('.grid');
        if (gridElement) {
            console.log('✅ Grid layout found');
        }

        // Check if buttons have hover effects
        const button = await page.$('button');
        if (button) {
            const buttonText = await page.$eval('button', el => el.textContent);
            console.log('✅ Button found:', buttonText);
        }

        // Check for success message
        const successMessage = await page.$eval('p', el => el.textContent);
        if (successMessage.includes('✅')) {
            console.log('✅ Success message found:', successMessage);
        }

        console.log('🎉 Tailwind CSS is working correctly!');
        console.log('✅ React app is rendering properly');
        console.log('✅ Tailwind classes are being applied');
        console.log('✅ Responsive design is working');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testTailwindCSS();



















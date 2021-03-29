const chromium = require('chrome-aws-lambda');
const fs = require('fs');
const args = [
    '--remote-debugging-port=9222',
    '--window-size=1280,1696'
];

exports.loadChrome = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log('AWS_EXECUTION_ENV', process.env.AWS_EXECUTION_ENV);
    console.log('FONTCONFIG_PATH', process.env.FONTCONFIG_PATH);
    console.log('LD_LIBRARY_PATH', process.env.LD_LIBRARY_PATH);
    let result = null;
    let browser = null;
    try {
        const executablePath = await chromium.executablePath;
        console.log('executablePath', executablePath)
        console.log(executablePath, fs.existsSync(executablePath));
        console.log('LD_LIBRARY_PATH', process.env.LD_LIBRARY_PATH);
        console.log('FONTCONFIG_PATH', process.env.FONTCONFIG_PATH);
        const options = {
            args: chromium.args.concat(args),
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        };
        console.dir(options)
        browser = await chromium.puppeteer.launch(options);
        let page = await browser.newPage();
        await page.goto(event.url || 'https://github.com/alixaxel');
        result = await page.title();
        return context.succeed(result);
    } catch (error) {
        console.error(error);
        return context.fail(error);
    } finally {
        if (browser !== null) {
            try { await browser.close(); } catch (e) { }
        }
    }
};
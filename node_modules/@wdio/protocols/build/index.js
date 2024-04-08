import WebDriverProtocol from './protocols/webdriver.js';
import WebDriverBidiProtocol from './protocols/webdriverBidi.js';
import MJsonWProtocol from './protocols/mjsonwp.js';
import JsonWProtocol from './protocols/jsonwp.js';
import AppiumProtocol from './protocols/appium.js';
import ChromiumProtocol from './protocols/chromium.js';
import GeckoProtocol from './protocols/gecko.js';
import SauceLabsProtocol from './protocols/saucelabs.js';
import SeleniumProtocol from './protocols/selenium.js';
export * from './types.js';
export { 
// protocols
WebDriverProtocol, MJsonWProtocol, JsonWProtocol, AppiumProtocol, ChromiumProtocol, SauceLabsProtocol, SeleniumProtocol, GeckoProtocol, WebDriverBidiProtocol };
export const CAPABILITY_KEYS = [
    'browserName', 'browserVersion', 'platformName', 'acceptInsecureCerts',
    'pageLoadStrategy', 'proxy', 'setWindowRect', 'timeouts', 'strictFileInteractability',
    'unhandledPromptBehavior', 'webSocketUrl'
];

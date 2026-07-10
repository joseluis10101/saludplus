import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const options = new chrome.Options();
options.addArguments('--headless=new');
const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
try {
  await driver.get('http://localhost:9090/paciente/registro');
  await new Promise((r) => setTimeout(r, 2000));
  const logs = await driver
    .manage()
    .logs()
    .get('browser')
    .catch((e) => 'no logs: ' + e);
  console.log('LOGS', logs);
  const html = await driver.executeScript('return document.getElementById("app").innerHTML.slice(0,2000)');
  console.log('APP HTML:', html);
  const url = await driver.getCurrentUrl();
  console.log('URL:', url);
} finally {
  await driver.quit();
}

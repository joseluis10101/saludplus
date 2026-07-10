import assert from 'node:assert/strict';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const BASE_URL = process.env.APP_BASE_URL || 'http://localhost:9090';

async function findButtonByText(driver, text) {
  return driver.wait(until.elementLocated(By.xpath(`//button[contains(., '${text}')]`)), 10000);
}

// La app es un SPA: tras `driver.get` el documento ya está "completo" pero Vue
// todavía puede no haber montado el formulario, así que hay que esperarlo.
async function waitForField(driver, css) {
  return driver.wait(until.elementLocated(By.css(css)), 10000);
}

describe('Login de paciente', function () {
  this.timeout(20000);
  let driver;

  before(async function () {
    const options = new chrome.Options();
    if (process.env.HEADLESS !== 'false') {
      options.addArguments('--headless=new');
    }
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  beforeEach(async function () {
    // localStorage es por origen: hay que visitar el sitio antes de poder limpiarlo.
    await driver.get(BASE_URL);
    await driver.executeScript('window.localStorage.clear()');
  });

  it('inicia sesión con un correo registrado y va a mis citas', async function () {
    await driver.get(`${BASE_URL}/paciente/login`);

    const emailField = await waitForField(driver, 'input[type="email"]');
    await emailField.clear();
    await emailField.sendKeys('carmen.vilca@gmail.com');

    const submitButton = await findButtonByText(driver, 'Ingresar');
    await submitButton.click();

    await driver.wait(until.urlContains('/paciente/citas'), 10000);
    const path = new URL(await driver.getCurrentUrl()).pathname;
    assert.equal(path, '/paciente/citas');
  });

  it('muestra error cuando el correo no existe', async function () {
    await driver.get(`${BASE_URL}/paciente/login`);

    const emailField = await waitForField(driver, 'input[type="email"]');
    await emailField.clear();
    await emailField.sendKeys('no.existe@example.com');

    const submitButton = await findButtonByText(driver, 'Ingresar');
    await submitButton.click();

    const error = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'No encontramos una cuenta con ese correo.')]")),
      10000
    );
    assert.equal(await error.isDisplayed(), true);

    const path = new URL(await driver.getCurrentUrl()).pathname;
    assert.equal(path, '/paciente/login');
  });
});

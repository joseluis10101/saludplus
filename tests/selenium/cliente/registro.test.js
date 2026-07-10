import assert from 'node:assert/strict';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const BASE_URL = process.env.APP_BASE_URL || 'http://localhost:9090';

// ChromeDriver espera el input[type=date] en formato MM/DD/YYYY, no YYYY-MM-DD.
function toChromeDateInput(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
}

async function findButtonByText(driver, text) {
  return driver.wait(until.elementLocated(By.xpath(`//button[contains(., '${text}')]`)), 10000);
}

// La app es un SPA: tras `driver.get` el documento ya está "completo" pero Vue
// todavía puede no haber montado el formulario, así que hay que esperarlo.
async function waitForField(driver, css) {
  return driver.wait(until.elementLocated(By.css(css)), 10000);
}

describe('Registro de paciente (RF01)', function () {
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

  it('registra un paciente nuevo y lo lleva a su panel de citas', async function () {
    await driver.get(`${BASE_URL}/paciente/registro`);

    await waitForField(driver, 'input[placeholder="Ej. María"]');

    await driver.findElement(By.css('input[placeholder="Ej. María"]')).sendKeys('Diana');
    await driver.findElement(By.css('input[placeholder="Ej. Salas Mendoza"]')).sendKeys('Reyes Ortiz');
    await driver.findElement(By.css('input[placeholder="12345678"]')).sendKeys('72345678');
    await driver.findElement(By.css('input[type="date"]')).sendKeys(toChromeDateInput('1998-04-12'));
    await driver.findElement(By.css('input[placeholder="tucorreo@ejemplo.com"]')).sendKeys('diana.reyes@example.com');
    await driver.findElement(By.css('input[placeholder="9XXXXXXXX"]')).sendKeys('911222333');
    await driver.findElement(By.css('input[placeholder="••••••••"]')).sendKeys('claveSegura123');

    const submitButton = await findButtonByText(driver, 'Crear cuenta');
    await submitButton.click();

    await driver.wait(until.urlContains('/paciente/citas'), 10000);
    const path = new URL(await driver.getCurrentUrl()).pathname;
    assert.equal(path, '/paciente/citas');
  });

  it('rechaza un registro con documento o correo duplicado', async function () {
    await driver.get(`${BASE_URL}/paciente/registro`);

    await waitForField(driver, 'input[placeholder="Ej. María"]');

    await driver.findElement(By.css('input[placeholder="Ej. María"]')).sendKeys('Carmen');
    await driver.findElement(By.css('input[placeholder="Ej. Salas Mendoza"]')).sendKeys('Vilca Apaza');
    await driver.findElement(By.css('input[placeholder="12345678"]')).sendKeys('49456789'); // documento ya sembrado
    await driver.findElement(By.css('input[type="date"]')).sendKeys(toChromeDateInput('1995-01-30'));
    await driver.findElement(By.css('input[placeholder="tucorreo@ejemplo.com"]')).sendKeys('otro.correo@example.com');
    await driver.findElement(By.css('input[placeholder="9XXXXXXXX"]')).sendKeys('954321098');
    await driver.findElement(By.css('input[placeholder="••••••••"]')).sendKeys('claveSegura123');

    const submitButton = await findButtonByText(driver, 'Crear cuenta');
    await submitButton.click();

    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Ya existe una cuenta registrada')]")), 10000);
    const path = new URL(await driver.getCurrentUrl()).pathname;
    assert.equal(path, '/paciente/registro');
  });
});

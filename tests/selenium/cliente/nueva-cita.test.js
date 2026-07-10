import assert from 'node:assert/strict';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const BASE_URL = process.env.APP_BASE_URL || 'http://localhost:9090';

async function findButtonByText(driver, text) {
  return driver.wait(until.elementLocated(By.xpath(`//button[contains(., '${text}')]`)), 10000);
}

async function clickButtonWithText(driver, text) {
  const button = await findButtonByText(driver, text);
  await button.click();
}

// La app es un SPA: tras `driver.get` el documento ya está "completo" pero Vue
// todavía puede no haber montado el formulario, así que hay que esperarlo.
async function waitForField(driver, css) {
  return driver.wait(until.elementLocated(By.css(css)), 10000);
}

// ChromeDriver espera el input[type=date] en formato MM/DD/YYYY, no YYYY-MM-DD.
function toChromeDateInput(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
}

async function buttonExists(driver, text) {
  const buttons = await driver.findElements(By.xpath(`//button[contains(., '${text}')]`));
  return buttons.length > 0;
}

async function login(driver) {
  await driver.get(`${BASE_URL}/paciente/login`);

  const emailField = await waitForField(driver, 'input[type="email"]');
  await emailField.clear();
  await emailField.sendKeys('carmen.vilca@gmail.com');

  await clickButtonWithText(driver, 'Ingresar');

  await driver.wait(until.urlContains('/paciente/citas'), 10000);
}

describe('Reservar cita (RF02)', function () {
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

    await login(driver);

    await driver.get(`${BASE_URL}/paciente/nueva-cita`);
    await findButtonByText(driver, 'Cardiología');
  });

  it('reserva una cita eligiendo especialidad, médico, fecha y hora', async function () {
    await clickButtonWithText(driver, 'Cardiología');
    await clickButtonWithText(driver, 'Dr(a). Carlos Paredes Vega');

    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 7);
    const fechaISO = fecha.toISOString().slice(0, 10);
    const dateField = await waitForField(driver, 'input[type="date"]');
    await dateField.sendKeys(toChromeDateInput(fechaISO));

    await clickButtonWithText(driver, '09:00');
    await clickButtonWithText(driver, 'Confirmar cita');

    await driver.wait(until.urlContains('/paciente/citas'), 10000);
    const path = new URL(await driver.getCurrentUrl()).pathname;
    assert.equal(path, '/paciente/citas');

    const especialidad = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Cardiología')]")), 10000);
    assert.equal(await especialidad.isDisplayed(), true);
  });

  it('no muestra especialidades inactivas (RF08)', async function () {
    // Traumatología está sembrada como inactiva y no debe aparecer en el módulo de reserva
    assert.equal(await buttonExists(driver, 'Traumatología'), false);

    const cardiologia = await findButtonByText(driver, 'Cardiología');
    assert.equal(await cardiologia.isDisplayed(), true);
  });
});

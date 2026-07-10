// Runner mínimo para ejecutar proyectos .side (formato de Selenium IDE) contra
// WebDriver real, en vez del `selenium-side-runner` oficial: esa CLI (v4 alpha) falla
// al descubrir su propio archivo de test dentro de node_modules (bug de Jest), y el
// reproductor embebido en la extensión falla en Chrome con el comando `type`
// (usa `initKeyEvent`, una API exclusiva de Firefox). Aquí interpretamos los
// comandos usando selenium-webdriver directamente, igual que en tests/selenium/.
import fs from 'node:fs';
import path from 'node:path';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const BASE_URL = process.env.APP_BASE_URL || 'http://localhost:9090';
const DEFAULT_TIMEOUT = 10000;

function locatorFor(target) {
  const separatorIndex = target.indexOf('=');
  const strategy = target.slice(0, separatorIndex);
  const value = target.slice(separatorIndex + 1);
  switch (strategy) {
    case 'css':
      return By.css(value);
    case 'xpath':
      return By.xpath(value);
    case 'id':
      return By.id(value);
    default:
      return By.css(target);
  }
}

function interpolate(text, vars) {
  return text.replace(/\$\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
}

async function runCommand(driver, command, vars, testsByName) {
  const target = interpolate(command.target ?? '', vars);
  const value = interpolate(command.value ?? '', vars);

  switch (command.command) {
    case 'open': {
      const url = target.startsWith('http') ? target : `${BASE_URL}${target}`;
      await driver.get(url);
      return;
    }
    case 'executeScript': {
      const result = await driver.executeScript(target);
      if (value) vars[value] = result;
      return;
    }
    case 'click': {
      const el = await driver.wait(until.elementLocated(locatorFor(target)), DEFAULT_TIMEOUT);
      await el.click();
      return;
    }
    case 'sendKeys':
    case 'type': {
      const el = await driver.wait(until.elementLocated(locatorFor(target)), DEFAULT_TIMEOUT);
      await el.clear().catch(() => {});
      await el.sendKeys(value);
      return;
    }
    case 'waitForElementVisible': {
      const timeout = Number(value) || DEFAULT_TIMEOUT;
      const el = await driver.wait(until.elementLocated(locatorFor(target)), timeout);
      await driver.wait(until.elementIsVisible(el), timeout);
      return;
    }
    case 'assert': {
      const actual = vars[target];
      if (String(actual) !== String(value)) {
        throw new Error(`assert falló: ${target} = ${JSON.stringify(actual)}, se esperaba ${JSON.stringify(value)}`);
      }
      return;
    }
    case 'assertElementPresent': {
      const els = await driver.findElements(locatorFor(target));
      if (els.length === 0) throw new Error(`assertElementPresent falló: no hay coincidencias para ${target}`);
      return;
    }
    case 'assertElementNotPresent': {
      const els = await driver.findElements(locatorFor(target));
      if (els.length > 0) throw new Error(`assertElementNotPresent falló: se encontraron coincidencias para ${target}`);
      return;
    }
    case 'run': {
      const child = testsByName.get(target);
      if (!child) throw new Error(`run: no se encontró el test "${target}"`);
      await runTest(driver, child, vars, testsByName);
      return;
    }
    default:
      throw new Error(`Comando no soportado: ${command.command}`);
  }
}

async function runTest(driver, test, vars, testsByName) {
  for (const command of test.commands) {
    await runCommand(driver, command, vars, testsByName);
  }
}

function findSideFiles(entry) {
  const stat = fs.statSync(entry);
  if (stat.isFile()) return [entry];
  const out = [];
  for (const name of fs.readdirSync(entry)) {
    const full = path.join(entry, name);
    if (fs.statSync(full).isDirectory()) out.push(...findSideFiles(full));
    else if (name.endsWith('.side')) out.push(full);
  }
  return out.sort();
}

async function main() {
  const entries = process.argv.slice(2);
  if (entries.length === 0) {
    console.error('Uso: node run-side.mjs <archivo.side | carpeta> [...]');
    process.exit(1);
  }

  const files = entries.flatMap(findSideFiles);
  const options = new chrome.Options();
  if (process.env.HEADLESS !== 'false') {
    options.addArguments('--headless=new');
  }
  // La ventana headless por defecto de Chrome es 800x600: algunos modales (p. ej.
  // el de "Nuevo paciente", con más campos) no caben y su botón de envío queda
  // fuera del viewport sin scroll disponible. Se agranda para imitar una ventana real.
  options.addArguments('--window-size=1280,960');

  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const project = JSON.parse(fs.readFileSync(file, 'utf8'));
    const testsByName = new Map(project.tests.map((t) => [t.name, t]));
    const suiteTestIds = new Set(project.suites.flatMap((s) => s.tests));
    const runnableTests = project.tests.filter((t) => suiteTestIds.has(t.id));

    console.log(`\n${project.name} (${path.relative(process.cwd(), file)})`);

    for (const test of runnableTests) {
      const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
      try {
        await runTest(driver, test, {}, testsByName);
        console.log(`  ✓ ${test.name}`);
        passed += 1;
      } catch (err) {
        console.error(`  ✗ ${test.name}`);
        console.error(`    ${err.message}`);
        failed += 1;
      } finally {
        await driver.quit();
      }
    }
  }

  console.log(`\n${passed} pasaron, ${failed} fallaron`);
  process.exit(failed > 0 ? 1 : 0);
}

main();

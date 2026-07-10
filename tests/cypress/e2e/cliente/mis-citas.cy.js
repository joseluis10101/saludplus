function login(email) {
  cy.visit('/paciente/login');
  cy.get('input[type="email"]').clear().type(email);
  cy.contains('button', 'Ingresar').click();
  cy.location('pathname').should('eq', '/paciente/citas');
}

describe('Panel del paciente y seguimiento de citas (RF03 / RF07)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('muestra el historial de atenciones y permite ver el detalle de una cita atendida', () => {
    login('carmen.vilca@gmail.com');

    cy.contains('No tienes citas próximas.').should('be.visible');

    cy.contains('h2', 'Historial').should('be.visible');
    cy.contains('Neurología').should('be.visible');
    cy.contains('button', 'Ver detalle').click();

    cy.contains('Detalle de la atención').should('be.visible');
    cy.contains('Migraña tensional').should('be.visible');
    cy.contains('Ibuprofeno 400mg c/8h x 5 días').should('be.visible');

    cy.contains('button', 'Cerrar').click();
    cy.contains('Detalle de la atención').should('not.exist');
  });

  it('cancela una cita reservada y la mueve al historial', () => {
    login('luis.huaman@gmail.com');

    cy.contains('Cardiología').should('be.visible');
    cy.contains('button', 'Cancelar').click();

    cy.contains('No tienes citas próximas.').should('be.visible');
    cy.contains('h2', 'Historial').should('be.visible');
    cy.contains('Cancelada').should('be.visible');
  });
});

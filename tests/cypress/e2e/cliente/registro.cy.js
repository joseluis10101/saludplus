describe('Registro de paciente (RF01)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('registra un paciente nuevo y lo lleva a su panel de citas', () => {
    cy.visit('/paciente/registro');

    cy.get('input[placeholder="Ej. María"]').type('Diana');
    cy.get('input[placeholder="Ej. Salas Mendoza"]').type('Reyes Ortiz');
    cy.get('input[placeholder="12345678"]').type('72345678');
    cy.get('input[type="date"]').type('1998-04-12');
    cy.get('input[placeholder="tucorreo@ejemplo.com"]').type('diana.reyes@example.com');
    cy.get('input[placeholder="9XXXXXXXX"]').type('911222333');
    cy.get('input[placeholder="••••••••"]').type('claveSegura123');

    cy.contains('button', 'Crear cuenta').click();

    cy.location('pathname').should('eq', '/paciente/citas');
  });

  it('rechaza un registro con documento o correo duplicado', () => {
    cy.visit('/paciente/registro');

    cy.get('input[placeholder="Ej. María"]').type('Carmen');
    cy.get('input[placeholder="Ej. Salas Mendoza"]').type('Vilca Apaza');
    cy.get('input[placeholder="12345678"]').type('49456789'); // documento ya sembrado
    cy.get('input[type="date"]').type('1995-01-30');
    cy.get('input[placeholder="tucorreo@ejemplo.com"]').type('otro.correo@example.com');
    cy.get('input[placeholder="9XXXXXXXX"]').type('954321098');
    cy.get('input[placeholder="••••••••"]').type('claveSegura123');

    cy.contains('button', 'Crear cuenta').click();

    cy.contains('Ya existe una cuenta registrada').should('be.visible');
    cy.location('pathname').should('eq', '/paciente/registro');
  });
});

describe('Admin · Mis pacientes (pacientes en espera o atendidos)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/admin/mis-pacientes');
  });

  it('solo lista pacientes en espera o ya atendidos', () => {
    cy.contains('tr', 'Pedro Ccahuana Torres').should('be.visible');
    cy.contains('tr', 'Carmen Vilca Apaza').should('be.visible');
    cy.contains('tr', 'Luis Huamán Ruiz').should('not.exist');
    cy.contains('tr', 'Rosa Condori Mamani').should('not.exist');
  });

  it('filtra por médico', () => {
    cy.get('select').select('Ana Torres Cáceres');

    cy.contains('tr', 'Carmen Vilca Apaza').should('be.visible');
    cy.contains('tr', 'Pedro Ccahuana Torres').should('not.exist');
  });

  it('muestra la atención ya registrada de un paciente atendido', () => {
    cy.contains('tr', 'Carmen Vilca Apaza').contains('button', 'Ver atención').click();

    cy.get('textarea').first().should('have.value', 'Migraña tensional');
    cy.contains('button', 'Cancelar').click();
  });

  it('registra la atención de un paciente en espera (RF05)', () => {
    cy.contains('tr', 'Pedro Ccahuana Torres').contains('button', 'Registrar atención').click();

    cy.get('textarea').first().type('Amigdalitis');
    cy.contains('button', 'Guardar atención').click();

    cy.contains('tr', 'Pedro Ccahuana Torres').within(() => {
      cy.contains('Atendida').should('be.visible');
      cy.contains('button', 'Ver atención').should('be.visible');
    });
  });
});

describe('Admin · Gestión de citas / reservas (RF04, RF05, RF09)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/admin/reservas');
  });

  it('filtra las citas por estado', () => {
    cy.get('select').select('Reservada');

    cy.contains('tr', 'Luis Huamán Ruiz').should('be.visible');
    cy.contains('tr', 'Rosa Condori Mamani').should('be.visible');
    cy.contains('tr', 'Pedro Ccahuana Torres').should('not.exist');
    cy.contains('tr', 'Carmen Vilca Apaza').should('not.exist');
  });

  it('registra el ingreso de una cita cubierta por seguro (RF04)', () => {
    cy.contains('tr', 'Rosa Condori Mamani').contains('button', 'Registrar ingreso').click();

    cy.contains('button', 'Confirmar ingreso').click();

    cy.contains('tr', 'Rosa Condori Mamani').within(() => {
      cy.contains('En espera').should('be.visible');
      cy.contains('Seguro').should('be.visible');
    });
  });

  it('registra la atención médica de una cita en espera (RF05)', () => {
    cy.contains('tr', 'Pedro Ccahuana Torres').contains('button', 'Registrar atención').click();

    cy.get('textarea').first().type('Faringitis aguda');
    cy.contains('button', 'Guardar atención').click();

    cy.contains('tr', 'Pedro Ccahuana Torres').contains('Atendida').should('be.visible');
  });

  it('cancela una cita reservada', () => {
    cy.contains('tr', 'Luis Huamán Ruiz').contains('button', 'Cancelar').click();

    cy.contains('tr', 'Luis Huamán Ruiz').contains('Cancelada').should('be.visible');
  });

  it('crea una nueva reserva desde el panel administrativo (RF02)', () => {
    cy.contains('button', 'Nueva reserva').click();

    cy.get('form').within(() => {
      cy.get('select').eq(0).select('María Salas Mendoza — 44678901');
      cy.get('select').eq(1).select('Pediatría');
      cy.get('select').eq(2).select('Jorge Mendoza Ríos');
      cy.get('input[type="date"]').type('2026-08-01');
      cy.get('select').eq(3).select('08:00');
    });
    cy.contains('button', 'Crear reserva').click();

    cy.contains('tr', 'María Salas Mendoza').within(() => {
      cy.contains('Reservada').should('be.visible');
      cy.contains('Jorge Mendoza Ríos').should('be.visible');
    });
  });
});

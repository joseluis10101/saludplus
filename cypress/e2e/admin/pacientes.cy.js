describe('Admin · Gestión de pacientes (RF08-like / módulo administrativo)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/admin/pacientes');
  });

  it('lista los pacientes registrados', () => {
    cy.contains('h1', 'Pacientes').should('be.visible');
    cy.contains('6 pacientes registrados').should('be.visible');
    cy.contains('Carmen Vilca Apaza').should('be.visible');
    cy.contains('Luis Huamán Ruiz').should('be.visible');
  });

  it('crea un nuevo paciente desde el panel administrativo', () => {
    cy.contains('button', 'Nuevo paciente').click();

    cy.get('input[placeholder="Ej. María"]').type('Sofía');
    cy.get('input[placeholder="Ej. Salas Mendoza"]').type('Ramírez Díaz');
    cy.get('input[placeholder="12345678"]').type('50123456');
    cy.get('input[type="date"]').type('2000-06-15');
    cy.get('input[placeholder="paciente@correo.com"]').type('sofia.ramirez@example.com');
    cy.get('input[placeholder="9XXXXXXXX"]').type('922333444');

    cy.contains('button', 'Crear paciente').click();

    cy.contains('7 pacientes registrados').should('be.visible');
    cy.contains('Sofía Ramírez Díaz').scrollIntoView().should('be.visible');
  });

  it('edita los datos de contacto de un paciente existente', () => {
    cy.contains('tr', 'Carmen Vilca Apaza').find('button').click();
    cy.contains('button', 'Editar').click();

    cy.get('input[placeholder="9XXXXXXXX"]').clear().type('999888777');
    cy.contains('button', 'Guardar cambios').click();

    cy.contains('tr', 'Carmen Vilca Apaza').contains('999888777').should('be.visible');
  });
});

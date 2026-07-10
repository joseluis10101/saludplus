describe('Admin · Gestión de médicos (RF08)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/admin/medicos');
  });

  it('edita el teléfono de contacto de un médico', () => {
    cy.contains('tr', 'María Quispe Lara').find('button').click();
    cy.contains('button', 'Editar').click();

    cy.get('input[placeholder="9XXXXXXXX"]').clear().type('911000111');
    cy.contains('button', 'Guardar cambios').click();

    cy.contains('tr', 'María Quispe Lara').contains('911000111').should('be.visible');
  });

  it('desactiva un médico y deja de aparecer en la reserva de citas', () => {
    cy.contains('tr', 'Ana Torres Cáceres').find('button').click();
    cy.contains('button', 'Desactivar').click();

    cy.contains('tr', 'Ana Torres Cáceres').contains('inactivo').should('be.visible');

    // RF09: los médicos desactivados no deben ofrecerse en el módulo de reserva
    cy.visit('/paciente/login');
    cy.get('input[type="email"]').clear().type('carmen.vilca@gmail.com');
    cy.contains('button', 'Ingresar').click();
    cy.visit('/paciente/nueva-cita');

    cy.contains('button', 'Neurología').click();
    cy.contains('No hay médicos disponibles para esta especialidad.').should('be.visible');
  });
});

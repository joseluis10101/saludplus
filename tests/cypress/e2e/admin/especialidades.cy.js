describe('Admin · Gestión de especialidades (RF08)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/admin/especialidades');
  });

  it('lista las especialidades con su estado', () => {
    cy.contains('h1', 'Especialidades').should('be.visible');
    cy.contains('tr', 'Cardiología').contains('activo').should('be.visible');
    cy.contains('tr', 'Traumatología').contains('inactivo').should('be.visible');
  });

  it('crea una nueva especialidad', () => {
    cy.contains('button', 'Nueva especialidad').click();

    cy.get('input[placeholder="Ej. Cardiología"]').type('Oncología');
    cy.get('textarea').type('Diagnóstico y tratamiento del cáncer');

    cy.contains('button', 'Crear especialidad').click();

    cy.contains('tr', 'Oncología')
      .scrollIntoView()
      .within(() => {
        cy.contains('Diagnóstico y tratamiento del cáncer').should('be.visible');
        cy.contains('activo').should('be.visible');
      });
  });

  it('edita la descripción de una especialidad existente', () => {
    cy.contains('tr', 'Pediatría').find('button').click();
    cy.contains('button', 'Editar').click();

    cy.get('textarea').clear().type('Cuidado integral de niños, niñas y adolescentes');
    cy.contains('button', 'Guardar cambios').click();

    cy.contains('tr', 'Pediatría').contains('Cuidado integral de niños, niñas y adolescentes').should('be.visible');
  });

  it('desactiva una especialidad y deja de ofrecerse en la reserva de citas', () => {
    cy.contains('tr', 'Cardiología').find('button').click();
    cy.contains('button', 'Desactivar').click();
    cy.contains('tr', 'Cardiología').contains('inactivo').should('be.visible');

    cy.visit('/paciente/login');
    cy.get('input[type="email"]').clear().type('carmen.vilca@gmail.com');
    cy.contains('button', 'Ingresar').click();
    cy.visit('/paciente/nueva-cita');

    cy.contains('button', 'Cardiología').should('not.exist');
    cy.contains('button', 'Dermatología').should('be.visible');
  });

  it('reactiva una especialidad inactiva y vuelve a ofrecerse en la reserva de citas', () => {
    cy.contains('tr', 'Traumatología').find('button').click();
    cy.contains('button', 'Activar').click();
    cy.contains('tr', 'Traumatología').contains('activo').should('be.visible');

    cy.visit('/paciente/login');
    cy.get('input[type="email"]').clear().type('carmen.vilca@gmail.com');
    cy.contains('button', 'Ingresar').click();
    cy.visit('/paciente/nueva-cita');

    cy.contains('button', 'Traumatología').should('be.visible');
  });
});

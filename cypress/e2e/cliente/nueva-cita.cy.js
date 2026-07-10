describe('Reservar cita (RF02)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/paciente/login');
    cy.get('input[type="email"]').clear().type('carmen.vilca@gmail.com');
    cy.contains('button', 'Ingresar').click();
    cy.location('pathname').should('eq', '/paciente/citas');

    cy.visit('/paciente/nueva-cita');
  });

  it('reserva una cita eligiendo especialidad, médico, fecha y hora', () => {
    cy.contains('button', 'Cardiología').click();
    cy.contains('button', 'Dr(a). Carlos Paredes Vega').click();

    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 7);
    const fechaISO = fecha.toISOString().slice(0, 10);
    cy.get('input[type="date"]').type(fechaISO);

    cy.contains('button', '09:00').click();

    cy.contains('Confirmar cita').should('be.visible').click();

    cy.location('pathname').should('eq', '/paciente/citas');
    cy.contains('Cardiología').should('be.visible');
  });

  it('no ofrece un horario que ya está ocupado por otra cita', () => {
    // La cita sembrada #1 (Luis Huamán) ocupa Cardiología / Dr. Paredes / 2026-07-10 / 09:00
    cy.contains('button', 'Cardiología').click();
    cy.contains('button', 'Dr(a). Carlos Paredes Vega').click();
    cy.get('input[type="date"]').type('2026-07-10');

    cy.contains('button', '09:00').should('not.exist');
    cy.contains('button', '09:30').should('be.visible');
  });

  it('no muestra especialidades inactivas (RF08)', () => {
    // Traumatología está sembrada como inactiva y no debe aparecer en el módulo de reserva
    cy.contains('button', 'Traumatología').should('not.exist');
    cy.contains('button', 'Cardiología').should('be.visible');
  });
});

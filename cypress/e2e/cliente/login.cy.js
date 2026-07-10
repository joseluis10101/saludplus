describe('Login de paciente', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('inicia sesión con un correo registrado y va a mis citas', () => {
    cy.visit('/paciente/login');

    cy.get('input[type="email"]').clear().type('carmen.vilca@gmail.com');
    cy.contains('button', 'Ingresar').click();

    cy.location('pathname').should('eq', '/paciente/citas');
  });

  it('muestra error cuando el correo no existe', () => {
    cy.visit('/paciente/login');

    cy.get('input[type="email"]').clear().type('no.existe@example.com');
    cy.contains('button', 'Ingresar').click();

    cy.contains('No encontramos una cuenta con ese correo.').should('be.visible');
    cy.location('pathname').should('eq', '/paciente/login');
  });
});

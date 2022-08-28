export default {
    signUpButton() {
        return cy.get('[data-testid="regular-signup-submit"]');
    },
    emailBox() {
        return cy.get('input[name="email"]');
    },
    passwordBox() {
        return cy.get('input[name="password"]');
    },
    formGroup() {
        return cy.get('.form-group');
    },
    signInButton() {
        return cy.get('[data-testid="regular-login-submit"]');
    }
}
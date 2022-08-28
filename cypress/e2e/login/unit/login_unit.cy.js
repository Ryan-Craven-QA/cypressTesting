import SignUp from '../../../pages/signup.page';
import Common from '../../../pages/common.page';

const validEmail = 'testingemail@gmail.com';
const unregisteredEmail = 'PlsDontBeTakenEmail723@gmail.com';
const validPassword = 'T3st1ng!';
const wrongPassword = 'Wr0ngT3st1ng';

describe('When a user attempts to ', () => {
    beforeEach(() => {
        cy.visit('/login');

        // There's an uncaught exception with the grecaptcha.  In order to proceed with test, I need to ignore this
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });
    });

    // Negative testing login fields.  This would be more of a unit/integration test, not an E2E test
    // That's why I broke these tests out of the true signup work flow
    it('log in with blank fields', () => {
        SignUp.formGroup().within(() => {
            // Blank email
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'Please fill out this field.');
            SignUp.passwordBox().invoke('prop', 'validationMessage')
                .should('equal', 'Please fill out this field.');
        })
    });

    it('log in with invalid credentials', () => {
        // Valid Email with wrong password
        SignUp.emailBox().clear();
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().clear();
        SignUp.passwordBox().type(wrongPassword);
        SignUp.signInButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', 'Invalid email / password combination');
        // Wrong email but a valid password
        cy.reload();
        SignUp.emailBox().clear();
        SignUp.emailBox().type(unregisteredEmail);
        SignUp.passwordBox().clear();
        SignUp.passwordBox().type(validPassword);
        SignUp.signInButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', 'Invalid email / password combination');
    });
})
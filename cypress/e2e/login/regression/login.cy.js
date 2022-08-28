import SignUp from "../../../pages/signup.page";
import CommonPage from "../../../pages/common.page";
import DownloadPage from "../../../pages/download.page";
import signupPage from "../../../pages/signup.page";

const validEmail = 'testingemail@gmail.com';
const validPassword = 'T3st1ng!';
const loginURL = 'https://share.getcloudapp.com/login';
const dashboardURL = 'https://share.getcloudapp.com/dashboard';

describe('When a user attempts to ', () => {
    beforeEach(() => {
        cy.intercept('POST', 'https://share.getcloudapp.com/api/v4/account?**').as('accountCreation');
        cy.intercept('GET', 'https://share.getcloudapp.com/api/v5/organizations/**').as('getAccountInfo');
        cy.visit('/');
        // There's an uncaught exception with the grecaptcha.  In order to proceed with testing, I need to ignore this
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });
    });

    it('login with a valid email and password', () => {
        // Clicks login link
        cy.get('a:visible').contains('Log in').click();
        cy.url({timeout: 10000}).should('include',loginURL);
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(validPassword);
        signupPage.signInButton().click();
        cy.url({timeout: 10000}).should('include',dashboardURL);

    });

});
import SignUp from '../../../pages/signup.page';
import CommonPage from "../../../pages/common.page";
import DownloadPage from "../../../pages/download.page";

const validPassword = 'T3st1ng!';
const loginURL = 'https://share.getcloudapp.com/login';
const userEmail = `userEmail_${Math.random()*1e5}@gmail.com`;
const signUpDownloadEmail = 'https://share.getcloudapp.com/onboarding/downloads?';


/*
* This test follows the full flow of a user attempting to sign up on the website
* Randomized email generation because I couldn't make an API call to delete after completed
* And to be a true E2E test, I didn't want to fake the data
*
* One interesting thing I noticed was the user gets redirected to a download page rather than the dashboard
* Because I don't know the proper workflow - I assumed this is correct
*
* Another assumption I made was the user may not be aware of the https://share.getcloudapp.com/signup website
* Therefore, I went through the route as if the user navigated to https://www.getcloudapp.com/ first
* */
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

    it('sign up with a valid email and password', () => {
        // Clicks login link
        cy.get('a:visible').contains('Log in').click();
        cy.url({timeout: 10000}).should('include',loginURL);
        // Clicks Sign up for free link
        cy.get('a:visible').contains('Sign up for free').click();
        SignUp.signUpButton()
            .should('contain.value', 'Sign up');
        SignUp.emailBox().type(userEmail);
        SignUp.passwordBox().type(validPassword);
        SignUp.signUpButton().click();
        cy.wait('@accountCreation').then((resp) => {
            expect(resp.response.statusCode).to.eq(200)
        });
        CommonPage.toastSuccess('Account created successfully');
        cy.wait('@getAccountInfo').then((resp) => {
            expect(resp.response.statusCode).to.eq(200)
        });
        cy.url({timeout: 10000}).should('include',signUpDownloadEmail);
        DownloadPage.pageTitle().should('contain', 'Start creating now');
    });
});
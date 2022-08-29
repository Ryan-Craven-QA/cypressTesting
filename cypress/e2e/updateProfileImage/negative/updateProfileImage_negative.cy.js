import SignUp from "../../../pages/signup.page";
import signupPage from "../../../pages/signup.page";
import ProfilePage from "../../../pages/profile.page";
import Common from "../../../pages/common.page";

const validEmail = 'testingemail@gmail.com';
const validPassword = 'T3st1ng!';
const dashboardURL = 'https://share.getcloudapp.com/dashboard';
const profileSettingURL = 'account/settings#profile';

describe('When a user attempts to ', () => {
    beforeEach(() => {
        cy.intercept('POST', 'https://share.getcloudapp.com/api/v4/account?**').as('accountCreation');
        cy.intercept('GET', 'https://share.getcloudapp.com/api/v5/organizations/**').as('getAccountInfo');
        cy.visit('/login');
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(validPassword);
        signupPage.signInButton().click();
        cy.url({timeout: 10000}).should('include',dashboardURL);
        // There's an uncaught exception with the grecaptcha.  In order to proceed with testing, I need to ignore this
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });
        cy.intercept('POST', 'https://share.getcloudapp.com/accounts/?**').as('accountUpdate');

    });

    it('update their profile with an image that is the wrong size', () => {
        ProfilePage.profileButton().click();
        ProfilePage.profileSettings().click();
        cy.url( {timeout: 10000}).should('include', profileSettingURL);
        ProfilePage.profileSettingOption().click();
        ProfilePage.profileSettingOption().should('have.class', 'active');
        ProfilePage.chooseImage().click();
        cy.get('input[type="file"]')
            .attachFile("largeImage.jpg");
        ProfilePage.submitButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', "Avatar Max size is 500x500px");
        cy.wait('@accountUpdate').then((resp) => {
            expect(resp.response.statusCode).to.eq(422)
        });
    });

    // I made up the error message here.  I see the file type isn't supported
    // However, the toast message doesn't display why the user couldn't load the file type
    it('update their profile with an svg image', () => {
        ProfilePage.profileButton().click();
        ProfilePage.profileSettings().click();
        cy.url( {timeout: 10000}).should('include', profileSettingURL);
        ProfilePage.profileSettingOption().click();
        ProfilePage.profileSettingOption().should('have.class', 'active');
        ProfilePage.chooseImage().click();
        cy.get('input[type="file"]')
            .attachFile("postman.svg");
        ProfilePage.submitButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', "Image type isn't supported");
        cy.wait('@accountUpdate').then((resp) => {
            expect(resp.response.statusCode).to.eq(422)
        });
    });
});
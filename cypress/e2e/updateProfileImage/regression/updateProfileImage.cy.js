import SignUp from "../../../pages/signup.page";
import signupPage from "../../../pages/signup.page";
import ProfilePage from "../../../pages/profile.page";
import CommonPage from "../../../pages/common.page";

const validEmail = 'testingemail@gmail.com';
const validPassword = 'T3st1ng!';
const dashboardURL = 'https://share.getcloudapp.com/dashboard';
const profileSettingURL = 'account/settings#profile';

describe('When a user attempts to ', () => {
    beforeEach(() => {
        cy.intercept('POST', 'https://share.getcloudapp.com/api/v4/account?**').as('accountCreation');
        cy.intercept('GET', 'https://share.getcloudapp.com/api/v5/organizations/**').as('getAccountInfo');
        cy.intercept('POST', 'https://share.getcloudapp.com/accounts/?**').as('accountUpdate');
        cy.visit('/login');
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(validPassword);
        signupPage.signInButton().click();
        cy.url({timeout: 10000}).should('include',dashboardURL);
        // There's an uncaught exception with the grecaptcha.  In order to proceed with testing, I need to ignore this
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });
    });

    // Resetting back image to a known good starting point
    afterEach( () => {
        cy.reload();
        ProfilePage.chooseImage().click();
        cy.get('input[type="file"]')
            .attachFile("robot_good.jpeg");
        ProfilePage.submitButton().click();
    })

    // Happy path to updating profile picture - Only used a known good image
    // There's a visual defect once the user clicks submit, there are 2 toast messages displayed rather than one
    // There's a .toast-body message as well as a .b-toast-success message
    it('update their profile image', () => {
        ProfilePage.profileButton().click();
        ProfilePage.profileSettings().click();
        cy.url( {timeout: 10000}).should('include', profileSettingURL);
        ProfilePage.profileSettingOption().click();
        ProfilePage.profileSettingOption().should('have.class', 'active');
        ProfilePage.chooseImage().click();
        cy.get('input[type="file"]')
            .attachFile("cartoonPic.png");
        ProfilePage.submitButton().click();
        cy.wait('@accountUpdate').then((resp) => {
            expect(resp.response.statusCode).to.eq(302)
        });
        CommonPage.toastSuccess('Account updated successfully');
    });

    it('update their profile image to a gif', () => {
        ProfilePage.profileButton().click();
        ProfilePage.profileSettings().click();
        cy.url( {timeout: 10000}).should('include', profileSettingURL);
        ProfilePage.profileSettingOption().click();
        ProfilePage.profileSettingOption().should('have.class', 'active');
        ProfilePage.chooseImage().click();
        cy.get('input[type="file"]')
            .attachFile("crossy.gif");
        ProfilePage.submitButton().click();
        cy.wait('@accountUpdate').then((resp) => {
            expect(resp.response.statusCode).to.eq(302)
        });
        CommonPage.toastSuccess('Account updated successfully');
    });
});
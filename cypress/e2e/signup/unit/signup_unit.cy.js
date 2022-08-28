import SignUp from '../../../pages/signup.page';
import Common from '../../../pages/common.page';

const longEmail = 'ThisEmailShouldNotWorkBecauseItIsLongerThanATotalOfTwoHundredAndFiftySixCharactersWhichShouldThrowAnErrorMessageIndicatingThatTheEmailIsTooLongButIJustNeedToMakeItALittleMoreLongerBecauseItsStillALittleTooShortThankfullyCharacterCounterIsHelpingOut@gmail.com';
const validEmail = 'PlsDontBeTakenEmail723@gmail.com';
const validPassword = 'T3st1ng!';
const shortPassword = 'T3st1ng';
const passwordNoNumber = 'TESTingPASSword';
const passwordNoUpper = 'testing12345';
const passwordNoLower = 'TESTING12345';
const passwordNumber = '1234567890';
const passwordUppercased = 'TESTINGPASSWORD';
const passwordLowercased = 'testingpassword';
const passwordErrorMessage = 'Validation failed: Password must be at least 8 characters long, contain uppercase and lowercase letters and a number.';

describe('When a user attempts to ', () => {
    beforeEach(() => {
        cy.visit('/signup');

        // There's an uncaught exception with the grecaptcha.  In order to proceed with test, I need to ignore this
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        });
    });

    // Negative testing email field: This would be more of a unit/integration test, not an E2E test
    // That's why I broke these tests out of the true signup work flow
    it('sign up with an invalid email', () => {
        SignUp.formGroup().within(() => {
            // Blank email
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'Please fill out this field.');
            // Email has no @
            SignUp.emailBox().type('NotValid');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'Please include an \'@\' in the email address. \'NotValid\' is missing an \'@\'.');
            // Invalid email with two @s
            SignUp.emailBox().clear();
            SignUp.emailBox().type('Not@@Valid');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part following \'@\' should not contain the symbol \'@\'.');
            // Invalid email with spaces
            SignUp.emailBox().clear();
            SignUp.emailBox().invoke('val', 'testing    @       gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \' \'.');
            // Invalid domain at the end - missing .com
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail@gmail.');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', '\'.\' is used at a wrong position in \'gmail.\'.');
            // Invalid symbol - (
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail(@gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \'(\'.');
            // Invalid symbol - )
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail)@gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \')\'.');
            // Invalid symbol - ,
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail,@gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \',\'.');
            // Invalid symbol - :
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail:@gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \':\'.');
            // Invalid symbol - ;
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail;@gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \';\'.');
            // Invalid symbol - <
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail<@gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \'<\'.');
            // Invalid symbol - >
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail>@gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \'>\'.');
            // Invalid symbol - [
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail[@gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \'[\'.');
            // Invalid symbol - ]
            SignUp.emailBox().clear();
            SignUp.emailBox().type('NotAnEmail]@gmail.com');
            SignUp.emailBox().invoke('prop', 'validationMessage')
                .should('equal', 'A part followed by \'@\' should not contain the symbol \']\'.');
        })
    });

    // Email that's greater than 256 characters
    it('signs up with an email that is too long', () => {
        SignUp.emailBox().clear();
        SignUp.emailBox().type(longEmail);
        SignUp.passwordBox().type(validPassword);
        SignUp.signUpButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', 'Validation failed: Email is too long (maximum is 255 characters)');
    });

    // TO-DO
    // Not sure what requirement in terms of length are being applied to passwords, so no text for max boundary + 1
    // Used cy.reload to reload the page to remove the toast message for proper verification, because without this
    // There may be false passes because the toast message is still visible
    it('signs up with an invalid passwords', () => {
        // No Password
        SignUp.passwordBox().invoke('prop', 'validationMessage')
            .should('equal', 'Please fill out this field.');
        // Short password
        SignUp.emailBox().clear();
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(shortPassword);
        SignUp.signUpButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', passwordErrorMessage);
        // Testing spaces only
        cy.reload();
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type('        ');
        SignUp.signUpButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', `Password can't be blank`);
        //No Number
        cy.reload();
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(passwordNoNumber);
        SignUp.signUpButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', passwordErrorMessage);
        //No Uppercase
        cy.reload();
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(passwordNoUpper);
        SignUp.signUpButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', passwordErrorMessage);
        //No Lowercase
        cy.reload();
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(passwordNoLower);
        SignUp.signUpButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', passwordErrorMessage);
        // Numbers only
        cy.reload();
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(passwordNumber);
        SignUp.signUpButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', passwordErrorMessage);
        // Uppercase only
        cy.reload();
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(passwordUppercased);
        SignUp.signUpButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', passwordErrorMessage);
        // Lowercase only
        cy.reload();
        SignUp.emailBox().type(validEmail);
        SignUp.passwordBox().type(passwordLowercased);
        SignUp.signUpButton().click();
        Common.alertDangerToast()
            .should('be.visible')
            .should('contain.text', passwordErrorMessage);
    });
})
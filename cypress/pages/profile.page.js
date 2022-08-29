export default {
    profileButton() {
        return cy.get('[id="avatar"]');
    },
    profileSettings() {
        return cy.get('[data-testid="dropdown-link-settings"]');
    },
    profileSettingOption() {
        return cy.get('[data-testid="profile-settings"]');
    },
    profileTitle() {
        return cy.get('[id="profile"]');
    },
    chooseImage() {
        return cy.get('[id="user_avatar"]');
    },
    submitButton() {
        return cy.get('[data-testid="onboarding-submit-about-you-form"]');
    }
}
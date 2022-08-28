export default {
    alertDangerToast() {
        return cy.get('.alert-danger');
    },
    toastSuccess(message) {
        return cy.contains('.b-toast-success', message);
    }
}
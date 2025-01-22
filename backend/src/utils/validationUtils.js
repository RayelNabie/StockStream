/**
 * Helperfunctie om een veld te valideren.
 * @param {string} field - De naam van het veld.
 * @param {boolean} condition - De validatievoorwaarde.
 * @param {string} errorMessage - De foutmelding.
 * @param {Array} errors - De array waarin fouten worden opgeslagen.
 */
export const validateField = (field, condition, errorMessage, errors) => {
    if (!condition) {
      errors.push({ field, message: errorMessage });
    }
  };
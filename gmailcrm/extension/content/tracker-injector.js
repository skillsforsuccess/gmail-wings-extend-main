export function wireTrackingButtons(root = document) {
  const buttons = root.querySelectorAll('[data-gmailcrm-button="track-email"]');

  buttons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    if (button.dataset.gmailcrmBound === 'true') return;

    button.dataset.gmailcrmBound = 'true';
    button.addEventListener('click', () => {
      // Placeholder for future tracking payload injection.
      console.info('GmailCRM: tracking clicked');
    });
  });

  return buttons.length;
}

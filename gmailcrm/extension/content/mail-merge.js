export function wireMailMergeButtons(root = document) {
  const buttons = root.querySelectorAll('[data-gmailcrm-button="mail-merge"]');

  buttons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    if (button.dataset.gmailcrmBound === 'true') return;

    button.dataset.gmailcrmBound = 'true';
    button.addEventListener('click', () => {
      // Placeholder for future mail merge workflow.
      console.info('GmailCRM: mail merge clicked');
    });
  });

  return buttons.length;
}

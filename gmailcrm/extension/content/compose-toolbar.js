const COMPOSE_SELECTORS = [
  'div[role="dialog"] div[aria-label="Message Body"]',
  'div[role="dialog"] .Am.Al.editable',
  'div[gh="cm"] div[aria-label="Message Body"]'
];

function createButton(label, id) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'gmailcrm-compose-button';
  button.dataset.gmailcrmButton = id;
  button.textContent = label;
  return button;
}

function ensureToolbar(composeBody) {
  if (!composeBody || !(composeBody instanceof HTMLElement)) return null;

  const composeRoot = composeBody.closest('div[role="dialog"], div[gh="cm"]') || composeBody.parentElement;
  if (!composeRoot) return null;

  const existing = composeRoot.querySelector('[data-gmailcrm-compose-toolbar="true"]');
  if (existing) return existing;

  const toolbar = document.createElement('div');
  toolbar.dataset.gmailcrmComposeToolbar = 'true';
  toolbar.className = 'gmailcrm-compose-toolbar';

  toolbar.append(createButton('Add to CRM', 'add-to-crm'));
  toolbar.append(createButton('Track Email', 'track-email'));
  toolbar.append(createButton('Mail Merge', 'mail-merge'));

  composeBody.parentElement?.insertBefore(toolbar, composeBody);
  return toolbar;
}

export function detectComposeContainers(root = document) {
  const found = new Set();

  COMPOSE_SELECTORS.forEach((selector) => {
    root.querySelectorAll(selector).forEach((node) => {
      if (node instanceof HTMLElement) {
        found.add(node);
      }
    });
  });

  return [...found];
}

export function attachComposeToolbar(root = document) {
  const composeContainers = detectComposeContainers(root);
  composeContainers.forEach((composeBody) => ensureToolbar(composeBody));
  return composeContainers.length;
}

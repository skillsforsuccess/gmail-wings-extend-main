const THREAD_SELECTORS = [
  'div[role="main"] .aeF',
  'div[role="main"] .aia',
  'div[role="main"] .if',
  'div[role="main"] .ii.gt'
];

function ensureSidebarRoot(threadContainer) {
  if (!threadContainer || !(threadContainer instanceof HTMLElement)) return null;

  const existing = threadContainer.querySelector('[data-gmailcrm-sidebar="true"]');
  if (existing) return existing;

  const sidebar = document.createElement('aside');
  sidebar.dataset.gmailcrmSidebar = 'true';
  sidebar.className = 'gmailcrm-sidebar';
  sidebar.innerHTML = `
    <div class="gmailcrm-sidebar__header">GmailCRM</div>
    <div class="gmailcrm-sidebar__body">CRM sidebar ready.</div>
  `;

  threadContainer.appendChild(sidebar);
  return sidebar;
}

export function detectThreadContainers(root = document) {
  const found = new Set();

  THREAD_SELECTORS.forEach((selector) => {
    root.querySelectorAll(selector).forEach((node) => {
      if (node instanceof HTMLElement) {
        found.add(node);
      }
    });
  });

  return [...found];
}

export function attachSidebarToThreads(root = document) {
  const threadContainers = detectThreadContainers(root);
  threadContainers.forEach((container) => ensureSidebarRoot(container));
  return threadContainers.length;
}

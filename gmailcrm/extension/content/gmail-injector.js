(async () => {
  const DEFAULT_API_URL = 'http://localhost:3001';
  const NAV_ROOT_SELECTOR = '[role="navigation"]';

  const modules = {
    sidebar: null,
    compose: null,
    mailMerge: null,
    tracking: null
  };

  async function loadModules() {
    if (modules.sidebar) return modules;

    const [sidebar, compose, mailMerge, tracking] = await Promise.all([
      import(chrome.runtime.getURL('content/sidebar.js')),
      import(chrome.runtime.getURL('content/compose-toolbar.js')),
      import(chrome.runtime.getURL('content/mail-merge.js')),
      import(chrome.runtime.getURL('content/tracker-injector.js'))
    ]);

    modules.sidebar = sidebar;
    modules.compose = compose;
    modules.mailMerge = mailMerge;
    modules.tracking = tracking;

    return modules;
  }

  function ensureDefaultApiUrl() {
    if (!chrome?.storage?.local) return;

    chrome.storage.local.get('gmailcrm_api_url', (result) => {
      if (chrome.runtime.lastError) {
        console.warn('GmailCRM: unable to read storage', chrome.runtime.lastError.message);
        return;
      }

      if (!result.gmailcrm_api_url) {
        chrome.storage.local.set({ gmailcrm_api_url: DEFAULT_API_URL });
      }
    });
  }

  function waitForNavigationRoot() {
    return new Promise((resolve) => {
      const existingRoot = document.querySelector(NAV_ROOT_SELECTOR);
      if (existingRoot) {
        resolve(existingRoot);
        return;
      }

      const observer = new MutationObserver(() => {
        const navRoot = document.querySelector(NAV_ROOT_SELECTOR);
        if (!navRoot) return;

        observer.disconnect();
        resolve(navRoot);
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function runHooks(targetRoot, loadedModules) {
    loadedModules.sidebar.attachSidebarToThreads(targetRoot);
    loadedModules.compose.attachComposeToolbar(targetRoot);
    loadedModules.mailMerge.wireMailMergeButtons(targetRoot);
    loadedModules.tracking.wireTrackingButtons(targetRoot);
  }

  async function init() {
    ensureDefaultApiUrl();
    await waitForNavigationRoot();

    const loadedModules = await loadModules();
    runHooks(document, loadedModules);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            runHooks(node, loadedModules);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.info('GmailCRM injector started');
  }

  init().catch((error) => {
    console.error('GmailCRM injector failed', error);
  });
})();

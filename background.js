chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isEnabled: false });
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle-content-script") {
        chrome.storage.local.get(['isEnabled'], (result) => {
            const isEnabled = !result.isEnabled;
            chrome.storage.local.set({ isEnabled }, () => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    for (const tab of tabs) {
                        chrome.tabs.reload(tab.id);
                        break;
                    }
                });
            });
        });
    }
});

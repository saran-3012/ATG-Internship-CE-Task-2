let profileLinks = [];

function closeAllTabs(openedTabs) {
    for (let tab of openedTabs) {
        chrome.tabs.remove(tab);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startScraping') {
        profileLinks = message.profileLinks;
        openNextLink();
    } else if (message.action === 'profileScraped') {
        handleProfileScraped(message.profile, sender.tab.id);
    } else if (message.action === 'nextProfile') {
        profileLinks = message.profileLinks;
        openNextLink();
    }
});

function openNextLink() {
    if (profileLinks.length) {
        const nextProfileUrl = profileLinks.shift();
        chrome.tabs.create({ url: nextProfileUrl }, (tab) => {
            const listener = (tabId, info) => {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.sendMessage(tabId, { action: 'scrapeProfile' });
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            };
            chrome.tabs.onUpdated.addListener(listener);
        });
    } else {
        chrome.storage.local.get(['openedTabs'], (result) => {
            const openedTabs = result.openedTabs || [];
            closeAllTabs(openedTabs); 
            chrome.storage.local.set({ openedTabs: [] });
        });
        console.log('Scraping complete');
    }
}

function handleProfileScraped(profile, tabId) {
    console.log(profile);

    fetch('http://localhost:8000/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Profile saved:', data);
    });

    chrome.storage.local.get(['openedTabs'], (result) => {
        const openedTabs = result.openedTabs || [];
        openedTabs.push(tabId);
        chrome.storage.local.set({ openedTabs });
    });

    chrome.storage.local.set({ profileLinks }, () => {
        chrome.runtime.sendMessage({ action: 'nextProfile', profileLinks });
    });
}
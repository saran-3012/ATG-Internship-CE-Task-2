chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'scrapeProfile') {
        try {
            const profile = {
                url: window.location.href,
                name: document.querySelector('h1.text-heading-xlarge.inline.break-words')?.innerText || '',
                about: document.querySelector('div.display-flex.ph5.pv3 > div.display-flex.full-width > div.display-flex.align-items-center > div.full-width > span')?.innerText || '',
                bio: document.querySelector('div.text-body-medium.break-words')?.innerText || '',
                location: document.querySelector('span.text-body-small.inline.t-black--light.break-words')?.innerText || '',
                followerCount: parseInt(document.querySelector('li.text-body-small > span.t-bold')?.innerText || '0'),
                connectionCount: parseInt(document.querySelector('li.text-body-small > a.ember-view > span > span.t-bold')?.innerText || '0')
            };
            console.log(profile);
            chrome.runtime.sendMessage({ action: 'profileScraped', profile });
        } catch (error) {
            console.error('Error scraping profile:', error);
            chrome.runtime.sendMessage({ action: 'profileScraped', profile: null, error: error.message });
        }
    }
});

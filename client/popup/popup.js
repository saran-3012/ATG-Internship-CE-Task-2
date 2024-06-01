const addProfileBtn = document.querySelector('#add_btn');
const profileLinkForm = document.querySelector('#url_from');
const urlInput = document.querySelector('#url_input');
const urlSubmit = document.querySelector('#url_submit');
const startScraping = document.querySelector('#start_scraping');
const linkContainer = document.querySelector('#link_container');

// Load stored profile links on popup open
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['profileLinks'], (result) => {
        const profileLinks = result.profileLinks || [];
        updateLinks(profileLinks);
    });
});

const toggleForm = () => {
    profileLinkForm.style.display = (profileLinkForm.style.display === 'none') ? 'flex' : 'none';
    urlInput.focus();
};

addProfileBtn.addEventListener('click', () => {
    toggleForm();
});

const updateLinks = (profileLinks) => {
    linkContainer.innerHTML = profileLinks.map((l) => `<span>${l}</span>`).join('');
};

urlSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    if (url) {
        chrome.storage.local.get(['profileLinks'], (result) => {
            const profileLinks = result.profileLinks || [];
            profileLinks.push(url);
            chrome.storage.local.set({ profileLinks }, () => {
                urlInput.value = '';
                toggleForm();
                updateLinks(profileLinks);
            });
        });
    }
});

startScraping.addEventListener('click', () => {
    chrome.storage.local.get(['profileLinks'], (result) => {
        const profileLinks = result.profileLinks || [];
        if (profileLinks.length === 0) {
            console.log("No links are added!");
            return;
        }
        chrome.runtime.sendMessage({ action: 'startScraping', profileLinks });
    });
});

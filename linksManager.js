
const linkList = document.querySelector('.links');
const savedLinks = JSON.parse(localStorage.getItem('links')) || [];



savedLinks.forEach(item => {
    addLinkField(item.link, item.label);
});

function addLinkField(link = '', label = '') {
    // Посилання
    const linkItem = document.createElement('a');
    linkItem.setAttribute('href', link);
    linkItem.setAttribute('target', '_blank');
    linkItem.textContent = label;
    linkList.appendChild(linkItem);
}


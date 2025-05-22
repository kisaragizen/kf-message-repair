// ==UserScript==
// @name         kf私信格式恢复
// @namespace    https://github.com/kisaragizen/kf-message-repair
// @version      1.0.0
// @description  恢复因quote截断img导致的私信显示错误
// @author       kisaragizen
// @match        https://bbs.kfpromax.com/message.php?action=read*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        const pairedElements = [...document.querySelectorAll('img')]
            .filter(img => img.src.includes('[/quote]'))
            .map(img => {
                const siblings = [];
                let prevNode = img.previousSibling;
                while (prevNode) {
                    siblings.push(prevNode);
                    if (prevNode.textContent.trim().startsWith('[quote]')) {
                        break;
                    }
                    prevNode = prevNode.previousSibling;
                }
                return {
                    img: img,
                    siblings: siblings
                };
            });

        pairedElements.forEach(pair => {
            const { img, siblings } = pair;
            const originalURL = img.src.split('[img]')[1];
            const decodedContent = decodeURIComponent(img.src.split('[/quote]')[1].split('[img]')[0]);

            const layer00 = document.createElement('fieldset');
            const layer10 = document.createElement('legend');
            layer10.innerHTML = 'Quote:';
            layer00.appendChild(layer10);
            const newSiblings = siblings.reverse();
            newSiblings[0].textContent = newSiblings[0].textContent.replace('[quote]', '');
            for (let x of newSiblings) {
                layer00.appendChild(x);
            }
            img.insertAdjacentElement('beforebegin', layer00);

            const originalImg = document.createElement('img');
            originalImg.src = originalURL;
            img.insertAdjacentElement('afterend', originalImg);
            img.outerHTML = decodedContent;
        });
    });
})();

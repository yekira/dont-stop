function fixNode(node) {
    const parent = node.parentElement;
    // 親要素が存在しないなら処理しない
    if (!parent) {
        return;
    }
    // 親要素がtitleかcssかjsだったら処理しない
    if (['title','style', 'script', 'noscript'].includes(parent.tagName.toLowerCase())) {
        return;
    }
    // そもそもテキストではない場合は処理しない
    if (node.nodeType !== Node.TEXT_NODE) {
        return;
    }
    // 空のテキストは処理しない
    if (!node.textContent.trim()) {
        return;
    }
    // すでにドット化されていたら処理しない
    if (/^[\.\s]+$/g.test(node.textContent)) {
        return;
    }
    node.textContent = node.textContent.replace(/\S/g, '.');
}

function fixNodeLoop(root) {
    for (const node of root.childNodes) {
        fixNodeLoop(node);
        fixNode(node);
    }
}

function launch() {
    const html = document.querySelector('html');

    fixNodeLoop(html);

    const observer = new MutationObserver((records, observer) => {
        for (const record of records) {
            fixNodeLoop(record.target);
        }
    });
    observer.observe(html, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
    });
}

chrome.storage.local.get(['isEnabled'], (result) => {
    if (result.isEnabled) {
        launch();
    }
});

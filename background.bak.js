let speed;
let distance;
let cache = {};
let tab;

self.addEventListener("activate", (event) => {
    event.waitUntil(childPromise(tab));
});

function childPromise(tab) {
    const rejectTime = 6000;
    return new Promise((resolve, reject) => {
        console.log("promise");
        let children = 0;
        let newChildren = 0;
        let watcher;

        chrome.scripting.executeScript({
            target: {
                tabId: tab.id,
            },
            args: [],
            func: () => {
                const targetNode = document.querySelector("body");
                const config = { childList: true, subtree: true };
                const callback = function (mutationList) {
                    for (const mutation of mutationList) {
                        if (mutation.type === "childList") {
                            newChildren++;
                            console.log("everything is cool");
                        }
                    }
                };
                const observer = new MutationObserver(callback);
                observer.observe(targetNode, config);
            },
        });

        watcher = setInterval(() => {
            console.log("watcher");
            if (newChildren == children) {
                console.log("page loaded");
                observer.disconnect();
                clearInterval(watcher);
                reject("Done");
            } else children = newChildren;
        }, rejectTime);
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (isScroll == false) {
    }
});

document.addEventListener("DOMContentLoaded", load_all);

self.registration.unregister();

if (Object.keys(data).length !== keys.length) {
    for (let key of keys) if (!(key in data)) error.push(key);
    throw error.toString() + " keys do not exist.";
}

import { storage, action, tab } from "./chrome-utils.js";

let tabId;
let scroller;
let badge;

chrome.runtime.onInstalled.addListener(async () => {
    await storage.saveLocal({
        speed: 100,
        distance: 10,
    });
});
chrome.action.onClicked.addListener(async (tab) => {
    if (tabId == null) tabId = (await restore()) ?? tab.id;
    badge = await action.getBadgeText({ tabId: tabId });

    if (tabId == tab.id && badge == "On") {
        await stopScroll();
    } else if (tabId == tab.id && badge != "On") {
        scroll();
    } else if (badge == "On") {
        await stopScroll();
        tabId = tab.id;
        scroll();
    } else {
        tabId = tab.id;
        scroll();
    }
});

async function scroll() {
    let data = await storage.getLocal(["speed", "distance"]);
    scroller = await chrome.scripting
        .executeScript({
            target: {
                tabId: tabId,
            },
            args: [data.speed, data.distance],
            func: (speed, distance) => {
                return setInterval(() => {
                    scrollTo(scrollX, scrollY + distance);
                }, 101 - speed);
            },
        })
        .then((res) => {
            return res[0].result;
        });
    await action.setIcon({ path: "mouse-off-48.png", tabId: tabId });
    await action.setBadgeText({ text: "On", tabId: tabId });
    await storage.saveLocal({
        tabId: tabId,
        scroller: scroller,
    });
}

const stopScroll = async () => {
    console.log(scroller + tabId);
    if (await isTab(tabId)) {
        await chrome.scripting
            .executeScript({
                target: {
                    tabId: tabId,
                },
                args: [scroller],
                func: (scroller) => {
                    clearInterval(scroller);
                },
            })
            .catch((e) => {
                console.log(e);
            });
        await action.setIcon({
            path: "mouse-48.png",
            tabId: tabId,
        });
        await action.setBadgeText({ text: "Off", tabId: tabId });
    }
};

const restore = async () => {
    let last_session = await storage.getLocal(["tabId", "scroller"]);
    if (await isTab(last_session.tabId)) {
        tabId = last_session.tabId;
        scroller = last_session.scroller;
        return tabId;
    }
    return null;
};

const isTab = async (tabId) => {
    return await tab.get(tabId).catch(() => {
        return false;
    });
};

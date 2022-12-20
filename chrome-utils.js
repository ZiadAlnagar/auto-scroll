//* Local Storage Utils
class storage {
    static saveLocal = async (keys) => {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.set(keys, () => {
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    static getLocal = async (keys) => {
        let error = [];
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.get(keys, (data) => {
                    resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    // string | string[]
    static removeLocal = async (keys) => {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.local.remove(keys, () => {
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    };
}

//* Action Utils
class action {
    static DEFAULT_ICONS_PATH = "./icons/";

    // options: imageData, path, tabId
    static setIcon = async (options, useDefaultLoc = true) => {
        if (options.path != null && useDefaultLoc) options.path = this.DEFAULT_ICONS_PATH + options.path;

        return new Promise((resolve, reject) => {
            try {
                chrome.action.setIcon(options, () => {
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    // options: tabId, text*
    static setBadgeText = async (options) => {
        return new Promise((resolve, reject) => {
            try {
                chrome.action.setBadgeText(options, () => {
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    // options: tabId
    static getBadgeText = async (options) => {
        return new Promise((resolve, reject) => {
            try {
                chrome.action.getBadgeText(options, (result) => {
                    resolve(result);
                });
            } catch (e) {
                reject(e);
            }
        });
    };
}

class tab {
    static get = async (options) => {
        return new Promise((resolve, reject) => {
            try {
                chrome.tabs.get(options, (result) => {
                    if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message);
                    resolve(result);
                });
            } catch (e) {
                reject(e);
            }
        });
    };
}

export { storage, action, tab };

const saveLocal = storage.saveLocal;
const getLocal = storage.getLocal;
const removeLocal = storage.removeLocal;
export { saveLocal, getLocal, removeLocal };

const setIcon = action.setIcon;
const setBadgeText = action.setBadgeText;
const getBadgeText = action.getBadgeText;
export { setIcon, setBadgeText, getBadgeText };

const getTab = tab.get;
export { getTab };

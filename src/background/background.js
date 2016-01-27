/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 25/01/2016
 */

var manifest = chrome.runtime.getManifest();

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.newHost) {
        openHost(request.newHost);
        if (request.newName) {
            var hosts = lsRead();
            var action = 'Launch';
            if (_.findIndex(hosts, {hostname: request.newHost, name: request.newName}) == -1) {
                hosts.unshift({
                    name: request.newName,
                    hostname: request.newHost,
                    lastMod: Date.now()
                });
                lsWrite(hosts);
                action += ' & Save';
            }
            chrome.notifications.create('expense_' + Date.now(), {
                type: 'basic',
                title: action + ' Host: ' + request.newName,
                message: 'Registered hostname:\n' + request.newHost,
                iconUrl: manifest.icons['128']
            }, _.noop);
        }
    }
});

function lsRead() {
    // If hosts exists in ls:
    if (localStorage.hosts) {
        try {
            // Parse and write:
            var tempHosts = JSON.parse(localStorage.hosts);
            if (_.isArray(tempHosts))return tempHosts;
        } catch (e) {
            // If failed, return empty arr:
            return [];
        }
    } else { // If missing, go empty:
        return [];
    }
}

function lsWrite(hosts) {
    localStorage.hosts = JSON.stringify(hosts);
}

function openHost(hostname) {

    chrome.tabs.create({
        url: 'ssh://' + (hostname).replace('ssh://', ''),
        active: false
    }, function (tab) {
        setTimeout(function () {
            chrome.tabs.remove(tab.id)
        }, 2000)
    });

    console.log('Launch ' + hostname);
}
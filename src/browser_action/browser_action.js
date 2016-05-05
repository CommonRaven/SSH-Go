/**
 * Created by Nitai J. Perez
 * nitai.perez@gmail.com
 * on 29/08/2015
 */

var hosts = [];
var bg = chrome.extension.getBackgroundPage();

function createHost(hostname, name) {
    hosts.unshift({
        name: name,
        hostname: hostname,
        lastMod: Date.now()
    });
    onUpdate();
}

function refreshView(hosts) {
    $('#hostsList').html(hosts.map(mkRow).join(''));
    $('.killBtn').each(function () {
        $(this).click(_.partial(rmHost, $(this).attr('hostname'), $(this).attr('name')));
    });

    $('.clickHost').each(function () {
        $(this).click(_.partial(bg.openHost, $(this).attr('hostname')));
    });

    $('.clickName').each(function () {
        $(this).click(_.partial(renameHost, $(this).attr('hostname'), $(this).attr('name')));

    });
}

function rmHost(hostname, name) {
    var idx = _.findIndex(hosts, {hostname: hostname, name: name});
    if (idx > -1) hosts.splice(idx, 1);
    onUpdate();
}

function renameHost(hostname, name) {
    console.log('rename');
    var idx = _.findIndex(hosts, {hostname: hostname, name: name});
    var newname = prompt('Rename host `' + hosts[idx].name + '`', hosts[idx].name) || name;
    hosts.splice(idx, 1, _.extend(hosts[idx], {name: newname, lastMod: Date.now()}));
    onUpdate();
}

function mkClickableName(host) {
    return '<a class="clickName" hostname="' + host.hostname + '" name="' + host.name + '">' + host.name + '</a>';
}

function mkClickableHost(host) {
    return '<a href="#" class="clickHost" hostname="' + host.hostname + '">' + host.hostname + '</a>';
}

function mkExitButton(host) {
    return '<a class= "killBtn" hostname="' + host.hostname + '" name="' + host.name + '"></a>';
}

function mkRow(host) {
    return '' +
        '<tr><td>' + mkClickableHost(host) +
        '</td><td>' + mkClickableName(host) +
        '</td><td>' + moment(host.lastMod).fromNow().replace('a few ', '') +
        '</td><td class="x">' + mkExitButton(host) +
        '</td></tr>';

}

function onUpdate() {
    refreshView(hosts);
    bg.lsWrite(hosts);
}

function launch(skipLaunch) {
    var hostname = $('#mainput').val();
    createHost(hostname, $('#mainame').val());
    if (skipLaunch === true) return;
    bg.openHost(hostname);
}

function init() {
    // Initialize functions and register click on hostname area:
    $('#mainput').focus().keyup(function (event) {
        if (event.keyCode == 13) {
            $("#open").click();
        }
    });
    // Register click on name area:
    $("#mainame").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#open").click();
        }
    });

    $('#open').click(launch);
    $('#add').click(_.partial(launch, true));
    
    hosts = bg.lsRead();
    refreshView(hosts);
}

$(init);
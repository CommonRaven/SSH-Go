/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 26/01/2016
 */

var change = _.debounce(function () {
    wrapElement($('tr:nth-child(3) td+ td .KJ'));
    wrapElement($('tr:nth-child(2) td+ td .KJ'));

}, 500);

function wrapElement(e) {
    if (e.attr('wrapped')) return;
    var id = Math.random().toString(36).substring(7);
    e.attr('wrapped', '1');
    e.wrap('<a id="' + id + '"></a>');
    e.css({'display': 'inline-block', 'margin-left': ''});

    $('#' + id).click(function () {
        var name = $($('.DMB span')[1]).text()
        name = /\(([^)]+)\)/.exec(name)[1] || name;
        chrome.extension.sendMessage({newHost: e.text(), newName: name});
    });
}

$("body").bind("DOMSubtreeModified", change);




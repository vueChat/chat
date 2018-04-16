/*window消息提醒*/
const showMsgNotification = function (title, msg, document_url) {
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if (Notification && Notification.permission === "granted") {
        var instance = new Notification(title, {
            icon: document_url,
            body: msg,
        });
        instance.onclick = function() {
            // Something to do
        };
        instance.onerror = function() {
            // Something to do
        };
        instance.onshow = function() {
            // Something to do
            // console.log(instance.close);
            setTimeout(instance.close.bind(instance), 3000);
        };
        instance.onclose = function() {
            // Something to do
        };
    } else if (Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            // If the user said okay
            if (status === "granted") {
                var instance = new Notification(title, {
                    icon: "http://www.omso2o.com/chat/images/header.jpg",
                    body: msg,

                });

                instance.onclick = function() {
                    // Something to do
                };
                instance.onerror = function() {
                    // Something to do
                };
                instance.onshow = function() {
                    // Something to do
                };
                instance.onclose = function() {
                    // Something to do
                };
            } else {
                return false
            }
        });
    } else {
        return false;
    }
}

export  default showMsgNotification;
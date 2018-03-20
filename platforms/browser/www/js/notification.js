"use strict";

document.addEventListener('deviceready', function () {    
    cordova.plugins.notification.local.schedule({
        title: 'My first notification',
        text: 'Thats pretty easy...',
        foreground: true
    });
}, false);

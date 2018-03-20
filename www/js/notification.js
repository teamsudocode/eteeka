document.addEventListener('deviceready', function () {
    
    
    document.getElementById('not').addEventListener('click', function () {
        cordova.plugins.notification.local.schedule({
            title: 'Notifications are on!',
            text: "You will recieve a notification when \n your child's vaccine is due.",
            trigger: { in: 0,
                unit: 'second'
            },
            foreground: true,
            smallIcon: 'res://icon'
        });
        
        setTimeout(function(){
            window.location.href="home.html";
        },1000)
    })
}, false);

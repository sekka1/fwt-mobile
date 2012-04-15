Ext.define('FWTV.controller.Login', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            'loginview button[action=connect]': {
                tap: 'onBtnConnectTap'
            }
        }
    },
    
    launch: function() {
        var me = this,
            cachedOAuth = me.getCachedOAuth();
        
        SDPWeb.getSubscriptionScript({
            success: function(status, data) {
                
                if (status === 'connected') {
                    //get the first device
                    var deviceId, context,
                        devices = data.devices;
                        
                    for(deviceId in devices) {
                        context = devices[deviceId];
                        break;
                    }
                    
                    me.getApplication().fireEvent('deviceready', context);
                    
                } else {
                    Ext.widget('loginview');
                }
                
                // Destroy the #appLoadingIndicator element
                Ext.fly('appLoadingIndicator').destroy();
            }
        });
    },
    
//listeners

    onBtnConnectTap: function() {
        open('https://api.sdp.nds.com/oauth/authorize?client_id=' + SDPWeb.appId);
    },
    
//other methods
    
    getCachedOAuth: function() {
        var cookieValues,
            oauth = {
            accessToken : localStorage.getItem('accessToken'),
            refreshToken: localStorage.getItem('refreshToken')
        };
        
        if (oauth.refreshToken && !(/refresh_token/).test(document.cookie)) {
            cookieValues = document.cookie.split(';');
            cookieValues.push('refresh_token=' + oauth.refresh_token + ';');
            
            document.cookie = cookieValues.join(';');
        }
    }
});
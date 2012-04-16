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
        
        SDPWeb.login({
            success: function(status, data) {
                var devices;
                
                if (status === 'connected') {
                    devices = Ext.Object.getValues(data.devices);
                    me.getApplication().fireEvent('deviceready', devices[0].context);
                    
                } else {
                    if (status === 'off') {
                        Ext.Msg.alert('No devices found', 'Please turn at least one device.');
                    }
                    
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
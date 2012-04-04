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
        var me = this;
        
        SDPWeb.getSubscriptionScript({
            success: function(status, data) {
                debugger;
                if (status === 'connected') {
                    SDPWeb.subscribe();
                    
                    //get the first device
                    var deviceId, device,
                        devices = data.devices;
                        
                    for(deviceId in devices) {
                        device = devices[deviceId];
                        break;
                    }
                    
                    me.fireEvent('deviceready', deviceId, device);
                    
                } else {
                    Ext.widget('loginview');
                }
            }
        });
    },
    
//listeners

    onBtnConnectTap: function() {
        location.href = 'https://api.sdp.nds.com/oauth/authorize?client_id=' + SDPWeb.appId;
    }
});
Ext.define('FWTV.view.Login', {
    extend: 'Ext.Container',
    xtype: 'loginview',
    config: {
        cls: 'fwtv-loginview',
        fullscreen: true,
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items: [{
            xtype: 'component',
            cls: 'splash-logo'
        },{
            xtype: 'button',
            action: 'connect',
            text: 'Connect to Set-Top Box'
        }]
    }
});
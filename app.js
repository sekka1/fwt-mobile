//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src',
    'Ext.PlayerControl': 'lib/PlayerControl.js',
    'Ext.plugin.SliderFill': 'lib/SliderFill.js',
    'SDPWeb': 'lib/SDPWeb.js'
});

Ext.require([
    'Ext.carousel.Carousel',
    'Ext.data.JsonP',
    'Ext.data.JsonStore',
    'Ext.device.Device',    
    'Ext.field.Slider',
    'Ext.MessageBox',
    'Ext.PlayerControl',
    'Ext.plugin.SliderFill',
    'SDPWeb'
]);
//</debug>

Ext.application({
    name: 'FWTV',
    controllers: [
		'Home',
		'Login',
		'Share'
	],
    views: [
        'CheckIn',
        'ContentInfo',
        'FacebookComments',
		'Home',
		'Login',
		'Share'
	],
    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',
 
    launch: function() {
        //expose application instance
        window.Application = this;
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    }
});

Ext.define('FWTV.view.FacebookComments', {
    extend: 'Ext.Container',
    xtype: 'facebookcommentsview',
    config: {
        data: {},
        tpl: [
            '<div class="fb-comments" data-href="http://friendswith.tv" data-num-posts="8" data-width="470" style="width: 470px; margin: 1em auto; display: block;"></div>'
        ]
    }
});
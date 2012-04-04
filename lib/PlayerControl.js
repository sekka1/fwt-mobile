Ext.define('Ext.PlayerControl', {
    extend: 'Ext.Toolbar',
    xtype: 'playercontrol',
    config: {
        cls: Ext.baseCSSPrefix + 'playercontrol',
        items: [{
            xtype: 'button',
            itemId: 'player-btn',
            ui: 'player',
            iconCls: 'pause',
            iconMask: true
        },{
            xtype: 'sliderfield',
            flex: 1,
            plugins: [{
                xclass : 'Ext.plugin.SliderFill'
            }]
        },{
            xtype: 'component',
            itemId: 'end-time',
            html: '-00:00:00/00:00:00'
        }]
    },
    
    updateSlider: function(position, duration) {
        var slider =  this.child('sliderfield'),
            time = this.child('#end-time'),
            dateTotal = new Date(),
            dateLeft = new Date();
        
        slider.setValue(position);
        slider.setMaxValue(duration);
        
        Ext.Date.clearTime(dateTotal);
        Ext.Date.clearTime(dateLeft);
        
        dateTotal.setSeconds(duration);
        dateLeft.setSeconds(duration - position);
        
        time.setHtml(
            '-' + Ext.Date.format(dateLeft, 'H:i:s') + '/' +
            Ext.Date.format(dateTotal, 'H:i:s')
        );
    }
});
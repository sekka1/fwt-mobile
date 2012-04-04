Ext.define('FWTV.controller.Home', {
	extend: 'Ext.app.Controller',
	config: {
	    refs: {
	        homeView: 'homeview',
	        contentInfoCard: 'homeview contentinfo',
	        showHeader: 'homeview #show-header',
	        playerControl: 'homeview playercontrol'
	    },
	    control: {
	        'homeview button[action=share]': {
	            tap: 'onBtnShareTap'
	        },
	        'homeview button[action=checkin]': {
	            tap: 'onBtnCheckinTap'
	        }
	    }
	},
	
	init: function() {
	    var me = this;
	    
	    me.getApplication().on({
	        scope: me,
	        'deviceready': me.onDeviceReady,
	        'channelchange': me.updateView,
	        'durationchange': me.updatePlayer,
	        'positionchange': me.updatePlayer
	    });
	},

//app listeners

    onDeviceReady: function(deviceId, context) {
        this.updateView(deviceId, context);
        this.updatePlayer(deviceId, context);
        
        //SDPWeb connection
        incrementPosition();
    },
    
    /**
     * Fire the new device context into the application,
     * and refreshes the view
     */
	updateView: function(deviceId, context) {
	    var me = this;
	    
	    //<debug>
	    if (Ext.Logger.log) {
	        Ext.Logger.log("updateView " + Ext.encode(context));
	    }
	    //</debug>
	    
	    me.getApplication().deviceContext = context;
	    
        if (!me.getHomeView()) {
            Ext.Viewport.add({
                xtype:'homeview'
            });
        }

        //mock
        if (context.contentId === "6962663") {
            me.getHomeView().element.applyStyles({
    	        'background-image': 'url(resources/images/shows_mock/blackswan.png)'
    	    });
        } else {
            me.getHomeView().element.applyStyles({
    	        'background-image': 'url(' + context.contentImage + ')'
    	    });
        }
	    
	    me.getShowHeader().setData(context);
	    me.getContentInfoCard().setData(context);
	},
	
	/**
     * Fire the new device context into the application,
     * and refreshes the view
     */
	updatePlayer: function(deviceId, context) {
	    this.getPlayerControl().updateSlider(context.position, context.duration);
	},
	
//listeners
	onBtnShareTap: function() {
        var view = Ext.Viewport.add({ 
	        xtype: 'shareview'
	    });

	    view.down('#header').setData(this.getApplication().deviceContext);
	},
	
	onBtnCheckinTap: function(btn) {
	    var view,
	        context = this.getApplication().deviceContext;

	    if (btn.getUi() === 'rounded action') {
	        btn.setUi('rounded');
	        return;
	    }
	    
	    btn.setUi('rounded action');
	    
	    view = Ext.Viewport.add({ 
	        xtype: 'checkinview',
	        data: context
	    });
	    
	    view.element.on('tap', view.destroy, view, {single: true});
	}
});
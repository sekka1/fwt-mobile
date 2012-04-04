Ext.define('FWTV.controller.Share', {
	extend: 'Ext.app.Controller',
	config: {
	    refs: {
	        shareView: 'shareview'
	    },
	    control: {
	        'shareview button[action=cancel]': {
	            tap: 'onBtnCancelTap'
	        },
	        'shareview button[action=send]': {
	            tap: 'onBtnSendTap'
	        }
	    }
	},

//listeners
	onBtnCancelTap: function() {
        this.getShareView().destroy();
	},
	
	onBtnSendTap: function() {
	    this.getShareView().destroy();
	}
});
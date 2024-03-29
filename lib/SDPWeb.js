/*

Functions in this script call a PHP proxy called /device/action that should have one method call:

	$sdp->perform_action();

The application can optionally implement the following JavaScript functions to receive notification callbacks:

	function scheduleDidChange(deviceId, oldSchedule, newSchedule)
	function plannerDidChange(deviceId, oldPlanner, newPlanner)
	function channelDidChange(deviceId, oldChannel, newChannel, channelNumber, channelName, channelImage)
	function contentDidChange(deviceId, oldChannel, newChannel, contentTitle, seriesTitle, contentImage)
	function positionDidChange(deviceId, oldPosition, newPosition)
	function playbackSpeedDidChange(deviceId, oldPlaybackSpeed, newPlaybackSpeed)

*/

var longpollUrl;
var unsubscribeUrl;
var devices;
var etag = null;
var shouldUnsubscribe = true;

function newRequest() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function changeChannel(deviceId, channelId) {
    link = '/device/action?action=watch&deviceId=' + deviceId + '&channelId=' + channelId;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function setPosition(deviceId, position) {
    link = '/device/action?action=scrub&deviceId=' + deviceId + '&position=' + position;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function stepBackward(deviceId) {
    var device = devices[deviceId];
    setPosition(deviceId, device['position'] - 30);
}

function stepForward(deviceId) {
    var device = devices[deviceId];
    setPosition(deviceId, device['position'] + 30);
}

function addToPlanner(deviceId, scheduleId, channelId, channelNumber, channelName, dateTime, duration) {
    link = '/device/action?action=record&deviceId=' + deviceId + '&scheduleId=' + scheduleId + '&channelId=' + channelId + '&channelNumber=' + channelNumber + '&channelName=' + channelName + '&dateTime=' + dateTime + '&duration=' + duration;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function playPlannerItem(deviceId, plannerId) {
    link = '/device/action?action=play&deviceId=' + deviceId + '&plannerId=' + plannerId;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function playPause(deviceId) {
    var device = devices[deviceId];
    if (device['playbackSpeed'] == 1) {
        pause(deviceId);
    } else {
        resume(deviceId);
    }
}

function pause(deviceId) {
    link = '/device/action?action=pause&deviceId=' + deviceId;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function resume(deviceId) {
    link = '/device/action?action=resume&deviceId=' + deviceId;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function speed(deviceId, speed) {
    link = '/device/action?action=speed&deviceId=' + deviceId + '&speed=' + speed;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function stop(deviceId) {
    link = '/device/action?action=stop&deviceId=' + deviceId;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function changePlannerItemKeep(deviceId, plannerId, keep) {
    link = '/device/action?action=keep&deviceId=' + deviceId + '&plannerId=' + plannerId + '&keep=' + keep;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function deleteFromPlanner(deviceId, plannerId) {
    link = '/device/action?action=delete&deviceId=' + deviceId + '&plannerId=' + plannerId;

    request = newRequest();
    request.open('GET', link, true);
    request.send();
}

function reloadPage() {
    shouldUnsubscribe = false;
    window.location.reload();
}

function incrementPosition() {
    for (var deviceId in devices) {
        var device = devices[deviceId];

        currentPlaybackSpeed = device['playbackSpeed'];
        currentPosition = device['position'];
        type = device['type'];

        if (type != 'Off' && currentPlaybackSpeed != 0) {
            var newPosition = currentPosition + currentPlaybackSpeed;
            device['position'] = newPosition;
            Application.fireEvent('positionchange', deviceId, device);
        }
    }

    setTimeout('incrementPosition()', 1000);
}

function formattedTime(position) {
    var hours = Math.floor(position / 3600) % 24;
    var minutes = Math.floor(position / 60) % 60;
    var seconds = Math.floor(position) % 60;

    var timecode = zeroPad(hours, 2) + ':' + zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2);
    return timecode;
}

function zeroPad(num, count) {
    var numZeropad = num + '';
    while (numZeropad.length < count) {
        numZeropad = "0" + numZeropad;
    }
    return numZeropad;
}

Ext.define('SDPWeb', {
    singleton: true,
    requires: ['Ext.util.Cookies'],
    
    appId: 'f0fec7c7794af1c22d98ba3180f99d24',
    apiPath: '',
    longpollUrl: '',
    unsubscribeUrl: '',
    etag: '',
    lastModified: '',
    devices: null,
    
    constructor: function() {
        this.callParent(arguments);
        var appId;
        
        switch(location.host) {
            case 'local.friendswith.tv':
    			appId = 'f0fec7c7794af1c22d98ba3180f99d24';
    			break;
    		
    		case 'd1.friendswith.tv':
    			appId = 'd8c6c08b878a93b644ca542cc149fe21';
    			break;
    			
    		default:
    			appId = 'e29409e7b76b58038d823df451878346';
    	}
    	this.appId = appId;
    },
    
    /**
     * For the online devices, the API provides information
     * on how to subscribe to these. 
     */
    login: function(config) {
        var i, l,
            me      = this,
            success = config.success,
            scope   = config.scope;

        //remove access_token cookie value
        Ext.util.Cookies.set('access_token', "");
            
        Ext.Ajax.request({
            url: this.apiPath + '/sdp_login.json',
            success: function(response) {
                response = Ext.decode(response.responseText);
                
                //not logged in
                if (!response.access_token) {
                    success.call(scope, 'unknown', response);
                    return;
                }
                
                //update refresh token
                Ext.util.Cookies.set('refresh_token', response.refresh_token);
                
                //all devices off
                if (!response.longpoll_url) {
                    success.call(scope, 'off', response);
                    return;
                }

                me.longpollUrl = response.longpoll_url;
                me.unsubscribeUrl = response.unsubscribe_url;
                me.devices = response.devices;
                me.subscribe();

                success.call(scope, 'connected', response);
            }
        });
    },

    subscribe: function() {
        var me = this;
        
        me.longpoll();
        window.onunload = function() {
            me.unsubscribe();
        };
    },
    
    unsubscribe: function() {
        if (!shouldUnsubscribe) {
            return;
        }
        
        var link = '/device/action?action=unsubscribe&url=' + unsubscribeUrl,
            request = newRequest();
        
        request.open('GET', link, false);
        request.send();
    },

    /**
     * Handles the long poll connection
     */
    longpoll: function() {
        var link,
            me = this,
            longpollUrl = me.longpollUrl;

        if (!longpollUrl) {
            return;
        }

        Ext.Ajax.request({
            url: '/device/action?action=longpoll&url=' + longpollUrl,
            method: 'GET',
            timeout: 120000,
            scope: me,
            success: me.onLongPollSuccess,
            failure: me.onLongPollFailure,
            params: {
                etag: me.etag,
                lastModified: me.lastModified
            }
        });
    },

    /**
     * Handles long poll return, firing the proper events, and
     * starting the new poll request
     */
    onLongPollSuccess: function(response) {
        response = response.responseText ? Ext.decode(response.responseText) : {};
        
        var propertiesMap,
            me              = this,
            deviceId        = response.deviceId,
            newContext      = response.context,
            currentContext  = deviceId && me.devices ? me.devices[deviceId].context : undefined;

        me.etag = response.etag;
        me.lastModified = response.lastModified;

        me.longpoll();

        if (!newContext || !currentContext) {
            return;
        }

        //verify context changes for firing events
        propertiesMap = {
            channelId: 'channel',
            contentId: 'content',
            scheduleId: 'schedule',
            plannerId: 'planner',
            position: 'position',
            duration: 'duration',
            playbackSpeed: 'playbackspeed'
        };

        Ext.iterate(propertiesMap, function(property, event) {
            if (newContext[property] !== currentContext[property]) {
                Application.fireEvent(event + 'change', newContext, currentContext);
            }
        });
        
        //update context
        me.devices[deviceId].context = currentContext;
    },

    onLongPollFailure: function(request) {

        //timeout, open new request
        if (request.status === 408) {
            me.longpoll();

        } else {
            alert('long poll error');
        }
    }
});
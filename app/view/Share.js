Ext.define('FWTV.view.Share', {
    extend: 'Ext.Container',
    xtype: 'shareview',
    config: {
        cls: 'fwtv-shareview',
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        items: [{
            xtype: 'container',
            itemId: 'header',
            cls: 'header',
            data: {
                contentImage: 'resources/images/shows_mock/blackswan_poster.png',
                seriesTitle: 'Black Swan',
                yearOfRelease : 2011,
                star: 'Natalie Portman',
                director: 'Darren Aronofsky'
            },
            tpl: [
                '<p class="intro-msg">Share what<br />you\'re watching...</p>',
                '<img src="{contentImage}" />',
                '<div class="column">',
                    '<h1>{seriesTitle}</h1>',
                    '<tpl if="yearOfRelease">',
                        '<p>',
                            '{yearOfRelease}, Starring {star}<br />',
                            'Director: {director}',
                        '</p>',
                    '</tpl>',
                '</div>'
            ]
        },{
            xtype: 'container',
            cls: 'friends-ct',
            items: [{
                xtype: 'component',
                cls: 'friends-header',
                html: [
                    '<p class="intro-msg">Select friends to share with...</p>',
                    '<div class="share-options">',
                        '<span class="friends"></span>',
                        '<span class="social"></span>',
                    '</div>'
                ].join('')
            },{
                xtype: 'dataview',
                mode: 'multi',
                cls: 'friends-dataview',
                itemTpl: '<img src="{profileImage}" /><h1>{name}</h1>',
                store: Ext.data.JsonStore({
                    fields: ['name', 'profileImage'],
                    data: [
                        { name: 'Colin Maze', profileImage: 'resources/images/shows_mock/person1.png' },
                        { name: 'Dean Wheeler', profileImage: 'resources/images/shows_mock/person2.png' },
                        { name: 'Mavis Leonard', profileImage: 'resources/images/shows_mock/person3.png' }
                    ]
                })
            }]
        }, {
            xtype: 'container',
            cls: 'comment-ct',
            items: [{
                xtype: 'component',
                html: 'Add a Comment'
            },{
                xtype: 'textareafield'
            }]
        },{
            xtype: 'toolbar',
            ui: 'plain',
            items: [{
                xtype: 'spacer'
            },{
                text: 'Cancel',
                ui: 'square',
                action: 'cancel'
            },{
                text: 'Send',
                ui: 'square action',
                action: 'send'
            }]
        }]
    }
});
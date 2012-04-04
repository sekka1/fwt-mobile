Ext.define('FWTV.model.Device', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id', 'name', 'email'],
        proxy: {
            type: 'rest',
            url : '/users'
        }
    }
});

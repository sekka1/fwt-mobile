Ext.define('Override.slider.Slider', {
    override : 'Ext.slider.Slider',

    updateValue : function(newValue, oldValue) {
        var thumbs = this.getThumbs(),
            ln = newValue.length,
            i;

        this.setThumbsCount(ln);

        for (i = 0; i < ln; i++) {
            thumbs[i].getDraggable().setExtraConstraint(null)
                                    .setOffset(newValue[i] * this.offsetValueRatio);
	    this.fireEvent('change', this,thumbs[i],newValue, oldValue,i);// fire change event based on each thumb
        }

        for (i = 0; i < ln; i++) {
	    
            this.refreshThumbConstraints(thumbs[i]);
        }
	
    }
});

Ext.define('Ext.plugin.SliderFill', {
    extend: 'Ext.util.Observable',
    alias: 'plugin.sliderfill',
    config :{
	fillCls : []
    },
    init: function(cmp) {
        var me = this,
            sliderinner = Ext.get(Ext.DomQuery.select('.x-slider-inner',cmp.element.dom)[0]);
            thumbarr = cmp.getComponent().getThumbs();
	
	cmp.on('painted',function(slider){
	    me.onSliderPainted(slider);
	});
	
	cmp.on('change',function(slider,thumb){
	    var thumbarr_val = slider.getComponent().getThumbs();
            
	    Ext.defer(function(){
		me.thumbAdjust(slider,thumb,thumbarr_val.indexOf(thumb));
	     },200);
	});
        
    
	
	Ext.Viewport.on('orientationchange',function(){
	    Ext.defer(function(){
		me.onSliderPainted(cmp);
	    },100);
	});
	
	
    },
    onSliderPainted : function(slider){
        var me = this,
            thumbarr = slider.getComponent().getThumbs(),
            fillCls  = me.getFillCls(),
            sliderinner = Ext.get(Ext.DomQuery.select('.x-slider-inner',slider.element.dom)[0]);

	Ext.each(thumbarr,function(item,i){
	    var fill_space_id = "fill-"+item.id, width = item.translatableBehavior.translatable.x;
	    Ext.DomHelper.append(sliderinner, {tag: 'div', id: fill_space_id, cls: 'x-slider-fill '+fillCls[i] });
	    if(i > 0){
		var prev_thumb =  slider.getComponent().getThumb(i-1),
		    prev_width =  prev_thumb.translatableBehavior.translatable.x,
		    totalwidth = width - prev_width;
		Ext.get(fill_space_id).setStyle({width : Math.round(totalwidth)+'px',left : prev_width+'px'});
	    } else {
		Ext.get(fill_space_id).setStyle({width : Math.round(width)+'px'});
	    }
	});
	slider.getComponent().on({
	    drag: function(sl,thumb) {
		var thumbIndex = Ext.Array.indexOf(thumbarr,thumb);
		me.thumbAdjust(slider,thumb,thumbIndex);
	    }
	});
    },
    thumbAdjust : function(slider,thumb,i){
        var fill_space_id = "fill-"+thumb.getId(),
	    thumbarr = slider.getComponent().getThumbs(),
            width  = thumb.translatableBehavior.translatable.x;
                if(i == 0){
                    Ext.get(fill_space_id).setStyle({width : Math.round(width)+'px'});
                    if(slider.getComponent().getThumb(i+1)){
                        var next_thumb =  slider.getComponent().getThumb(i+1),
                            fill_id =  "fill-"+next_thumb.id,
                            next_width =  next_thumb.translatableBehavior.translatable.x,
                            totalwidth = next_width - width;
                        Ext.get(fill_id).setStyle({width : Math.round(totalwidth)+'px',left : width+'px'});
                    }
                  
                } else if( i == ((thumbarr.length)-1)){
                    if(slider.getComponent().getThumb(i-1)){
                    var prev_thumb =  slider.getComponent().getThumb(i-1),
                        prev_width =  prev_thumb.translatableBehavior.translatable.x,
                        totalwidth = width - prev_width;
                        Ext.get(fill_space_id).setStyle({width : Math.round(totalwidth)+'px',left : prev_width+'px'});
                    }
                } else {
                      var prev_thumb =  slider.getComponent().getThumb(i-1),next_thumb =  slider.getComponent().getThumb(i+1),
                        prev_width =  prev_thumb.translatableBehavior.translatable.x,
                        next_width =  next_thumb.translatableBehavior.translatable.x,
                        totalwidth = width - prev_width;
                        Ext.get(fill_space_id).setStyle({width : Math.round(totalwidth)+'px',left : prev_width+'px'});
                        
                        if(slider.getComponent().getThumb(i+1)){
                            var next_thumb =  slider.getComponent().getThumb(i+1),
                                fill_id =  "fill-"+next_thumb.id,
                                next_width =  next_thumb.translatableBehavior.translatable.x,
                                totalwidth = next_width - width;
                            Ext.get(fill_id).setStyle({width : Math.round(totalwidth)+'px',left : width+'px'});
                        }
                }
    }
});
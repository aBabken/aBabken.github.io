// settings
var modular={
	Panorama: .4,
	Landscape: .75,
	Square: 1,
	Portrait: 1.5,
	minLandscape: .5,
	minSquare: .8,
	minPortrait: 1.1,
	maxW: 3000,

	min: 40,
	max: 360,
	minSize: 20,
	minSpace:1,
	maxSpace:30,
	space:2,
	dpi: 30, //100,
	deltaH: 40, // (viewport height) - (max canvas height)

};

function mediaChecker(max_min, resolution, width = "width") {
    return window.matchMedia(`(${max_min}-${width}: ${resolution}px)`).matches;
  }
if (mediaChecker("max", 1080)) {
	$(".tabs-content").before($(".cs-ds-controls"));





  }
var lang={
	tooSmall: 'Выбирите картинку не меньше $*$!',
	notSupport: 'Не поддерживаемый формат изображения!',
	notSelected: 'Выберите блок для редактирования!',
	tooSmallH: 'Недостаточная высота блока для разделения',
	tooSmallW: 'Недостаточная ширина блока для разделения'
};

//(function(){
	var dpcm = modular.dpcm || modular.dpi/2.54;
	var minImgSize = Math.round(modular.min*dpcm);
	var tooSmall = lang.tooSmall.replace(/\$/g, minImgSize);

	function SVG(tag){
		return document.createElementNS('http://www.w3.org/2000/svg', tag)
	}

	// plugins

	$.fn.addLines=function(){
		return this.each(function(){
			if (this.querySelector('g')) return;
			this.innerHTML+='<g><rect/><rect/><rect/><rect/><rect/><rect/><rect/><rect/></g>'
		})
	}
	$.fn.setMinMax=function(min, max){
		if (min==='' || isNaN(min)) min=this.prop('min');
		if (max==='' || isNaN(max)) max=this.prop('max');
		$('~.changeSm span', this)
		 .eq(0).html(min).end()
		 .eq(1).html(max)
		return this.prop({min: min, max: max});
	}
	$.fn.setBg = function(){
		return this.each(function(){
			if (this.type!='range') return;
			var range=this.max-this.min;
			this.style['background-size']=(this.value-this.min)/range*100+'%'
		})
	}

	var templatesContainer = $('.modular-shapes');
	var mainContainer = $('.modular');
	var img = $('.canv_cel image').on('load', function(){

	});
	var svg0 = $('.canv_cel svg');
	var h2w={
		actual: 1
	};
	var padding=.01;

	function resizeCanvas(){
		if (!$('g', svg0).html()) return;
		svg0[0].setAttribute('viewBox', '0,0,'+h2w.w+','+h2w.h);
		$('pattern, image', svg0).attr({width: h2w.w, height: h2w.h});
		$('>g', svg0)[0].innerHTML+=''; // huck for svg redraw
		var w=$('>rect', svg0)[0].getBoundingClientRect().width;
		hRuler.width(w);
		h2w.dpcm=w/h2w.w;
		svg0.css({fontSize: 1/h2w.dpcm});
		resized=false;
	}

	function setTemplates(format, selected){
		// templatesContainer.not('[aria-hidden]').hide();
		templatesContainer.html('');
		templates.forEach(function(tpl,i){
			if (tpl.format!=format) return;
			var svg=$('<svg viewBox="0, 0, 100, '+modular[format]*100+'"/>');
			var bl=tpl.bl[0]?tpl.bl:[tpl.bl];

			if (bl.find(function(data){
				var x=+(data.x*100).toFixed(2)+'%',
					y=+(data.y*100).toFixed(2)+'%',
					w=+(data.w*100).toFixed(2)+'%',
					h=+(data.h*100).toFixed(2)+'%';
				$('<g class="module" style="--x: '+x+'; --y: '+y+'; --w: '+w+'; --h: '+h+'"><rect /></g>')
				.appendTo(svg);

				return !('s' in data) || +data.r

			})) return;

			svg[0].innerHTML+='';

			$('<button />').append(svg)//.prop({title: JSON.stringify(tpl)})
			.click(function(e){
				e.preventDefault();
				$('>g', svg0)[0].innerHTML=svg[0].innerHTML;
				$('g.module', svg0).addLines();
				resizeCanvas();
			}).appendTo(templatesContainer);
		})

		$('button', templatesContainer).eq(selected||0).focus().click();
		$('a',templatesContainer.prev()).trigger('open');
	}

	// load images

	$('input.imageFile').on('change', function(){
		var inp=this;
		var file=this.files[0];

		if (!file)  return;
		if (!file.type.match(/image.*/))  {
			alert(lang.notSupport);
			return;
		}

		var img0=new Image();
		img0.onload=function(){
			if (!this.width) {
				alert(lang.notSupport);
				return;
			}
			var w=this.width,
				h=this.height,
				src=this.src,
				maxW=modular.maxW;

			if (w<minImgSize || h<minImgSize) {
				alert(tooSmall);
				return;
			}
			// $(inp).addClass('selected').hide()

			var hw=h2w.actual=this.height/this.width;
			
			if (w>maxW || h>maxW) {
				URL.revokeObjectURL(src);
				var w0=Math.min(maxW, maxW/hw),
					h0=Math.min(maxW, maxW*hw),
					canvas = $('<canvas>').prop({width: w0, height: h0})[0],
					ctx=canvas.getContext('2d');
				ctx.drawImage(img0, 0, 0, w0, h0);
				canvas.toBlob(function(blob){
					img0.src=URL.createObjectURL(blob)
				})
				return;
			}
			$(inp).parents('.download').children('.img')
			 .css('background-image', 'url("'+this.src+'")')

			img.attr('href', src);

			h2w.maxW=this.width/dpcm;
			h2w.maxH=this.height/dpcm;
			setMinMax();
			if (hw>modular.minPortrait) setTemplates('Portrait');
			else if (hw>modular.minSquare) setTemplates('Square');
			else if (hw>modular.minLandscape) setTemplates('Landscape');
			else setTemplates('Panorama');
		}
		img0.onerror=function(){alert(lang.notSupport)};
		img0.src=URL.createObjectURL(file);
		$(this).data('img', img0)

	}).on('click', function(e){
		$('input.imageFile').not(this).show();
		if ($(this).hasClass('selected')) {
			e.preventDefault();
			$(this).data('img').onload();
			return false;
		}
	})

	function setMinMax(){
		var hw=h2w.actual,
			minW=hw<1?Math.floor(modular.min/hw):modular.min,
			minH=hw>1?Math.floor(modular.min*hw):modular.min,
			maxW=Math.min(modular.max, h2w.maxW),
			maxH=Math.min(modular.max, h2w.maxH);
		maxW=Math.round(Math.min(maxW, modular.max/hw));
		maxH=Math.round(Math.min(maxH, modular.max*hw));
		wInp.setMinMax(minW, maxW);
		hInp.setMinMax(minH, maxH);
		sizeInp.trigger('change');
	}

	// move and resize

	mainContainer.on('mouseenter touchstart mousedown', 'g.module', function(e){
		if (e.type!='mousedown' && !$(this).is('.blocked g, :last-child')) {
			$('>g', svg0).append(this);			return;
		}
		if (e.type=='mouseenter') return;

		$('.selected', svg0).removeClass('selected');
		$(this).addClass('selected');
		//console.log (e)
		var el=this;
		var touch = e.type=='touchstart' && e.originalEvent.changedTouches[0];

		if (touch && !$(el).is(':hover')) return;
		e.preventDefault();
	    svg0.addClass('blocked');
		var x0=(touch||e).pageX;
		var y0=(touch||e).pageY;
		var id=touch && touch.identifier;

		var pos0=this.querySelector('rect').getBoundingClientRect();
		var bBox=$('>rect', svg0)[0].getBoundingClientRect(),
			minSize=modular.minSize*h2w.dpcm;
		/*

		[5]---1---[6]
		 |         |
		 4    0    2 
		 |         |
		[8]---3---[7]

		*/
		var move={};
		this.querySelectorAll('rect').forEach(function(el,i){
			if (e.target!=el) return;
			move.l = /0|8|4|5/.test(i);
			move.t = /0|5|1|6/.test(i);
			move.r = /6|2|7/.test(i);
			move.b = /8|3|7/.test(i);
			move.w=i && -move.l || +move.r;
			move.h=i && -move.t || +move.b;
		});
		//console.log(move);
		function change(e){
			//
			var touch=e;
			if (e.type=='touchmove') {
				let touches=e.originalEvent.changedTouches;
				for (var i = 0; i < touches.length; i++) {
					if (touches[i].identifier===id) touch=touches[i]
				}
				if (touch==e) return;
			} else {
				e.preventDefault();
			}
			var dx=touch.pageX-x0;
			var dy=touch.pageY-y0;
			var x=pos0.x - bBox.x,
				y=pos0.y - bBox.y,
				w=pos0.width,
				h=pos0.height;
			var css={}, attr={};

			dx=Math.max(dx, move.l?-x:-w+minSize);
			dy=Math.max(dy, move.t?-y:-h+minSize);

			dx=Math.min(dx, move.w<0?w-minSize:bBox.width-x-w);
			dy=Math.min(dy, move.h<0?h-minSize:bBox.height-y-h);

			if (move.l) css['--x']=attr['x']=+((x+dx)/bBox.width*100).toFixed(2)+'%';
			if (move.t) css['--y']=attr['y']=+((y+dy)/bBox.height*100).toFixed(2)+'%';
			css['--w']=attr['width']=+((w+dx*move.w)/bBox.width*100).toFixed(2)+'%';
			css['--h']=attr['height']=+((h+dy*move.h)/bBox.height*100).toFixed(2)+'%';

			$(el).css(css);
			//$('>rect', el).attr(attr);
			//return false
		}

		$(window).on(touch?'touchmove':'mousemove', change)
		 .on('mouseup touchcancel touchend blur', function(){
		 	$(window).off('mousemove touchmove', change);
			svg0.removeClass('blocked');
		})
	})

	// Rulers

	var hRuler=$('.h-ruler');
	var wRuler=$('.v-ruler');
	for (var i = 0, j, html; i*20 < modular.max; i++) {
		j=i*20;
		html='<div><div><div>'+j+'</div><div>'+(j+5)+'</div></div><div><div>'+(j+10)+'</div><div>'+(j+15)+'</div></div></div>'
		hRuler.append(html);
		wRuler.append(html);
	}

	// Whole resize

	var resized;

	var wInp=$('.modular-size .width input').on('input change', function(e){
		h2w.h=(this.value*h2w.actual).toFixed(1)*1;
		mainContainer.css({'--h': h2w.h, '--w': this.value});
		wInp.val(this.value).setBg();
		hInp.not(':focus').val(h2w.h);
		if (e.originalEvent) hInp.triggerHandler('change');

		resized=true;
	});
	var hInp=$('.modular-size .height input').on('input change', function(e){
		h2w.w=(this.value/h2w.actual).toFixed(1)*1;
		mainContainer.css({'--h': this.value, '--w': h2w.w});
		hInp.val(this.value).setBg();
		wInp.not(':focus').val(h2w.w);
		if (e.originalEvent) wInp.triggerHandler('change');
	});
	var sizeInp=wInp.add(hInp).trigger('input');
	resized=false;

	var sInp=$('.modular-size .space input').on('input change', function(e){
		sInp.val(h2w.space=this.value).setBg();
	}).val(h2w.space=modular.space).setBg()
	.setMinMax(modular.minSpace, modular.maxSpace);

	$(window).on('touchend touchcancel mouseup blur', function(){
		if (resized) resizeCanvas();
	});


	$.fn.hideScroll=function(){ 
		var el=this[0];
		if (!el) return;
		el.style.marginRight='';
		el.style.marginRight=el.clientWidth-el.offsetWidth-.5+'px';	
	}

	$('.filter-picture').on('opened', function(e, cObj){
		cObj.$details.filter('.modular-shapes').hideScroll()
	});

	// show preview

	var frames=$('.frames');
	var wallTab=$('.interior.tabs-item').on('show', function(){
		$('.interior-item.active').click();
		var single=!$('.module', svg0)[1];
		frames[single?'show':'hide']();
		wallTab[single?'addClass':'removeClass']('frame');
		wallSizeInp.trigger('input');
	});

	$('.modular-wrap').on('show', function(){
		$('.canv_cel').append(svg0);
		resizeCanvas();
	});

	wallTab.on('mousedown touchstart', function(e){
		var touch = e.type=='touchstart' && e.originalEvent.changedTouches[0];
		// if (touch && !$(this).is(':hover')) return;
		e.preventDefault();
		wallTab.addClass('grabbing');
		var x0=(touch||e).pageX;
		var y0=(touch||e).pageY;
		var id=touch && touch.identifier;

		var pos0=$('>g', svg0)[0].getBoundingClientRect();
		var preview=svg0.closest('div')[0];
		var bBox=preview.parentNode.getBoundingClientRect();
		var left=parseInt(preview.style.left || 50);
		var top=parseInt(preview.style.top || 50);
		function change(e){
			//
			var touch=e;
			if (e.type=='touchmove') {
				let touches=e.originalEvent.changedTouches;
				for (var i = 0; i < touches.length; i++) {
					if (touches[i].identifier===id) touch=touches[i]
				}
				if (touch==e) return;
			} else {
				e.preventDefault();
			}
			var dx=touch.pageX-x0;
			var dy=touch.pageY-y0;

			dx=Math.max(dx, bBox.left-pos0.left);
			dy=Math.max(dy, bBox.top-pos0.top);

			dx=Math.min(dx, bBox.right-pos0.right);
			dy=Math.min(dy, bBox.bottom-pos0.bottom);

			preview.style.left= left+dx/bBox.width*100+'%';
			preview.style.top = top+dy/bBox.height*100+'%';
		}

		$(window).on(touch?'touchmove':'mousemove', change)
		 .on('mouseup touchcancel touchend blur', function(){
		 	$(window).off('mousemove touchmove', change);
			wallTab.removeClass('grabbing');
		})
	})

	var wallSizeInp=$('.interior-sizes input').on('input', function(e){
		wallSizeInp.val(this.value).setBg();
		var div=$('.interior .active'),
			box=$('>g', svg0)[0].getBBox(),
			box0=svg0[0].getBBox(),
			w=div.width(),
			scale=w/this.value;
		$('.interior-wrapper', div).css({
			width: box.width*scale+'px',
			height: box.height*scale+'px',
			'--size': box0.width*scale+'px',
			'--dx': (box0.x-box.x)*scale+'px',
			'--dy': (box0.y-box.y)*scale+'px',
			'font-size': scale
		});
		$('>g', svg0)[0].innerHTML+='';
	});

	$('.interior-item').each(function(){
		var place=$('<div><div class="interior-wrapper"/></div>').appendTo(wallTab);
		$(this).click(function(){
			$(this.parentNode).trigger('focus');
			$(".interior-slider")[0].slick.setPosition();
			$('img', wallTab).prop('src', this.dataset.interior);
			$('.active', wallTab).removeClass('active');
			place.addClass('active');
			$('div', place).append(svg0);
			var minMax=this.dataset.size.split(/[\,,\s]+/);
			wallSizeInp.setMinMax(minMax[0], minMax[1]).trigger('input');
		})
	})//.filter('.active').click();

	$('.ramu-item').click(function(){
		var css=(this.dataset.frame || 'none').replace(/\(([^"].+)\)/, '("$1")');
		debugger
		wallTab.css({
			'--frame': css,
			'--fw': (css.match(/\d*\.?\d+em/)||0)[0]
		})
	})
	$('.modular .cs-controls .csc-item').addClass('disabled');

	$(window).on('resize', resizeCanvas)

	function checkActive() {
		var active=$('.selected, .module:only-child', svg0)
		if (!active[0]) alert(lang.notSelected)
		else return active
	}

	$('.split_v').click(function(){
		var selected=checkActive();
		if (!selected) return;
		var bBox=$('>rect', selected)[0].getBBox(),
			h=(bBox.height - h2w.space)/2,
			y=bBox.y;
		if (h<modular.minSize) return alert(lang.tooSmallH);
		selected.css('--h', (h*100/h2w.h).toFixed(2)+'%')
		.clone().css('--y', ((y+h+h2w.space)*100/h2w.h).toFixed(2)+'%')
		.removeClass('selected').appendTo($('>g', svg0));
	})
	$('.split_h').click(function(){
		var selected=checkActive();
		if (!selected) return;
		var bBox=$('>rect', selected)[0].getBBox(),
			w=(bBox.width - h2w.space)/2,
			x=bBox.x;
		if (w<modular.minSize) return alert(lang.tooSmallW);
		selected.css('--w', (w*100/h2w.w).toFixed(2)+'%')
		.clone().css('--x', ((x+w+h2w.space)*100/h2w.w).toFixed(2)+'%')
		.removeClass('selected').appendTo($('>g', svg0));
	})
	$('.cs-controls .delete').click(function(){
		var selected=checkActive();
		if (!selected) return;
		if (selected.is(':only-child')) return;
		selected.remove();
	})

	window.saveModular=function(){
		var inp=$('input.imageFile:hidden');
		var svg=svg0.clone().attr({
			width: h2w.w+'cm', height: h2w.h+'cm',
			xmlns: 'http://www.w3.org/2000/svg',
			'xmlns:xlink': 'http://www.w3.org/1999/xlink'
		});

		$('image', svg).attr({
			href: inp[0].files[0].name,
			'xlink:href': inp[0].files[0].name
		});

		$('.module>rect', svg).each(function(i){
			var $el=$('.module>rect', svg0).eq(i);
			$(this).attr({
				fill: 'url(#image)', stroke: 'none',
			    width: $el.css('--w'),
			    height: $el.css('--h'),
			    x: $el.css('--x'),
			    y: $el.css('--y')
			})
			console.log($el.closest('g')[0].style)//.css('--w'))
		}).appendTo(svg);
		$('g, rect:first-child', svg).remove();

		return {svg: svg[0].outerHTML, input: inp}
	}
//})()
/*
	Dual-tone images
	- 2018-09-27 Jake Nicholson (github.com/shakyjake)
	
	This is free and unencumbered software released into the public domain.

	Anyone is free to copy, modify, publish, use, compile, sell, or
	distribute this software, either in source code form or as a compiled
	binary, for any purpose, commercial or non-commercial, and by any
	means.
	
	In jurisdictions that recognize copyright laws, the author or authors
	of this software dedicate any and all copyright interest in the
	software to the public domain. We make this dedication for the benefit
	of the public at large and to the detriment of our heirs and
	successors. We intend this dedication to be an overt act of
	relinquishment in perpetuity of all present and future rights to this
	software under copyright law.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
	OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
	ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.
	
	For more information, please refer to <http://unlicense.org/>
	 	
*/

var Duotone;
Duotone = function(Selector){
	
	var _ = this;
	
	_.ParseGradient = function(Colour, NS, Defs){
		
		var Parts, Final;
		
		Parts = Colour.replace(/\s+/g, '').split(',');
		
		if(Parts.length > 1){
			
			var Gradient, From, To, Stop, Rotation, RND;
		
			RND = Math.floor(Math.random() * 1000000);
			
			Rotation = Parts[0];
			
			Gradient = document.createElementNS(NS, 'linearGradient');
			Gradient.setAttributeNS(null, 'gradientTransform', 'rotate(' + Rotation + ')');
			Gradient.setAttributeNS(null, 'id', 'Gradient_' + RND);
			
			From = 1;
			To = Parts.length;
			
			console.log([From, To]);
			
			while(From < To){
				Stop = document.createElementNS(NS, 'stop');
				Stop.setAttributeNS(null, 'offset', (((From - 1) / (To - 2)) * 100) + '%');
				Stop.setAttributeNS(null, 'stop-color', Parts[From]);
				Gradient.appendChild(Stop);
				console.log(Stop);
				From += 1;
			}
			
			Defs.appendChild(Gradient);
			
			Final = 'url(#Gradient_' + RND + ')';
			
		} else {
			
			Final = Colour;
			
		}
		
		return Final;
	};
	
	_.DoTheDuo = function(Img){
		
		var Lowlight, Highlight, RND;
		
		RND = Math.floor(Math.random() * 1000000);
		
		var SVG, NS, Width, Height;
		
		SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		SVG.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
		
		NS = SVG.namespaceURI;
	
		Width = Img.getAttribute('width');
		Height = Img.getAttribute('height');
		
		SVG.setAttributeNS(null, 'width', Width);
		SVG.setAttributeNS(null, 'height', Height);
		
		SVG.setAttributeNS(null, 'viewBox', '0 0 ' + Width + ' ' + Height);
		
		var Defs, Mask, SVGImg;
		
		Defs = document.createElementNS(NS, 'defs');
		Mask = document.createElementNS(NS, 'mask');
		
		Lowlight = Img.getAttribute('data-lowlight', Defs);
		Highlight = Img.getAttribute('data-highlight', Defs);
		
		Lowlight = _.ParseGradient(Lowlight, NS, Defs);
		Highlight = _.ParseGradient(Highlight, NS, Defs);
		
		Mask.setAttributeNS(null, 'maskUnits', 'userSpaceOnUse');
		Mask.setAttributeNS(null, 'id', 'mask_' + RND);
		Mask.setAttributeNS(null, 'mask-type', 'alpha');
		
		SVGImg = document.createElementNS(NS, 'image');
		SVGImg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', Img.src);
		SVGImg.setAttributeNS(null, 'x', '0');
		SVGImg.setAttributeNS(null, 'y', '0');
		SVGImg.setAttributeNS(null, 'width', Width);
		SVGImg.setAttributeNS(null, 'height', Height);
		
		Mask.appendChild(SVGImg);
		Defs.appendChild(Mask);
		SVG.appendChild(Defs);
		
		var Rect;
		
		Rect = document.createElementNS(NS, 'rect');
		Rect.setAttributeNS(null, 'x', '0');
		Rect.setAttributeNS(null, 'y', '0');
		Rect.setAttributeNS(null, 'width', '100%');
		Rect.setAttributeNS(null, 'height', '100%');
		Rect.setAttributeNS(null, 'fill', Lowlight);
		SVG.appendChild(Rect);
		
		Rect = document.createElementNS(NS, 'rect');
		Rect.setAttributeNS(null, 'x', '0');
		Rect.setAttributeNS(null, 'y', '0');
		Rect.setAttributeNS(null, 'width', '100%');
		Rect.setAttributeNS(null, 'height', '100%');
		Rect.setAttributeNS(null, 'fill', Highlight);
		Rect.setAttributeNS(null, 'style', 'mask-image: url(#mask_' + RND + '); mask-mode: luminance;');
		
		SVG.appendChild(Rect);
		
		Img.parentNode.replaceChild(SVG, Img);
	};
	
	_.Init = function(){
		var Items;
		Items = document.querySelectorAll(Selector);
		if(!!Items.length){
			var ItemCount = Items.length;
			while(!!ItemCount){
				ItemCount -= 1;
				_.DoTheDuo(Items[ItemCount]);
			}
		}
	};
	
	_.Init();
	
};
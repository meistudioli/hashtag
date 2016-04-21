function isMobile() {
	return (isEventSupported('touchstart')) ? 'touch' : (navigator.msPointerEnabled && navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1) ? 'pointer' : false;
}

function mk(c, Data) {
	if (!arguments.length) return document.createDocumentFragment();
	var getTag = (Data && Data.tag) ? Data.tag : 'div', e = document.createElement(getTag);
	if (c) e.className = c;
	if (Data) {
		for (i in Data.s) e.style[i] = Data.s[i];//style
		for (i in Data.att) e[i] = Data.att[i];//attribute
	}//end if
	return e;
}

function isEventSupported(eventName, element) {
	var e = mk(''), en = 'on' + eventName, isSupported;
	if (element) e = (element.tagName) ? element.cloneNode(true) : element;
	isSupported = (en in e);
	if (!isSupported && e.setAttribute) {
		if (eventName == 'focusin') {
			//https://gist.github.com/jonathantneal/7366668
			e = mk('', {tag:'a', att:{href:'#'}, s:{position:'fixed', top:'0'}});
			en = function() { isSupported = true; };
			(e.addEventListener) ? e.addEventListener('focusin', en) : e.onfocusin = en;
			document.body.appendChild(e).focus();
			document.body.removeChild(e);
			return isSupported;
		} else {
			e.setAttribute(en, '');
			isSupported = typeof e[en] == 'function';
			if (typeof e[en] != 'undefined') e[en] = null;
			e.removeAttribute(en);
		}//end if
	}//end if
	e = null;
	return isSupported;
}

function pageInit() {
	if (isMobile()) document.querySelector('main').classList.add('mobile');
}
/*programed by mei(李維翰), http://www.facebook.com/mei.studio.li*/
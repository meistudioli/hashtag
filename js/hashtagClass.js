var hashtag = function(id, data) {
	var buffer, e, host;
	this.id = id;
	this.Data = data;
	this.Ens = {};
	host = (typeof this.Data.wrapper == 'string') ? document.querySelector(this.Data.wrapper) : this.Data.wrapper;
	if (!this.determine() || !host) return;
	this.Ens.host = host;
	this.Data.values = [];
	this.Data.valueSrc = '';

	//init
	buffer = mk();
	e = {};

	host.Data = { ClassID:this.id };
	if (!host.id) host.id = 'hashtag-' + this.id + getRand(1, 10000);
	buffer = this.template.cloneNode(true);
	if (this.wc.ShadowDOM) {
		e.root = host[this.wc.ShadowDOM]();
		e.root.innerHTML = '<style>' + this.cssStr + '</style>';
		this.Ens.sheet = e.root.querySelector('style');
		e.root.appendChild(buffer);

		empty(host, '.vanquish');
	} else {
		empty(host);
		host.appendChild(mk('', {tag:'h3', att:{innerHTML:'hashtag'}}));
		host.appendChild(buffer);

		e.root = host;
	}//end if

	this.Ens.inputs = e.root.querySelector('.inputs');
	this.Ens.inputs.Data = { ClassID:this.id };
	this.Ens.inputs.setAttribute('placeholder', this.Data.placeholder);
	e.stuff = (!this.Data.fieldValue) ? mk('', {tag:'br'}) : document.createTextNode(this.Data.fieldValue);
	this.Ens.inputs.appendChild(e.stuff);
	this.Ens.adorn = e.root.querySelector('.adorn');
	this.Ens.vanquish = mk('vanquish');
	host.appendChild(this.Ens.vanquish);

	//evt
	this.Ens.inputs.addEventListener(this.evtInput, this.eActG, false);

	// method bundle
	if (typeof this.Ens.host.set != 'function') this.Ens.host.set = hashtag.prototype.set;
	if (typeof this.Ens.host.get != 'function') this.Ens.host.get = hashtag.prototype.get;

	//clear
	for (var i in e) e[i] = null;
	e = null;

	//reset
	this.refresh();

	//remove hidden
	host.removeAttribute('hidden');
};

hashtag.prototype = {
	dependencies: [
		'createCSSClass'
	],
	determine: function() {
		if (typeof hashtag.prototype.isSupport == 'undefined') {
			var anis = isAniSupport(), css = [], e = {};
			hashtag.prototype.anis = anis;
			hashtag.prototype.wc = supportsWebComponents();
			hashtag.prototype.isSupport = true;
			hashtag.prototype.evtInput = (isEventSupported('input') && !/msie/.test(detectMSB())) ? 'input' : 'keyup';
			hashtag.prototype.userModify = '';

			//css user-modify
			e.b = ['', 'webkit', 'moz', 'o', 'ms'];
			for (var i=-1,l=e.b.length;++i<l;) {
				var s = e.b[i];
				s = ((s.length) ? '-' + s + '-' : '') + 'user-modify';
				if (isCSSSupport(s)) {
					this.userModify = s;
					break;
				}//end if
			}//end for
			if (this.userModify) {
				e.userModifyValue = 'read-write-plaintext-only';
				try {
					createCSSClass('.userModifyCheck', this.userModify+':'+e.userModifyValue+';');
				} catch(err) { e.userModifyValue = 'read-write'; }
				this.userModify += ':' + e.userModifyValue + ';';
			}//end if

			//css
			createCSSClass('hash-tag', 'position:relative;font-size:4vmin;line-height:1.2;width:100%;color:#888;display:block;padding:0;margin:0;');
			createCSSClass('hash-tag h3', 'display:none;');
			createCSSClass('hash-tag input', 'visibility:hidden;');
			createCSSClass('hash-tag .vanquish', 'width:100%;height:0;visibility:hidden;overflow:hidden;');
			if (this.wc.ShadowDOM) {
				css.push({k:'.layers', v:'position:relative;width:100%;font-size:inherit;color:inherit;line-height:inherit;background:transparent;z-index:2;'+this.userModify});
				css.push({k:'.adorn.layers', v:'position:absolute;left:0;top:0;pointer-events:none;color:transparent;z-index:1;'});
				css.push({k:'.adorn.layers q', v:'background-color:#e6eeff;box-shadow:0 1px 0 #bbd2ff;'});
				css.push({k:'.inputs:empty:before', v:'content:attr(placeholder);color:inherit;display:block;'});
			} else {
				css.push({k:'hash-tag .layers', v:'position:relative;width:100%;font-size:inherit;color:inherit;line-height:inherit;background:transparent;z-index:2;'+this.userModify});
				css.push({k:'hash-tag .adorn.layers', v:'position:absolute;left:0;top:0;pointer-events:none;color:transparent;z-index:1;'});
				css.push({k:'hash-tag .adorn.layers q', v:'background-color:#e6eeff;box-shadow:0 1px 0 #bbd2ff;'});
				css.push({k:'hash-tag .inputs:empty:before', v:'content:attr(placeholder);color:inherit;display:block;'});
			}//end if

			//template
			e.buffer = mk();
			hashtag.prototype.template = e.buffer;
			e.sets = ['adorn', 'inputs'];
			for (var i=-1,l=e.sets.length;++i<l;) {
				var div = mk(e.sets[i]+' layers');
				e.buffer.appendChild(div);
				if (this.userModify && !/webkit/.test(this.userModify)) div.setAttribute('contenteditable', true);
				div.setAttribute('spellcheck', false);
				div.setAttribute('autocorrect', 'off');
				div.setAttribute('autocapitalize', 'off');
				div.setAttribute('autocomplete', 'off');
			}//end for

			//excute css
			if (this.wc.ShadowDOM) {
				e.cssStr = 'h3,div{display:block;margin:0;padding:0;}q{margin:0;padding:0;}q:before{content:""}q:after{content:""}';
				while (css.length) {
					var c = css.shift();
					e.cssStr += c.k + '{' + c.v + '}';
				}//end while
				hashtag.prototype.cssStr = e.cssStr;
			} else {
				while (css.length) {
					var c = css.shift();
					createCSSClass(c.k, c.v);
				}//end while
			}//end if

			//clear
			for (var i in e) e[i] = null;
			e = css = null;

			//custom element
			this.activeCustomElement();
		}//end if
		return hashtag.prototype.isSupport;
	},
	activeCustomElement: function() {
		if (hashtag.prototype.activeCE) return;
		var b = ['', 'webkit', 'moz', 'o', 'ms'], api = 'registerElement', ce = '', prototype, jsonld;
		hashtag.prototype.activeCE = true;
		for (var i=-1,l=b.length;++i<l;) {
			var s = b[i], cApi = api;
			cApi = (s.length) ? api.replace(/^[a-z]{1}/,function($1){return $1.toLocaleUpperCase()}) : api;
			s += cApi;
			if (document[s]) { ce = s; break; }
		}//end for

		if (typeof Ohashtag == 'undefined') Ohashtag = {};
		if (!ce) {
			//none custom element support
			ce = document.querySelectorAll('hash-tag');
			for (var i=-1,l=ce.length;++i<l;) {
				var conf, e = ce[i], mid, tmp;

				mid = 'M' + getRand(1, 10000) + '-' + getRand(1, 10000);
				conf = {
					wrapper: e,
					fieldName: 'hashtag',
					fieldValue: '',
					placeholder: 'Enter some hashtag here...'
				};

				//input[name]
				tmp = e.querySelector('input[name]');
				if (tmp) {
					conf.fieldName = tmp.name || 'hashtag';
					conf.fieldValue = tmp.value || '';
					if (tmp.hasAttribute('placeholder')) conf.placeholder = tmp.getAttribute('placeholder');
					tmp.removeAttribute('name');
				}//end if

				if (e.hasAttribute('data-conf')) {
					try { tmp = JSON.parse(e.getAttribute('data-conf')); } catch (err) { tmp = {}; }
					for (var j in tmp) {
						conf[j] = tmp[j];
						tmp[j] = null;
					}//end ofr
					tmp = null;
					e.removeAttribute('data-conf');
				}//end if
				//hashtag
				Ohashtag['hashtag'+mid] = new hashtag(mid, conf);
			}//end for
		} else {
			prototype = Object.create(HTMLElement.prototype);
			prototype.attachedCallback = function() {
				var mid, conf, tmp;

				mid = 'M' + getRand(1, 10000) + '-' + getRand(1, 10000);
				this.mid = mid;
				conf = {
					wrapper: this,
					fieldName: 'hashtag',
					fieldValue: '',
					placeholder: 'Enter some hashtag here...'
				};

				//input[name]
				tmp = this.querySelector('input[name]');

				if (tmp) {
					conf.fieldName = tmp.name || 'hashtag';
					conf.fieldValue = tmp.value || '';
					if (tmp.hasAttribute('placeholder')) conf.placeholder = tmp.getAttribute('placeholder');
					tmp.removeAttribute('name');
				}//end if

				if (this.hasAttribute('data-conf')) {
					try { tmp = JSON.parse(this.getAttribute('data-conf')); } catch (err) { tmp = {}; }
					for (var i in tmp) {
						conf[i] = tmp[i];
						tmp[i] = null;
					}//end ofr
					tmp = null;
					this.removeAttribute('data-conf');
				}//end if

				//hashtag
				Ohashtag['hashtag'+mid] = new hashtag(mid, conf);
			};
			prototype.detachedCallback = function() {
				if (typeof this.mid == 'undefined') return;
				Ohashtag['hashtag'+this.mid].terminate();
			};
			prototype.attributeChangedCallback = hashtag.prototype.attrChange;
			prototype.set = hashtag.prototype.set;
			prototype.get = hashtag.prototype.get;
			document[ce]('hash-tag', {prototype: prototype});
		}//end if
	},
	attrChange: function(attrName, oldVal, newVal) {
		var ins;
		if (attrName != 'data-set') return;
		ins = getIns(this, 'hashtag');
		if (!ins) return;
		ins.set(newVal);
	},
	eActG: function(e) {
		var obj, ins;
		obj = tNa(e);
		ins = getIns(obj.t, 'hashtag');
		if (ins) ins.refresh(e);
	},
	refresh: function(e) {
		var content, match, source, name;

		content = this.Ens.inputs.innerHTML;
		content = content.replace(/<\w+><br><\/\w+>/gim, '\n');
		content = content.replace(/(<\/\w+>)|(<br>)/gm, '\n');
		content = content.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gim, '');
		content = content.replace(/&nbsp;/gm, ' ');
		source = content.replace(/&lt;/gm, '<').replace(/&gt;/gm, '>');

		match = content.replace(/\s+/g, ' ');
		match = match.match(/(#([^\s|#]+)\s)|(#([^\s|#]+)\n)|(#([^\s|#]+)$)/gm);

		content = content.replace(/#([^\s|#]+) /g, '<q>#$1</q> ');
		content = content.replace(/#([^\s|#]+)\n/g, '<q>#$1</q>\n');
		content = content.replace(/#([^\s|#]+)$/g, '<q>#$1</q>');

		content = content.replace(/ /gm, '&nbsp;');
		this.Ens.adorn.innerHTML = content.replace(/\n/g, '<br>');

		//vanquish
		empty(this.Ens.vanquish);
		this.Data.values = [];
		this.Data.valueSrc = source;
		if (match) {
			name = this.Data.fieldName + '[]';
			for (var i=-1,l=match.length;++i<l;) {
				var input, value;
				value = match[i].trim();
				this.Data.values.push(value);

				input = mk('', {tag:'input'});
				input.type = 'hidden';
				input.name = name;
				input.value = value;
				this.Ens.vanquish.appendChild(input);
			}//end for
		}//end if
		content = mk('', {tag:'textarea', att:{name:this.Data.fieldName+'Src'}});
		content.value = source;
		this.Ens.vanquish.appendChild(content);
	},
	set: function(input) {
		var ins;
		// ins = getIns(this, 'hashtag');
		ins = (typeof this.tagName != 'undefined') ? getIns(this, 'hashtag') : this;
		if (!ins || !input) return;

		empty(ins.Ens.inputs);
		ins.Ens.inputs.appendChild(document.createTextNode(input));
		ins.refresh();
	},
	get: function(key) {
		var ins;
		ins = getIns(this, 'hashtag');
		if (!ins) return;

		return (key == 'source') ? ins.Data.valueSrc : ins.Data.values;
	},
	terminate: function() {
		var mid = this.id;

		//events
		this.Ens.inputs.removeEventListener(this.evtInput, this.eActG, false);

		setTimeout(function(){
			var c = Ohashtag['hashtag'+mid];
			purge(c.Data);
			for (var i in c.Ens) c.Ens[i] = null;
			c.id = c.Data = c.Ens = null;
			try { delete(Ohashtag['hashtag'+mid]); } catch(e) {}
		}, 100);
	}
};

/*auto-registration*/
(function() {
	var dependencies, c = 0, max = 10000;//10 seconds
	if (typeof navigator.oRegists == 'undefined') navigator.oRegists = {};
	dependencies = hashtag.prototype.dependencies;
	navigator.oRegists.hashtag = setInterval(
		function() {
			var isReady = true;
			c += 5;
			if (c >= max) {
				clearInterval(navigator.oRegists.hashtag);
				return;
			}//end if
			for (var i=-1,l=dependencies.length;++i<l;) {
				var root = window, d = dependencies[i].split('.');
				while (d.length) {
					var prop = d.shift();
					if (!root[prop]) {
						root = null;
						break;
					} else root = root[prop];
				}//end while
				isReady &= (root != null);
			}//end for
			if (isReady && document.body) {
				clearInterval(navigator.oRegists.hashtag);
				navigator.oRegists.hashtag = null;
				hashtag.prototype.determine();
			}//end if
		}
	, 5);
})();
/*programed by mei(李維翰), http://www.facebook.com/mei.studio.li*/
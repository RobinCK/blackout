function t(t,e,o,s,n,r){function a(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var i,l=s.kind,c="getter"===l?"get":"setter"===l?"set":"value",d=!e&&t?s.static?t:t.prototype:null,u=e||(d?Object.getOwnPropertyDescriptor(d,s.name):{}),h=!1,p=o.length-1;p>=0;p--){var m={};for(var g in s)m[g]="access"===g?{}:s[g];for(var g in s.access)m.access[g]=s.access[g];m.addInitializer=function(t){if(h)throw new TypeError("Cannot add initializers after decoration has completed");r.push(a(t||null))};var f=(0,o[p])("accessor"===l?{get:u.get,set:u.set}:u[c],m);if("accessor"===l){if(void 0===f)continue;if(null===f||"object"!=typeof f)throw new TypeError("Object expected");(i=a(f.get))&&(u.get=i),(i=a(f.set))&&(u.set=i),(i=a(f.init))&&n.unshift(i)}else(i=a(f))&&("field"===l?n.unshift(i):u[c]=i)}d&&Object.defineProperty(d,s.name,u),h=!0}function e(t,e,o){for(var s=arguments.length>2,n=0;n<e.length;n++)o=s?e[n].call(t,o):e[n].call(t);return s?o:void 0}"function"==typeof SuppressedError&&SuppressedError;const o=globalThis,s=o.ShadowRoot&&(void 0===o.ShadyCSS||o.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap;let a=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const o=void 0!==e&&1===e.length;o&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&r.set(e,t))}return t}toString(){return this.cssText}};const i=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,o,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[s+1],t[0]);return new a(o,t,n)},l=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:u,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,g=globalThis,f=g.trustedTypes,y=f?f.emptyScript:"",w=g.reactiveElementPolyfillSupport,b=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?y:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},v=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(t,o,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,o){const{get:s,set:n}=u(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=m(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const o of e)this.createProperty(o,t[o])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const o=this._$Eu(t,e);void 0!==o&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(s)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of e){const e=document.createElement("style"),n=o.litNonce;void 0!==n&&e.setAttribute("nonce",n),e.textContent=s.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){const o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(void 0!==s&&!0===o.reflect){const n=(void 0!==o.converter?.toAttribute?o.converter:_).toAttribute(e,o.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const o=this.constructor,s=o._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=o.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,o,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),o??=r.getPropertyOptions(t),!((o.hasChanged??v)(n,e)||o.useDefault&&o.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,o))))return;this.C(t,e,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:s,wrapped:n},r){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,o]of t){const{wrapped:t}=o,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,o,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,w?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const k=globalThis,S=t=>t,A=k.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+D,P=`<${T}>`,M=document,O=()=>M.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,N="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,q=/-->/g,H=/>/g,R=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,W=/"/g,B=/^(?:script|style|textarea|title)$/i,L=(t=>(e,...o)=>({_$litType$:t,strings:e,values:o}))(1),K=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),Z=new WeakMap,X=M.createTreeWalker(M,129);function V(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const G=(t,e)=>{const o=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",a=j;for(let e=0;e<o;e++){const o=t[e];let i,l,c=-1,d=0;for(;d<o.length&&(a.lastIndex=d,l=a.exec(o),null!==l);)d=a.lastIndex,a===j?"!--"===l[1]?a=q:void 0!==l[1]?a=H:void 0!==l[2]?(B.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=R):void 0!==l[3]&&(a=R):a===R?">"===l[0]?(a=n??j,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,i=l[1],a=void 0===l[3]?R:'"'===l[3]?W:I):a===W||a===I?a=R:a===q||a===H?a=j:(a=R,n=void 0);const u=a===R&&t[e+1].startsWith("/>")?" ":"";r+=a===j?o+P:c>=0?(s.push(i),o.slice(0,c)+C+o.slice(c)+D+u):o+D+(-2===c?e:u)}return[V(t,r+(t[o]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},o){let s;this.parts=[];let n=0,r=0;const a=t.length-1,i=this.parts,[l,c]=G(t,e);if(this.el=Q.createElement(l,o),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=X.nextNode())&&i.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[r++],o=s.getAttribute(t).split(D),a=/([.?@])?(.*)/.exec(e);i.push({type:1,index:n,name:a[2],strings:o,ctor:"."===a[1]?ot:"?"===a[1]?st:"@"===a[1]?nt:et}),s.removeAttribute(t)}else t.startsWith(D)&&(i.push({type:6,index:n}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(D),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let o=0;o<e;o++)s.append(t[o],O()),X.nextNode(),i.push({type:2,index:++n});s.append(t[e],O())}}}else if(8===s.nodeType)if(s.data===T)i.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(D,t+1));)i.push({type:7,index:n}),t+=D.length-1}n++}}static createElement(t,e){const o=M.createElement("template");return o.innerHTML=t,o}}function J(t,e,o=t,s){if(e===K)return e;let n=void 0!==s?o._$Co?.[s]:o._$Cl;const r=z(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,o,s)),void 0!==s?(o._$Co??=[])[s]=n:o._$Cl=n),void 0!==n&&(e=J(t,n._$AS(t,e.values),n,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);X.currentNode=s;let n=X.nextNode(),r=0,a=0,i=o[0];for(;void 0!==i;){if(r===i.index){let e;2===i.type?e=new tt(n,n.nextSibling,this,t):1===i.type?e=new i.ctor(n,i.name,i.strings,this,t):6===i.type&&(e=new rt(n,this,t)),this._$AV.push(e),i=o[++a]}r!==i?.index&&(n=X.nextNode(),r++)}return X.currentNode=M,s}p(t){let e=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),z(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==K&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:o}=t,s="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=Q.createElement(V(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),o=t.u(this.options);t.p(e),this.T(o),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Q(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,s=0;for(const n of t)s===e.length?e.push(o=new tt(this.O(O()),this.O(O()),this,this.options)):o=e[s],o._$AI(n),s++;s<e.length&&(this._$AR(o&&o._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,s,n){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=F}_$AI(t,e=this,o,s){const n=this.strings;let r=!1;if(void 0===n)t=J(this,t,e,0),r=!z(t)||t!==this._$AH&&t!==K,r&&(this._$AH=t);else{const s=t;let a,i;for(t=n[0],a=0;a<n.length-1;a++)i=J(this,s[o+a],e,a),i===K&&(i=this._$AH[a]),r||=!z(i)||i!==this._$AH[a],i===F?t=F:t!==F&&(t+=(i??"")+n[a+1]),this._$AH[a]=i}r&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ot extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class nt extends et{constructor(t,e,o,s,n){super(t,e,o,s,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??F)===K)return;const o=this._$AH,s=t===F&&o!==F||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,n=t!==F&&(o===F||s);s&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const at=k.litHtmlPolyfillSupport;at?.(Q,tt),(k.litHtmlVersions??=[]).push("3.3.3");const it=globalThis;let lt=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{const s=o?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=o?.renderBefore??null;s._$litPart$=n=new tt(e.insertBefore(O(),t),t,void 0,o??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}};lt._$litElement$=!0,lt.finalized=!0,it.litElementHydrateSupport?.({LitElement:lt});const ct=it.litElementPolyfillSupport;ct?.({LitElement:lt}),(it.litElementVersions??=[]).push("4.2.2");const dt={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:v},ut=(t=dt,e,o)=>{const{kind:s,metadata:n}=o;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(o.name,t),"accessor"===s){const{name:s}=o;return{set(o){const n=e.get.call(this);e.set.call(this,o),this.requestUpdate(s,n,t,!0,o)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=o;return function(o){const n=this[s];e.call(this,o),this.requestUpdate(s,n,t,!0,o)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,o)=>"object"==typeof o?ut(t,e,o):((t,e,o)=>{const s=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),s?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}function pt(t){return ht({...t,state:!0,attribute:!1})}const mt=1;let gt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const ft="important",yt=" !"+ft,wt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends gt{constructor(t){if(super(t),t.type!==mt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,o)=>{const s=t[o];return null==s?e:e+`${o=o.includes("-")?o:o.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:o}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?o.removeProperty(t):o[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(yt);t.includes("-")||e?o.setProperty(t,e?s.slice(0,-11):s,e?ft:""):o[t]=s}}return K}}),bt="blackout-status-card",_t="blackout-schedule-card",vt="blackout-week-card",$t="blackout-records-card";function xt(t){return"number"==typeof t?t:Date.parse(t)}async function kt(t,e,o,s,n){const r=Date.now();return(await t.callWS({type:"recorder/statistics_during_period",start_time:new Date(r-864e5*n).toISOString(),end_time:new Date(r).toISOString(),statistic_ids:[e],period:o,types:[s]}))[e]??[]}function St(t,e,o){if(!e)return!0;const s=Number(new Intl.DateTimeFormat("en-GB",{hour:"2-digit",hourCycle:"h23",timeZone:o}).format(t)),[n,r]=e;return n<=r?s>=n&&s<r:s>=n||s<r}const At=18e5,Et=36e5;function Ct(t){return Date.parse(t.start)}function Dt(t){const e=[];for(const o of t){const t=Ct(o);o.slots.forEach((o,s)=>{const n=t+s*At,r=e.at(-1);r&&r.state===o&&r.end===n?e[e.length-1]={...r,end:n+At}:e.push({start:n,end:n+At,state:o})})}return e}function Tt(t){return Dt([t]).filter(t=>"off"===t.state||"possible"===t.state).map(t=>({start:t.start,end:t.end,possible:"possible"===t.state}))}function Pt(t){return void 0!==t&&"waiting"!==t.status}function Mt(t,e,o){return Math.min(100,Math.max(0,(t-e)/(o-e)*100))}const Ot=new Map;class zt extends Error{}class Ut{host;payload;error;now=Date.now();hass;entityId;days=1;version="";requested="";refreshTimer;tickTimer;constructor(t){this.host=t,t.addController(this)}hostConnected(){this.refreshTimer=setInterval(()=>this.load(!0),6e4),this.tickTimer=setInterval(()=>{this.now=Date.now(),this.host.requestUpdate()},2e4)}hostDisconnected(){clearInterval(this.refreshTimer),clearInterval(this.tickTimer)}sync(t,e,o){if(this.hass=t,!e)return this.payload=void 0,void(this.error="no_entity");const s=t.states[e]?.last_updated??"",n=e!==this.entityId||o!==this.days||s!==this.version;this.entityId=e,this.days=o,this.version=s,n&&this.load(!1)}load(t){const{hass:e,entityId:o}=this;if(!e||!o)return;const s=t?`${this.version}|${Date.now()}`:this.version,n=`${o}|${this.days}|${s}`;(t||n!==this.requested)&&(this.requested=n,function(t,e,o,s){const n=`${e}|${o}`,r=Ot.get(n);if(r&&r.version===s&&Date.now()-r.at<15e3)return r.promise;const a=t.callWS({type:"blackout/queue",entity_id:e,days:o}).catch(t=>{throw Ot.delete(n),function(t){return"object"==typeof t&&null!==t&&"code"in t&&"not_found"===t.code}(t)?new zt(e):t});return Ot.set(n,{at:Date.now(),version:s,promise:a}),a}(e,o,this.days,s).then(t=>{this.payload=t,this.error=void 0}).catch(t=>{this.error=t instanceof zt?"not_found":"failed"}).finally(()=>{this.now=Date.now(),this.host.requestUpdate()}))}}const Nt={"title.power":"Power","title.queue":"Queue {group}","title.schedule":"Outage schedule","title.week":"Outages · {days}","title.records":"Records","status.power_on":"Power on","status.scheduled_outage":"No power","status.possible_outage":"Possible outage","status.emergency":"Emergency outages","status.unscheduled_outage":"Unscheduled outage","status.unknown":"No data","region.normal":"Enough power","region.shortage":"Save power","region.outage_schedules":"Schedules apply","region.emergency_outages":"Emergency outages","region.grid_damage":"Grid damage","region.unknown":"Unknown","hero.outage_in":"Outage in","hero.power_back_in":"Power back in","hero.no_power_for":"No power for","hero.no_outages":"No outages scheduled","hero.possible_in":"Possible outage in","hero.at":"at {time}","hero.since":"since {time}","hero.by_schedule":"{duration} by schedule","hero.updated":"updated {ago}","hero.since_schedule":"since {time} by schedule","hero.elapsed":"{duration} ago","hero.schedule_suspended":"schedule suspended","hero.restore_unknown":"power back time unknown","hero.outside_schedule":"outside the schedule","hero.no_schedule":"no schedule published","row.grid":"Grid","row.battery":"Battery","battery.forecast_at":"{soc} % at {time} → lasts until {until}","battery.forecast_now":"{soc} % → lasts until {until}","battery.forecast_short":"{soc} % → {until}","battery.forecast_full":"{soc} % at {time} → lasts the whole outage","stat.today":"Today","stat.longest":"Longest","stat.tomorrow":"Tomorrow","stat.emergency":"Emergency","stat.load":"Load","stat.battery_reserve":"Battery reserve","stat.battery_at_start":"Battery at {time}","stat.until_morning":"Until morning at","stat.actual_today":"Without grid today","stat.availability":"Availability","stat.region":"Region","stat.next_outage":"Next outage","stat.power_back":"Power back","stat.source":"Source","stat.without_grid":"Without grid","stat.outages":"Outages","stat.without_power_today":"Without power today","stat.without_power_tomorrow":"Without power tomorrow","value.yes":"yes","value.no":"no","value.not_yet":"not yet","value.none":"—","day.today":"Today","day.tomorrow":"Tomorrow","schedule.not_published":"not published yet","schedule.no_outages":"no outages","schedule.queue":"queue {group}","schedule.emergency_none":"no emergency outages","schedule.emergency_active":"emergency outages","schedule.source_updated":"{source} · updated {ago}","schedule.in":"in {duration}","schedule.battery_at":"battery at {time} ≈ {soc} %","schedule.now":"now","schedule.passed":"passed","legend.on":"power on","legend.off":"outage","legend.possible":"possible","legend.unknown":"no schedule","legend.grid_on":"grid on","legend.by_schedule":"by schedule","legend.emergency":"emergency","week.grid_on":"Grid on","week.grid_off":"No grid","week.next_by_schedule":"Next by schedule","week.next_meta":"in {duration} · queue {group}","week.battery_forecast":"Battery forecast at {time}","week.battery_lasts":"lasts ≈ {duration}","week.no_next":"nothing scheduled","records.since":"since {date}","records.longest_outage":"Longest outage","records.longest_power_streak":"Longest without outages","records.current_power_streak":"Without outages now","records.worst_day":"Worst day","records.outage_count":"Outages","records.statistic":"Record","records.streak":"Streak","records.no_data":"no data yet","error.no_entity":"Choose an entity of a Blackout queue","error.not_found":"The entity is not a Blackout queue entity","error.loading":"Loading…","error.failed":"Data is unavailable","unit.d":"d","unit.h":"h","unit.min":"min","unit.hours":"h","unit.kw":"kW","unit.w":"W","unit.percent":"%","unit.days_one":"{count} day","unit.days_other":"{count} days","relative.just_now":"just now","relative.ago":"{duration} ago","editor.entity":"Queue entity","editor.title":"Title","editor.show_header":"Show header","editor.language":"Language","editor.time_zone":"Time zone","editor.tap_action":"Header tap action","editor.labels":"Text overrides","editor.colors":"Colors","editor.show_badge":"Show status badge","editor.show_timeline":"Show timeline","editor.show_stats":"Show statistics","editor.timeline_hours":"Timeline length (hours)","editor.timeline_offset":"Hours before now","editor.stats":"Statistics","editor.days":"Days","editor.show_source":"Show source line","editor.show_now":"Show current time","editor.show_legend":"Show legend","editor.show_windows":"Show outage windows","editor.show_totals":"Show totals","editor.show_schedule":"Show schedule","editor.show_next":"Show next outage","editor.since":"Subtitle","editor.columns":"Columns","editor.items":"Records","editor.battery":"Battery","editor.advanced":"Advanced","editor.soc":"State of charge","editor.power":"Battery power","editor.load":"Load power","editor.capacity":"Capacity (kWh)","editor.reserve":"Reserve (%)","editor.power_positive":"Positive battery power means","editor.morning_hour":"Morning hour","editor.option.auto":"Home Assistant language","editor.option.discharge":"Discharging","editor.option.charge":"Charging","editor.option.more-info":"More info","editor.option.none":"Nothing","editor.option.today":"Today","editor.option.tomorrow":"Tomorrow","editor.helper.entity":"Any entity of a Blackout queue, for example its power status sensor","editor.helper.labels":'Keys of the built-in texts with your own text, for example "hero.outage_in": "Off in"',"editor.helper.colors":"on, off, possible, emergency, battery, unknown","editor.helper.stats":"A list of statistics or lists per state: power_on, outage, emergency","editor.helper.items":"longest_outage, longest_power_streak, current_power_streak, worst_day, outage_count, statistic, streak"},jt={en:Nt,uk:{"title.power":"Світло","title.queue":"Черга {group}","title.schedule":"Графік відключень","title.week":"Відключення · {days}","title.records":"Рекорди","status.power_on":"Світло є","status.scheduled_outage":"Світла немає","status.possible_outage":"Можливе відключення","status.emergency":"Аварійні відключення","status.unscheduled_outage":"Позапланове відключення","status.unknown":"Немає даних","region.normal":"Електроенергії достатньо","region.shortage":"Споживайте ощадливо","region.outage_schedules":"Діють графіки","region.emergency_outages":"Аварійні відключення","region.grid_damage":"Пошкодження мережі","region.unknown":"Невідомо","hero.outage_in":"Відключення через","hero.power_back_in":"Світло через","hero.no_power_for":"Світла немає вже","hero.no_outages":"Відключень не заплановано","hero.possible_in":"Можливе відключення через","hero.at":"о {time}","hero.since":"з {time}","hero.by_schedule":"{duration} за графіком","hero.updated":"оновлено {ago}","hero.since_schedule":"з {time} за графіком","hero.elapsed":"минуло {duration}","hero.schedule_suspended":"графік не діє","hero.restore_unknown":"включення невідоме","hero.outside_schedule":"поза графіком","hero.no_schedule":"графік не опубліковано","row.grid":"Мережа","row.battery":"АКБ","battery.forecast_at":"{soc} % о {time} → вистачить до {until}","battery.forecast_now":"{soc} % → вистачить до {until}","battery.forecast_short":"{soc} % → {until}","battery.forecast_full":"{soc} % о {time} → вистачить на все відключення","stat.today":"Сьогодні","stat.longest":"Найдовше","stat.tomorrow":"Завтра","stat.emergency":"Аварійні","stat.load":"Навантаження","stat.battery_reserve":"Запас АКБ","stat.battery_at_start":"АКБ на {time}","stat.until_morning":"До ранку при","stat.actual_today":"Без мережі сьогодні","stat.availability":"Доступність","stat.region":"Область","stat.next_outage":"Наступне","stat.power_back":"Увімкнення","stat.source":"Джерело","stat.without_grid":"Без мережі","stat.outages":"Відключень","stat.without_power_today":"Без світла сьогодні","stat.without_power_tomorrow":"Без світла завтра","value.yes":"так","value.no":"ні","value.not_yet":"ще немає","value.none":"—","day.today":"Сьогодні","day.tomorrow":"Завтра","schedule.not_published":"ще не опубліковано","schedule.no_outages":"без відключень","schedule.queue":"черга {group}","schedule.emergency_none":"аварійних немає","schedule.emergency_active":"аварійні відключення","schedule.source_updated":"{source} · оновлено {ago}","schedule.in":"через {duration}","schedule.battery_at":"АКБ на {time} ≈ {soc} %","schedule.now":"зараз","schedule.passed":"минуло","legend.on":"світло є","legend.off":"відключення","legend.possible":"можливо","legend.unknown":"графіка ще немає","legend.grid_on":"мережа є","legend.by_schedule":"за графіком","legend.emergency":"аварійні","week.grid_on":"Мережа є","week.grid_off":"Мережі немає","week.next_by_schedule":"Наступне за графіком","week.next_meta":"за {duration} · черга {group}","week.battery_forecast":"Прогноз АКБ на {time}","week.battery_lasts":"вистачить ≈ {duration}","week.no_next":"нічого не заплановано","records.since":"з {date}","records.longest_outage":"Найдовше відключення","records.longest_power_streak":"Найдовше без відключень","records.current_power_streak":"Без відключень зараз","records.worst_day":"Найгірший день","records.outage_count":"Відключень","records.statistic":"Рекорд","records.streak":"Поспіль","records.no_data":"ще немає даних","error.no_entity":"Оберіть сутність черги Blackout","error.not_found":"Сутність не належить черзі Blackout","error.loading":"Завантаження…","error.failed":"Дані недоступні","unit.d":"д","unit.h":"г","unit.min":"хв","unit.hours":"год","unit.kw":"кВт","unit.w":"Вт","unit.percent":"%","unit.days_one":"{count} день","unit.days_few":"{count} дні","unit.days_many":"{count} днів","unit.days_other":"{count} дня","relative.just_now":"щойно","relative.ago":"{duration} тому","editor.entity":"Сутність черги","editor.title":"Заголовок","editor.show_header":"Показувати заголовок","editor.language":"Мова","editor.time_zone":"Часовий пояс","editor.tap_action":"Дія при натисканні на заголовок","editor.labels":"Власні тексти","editor.colors":"Кольори","editor.show_badge":"Показувати статус","editor.show_timeline":"Показувати шкалу","editor.show_stats":"Показувати статистику","editor.timeline_hours":"Довжина шкали (годин)","editor.timeline_offset":"Годин до поточного часу","editor.stats":"Статистика","editor.days":"Дні","editor.show_source":"Показувати джерело","editor.show_now":"Показувати поточний час","editor.show_legend":"Показувати легенду","editor.show_windows":"Показувати вікна відключень","editor.show_totals":"Показувати підсумки","editor.show_schedule":"Показувати графік","editor.show_next":"Показувати наступне відключення","editor.since":"Підзаголовок","editor.columns":"Колонки","editor.items":"Рекорди","editor.battery":"АКБ","editor.advanced":"Додатково","editor.soc":"Рівень заряду","editor.power":"Потужність АКБ","editor.load":"Потужність навантаження","editor.capacity":"Ємність (кВт·год)","editor.reserve":"Резерв (%)","editor.power_positive":"Додатна потужність АКБ означає","editor.morning_hour":"Година ранку","editor.option.auto":"Мова Home Assistant","editor.option.discharge":"Розряд","editor.option.charge":"Заряд","editor.option.more-info":"Деталі","editor.option.none":"Нічого","editor.option.today":"Сьогодні","editor.option.tomorrow":"Завтра","editor.helper.entity":"Будь-яка сутність черги Blackout, наприклад сенсор стану світла","editor.helper.labels":'Ключі вбудованих текстів зі своїм текстом, наприклад "hero.outage_in": "Вимкнуть через"',"editor.helper.colors":"on, off, possible, emergency, battery, unknown","editor.helper.stats":"Список показників або списки для станів: power_on, outage, emergency","editor.helper.items":"longest_outage, longest_power_streak, current_power_streak, worst_day, outage_count, statistic, streak"}},qt={en:"en-GB",uk:"uk-UA"},Ht=Object.keys(jt);function Rt(t,e){return e?t.replace(/\{(\w+)\}/g,(t,o)=>o in e?String(e[o]):t):t}function It(t,e={}){const o=function(t){const e=(t??"en").toLowerCase().split(/[-_]/)[0]??"en";return e in jt?e:"en"}(t),s=jt[o]??Nt,n=new Intl.PluralRules(o),r=t=>e[t]??s[t]??Nt[t];return{language:o,locale:qt[o]??o,t:(t,e)=>Rt(r(t)??t,e),plural:(t,e)=>Rt(r(`${t}_${n.select(e)}`)??r(`${t}_other`)??t,{count:e})}}const Wt=i`
  :host {
    --bo-on: var(--blackout-on-color, var(--success-color, #43a047));
    --bo-off: var(--blackout-off-color, #ff7a59);
    --bo-possible: var(--blackout-possible-color, var(--warning-color, #ffa600));
    --bo-emergency: var(--blackout-emergency-color, var(--bo-off));
    --bo-battery: var(--blackout-battery-color, var(--success-color, #43a047));
    --bo-unknown: var(
      --blackout-unknown-color,
      color-mix(in srgb, var(--primary-text-color) 12%, transparent)
    );
    --bo-text: var(--primary-text-color);
    --bo-muted: var(--secondary-text-color);
    --bo-faint: color-mix(in srgb, var(--primary-text-color) 45%, transparent);
    --bo-surface: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    --bo-divider: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    --bo-track: color-mix(in srgb, var(--bo-on) 22%, transparent);
    --bo-track-strong: color-mix(in srgb, var(--bo-on) 32%, transparent);
    --bo-mono: var(
      --blackout-mono-font,
      ui-monospace,
      'SF Mono',
      'JetBrains Mono',
      Menlo,
      Consolas,
      monospace
    );
    --bo-hatch: repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--bo-off) 75%, transparent) 0 3px,
      transparent 3px 6px
    );
    --bo-hatch-muted: repeating-linear-gradient(
      -45deg,
      var(--bo-unknown) 0 3px,
      transparent 3px 6px
    );
    display: block;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
    }
  }
`,Bt=i`
  ha-card {
    box-sizing: border-box;
    height: 100%;
    padding: 18px 20px 16px;
    overflow: hidden;
    container-type: inline-size;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 28px;
    margin-bottom: 14px;
    cursor: default;
  }

  .header.clickable {
    cursor: pointer;
  }

  .title {
    min-width: 0;
    overflow: hidden;
    color: var(--bo-muted);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    line-height: 16px;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .header-side {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    color: var(--bo-muted);
    font-size: 12px;
  }

  .badge {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 10px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--tone) 16%, transparent);
    color: var(--tone);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .badge::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .badge.solid {
    background: var(--tone);
    color: var(--text-primary-color, #fff);
  }

  .badge.solid::before {
    display: none;
  }

  .badge ha-icon {
    --mdc-icon-size: 14px;
  }

  .badge.plain {
    background: var(--bo-surface);
    color: var(--bo-text);
  }

  .badge.plain::before {
    display: none;
  }

  .tone-on {
    --tone: var(--bo-on);
  }

  .tone-off {
    --tone: var(--bo-off);
  }

  .tone-possible {
    --tone: var(--bo-possible);
  }

  .tone-emergency {
    --tone: var(--bo-emergency);
  }

  .tone-muted {
    --tone: var(--bo-muted);
  }

  .mono {
    font-family: var(--bo-mono);
    font-variant-numeric: tabular-nums;
  }

  .muted {
    color: var(--bo-muted);
  }

  .divider {
    height: 1px;
    margin: 16px 0 14px;
    background: var(--bo-divider);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(var(--stat-columns, 4), minmax(0, 1fr));
    gap: 10px 14px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .stat-label {
    overflow: hidden;
    color: var(--bo-muted);
    font-size: 11px;
    line-height: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stat-value {
    overflow: hidden;
    color: var(--tone, var(--bo-text));
    font-family: var(--bo-mono);
    font-size: 15px;
    font-weight: 600;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stat-value .unit,
  .unit {
    margin-left: 3px;
    color: var(--bo-muted);
    font-family: var(--paper-font-body1_-_font-family, inherit);
    font-size: 11px;
    font-weight: 400;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
    color: var(--bo-muted);
    font-size: 11px;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }

  .swatch.on,
  .fill-on {
    background: var(--bo-track-strong);
  }

  .swatch.off,
  .fill-off {
    background: var(--bo-off);
  }

  .swatch.possible,
  .fill-possible {
    background: color-mix(in srgb, var(--bo-possible) 70%, transparent);
  }

  .swatch.unknown,
  .fill-unknown {
    background: var(--bo-unknown);
  }

  .swatch.hatch,
  .fill-hatch {
    background: var(--bo-hatch);
  }

  .swatch.hatch-muted,
  .fill-hatch-muted {
    background: var(--bo-hatch-muted);
  }

  .message {
    padding: 8px 0;
    color: var(--bo-muted);
    font-size: 13px;
  }

  .message.error {
    color: var(--error-color);
  }

  @container (max-width: 360px) {
    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`,Lt=i`
  .row {
    display: grid;
    grid-template-columns: var(--row-label-width, 56px) minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }

  .row-label {
    overflow: hidden;
    color: var(--bo-muted);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bar {
    position: relative;
    height: var(--bar-height, 14px);
    border-radius: 3px;
    background: var(--bo-surface);
  }

  .seg {
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .seg:first-child {
    border-radius: 3px 0 0 3px;
  }

  .seg.future {
    opacity: 0.45;
  }

  .fill-actual {
    background: var(--bo-off);
  }

  .fill-faint {
    background: transparent;
  }

  .fill-battery {
    background: var(--bo-battery);
    border-radius: 3px;
  }

  .fill-battery-low {
    background: var(--bo-possible);
    border-radius: 3px;
  }

  .now {
    position: absolute;
    top: -4px;
    bottom: -4px;
    width: 2px;
    border-radius: 1px;
    background: var(--bo-text);
    transform: translateX(-1px);
  }

  .bar-text {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-left: 8px;
    overflow: hidden;
    color: color-mix(in srgb, #000 80%, var(--bo-battery));
    font-family: var(--bo-mono);
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
  }

  .axis {
    margin-top: 6px;
  }

  .ticks {
    position: relative;
    height: 14px;
  }

  .tick {
    position: absolute;
    color: var(--bo-faint);
    font-size: 10px;
    transform: translateX(-50%);
  }

  .tick:first-child {
    transform: none;
  }

  .tick:last-child {
    transform: translateX(-100%);
  }
`,Kt="Europe/Kyiv",Ft=6e4;function Zt(t){return t instanceof Date?t:new Date(t)}function Xt(t,e=Kt){const{locale:o}=t,s=t.t,n=new Intl.DateTimeFormat(o,{hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:e}),r=new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:e}),a=new Intl.DateTimeFormat(o,{day:"numeric",month:"short",year:"numeric",timeZone:e}),i=new Intl.DateTimeFormat(o,{day:"numeric",month:"short",timeZone:e}),l=new Intl.DateTimeFormat(o,{weekday:"short",day:"numeric",month:"short",timeZone:e}),c=new Intl.DateTimeFormat(o,{month:"long",year:"numeric",timeZone:e}),d=new Intl.DateTimeFormat(o,{weekday:"short",timeZone:e}),u=new Intl.DateTimeFormat(o,{day:"numeric",timeZone:e}),h=new Map,p=(t,e=0)=>{let s=h.get(e);return s||(s=new Intl.NumberFormat(o,{minimumFractionDigits:e,maximumFractionDigits:e}),h.set(e,s)),s.format(t)},m=t=>{const e=Math.max(0,Math.round(t/Ft)),o=Math.floor(e/1440),n=Math.floor(e%1440/60),r=e%60;return o>0?[{value:String(o),unit:s("unit.d")},{value:String(n),unit:s("unit.h")}]:n>0?[{value:String(n),unit:s("unit.h")},{value:String(r).padStart(2,"0"),unit:s("unit.min")}]:[{value:String(r),unit:s("unit.min")}]};return{translator:t,timeZone:e,number:p,time:t=>n.format(Zt(t)),dayKey:t=>r.format(Zt(t)),date:t=>a.format(Zt(t)),shortDate:t=>i.format(Zt(t)),dayDate:t=>l.format(Zt(t)),dateTime:t=>`${a.format(Zt(t))}, ${n.format(Zt(t))}`,month:t=>c.format(Zt(t)),weekday:t=>{const e=Zt(t),o=d.format(e);return`${o.charAt(0).toUpperCase()}${o.slice(1)} ${u.format(e)}`},durationParts:m,duration:t=>m(t).map(t=>`${t.value} ${t.unit}`).join(" "),hours:(t,e=1)=>`${p(t,e)} ${s("unit.hours")}`,relative:(t,e)=>{const o=e-Zt(t).getTime();return o<Ft?s("relative.just_now"):s("relative.ago",{duration:m(o).map(t=>`${t.value} ${t.unit}`).join(" ")})},power:t=>Math.abs(t)>=1e3?{value:p(t/1e3,1),unit:s("unit.kw")}:{value:p(t,0),unit:s("unit.w")}}}const Vt={on:"--blackout-on-color",off:"--blackout-off-color",possible:"--blackout-possible-color",emergency:"--blackout-emergency-color",battery:"--blackout-battery-color",unknown:"--blackout-unknown-color"};let Gt=(()=>{let o,s,n=lt,r=[],a=[],i=[],l=[];return class extends n{static{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;o=[ht({attribute:!1})],s=[pt()],t(this,null,o,{kind:"accessor",name:"hass",static:!1,private:!1,access:{has:t=>"hass"in t,get:t=>t.hass,set:(t,e)=>{t.hass=e}},metadata:e},r,a),t(this,null,s,{kind:"accessor",name:"config",static:!1,private:!1,access:{has:t=>"config"in t,get:t=>t.config,set:(t,e)=>{t.config=e}},metadata:e},i,l),e&&Object.defineProperty(this,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})}static styles=[Wt,Bt];#t=e(this,r,void 0);get hass(){return this.#t}set hass(t){this.#t=t}#e=(e(this,a),e(this,i,void 0));get config(){return this.#e}set config(t){this.#e=t}queue=(e(this,l),new Ut(this));translator=It("en");formatter=Xt(this.translator);localeKey="";historyDays(){return 1}extraEntities(){return[]}requiresEntity(){return!0}setConfig(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration");this.config=t}getCardSize(){return this.cardSize}getGridOptions(){return{columns:12,rows:"auto",min_columns:6}}shouldUpdate(t){if(1!==t.size||!t.has("hass"))return!0;const e=t.get("hass");if(!e||!this.hass||!this.config)return!0;return[this.config.entity,...this.extraEntities()].filter(t=>"string"==typeof t).some(t=>e.states[t]!==this.hass?.states[t])}willUpdate(){if(!this.hass||!this.config)return;const t=this.config.language??this.hass.locale?.language??this.hass.language,e=this.config.time_zone??Kt,o=`${t}|${e}|${JSON.stringify(this.config.labels??{})}`;o!==this.localeKey&&(this.localeKey=o,this.translator=It(t,this.config.labels??{}),this.formatter=Xt(this.translator,e)),(this.requiresEntity()||this.config.entity)&&this.queue.sync(this.hass,this.config.entity,this.historyDays())}t(t,e){return this.translator.t(t,e)}render(){if(!this.hass||!this.config)return F;const t=wt(this.colorStyles(this.config)),e=this.renderState();if(e)return L`<ha-card style=${t}>${e}</ha-card>`;const o=this.queue.payload;if(!o)return this.renderWithoutQueue(t);const s={payload:o,now:this.queue.now,t:(t,e)=>this.translator.t(t,e),f:this.formatter};return L`<ha-card style=${t}
      >${this.renderHeader(s)}${this.renderContent(s)}</ha-card
    >`}renderWithoutQueue(t){return L`<ha-card style=${t}
      ><div class="message">${this.t("error.loading")}</div></ha-card
    >`}renderState(){if(!this.requiresEntity()&&!this.config?.entity)return;const t=this.queue.error;return!t||"failed"===t&&this.queue.payload?void 0:L`<div class="message error">${this.t(`error.${t}`)}</div>`}renderHeader(t){if(!1===this.config?.show_header)return F;const e=this.config?.title??this.defaultTitle(t),o="none"!==this.config?.tap_action&&Boolean(this.config?.entity);return L`<div
      class="header ${o?"clickable":""}"
      @click=${o?this.openMoreInfo:void 0}
    >
      <div class="title">${e}</div>
      <div class="header-side">${this.headerSide(t)}</div>
    </div>`}queueTitle(t){return`${t.t("title.power")} · ${t.t("title.queue",{group:t.payload.queue.group})}`}colorStyles(t){const e={};for(const[o,s]of Object.entries(t.colors??{})){const t=Vt[o];t&&"string"==typeof s&&(e[t]=s)}return e}openMoreInfo=()=>{const t=this.config?.entity;t&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}}})();const Qt={power_on:"on",scheduled_outage:"off",possible_outage:"possible",emergency:"emergency",unscheduled_outage:"off",unknown:"muted"};function Jt(t){return[{value:t,unit:""}]}function Yt(t){return L`${t.map(t=>L`<span class="mono">${t.value}</span>${t.unit?L`<span class="unit">${t.unit}</span>`:F} `)}`}function te(t,e,o=!1,s){return L`<span class="badge tone-${e} ${o?"solid":""}"
    >${s?L`<ha-icon .icon=${s}></ha-icon>`:F}${t}</span
  >`}function ee(t){return 0===t.length?F:L`<div class="stats" style="--stat-columns: ${Math.min(t.length,4)}">
    ${t.map(t=>L`<div class="stat">
          <span class="stat-label">${t.label}</span>
          <span class="stat-value ${t.tone?`tone-${t.tone}`:""}"
            >${Yt(t.parts)}</span
          >
        </div>`)}
  </div>`}function oe(t,e,o=1){return null==e?Jt(t.translator.t("value.none")):[{value:t.number(e,o),unit:t.translator.t("unit.hours")}]}function se(t,e){return null==e?Jt(t.translator.t("value.none")):t.durationParts(e*Et)}function ne(t,e,o){const s=new Date(e),n=new Date(o),r=t.dayKey(n)!==t.dayKey(s)&&"00:00"===t.time(n)?"24:00":t.time(n);return`${t.time(s)}–${r}`}function re(t,e,o,s){return L`<div class="bar">
    ${t.map(t=>{const s=Mt(t.from,e,o),n=Mt(t.to,e,o)-s;return n>0?L`<span class="seg ${t.className}" style="left:${s}%;width:${n}%"></span>`:F})}
    ${s??F}
  </div>`}function ae(t,e){const o=t.start>=e?"future":"";return`fill-${t.state} ${"off"===t.state||"possible"===t.state?o:""}`}function ie(t,e){const o=t.f.dayKey(new Date(t.now+24*e*Et));return t.payload.days.find(t=>t.date===o)}function le(t){return Object.values(t.states).find(t=>t.entity_id.startsWith("sensor.")&&"string"==typeof t.attributes.group&&"today_status"in t.attributes)?.entity_id}const ce=[{type:"longest_outage"},{type:"longest_power_streak"},{type:"worst_day"},{type:"outage_count"}],de={longest_outage:"mdi:transmission-tower-off",longest_power_streak:"mdi:check-circle-outline",current_power_streak:"mdi:timer-outline",worst_day:"mdi:calendar-alert",outage_count:"mdi:counter"},ue={longest_outage:"var(--bo-off)",longest_power_streak:"var(--bo-on)",current_power_streak:"var(--bo-on)",worst_day:"var(--bo-off)",outage_count:"var(--bo-muted)"};let he=(()=>{let o,s=Gt,n=[],r=[];return class extends s{static{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(s[Symbol.metadata]??null):void 0;o=[pt()],t(this,null,o,{kind:"accessor",name:"loaded",static:!1,private:!1,access:{has:t=>"loaded"in t,get:t=>t.loaded,set:(t,e)=>{t.loaded=e}},metadata:e},n,r),e&&Object.defineProperty(this,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})}static styles=[...Gt.styles,i`
      .tiles {
        display: grid;
        grid-template-columns: repeat(var(--record-columns, 2), minmax(0, 1fr));
        gap: 10px;
      }

      .tile {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
        padding: 14px;
        border-radius: 12px;
        background: var(--bo-surface);
      }

      .tile-head {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--bo-muted);
        font-size: 12px;
      }

      .tile-head span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tile-head ha-icon {
        --mdc-icon-size: 16px;
        flex: none;
      }

      .tile-value {
        font-size: 24px;
        font-weight: 700;
        white-space: nowrap;
      }

      .tile-value .unit {
        font-size: 12px;
      }

      .tile-note {
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @container (max-width: 320px) {
        .tiles {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `];cardSize=5;#o=e(this,n,new Map);get loaded(){return this.#o}set loaded(t){this.#o=t}loadedKey=(e(this,r),"");loadedAt=0;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){return{type:`custom:${$t}`,entity:le(t)}}requiresEntity(){return this.items().some(t=>"statistic"!==t.type&&"streak"!==t.type)}defaultTitle(t){return t.t("title.records")}headerSide(){return this.config?.since?L`<span>${this.config.since}</span>`:F}items(){return this.config?.items&&this.config.items.length>0?this.config.items:ce}updated(){this.loadStatistics()}renderWithoutQueue(t){if(this.requiresEntity())return super.renderWithoutQueue(t);const e={t:this.translator.t,f:this.formatter,now:Date.now()};return L`<ha-card style=${t}>
      ${!1===this.config?.show_header?F:L`<div class="header">
              <div class="title">${this.config?.title??e.t("title.records")}</div>
              <div class="header-side">${this.headerSide()}</div>
            </div>`}
      ${this.renderTiles(this.items().map((t,o)=>this.tile(t,o,e.f,null)))}
    </ha-card>`}renderContent(t){return this.renderTiles(this.items().map((e,o)=>this.tile(e,o,t.f,t)))}renderTiles(t){const e=this.config?.columns??2;return L`<div class="tiles" style=${wt({"--record-columns":String(e)})}>
      ${t.map(t=>L`<div class="tile">
            <div class="tile-head">
              <ha-icon .icon=${t.icon} style=${wt({color:t.color})}></ha-icon
              ><span>${t.label}</span>
            </div>
            <div class="tile-value">${Yt(t.parts)}</div>
            <div class="tile-note">${t.note}</div>
          </div>`)}
    </div>`}tile(t,e,o,s){const n=this.translator.t;if("statistic"===t.type)return this.statisticTile(t,this.loaded.get(e),o);if("streak"===t.type){const s=this.loaded.get(e);return{label:t.label??n("records.streak"),icon:t.icon??"mdi:check-circle-outline",color:t.color??"var(--bo-on)",parts:Jt(s?this.translator.plural("unit.days",s.days):n("value.none")),note:s?`${o.shortDate(s.start)} – ${o.shortDate(s.end)}`:n("records.no_data")}}return this.outageTile(t,o,s)}outageTile(t,e,o){const s=this.translator.t,n=o?.payload.records??null,r={label:t.label??s(`records.${t.type}`),icon:t.icon??de[t.type],color:t.color??ue[t.type]},a={...r,parts:Jt(s("value.none")),note:s("records.no_data")};if(!n)return a;if("outage_count"===t.type)return{...r,parts:Jt(String(n.count)),note:""};if("worst_day"===t.type)return n.worst_day?{...r,parts:e.durationParts(n.worst_day.hours*Et),note:e.date(n.worst_day.date)}:a;const i=n[t.type];return i?{...r,parts:e.durationParts(i.hours*Et),note:e.date(i.start)}:a}statisticTile(t,e,o){const s=this.translator.t,n=this.hass?.states[t.entity],r=t.label??n?.attributes.friendly_name??s("records.statistic"),a=t.icon??"mdi:trophy-outline",i=t.color??"var(--bo-possible)";if(!e)return{label:r,icon:a,color:i,parts:Jt(s("value.none")),note:s("records.no_data")};const l=t.unit??n?.attributes.unit_of_measurement??"",c=e.value*(t.scale??1),d=t.date_format??this.dateFormat(t),u="datetime"===d?o.dateTime(e.start):"month"===d?o.month(e.start):o.date(e.start);return{label:r,icon:a,color:i,parts:[{value:o.number(c,t.decimals??1),unit:l}],note:u}}dateFormat(t){const e=t.period??"day";return"month"===e?"month":"hour"===e||"5minute"===e?"datetime":"day"}loadStatistics(){const t=this.hass,e=this.items(),o=JSON.stringify(e);if(!t||o===this.loadedKey&&Date.now()-this.loadedAt<6e5)return;this.loadedKey=o,this.loadedAt=Date.now();const s=this.formatter.timeZone,n=e.map((e,o)=>"statistic"===e.type?async function(t,e,o){const s=e.value??"max",n=await kt(t,e.entity,e.period??"day",s,e.days??365),r="min"===e.stat;let a=null;for(const t of n){const n=t[s],i=xt(t.start);"number"==typeof n&&St(i,e.hours,o)&&(a&&!(r?n<a.value:n>a.value)||(a={value:n,start:i}))}return a}(t,e,s).then(t=>[o,t]):"streak"===e.type?async function(t,e){const o=e.value??"change",s=await kt(t,e.entity,"day",o,e.days??365);let n=null,r=null;for(const t of s){const s=t[o],a=xt(t.start);"number"==typeof s&&(void 0===e.below||s<e.below)&&(void 0===e.above||s>e.above)?(r=r?{days:r.days+1,start:r.start,end:a}:{days:1,start:a,end:a},(!n||r.days>n.days)&&(n=r)):r=null}return n}(t,e).then(t=>[o,t]):Promise.resolve(void 0));Promise.all(n.map(t=>t.catch(()=>{}))).then(t=>{const e=new Map;for(const o of t)o&&e.set(o[0],o[1]);this.loaded=e})}}})();function pe(t){if(!t)return null;const e=Number.parseFloat(t.state);return Number.isFinite(e)?e:null}function me(t){const e=pe(t);return null!==e&&t?"kw"===t.attributes.unit_of_measurement?.toLowerCase()?1e3*e:e:null}function ge(t,e){if(!e?.soc)return null;const o=pe(t.states[e.soc]),s=function(t,e){if("number"==typeof e)return e>0?e:null;if(!e)return null;const o=t.states[e],s=pe(o);return null!==s&&o?"wh"===o.attributes.unit_of_measurement?.toLowerCase()?s/1e3:s:null}(t,e.capacity);if(null===o||null===s)return null;const n=e.power?me(t.states[e.power]):null,r="charge"===e.power_positive?-1:1;return{soc:o,capacityKwh:s,reserve:e.reserve??10,loadW:e.load?me(t.states[e.load]):null,dischargeW:null===n?null:n*r,morningHour:e.morning_hour??7}}function fe(t){return t?[t.soc,t.power,t.load,t.capacity].filter(t=>"string"==typeof t&&t.length>0):[]}function ye(t,e=t.soc){return t.capacityKwh*Math.max(0,e-t.reserve)/100}function we(t,e,o,s=e){const n=Math.min(e,s);if(null===t.dischargeW||n<=o)return t.soc;const r=(n-o)/Et,a=t.dischargeW/1e3*r*100/t.capacityKwh;return Math.min(100,Math.max(t.reserve,t.soc-a))}function be(t,e=t.soc){return null===t.loadW||t.loadW<=0?null:ye(t,e)/(t.loadW/1e3)*Et}const _e={today:0,tomorrow:1},ve=[0,6,12,18,24],$e=Array.from({length:24},(t,e)=>e);class xe extends Gt{static styles=[...Gt.styles,i`
      .source {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin: -6px 0 14px;
        color: var(--bo-muted);
        font-size: 12px;
      }

      .source span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .indicator {
        display: inline-flex;
        flex: none;
        align-items: center;
        gap: 6px;
        color: var(--tone);
      }

      .indicator::before {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: currentColor;
      }

      .day {
        display: grid;
        grid-template-columns: 76px minmax(0, 1fr);
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .day-name {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .day-name strong {
        font-size: 13px;
        font-weight: 600;
      }

      .day-name span {
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cells {
        position: relative;
        display: grid;
        grid-template-columns: repeat(24, minmax(0, 1fr));
        gap: 3px;
        height: 30px;
      }

      .cell {
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
        border-radius: 3px;
      }

      .cell span {
        min-width: 0;
      }

      .cells .overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bo-muted);
        font-size: 12px;
        pointer-events: none;
      }

      .cells .now {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 2px;
        border-radius: 1px;
        background: var(--bo-text);
        transform: translateX(-1px);
      }

      .axis {
        position: relative;
        height: 14px;
        margin: 4px 0 12px calc(76px + 12px);
      }

      .axis span {
        position: absolute;
        color: var(--bo-faint);
        font-size: 10px;
        transform: translateX(-50%);
      }

      .axis span:first-child {
        transform: none;
      }

      .axis span:last-child {
        transform: translateX(-100%);
      }

      .windows {
        display: flex;
        flex-direction: column;
        margin-top: 4px;
      }

      .window {
        display: grid;
        grid-template-columns: 12px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-top: 1px solid var(--bo-divider);
      }

      .window-main {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .window-title {
        overflow: hidden;
        font-size: 14px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .window-note {
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .window-total {
        color: var(--bo-text);
        font-family: var(--bo-mono);
        font-size: 13px;
        font-weight: 600;
      }

      .marker {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }

      .marker.empty {
        border: 1px solid var(--bo-faint);
        background: transparent;
      }

      .legend {
        margin-bottom: 4px;
      }
    `];cardSize=5;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){return{type:`custom:${_t}`,entity:le(t)}}extraEntities(){return fe(this.config?.battery)}defaultTitle(t){return t.t("title.schedule")}headerSide(t){return L`<span class="badge plain mono"
      >${t.t("schedule.queue",{group:t.payload.queue.group})}</span
    >`}dayKeys(){const t=this.config?.days;return t&&t.length>0?t:["today","tomorrow"]}renderContent(t){const e=this.config,o=this.hass?ge(this.hass,e?.battery):null,s=this.dayKeys().map(e=>({key:e,day:ie(t,_e[e])})),n=new Set(s.flatMap(({day:t})=>Pt(t)?[...t.slots]:["unknown"]));return L`${!1===e?.show_source?F:this.renderSource(t)}
      ${s.map(({key:e,day:o})=>this.renderDay(t,e,o))}
      <div class="axis mono">
        ${ve.map(t=>L`<span style="left:${t/24*100}%">${String(t).padStart(2,"0")}</span>`)}
      </div>
      ${!1===e?.show_legend?F:this.renderLegend(t,n)}
      ${!1===e?.show_windows?F:L`<div class="windows">
              ${s.map(({key:e,day:s})=>this.renderWindows(t,e,s,o))}
            </div>`}
      ${!1===e?.show_totals?F:L`<div class="divider"></div>
              ${ee(this.totals(t))}`}`}renderSource(t){const{payload:e,now:o,t:s,f:n}=t,r=e.source.name??e.queue.operator,a=e.source.last_success?s("schedule.source_updated",{source:r,ago:n.relative(e.source.last_success,o)}):r;return L`<div class="source">
      <span>${a}</span>
      <span class="indicator tone-${e.emergency?"emergency":"on"}"
        >${s(e.emergency?"schedule.emergency_active":"schedule.emergency_none")}</span
      >
    </div>`}renderDay(t,e,o){const{now:s,t:n,f:r}=t,a=Pt(o),i=a?o.slots:[],l="today"===e&&!1!==this.config?.show_now&&o,c=o?Mt(s,Date.parse(o.start),Date.parse(o.start)+864e5):0;return L`<div class="day">
      <div class="day-name">
        <strong>${n(`day.${e}`)}</strong>
        <span>${o?r.dayDate(o.start):""}</span>
      </div>
      <div class="cells">
        ${$e.map(t=>L`<div class="cell">
              <span class="fill-${i[2*t]??"unknown"}"></span>
              <span class="fill-${i[2*t+1]??"unknown"}"></span>
            </div>`)}
        ${a?F:L`<span class="overlay">${n("schedule.not_published")}</span>`}
        ${l?L`<span class="now" style="left:${c}%"></span>`:F}
      </div>
    </div>`}renderLegend(t,e){return L`<div class="legend">
      ${["on","off","possible","unknown"].filter(t=>"on"===t||"off"===t||e.has(t)).map(e=>L`<span class="legend-item"
              ><span class="swatch ${e}"></span>${t.t(`legend.${e}`)}</span
            >`)}
    </div>`}renderWindows(t,e,o,s){const{now:n,t:r,f:a}=t,i=r(`day.${e}`);if(!Pt(o))return L`<div class="window">
        <span class="marker empty"></span>
        <div class="window-main">
          <span class="window-title">${i}</span>
          <span class="window-note">${r("schedule.not_published")}</span>
        </div>
        <span class="window-total muted">${r("value.none")}</span>
      </div>`;const l=Tt(o).filter(t=>!t.possible),c=l.filter(t=>t.end>n),d=c.length>0?c:l;if(0===l.length)return L`<div class="window">
        <span class="marker fill-on"></span>
        <div class="window-main">
          <span class="window-title">${i}</span>
          <span class="window-note">${r("schedule.no_outages")}</span>
        </div>
        <span class="window-total">${a.number(0)} ${r("unit.hours")}</span>
      </div>`;const u=d.find(t=>t.end>n),h=[];return u&&u.start>n?(h.push(r("schedule.in",{duration:a.duration(u.start-n)})),s&&h.push(r("schedule.battery_at",{time:a.time(u.start),soc:a.number(we(s,u.start,n,this.changeUntil(t,u.start)),0)}))):u?h.push(r("schedule.now")):h.push(r("schedule.passed")),L`<div class="window">
      <span class="marker fill-off"></span>
      <div class="window-main">
        <span class="window-title"
          >${i} ·
          <span class="mono"
            >${d.map(t=>ne(a,t.start,t.end)).join(", ")}</span
          ></span
        >
        <span class="window-note">${h.join(" · ")}</span>
      </div>
      <span class="window-total">${a.number(o.outage_hours??0,0)} ${r("unit.hours")}</span>
    </div>`}changeUntil(t,e){const{status:o,next_power_on:s}=t.payload;return("scheduled_outage"===o||"unscheduled_outage"===o||"emergency"===o)&&s?Date.parse(s):e}totals(t){const{t:e,f:o}=t,s=ie(t,0),n=ie(t,1);return[{label:e("stat.without_power_today"),parts:oe(o,Pt(s)?s.outage_hours:null)},{label:e("stat.longest"),parts:oe(o,Pt(s)?s.longest_hours:null)},{label:e("stat.without_power_tomorrow"),parts:Pt(n)?oe(o,n.outage_hours):Jt(e("value.none"))}]}}const ke={power_on:["today","longest","tomorrow","emergency"],outage:["today","longest","tomorrow","emergency"],emergency:["today","tomorrow","region","emergency"]},Se={power_on:["today","longest","tomorrow","emergency"],outage:["load","battery_reserve","today","emergency"],emergency:["load","battery_reserve","until_morning","emergency"]};class Ae extends Gt{static styles=[...Gt.styles,Lt,i`
      .hero {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
      }

      .hero-label {
        color: var(--bo-muted);
        font-size: 12px;
        line-height: 16px;
      }

      .hero-value {
        color: var(--tone);
        font-family: var(--bo-mono);
        font-size: 40px;
        font-weight: 600;
        line-height: 46px;
        white-space: nowrap;
      }

      .hero-value .unit {
        margin: 0 6px 0 2px;
        font-size: 13px;
      }

      .hero-side {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        min-width: 0;
        padding-bottom: 6px;
        text-align: right;
      }

      .hero-window {
        color: var(--bo-text);
        font-family: var(--bo-mono);
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
      }

      .hero-note {
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .timeline {
        margin-top: 16px;
      }
    `];cardSize=4;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){return{type:`custom:${bt}`,entity:le(t)}}historyDays(){return this.statKeys("power_on").includes("availability")?7:1}extraEntities(){return fe(this.config?.battery)}defaultTitle(t){return this.queueTitle(t)}headerSide(t){if(!1===this.config?.show_badge)return F;const e=t.payload.status,o="emergency"===e;return te(t.t(`status.${e}`),Qt[e],o,o?"mdi:alert-outline":void 0)}renderContent(t){const e=this.config??{},o=this.hass?ge(this.hass,e.battery):null,s=this.hero(t),n=this.group(t),r=!1===e.show_stats?[]:this.stats(t,n,o);return L`<div class="hero">
        <div>
          <div class="hero-label">${s.label}</div>
          <div class="hero-value tone-${s.tone}">
            ${s.parts.map(t=>L`${t.value}${t.unit?L`<span class="unit">${t.unit}</span>`:F}`)}
          </div>
        </div>
        <div class="hero-side">
          ${s.side?L`<span class="hero-window">${s.side}</span>`:F}
          ${s.note?L`<span class="hero-note">${s.note}</span>`:F}
        </div>
      </div>
      ${!1===e.show_timeline?F:this.renderTimeline(t,o)}
      ${r.length>0?L`<div class="divider"></div>
              ${ee(r)}`:F}`}group(t){const e=t.payload.status;return"emergency"===e?"emergency":"scheduled_outage"===e||"unscheduled_outage"===e?"outage":"power_on"}outageSince(t){const{grid:e,region_status:o,current:s}=t.payload;return!1===e?.present&&e.since?Date.parse(e.since):s?Date.parse(s.start):o?.since?Date.parse(o.since):null}hero(t){const{payload:e,now:o,t:s,f:n}=t,r=e.source.last_success?s("hero.updated",{ago:n.relative(e.source.last_success,o)}):"";if("scheduled_outage"===e.status&&e.next_power_on){const t=Date.parse(e.next_power_on),r=e.current?Date.parse(e.current.start):o;return{label:s("hero.power_back_in"),parts:n.durationParts(t-o),tone:"on",side:s("hero.at",{time:n.time(t)}),note:[s("hero.since_schedule",{time:n.time(r)}),s("hero.elapsed",{duration:n.duration(o-r)})].join(" · ")}}if("emergency"===e.status||"unscheduled_outage"===e.status){const r=this.outageSince(t),a="emergency"===e.status?[s("hero.schedule_suspended"),s("hero.restore_unknown")].join(" · "):s("hero.outside_schedule");return{label:s("hero.no_power_for"),parts:null===r?Jt(s("value.none")):n.durationParts(o-r),tone:"emergency"===e.status?"emergency":"off",side:null===r?"":s("hero.since",{time:n.time(r)}),note:a}}const a=e.next??e.next_possible;if(!a)return{label:s("hero.no_outages"),parts:Jt(s("value.none")),tone:"muted",side:"",note:e.queue.has_schedule?r:s("hero.no_schedule")};const i=Date.parse(a.start),l=Date.parse(a.end);return{label:s(a.possible?"hero.possible_in":"hero.outage_in"),parts:n.durationParts(i-o),tone:a.possible?"possible":"off",side:ne(n,i,l),note:[s("hero.by_schedule",{duration:n.duration(l-i)}),r].filter(Boolean).join(" · ")}}forecast(t,e){const{payload:o,now:s,t:n,f:r}=t,a="power_on"!==o.status&&"possible_outage"!==o.status&&"unknown"!==o.status,i=o.next_power_on&&"emergency"!==o.status?Date.parse(o.next_power_on):null,l=a?s:o.next?Date.parse(o.next.start):s,c=a?i:o.next?Date.parse(o.next.end):null,d=we(e,l,s),u=be(e,d),h=null===u?null:l+u,p=null===h||null!==c&&h>=c,m=r.number(d,0);if(null===h)return{from:l,until:h,soc:d,enough:p,label:n("battery.forecast_full",{soc:m,time:r.time(l)}),short:`${m} %`};return{from:l,until:h,soc:d,enough:p,label:a?n("battery.forecast_now",{soc:m,until:r.time(h)}):n("battery.forecast_at",{soc:m,time:r.time(l),until:r.time(h)}),short:n("battery.forecast_short",{soc:m,until:r.time(h)})}}forecastText(t,e,o){const s=e>35?t.short:t.label;return L`<span class="bar-text" style="left:${e}%">${s}</span>${o}`}renderTimeline(t,e){const{payload:o,now:s,t:n,f:r}=t,a=this.config?.timeline_hours??8,i=this.config?.timeline_offset??1,l=Math.floor((s-i*Et)/Et)*Et,c=l+a*Et,d=function(t,e,o){return t.filter(t=>t.end>e&&t.start<o).map(t=>({...t,start:Math.max(t.start,e),end:Math.min(t.end,o)}))}(Dt(o.days),l,c).map(t=>({from:t.start,to:t.end,className:ae(t,s)}));if(d.push(...this.actualSegments(o.days.flatMap(t=>t.actual),l,c,s)),"emergency"===o.status){const e=this.outageSince(t)??s;d.push({from:Math.max(e,l),to:s,className:"fill-off"}),d.push({from:s,to:c,className:"fill-hatch"})}const u=L`<span class="now" style="left:${Mt(s,l,c)}%"></span>`,h=e?this.forecast(t,e):null,p=this.ticks(l,c,a);return L`<div class="timeline">
      <div class="row">
        <span class="row-label">${n("row.grid")}</span>${re(d,l,c,u)}
      </div>
      ${h?L`<div class="row">
              <span class="row-label">${n("row.battery")}</span>${re([{from:l,to:h.from,className:"fill-faint"},{from:h.from,to:h.until??c,className:h.enough?"fill-battery":"fill-battery-low"}],l,c,this.forecastText(h,Mt(h.from,l,c),u))}
            </div>`:F}
      <div class="row axis">
        <span class="row-label"></span>
        <div class="ticks">
          ${p.map(t=>L`<span class="tick mono" style="left:${Mt(t,l,c)}%">${r.time(t).slice(0,2)}</span>`)}
        </div>
      </div>
    </div>`}actualSegments(t,e,o,s){return t.map(t=>({from:Date.parse(t.start),to:t.end?Date.parse(t.end):s,className:"fill-actual"})).filter(t=>t.to>e&&t.from<o)}ticks(t,e,o){const s=Math.max(1,Math.round(o/4))*Et,n=[];for(let o=t;o<=e;o+=s)n.push(o);return n}statKeys(t){const e=this.config?.stats,o=this.config?.battery?.soc?Se:ke;if(Array.isArray(e))return e;const s=e;return s?.[t]??o[t]}stats(t,e,o){return this.statKeys(e).map(e=>this.stat(t,e,o)).filter(t=>null!==t)}stat(t,e,o){const{payload:s,now:n,t:r,f:a}=t,i=ie(t,0),l=ie(t,1);switch(e){case"today":return{label:r("stat.today"),parts:oe(a,i?.outage_hours)};case"longest":return{label:r("stat.longest"),parts:oe(a,i?.longest_hours)};case"tomorrow":return{label:r("stat.tomorrow"),parts:l&&"waiting"!==l.status?oe(a,l.outage_hours):Jt(r("value.not_yet"))};case"emergency":return{label:r("stat.emergency"),parts:Jt(r(s.emergency?"value.yes":"value.no")),tone:s.emergency?"emergency":"on"};case"region":return{label:r("stat.region"),parts:Jt(r(`region.${s.region_status?.status??"unknown"}`))};case"next_outage":return{label:r("stat.next_outage"),parts:Jt(s.next?a.time(s.next.start):r("value.none"))};case"power_back":return{label:r("stat.power_back"),parts:Jt(s.next_power_on?a.time(s.next_power_on):r("value.none"))};case"source":return{label:r("stat.source"),parts:Jt(s.source.name??r("value.none"))};case"actual_today":return null==i?.actual_hours?null:{label:r("stat.actual_today"),parts:se(a,i.actual_hours)};case"availability":return null===s.summary.availability?null:{label:r("stat.availability"),parts:[{value:a.number(s.summary.availability,1),unit:r("unit.percent")}]};default:return this.batteryStat(t,e,o,n)}}batteryStat(t,e,o,s){const{payload:n,t:r,f:a}=t;if(!o)return null;if("load"===e)return null===o.loadW?null:{label:r("stat.load"),parts:[a.power(o.loadW)]};if("battery_reserve"===e){const t=be(o);return{label:r("stat.battery_reserve"),parts:null===t?Jt("∞"):a.durationParts(t),tone:"on"}}if("battery_at_start"===e){if(!n.next)return null;const t=Date.parse(n.next.start);return{label:r("stat.battery_at_start",{time:a.time(t)}),parts:[{value:a.number(we(o,t,s),0),unit:r("unit.percent")}],tone:"on"}}if("until_morning"===e){const e=function(t,e,o){const s=(e-o)/Et;return s>0?ye(t)/s:null}(o,this.morning(t,o.morningHour),s);return null===e?null:{label:r("stat.until_morning"),parts:[{value:`≤ ${a.number(e,2)}`,unit:r("unit.kw")}]}}return null}morning(t,e){const{now:o,f:s}=t,n=o-o%Et;for(let t=1;t<=48;t+=1){const o=n+t*Et;if(Number(s.time(o).slice(0,2))===e)return o}return o+432e5}}const Ee=[0,6,12,18,24];class Ce extends Gt{static styles=[...Gt.styles,Lt,i`
      .summary {
        margin-bottom: 16px;
      }

      .summary .stat-value {
        font-size: 18px;
      }

      .rows .row {
        --row-label-width: 44px;
        --bar-height: 12px;
      }

      .rows .row-label {
        font-family: var(--bo-mono);
        font-size: 11px;
      }

      .rows .row.today .row-label {
        color: var(--bo-text);
        font-weight: 700;
      }

      .axis-line {
        position: relative;
        height: 14px;
        margin: 6px 0 0 calc(44px + 10px);
      }

      .axis-line span {
        position: absolute;
        color: var(--bo-faint);
        font-size: 10px;
        transform: translateX(-50%);
      }

      .axis-line span:first-child {
        transform: none;
      }

      .axis-line span:last-child {
        transform: translateX(-100%);
      }

      .legend {
        margin-top: 12px;
      }

      .next {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        margin-top: 16px;
        padding: 14px 16px;
        border-radius: 12px;
        background: var(--bo-surface);
      }

      .next-block {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }

      .next-label {
        color: var(--bo-muted);
        font-size: 11px;
      }

      .next-value {
        color: var(--tone, var(--bo-text));
        font-family: var(--bo-mono);
        font-size: 20px;
        font-weight: 700;
        white-space: nowrap;
      }

      .next-note {
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `];cardSize=6;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){return{type:`custom:${vt}`,entity:le(t)}}historyDays(){return Math.min(90,Math.max(1,this.config?.days??7))}extraEntities(){return fe(this.config?.battery)}defaultTitle(t){return t.t("title.week",{days:this.translator.plural("unit.days",this.historyDays())})}headerSide(t){const e=t.payload.grid;return!1!==this.config?.show_badge&&e&&null!==e.present?te(t.t(e.present?"week.grid_on":"week.grid_off"),e.present?"on":"off"):F}renderContent(t){const e=this.config,o=t.f.dayKey(new Date(t.now)),s=t.payload.days.filter(t=>t.date<=o).slice(-this.historyDays()),n=null!==t.payload.grid;return L`${!1!==e?.show_stats&&n?L`<div class="summary">${ee(this.summary(t))}</div>`:F}
      <div class="rows">
        ${s.map(e=>this.renderRow(t,e,e.date===o,n))}
      </div>
      <div class="axis-line mono">
        ${Ee.map(t=>L`<span style="left:${t/24*100}%">${String(t).padStart(2,"0")}</span>`)}
      </div>
      ${!1===e?.show_legend?F:this.renderLegend(t,n)}
      ${!1===e?.show_next?F:this.renderNext(t)}`}renderRow(t,e,o,s){const{now:n,f:r}=t,a=Date.parse(e.start),i=a+864e5,l=[],c=!1!==this.config?.show_schedule;if(s&&(l.push({from:a,to:Math.min(i,n),className:"fill-on"}),l.push(...e.actual.map(t=>({from:Date.parse(t.start),to:t.end?Date.parse(t.end):n,className:"fill-actual"})))),c&&"waiting"!==e.status)for(const t of Tt(e)){const e=s?Math.max(t.start,n):t.start;t.end>e&&l.push({from:e,to:t.end,className:s?"fill-hatch":t.possible?"fill-possible":"fill-actual"})}const d=o?L`<span class="now" style="left:${Mt(n,a,i)}%"></span>`:void 0;return L`<div class="row ${o?"today":""}">
      <span class="row-label">${r.weekday(e.start)}</span>${re(l,a,i,d)}
    </div>`}renderLegend(t,e){const{t:o}=t;return L`<div class="legend">
      ${e?L`<span class="legend-item"><span class="swatch on"></span>${o("legend.grid_on")}</span>`:F}
      <span class="legend-item"><span class="swatch off"></span>${o("legend.off")}</span>
      ${e&&!1!==this.config?.show_schedule?L`<span class="legend-item"
              ><span class="swatch hatch"></span>${o("legend.by_schedule")}</span
            >`:F}
    </div>`}summary(t){const{payload:e,t:o,f:s}=t,n=e.summary,r=n.longest;return[{label:o("stat.without_grid"),parts:null===n.actual_hours?Jt(o("value.none")):s.durationParts(n.actual_hours*Et)},{label:o("stat.outages"),parts:Jt(String(n.count??0))},{label:o("stat.longest"),parts:r?s.durationParts(r.hours*Et):Jt(o("value.none"))},{label:o("stat.availability"),parts:null===n.availability?Jt(o("value.none")):[{value:s.number(n.availability,1),unit:o("unit.percent")}]}]}renderNext(t){const{payload:e,now:o,t:s,f:n}=t,r=e.next,a=this.hass?ge(this.hass,this.config?.battery):null;if(!r)return L`<div class="next">
        <div class="next-block">
          <span class="next-label">${s("week.next_by_schedule")}</span>
          <span class="next-value muted">${s("week.no_next")}</span>
        </div>
      </div>`;const i=Date.parse(r.start),l=Date.parse(r.end),c=("scheduled_outage"===e.status||"unscheduled_outage"===e.status||"emergency"===e.status)&&e.next_power_on?Date.parse(e.next_power_on):i,d=a?we(a,i,o,c):null,u=a&&null!==d?be(a,d):null,h=null===u||i+u>=l;return L`<div class="next">
      <div class="next-block">
        <span class="next-label">${s("week.next_by_schedule")}</span>
        <span class="next-value">${ne(n,i,l)}</span>
        <span class="next-note"
          >${s("week.next_meta",{duration:n.duration(Math.max(0,i-o)),group:e.queue.group})}</span
        >
      </div>
      ${a&&null!==d?L`<div class="next-block">
              <span class="next-label">${s("week.battery_forecast",{time:n.time(i)})}</span>
              <span class="next-value tone-${h?"on":"possible"}"
                >${h?"✓":"!"} ${n.number(d,0)} %</span
              >
              <span class="next-note"
                >${null===u?"":s("week.battery_lasts",{duration:n.duration(u)})}</span
              >
            </div>`:F}
    </div>`}}const De=t=>({name:t,selector:{boolean:{}}}),Te=(t,e,o,s=1)=>({name:t,selector:{number:{min:e,max:o,step:s,mode:"box"}}}),Pe=t=>({name:t,selector:{object:{}}}),Me=(t,e,o,s=!1)=>({name:t,selector:{select:{multiple:s,mode:"dropdown",options:e.map(t=>({value:t,label:o(`editor.option.${t}`)}))}}});function Oe(t){return{name:"entity",required:t,selector:{entity:{filter:{integration:"blackout"}}}}}function ze(t){const e=t=>({name:t,selector:{entity:{filter:{domain:"sensor"}}}});return{type:"expandable",name:"battery",title:t("editor.battery"),schema:[e("soc"),e("power"),e("load"),Te("capacity",0,1e3,.1),Te("reserve",0,100),Me("power_positive",["discharge","charge"],t),Te("morning_hour",0,23)]}}function Ue(t){return{type:"expandable",name:"advanced",title:t("editor.advanced"),flatten:!0,schema:[{name:"language",selector:{select:{mode:"dropdown",options:Ht.map(t=>({value:t,label:t.toUpperCase()}))}}},{name:"time_zone",selector:{text:{}}},Me("tap_action",["more-info","none"],t),Pe("labels"),Pe("colors")]}}function Ne(t){return[Oe(t),{name:"title",selector:{text:{}}},De("show_header")]}function je(t){return Object.fromEntries(Object.entries(t).filter(([,t])=>null!=t&&""!==t&&!("object"==typeof t&&!Array.isArray(t)&&0===Object.keys(t).length)))}let qe=(()=>{let o,s,n=lt,r=[],a=[],i=[],l=[];return class extends n{static{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;o=[ht({attribute:!1})],s=[pt()],t(this,null,o,{kind:"accessor",name:"hass",static:!1,private:!1,access:{has:t=>"hass"in t,get:t=>t.hass,set:(t,e)=>{t.hass=e}},metadata:e},r,a),t(this,null,s,{kind:"accessor",name:"config",static:!1,private:!1,access:{has:t=>"config"in t,get:t=>t.config,set:(t,e)=>{t.config=e}},metadata:e},i,l),e&&Object.defineProperty(this,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})}#t=e(this,r,void 0);get hass(){return this.#t}set hass(t){this.#t=t}#e=(e(this,a),e(this,i,void 0));get config(){return this.#e}set config(t){this.#e=t}translator=(e(this,l),It("en"));setConfig(t){this.config=t}connectedCallback(){super.connectedCallback(),async function(){if(customElements.get("ha-form")&&customElements.get("ha-selector"))return;const t=await(window.loadCardHelpers?.());if(!t)return;const e=(await t.createCardElement({type:"entities",entities:[]})).constructor;await(e.getConfigElement?.())}().then(()=>this.requestUpdate())}willUpdate(){this.translator=It(this.hass?.locale?.language??this.hass?.language)}render(){if(!this.hass||!this.config)return F;const t=t=>this.translator.t(t),e=function(t,e){switch(t.replace(/^custom:/,"")){case bt:return[...Ne(!0),De("show_badge"),De("show_timeline"),De("show_stats"),Te("timeline_hours",2,48),Te("timeline_offset",0,24),Pe("stats"),ze(e),Ue(e)];case _t:return[...Ne(!0),Me("days",["today","tomorrow"],e,!0),De("show_source"),De("show_now"),De("show_legend"),De("show_windows"),De("show_totals"),ze(e),Ue(e)];case vt:return[...Ne(!0),Te("days",1,90),De("show_badge"),De("show_stats"),De("show_schedule"),De("show_legend"),De("show_next"),ze(e),Ue(e)];case $t:return[...Ne(!1),{name:"since",selector:{text:{}}},Te("columns",1,4),Pe("items"),Ue(e)];default:return Ne(!0)}}(this.config.type,t);return L`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${e}
      .computeLabel=${e=>t(`editor.${e.name}`)}
      .computeHelper=${e=>{const o=`editor.helper.${e.name}`,s=t(o);return s===o?void 0:s}}
      @value-changed=${this.valueChanged}
    ></ha-form>`}valueChanged=t=>{if(t.stopPropagation(),!this.config)return;const e=je({...t.detail.value}),o=e.battery;if(o&&"object"==typeof o&&!Array.isArray(o)){const t=je(o);0===Object.keys(t).length?delete e.battery:e.battery=t}const s={...e,type:this.config.type};this.config=s,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}}})();const He=[[bt,Ae],[_t,xe],[vt,Ce],[$t,he],["blackout-card-editor",qe]],Re=[{type:bt,name:"Blackout status",description:"Power now, countdown to the next outage or to power back, grid and battery timeline."},{type:_t,name:"Blackout schedule",description:"Outage schedule for today and tomorrow by half hours, windows and totals."},{type:vt,name:"Blackout week",description:"Actual outages of the last days with the schedule, availability and the next outage."},{type:$t,name:"Blackout records",description:"Outage records and any records from long-term statistics."}];for(const[t,e]of He)customElements.get(t)||customElements.define(t,e);window.customCards=window.customCards??[];for(const t of Re)window.customCards.some(e=>e.type===t.type)||window.customCards.push({...t,preview:!0,documentationURL:"https://github.com/RobinCK/blackout"});console.info("%c BLACKOUT CARDS %c 0.1.0 ","font-weight: bold","");

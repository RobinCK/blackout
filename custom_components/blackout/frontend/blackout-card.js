function t(t,e,s,o,a,n){function r(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var i,l=o.kind,c="getter"===l?"get":"setter"===l?"set":"value",d=!e&&t?o.static?t:t.prototype:null,u=e||(d?Object.getOwnPropertyDescriptor(d,o.name):{}),h=!1,p=s.length-1;p>=0;p--){var m={};for(var g in o)m[g]="access"===g?{}:o[g];for(var g in o.access)m.access[g]=o.access[g];m.addInitializer=function(t){if(h)throw new TypeError("Cannot add initializers after decoration has completed");n.push(r(t||null))};var f=(0,s[p])("accessor"===l?{get:u.get,set:u.set}:u[c],m);if("accessor"===l){if(void 0===f)continue;if(null===f||"object"!=typeof f)throw new TypeError("Object expected");(i=r(f.get))&&(u.get=i),(i=r(f.set))&&(u.set=i),(i=r(f.init))&&a.unshift(i)}else(i=r(f))&&("field"===l?a.unshift(i):u[c]=i)}d&&Object.defineProperty(d,o.name,u),h=!0}function e(t,e,s){for(var o=arguments.length>2,a=0;a<e.length;a++)s=o?e[a].call(t,s):e[a].call(t);return o?s:void 0}"function"==typeof SuppressedError&&SuppressedError;const s=globalThis,o=s.ShadowRoot&&(void 0===s.ShadyCSS||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),n=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(o&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&n.set(e,t))}return t}toString(){return this.cssText}};const i=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new r(s,t,a)},l=o?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,a))(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:u,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,g=globalThis,f=g.trustedTypes,y=f?f.emptyScript:"",b=g.reactiveElementPolyfillSupport,w=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?y:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},_=(t,e)=>!c(t,e),x={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),o=this.getPropertyDescriptor(t,s,e);void 0!==o&&d(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){const{get:o,set:a}=u(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const n=o?.call(this);a?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const t=m(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(o)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const o of e){const e=document.createElement("style"),a=s.litNonce;void 0!==a&&e.setAttribute("nonce",a),e.textContent=o.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(void 0!==o&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(e,s.type);this._$Em=t,null==a?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(t,e){const s=this.constructor,o=s._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=s.getPropertyOptions(o),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=o;const n=a.fromAttribute(e,t.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(t,e,s,o=!1,a){if(void 0!==t){const n=this.constructor;if(!1===o&&(a=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??_)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:a},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==a||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,s,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[w("elementProperties")]=new Map,$[w("finalized")]=new Map,b?.({ReactiveElement:$}),(g.reactiveElementVersions??=[]).push("2.1.2");const k=globalThis,S=t=>t,A=k.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,D="?"+M,P=`<${D}>`,T=document,O=()=>T.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,j="[ \t\n\f\r]",q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,B=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,L=/"/g,I=/^(?:script|style|textarea|title)$/i,W=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),K=W(1),F=W(2),Z=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),Q=new WeakMap,X=T.createTreeWalker(T,129);function J(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const G=(t,e)=>{const s=t.length-1,o=[];let a,n=2===e?"<svg>":3===e?"<math>":"",r=q;for(let e=0;e<s;e++){const s=t[e];let i,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===q?"!--"===l[1]?r=U:void 0!==l[1]?r=H:void 0!==l[2]?(I.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=B):void 0!==l[3]&&(r=B):r===B?">"===l[0]?(r=a??q,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,i=l[1],r=void 0===l[3]?B:'"'===l[3]?L:R):r===L||r===R?r=B:r===U||r===H?r=q:(r=B,a=void 0);const u=r===B&&t[e+1].startsWith("/>")?" ":"";n+=r===q?s+P:c>=0?(o.push(i),s.slice(0,c)+C+s.slice(c)+M+u):s+M+(-2===c?e:u)}return[J(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Y{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let a=0,n=0;const r=t.length-1,i=this.parts,[l,c]=G(t,e);if(this.el=Y.createElement(l,s),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=X.nextNode())&&i.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(C)){const e=c[n++],s=o.getAttribute(t).split(M),r=/([.?@])?(.*)/.exec(e);i.push({type:1,index:a,name:r[2],strings:s,ctor:"."===r[1]?at:"?"===r[1]?nt:"@"===r[1]?rt:ot}),o.removeAttribute(t)}else t.startsWith(M)&&(i.push({type:6,index:a}),o.removeAttribute(t));if(I.test(o.tagName)){const t=o.textContent.split(M),e=t.length-1;if(e>0){o.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)o.append(t[s],O()),X.nextNode(),i.push({type:2,index:++a});o.append(t[e],O())}}}else if(8===o.nodeType)if(o.data===D)i.push({type:2,index:a});else{let t=-1;for(;-1!==(t=o.data.indexOf(M,t+1));)i.push({type:7,index:a}),t+=M.length-1}a++}}static createElement(t,e){const s=T.createElement("template");return s.innerHTML=t,s}}function tt(t,e,s=t,o){if(e===Z)return e;let a=void 0!==o?s._$Co?.[o]:s._$Cl;const n=z(e)?void 0:e._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),void 0===n?a=void 0:(a=new n(t),a._$AT(t,s,o)),void 0!==o?(s._$Co??=[])[o]=a:s._$Cl=a),void 0!==a&&(e=tt(t,a._$AS(t,e.values),a,o)),e}class et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??T).importNode(e,!0);X.currentNode=o;let a=X.nextNode(),n=0,r=0,i=s[0];for(;void 0!==i;){if(n===i.index){let e;2===i.type?e=new st(a,a.nextSibling,this,t):1===i.type?e=new i.ctor(a,i.name,i.strings,this,t):6===i.type&&(e=new it(a,this,t)),this._$AV.push(e),i=s[++r]}n!==i?.index&&(a=X.nextNode(),n++)}return X.currentNode=T,o}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class st{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),z(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==Z&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new et(o,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=Q.get(t.strings);return void 0===e&&Q.set(t.strings,e=new Y(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,o=0;for(const a of t)o===e.length?e.push(s=new st(this.O(O()),this.O(O()),this,this.options)):s=e[o],s._$AI(a),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class ot{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,a){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,o){const a=this.strings;let n=!1;if(void 0===a)t=tt(this,t,e,0),n=!z(t)||t!==this._$AH&&t!==Z,n&&(this._$AH=t);else{const o=t;let r,i;for(t=a[0],r=0;r<a.length-1;r++)i=tt(this,o[s+r],e,r),i===Z&&(i=this._$AH[r]),n||=!z(i)||i!==this._$AH[r],i===V?t=V:t!==V&&(t+=(i??"")+a[r+1]),this._$AH[r]=i}n&&!o&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class at extends ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class nt extends ot{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class rt extends ot{constructor(t,e,s,o,a){super(t,e,s,o,a),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??V)===Z)return;const s=this._$AH,o=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==V&&(s===V||o);o&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const lt=k.litHtmlPolyfillSupport;lt?.(Y,st),(k.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;let dt=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const o=s?.renderBefore??e;let a=o._$litPart$;if(void 0===a){const t=s?.renderBefore??null;o._$litPart$=a=new st(e.insertBefore(O(),t),t,void 0,s??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}};dt._$litElement$=!0,dt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:dt});const ut=ct.litElementPolyfillSupport;ut?.({LitElement:dt}),(ct.litElementVersions??=[]).push("4.2.2");const ht={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:_},pt=(t=ht,e,s)=>{const{kind:o,metadata:a}=s;let n=globalThis.litPropertyMetadata.get(a);if(void 0===n&&globalThis.litPropertyMetadata.set(a,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===o){const{name:o}=s;return{set(s){const a=e.get.call(this);e.set.call(this,s),this.requestUpdate(o,a,t,!0,s)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=s;return function(s){const a=this[o];e.call(this,s),this.requestUpdate(o,a,t,!0,s)}}throw Error("Unsupported decorator location: "+o)};function mt(t){return(e,s)=>"object"==typeof s?pt(t,e,s):((t,e,s)=>{const o=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),o?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function gt(t){return mt({...t,state:!0,attribute:!1})}const ft=1;let yt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const bt="important",wt=" !"+bt,vt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends yt{constructor(t){if(super(t),t.type!==ft||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,s)=>{const o=t[s];return null==o?e:e+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(t,[e]){const{style:s}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in e){const o=e[t];if(null!=o){this.ft.add(t);const e="string"==typeof o&&o.endsWith(wt);t.includes("-")||e?s.setProperty(t,e?o.slice(0,-11):o,e?bt:""):s[t]=o}}return Z}}),_t="blackout-status-card",xt="blackout-schedule-card",$t="blackout-week-card",kt="blackout-records-card",St="blackout-battery-card",At="blackout-voltage-card",Et=["today","tomorrow"],Ct={show_header:!0,tap_action:"more-info"},Mt={[_t]:{...Ct,show_badge:!0,show_timeline:!0,timeline_hours:8,timeline_offset:1,show_stats:!0},[xt]:{...Ct,days:Et,show_source:!0,show_now:!0,show_legend:!0,show_windows:!0,show_totals:!0},[$t]:{...Ct,days:7,show_badge:!0,show_stats:!0,show_schedule:!0,show_legend:!0,show_next:!0},[kt]:{...Ct,columns:2},[St]:Ct,[At]:{...Ct,voltage_min:207,voltage_max:253}},Dt={reserve:10,power_positive:"discharge",morning_hour:7},Pt=18e5,Tt=36e5;function Ot(t){return Date.parse(t.start)}function zt(t){const e=[];for(const s of t){const t=Ot(s);s.slots.forEach((s,o)=>{const a=t+o*Pt,n=e.at(-1);n&&n.state===s&&n.end===a?e[e.length-1]={...n,end:a+Pt}:e.push({start:a,end:a+Pt,state:s})})}return e}function Nt(t){return zt([t]).filter(t=>"off"===t.state||"possible"===t.state).map(t=>({start:t.start,end:t.end,possible:"possible"===t.state}))}function jt(t){return void 0!==t&&"waiting"!==t.status}function qt(t,e,s){return Math.min(100,Math.max(0,(t-e)/(s-e)*100))}function Ut(t){if(!t)return null;const e=Number.parseFloat(t.state);return Number.isFinite(e)?e:null}function Ht(t){const e=Ut(t);return null!==e&&t?"kw"===t.attributes.unit_of_measurement?.toLowerCase()?1e3*e:e:null}function Bt(t,e){if(!e?.soc)return null;const s=Ut(t.states[e.soc]),o=function(t,e){if("number"==typeof e)return e>0?e:null;if(!e)return null;const s=t.states[e],o=Ut(s);return null!==o&&s?"wh"===s.attributes.unit_of_measurement?.toLowerCase()?o/1e3:o:null}(t,e.capacity);if(null===s||null===o)return null;const a=e.power?Ht(t.states[e.power]):null,n="charge"===e.power_positive?-1:1;return{soc:s,capacityKwh:o,reserve:e.reserve??10,loadW:e.load?Ht(t.states[e.load]):null,dischargeW:null===a?null:a*n,morningHour:e.morning_hour??7}}function Rt(t){return t?[t.soc,t.power,t.load,t.capacity].filter(t=>"string"==typeof t&&t.length>0):[]}function Lt(t,e=t.soc){return t.capacityKwh*Math.max(0,e-t.reserve)/100}function It(t,e,s,o=e){const a=Math.min(e,o);if(null===t.dischargeW||a<=s)return t.soc;const n=(a-s)/Tt,r=t.dischargeW/1e3*n*100/t.capacityKwh;return Math.min(100,Math.max(t.reserve,t.soc-r))}function Wt(t,e=t.soc){return null===t.loadW||t.loadW<=0?null:Lt(t,e)/(t.loadW/1e3)*Tt}function Kt(t,e){let s=null,o=0,a=0;for(const[e,n]of t.entries()){(null===s||n.value<s.value)&&(s=n);const r=t[e-1];if(r){const t=n.value-r.value;o+=Math.max(0,t),a+=Math.max(0,-t)}}if(null===e)return{min:s,charged:null,discharged:null,cycles:null};const n=o*e/100,r=a*e/100;return{min:s,charged:n,discharged:r,cycles:(n+r)/2/e}}function Ft(t,e,s,o){const a=t.capacityKwh,n=[{time:e,soc:t.soc}],r=function(t,e,s){const o=s.flatMap(t=>[t.start,t.end]).filter(s=>s>t&&s<e);return[...new Set([t,...o,e])].sort((t,e)=>t-e)}(e,s,o);let i=t.soc,l=null,c=!0;for(const[e,s]of r.entries()){const d=r[e+1];if(void 0===d)break;const u=o.some(t=>t.start<=s&&s<t.end);u&&(c=!1);const h=(u?t.loadW??Math.max(0,t.dischargeW??0):c?t.dischargeW??0:0)/1e3/a*(100/Tt),p=h>0?t.reserve:100;if(!(h>0?i>p:h<0&&i<p)){n.push({time:d,soc:i});continue}const m=s+(i-p)/h;m<d?(100===p&&(l=l??m),i=p,n.push({time:m,soc:i},{time:d,soc:i})):(i-=h*(d-s),n.push({time:d,soc:i}))}return{points:n,full:l}}const Zt="Europe/Kyiv",Vt=6e4;function Qt(t){return t instanceof Date?t:new Date(t)}function Xt(t,e=Zt){const{locale:s}=t,o=t.t,a=new Intl.DateTimeFormat(s,{hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:e}),n=new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:e}),r=new Intl.DateTimeFormat(s,{day:"numeric",month:"short",year:"numeric",timeZone:e}),i=new Intl.DateTimeFormat(s,{day:"numeric",month:"short",timeZone:e}),l=new Intl.DateTimeFormat(s,{weekday:"short",day:"numeric",month:"short",timeZone:e}),c=new Intl.DateTimeFormat(s,{month:"long",year:"numeric",timeZone:e}),d=new Intl.DateTimeFormat(s,{weekday:"short",timeZone:e}),u=new Intl.DateTimeFormat(s,{day:"numeric",timeZone:e}),h=new Map,p=(t,e=0)=>{let o=h.get(e);return o||(o=new Intl.NumberFormat(s,{minimumFractionDigits:e,maximumFractionDigits:e}),h.set(e,o)),o.format(t)},m=t=>{const e=Math.max(0,Math.round(t/Vt)),s=Math.floor(e/1440),a=Math.floor(e%1440/60),n=e%60;return s>0?[{value:String(s),unit:o("unit.d")},{value:String(a),unit:o("unit.h")}]:a>0?[{value:String(a),unit:o("unit.h")},{value:String(n).padStart(2,"0"),unit:o("unit.min")}]:[{value:String(n),unit:o("unit.min")}]};return{translator:t,timeZone:e,number:p,time:t=>a.format(Qt(t)),dayKey:t=>n.format(Qt(t)),date:t=>r.format(Qt(t)),shortDate:t=>i.format(Qt(t)),dayDate:t=>l.format(Qt(t)),dateTime:t=>`${r.format(Qt(t))}, ${a.format(Qt(t))}`,month:t=>c.format(Qt(t)),weekday:t=>{const e=Qt(t),s=d.format(e);return`${s.charAt(0).toUpperCase()}${s.slice(1)} ${u.format(e)}`},durationParts:m,duration:t=>m(t).map(t=>`${t.value} ${t.unit}`).join(" "),hours:(t,e=1)=>`${p(t,e)} ${o("unit.hours")}`,relative:(t,e)=>{const s=e-Qt(t).getTime();return s<Vt?o("relative.just_now"):o("relative.ago",{duration:m(s).map(t=>`${t.value} ${t.unit}`).join(" ")})},power:t=>Math.abs(t)>=1e3?{value:p(t/1e3,1),unit:o("unit.kw")}:{value:p(t,0),unit:o("unit.w")}}}function Jt(t,e){const s=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23",timeZone:e}).formatToParts(t),o=t=>Number(s.find(e=>e.type===t)?.value??0);return t-1e3*(60*(60*o("hour")+o("minute"))+o("second"))-t%1e3}const Gt=new Map;class Yt extends Error{}class te{host;payload;error;now=Date.now();hass;entityId;days=1;version="";requested="";refreshTimer;tickTimer;constructor(t){this.host=t,t.addController(this)}hostConnected(){this.refreshTimer=setInterval(()=>this.load(!0),6e4),this.tickTimer=setInterval(()=>{this.now=Date.now(),this.host.requestUpdate()},2e4)}hostDisconnected(){clearInterval(this.refreshTimer),clearInterval(this.tickTimer)}sync(t,e,s){if(this.hass=t,!e)return this.payload=void 0,void(this.error="no_entity");const o=t.states[e]?.last_updated??"",a=e!==this.entityId||s!==this.days||o!==this.version;this.entityId=e,this.days=s,this.version=o,a&&this.load(!1)}load(t){const{hass:e,entityId:s}=this;if(!e||!s)return;const o=t?`${this.version}|${Date.now()}`:this.version,a=`${s}|${this.days}|${o}`;(t||a!==this.requested)&&(this.requested=a,function(t,e,s,o){const a=`${e}|${s}`,n=Gt.get(a);if(n&&n.version===o&&Date.now()-n.at<15e3)return n.promise;const r=t.callWS({type:"blackout/queue",entity_id:e,days:s}).catch(t=>{throw Gt.delete(a),function(t){return"object"==typeof t&&null!==t&&"code"in t&&"not_found"===t.code}(t)?new Yt(e):t});return Gt.set(a,{at:Date.now(),version:o,promise:r}),r}(e,s,this.days,o).then(t=>{this.payload=t,this.error=void 0}).catch(t=>{this.error=t instanceof Yt?"not_found":"failed"}).finally(()=>{this.now=Date.now(),this.host.requestUpdate()}))}}const ee={"title.power":"Power","title.queue":"Queue {group}","title.schedule":"Outage schedule","title.week":"Outages · {days}","title.records":"Records","title.battery":"Battery · day","title.voltage":"Voltage quality · 24 h","status.power_on":"Power on","status.scheduled_outage":"No power","status.possible_outage":"Possible outage","status.emergency":"Emergency outages","status.unscheduled_outage":"Unscheduled outage","status.unknown":"No data","region.normal":"Enough power","region.shortage":"Save power","region.outage_schedules":"Schedules apply","region.emergency_outages":"Emergency outages","region.grid_damage":"Grid damage","region.unknown":"Unknown","hero.outage_in":"Outage in","hero.power_back_in":"Power back in","hero.no_power_for":"No power for","hero.no_outages":"No outages scheduled","hero.possible_in":"Possible outage in","hero.at":"at {time}","hero.since":"since {time}","hero.by_schedule":"{duration} by schedule","hero.updated":"updated {ago}","hero.since_schedule":"since {time} by schedule","hero.elapsed":"{duration} ago","hero.schedule_suspended":"schedule suspended","hero.restore_unknown":"power back time unknown","hero.outside_schedule":"outside the schedule","hero.no_schedule":"no schedule published","row.grid":"Grid","row.battery":"Battery","battery.forecast_at":"{soc} % at {time} → lasts until {until}","battery.forecast_now":"{soc} % → lasts until {until}","battery.forecast_short":"{soc} % → {until}","battery.forecast_full":"{soc} % at {time} → lasts the whole outage","stat.today":"Today","stat.longest":"Longest","stat.tomorrow":"Tomorrow","stat.emergency":"Emergency","stat.load":"Load","stat.battery_reserve":"Battery reserve","stat.battery_at_start":"Battery at {time}","stat.until_morning":"Until morning at","stat.actual_today":"Without grid today","stat.availability":"Availability","stat.region":"Region","stat.next_outage":"Next outage","stat.power_back":"Power back","stat.source":"Source","stat.without_grid":"Without grid","stat.outages":"Outages","stat.without_power_today":"Without power today","stat.without_power_tomorrow":"Without power tomorrow","stat.charged":"Charged","stat.discharged":"Discharged","stat.cycles":"Cycles today","stat.min_soc":"Min SOC","stat.voltage_min":"Minimum","stat.voltage_max":"Maximum","stat.outage_time":"Outages","value.yes":"yes","value.no":"no","value.not_yet":"not yet","value.none":"—","day.today":"Today","day.tomorrow":"Tomorrow","schedule.not_published":"not published yet","schedule.no_outages":"no outages","schedule.queue":"queue {group}","schedule.emergency_none":"no emergency outages","schedule.emergency_active":"emergency outages","schedule.source_updated":"{source} · updated {ago}","schedule.in":"in {duration}","schedule.battery_at":"battery at {time} ≈ {soc} %","schedule.now":"now","schedule.passed":"passed","legend.on":"power on","legend.off":"outage","legend.possible":"possible","legend.unknown":"no schedule","legend.grid_on":"grid on","legend.by_schedule":"by schedule","legend.skipped":"scheduled, no outage","legend.emergency":"emergency","legend.fact":"actual","legend.forecast":"forecast","legend.outage_window":"outage {window}","legend.voltage_input":"input, min–max","legend.voltage_out":"outside {min}–{max} V","legend.voltage_output":"after stabilizers","hover.schedule":"Schedule","hover.no_power":"no power","week.grid_on":"Grid on","week.grid_off":"No grid","week.next_by_schedule":"Next by schedule","week.next_meta":"in {duration} · queue {group}","week.battery_forecast":"Battery forecast at {time}","week.battery_lasts":"lasts ≈ {duration}","week.no_next":"nothing scheduled","records.since":"since {date}","records.longest_outage":"Longest outage","records.longest_power_streak":"Longest without outages","records.current_power_streak":"Without outages now","records.worst_day":"Worst day","records.outage_count":"Outages","records.statistic":"Record","records.streak":"Streak","records.no_data":"no data yet","error.no_entity":"Choose an entity of a Blackout queue","battery_card.charging":"Charging · {soc} %","battery_card.discharging":"Discharging · {soc} %","battery_card.idle":"Idle · {soc} %","battery_card.full_at":"full ≈ {time}","battery_card.reserve":"min {value} %","battery_card.off":"off","battery_card.configure":"Set the battery state of charge in the card editor","voltage.in_norm":"in range","voltage.now":"now","voltage.no_outages":"no outages","voltage.configure":"Add the phase voltage sensors in the card editor","error.not_found":"The entity is not a Blackout queue entity","error.loading":"Loading…","error.failed":"Data is unavailable","unit.d":"d","unit.h":"h","unit.min":"min","unit.hours":"h","unit.kw":"kW","unit.w":"W","unit.percent":"%","voltage.outages_one":"{count} outage","voltage.outages_other":"{count} outages","unit.kwh":"kWh","unit.v":"V","unit.days_one":"{count} day","unit.days_other":"{count} days","relative.just_now":"just now","relative.ago":"{duration} ago","editor.entity":"Queue entity","editor.title":"Title","editor.show_header":"Show header","editor.language":"Language","editor.time_zone":"Time zone","editor.tap_action":"Header tap action","editor.labels":"Text overrides","editor.colors":"Colors","editor.show_badge":"Show status badge","editor.show_timeline":"Show timeline","editor.show_stats":"Show statistics","editor.timeline_hours":"Timeline length (hours)","editor.timeline_offset":"Hours before now","editor.stats":"Statistics","editor.days":"Days","editor.show_source":"Show source line","editor.show_now":"Show current time","editor.show_legend":"Show legend","editor.show_windows":"Show outage windows","editor.show_totals":"Show totals","editor.show_schedule":"Show schedule","editor.show_next":"Show next outage","editor.since":"Subtitle","editor.columns":"Columns","editor.items":"Records","editor.battery":"Battery","editor.advanced":"Advanced","editor.battery_hint.status":"Battery forecast on the timeline and battery statistics.","editor.battery_hint.schedule":"Expected battery level at the start of each upcoming outage.","editor.battery_hint.week":"Expected battery level and runtime for the next outage.","editor.soc":"State of charge","editor.power":"Battery power","editor.load":"Load power","editor.capacity":"Capacity (kWh)","editor.reserve":"Reserve (%)","editor.power_positive":"Positive battery power means","editor.morning_hour":"Morning hour","editor.battery_hint.battery":"The state of charge draws the day; the capacity adds energy, cycles and the forecast; the battery power and the load refine the forecast.","editor.phases":"Phases","editor.phases_hint":"Voltage sensors with long-term statistics. After stabilizers is optional.","editor.phase_input":"{phase} · input","editor.phase_output":"{phase} · after stabilizers","editor.voltage_min":"Lowest normal voltage (V)","editor.voltage_max":"Highest normal voltage (V)","editor.option.auto":"Home Assistant language","editor.option.discharge":"Discharging","editor.option.charge":"Charging","editor.option.more-info":"More info","editor.option.none":"Nothing","editor.option.today":"Today","editor.option.tomorrow":"Tomorrow","editor.sensors_one":"{count} sensor","editor.sensors_other":"{count} sensors","editor.helper.entity":"Any entity of a Blackout queue, for example its power status sensor","editor.helper.capacity":"Required together with the state of charge","editor.helper.labels":'Keys of the built-in texts with your own text, for example "hero.outage_in": "Off in"',"editor.helper.colors":"on, off, possible, emergency, battery, unknown","editor.helper.stats":"A list of statistics or lists per state: power_on, outage, emergency","editor.helper.items":"longest_outage, longest_power_streak, current_power_streak, worst_day, outage_count, statistic, streak"},se={en:ee,uk:{"title.power":"Світло","title.queue":"Черга {group}","title.schedule":"Графік відключень","title.week":"Відключення · {days}","title.records":"Рекорди","title.battery":"АКБ · доба","title.voltage":"Якість напруги · 24 год","status.power_on":"Світло є","status.scheduled_outage":"Світла немає","status.possible_outage":"Можливе відключення","status.emergency":"Аварійні відключення","status.unscheduled_outage":"Позапланове відключення","status.unknown":"Немає даних","region.normal":"Електроенергії достатньо","region.shortage":"Споживайте ощадливо","region.outage_schedules":"Діють графіки","region.emergency_outages":"Аварійні відключення","region.grid_damage":"Пошкодження мережі","region.unknown":"Невідомо","hero.outage_in":"Відключення через","hero.power_back_in":"Світло через","hero.no_power_for":"Світла немає вже","hero.no_outages":"Відключень не заплановано","hero.possible_in":"Можливе відключення через","hero.at":"о {time}","hero.since":"з {time}","hero.by_schedule":"{duration} за графіком","hero.updated":"оновлено {ago}","hero.since_schedule":"з {time} за графіком","hero.elapsed":"минуло {duration}","hero.schedule_suspended":"графік не діє","hero.restore_unknown":"включення невідоме","hero.outside_schedule":"поза графіком","hero.no_schedule":"графік не опубліковано","row.grid":"Мережа","row.battery":"АКБ","battery.forecast_at":"{soc} % о {time} → вистачить до {until}","battery.forecast_now":"{soc} % → вистачить до {until}","battery.forecast_short":"{soc} % → {until}","battery.forecast_full":"{soc} % о {time} → вистачить на все відключення","stat.today":"Сьогодні","stat.longest":"Найдовше","stat.tomorrow":"Завтра","stat.emergency":"Аварійні","stat.load":"Навантаження","stat.battery_reserve":"Запас АКБ","stat.battery_at_start":"АКБ на {time}","stat.until_morning":"До ранку при","stat.actual_today":"Без мережі сьогодні","stat.availability":"Доступність","stat.region":"Область","stat.next_outage":"Наступне","stat.power_back":"Увімкнення","stat.source":"Джерело","stat.without_grid":"Без мережі","stat.outages":"Відключень","stat.without_power_today":"Без світла сьогодні","stat.without_power_tomorrow":"Без світла завтра","stat.charged":"Заряджено","stat.discharged":"Віддано","stat.cycles":"Цикли за добу","stat.min_soc":"Мін. SOC","stat.voltage_min":"Мінімум","stat.voltage_max":"Максимум","stat.outage_time":"Відключення","value.yes":"так","value.no":"ні","value.not_yet":"ще немає","value.none":"—","day.today":"Сьогодні","day.tomorrow":"Завтра","schedule.not_published":"ще не опубліковано","schedule.no_outages":"без відключень","schedule.queue":"черга {group}","schedule.emergency_none":"аварійних немає","schedule.emergency_active":"аварійні відключення","schedule.source_updated":"{source} · оновлено {ago}","schedule.in":"через {duration}","schedule.battery_at":"АКБ на {time} ≈ {soc} %","schedule.now":"зараз","schedule.passed":"минуло","legend.on":"світло є","legend.off":"відключення","legend.possible":"можливо","legend.unknown":"графіка ще немає","legend.grid_on":"мережа є","legend.by_schedule":"за графіком","legend.skipped":"за графіком, не вимикали","legend.emergency":"аварійні","legend.fact":"факт","legend.forecast":"прогноз","legend.outage_window":"відключення {window}","legend.voltage_input":"вхід, мін–макс","legend.voltage_out":"поза {min}–{max} В","legend.voltage_output":"після стабілізаторів","hover.schedule":"Графік","hover.no_power":"світла немає","week.grid_on":"Мережа є","week.grid_off":"Мережі немає","week.next_by_schedule":"Наступне за графіком","week.next_meta":"за {duration} · черга {group}","week.battery_forecast":"Прогноз АКБ на {time}","week.battery_lasts":"вистачить ≈ {duration}","week.no_next":"нічого не заплановано","records.since":"з {date}","records.longest_outage":"Найдовше відключення","records.longest_power_streak":"Найдовше без відключень","records.current_power_streak":"Без відключень зараз","records.worst_day":"Найгірший день","records.outage_count":"Відключень","records.statistic":"Рекорд","records.streak":"Поспіль","records.no_data":"ще немає даних","error.no_entity":"Оберіть сутність черги Blackout","battery_card.charging":"Заряд · {soc} %","battery_card.discharging":"Розряд · {soc} %","battery_card.idle":"Очікування · {soc} %","battery_card.full_at":"повна ≈ {time}","battery_card.reserve":"мін. {value} %","battery_card.off":"відкл.","battery_card.configure":"Вкажіть рівень заряду АКБ у редакторі картки","voltage.in_norm":"у нормі","voltage.now":"зараз","voltage.no_outages":"без відключень","voltage.configure":"Додайте сенсори напруги фаз у редакторі картки","error.not_found":"Сутність не належить черзі Blackout","error.loading":"Завантаження…","error.failed":"Дані недоступні","unit.d":"д","unit.h":"г","unit.min":"хв","unit.hours":"год","unit.kw":"кВт","unit.w":"Вт","unit.percent":"%","voltage.outages_one":"{count} відключення","voltage.outages_few":"{count} відключення","voltage.outages_many":"{count} відключень","voltage.outages_other":"{count} відключення","unit.kwh":"кВт·год","unit.v":"В","unit.days_one":"{count} день","unit.days_few":"{count} дні","unit.days_many":"{count} днів","unit.days_other":"{count} дня","relative.just_now":"щойно","relative.ago":"{duration} тому","editor.entity":"Сутність черги","editor.title":"Заголовок","editor.show_header":"Показувати заголовок","editor.language":"Мова","editor.time_zone":"Часовий пояс","editor.tap_action":"Дія при натисканні на заголовок","editor.labels":"Власні тексти","editor.colors":"Кольори","editor.show_badge":"Показувати статус","editor.show_timeline":"Показувати шкалу","editor.show_stats":"Показувати статистику","editor.timeline_hours":"Довжина шкали (годин)","editor.timeline_offset":"Годин до поточного часу","editor.stats":"Статистика","editor.days":"Дні","editor.show_source":"Показувати джерело","editor.show_now":"Показувати поточний час","editor.show_legend":"Показувати легенду","editor.show_windows":"Показувати вікна відключень","editor.show_totals":"Показувати підсумки","editor.show_schedule":"Показувати графік","editor.show_next":"Показувати наступне відключення","editor.since":"Підзаголовок","editor.columns":"Колонки","editor.items":"Рекорди","editor.battery":"АКБ","editor.advanced":"Додатково","editor.battery_hint.status":"Прогноз заряду на таймлайні та показники АКБ.","editor.battery_hint.schedule":"Очікуваний заряд АКБ на початок кожного наступного відключення.","editor.battery_hint.week":"Очікуваний заряд АКБ і час роботи на наступне відключення.","editor.soc":"Рівень заряду","editor.power":"Потужність АКБ","editor.load":"Потужність навантаження","editor.capacity":"Ємність (кВт·год)","editor.reserve":"Резерв (%)","editor.power_positive":"Додатна потужність АКБ означає","editor.morning_hour":"Година ранку","editor.battery_hint.battery":"Рівень заряду малює добу; ємність додає енергію, цикли і прогноз; потужність АКБ і навантаження уточнюють прогноз.","editor.phases":"Фази","editor.phases_hint":"Сенсори напруги з довгостроковою статистикою. Після стабілізаторів — необов'язково.","editor.phase_input":"{phase} · вхід","editor.phase_output":"{phase} · після стабілізаторів","editor.voltage_min":"Нижня межа норми (В)","editor.voltage_max":"Верхня межа норми (В)","editor.option.auto":"Мова Home Assistant","editor.option.discharge":"Розряд","editor.option.charge":"Заряд","editor.option.more-info":"Деталі","editor.option.none":"Нічого","editor.option.today":"Сьогодні","editor.option.tomorrow":"Завтра","editor.sensors_one":"{count} сенсор","editor.sensors_few":"{count} сенсори","editor.sensors_many":"{count} сенсорів","editor.sensors_other":"{count} сенсора","editor.helper.capacity":"Обов'язково разом зі станом заряду","editor.helper.entity":"Будь-яка сутність черги Blackout, наприклад сенсор стану світла","editor.helper.labels":'Ключі вбудованих текстів зі своїм текстом, наприклад "hero.outage_in": "Вимкнуть через"',"editor.helper.colors":"on, off, possible, emergency, battery, unknown","editor.helper.stats":"Список показників або списки для станів: power_on, outage, emergency","editor.helper.items":"longest_outage, longest_power_streak, current_power_streak, worst_day, outage_count, statistic, streak"}},oe={en:"en-GB",uk:"uk-UA"},ae=Object.keys(se);function ne(t,e){return e?t.replace(/\{(\w+)\}/g,(t,s)=>s in e?String(e[s]):t):t}function re(t,e={}){const s=function(t){const e=(t??"en").toLowerCase().split(/[-_]/)[0]??"en";return e in se?e:"en"}(t),o=se[s]??ee,a=new Intl.PluralRules(s),n=t=>e[t]??o[t]??ee[t];return{language:s,locale:oe[s]??s,t:(t,e)=>ne(n(t)??t,e),plural:(t,e)=>ne(n(`${t}_${a.select(e)}`)??n(`${t}_other`)??t,{count:e})}}const ie=i`
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
    --bo-hatch-skipped: repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--bo-off) 65%, transparent) 0 2px,
      transparent 2px 6px
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
`,le=i`
  ha-card {
    position: relative;
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

  .stat-note {
    overflow: hidden;
    color: var(--bo-muted);
    font-family: var(--bo-mono);
    font-size: 11px;
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

  .swatch.skipped,
  .fill-skipped {
    background: var(--bo-hatch-skipped), var(--bo-track-strong);
  }

  .swatch.hatch-muted,
  .fill-hatch-muted {
    background: var(--bo-hatch-muted);
  }

  .hover-band {
    position: absolute;
    z-index: 1;
    border-radius: 3px;
    box-shadow: 0 0 0 1.5px var(--bo-text);
    pointer-events: none;
  }

  .hover-tip {
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px 10px;
    border: 1px solid var(--bo-divider);
    border-radius: 8px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1e));
    box-shadow: 0 6px 18px rgb(0 0 0 / 30%);
    color: var(--bo-muted);
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - 8px));
  }

  .hover-tip.start {
    transform: translate(-16px, calc(-100% - 8px));
  }

  .hover-tip.end {
    transform: translate(calc(-100% + 16px), calc(-100% - 8px));
  }

  .hover-title {
    color: var(--bo-text);
    font-family: var(--bo-mono);
    font-weight: 600;
  }

  .hover-line {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .hover-line .swatch {
    flex: none;
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
`,ce=i`
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
    pointer-events: none;
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
`,de={power_on:"on",scheduled_outage:"off",possible_outage:"possible",emergency:"emergency",unscheduled_outage:"off",unknown:"muted"};function ue(t){return[{value:t,unit:""}]}function he(t){return K`${t.map(t=>K`<span class="mono">${t.value}</span>${t.unit?K`<span class="unit">${t.unit}</span>`:V} `)}`}function pe(t,e,s=!1,o){return K`<span class="badge tone-${e} ${s?"solid":""}"
    >${o?K`<ha-icon .icon=${o}></ha-icon>`:V}${t}</span
  >`}function me(t){return 0===t.length?V:K`<div class="stats" style="--stat-columns: ${Math.min(t.length,4)}">
    ${t.map(t=>K`<div class="stat">
          <span class="stat-label">${t.label}</span>
          <span class="stat-value ${t.tone?`tone-${t.tone}`:""}"
            >${he(t.parts)}</span
          >${t.note?K`<span class="stat-note">${t.note}</span>`:V}
        </div>`)}
  </div>`}function ge(t,e,s=1){return null==e?ue(t.translator.t("value.none")):[{value:t.number(e,s),unit:t.translator.t("unit.hours")}]}function fe(t,e){return null==e?ue(t.translator.t("value.none")):t.durationParts(e*Tt)}function ye(t,e,s){const o=new Date(e),a=new Date(s),n=t.dayKey(a)!==t.dayKey(o)&&"00:00"===t.time(a)?"24:00":t.time(a);return`${t.time(o)}–${n}`}function be(t,e,s,o,a){return K`<div
    class="bar ${a?"hoverable":""}"
    @pointermove=${a?.move}
    @pointerdown=${a?.move}
    @pointerleave=${a?.leave}
  >
    ${t.map(t=>{const o=qt(t.from,e,s),a=qt(t.to,e,s)-o;return a>0?K`<span class="seg ${t.className}" style="left:${o}%;width:${a}%"></span>`:V})}
    ${o??V}
  </div>`}function we(t,e){const s=t.start>=e?"future":"";return`fill-${t.state} ${"off"===t.state||"possible"===t.state?s:""}`}function ve(t,e){const s=t.f.dayKey(new Date(t.now+24*e*Tt));return t.payload.days.find(t=>t.date===s)}function _e(t,e,s){const{payload:o,now:a,t:n,f:r}=t;if(!o.queue.grid_entity||e>=a)return null;const i=o.days.flatMap(t=>t.actual).map(t=>({start:Date.parse(t.start),end:t.end?Date.parse(t.end):a})).find(t=>t.start<s&&t.end>e);return i?{swatch:"off",text:`${n("row.grid")}: ${n("hover.no_power")} · ${ye(r,i.start,i.end)}`}:{swatch:"on",text:`${n("row.grid")}: ${n("legend.on")}`}}function xe(t,e){return"emergency"===t.payload.status&&e>t.now?{swatch:"hatch",text:t.t("status.emergency")}:null}function $e(t,e,s){const o=e+Pt,a=!1!==s.grid,n=[a?_e(t,e,o):null,s.emergency?xe(t,o):null].filter(t=>null!==t);if(!1===s.schedule)return{title:s.title,lines:n};const r=function(t,e,s,o){const{payload:a,t:n,f:r}=t,i=zt(a.days).find(t=>t.start<=e&&e<t.end),l=i?.state??"unknown";if("unknown"===l&&o)return null;const c=i&&"unknown"!==l?` · ${ye(r,i.start,i.end)}`:"",d=n(`legend.${l}`);return{swatch:l,text:s?`${n("hover.schedule")}: ${d}${c}`:`${u=d,`${u.charAt(0).toUpperCase()}${u.slice(1)}`}${c}`};var u}(t,e,n.length>0||a&&Boolean(t.payload.queue.grid_entity),n.length>0);if(!r)return{title:s.title,lines:n};const i="off"===r.swatch&&n.some(t=>"on"===t.swatch);return{title:s.title,lines:[...n,i?{...r,swatch:"skipped"}:r]}}const ke={on:"--blackout-on-color",off:"--blackout-off-color",possible:"--blackout-possible-color",emergency:"--blackout-emergency-color",battery:"--blackout-battery-color",unknown:"--blackout-unknown-color"};let Se=(()=>{let s,o,a,n=dt,r=[],i=[],l=[],c=[],d=[],u=[];return class extends n{static{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;s=[mt({attribute:!1})],o=[gt()],a=[gt()],t(this,null,s,{kind:"accessor",name:"hass",static:!1,private:!1,access:{has:t=>"hass"in t,get:t=>t.hass,set:(t,e)=>{t.hass=e}},metadata:e},r,i),t(this,null,o,{kind:"accessor",name:"config",static:!1,private:!1,access:{has:t=>"config"in t,get:t=>t.config,set:(t,e)=>{t.config=e}},metadata:e},l,c),t(this,null,a,{kind:"accessor",name:"hover",static:!1,private:!1,access:{has:t=>"hover"in t,get:t=>t.hover,set:(t,e)=>{t.hover=e}},metadata:e},d,u),e&&Object.defineProperty(this,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})}static styles=[ie,le];#t=e(this,r,void 0);get hass(){return this.#t}set hass(t){this.#t=t}#e=(e(this,i),e(this,l,void 0));get config(){return this.#e}set config(t){this.#e=t}#s=(e(this,c),e(this,d,null));get hover(){return this.#s}set hover(t){this.#s=t}queue=(e(this,u),new te(this));translator=re("en");formatter=Xt(this.translator);localeKey="";hoverTimer;historyDays(){return 1}extraEntities(){return[]}requiresEntity(){return!0}setConfig(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration");this.config=t}getCardSize(){return this.cardSize}getGridOptions(){return{columns:12,rows:"auto",min_columns:6}}shouldUpdate(t){if(1!==t.size||!t.has("hass"))return!0;const e=t.get("hass");if(!e||!this.hass||!this.config)return!0;return[this.config.entity,...this.extraEntities()].filter(t=>"string"==typeof t).some(t=>e.states[t]!==this.hass?.states[t])}willUpdate(){if(!this.hass||!this.config)return;const t=this.config.language??this.hass.locale?.language??this.hass.language,e=this.config.time_zone??Zt,s=`${t}|${e}|${JSON.stringify(this.config.labels??{})}`;s!==this.localeKey&&(this.localeKey=s,this.translator=re(t,this.config.labels??{}),this.formatter=Xt(this.translator,e)),(this.requiresEntity()||this.config.entity)&&this.queue.sync(this.hass,this.config.entity,this.historyDays())}t(t,e){return this.translator.t(t,e)}render(){if(!this.hass||!this.config)return V;const t=vt(this.colorStyles(this.config)),e=this.renderState();if(e)return K`<ha-card style=${t}>${e}</ha-card>`;const s=this.queue.payload;if(!s)return this.renderWithoutQueue(t);const o={payload:s,now:this.queue.now,t:(t,e)=>this.translator.t(t,e),f:this.formatter};return K`<ha-card style=${t}
      >${this.renderHeader(o)}${this.renderContent(o)}${this.renderHover()}</ha-card
    >`}renderHover(){const t=this.hover;if(!t)return V;const{band:e,align:s,content:o}=t;return K`<span
        class="hover-band"
        style=${vt({left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`})}
      ></span>
      <div
        class="hover-tip ${s}"
        style=${vt({left:`${e.left+e.width/2}px`,top:`${e.top}px`})}
      >
        <div class="hover-title">${o.title}</div>
        ${o.lines.map(t=>K`<div class="hover-line">
              <span class="swatch ${t.swatch}"></span><span>${t.text}</span>
            </div>`)}
      </div>`}showHover(t,e){const s=this.renderRoot.querySelector("ha-card")?.getBoundingClientRect();if(!s||t.width<=0)return;const o={left:t.left-s.left,top:t.top-s.top,width:t.width,height:t.height},a=(o.left+o.width/2)/s.width,n=this.hover;window.clearTimeout(this.hoverTimer),n?.band.left===o.left&&n.band.top===o.top&&n.content.title===e.title||(this.hover={band:o,align:a<.25?"start":a>.75?"end":"center",content:e})}hideHover=t=>{window.clearTimeout(this.hoverTimer),"touch"!==t.pointerType?this.hover=null:this.hoverTimer=window.setTimeout(()=>{this.hover=null},2500)};barHover(t,e,s){return{move:o=>{const a=o.currentTarget.getBoundingClientRect();if(a.width<=0)return;const n=Math.min(Math.max((o.clientX-a.left)/a.width,0),.9999),r=Math.max(t,(i=t+n*(e-t),Math.floor(i/Pt)*Pt));var i;const l=Math.min(e,r+Pt),c=a.left+qt(r,t,e)/100*a.width,d=a.left+qt(l,t,e)/100*a.width;this.showHover(new DOMRect(c,a.top,d-c,a.height),s(r))},leave:this.hideHover}}renderWithoutQueue(t){return K`<ha-card style=${t}
      ><div class="message">${this.t("error.loading")}</div></ha-card
    >`}renderState(){if(!this.requiresEntity()&&!this.config?.entity)return;const t=this.queue.error;return!t||"failed"===t&&this.queue.payload?void 0:K`<div class="message error">${this.t(`error.${t}`)}</div>`}renderHeader(t){if(!1===this.config?.show_header)return V;const e=this.config?.title??this.defaultTitle(t),s="none"!==this.config?.tap_action&&Boolean(this.config?.entity);return K`<div
      class="header ${s?"clickable":""}"
      @click=${s?this.openMoreInfo:void 0}
    >
      <div class="title">${e}</div>
      <div class="header-side">${this.headerSide(t)}</div>
    </div>`}queueTitle(t){return`${t.t("title.power")} · ${t.t("title.queue",{group:t.payload.queue.group})}`}colorStyles(t){const e={};for(const[s,o]of Object.entries(t.colors??{})){const t=ke[s];t&&"string"==typeof o&&(e[t]=o)}return e}openMoreInfo=()=>{const t=this.config?.entity;t&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}}})();function Ae(t){return Object.values(t.states).find(t=>t.entity_id.startsWith("sensor.")&&"string"==typeof t.attributes.group&&"today_status"in t.attributes)?.entity_id}const Ee=112,Ce=[0,6,12,18,24],Me=new Set(["scheduled_outage","emergency","unscheduled_outage"]),De=t=>8+(100-t)/100*104;function Pe(t){const e=[...t].sort((t,e)=>t.start-e.start),s=[];for(const t of e){const e=s.at(-1);e&&t.start<=e.end?s[s.length-1]={...e,end:Math.max(e.end,t.end)}:s.push(t)}return s}let Te=(()=>{let s,o=Se,a=[],n=[];return class extends o{static{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(o[Symbol.metadata]??null):void 0;s=[gt()],t(this,null,s,{kind:"accessor",name:"samples",static:!1,private:!1,access:{has:t=>"samples"in t,get:t=>t.samples,set:(t,e)=>{t.samples=e}},metadata:e},a,n),e&&Object.defineProperty(this,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})}static styles=[...Se.styles,i`
      .chart {
        position: relative;
        height: ${Ee}px;
      }

      .chart svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .band {
        position: absolute;
        top: 0;
        bottom: 0;
        background: var(--bo-hatch);
        opacity: 0.55;
      }

      .grid-line {
        position: absolute;
        right: 0;
        left: 0;
        border-top: 1px dashed var(--bo-divider);
      }

      .grid-line.reserve {
        border-top-color: color-mix(in srgb, var(--bo-off) 55%, transparent);
      }

      .grid-label {
        position: absolute;
        right: 0;
        color: var(--bo-muted);
        font-family: var(--bo-mono);
        font-size: 9px;
        line-height: 12px;
        white-space: nowrap;
      }

      .grid-label.reserve,
      .band-label {
        color: var(--bo-off);
      }

      .band-label {
        position: absolute;
        top: 2px;
        margin-left: 4px;
        font-size: 9px;
        font-weight: 600;
        white-space: nowrap;
      }

      .now-line {
        position: absolute;
        top: 0;
        bottom: 0;
        border-left: 1px solid color-mix(in srgb, var(--bo-text) 35%, transparent);
      }

      .dot {
        position: absolute;
        width: 9px;
        height: 9px;
        margin: -4.5px 0 0 -4.5px;
        box-sizing: border-box;
        border: 2px solid var(--ha-card-background, var(--card-background-color, #fff));
        border-radius: 50%;
        background: var(--bo-battery);
      }

      .dot.hollow {
        width: 7px;
        height: 7px;
        margin: -3.5px 0 0 -3.5px;
        border-color: var(--bo-battery);
        background: var(--ha-card-background, var(--card-background-color, #fff));
      }

      .point-label {
        position: absolute;
        color: var(--bo-muted);
        font-family: var(--bo-mono);
        font-size: 10px;
        line-height: 12px;
        white-space: nowrap;
      }

      .point-label.current {
        color: var(--bo-text);
        font-size: 11px;
        font-weight: 600;
      }

      .axis-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        color: var(--bo-muted);
        font-family: var(--bo-mono);
        font-size: 10px;
      }

      .legend {
        margin-top: 12px;
      }

      .swatch.line {
        width: 14px;
        height: 2px;
        border-radius: 1px;
        background: var(--bo-battery);
      }

      .swatch.dashed {
        width: 14px;
        height: 0;
        border-top: 2px dashed color-mix(in srgb, var(--bo-battery) 60%, transparent);
        background: none;
      }

      .stats {
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid var(--bo-divider);
      }

      .message {
        padding: 8px 0;
      }
    `];cardSize=5;#o=e(this,a,[]);get samples(){return this.#o}set samples(t){this.#o=t}loadedKey=(e(this,n),"");loadedAt=0;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){const e=function(t){const e=Object.values(t.states).filter(t=>t.entity_id.startsWith("sensor.")&&"battery"===t.attributes.device_class);return(e.find(t=>t.entity_id.includes("soc"))??e.at(0))?.entity_id}(t);return{type:`custom:${St}`,entity:Ae(t),...e?{battery:{soc:e}}:{}}}requiresEntity(){return!1}extraEntities(){return Rt(this.config?.battery)}defaultTitle(t){return t.t("title.battery")}headerSide(t){return this.badge(t)}updated(){this.loadHistory()}renderContent(t){return this.renderBody(t)}renderWithoutQueue(t){const e={now:Date.now(),t:(t,e)=>this.translator.t(t,e),f:this.formatter,payload:void 0};return K`<ha-card style=${t}>
      ${!1===this.config?.show_header?V:K`<div class="header">
              <div class="title">${this.config?.title??e.t("title.battery")}</div>
              <div class="header-side">${this.badge(e)}</div>
            </div>`}
      ${this.renderBody(e)}
    </ha-card>`}day(t){const e=t.f.dayKey(t.now),s=t.payload?.days.find(t=>t.date===e),o=s?Date.parse(s.start):Jt(t.now,t.f.timeZone);return{start:o,end:o+864e5}}currentSoc(){const t=this.config?.battery?.soc,e=t?Number.parseFloat(this.hass?.states[t]?.state??""):Number.NaN;return Number.isFinite(e)?e:null}badge(t){const e=this.currentSoc();if(null===e)return V;const s=this.batteryPower(),o=t.f.number(e,0);if(null===s)return K`<span class="badge plain">${o} %</span>`;const[a,n]=Math.abs(s)<30?["battery_card.idle","muted"]:s<0?["battery_card.charging","on"]:["battery_card.discharging","possible"];return pe(t.t(a,{soc:o}),n)}batteryPower(){const t=this.config?.battery,e=t?.power?this.hass?.states[t.power]:void 0,s=e?Number.parseFloat(e.state):Number.NaN;if(!e||!Number.isFinite(s))return null;const o="kw"===e.attributes.unit_of_measurement?.toLowerCase()?1e3*s:s;return"charge"===t?.power_positive?-o:o}outages(t,e){const s=t.payload,o=s?.days.find(e=>e.date===t.f.dayKey(t.now));if(!s||!o)return{shown:[],ahead:[]};const a="waiting"===o.status?[]:Nt(o),n=s.grid?o.actual.map(e=>({start:Date.parse(e.start),end:e.end?Date.parse(e.end):t.now,possible:!1})):a.filter(e=>e.start<t.now),r=a.filter(e=>e.end>t.now).map(e=>({...e,start:Math.max(e.start,t.now)})),i=Me.has(s.status)&&!r.some(e=>e.start<=t.now)?[{start:t.now,end:s.next_power_on?Date.parse(s.next_power_on):e.end,possible:!1}]:[];return{shown:Pe([...n,...i,...r]),ahead:Pe([...i,...r])}}renderBody(t){const e=this.config,s=this.hass;if(!e?.battery?.soc||!s)return K`<div class="message">${t.t("battery_card.configure")}</div>`;const o=this.day(t),a=this.currentSoc(),n=null===a?this.samples:[...this.samples,{time:t.now,value:a}],r=Bt(s,e.battery),{shown:i,ahead:l}=this.outages(t,o),c=r?Ft(r,t.now,o.end,l):null;return K`${this.renderChart(t,o,n,r,i,c)}
      <div class="axis-labels">
        ${Ce.map(t=>K`<span>${String(t).padStart(2,"0")}</span>`)}
      </div>
      ${this.renderLegend(t,i,c)} ${me(this.stats(t,n,r))}`}renderChart(t,e,s,o,a,n){const{t:r,f:i}=t,l=t=>qt(t,e.start,e.end),c=s.filter(t=>t.time>=e.start),d=c.map(t=>`${10*l(t.time)},${De(t.value)}`).join(" L"),u=c.at(-1),h=Kt(c,null).min,p=o?.reserve??this.config?.battery?.reserve,m=n?.points.map(t=>`${10*l(t.time)},${De(t.soc)}`),g=a.find(e=>e.end>t.now);return K`<div class="chart">
      ${a.map(t=>K`<span
            class="band"
            style=${vt({left:`${l(t.start)}%`,width:l(t.end)-l(t.start)+"%"})}
          ></span>`)}
      ${g?K`<span class="band-label" style=${vt({left:`${l(g.start)}%`})}
              >${r("battery_card.off")}</span
            >`:V}
      <span class="grid-line" style="top:${De(100)}px"></span>
      <span class="grid-line" style="top:${De(50)}px"></span>
      ${void 0===p?V:K`<span class="grid-line reserve" style="top:${De(p)}px"></span
              ><span class="grid-label reserve" style="top:${De(p)-14}px"
                >${r("battery_card.reserve",{value:i.number(p,0)})}</span
              >`}
      <span class="grid-label" style="top:${De(100)+2}px">100 %</span>
      <span class="grid-label" style="top:${De(50)-14}px">50 %</span>
      <svg viewBox="0 0 1000 ${Ee}" preserveAspectRatio="none" aria-hidden="true">
        ${d&&u?F`<path d="M${d} L${10*l(u.time)},${Ee} L${10*l(c[0]?.time??e.start)},${Ee} Z"
                fill="var(--bo-battery)" fill-opacity="0.12"></path>
              <path d="M${d}" fill="none" stroke="var(--bo-battery)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>`:V}
        ${m&&m.length>1?F`<path d="M${m.join(" L")}" fill="none" stroke="var(--bo-battery)"
              stroke-opacity="0.6" stroke-width="2" stroke-dasharray="4 4" stroke-linejoin="round"
              vector-effect="non-scaling-stroke"></path>`:V}
      </svg>
      <span class="now-line" style="left:${l(t.now)}%"></span>
      ${h&&u&&h.time<u.time?K`<span class="dot hollow" style="left:${l(h.time)}%;top:${De(h.value)}px"></span>
              ${this.pointLabel(l(h.time),De(h.value)+6,`${i.number(h.value,0)} % · ${i.time(h.time)}`)}`:V}
      ${u?K`<span class="dot" style="left:${l(u.time)}%;top:${De(u.value)}px"></span>
              ${this.pointLabel(l(u.time),De(u.value)-18,`${i.number(u.value,0)} %`,l(u.time)>12,!0)}`:V}
      ${n?.full?this.pointLabel(l(n.full),De(100)+6,r("battery_card.full_at",{time:i.time(n.full)})):V}
    </div>`}pointLabel(t,e,s,o=!1,a=!1){return K`<span
      class="point-label ${a?"current":""}"
      style=${vt({...o||t>70?{right:100-t+1.5+"%"}:{left:`${t+1.5}%`},top:`${Math.max(0,Math.min(100,e))}px`})}
      >${s}</span
    >`}renderLegend(t,e,s){const{t:o,f:a}=t,n=1===e.length?e[0]:void 0;return K`<div class="legend">
      <span class="legend-item"><span class="swatch line"></span>${o("legend.fact")}</span>
      ${s?K`<span class="legend-item"
              ><span class="swatch dashed"></span>${o("legend.forecast")}</span
            >`:V}
      ${e.length>0?K`<span class="legend-item"
              ><span class="swatch hatch"></span>${n?o("legend.outage_window",{window:ye(a,n.start,n.end)}):o("legend.off")}</span
            >`:V}
    </div>`}stats(t,e,s){const{t:o,f:a}=t,n=Kt(e,s?.capacityKwh??null),r=t=>null===t?ue(o("value.none")):[{value:a.number(t,1),unit:o("unit.kwh")}];return[{label:o("stat.charged"),parts:r(n.charged)},{label:o("stat.discharged"),parts:r(n.discharged)},{label:o("stat.cycles"),parts:ue(null===n.cycles?o("value.none"):a.number(n.cycles,2))},{label:o("stat.min_soc"),parts:n.min?[{value:a.number(n.min.value,0),unit:o("unit.percent")}]:ue(o("value.none"))}]}loadHistory(){const t=this.hass,e=this.config?.battery?.soc;if(!t||!e)return;const s=Date.now(),o=Jt(s,this.formatter.timeZone),a=`${e}|${o}`;a===this.loadedKey&&s-this.loadedAt<3e5||(this.loadedKey=a,this.loadedAt=s,async function(t,e,s,o){return((await t.callWS({type:"history/history_during_period",start_time:new Date(s).toISOString(),end_time:new Date(o).toISOString(),entity_ids:[e],minimal_response:!0,no_attributes:!0,significant_changes_only:!1}))[e]??[]).flatMap(t=>{const e=Number.parseFloat(t.s),o=t.lu??t.lc;return Number.isFinite(e)&&void 0!==o?[{time:Math.max(s,1e3*o),value:e}]:[]})}(t,e,o,s).then(t=>{this.loadedKey===a&&(this.samples=t)}).catch(()=>{this.loadedAt=0}))}}})();function Oe(t){return"number"==typeof t?t:Date.parse(t)}async function ze(t,e,s,o,a){const n=Date.now();return(await t.callWS({type:"recorder/statistics_during_period",start_time:new Date(n-864e5*a).toISOString(),end_time:new Date(n).toISOString(),statistic_ids:[e],period:s,types:[o]}))[e]??[]}function Ne(t,e,s){if(!e)return!0;const o=Number(new Intl.DateTimeFormat("en-GB",{hour:"2-digit",hourCycle:"h23",timeZone:s}).format(t)),[a,n]=e;return a<=n?o>=a&&o<n:o>=a||o<n}const je=[{type:"longest_outage"},{type:"longest_power_streak"},{type:"worst_day"},{type:"outage_count"}],qe={longest_outage:"mdi:transmission-tower-off",longest_power_streak:"mdi:check-circle-outline",current_power_streak:"mdi:timer-outline",worst_day:"mdi:calendar-alert",outage_count:"mdi:counter"},Ue={longest_outage:"var(--bo-off)",longest_power_streak:"var(--bo-on)",current_power_streak:"var(--bo-on)",worst_day:"var(--bo-off)",outage_count:"var(--bo-muted)"};let He=(()=>{let s,o=Se,a=[],n=[];return class extends o{static{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(o[Symbol.metadata]??null):void 0;s=[gt()],t(this,null,s,{kind:"accessor",name:"loaded",static:!1,private:!1,access:{has:t=>"loaded"in t,get:t=>t.loaded,set:(t,e)=>{t.loaded=e}},metadata:e},a,n),e&&Object.defineProperty(this,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})}static styles=[...Se.styles,i`
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
    `];cardSize=5;#a=e(this,a,new Map);get loaded(){return this.#a}set loaded(t){this.#a=t}loadedKey=(e(this,n),"");loadedAt=0;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){return{type:`custom:${kt}`,entity:Ae(t)}}requiresEntity(){return this.items().some(t=>"statistic"!==t.type&&"streak"!==t.type)}defaultTitle(t){return t.t("title.records")}headerSide(){return this.config?.since?K`<span>${this.config.since}</span>`:V}items(){return this.config?.items&&this.config.items.length>0?this.config.items:je}updated(){this.loadStatistics()}renderWithoutQueue(t){if(this.requiresEntity())return super.renderWithoutQueue(t);const e={t:this.translator.t,f:this.formatter,now:Date.now()};return K`<ha-card style=${t}>
      ${!1===this.config?.show_header?V:K`<div class="header">
              <div class="title">${this.config?.title??e.t("title.records")}</div>
              <div class="header-side">${this.headerSide()}</div>
            </div>`}
      ${this.renderTiles(this.items().map((t,s)=>this.tile(t,s,e.f,null)))}
    </ha-card>`}renderContent(t){return this.renderTiles(this.items().map((e,s)=>this.tile(e,s,t.f,t)))}renderTiles(t){const e=this.config?.columns??2;return K`<div class="tiles" style=${vt({"--record-columns":String(e)})}>
      ${t.map(t=>K`<div class="tile">
            <div class="tile-head">
              <ha-icon .icon=${t.icon} style=${vt({color:t.color})}></ha-icon
              ><span>${t.label}</span>
            </div>
            <div class="tile-value">${he(t.parts)}</div>
            <div class="tile-note">${t.note}</div>
          </div>`)}
    </div>`}tile(t,e,s,o){const a=this.translator.t;if("statistic"===t.type)return this.statisticTile(t,this.loaded.get(e),s);if("streak"===t.type){const o=this.loaded.get(e);return{label:t.label??a("records.streak"),icon:t.icon??"mdi:check-circle-outline",color:t.color??"var(--bo-on)",parts:ue(o?this.translator.plural("unit.days",o.days):a("value.none")),note:o?`${s.shortDate(o.start)} – ${s.shortDate(o.end)}`:a("records.no_data")}}return this.outageTile(t,s,o)}outageTile(t,e,s){const o=this.translator.t,a=s?.payload.records??null,n={label:t.label??o(`records.${t.type}`),icon:t.icon??qe[t.type],color:t.color??Ue[t.type]},r={...n,parts:ue(o("value.none")),note:o("records.no_data")};if(!a)return r;if("outage_count"===t.type)return{...n,parts:ue(String(a.count)),note:""};if("worst_day"===t.type)return a.worst_day?{...n,parts:e.durationParts(a.worst_day.hours*Tt),note:e.date(a.worst_day.date)}:r;const i=a[t.type];return i?{...n,parts:e.durationParts(i.hours*Tt),note:e.date(i.start)}:r}statisticTile(t,e,s){const o=this.translator.t,a=this.hass?.states[t.entity],n=t.label??a?.attributes.friendly_name??o("records.statistic"),r=t.icon??"mdi:trophy-outline",i=t.color??"var(--bo-possible)";if(!e)return{label:n,icon:r,color:i,parts:ue(o("value.none")),note:o("records.no_data")};const l=t.unit??a?.attributes.unit_of_measurement??"",c=e.value*(t.scale??1),d=t.date_format??this.dateFormat(t),u="datetime"===d?s.dateTime(e.start):"month"===d?s.month(e.start):s.date(e.start);return{label:n,icon:r,color:i,parts:[{value:s.number(c,t.decimals??1),unit:l}],note:u}}dateFormat(t){const e=t.period??"day";return"month"===e?"month":"hour"===e||"5minute"===e?"datetime":"day"}loadStatistics(){const t=this.hass,e=this.items(),s=JSON.stringify(e);if(!t||s===this.loadedKey&&Date.now()-this.loadedAt<6e5)return;this.loadedKey=s,this.loadedAt=Date.now();const o=this.formatter.timeZone,a=e.map((e,s)=>"statistic"===e.type?async function(t,e,s){const o=e.value??"max",a=await ze(t,e.entity,e.period??"day",o,e.days??365),n="min"===e.stat;let r=null;for(const t of a){const a=t[o],i=Oe(t.start);"number"==typeof a&&Ne(i,e.hours,s)&&(r&&!(n?a<r.value:a>r.value)||(r={value:a,start:i}))}return r}(t,e,o).then(t=>[s,t]):"streak"===e.type?async function(t,e){const s=e.value??"change",o=await ze(t,e.entity,"day",s,e.days??365);let a=null,n=null;for(const t of o){const o=t[s],r=Oe(t.start);"number"==typeof o&&(void 0===e.below||o<e.below)&&(void 0===e.above||o>e.above)?(n=n?{days:n.days+1,start:n.start,end:r}:{days:1,start:r,end:r},(!a||n.days>a.days)&&(a=n)):n=null}return a}(t,e).then(t=>[s,t]):Promise.resolve(void 0));Promise.all(a.map(t=>t.catch(()=>{}))).then(t=>{const e=new Map;for(const s of t)s&&e.set(s[0],s[1]);this.loaded=e})}}})();const Be={today:0,tomorrow:1},Re=[0,6,12,18,24],Le=Array.from({length:24},(t,e)=>e);class Ie extends Se{static styles=[...Se.styles,i`
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
        pointer-events: none;
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
    `];cardSize=5;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){return{type:`custom:${xt}`,entity:Ae(t)}}extraEntities(){return Rt(this.config?.battery)}defaultTitle(t){return t.t("title.schedule")}headerSide(t){return K`<span class="badge plain mono"
      >${t.t("schedule.queue",{group:t.payload.queue.group})}</span
    >`}dayKeys(){const t=this.config?.days;return t&&t.length>0?t:Et}renderContent(t){const e=this.config,s=this.hass?Bt(this.hass,e?.battery):null,o=this.dayKeys().map(e=>({key:e,day:ve(t,Be[e])})),a=new Set(o.flatMap(({day:t})=>jt(t)?[...t.slots]:["unknown"]));return K`${!1===e?.show_source?V:this.renderSource(t)}
      ${o.map(({key:e,day:s})=>this.renderDay(t,e,s))}
      <div class="axis mono">
        ${Re.map(t=>K`<span style="left:${t/24*100}%">${String(t).padStart(2,"0")}</span>`)}
      </div>
      ${!1===e?.show_legend?V:this.renderLegend(t,a)}
      ${!1===e?.show_windows?V:K`<div class="windows">
              ${o.map(({key:e,day:o})=>this.renderWindows(t,e,o,s))}
            </div>`}
      ${!1===e?.show_totals?V:K`<div class="divider"></div>
              ${me(this.totals(t))}`}`}renderSource(t){const{payload:e,now:s,t:o,f:a}=t,n=e.source.name??e.queue.operator,r=e.source.last_success?o("schedule.source_updated",{source:n,ago:a.relative(e.source.last_success,s)}):n;return K`<div class="source">
      <span>${r}</span>
      <span class="indicator tone-${e.emergency?"emergency":"on"}"
        >${o(e.emergency?"schedule.emergency_active":"schedule.emergency_none")}</span
      >
    </div>`}renderDay(t,e,s){const{now:o,t:a,f:n}=t,r=jt(s),i=r?s.slots:[],l="today"===e&&!1!==this.config?.show_now&&s,c=s?qt(o,Date.parse(s.start),Date.parse(s.start)+864e5):0,d=s?this.cellsHover(t,s):void 0;return K`<div class="day">
      <div class="day-name">
        <strong>${a(`day.${e}`)}</strong>
        <span>${s?n.dayDate(s.start):""}</span>
      </div>
      <div
        class="cells"
        @pointermove=${d?.move}
        @pointerdown=${d?.move}
        @pointerleave=${d?.leave}
      >
        ${Le.map(t=>K`<div class="cell">
              <span class="fill-${i[2*t]??"unknown"}" data-slot=${2*t}></span>
              <span
                class="fill-${i[2*t+1]??"unknown"}"
                data-slot=${2*t+1}
              ></span>
            </div>`)}
        ${r?V:K`<span class="overlay">${a("schedule.not_published")}</span>`}
        ${l?K`<span class="now" style="left:${c}%"></span>`:V}
      </div>
    </div>`}cellsHover(t,e){const s=Date.parse(e.start);return{move:e=>{const o=e.target instanceof Element?e.target.closest("[data-slot]"):null;if(!(o instanceof HTMLElement))return;const a=s+Number(o.dataset.slot)*Pt;this.showHover(o.getBoundingClientRect(),$e(t,a,{title:ye(t.f,a,a+Pt),grid:!1}))},leave:this.hideHover}}renderLegend(t,e){return K`<div class="legend">
      ${["on","off","possible","unknown"].filter(t=>"on"===t||"off"===t||e.has(t)).map(e=>K`<span class="legend-item"
              ><span class="swatch ${e}"></span>${t.t(`legend.${e}`)}</span
            >`)}
    </div>`}renderWindows(t,e,s,o){const{now:a,t:n,f:r}=t,i=n(`day.${e}`);if(!jt(s))return K`<div class="window">
        <span class="marker empty"></span>
        <div class="window-main">
          <span class="window-title">${i}</span>
          <span class="window-note">${n("schedule.not_published")}</span>
        </div>
        <span class="window-total muted">${n("value.none")}</span>
      </div>`;const l=Nt(s).filter(t=>!t.possible),c=l.filter(t=>t.end>a),d=c.length>0?c:l;if(0===l.length)return K`<div class="window">
        <span class="marker fill-on"></span>
        <div class="window-main">
          <span class="window-title">${i}</span>
          <span class="window-note">${n("schedule.no_outages")}</span>
        </div>
        <span class="window-total">${r.number(0)} ${n("unit.hours")}</span>
      </div>`;const u=d.find(t=>t.end>a),h=[];return u&&u.start>a?(h.push(n("schedule.in",{duration:r.duration(u.start-a)})),o&&h.push(n("schedule.battery_at",{time:r.time(u.start),soc:r.number(It(o,u.start,a,this.changeUntil(t,u.start)),0)}))):u?h.push(n("schedule.now")):h.push(n("schedule.passed")),K`<div class="window">
      <span class="marker fill-off"></span>
      <div class="window-main">
        <span class="window-title"
          >${i} ·
          <span class="mono"
            >${d.map(t=>ye(r,t.start,t.end)).join(", ")}</span
          ></span
        >
        <span class="window-note">${h.join(" · ")}</span>
      </div>
      <span class="window-total">${r.number(s.outage_hours??0,0)} ${n("unit.hours")}</span>
    </div>`}changeUntil(t,e){const{status:s,next_power_on:o}=t.payload;return("scheduled_outage"===s||"unscheduled_outage"===s||"emergency"===s)&&o?Date.parse(o):e}totals(t){const{t:e,f:s}=t,o=ve(t,0),a=ve(t,1);return[{label:e("stat.without_power_today"),parts:ge(s,jt(o)?o.outage_hours:null)},{label:e("stat.longest"),parts:ge(s,jt(o)?o.longest_hours:null)},{label:e("stat.without_power_tomorrow"),parts:jt(a)?ge(s,a.outage_hours):ue(e("value.none"))}]}}const We={power_on:["today","longest","tomorrow","emergency"],outage:["today","longest","tomorrow","emergency"],emergency:["today","tomorrow","region","emergency"]},Ke={power_on:["today","longest","tomorrow","emergency"],outage:["load","battery_reserve","today","emergency"],emergency:["load","battery_reserve","until_morning","emergency"]};class Fe extends Se{static styles=[...Se.styles,ce,i`
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
    `];cardSize=4;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){return{type:`custom:${_t}`,entity:Ae(t)}}historyDays(){return this.statKeys("power_on").includes("availability")?7:1}extraEntities(){return Rt(this.config?.battery)}defaultTitle(t){return this.queueTitle(t)}headerSide(t){if(!1===this.config?.show_badge)return V;const e=t.payload.status,s="emergency"===e;return pe(t.t(`status.${e}`),de[e],s,s?"mdi:alert-outline":void 0)}renderContent(t){const e=this.config??{},s=this.hass?Bt(this.hass,e.battery):null,o=this.hero(t),a=this.group(t),n=!1===e.show_stats?[]:this.stats(t,a,s);return K`<div class="hero">
        <div>
          <div class="hero-label">${o.label}</div>
          <div class="hero-value tone-${o.tone}">
            ${o.parts.map(t=>K`${t.value}${t.unit?K`<span class="unit">${t.unit}</span>`:V}`)}
          </div>
        </div>
        <div class="hero-side">
          ${o.side?K`<span class="hero-window">${o.side}</span>`:V}
          ${o.note?K`<span class="hero-note">${o.note}</span>`:V}
        </div>
      </div>
      ${!1===e.show_timeline?V:this.renderTimeline(t,s)}
      ${n.length>0?K`<div class="divider"></div>
              ${me(n)}`:V}`}group(t){const e=t.payload.status;return"emergency"===e?"emergency":"scheduled_outage"===e||"unscheduled_outage"===e?"outage":"power_on"}outageSince(t){const{grid:e,region_status:s,current:o}=t.payload;return!1===e?.present&&e.since?Date.parse(e.since):o?Date.parse(o.start):s?.since?Date.parse(s.since):null}hero(t){const{payload:e,now:s,t:o,f:a}=t,n=e.source.last_success?o("hero.updated",{ago:a.relative(e.source.last_success,s)}):"";if("scheduled_outage"===e.status&&e.next_power_on){const t=Date.parse(e.next_power_on),n=e.current?Date.parse(e.current.start):s;return{label:o("hero.power_back_in"),parts:a.durationParts(t-s),tone:"on",side:o("hero.at",{time:a.time(t)}),note:[o("hero.since_schedule",{time:a.time(n)}),o("hero.elapsed",{duration:a.duration(s-n)})].join(" · ")}}if("emergency"===e.status||"unscheduled_outage"===e.status){const n=this.outageSince(t),r="emergency"===e.status?[o("hero.schedule_suspended"),o("hero.restore_unknown")].join(" · "):o("hero.outside_schedule");return{label:o("hero.no_power_for"),parts:null===n?ue(o("value.none")):a.durationParts(s-n),tone:"emergency"===e.status?"emergency":"off",side:null===n?"":o("hero.since",{time:a.time(n)}),note:r}}const r=e.next??e.next_possible;if(!r)return{label:o("hero.no_outages"),parts:ue(o("value.none")),tone:"muted",side:"",note:e.queue.has_schedule?n:o("hero.no_schedule")};const i=Date.parse(r.start),l=Date.parse(r.end);return{label:o(r.possible?"hero.possible_in":"hero.outage_in"),parts:a.durationParts(i-s),tone:r.possible?"possible":"off",side:ye(a,i,l),note:[o("hero.by_schedule",{duration:a.duration(l-i)}),n].filter(Boolean).join(" · ")}}forecast(t,e){const{payload:s,now:o,t:a,f:n}=t,r="power_on"!==s.status&&"possible_outage"!==s.status&&"unknown"!==s.status,i=s.next_power_on&&"emergency"!==s.status?Date.parse(s.next_power_on):null,l=r?o:s.next?Date.parse(s.next.start):o,c=r?i:s.next?Date.parse(s.next.end):null,d=It(e,l,o),u=Wt(e,d),h=null===u?null:l+u,p=null===h||null!==c&&h>=c,m=n.number(d,0);if(null===h)return{from:l,until:h,soc:d,enough:p,label:a("battery.forecast_full",{soc:m,time:n.time(l)}),short:`${m} %`};return{from:l,until:h,soc:d,enough:p,label:r?a("battery.forecast_now",{soc:m,until:n.time(h)}):a("battery.forecast_at",{soc:m,time:n.time(l),until:n.time(h)}),short:a("battery.forecast_short",{soc:m,until:n.time(h)})}}forecastText(t,e,s){const o=e>35?t.short:t.label;return K`<span class="bar-text" style="left:${e}%">${o}</span>${s}`}renderTimeline(t,e){const{payload:s,now:o,t:a,f:n}=t,r=this.config?.timeline_hours??8,i=this.config?.timeline_offset??1,l=Math.floor((o-i*Tt)/Tt)*Tt,c=l+r*Tt,d=null!==s.grid,u=function(t,e,s){return t.filter(t=>t.end>e&&t.start<s).map(t=>({...t,start:Math.max(t.start,e),end:Math.min(t.end,s)}))}(zt(s.days),l,c).flatMap(t=>{if(!d||"off"!==t.state||t.start>=o)return[{from:t.start,to:t.end,className:we(t,o)}];const e={from:t.start,to:Math.min(t.end,o),className:"fill-skipped"};return t.end<=o?[e]:[e,{from:o,to:t.end,className:we({...t,start:o},o)}]});if(u.push(...this.actualSegments(s.days.flatMap(t=>t.actual),l,c,o)),"emergency"===s.status){const e=this.outageSince(t)??o;u.push({from:Math.max(e,l),to:o,className:"fill-off"}),u.push({from:o,to:c,className:"fill-hatch"})}const h=K`<span class="now" style="left:${qt(o,l,c)}%"></span>`,p=e?this.forecast(t,e):null,m=this.ticks(l,c,r),g=this.barHover(l,c,e=>$e(t,e,{title:ye(n,e,e+Pt),emergency:!0}));return K`<div class="timeline">
      <div class="row">
        <span class="row-label">${a("row.grid")}</span>${be(u,l,c,h,g)}
      </div>
      ${p?K`<div class="row">
              <span class="row-label">${a("row.battery")}</span>${be([{from:l,to:p.from,className:"fill-faint"},{from:p.from,to:p.until??c,className:p.enough?"fill-battery":"fill-battery-low"}],l,c,this.forecastText(p,qt(p.from,l,c),h),g)}
            </div>`:V}
      <div class="row axis">
        <span class="row-label"></span>
        <div class="ticks">
          ${m.map(t=>K`<span class="tick mono" style="left:${qt(t,l,c)}%">${n.time(t).slice(0,2)}</span>`)}
        </div>
      </div>
    </div>`}actualSegments(t,e,s,o){return t.map(t=>({from:Date.parse(t.start),to:t.end?Date.parse(t.end):o,className:"fill-actual"})).filter(t=>t.to>e&&t.from<s)}ticks(t,e,s){const o=Math.max(1,Math.round(s/4))*Tt,a=[];for(let s=t;s<=e;s+=o)a.push(s);return a}statKeys(t){const e=this.config?.stats,s=this.config?.battery?.soc?Ke:We;if(Array.isArray(e))return e;const o=e;return o?.[t]??s[t]}stats(t,e,s){return this.statKeys(e).map(e=>this.stat(t,e,s)).filter(t=>null!==t)}stat(t,e,s){const{payload:o,now:a,t:n,f:r}=t,i=ve(t,0),l=ve(t,1);switch(e){case"today":return{label:n("stat.today"),parts:ge(r,i?.outage_hours)};case"longest":return{label:n("stat.longest"),parts:ge(r,i?.longest_hours)};case"tomorrow":return{label:n("stat.tomorrow"),parts:l&&"waiting"!==l.status?ge(r,l.outage_hours):ue(n("value.not_yet"))};case"emergency":return{label:n("stat.emergency"),parts:ue(n(o.emergency?"value.yes":"value.no")),tone:o.emergency?"emergency":"on"};case"region":return{label:n("stat.region"),parts:ue(n(`region.${o.region_status?.status??"unknown"}`))};case"next_outage":return{label:n("stat.next_outage"),parts:ue(o.next?r.time(o.next.start):n("value.none"))};case"power_back":return{label:n("stat.power_back"),parts:ue(o.next_power_on?r.time(o.next_power_on):n("value.none"))};case"source":return{label:n("stat.source"),parts:ue(o.source.name??n("value.none"))};case"actual_today":return null==i?.actual_hours?null:{label:n("stat.actual_today"),parts:fe(r,i.actual_hours)};case"availability":return null===o.summary.availability?null:{label:n("stat.availability"),parts:[{value:r.number(o.summary.availability,1),unit:n("unit.percent")}]};default:return this.batteryStat(t,e,s,a)}}batteryStat(t,e,s,o){const{payload:a,t:n,f:r}=t;if(!s)return null;if("load"===e)return null===s.loadW?null:{label:n("stat.load"),parts:[r.power(s.loadW)]};if("battery_reserve"===e){const t=Wt(s);return{label:n("stat.battery_reserve"),parts:null===t?ue("∞"):r.durationParts(t),tone:"on"}}if("battery_at_start"===e){if(!a.next)return null;const t=Date.parse(a.next.start);return{label:n("stat.battery_at_start",{time:r.time(t)}),parts:[{value:r.number(It(s,t,o),0),unit:n("unit.percent")}],tone:"on"}}if("until_morning"===e){const e=function(t,e,s){const o=(e-s)/Tt;return o>0?Lt(t)/o:null}(s,this.morning(t,s.morningHour),o);return null===e?null:{label:n("stat.until_morning"),parts:[{value:`≤ ${r.number(e,2)}`,unit:n("unit.kw")}]}}return null}morning(t,e){const{now:s,f:o}=t,a=s-s%Tt;for(let t=1;t<=48;t+=1){const s=a+t*Tt;if(Number(o.time(s).slice(0,2))===e)return s}return s+432e5}}function Ze(t){return"number"==typeof t?t:Date.parse(t)}function Ve(t){return"number"==typeof t&&Number.isFinite(t)}function Qe(t,e,s){const o=Array.from({length:s},()=>[]);for(const s of t??[]){const t=Math.floor((Ze(s.start)-e)/Pt);o[t]?.push(s)}return o}async function Xe(t,e,s,o){const a=[...new Set(e.flatMap(t=>[t.input,t.output]).filter(t=>"string"==typeof t&&t.length>0))],n=0===a.length?{}:await t.callWS({type:"recorder/statistics_during_period",start_time:new Date(s).toISOString(),end_time:new Date(s+o*Pt).toISOString(),statistic_ids:a,period:"5minute",types:["min","max","mean"]});return e.map(t=>function(t,e,s,o){const a=Qe(t,s,o),n=Qe(e,s,o);return a.map((t,e)=>{const o=t.map(t=>t.min??t.mean).filter(Ve),a=t.map(t=>t.max??t.mean).filter(Ve),r=(n[e]??[]).map(t=>t.mean).filter(Ve);return{start:s+e*Pt,min:o.length>0?Math.min(...o):null,max:a.length>0?Math.max(...a):null,output:r.length>0?r.reduce((t,e)=>t+e,0)/r.length:null}})}(t.input?n[t.input]:void 0,t.output?n[t.output]:void 0,s,o))}function Je(t,e,s,o,a){return null===e||t&&(a?e>=t.value:e<=t.value)?t:{value:e,phase:s,time:o}}function Ge(t,e,s){let o=null,a=null,n=0,r=0;const i=t.map((t,i)=>{let l=0,c=0;const d=t.map(t=>{const n=function(t,e){return e.some(e=>e.start<t.start+Pt&&e.end>t.start)}(t,s);if(n||null===t.min||null===t.max)return{...t,outage:n,ok:null};const r=t.min>=e.min&&t.max<=e.max;return c+=1,l+=r?1:0,o=Je(o,t.min,i,t.start,!0),a=Je(a,t.max,i,t.start,!1),{...t,outage:n,ok:r}});return n+=l,r+=c,{slots:d,share:c>0?l/c:null}});return{phases:i,share:r>0?n/r:null,low:o,high:a}}const Ye=[0,.25,.5,.75];function ts(t){return Object.values(t.states).filter(t=>t.entity_id.startsWith("sensor.")&&"voltage"===t.attributes.device_class).map(t=>t.entity_id).sort().slice(0,3)}let es=(()=>{let s,o=Se,a=[],n=[];return class extends o{static{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(o[Symbol.metadata]??null):void 0;s=[gt()],t(this,null,s,{kind:"accessor",name:"slots",static:!1,private:!1,access:{has:t=>"slots"in t,get:t=>t.slots,set:(t,e)=>{t.slots=e}},metadata:e},a,n),e&&Object.defineProperty(this,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})}static styles=[...Se.styles,i`
      .phases {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .phase,
      .axis-row {
        display: grid;
        grid-template-columns: 28px minmax(0, 1fr) 44px;
        column-gap: 10px;
        align-items: center;
      }

      .phase-name {
        font-family: var(--bo-mono);
        font-size: 11px;
        font-weight: 600;
      }

      .track {
        position: relative;
        height: ${44}px;
        overflow: hidden;
        border-radius: 6px;
        background: var(--bo-surface);
      }

      .norm {
        position: absolute;
        right: 0;
        left: 0;
        background: color-mix(in srgb, var(--bo-on) 8%, transparent);
      }

      .nominal {
        position: absolute;
        right: 0;
        left: 0;
        border-top: 1px dashed var(--bo-divider);
      }

      .slots {
        position: absolute;
        inset: 0;
        display: flex;
      }

      .slot {
        position: relative;
        flex: 1 1 0;
        min-width: 0;
      }

      .slot.outage {
        background: var(--bo-hatch);
        opacity: 0.45;
      }

      .range {
        position: absolute;
        left: 50%;
        width: 3px;
        margin-left: -1.5px;
        border-radius: 2px;
        background: var(--bo-faint);
      }

      .range.out {
        background: var(--bo-off);
      }

      .output {
        position: absolute;
        right: 0;
        left: 0;
        height: 2px;
        background: var(--bo-on);
      }

      .share {
        color: var(--tone, var(--bo-text));
        font-family: var(--bo-mono);
        font-size: 11px;
        text-align: right;
        white-space: nowrap;
      }

      .axis {
        position: relative;
        height: 12px;
        color: var(--bo-muted);
        font-family: var(--bo-mono);
        font-size: 10px;
        white-space: nowrap;
      }

      .axis span {
        position: absolute;
        top: 0;
        transform: translateX(-50%);
      }

      .axis span:first-child {
        transform: none;
      }

      .axis span.now {
        right: 0;
        transform: none;
      }

      .in-norm .mono {
        margin-left: 4px;
        color: var(--bo-text);
        font-size: 13px;
      }

      .legend {
        margin-top: 12px;
      }

      .swatch.range-swatch {
        width: 3px;
        height: 12px;
        border-radius: 2px;
        background: var(--bo-faint);
      }

      .swatch.range-swatch.out {
        background: var(--bo-off);
      }

      .swatch.output-swatch {
        width: 14px;
        height: 2px;
        border-radius: 1px;
        background: var(--bo-on);
      }

      .stats {
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid var(--bo-divider);
      }

      .message {
        padding: 8px 0;
      }
    `];cardSize=5;#n=e(this,a,[]);get slots(){return this.#n}set slots(t){this.#n=t}loadedKey=(e(this,n),"");loadedAt=0;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){return{type:`custom:${At}`,entity:Ae(t),phases:ts(t).map(t=>({input:t}))}}requiresEntity(){return!1}historyDays(){return 2}defaultTitle(t){return t.t("title.voltage")}headerSide(t){return this.inNorm(t)}updated(){this.loadVoltage()}renderContent(t){return this.renderBody(t)}renderWithoutQueue(t){const e={now:Date.now(),t:(t,e)=>this.translator.t(t,e),f:this.formatter,payload:void 0};return K`<ha-card style=${t}>
      ${!1===this.config?.show_header?V:K`<div class="header">
              <div class="title">${this.config?.title??e.t("title.voltage")}</div>
              <div class="header-side">${this.inNorm(e)}</div>
            </div>`}
      ${this.renderBody(e)}
    </ha-card>`}phases(){return(this.config?.phases??[]).flatMap((t,e)=>t.input?[{...t,input:t.input,name:`L${e+1}`}]:[])}limits(){return{min:this.config?.voltage_min??207,max:this.config?.voltage_max??253}}windowStart(t){return Math.floor(t/Pt)*Pt-846e5}outages(t,e){const s=t.payload;if(!s)return[];return(s.grid?s.days.flatMap(e=>e.actual.map(e=>({start:Date.parse(e.start),end:e.end?Date.parse(e.end):t.now,possible:!1}))):s.days.flatMap(t=>"waiting"===t.status?[]:Nt(t).filter(t=>!t.possible))).map(e=>({...e,end:Math.min(e.end,t.now)})).filter(t=>t.end>e&&t.start<t.end)}report(t){const e=this.windowStart(t.now);return Ge(this.slots,this.limits(),this.outages(t,e))}inNorm(t){if(0===this.phases().length)return V;const e=this.report(t).share;return K`<span class="in-norm"
      >${t.t("voltage.in_norm")}<span class="mono"
        >${null===e?t.t("value.none"):`${t.f.number(100*e,0)} %`}</span
      ></span
    >`}renderBody(t){const e=this.phases();if(0===e.length)return K`<div class="message">${t.t("voltage.configure")}</div>`;const s=this.windowStart(t.now),o=this.limits(),a=this.outages(t,s),n=Ge(this.slots,o,a),r=o.min-17,i=o.max+7,l=t=>(i-Math.min(i,Math.max(r,t)))/(i-r)*44;return K`<div class="phases">
        ${e.map((e,s)=>this.renderPhase(t,e,n.phases[s],o,l))}
        <div class="axis-row">
          <span></span>
          <div class="axis">
            ${Ye.map(e=>K`<span style="left:${100*e}%"
                  >${t.f.time(s+48*e*Pt).slice(0,2)}</span
                >`)}
            <span class="now">${t.t("voltage.now")}</span>
          </div>
          <span></span>
        </div>
      </div>
      ${this.renderLegend(t,e,o)}
      ${me(this.stats(t,e,n.low,n.high,a,s))}`}renderPhase(t,e,s,o,a){const n=s?.share??null,r=null===n?"tone-muted":n>=.95?"tone-on":"tone-possible";return K`<div class="phase">
      <span class="phase-name">${e.name}</span>
      <div class="track">
        <span
          class="norm"
          style="top:${a(o.max)}px;height:${a(o.min)-a(o.max)}px"
        ></span>
        <span class="nominal" style="top:${a(230)}px"></span>
        <div class="slots">
          ${(s?.slots??[]).map(t=>this.renderSlot(t,a))}
        </div>
      </div>
      <span class="share ${r}"
        >${null===n?t.t("value.none"):`${t.f.number(100*n,0)} %`}</span
      >
    </div>`}renderSlot(t,e){if(t.outage)return K`<span class="slot outage"></span>`;const s=null===t.max?null:e(t.max),o=null===t.min?null:e(t.min);return K`<span class="slot"
      >${null===s||null===o?V:K`<span
              class="range ${!1===t.ok?"out":""}"
              style="top:${s}px;height:${Math.max(2,o-s)}px"
            ></span>`}${null===t.output?V:K`<span class="output" style="top:${e(t.output)-1}px"></span>`}</span
    >`}renderLegend(t,e,s){const{t:o,f:a}=t;return K`<div class="legend">
      <span class="legend-item"
        ><span class="swatch range-swatch"></span>${o("legend.voltage_input")}</span
      >
      <span class="legend-item"
        ><span class="swatch range-swatch out"></span>${o("legend.voltage_out",{min:a.number(s.min,0),max:a.number(s.max,0)})}</span
      >
      ${e.some(t=>t.output)?K`<span class="legend-item"
              ><span class="swatch output-swatch"></span>${o("legend.voltage_output")}</span
            >`:V}
      ${t.payload?K`<span class="legend-item"
              ><span class="swatch hatch"></span>${o("legend.off")}</span
            >`:V}
    </div>`}extremeStat(t,e,s,o){const{t:a,f:n}=t;return o?{label:e,parts:[{value:n.number(o.value,0),unit:a("unit.v")}],note:`${s[o.phase]?.name??""} · ${n.time(o.time)}`}:{label:e,parts:ue(a("value.none"))}}stats(t,e,s,o,a,n){const{t:r,f:i}=t,l=[this.extremeStat(t,r("stat.voltage_min"),e,s),this.extremeStat(t,r("stat.voltage_max"),e,o)];if(!t.payload)return l;const c=a.map(t=>({...t,start:Math.max(t.start,n)})),d=c.reduce((t,e)=>t+(e.end-e.start),0),u=1===c.length?c[0]:void 0,h=u?ye(i,u.start,u.end):c.length>1?this.translator.plural("voltage.outages",c.length):r("voltage.no_outages");return[...l,{label:r("stat.outage_time"),parts:i.durationParts(d),note:h}]}loadVoltage(){const t=this.hass,e=this.phases();if(!t||0===e.length)return;const s=Date.now(),o=this.windowStart(s),a=`${JSON.stringify(e)}|${o}`;a===this.loadedKey&&s-this.loadedAt<3e5||(this.loadedKey=a,this.loadedAt=s,Xe(t,e,o,48).then(t=>{this.loadedKey===a&&(this.slots=t)}).catch(()=>{this.loadedAt=0}))}}})();const ss=[0,6,12,18,24];class os extends Se{static styles=[...Se.styles,ce,i`
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
    `];cardSize=6;static getConfigElement(){return document.createElement("blackout-card-editor")}static getStubConfig(t){return{type:`custom:${$t}`,entity:Ae(t)}}historyDays(){return Math.min(90,Math.max(1,this.config?.days??7))}extraEntities(){return Rt(this.config?.battery)}defaultTitle(t){return t.t("title.week",{days:this.translator.plural("unit.days",this.historyDays())})}headerSide(t){const e=t.payload.grid;return!1!==this.config?.show_badge&&e&&null!==e.present?pe(t.t(e.present?"week.grid_on":"week.grid_off"),e.present?"on":"off"):V}renderContent(t){const e=this.config,s=t.f.dayKey(new Date(t.now)),o=t.payload.days.filter(t=>t.date<=s).slice(-this.historyDays()),a=null!==t.payload.grid,n=o.map(e=>({day:e,segments:this.rowSegments(t,e,a)})),r=n.some(t=>t.segments.some(t=>"fill-skipped"===t.className));return K`${!1!==e?.show_stats&&a?K`<div class="summary">${me(this.summary(t))}</div>`:V}
      <div class="rows">
        ${n.map(e=>this.renderRow(t,e.day,e.segments,e.day.date===s,a))}
      </div>
      <div class="axis-line mono">
        ${ss.map(t=>K`<span style="left:${t/24*100}%">${String(t).padStart(2,"0")}</span>`)}
      </div>
      ${!1===e?.show_legend?V:this.renderLegend(t,a,r)}
      ${!1===e?.show_next?V:this.renderNext(t)}`}rowSegments(t,e,s){const{now:o}=t,a=Date.parse(e.start),n=a+864e5,r=!1!==this.config?.show_schedule&&"waiting"!==e.status?Nt(e):[];if(!s)return r.map(t=>({from:t.start,to:t.end,className:t.possible?"fill-possible":"fill-actual"}));const i=r.filter(t=>!t.possible&&t.start<o).map(t=>({from:t.start,to:Math.min(t.end,o),className:"fill-skipped"})),l=e.actual.map(t=>({from:Date.parse(t.start),to:t.end?Date.parse(t.end):o,className:"fill-actual"})),c=r.filter(t=>t.end>o).map(t=>({from:Math.max(t.start,o),to:t.end,className:"fill-hatch"}));return[{from:a,to:Math.min(n,o),className:"fill-on"},...i,...l,...c]}renderRow(t,e,s,o,a){const{now:n,f:r}=t,i=Date.parse(e.start),l=i+864e5,c=!1!==this.config?.show_schedule,d=o?K`<span class="now" style="left:${qt(n,i,l)}%"></span>`:void 0,u=this.barHover(i,l,e=>$e(t,e,{title:`${r.weekday(e)} · ${ye(r,e,e+Pt)}`,schedule:c||!a}));return K`<div class="row ${o?"today":""}">
      <span class="row-label">${r.weekday(e.start)}</span>${be(s,i,l,d,u)}
    </div>`}renderLegend(t,e,s){const{t:o}=t;return K`<div class="legend">
      ${e?K`<span class="legend-item"><span class="swatch on"></span>${o("legend.grid_on")}</span>`:V}
      <span class="legend-item"><span class="swatch off"></span>${o("legend.off")}</span>
      ${e&&!1!==this.config?.show_schedule?K`<span class="legend-item"
              ><span class="swatch hatch"></span>${o("legend.by_schedule")}</span
            >`:V}
      ${s?K`<span class="legend-item"
              ><span class="swatch skipped"></span>${o("legend.skipped")}</span
            >`:V}
    </div>`}summary(t){const{payload:e,t:s,f:o}=t,a=e.summary,n=a.longest;return[{label:s("stat.without_grid"),parts:null===a.actual_hours?ue(s("value.none")):o.durationParts(a.actual_hours*Tt)},{label:s("stat.outages"),parts:ue(String(a.count??0))},{label:s("stat.longest"),parts:n?o.durationParts(n.hours*Tt):ue(s("value.none"))},{label:s("stat.availability"),parts:null===a.availability?ue(s("value.none")):[{value:o.number(a.availability,1),unit:s("unit.percent")}]}]}renderNext(t){const{payload:e,now:s,t:o,f:a}=t,n=e.next,r=this.hass?Bt(this.hass,this.config?.battery):null;if(!n)return K`<div class="next">
        <div class="next-block">
          <span class="next-label">${o("week.next_by_schedule")}</span>
          <span class="next-value muted">${o("week.no_next")}</span>
        </div>
      </div>`;const i=Date.parse(n.start),l=Date.parse(n.end),c=("scheduled_outage"===e.status||"unscheduled_outage"===e.status||"emergency"===e.status)&&e.next_power_on?Date.parse(e.next_power_on):i,d=r?It(r,i,s,c):null,u=r&&null!==d?Wt(r,d):null,h=null===u||i+u>=l;return K`<div class="next">
      <div class="next-block">
        <span class="next-label">${o("week.next_by_schedule")}</span>
        <span class="next-value">${ye(a,i,l)}</span>
        <span class="next-note"
          >${o("week.next_meta",{duration:a.duration(Math.max(0,i-s)),group:e.queue.group})}</span
        >
      </div>
      ${r&&null!==d?K`<div class="next-block">
              <span class="next-label">${o("week.battery_forecast",{time:a.time(i)})}</span>
              <span class="next-value tone-${h?"on":"possible"}"
                >${h?"✓":"!"} ${a.number(d,0)} %</span
              >
              <span class="next-note"
                >${null===u?"":o("week.battery_lasts",{duration:a.duration(u)})}</span
              >
            </div>`:V}
    </div>`}}const as={"ha-form":"hui-button-card","ha-entity-picker":"hui-entities-card","ha-expansion-panel":"hui-tile-card"};async function ns(){const t=Object.entries(as).filter(([t])=>!customElements.get(t));if(0===t.length)return;const e=await(window.loadCardHelpers?.());e&&await Promise.all(t.map(async([,t])=>{customElements.get(t)||await e.createCardElement({type:t.replace(/^hui-|-card$/g,"")}),await async function(t){const e=customElements.get(t);await(e?.getConfigElement?.())}(t)}))}const rs=t=>({name:t,selector:{boolean:{}}}),is=(t,e,s,o=1)=>({name:t,selector:{number:{min:e,max:s,step:o,mode:"box"}}}),ls=t=>({name:t,selector:{object:{}}}),cs=t=>({name:t,selector:{text:{}}}),ds=(t,e,s,o=!1)=>({name:t,selector:{select:{multiple:o,mode:"dropdown",options:e.map(t=>({value:t,label:s(`editor.option.${t}`)}))}}}),us=(t,e)=>!1!==t[e],hs=(t,...e)=>t?e:[];function ps(t,...e){return[rs("show_header"),...hs(us(t,"show_header"),cs("title"),...e)]}function ms(t,e,s,o,...a){return{sensors:s,hint:o,schema:[is("capacity",0,1e3,.1),is("reserve",0,100),...hs(Boolean(t.battery?.power),ds("power_positive",["discharge","charge"],e)),...a]}}function gs(t,e){return[{type:"expandable",name:"advanced",title:t("editor.advanced"),flatten:!0,schema:[{name:"language",selector:{select:{mode:"dropdown",options:ae.map(t=>({value:t,label:t.toUpperCase()}))}}},cs("time_zone"),...hs(e,ds("tap_action",["more-info","none"],t)),ls("labels"),ls("colors")]}]}function fs(t,e,s){switch(t){case _t:return function(t,e){const s=us(t,"show_timeline"),o=us(t,"show_stats");return{entityRequired:!0,main:[...ps(t,rs("show_badge")),rs("show_timeline"),...hs(s,is("timeline_hours",2,48),is("timeline_offset",0,24)),rs("show_stats"),...hs(o,ls("stats"))],battery:s||o?ms(t,e,["soc","power","load"],e("editor.battery_hint.status"),...hs(o,is("morning_hour",0,23))):null}}(e,s);case xt:return function(t,e){const s=us(t,"show_windows");return{entityRequired:!0,main:[...ps(t),ds("days",["today","tomorrow"],e,!0),rs("show_source"),rs("show_now"),rs("show_legend"),rs("show_windows"),rs("show_totals")],battery:s?ms(t,e,["soc","power"],e("editor.battery_hint.schedule")):null}}(e,s);case $t:return function(t,e){const s=us(t,"show_next");return{entityRequired:!0,main:[...ps(t,rs("show_badge")),is("days",1,90),rs("show_stats"),rs("show_schedule"),rs("show_legend"),rs("show_next")],battery:s?ms(t,e,["soc","power","load"],e("editor.battery_hint.week")):null}}(e,s);case kt:return function(t){return{entityRequired:!1,main:[...ps(t,cs("since")),is("columns",1,4),ls("items")],battery:null}}(e);case St:return function(t,e){return{entityRequired:!1,main:ps(t),battery:ms(t,e,["soc","power","load"],e("editor.battery_hint.battery"))}}(e,s);case At:return function(t){return{entityRequired:!1,main:[...ps(t),is("voltage_min",100,250),is("voltage_max",200,300)],battery:null,phases:!0}}(e);default:return{entityRequired:!0,main:ps(e),battery:null}}}function ys(t,e){return Object.fromEntries(Object.entries(t).filter(([t,s])=>!(t in e)||JSON.stringify(s)!==JSON.stringify(e[t])))}const bs=["sensor"],ws=["L1","L2","L3"],vs=new Set(["w","kw"]);function _s(t){const e=t.attributes.unit_of_measurement;return"power"===t.attributes.device_class||"string"==typeof e&&vs.has(e.toLowerCase())}function xs(t){return"voltage"===t.attributes.device_class||"V"===t.attributes.unit_of_measurement}const $s={soc:t=>"battery"===t.attributes.device_class||"%"===t.attributes.unit_of_measurement,power:_s,load:_s};function ks(t){return null==t||""===t||"object"==typeof t&&!Array.isArray(t)&&0===Object.keys(t).length}function Ss(t){return Object.fromEntries(Object.entries(t).filter(([,t])=>!ks(t)))}let As=(()=>{let s,o,a=dt,n=[],r=[],l=[],c=[];return class extends a{static{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(a[Symbol.metadata]??null):void 0;s=[mt({attribute:!1})],o=[gt()],t(this,null,s,{kind:"accessor",name:"hass",static:!1,private:!1,access:{has:t=>"hass"in t,get:t=>t.hass,set:(t,e)=>{t.hass=e}},metadata:e},n,r),t(this,null,o,{kind:"accessor",name:"config",static:!1,private:!1,access:{has:t=>"config"in t,get:t=>t.config,set:(t,e)=>{t.config=e}},metadata:e},l,c),e&&Object.defineProperty(this,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})}static styles=i`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    ha-entity-picker {
      display: block;
      min-width: 0;
    }

    .panel-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0 4px;
    }

    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.4;
    }
  `;#t=e(this,n,void 0);get hass(){return this.#t}set hass(t){this.#t=t}#e=(e(this,r),e(this,l,void 0));get config(){return this.#e}set config(t){this.#e=t}translator=(e(this,c),re("en"));setConfig(t){this.config=t}connectedCallback(){super.connectedCallback(),ns().then(()=>this.requestUpdate())}willUpdate(){this.translator=re(this.hass?.locale?.language??this.hass?.language)}t(t){return this.translator.t(t)}render(){const t=this.config;if(!this.hass||!t)return V;const e=function(t,e,s){const o=t.replace(/^custom:/,""),a=us(e,"show_header")&&Boolean(e.entity);return{...fs(o,e,s),defaults:Mt[o]??{},advanced:gs(s,a)}}(t.type,t,t=>this.t(t)),s={...e.defaults,...t},o=s=>{this.commit({...ys(s,e.defaults),entity:t.entity,battery:t.battery})};return K`<div class="editor">
      ${this.renderPicker({label:this.t("editor.entity"),value:t.entity,required:e.entityRequired,filter:this.isQueueEntity,onChange:e=>{this.commit({...t,entity:e})}})}
      ${this.renderForm(e.main,s,o)}
      ${e.phases?this.renderPhases(t.phases??[]):V}
      ${e.battery?this.renderBattery(e.battery,t.battery??{}):V}
      ${this.renderForm(e.advanced,s,o)}
    </div>`}renderBattery(t,e){const s=t.sensors.filter(t=>e[t]).length;return K`<ha-expansion-panel
      outlined
      .header=${this.t("editor.battery")}
      .secondary=${this.translator.plural("editor.sensors",s)}
      .expanded=${s>0}
    >
      <div class="panel-content">
        <div class="hint">${t.hint}</div>
        ${t.sensors.map(t=>this.renderPicker({label:this.t(`editor.${t}`),value:e[t],required:!1,filter:$s[t],onChange:s=>{this.updateBattery({...e,[t]:s})}}))}
        ${this.renderForm(t.schema,{...Dt,...e},t=>{this.updateBattery(ys(t,Dt))})}
      </div>
    </ha-expansion-panel>`}renderPhases(t){const e=t.flatMap(t=>[t.input,t.output]).filter(Boolean).length;return K`<ha-expansion-panel
      outlined
      expanded
      .header=${this.t("editor.phases")}
      .secondary=${this.translator.plural("editor.sensors",e)}
    >
      <div class="panel-content">
        <div class="hint">${this.t("editor.phases_hint")}</div>
        ${ws.map((e,s)=>K`${this.renderPicker({label:this.translator.t("editor.phase_input",{phase:e}),value:t[s]?.input,required:0===s,filter:xs,onChange:t=>{this.updatePhase(s,{input:t})}})}
            ${this.renderPicker({label:this.translator.t("editor.phase_output",{phase:e}),value:t[s]?.output,required:!1,filter:xs,onChange:t=>{this.updatePhase(s,{output:t})}})}`)}
      </div>
    </ha-expansion-panel>`}updatePhase(t,e){if(!this.config)return;const s=this.config.phases??[],o=ws.map((o,a)=>Ss({...s[a],...a===t?e:{}}));for(;o.length>0&&ks(o.at(-1));)o.pop();this.commit({...this.config,phases:o.length>0?o:void 0})}renderPicker(t){return K`<ha-entity-picker
      .hass=${this.hass}
      .value=${t.value??""}
      .label=${t.label}
      .helper=${t.value}
      .required=${t.required}
      .includeDomains=${bs}
      .entityFilter=${t.filter}
      .showEntityId=${!0}
      @value-changed=${e=>{e.stopPropagation();const s=e.detail.value;t.onChange("string"==typeof s&&s?s:void 0)}}
    ></ha-entity-picker>`}renderForm(t,e,s){return K`<ha-form
      .hass=${this.hass}
      .data=${e}
      .schema=${t}
      .computeLabel=${t=>this.t(`editor.${t.name}`)}
      .computeHelper=${t=>{const e=`editor.helper.${t.name}`,s=this.t(e);return s===e?void 0:s}}
      @value-changed=${t=>{t.stopPropagation(),s(t.detail.value)}}
    ></ha-form>`}isQueueEntity=t=>{const e=this.hass?.entities;return e?"blackout"===e[t.entity_id]?.platform:"string"==typeof t.attributes.group};updateBattery(t){const e=Ss(t);this.config&&this.commit({...this.config,battery:ks(e)?void 0:e})}commit(t){if(!this.config)return;const e={...Ss(t),type:this.config.type};this.config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}}})();const Es=[[_t,Fe],[xt,Ie],[$t,os],[kt,He],[St,Te],[At,es],["blackout-card-editor",As]],Cs=[{type:_t,name:"Blackout status",description:"Power now, countdown to the next outage or to power back, grid and battery timeline."},{type:xt,name:"Blackout schedule",description:"Outage schedule for today and tomorrow by half hours, windows and totals."},{type:$t,name:"Blackout week",description:"Actual outages of the last days with the schedule, availability and the next outage."},{type:kt,name:"Blackout records",description:"Outage records and any records from long-term statistics."},{type:St,name:"Blackout battery",description:"Battery charge today with a forecast to midnight, outages, charged energy and cycles."},{type:At,name:"Blackout voltage",description:"Input voltage per phase over 24 hours by half hours, after stabilizers and outages."}];for(const[t,e]of Es)customElements.get(t)||customElements.define(t,e);window.customCards=window.customCards??[];for(const t of Cs)window.customCards.some(e=>e.type===t.type)||window.customCards.push({...t,preview:!0,documentationURL:"https://github.com/RobinCK/blackout"});console.info("%c BLACKOUT CARDS %c 0.2.0 ","font-weight: bold","");

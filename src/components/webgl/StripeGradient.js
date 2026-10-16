function normalizeColor(t) {
  return [(t >> 16 & 255) / 255, (t >> 8 & 255) / 255, (255 & t) / 255];
}
class Ni{constructor(e,n,a,r=!1){const i=this,f=document.location.search.toLowerCase().indexOf("debug=webgl")!==-1;i.canvas=e,i.gl=i.canvas.getContext("webgl",{antialias:!0,alpha:!0,powerPreference:"low-power"}),i.meshes=[];const l=i.gl;n&&a&&this.setSize(n,a),i.lastDebugMsg,i.debug=r&&f?function(c){const o=new Date;o-i.lastDebugMsg>1e3&&console.log("---"),console.log(o.toLocaleTimeString()+Array(Math.max(0,32-c.length)).join(" ")+c+": ",...Array.from(arguments).slice(1)),i.lastDebugMsg=o}:()=>{},Object.defineProperties(i,{Material:{enumerable:!1,value:class{constructor(c,o,d={}){const s=this;function h(g,m){const A=l.createShader(g);return l.shaderSource(A,m),l.compileShader(A),l.getShaderParameter(A,l.COMPILE_STATUS)||console.error(l.getShaderInfoLog(A)),i.debug("Material.compileShaderSource",{source:m}),A}function b(g,m){return Object.entries(g).map(([A,C])=>C.getDeclaration(A,m)).join(`
`)}s.uniforms=d,s.uniformInstances=[];const x=`
              precision highp float;
            `;s.vertexSource=`
              ${x}
              attribute vec4 position;
              attribute vec2 uv;
              attribute vec2 uvNorm;
              ${b(i.commonUniforms,"vertex")}
              ${b(d,"vertex")}
              ${c}
            `,s.Source=`
              ${x}
              ${b(i.commonUniforms,"fragment")}
              ${b(d,"fragment")}
              ${o}
            `,s.vertexShader=h(l.VERTEX_SHADER,s.vertexSource),s.fragmentShader=h(l.FRAGMENT_SHADER,s.Source),s.program=l.createProgram(),l.attachShader(s.program,s.vertexShader),l.attachShader(s.program,s.fragmentShader),l.linkProgram(s.program),l.getProgramParameter(s.program,l.LINK_STATUS)||console.error(l.getProgramInfoLog(s.program)),l.useProgram(s.program),s.attachUniforms(void 0,i.commonUniforms),s.attachUniforms(void 0,s.uniforms)}attachUniforms(c,o){const d=this;c===void 0?Object.entries(o).forEach(([s,h])=>{d.attachUniforms(s,h)}):o.type=="array"?o.value.forEach((s,h)=>d.attachUniforms(`${c}[${h}]`,s)):o.type=="struct"?Object.entries(o.value).forEach(([s,h])=>d.attachUniforms(`${c}.${s}`,h)):(i.debug("Material.attachUniforms",{name:c,uniform:o}),d.uniformInstances.push({uniform:o,location:l.getUniformLocation(d.program,c)}))}}},Uniform:{enumerable:!1,value:class{constructor(c){this.type="float",Object.assign(this,c),this.typeFn={float:"1f",int:"1i",vec2:"2fv",vec3:"3fv",vec4:"4fv",mat4:"Matrix4fv"}[this.type]||"1f",this.update()}update(c){this.value!==void 0&&l[`uniform${this.typeFn}`](c,this.typeFn.indexOf("Matrix")===0?this.transpose:this.value,this.typeFn.indexOf("Matrix")===0?this.value:null)}getDeclaration(c,o,d){const s=this;if(s.excludeFrom!==o){if(s.type==="array")return s.value[0].getDeclaration(c,o,s.value.length)+`
const int ${c}_length = ${s.value.length};`;if(s.type==="struct"){let h=c.replace("u_","");return h=h.charAt(0).toUpperCase()+h.slice(1),`uniform struct ${h} 
                                  {
`+Object.entries(s.value).map(([b,x])=>x.getDeclaration(b,o).replace(/^uniform/,"")).join("")+`
} ${c}${d>0?`[${d}]`:""};`}return`uniform ${s.type} ${c}${d>0?`[${d}]`:""};`}}}},PlaneGeometry:{enumerable:!1,value:class{constructor(c,o,d,s,h){l.createBuffer(),this.attributes={position:new i.Attribute({target:l.ARRAY_BUFFER,size:3}),uv:new i.Attribute({target:l.ARRAY_BUFFER,size:2}),uvNorm:new i.Attribute({target:l.ARRAY_BUFFER,size:2}),index:new i.Attribute({target:l.ELEMENT_ARRAY_BUFFER,size:3,type:l.UNSIGNED_SHORT})},this.setTopology(d,s),this.setSize(c,o,h)}setTopology(c=1,o=1){const d=this;d.xSegCount=c,d.ySegCount=o,d.vertexCount=(d.xSegCount+1)*(d.ySegCount+1),d.quadCount=d.xSegCount*d.ySegCount*2,d.attributes.uv.values=new Float32Array(2*d.vertexCount),d.attributes.uvNorm.values=new Float32Array(2*d.vertexCount),d.attributes.index.values=new Uint16Array(3*d.quadCount);for(let s=0;s<=d.ySegCount;s++)for(let h=0;h<=d.xSegCount;h++){const b=s*(d.xSegCount+1)+h;if(d.attributes.uv.values[2*b]=h/d.xSegCount,d.attributes.uv.values[2*b+1]=1-s/d.ySegCount,d.attributes.uvNorm.values[2*b]=h/d.xSegCount*2-1,d.attributes.uvNorm.values[2*b+1]=1-s/d.ySegCount*2,h<d.xSegCount&&s<d.ySegCount){const x=s*d.xSegCount+h;d.attributes.index.values[6*x]=b,d.attributes.index.values[6*x+1]=b+1+d.xSegCount,d.attributes.index.values[6*x+2]=b+1,d.attributes.index.values[6*x+3]=b+1,d.attributes.index.values[6*x+4]=b+1+d.xSegCount,d.attributes.index.values[6*x+5]=b+2+d.xSegCount}}d.attributes.uv.update(),d.attributes.uvNorm.update(),d.attributes.index.update(),i.debug("Geometry.setTopology",{uv:d.attributes.uv,uvNorm:d.attributes.uvNorm,index:d.attributes.index})}setSize(c=1,o=1,d="xz"){const s=this;s.width=c,s.height=o,s.orientation=d,s.attributes.position.values&&s.attributes.position.values.length===3*s.vertexCount||(s.attributes.position.values=new Float32Array(3*s.vertexCount));const h=c/-2,b=o/-2,x=c/s.xSegCount,g=o/s.ySegCount;for(let m=0;m<=s.ySegCount;m++){const A=b+m*g;for(let C=0;C<=s.xSegCount;C++){const p=h+C*x,_=m*(s.xSegCount+1)+C;s.attributes.position.values[3*_+"xyz".indexOf(d[0])]=p,s.attributes.position.values[3*_+"xyz".indexOf(d[1])]=-A}}s.attributes.position.update(),i.debug("Geometry.setSize",{position:s.attributes.position})}}},Mesh:{enumerable:!1,value:class{constructor(c,o){const d=this;d.geometry=c,d.material=o,d.wireframe=!1,d.attributeInstances=[],Object.entries(d.geometry.attributes).forEach(([s,h])=>{d.attributeInstances.push({attribute:h,location:h.attach(s,d.material.program)})}),i.meshes.push(d),i.debug("Mesh.constructor",{mesh:d})}draw(){if(!l||l.isContextLost())return;l.useProgram(this.material.program),this.material.uniformInstances.forEach(({uniform:c,location:o})=>c.update(o)),this.attributeInstances.forEach(({attribute:c,location:o})=>c.use(o)),l.drawElements(this.wireframe?l.LINES:l.TRIANGLES,this.geometry.attributes.index.values.length,l.UNSIGNED_SHORT,0)}remove(){i.meshes=i.meshes.filter(c=>c!=this)}}},Attribute:{enumerable:!1,value:class{constructor(c){this.type=l.FLOAT,this.normalized=!1,this.buffer=l.createBuffer(),Object.assign(this,c),this.update()}update(){if(!l||l.isContextLost())return;this.values!==void 0&&(l.bindBuffer(this.target,this.buffer),l.bufferData(this.target,this.values,l.STATIC_DRAW))}attach(c,o){if(!l||l.isContextLost())return null;const d=l.getAttribLocation(o,c);return this.target===l.ARRAY_BUFFER&&(l.enableVertexAttribArray(d),l.vertexAttribPointer(d,this.size,this.type,this.normalized,0,0)),d}use(c){if(!l||l.isContextLost())return;l.bindBuffer(this.target,this.buffer),this.target===l.ARRAY_BUFFER&&(l.enableVertexAttribArray(c),l.vertexAttribPointer(c,this.size,this.type,this.normalized,0,0))}}}});const v=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];i.commonUniforms={projectionMatrix:new i.Uniform({type:"mat4",value:v}),modelViewMatrix:new i.Uniform({type:"mat4",value:v}),resolution:new i.Uniform({type:"vec2",value:[1,1]}),aspectRatio:new i.Uniform({type:"float",value:1})}}setSize(e=640,n=480){if(!this.gl||this.gl.isContextLost())return;this.width=e,this.height=n,this.canvas.width=e,this.canvas.height=n,this.gl.viewport(0,0,e,n),this.commonUniforms.resolution.value=[e,n],this.commonUniforms.aspectRatio.value=e/n,this.debug("MiniGL.setSize",{width:e,height:n})}setOrthographicCamera(e=0,n=0,a=0,r=-2e3,i=2e3){this.commonUniforms.projectionMatrix.value=[2/this.width,0,0,0,0,2/this.height,0,0,0,0,2/(r-i),0,e,n,a,1],this.debug("setOrthographicCamera",this.commonUniforms.projectionMatrix.value)}render(){if(!this.gl||this.gl.isContextLost())return;this.gl.clearColor(0,0,0,0),this.gl.clearDepth(1),this.meshes.forEach(e=>e.draw())}}function D(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}class Mi{constructor(...e){D(this,"el",void 0),D(this,"cssVarRetries",0),D(this,"maxCssVarRetries",200),D(this,"angle",0),D(this,"isLoadedClass",!1),D(this,"isScrolling",!1),D(this,"scrollingTimeout",void 0),D(this,"scrollingRefreshDelay",200),D(this,"isIntersecting",!0),D(this,"shaderFiles",void 0),D(this,"vertexShader",void 0),D(this,"sectionColors",void 0),D(this,"computedCanvasStyle",void 0),D(this,"conf",void 0),D(this,"uniforms",void 0),D(this,"t",1253106),D(this,"last",0),D(this,"width",void 0),D(this,"minWidth",1111),D(this,"height",600),D(this,"xSegCount",void 0),D(this,"ySegCount",void 0),D(this,"mesh",void 0),D(this,"material",void 0),D(this,"geometry",void 0),D(this,"minigl",void 0),D(this,"scrollObserver",void 0),D(this,"amp",320),D(this,"seed",5),D(this,"freqX",14e-5),D(this,"freqY",29e-5),D(this,"freqDelta",1e-5),D(this,"activeColors",[1,1,1,1]),D(this,"isMetaKey",!1),D(this,"isGradientLegendVisible",!1),D(this,"isMouseDown",!1),D(this,"handleScroll",()=>{clearTimeout(this.scrollingTimeout),this.scrollingTimeout=setTimeout(this.handleScrollEnd,this.scrollingRefreshDelay),this.isGradientLegendVisible&&this.hideGradientLegend()}),D(this,"handleScrollEnd",()=>{this.isScrolling=!1,this.isIntersecting&&this.play()}),D(this,"resize",()=>{this.width=window.innerWidth,this.height=window.innerHeight,this.minigl.setSize(this.width,this.height),this.minigl.setOrthographicCamera(),this.xSegCount=Math.ceil(this.width*this.conf.density[0]),this.ySegCount=Math.ceil(this.height*this.conf.density[1]),this.mesh.geometry.setTopology(this.xSegCount,this.ySegCount),this.mesh.geometry.setSize(this.width,this.height),this.mesh.material.uniforms.u_shadow_power.value=this.width<600?5:6}),D(this,"handleMouseDown",n=>{this.isGradientLegendVisible&&(this.isMetaKey=n.metaKey,this.isMouseDown=!0,this.conf.playing===!1&&requestAnimationFrame(this.animate))}),D(this,"handleMouseUp",()=>{this.isMouseDown=!1}),D(this,"animate",n=>{if(!this.shouldSkipFrame(n)||this.isMouseDown){if(this.t+=Math.min(n-this.last,1e3/15),this.last=n,this.isMouseDown){let a=160;this.isMetaKey&&(a=-160),this.t+=a}this.mesh.material.uniforms.u_time.value=this.t,this.minigl.render()}if(this.last!==0&&this.isStatic)return this.minigl.render(),void this.disconnect();(this.conf.playing||this.isMouseDown)&&requestAnimationFrame(this.animate)}),D(this,"addIsLoadedClass",()=>{!this.isLoadedClass&&(this.isLoadedClass=!0,this.el.classList.add("isLoaded"),setTimeout(()=>{this.el.parentElement.classList.add("isLoaded")},3e3))}),D(this,"pause",()=>{this.conf.playing=!1}),D(this,"play",()=>{requestAnimationFrame(this.animate),this.conf.playing=!0}),D(this,"initGradient",n=>(this.el=typeof n==="string"?document.querySelector(n):n,this.connect(),this))}async connect(){this.shaderFiles={vertex:`varying vec3 v_color;

void main() {
  float time = u_time * u_global.noiseSpeed;

  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;

  vec2 st = 1. - uvNorm.xy;

  //
  // Tilting the plane
  //

  // Front-to-back tilt
  float tilt = resolution.y / 2.0 * uvNorm.y;

  // Left-to-right angle
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;

  // Up-down shift to offset incline
  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);

  //
  // Vertex noise
  //

  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;

  // Fade noise to zero at edges
  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);

  // Clamp to 0
  noise = max(0.0, noise);

  vec3 pos = vec3(
    position.x,
    position.y + tilt + incline + noise - offset,
    position.z
  );

  //
  // Vertex color, to be passed to fragment shader
  //

  if (u_active_colors[0] == 1.) {
    v_color = u_baseColor;
  }

  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.) {
      WaveLayers layer = u_waveLayers[i];

      float noise = smoothstep(
        layer.noiseFloor,
        layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5
      );

      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));
    }
  }

  //
  // Finish
  //

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,noise:`//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}`,blend:`//
// https://github.com/jamieowen/glsl-blend
//

// Normal

vec3 blendNormal(vec3 base, vec3 blend) {
	return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
	return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}

// Screen

float blendScreen(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
	return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
	return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}

// Multiply

vec3 blendMultiply(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}

// Overlay

float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

// Hard light

vec3 blendHardLight(vec3 base, vec3 blend) {
	return blendOverlay(blend,base);
}

vec3 blendHardLight(vec3 base, vec3 blend, float opacity) {
	return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Soft light

float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Color dodge

float blendColorDodge(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
	return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}

vec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {
	return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Color burn

float blendColorBurn(float base, float blend) {
	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn(vec3 base, vec3 blend) {
	return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));
}

vec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {
	return (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Vivid Light

float blendVividLight(float base, float blend) {
	return (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));
}

vec3 blendVividLight(vec3 base, vec3 blend) {
	return vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));
}

vec3 blendVividLight(vec3 base, vec3 blend, float opacity) {
	return (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Lighten

float blendLighten(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear burn

float blendLinearBurn(float base, float blend) {
	// Note : Same implementation as BlendSubtractf
	return max(base+blend-1.0,0.0);
}

vec3 blendLinearBurn(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendSubtract
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
	return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear dodge

float blendLinearDodge(float base, float blend) {
	// Note : Same implementation as BlendAddf
	return min(base+blend,1.0);
}

vec3 blendLinearDodge(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendAdd
	return min(base+blend,vec3(1.0));
}

vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
	return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear light

float blendLinearLight(float base, float blend) {
	return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));
}

vec3 blendLinearLight(vec3 base, vec3 blend) {
	return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));
}

vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
	return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
}`,fragment:`varying vec3 v_color;

void main() {
  vec3 color = v_color;
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }
  gl_FragColor = vec4(color, 1.0);
}`},this.conf={presetName:"",wireframe:!1,density:[.06,.16],zoom:1,rotation:0,playing:!0},document.querySelectorAll("canvas").length<1?console.log("DID NOT LOAD HERO STRIPE CANVAS"):(this.minigl=new Ni(this.el,null,null,!0),requestAnimationFrame(()=>{this.el&&(this.computedCanvasStyle=getComputedStyle(this.el),this.waitForCssVars())}))}disconnect(){this.scrollObserver&&(window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("mousedown",this.handleMouseDown),window.removeEventListener("mouseup",this.handleMouseUp),window.removeEventListener("keydown",this.handleKeyDown),this.scrollObserver.disconnect()),window.removeEventListener("resize",this.resize)}initMaterial(){this.uniforms={u_time:new this.minigl.Uniform({value:0}),u_shadow_power:new this.minigl.Uniform({value:10}),u_darken_top:new this.minigl.Uniform({value:this.el.dataset.jsDarkenTop===""?1:0}),u_active_colors:new this.minigl.Uniform({value:this.activeColors,type:"vec4"}),u_global:new this.minigl.Uniform({value:{noiseFreq:new this.minigl.Uniform({value:[this.freqX,this.freqY],type:"vec2"}),noiseSpeed:new this.minigl.Uniform({value:5e-6})},type:"struct"}),u_vertDeform:new this.minigl.Uniform({value:{incline:new this.minigl.Uniform({value:Math.sin(this.angle)/Math.cos(this.angle)}),offsetTop:new this.minigl.Uniform({value:-.5}),offsetBottom:new this.minigl.Uniform({value:-.5}),noiseFreq:new this.minigl.Uniform({value:[3,4],type:"vec2"}),noiseAmp:new this.minigl.Uniform({value:this.amp}),noiseSpeed:new this.minigl.Uniform({value:10}),noiseFlow:new this.minigl.Uniform({value:3}),noiseSeed:new this.minigl.Uniform({value:this.seed})},type:"struct",excludeFrom:"fragment"}),u_baseColor:new this.minigl.Uniform({value:this.sectionColors[0],type:"vec3",excludeFrom:"fragment"}),u_waveLayers:new this.minigl.Uniform({value:[],excludeFrom:"fragment",type:"array"})};for(let e=1;e<this.sectionColors.length;e+=1)this.uniforms.u_waveLayers.value.push(new this.minigl.Uniform({value:{color:new this.minigl.Uniform({value:this.sectionColors[e],type:"vec3"}),noiseFreq:new this.minigl.Uniform({value:[2+e/this.sectionColors.length,3+e/this.sectionColors.length],type:"vec2"}),noiseSpeed:new this.minigl.Uniform({value:11+.3*e}),noiseFlow:new this.minigl.Uniform({value:6.5+.3*e}),noiseSeed:new this.minigl.Uniform({value:this.seed+10*e}),noiseFloor:new this.minigl.Uniform({value:.1}),noiseCeil:new this.minigl.Uniform({value:.63+.07*e})},type:"struct"}));return this.vertexShader=[this.shaderFiles.noise,this.shaderFiles.blend,this.shaderFiles.vertex].join(`

`),new this.minigl.Material(this.vertexShader,this.shaderFiles.fragment,this.uniforms)}initMesh(){this.material=this.initMaterial(),this.geometry=new this.minigl.PlaneGeometry,this.mesh=new this.minigl.Mesh(this.geometry,this.material)}shouldSkipFrame(e){return!!window.document.hidden||!this.conf.playing||parseInt(e,10)%2==0||void 0}updateFrequency(e){this.freqX+=e,this.freqY+=e}toggleColor(e){this.activeColors[e]=this.activeColors[e]===0?1:0}showGradientLegend(){this.width>this.minWidth&&(this.isGradientLegendVisible=!0,document.body.classList.add("isGradientLegendVisible"))}hideGradientLegend(){this.isGradientLegendVisible=!1,document.body.classList.remove("isGradientLegendVisible")}init(){this.initGradientColors(),this.initMesh(),this.resize(),requestAnimationFrame(this.animate),window.addEventListener("resize",this.resize)}waitForCssVars(){if(this.computedCanvasStyle&&this.computedCanvasStyle.getPropertyValue("--gradient-color-1").indexOf("#")!==-1)this.init(),this.addIsLoadedClass();else{if(this.cssVarRetries+=1,this.cssVarRetries>this.maxCssVarRetries)return this.sectionColors=[16711680,16711680,16711935,65280,255],void this.init();requestAnimationFrame(()=>this.waitForCssVars())}}initGradientColors(){this.sectionColors=["--gradient-color-1","--gradient-color-2","--gradient-color-3","--gradient-color-4"].map(e=>{let n=this.computedCanvasStyle.getPropertyValue(e).trim();return n.length===4&&(n=`#${n.substr(1).split("").map(r=>r+r).join("")}`),n&&`0x${n.substr(1)}`}).filter(Boolean).map(normalizeColor)}}

export { Mi as Gradient, Ni as MiniGL };

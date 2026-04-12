(function () {
  'use strict';

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function readNumber(value, fallback) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function readBoolean(value, fallback) {
    if (value === '1' || value === 'true') return true;
    if (value === '0' || value === 'false') return false;
    return fallback;
  }

  function hexToRgbArray(hex) {
    if (!hex) return [1, 1, 1];
    var clean = String(hex).trim();
    if (clean.charAt(0) === '#') clean = clean.slice(1);

    if (clean.length === 3) {
      clean = clean.split('').map(function (char) { return char + char; }).join('');
    }

    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return [1, 1, 1];

    return [
      parseInt(clean.slice(0, 2), 16) / 255,
      parseInt(clean.slice(2, 4), 16) / 255,
      parseInt(clean.slice(4, 6), 16) / 255
    ];
  }

  function cssVar(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var error = gl.getShaderInfoLog(shader) || 'Unknown shader compile error';
      gl.deleteShader(shader);
      throw new Error(error);
    }
    return shader;
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    var program = gl.createProgram();
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var error = gl.getProgramInfoLog(program) || 'Unknown program link error';
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      throw new Error(error);
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  }

  var vertexSource = "#version 300 es\n" +
    "in vec2 position;\n" +
    "void main() {\n" +
    "  gl_Position = vec4(position, 0.0, 1.0);\n" +
    "}\n";

  var fragmentSource = "#version 300 es\n" +
    "precision highp float;\n" +
    "uniform vec2 iResolution;\n" +
    "uniform float iTime;\n" +
    "uniform float uTimeSpeed;\n" +
    "uniform float uColorBalance;\n" +
    "uniform float uWarpStrength;\n" +
    "uniform float uWarpFrequency;\n" +
    "uniform float uWarpSpeed;\n" +
    "uniform float uWarpAmplitude;\n" +
    "uniform float uBlendAngle;\n" +
    "uniform float uBlendSoftness;\n" +
    "uniform float uRotationAmount;\n" +
    "uniform float uNoiseScale;\n" +
    "uniform float uGrainAmount;\n" +
    "uniform float uGrainScale;\n" +
    "uniform float uGrainAnimated;\n" +
    "uniform float uContrast;\n" +
    "uniform float uGamma;\n" +
    "uniform float uSaturation;\n" +
    "uniform vec2 uCenterOffset;\n" +
    "uniform float uZoom;\n" +
    "uniform vec3 uColor1;\n" +
    "uniform vec3 uColor2;\n" +
    "uniform vec3 uColor3;\n" +
    "out vec4 fragColor;\n" +
    "#define S(a,b,t) smoothstep(a,b,t)\n" +
    "mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}\n" +
    "vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}\n" +
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}\n" +
    "void mainImage(out vec4 o, vec2 C){\n" +
    "  float t=iTime*uTimeSpeed;\n" +
    "  vec2 uv=C/iResolution.xy;\n" +
    "  float ratio=iResolution.x/iResolution.y;\n" +
    "  vec2 tuv=uv-0.5+uCenterOffset;\n" +
    "  tuv/=max(uZoom,0.001);\n" +
    "  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);\n" +
    "  tuv.y*=1.0/ratio;\n" +
    "  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));\n" +
    "  tuv.y*=ratio;\n" +
    "  float frequency=uWarpFrequency;\n" +
    "  float ws=max(uWarpStrength,0.001);\n" +
    "  float amplitude=uWarpAmplitude/ws;\n" +
    "  float warpTime=t*uWarpSpeed;\n" +
    "  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;\n" +
    "  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);\n" +
    "  vec3 colLav=uColor1;\n" +
    "  vec3 colOrg=uColor2;\n" +
    "  vec3 colDark=uColor3;\n" +
    "  float b=uColorBalance;\n" +
    "  float s=max(uBlendSoftness,0.0);\n" +
    "  mat2 blendRot=Rot(radians(uBlendAngle));\n" +
    "  float blendX=(tuv*blendRot).x;\n" +
    "  float edge0=-0.3-b-s;\n" +
    "  float edge1=0.2-b+s;\n" +
    "  float v0=0.5-b+s;\n" +
    "  float v1=-0.3-b-s;\n" +
    "  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));\n" +
    "  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));\n" +
    "  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));\n" +
    "  vec2 grainUv=uv*max(uGrainScale,0.001);\n" +
    "  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}\n" +
    "  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);\n" +
    "  col+=(grain-0.5)*uGrainAmount;\n" +
    "  col=(col-0.5)*uContrast+0.5;\n" +
    "  float luma=dot(col,vec3(0.2126,0.7152,0.0722));\n" +
    "  col=mix(vec3(luma),col,uSaturation);\n" +
    "  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));\n" +
    "  col=clamp(col,0.0,1.0);\n" +
    "  o=vec4(col,1.0);\n" +
    "}\n" +
    "void main(){\n" +
    "  vec4 o=vec4(0.0);\n" +
    "  mainImage(o,gl_FragCoord.xy);\n" +
    "  fragColor=o;\n" +
    "}\n";

  function GrainientHero(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'hero-grainient-canvas';
    this.container.appendChild(this.canvas);

    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.intersectionObserver = null;
    this.resizeObserver = null;
    this.mutationObserver = null;

    this.bounds = { width: 1, height: 1 };
    this.isVisible = true;
    this.isRunning = false;
    this.rafId = 0;
    this.startTime = 0;

    this.options = {
      timeSpeed: readNumber(container.dataset.timeSpeed, 0.18),
      colorBalance: readNumber(container.dataset.colorBalance, 0.02),
      warpStrength: readNumber(container.dataset.warpStrength, 1.1),
      warpFrequency: readNumber(container.dataset.warpFrequency, 4.8),
      warpSpeed: readNumber(container.dataset.warpSpeed, 1.65),
      warpAmplitude: readNumber(container.dataset.warpAmplitude, 54.0),
      blendAngle: readNumber(container.dataset.blendAngle, 4.0),
      blendSoftness: readNumber(container.dataset.blendSoftness, 0.12),
      rotationAmount: readNumber(container.dataset.rotationAmount, 240.0),
      noiseScale: readNumber(container.dataset.noiseScale, 1.4),
      grainAmount: readNumber(container.dataset.grainAmount, 0.08),
      grainScale: readNumber(container.dataset.grainScale, 1.6),
      grainAnimated: readBoolean(container.dataset.grainAnimated, false),
      contrast: readNumber(container.dataset.contrast, 1.18),
      gamma: readNumber(container.dataset.gamma, 1.02),
      saturation: readNumber(container.dataset.saturation, 1.02),
      centerX: readNumber(container.dataset.centerX, 0.0),
      centerY: readNumber(container.dataset.centerY, 0.0),
      zoom: readNumber(container.dataset.zoom, 0.94)
    };

    this.gl = this.canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
      desynchronized: true,
      powerPreference: 'low-power'
    });

    if (!this.gl) {
      this.container.classList.add('is-fallback');
      return;
    }

    try {
      this.setup();
      this.bind();
      this.updateThemeColors();
      this.resize();
      this.renderStatic();
      this.maybeStart();
      this.container.classList.add('is-ready');
    } catch (error) {
      console.error('Grainient init failed:', error);
      this.destroy();
      this.container.classList.add('is-fallback');
    }
  }

  GrainientHero.prototype.setup = function () {
    var gl = this.gl;
    this.program = createProgram(gl, vertexSource, fragmentSource);
    this.uniforms = {
      iResolution: gl.getUniformLocation(this.program, 'iResolution'),
      iTime: gl.getUniformLocation(this.program, 'iTime'),
      uTimeSpeed: gl.getUniformLocation(this.program, 'uTimeSpeed'),
      uColorBalance: gl.getUniformLocation(this.program, 'uColorBalance'),
      uWarpStrength: gl.getUniformLocation(this.program, 'uWarpStrength'),
      uWarpFrequency: gl.getUniformLocation(this.program, 'uWarpFrequency'),
      uWarpSpeed: gl.getUniformLocation(this.program, 'uWarpSpeed'),
      uWarpAmplitude: gl.getUniformLocation(this.program, 'uWarpAmplitude'),
      uBlendAngle: gl.getUniformLocation(this.program, 'uBlendAngle'),
      uBlendSoftness: gl.getUniformLocation(this.program, 'uBlendSoftness'),
      uRotationAmount: gl.getUniformLocation(this.program, 'uRotationAmount'),
      uNoiseScale: gl.getUniformLocation(this.program, 'uNoiseScale'),
      uGrainAmount: gl.getUniformLocation(this.program, 'uGrainAmount'),
      uGrainScale: gl.getUniformLocation(this.program, 'uGrainScale'),
      uGrainAnimated: gl.getUniformLocation(this.program, 'uGrainAnimated'),
      uContrast: gl.getUniformLocation(this.program, 'uContrast'),
      uGamma: gl.getUniformLocation(this.program, 'uGamma'),
      uSaturation: gl.getUniformLocation(this.program, 'uSaturation'),
      uCenterOffset: gl.getUniformLocation(this.program, 'uCenterOffset'),
      uZoom: gl.getUniformLocation(this.program, 'uZoom'),
      uColor1: gl.getUniformLocation(this.program, 'uColor1'),
      uColor2: gl.getUniformLocation(this.program, 'uColor2'),
      uColor3: gl.getUniformLocation(this.program, 'uColor3')
    };

    this.positionLocation = gl.getAttribLocation(this.program, 'position');
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       3, -1,
      -1,  3
    ]), gl.STATIC_DRAW);

    this.applyStaticUniforms();
  };

  GrainientHero.prototype.applyStaticUniforms = function () {
    var gl = this.gl;
    var uniforms = this.uniforms;
    var options = this.options;

    gl.useProgram(this.program);
    gl.uniform1f(uniforms.uTimeSpeed, options.timeSpeed);
    gl.uniform1f(uniforms.uColorBalance, options.colorBalance);
    gl.uniform1f(uniforms.uWarpStrength, options.warpStrength);
    gl.uniform1f(uniforms.uWarpFrequency, options.warpFrequency);
    gl.uniform1f(uniforms.uWarpSpeed, options.warpSpeed);
    gl.uniform1f(uniforms.uWarpAmplitude, options.warpAmplitude);
    gl.uniform1f(uniforms.uBlendAngle, options.blendAngle);
    gl.uniform1f(uniforms.uBlendSoftness, options.blendSoftness);
    gl.uniform1f(uniforms.uRotationAmount, options.rotationAmount);
    gl.uniform1f(uniforms.uNoiseScale, options.noiseScale);
    gl.uniform1f(uniforms.uGrainAmount, options.grainAmount);
    gl.uniform1f(uniforms.uGrainScale, options.grainScale);
    gl.uniform1f(uniforms.uGrainAnimated, options.grainAnimated ? 1.0 : 0.0);
    gl.uniform1f(uniforms.uContrast, options.contrast);
    gl.uniform1f(uniforms.uGamma, options.gamma);
    gl.uniform1f(uniforms.uSaturation, options.saturation);
    gl.uniform2f(uniforms.uCenterOffset, options.centerX, options.centerY);
    gl.uniform1f(uniforms.uZoom, options.zoom);
  };

  GrainientHero.prototype.updateThemeColors = function () {
    if (!this.gl) return;
    var gl = this.gl;
    gl.useProgram(this.program);
    gl.uniform3fv(this.uniforms.uColor1, new Float32Array(hexToRgbArray(cssVar('--grainient-color-1', '#21d4cf'))));
    gl.uniform3fv(this.uniforms.uColor2, new Float32Array(hexToRgbArray(cssVar('--grainient-color-2', '#96928c'))));
    gl.uniform3fv(this.uniforms.uColor3, new Float32Array(hexToRgbArray(cssVar('--grainient-color-3', '#b3192d'))));
  };

  GrainientHero.prototype.getDpr = function () {
    var dpr = window.devicePixelRatio || 1;
    var smallViewport = window.innerWidth < 768;
    var cap = smallViewport ? 1.35 : 1.75;
    return clamp(dpr, 1, cap);
  };

  GrainientHero.prototype.resize = function () {
    if (!this.gl) return;
    var rect = this.container.getBoundingClientRect();
    var cssWidth = Math.max(1, Math.round(rect.width));
    var cssHeight = Math.max(1, Math.round(rect.height));
    var dpr = this.getDpr();
    var width = Math.max(1, Math.round(cssWidth * dpr));
    var height = Math.max(1, Math.round(cssHeight * dpr));

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.width = cssWidth + 'px';
      this.canvas.style.height = cssHeight + 'px';
      this.gl.viewport(0, 0, width, height);
      this.bounds.width = width;
      this.bounds.height = height;
      this.gl.useProgram(this.program);
      this.gl.uniform2f(this.uniforms.iResolution, width, height);
    }
  };

  GrainientHero.prototype.renderFrame = function (elapsedSeconds) {
    if (!this.gl) return;
    var gl = this.gl;
    gl.useProgram(this.program);
    gl.uniform1f(this.uniforms.iTime, elapsedSeconds);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  GrainientHero.prototype.renderStatic = function () {
    this.resize();
    this.renderFrame(0);
  };

  GrainientHero.prototype.tick = function (timestamp) {
    if (!this.isRunning) return;
    if (!this.startTime) this.startTime = timestamp;
    var elapsedSeconds = (timestamp - this.startTime) * 0.001;
    this.resize();
    this.renderFrame(elapsedSeconds);
    this.rafId = window.requestAnimationFrame(this.tick.bind(this));
  };

  GrainientHero.prototype.shouldAnimate = function () {
    return !!this.gl && !this.motionQuery.matches && !document.hidden && this.isVisible;
  };

  GrainientHero.prototype.maybeStart = function () {
    if (!this.shouldAnimate()) {
      this.stop();
      this.renderStatic();
      return;
    }
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = 0;
    this.rafId = window.requestAnimationFrame(this.tick.bind(this));
  };

  GrainientHero.prototype.stop = function () {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId) window.cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  };

  GrainientHero.prototype.bind = function () {
    var self = this;

    this.intersectionObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      self.isVisible = !!(entry && entry.isIntersecting);
      self.maybeStart();
    }, { threshold: 0.08 });
    this.intersectionObserver.observe(this.container);

    this.resizeObserver = new ResizeObserver(function () {
      self.resize();
      if (!self.isRunning) self.renderStatic();
    });
    this.resizeObserver.observe(this.container);

    this.handleVisibilityChange = function () {
      self.maybeStart();
    };
    document.addEventListener('visibilitychange', this.handleVisibilityChange, { passive: true });

    this.handleMotionChange = function () {
      self.maybeStart();
    };
    if (this.motionQuery.addEventListener) {
      this.motionQuery.addEventListener('change', this.handleMotionChange);
    } else if (this.motionQuery.addListener) {
      this.motionQuery.addListener(this.handleMotionChange);
    }

    this.mutationObserver = new MutationObserver(function () {
      self.updateThemeColors();
      if (!self.isRunning) self.renderStatic();
    });
    this.mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    this.handleContextLost = function (event) {
      event.preventDefault();
      self.stop();
      self.container.classList.add('is-fallback');
    };
    this.canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
  };

  GrainientHero.prototype.destroy = function () {
    this.stop();

    if (this.intersectionObserver) this.intersectionObserver.disconnect();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.mutationObserver) this.mutationObserver.disconnect();

    if (this.handleVisibilityChange) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange, { passive: true });
    }

    if (this.handleMotionChange) {
      if (this.motionQuery.addEventListener) {
        this.motionQuery.removeEventListener('change', this.handleMotionChange);
      } else if (this.motionQuery.removeListener) {
        this.motionQuery.removeListener(this.handleMotionChange);
      }
    }

    if (this.canvas && this.handleContextLost) {
      this.canvas.removeEventListener('webglcontextlost', this.handleContextLost, false);
    }

    if (this.gl) {
      if (this.buffer) this.gl.deleteBuffer(this.buffer);
      if (this.program) this.gl.deleteProgram(this.program);
    }

    if (this.canvas && this.canvas.parentNode === this.container) {
      this.container.removeChild(this.canvas);
    }
  };

  function initGrainientHeroes() {
    document.querySelectorAll('[data-grainient]').forEach(function (element) {
      if (element.__grainientHero) return;
      element.__grainientHero = new GrainientHero(element);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrainientHeroes, { once: true });
  } else {
    initGrainientHeroes();
  }
})();

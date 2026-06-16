import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec2 uRes;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = rot * p * 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 centerUv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
    float aspect = uRes.x / uRes.y;
    float t = uTime * 0.055;

    vec2 mouseDelta = centerUv - uMouse;
    float mouseField = exp(-dot(mouseDelta, mouseDelta) * 4.2) * uMouseStrength;

    vec2 p = vec2(uv.x * aspect, uv.y) * 2.1;
    p += mouseDelta * mouseField * 0.38;

    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + t),
      fbm(p + vec2(5.2, 1.3) - t * 0.8)
    );

    vec2 r = vec2(
      fbm(p + 2.6 * q + vec2(1.7, 9.2) + t * 1.4 + mouseField * 0.45),
      fbm(p + 2.6 * q + vec2(8.3, 2.8) - t + mouseField * 0.35)
    );

    float f = fbm(p + 2.2 * r);

    vec3 paper = vec3(0.250, 0.610, 0.900);
    vec3 ink = vec3(0.020, 0.160, 0.480);
    vec3 cobalt = vec3(0.050, 0.430, 0.880);
    vec3 deepBlue = vec3(0.000, 0.250, 0.680);
    vec3 cyan = vec3(0.640, 0.890, 1.000);

    vec3 inkcol = mix(cobalt, deepBlue, clamp(q.x * 1.5, 0.0, 1.0));
    inkcol = mix(inkcol, cyan, clamp(r.y * r.y * 1.4, 0.0, 1.0) * 0.2);
    inkcol = mix(inkcol, ink, smoothstep(0.62, 0.96, f) * 0.62);

    float plume = smoothstep(0.38, 0.80, f * f * 1.7 + 0.35 * r.x);
    float bias = 0.25 + 0.85 * smoothstep(0.0, 1.0, uv.x * 0.75 + uv.y * 0.55);
    vec3 col = mix(paper, inkcol, plume * bias * 0.9);
    col = mix(col, cyan, mouseField * 0.12 * (1.0 - plume * 0.5));

    // subtle dither to avoid banding in dark gradients
    col += (hash(uv * uRes) - 0.5) * 0.016;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function FluidCanvas({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return undefined;
    const host: HTMLDivElement = hostRef.current;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(10, 10) },
      uMouseStrength: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const targetMouse = new THREE.Vector2(10, 10);
    let targetStrength = 0;
    let frame = 0;
    let visible = true;
    let running = false;
    const startTime = performance.now();

    function resize() {
      const { clientHeight, clientWidth } = host;
      renderer.setSize(clientWidth, clientHeight, false);
      uniforms.uRes.value.set(
        clientWidth * renderer.getPixelRatio(),
        clientHeight * renderer.getPixelRatio(),
      );
    }

    function renderFrame() {
      uniforms.uTime.value = (performance.now() - startTime) / 1000;
      uniforms.uMouse.value.lerp(targetMouse, 0.06);
      uniforms.uMouseStrength.value += (targetStrength - uniforms.uMouseStrength.value) * 0.05;
      renderer.render(scene, camera);
    }

    function tick() {
      if (!visible) {
        running = false;
        return;
      }
      renderFrame();
      frame = window.requestAnimationFrame(tick);
    }

    function startLoop() {
      if (running || reducedMotion) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = host.getBoundingClientRect();
      if (rect.bottom < 0) return;
      const minSide = Math.min(rect.width, rect.height);
      targetMouse.set(
        (event.clientX - rect.left - rect.width / 2) / minSide,
        (rect.height / 2 - (event.clientY - rect.top)) / minSide,
      );
      targetStrength = 1;
    }

    function onPointerLeave() {
      targetStrength = 0;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) startLoop();
      },
      { threshold: 0 },
    );
    observer.observe(host);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) renderFrame();
    });
    resizeObserver.observe(host);

    resize();

    if (reducedMotion) {
      uniforms.uTime.value = 18;
      renderer.render(scene, camera);
    } else {
      startLoop();
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      observer.disconnect();
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}

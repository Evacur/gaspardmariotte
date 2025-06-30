"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { urlFor } from "../lib/sanity"
import { motion } from "framer-motion"
import * as THREE from "three"

export type CreationSection = {
  _id: string
  slug: { current: string }
  title: string
  description: string
  image?: any
  order?: number
}

type Props = {
  section: CreationSection
  index: number
  total: number
  filterStrength?: number
  glitchEdges?: boolean
}

interface RippleSetup {
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  renderer: THREE.WebGLRenderer
  material: THREE.ShaderMaterial
}

export default function WavyCreationCard({ section, index, total, filterStrength = 0.7, glitchEdges = false }: Props) {
  const imageUrl = section.image
    ? urlFor(section.image)
        .width(1200)
        .height(1600)
        .fit("crop")
        .auto("format")
        .quality(85)
        .url()
    : null

  const imageMobileUrl = section.image
    ? urlFor(section.image)
        .width(1200)
        .height(1200)
        .fit("crop")
        .auto("format")
        .quality(85)
        .url()
    : null


  // WebGL refs
  const desktopCanvasRef = useRef<HTMLDivElement>(null)
  const mobileCanvasRef = useRef<HTMLDivElement>(null)
  const desktopSetupRef = useRef<RippleSetup>()
  const mobileSetupRef = useRef<RippleSetup>()
  const animationRef = useRef<number>()

  // Setup WebGL effect
  const setupRippleEffect = (container: HTMLDivElement, imageUrl: string): Promise<RippleSetup> => {
  return new Promise((resolve) => {
    // Scene + camera
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Load texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(imageUrl, (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter

      // Aspect ratios
      const imageAspect = texture.image.width / texture.image.height
      const containerAspect = container.offsetWidth / container.offsetHeight

      let planeWidth = 2
      let planeHeight = 2

      // Cover logic: toujours remplir, quitte à cropper
      if (containerAspect > imageAspect) {
        // Container + large que l'image : on crop verticalement
        planeWidth = 2
        planeHeight = (2 / imageAspect) * containerAspect
      } else {
        // Container + haut que l'image : on crop horizontalement
        planeHeight = 2
        planeWidth = (2 * imageAspect) / containerAspect
      }

      // Geometry + mesh
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
          uRipple1: { value: new THREE.Vector3(0.5, 0.5, 0) },
          uRipple2: { value: new THREE.Vector3(0.3, 0.7, 0) },
          uRipple3: { value: new THREE.Vector3(0.7, 0.3, 0) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uTime;
          uniform vec2 uResolution;
          uniform vec3 uRipple1;
          uniform vec3 uRipple2;
          uniform vec3 uRipple3;
          varying vec2 vUv;

          float ripple(vec2 uv, vec3 rippleData) {
            vec2 center = rippleData.xy;
            float time = rippleData.z;
            
            float dist = distance(uv, center);
            float rippleTime = uTime * 1.5 + time;
            
            float wave1 = sin(dist * 25.0 - rippleTime * 3.0) * 0.5 + 0.5;
            float wave2 = sin(dist * 15.0 - rippleTime * 2.0) * 0.5 + 0.5;
            float wave3 = sin(dist * 35.0 - rippleTime * 4.0) * 0.5 + 0.5;
            
            float falloff = 1.0 - smoothstep(0.0, 0.6, dist);
            float timeFalloff = 1.0 - smoothstep(0.0, 8.0, rippleTime);
            
            return (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3) * falloff * timeFalloff;
          }

          void main() {
            vec2 uv = vUv;

            float ripple1Effect = ripple(uv, uRipple1);
            float ripple2Effect = ripple(uv, uRipple2);
            float ripple3Effect = ripple(uv, uRipple3);

            float totalRipple = ripple1Effect + ripple2Effect + ripple3Effect;

            float baseWave = sin(uv.x * 8.0 + uTime * 0.4) * sin(uv.y * 6.0 + uTime * 0.3) * 0.015;
            vec2 distortedUV = uv + vec2(
              sin(uv.y * 12.0 + uTime * 0.6) * 0.004,
              cos(uv.x * 10.0 + uTime * 0.5) * 0.004
            );
            distortedUV += (totalRipple + baseWave) * 0.015;

            vec4 color = texture2D(uTexture, distortedUV);

            float shimmer = sin(uv.x * 40.0 + uTime * 1.5) * sin(uv.y * 25.0 + uTime * 1.2) * 0.08;
            color.rgb += shimmer * 0.08;
            color.rgb += totalRipple * 0.08;

            gl_FragColor = color;
          }
        `,
      })

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      resolve({ scene, camera, renderer, material })
    })
  })
}


  useEffect(() => {
  if (!imageUrl || !imageMobileUrl) return

  let animationId: number

  const initializeEffects = async () => {
    try {
      if (desktopCanvasRef.current) {
        desktopSetupRef.current = await setupRippleEffect(desktopCanvasRef.current, imageUrl)
      }
      if (mobileCanvasRef.current) {
        mobileSetupRef.current = await setupRippleEffect(mobileCanvasRef.current, imageMobileUrl)
      }

      const animate = () => {
        const time = performance.now() * 0.001

        const updateMaterial = (setup?: RippleSetup) => {
          if (!setup) return
          const { material, renderer, scene, camera } = setup
          material.uniforms.uTime.value = time

          material.uniforms.uRipple1.value.z = Math.sin(time * 0.3) * 4.0
          material.uniforms.uRipple2.value.z = Math.sin(time * 0.4 + 1.0) * 4.0
          material.uniforms.uRipple3.value.z = Math.sin(time * 0.5 + 2.0) * 4.0

          material.uniforms.uRipple1.value.x = 0.5 + Math.sin(time * 0.08) * 0.15
          material.uniforms.uRipple1.value.y = 0.5 + Math.cos(time * 0.12) * 0.15

          material.uniforms.uRipple2.value.x = 0.3 + Math.sin(time * 0.1 + 1.0) * 0.12
          material.uniforms.uRipple2.value.y = 0.7 + Math.cos(time * 0.15 + 1.0) * 0.12

          material.uniforms.uRipple3.value.x = 0.7 + Math.sin(time * 0.06 + 2.0) * 0.18
          material.uniforms.uRipple3.value.y = 0.3 + Math.cos(time * 0.11 + 2.0) * 0.18

          renderer.render(scene, camera)
        }

        updateMaterial(desktopSetupRef.current)
        updateMaterial(mobileSetupRef.current)

        animationId = requestAnimationFrame(animate)
      }

      animate()
    } catch (error) {
      console.error("Error initializing ripple effects:", error)
    }
  }

  initializeEffects()

  const handleResize = () => {
    const updateSize = (setup?: RippleSetup, container?: HTMLDivElement) => {
      if (!setup || !container) return
      const width = container.offsetWidth
      const height = container.offsetHeight
      if (width === 0 || height === 0) return
      setup.renderer.setSize(width, height)
      setup.material.uniforms.uResolution.value.set(width, height)
    }

    updateSize(desktopSetupRef.current, desktopCanvasRef.current!)
    updateSize(mobileSetupRef.current, mobileCanvasRef.current!)
  }

  window.addEventListener("resize", handleResize)

  return () => {
    window.removeEventListener("resize", handleResize)
    if (animationId) cancelAnimationFrame(animationId)

    // Cleanup desktop
    if (desktopSetupRef.current && desktopCanvasRef.current) {
      desktopCanvasRef.current.innerHTML = ""
      desktopSetupRef.current.renderer.dispose()
      desktopSetupRef.current = undefined
    }

    // Cleanup mobile
    if (mobileSetupRef.current && mobileCanvasRef.current) {
      mobileCanvasRef.current.innerHTML = ""
      mobileSetupRef.current.renderer.dispose()
      mobileSetupRef.current = undefined
    }
  }
}, [imageUrl, imageMobileUrl])


  // Animated Letters
  function AnimatedLetters({ text }: { text: string }) {
    return (
      <span className="inline-block">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 1,
              delay: i * 0.02,
            }}
            viewport={{ once: true, amount: 0.7 }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    )
  }

  return (
    <Link key={section._id} href={`/creation/${section.slug.current}`} className="block group w-full">
      {/* DESKTOP + TABLET */}
      <div className="hidden md:flex flex-col items-center justify-center h-screen w-full snap-start relative overflow-hidden">
        {/* Background with WebGL Ripple Effect */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div ref={desktopCanvasRef} className="w-full h-full opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40 transition-all duration-500" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center gap-0 px-6 max-w-6xl">
          <span className="text-[16px] font-medium mb-4 text-white/70 hidden sm:inline tracking-wider">
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
          <h2 className="text-[150px] xl:text-[150px] font-bold font-clash leading-[0.85] text-white text-center">
            <AnimatedLetters text={section.title} />
          </h2>
          <p className="text-[20px] font-light text-white/90 text-center mt-6 hidden sm:block max-w-3xl leading-relaxed">
            {section.description}
          </p>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden w-full px-4 mb-6">
        <div className="relative h-[600px] w-full overflow-hidden rounded-lg">
          <div ref={mobileCanvasRef} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 transition-all duration-500 z-10" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-6">
            <h2 className="text-[40px] sm:text-[70px] font-clash font-bold leading-[0.85] mb-4 relative">
              <span className="relative z-10">{section.title}</span>
            </h2>
            <p className="text-[24px] font-light text-white/90 max-w-sm leading-relaxed">{section.description}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

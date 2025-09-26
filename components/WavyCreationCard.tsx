"use client"

import { useRef, useEffect, useState, useCallback } from "react"
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
  mousePosition: THREE.Vector2
  isHovered: boolean
}

export default function WavyCreationCard({ section, index, total, filterStrength = 0.7, glitchEdges = false }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  
  const imageUrl = section.image
    ? urlFor(section.image)
      .width(2400)
      .height(3200)
      .fit("crop")
      .auto("format")
      .quality(90)
      .url()
    : null

  const imageMobileUrl = section.image
    ? urlFor(section.image)
      .width(1600)
      .height(1600)
      .fit("crop")
      .auto("format")
      .quality(90)
      .url()
    : null

  const desktopCanvasRef = useRef<HTMLDivElement>(null)
  const mobileCanvasRef = useRef<HTMLDivElement>(null)
  const desktopSetupRef = useRef<RippleSetup>()
  const mobileSetupRef = useRef<RippleSetup>()
  const animationRef = useRef<number>()

  // Gestionnaires d'événements pour les interactions
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    setMousePosition({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const setupRippleEffect = (container: HTMLDivElement, imageUrl: string): Promise<RippleSetup> => {
    return new Promise((resolve) => {
      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(container.offsetWidth, container.offsetHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      container.appendChild(renderer.domElement)

      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(imageUrl, (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.minFilter = THREE.LinearMipMapLinearFilter
        texture.magFilter = THREE.LinearFilter


        const imageAspect = texture.image.width / texture.image.height
        const containerAspect = container.offsetWidth / container.offsetHeight

        let planeWidth = 2
        let planeHeight = 2

        if (containerAspect > imageAspect) {
          planeWidth = 2
          planeHeight = (2 / imageAspect) * containerAspect
        } else {
          planeHeight = 2
          planeWidth = (2 * imageAspect) / containerAspect
        }

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
            uRipple1: { value: new THREE.Vector3(0.5, 0.5, 0) },
            uRipple2: { value: new THREE.Vector3(0.3, 0.7, 0) },
            uRipple3: { value: new THREE.Vector3(0.7, 0.3, 0) },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uHover: { value: 0.0 },
            uIntensity: { value: 1.0 },
            uSpeed: { value: 1.0 },
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
          uniform vec2 uMouse;
          uniform float uHover;
          uniform float uIntensity;
          uniform float uSpeed;
          varying vec2 vUv;

          // Fonction de bruit améliorée
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }

          // Fonction d'ondulation améliorée avec plus de détails
          float ripple(vec2 uv, vec3 rippleData) {
            vec2 center = rippleData.xy;
            float time = rippleData.z;
            
            float dist = distance(uv, center);
            float rippleTime = uTime * uSpeed + time;
            
            // Ondes multiples avec différentes fréquences
            float wave1 = sin(dist * 20.0 - rippleTime * 2.5) * 0.5 + 0.5;
            float wave2 = sin(dist * 12.0 - rippleTime * 1.8) * 0.5 + 0.5;
            float wave3 = sin(dist * 30.0 - rippleTime * 3.2) * 0.5 + 0.5;
            float wave4 = sin(dist * 8.0 - rippleTime * 1.2) * 0.5 + 0.5;
            
            // Falloff plus doux et réaliste
            float falloff = 1.0 - smoothstep(0.0, 0.8, dist);
            float timeFalloff = 1.0 - smoothstep(0.0, 12.0, rippleTime);
            
            // Combinaison des ondes avec pondération
            float combinedWave = (wave1 * 0.3 + wave2 * 0.25 + wave3 * 0.25 + wave4 * 0.2);
            
            return combinedWave * falloff * timeFalloff * uIntensity;
          }

          // Effet de distorsion basé sur la souris
          vec2 mouseDistortion(vec2 uv) {
            vec2 mouseInfluence = (uMouse - uv) * uHover;
            float mouseDist = length(mouseInfluence);
            float mouseEffect = 1.0 - smoothstep(0.0, 0.3, mouseDist);
            
            return mouseInfluence * mouseEffect * 0.02;
          }

          void main() {
            vec2 uv = vUv;

            // Effets d'ondulation existants
            float ripple1Effect = ripple(uv, uRipple1);
            float ripple2Effect = ripple(uv, uRipple2);
            float ripple3Effect = ripple(uv, uRipple3);

            // Ondulation basée sur la souris
            float mouseRipple = 0.0;
            if (uHover > 0.0) {
              float mouseDist = distance(uv, uMouse);
              mouseRipple = sin(mouseDist * 15.0 - uTime * 4.0) * 0.5 + 0.5;
              mouseRipple *= (1.0 - smoothstep(0.0, 0.4, mouseDist)) * uHover;
            }

            float totalRipple = ripple1Effect + ripple2Effect + ripple3Effect + mouseRipple;

            // Ondes de base plus subtiles
            float baseWave = sin(uv.x * 6.0 + uTime * 0.3) * sin(uv.y * 4.0 + uTime * 0.2) * 0.008;
            
            // Distorsion améliorée
            vec2 distortedUV = uv + vec2(
              sin(uv.y * 8.0 + uTime * 0.4) * 0.003,
              cos(uv.x * 6.0 + uTime * 0.35) * 0.003
            );
            
            // Ajout de l'effet de souris
            distortedUV += mouseDistortion(uv);
            distortedUV += (totalRipple + baseWave) * 0.012;

            // Échantillonnage de texture avec interpolation
            vec4 color = texture2D(uTexture, distortedUV);

            // Effet de scintillement amélioré
            float shimmer = sin(uv.x * 30.0 + uTime * 1.2) * sin(uv.y * 20.0 + uTime * 0.9) * 0.06;
            shimmer += noise(uv * 50.0 + uTime * 0.5) * 0.02;
            
            // Effet de profondeur basé sur les ondulations
            float depthEffect = totalRipple * 0.15;
            
            // Amélioration des couleurs
            color.rgb += shimmer * 0.06;
            color.rgb += depthEffect;
            
            // Effet de contraste dynamique
            float contrast = 1.0 + totalRipple * 0.1;
            color.rgb = (color.rgb - 0.5) * contrast + 0.5;
            
            // Effet de saturation
            float saturation = 1.0 + totalRipple * 0.05;
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            color.rgb = mix(vec3(gray), color.rgb, saturation);

            gl_FragColor = color;
          }
        `,
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        resolve({ 
          scene, 
          camera, 
          renderer, 
          material, 
          mousePosition: new THREE.Vector2(0.5, 0.5),
          isHovered: false
        })
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
          const rawTime = performance.now() * 0.001
          const isMobile = window.innerWidth < 600
          const time = isMobile ? rawTime * 1.1 : rawTime

          const updateMaterial = (setup?: RippleSetup) => {
            if (!setup) return
            const { material, renderer, scene, camera } = setup
            material.uniforms.uTime.value = time

            // Mise à jour des ondulations existantes avec des mouvements plus fluides
            material.uniforms.uRipple1.value.z = Math.sin(time * 0.25) * 3.5
            material.uniforms.uRipple2.value.z = Math.sin(time * 0.35 + 1.2) * 3.5
            material.uniforms.uRipple3.value.z = Math.sin(time * 0.45 + 2.4) * 3.5

            // Mouvements plus organiques des centres d'ondulation
            material.uniforms.uRipple1.value.x = 0.5 + Math.sin(time * 0.06) * 0.12
            material.uniforms.uRipple1.value.y = 0.5 + Math.cos(time * 0.09) * 0.12

            material.uniforms.uRipple2.value.x = 0.3 + Math.sin(time * 0.08 + 1.0) * 0.1
            material.uniforms.uRipple2.value.y = 0.7 + Math.cos(time * 0.12 + 1.0) * 0.1

            material.uniforms.uRipple3.value.x = 0.7 + Math.sin(time * 0.05 + 2.0) * 0.15
            material.uniforms.uRipple3.value.y = 0.3 + Math.cos(time * 0.08 + 2.0) * 0.15

            // Mise à jour des nouvelles propriétés
            material.uniforms.uMouse.value.set(mousePosition.x, mousePosition.y)
            material.uniforms.uHover.value = isHovered ? 1.0 : 0.0
            material.uniforms.uIntensity.value = isHovered ? 1.5 : 1.0
            material.uniforms.uSpeed.value = isHovered ? 1.3 : 1.0

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

      if (desktopSetupRef.current && desktopCanvasRef.current) {
        desktopCanvasRef.current.innerHTML = ""
        desktopSetupRef.current.renderer.dispose()
        desktopSetupRef.current = undefined
      }

      if (mobileSetupRef.current && mobileCanvasRef.current) {
        mobileCanvasRef.current.innerHTML = ""
        mobileSetupRef.current.renderer.dispose()
        mobileSetupRef.current = undefined
      }
    }
  }, [imageUrl, imageMobileUrl, mousePosition, isHovered])


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
      <div 
        className="hidden md:flex flex-col items-center justify-center h-screen w-full snap-start relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 w-full h-full z-0">
          <div ref={desktopCanvasRef} className="w-full h-full opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40 transition-all duration-500 group-hover:from-black/5 group-hover:via-black/15 group-hover:to-black/30" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-0 px-6 max-w-6xl transition-all duration-500 group-hover:scale-105">
          <span className="text-[16px] font-medium mb-4 text-white/70 hidden sm:inline tracking-wider transition-all duration-300 group-hover:text-white/90">
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
          <h2 className="text-[150px] xl:text-[150px] font-bold font-clash leading-[0.85] text-white text-center transition-all duration-500 group-hover:drop-shadow-2xl">
            <AnimatedLetters text={section.title} />
          </h2>
          <p className="text-[20px] font-light text-white/90 text-center mt-6 hidden sm:block max-w-3xl leading-relaxed transition-all duration-300 group-hover:text-white">
            {section.description}
          </p>
        </div>
      </div>

      <div className="md:hidden w-full px-4 mb-6">
        <div 
          className="relative h-[600px] w-full overflow-hidden rounded-lg group"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={mobileCanvasRef} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 transition-all duration-500 z-10 group-hover:from-black/50 group-hover:via-black/25 group-hover:to-black/5" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-6 transition-all duration-500 group-hover:scale-105">
            <h2 className="text-[40px] sm:text-[70px] font-clash font-bold leading-[0.85] mb-4 relative transition-all duration-300 group-hover:drop-shadow-xl">
              <span className="relative z-10">{section.title}</span>
            </h2>
            <p className="text-[24px] font-light text-white/90 max-w-sm leading-relaxed transition-all duration-300 group-hover:text-white">{section.description}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

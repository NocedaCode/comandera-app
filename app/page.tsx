'use client'

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!buttonsRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    gsap.set([containerRef.current, logoRef.current, titleRef.current, subtitleRef.current, buttonsRef.current.children], {
      autoAlpha: 1
    });

    tl.from(containerRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.8,
    })
    .from(logoRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
    }, '-=0.4')
    .from(titleRef.current, {
      y: 15,
      opacity: 0,
      duration: 0.5,
    }, '-=0.3')
    .from(subtitleRef.current, {
      y: 10,
      opacity: 0,
      duration: 0.5,
    }, '-=0.3')
    .from(buttonsRef.current.children, {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
    }, '-=0.2');
  }, { scope: containerRef });

  return (
    <div className="min-h-screen text-neutral-100 flex flex-col items-center justify-center p-6 text-center relative z-10">
      
      {/* Contenedor principal con efecto 3D Glassmorphism */}
      <div 
        ref={containerRef}
        className="max-w-md w-full relative bg-gradient-to-b from-neutral-900/80 via-neutral-900/90 to-neutral-950/90 
                   border border-amber-500/30 border-t-amber-400/50 rounded-3xl p-8 
                   shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(217,119,6,0.12)] 
                   backdrop-blur-xl opacity-100 transition-all duration-300"
      >
        
        {/* Logo del Restaurante */}
        <div ref={logoRef} className="flex justify-center mb-4">
          <Image 
            src="/favicon.ico" 
            alt="El Cordón y La Rosa Logo" 
            width={72} 
            height={72} 
            className="w-18 h-18 object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"
            priority
          />
        </div>

        <h1 ref={titleRef} className="text-3xl font-extrabold tracking-wide text-amber-400 mb-2 font-serif">
          El Cordón y La Rosa
        </h1>
        <p ref={subtitleRef} className="text-xs tracking-widest text-neutral-400 uppercase mb-8 border-b border-amber-500/20 pb-4">
          Sistema Gastro Elegance
        </p>

        {/* Botones principales */}
        <div ref={buttonsRef} className="flex flex-col gap-3.5">
          
          {/* Botón: Modo Camarero */}
          <Link 
            href="/camarero"
            className="group relative overflow-hidden w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-black py-4 px-5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all duration-300 transform active:scale-95 flex items-center justify-between border border-amber-300/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 p-2 bg-neutral-950/20 rounded-2xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <Image src="/iconos/camarero.png" alt="Camarero" width={36} height={36} className="w-9 h-9 object-contain" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black leading-none">Modo Camarero</p>
                <p className="text-[10px] text-neutral-900/80 font-bold uppercase tracking-wider mt-1">Toma de comandas</p>
              </div>
            </div>
            <span className="text-neutral-950 font-black text-lg group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          {/* Botón: Modo Cocina */}
          <Link 
            href="/cocina"
            className="group relative overflow-hidden w-full bg-neutral-800/90 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 hover:border-amber-400/80 font-bold py-4 px-5 rounded-2xl shadow-md transition-all duration-300 transform active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 p-2 bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-amber-500/20 flex items-center justify-center">
                <Image src="/iconos/chef.png" alt="Cocina" width={36} height={36} className="w-9 h-9 object-contain" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">Modo Cocina</p>
                <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1">Comandera en vivo</p>
              </div>
            </div>
            <span className="text-amber-400/60 group-hover:text-amber-400 font-bold text-lg group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          {/* Botón: Pantalla Pública (TV) */}
          <Link 
            href="/pantalla"
            className="group relative overflow-hidden w-full bg-neutral-900 hover:bg-neutral-850 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400/80 font-bold py-4 px-5 rounded-2xl shadow-md transition-all duration-300 transform active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 p-2 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20 flex items-center justify-center">
                <Image src="/iconos/tv.png" alt="Pantalla" width={36} height={36} className="w-9 h-9 object-contain" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors">Pantalla Pública (TV)</p>
                <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-1">Vista para clientes</p>
              </div>
            </div>
            <span className="text-emerald-400/60 group-hover:text-emerald-400 font-bold text-lg group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          {/* Botón Destacado: Cierre & Totales (Administración) */}
          <div className="pt-2 border-t border-amber-500/10 mt-1">
            <Link 
              href="/resumen"
              className="group relative overflow-hidden w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 hover:from-amber-950/40 hover:to-neutral-900 border border-amber-500/40 hover:border-amber-400 text-amber-400 font-bold py-3.5 px-5 rounded-2xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 p-2 bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-amber-500/30 flex items-center justify-center">
                  <Image src="/iconos/caja.png" alt="Caja" width={36} height={36} className="w-9 h-9 object-contain" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black tracking-wider uppercase text-amber-400 group-hover:text-amber-300">Cierre & Totales</p>
                  <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest mt-0.5">Módulo de Administración</p>
                </div>
              </div>
              <span className="text-amber-400 font-bold text-sm bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 group-hover:bg-amber-500/20 transition-all">
                🔒 PIN
              </span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

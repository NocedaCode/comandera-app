import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="max-w-md w-full bg-neutral-900/80 border border-amber-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-sm gold-border-glow">
        
        <div className="text-5xl mb-3 animate-bounce">🌹</div>

        <h1 className="text-3xl font-extrabold tracking-wide text-amber-400 mb-2 font-serif">
          El Cordón y La Rosa
        </h1>
        <p className="text-xs tracking-widest text-neutral-400 uppercase mb-8 border-b border-amber-500/20 pb-4">
          Sistema Gastro Elegance
        </p>

        <div className="flex flex-col gap-3">
          <Link 
            href="/camarero"
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>📝</span> Modo Camarero
          </Link>

          <Link 
            href="/cocina"
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/40 font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>👨‍🍳</span> Modo Cocina
          </Link>

          <Link 
            href="/pantalla"
            target="_blank"
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/40 font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>📺</span> Pantalla Pública (TV)
          </Link>

          <Link 
            href="/resumen"
            className="w-full text-neutral-400 hover:text-amber-400 text-xs tracking-wider uppercase pt-2 transition-colors duration-200"
          >
            📊 Ver Cierre & Totales
          </Link>
        </div>

      </div>
    </div>
  );
}
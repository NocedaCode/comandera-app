'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ProteccionPin({ children, titulo, pinPersonalizado = '1234' }) {
  // Inicializamos de forma segura en una sola pasada sin useEffect
  const [autenticado, setAutenticado] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(`acceso_${titulo}_autorizado`) === 'true'
    }
    return false
  })

  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const verificarPin = (e) => {
    e.preventDefault()
    if (pin === pinPersonalizado) {
      sessionStorage.setItem(`acceso_${titulo}_autorizado`, 'true')
      setAutenticado(true)
      setError(false)
    } else {
      setError(true)
      setPin('')
    }
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-md">
          
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl font-black uppercase text-amber-400 mb-1 font-serif">Área Restringida</h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-6">Módulo: {titulo}</p>

          <form onSubmit={verificarPin} className="space-y-4">
            <div>
              <label className="input-label">Ingresa el PIN de acceso</label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="input-field text-center text-2xl tracking-widest font-black text-amber-400"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-bold uppercase">PIN incorrecto. Inténtalo de nuevo.</p>
            )}

            <button type="submit" className="btn-primario py-3.5 text-xs">
              Acceder al Módulo
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-800">
            <Link href="/" className="text-neutral-400 hover:text-amber-400 text-xs font-bold uppercase tracking-wider">
              ← Volver al Inicio
            </Link>
          </div>

        </div>
      </div>
    )
  }

  return <>{children}</>
}
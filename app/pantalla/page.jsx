'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function PantallaPublicaPage() {
  const [pedidos, setPedidos] = useState([])

  const cargarPedidos = async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('id, mesa, tipo_servicio, estado, items, created_at')
      .neq('estado', 'entregado')
      .neq('estado', 'archivado')
      .order('created_at', { ascending: true })

    if (!error && data) {
      setPedidos(data)
    }
  }

  useEffect(() => {
    let montado = true

    const inicializar = async () => {
      const { data, error } = await supabase
        .from('pedidos')
        .select('id, mesa, tipo_servicio, estado, items, created_at')
        .neq('estado', 'entregado')
        .neq('estado', 'archivado')
        .order('created_at', { ascending: true })

      if (montado && !error && data) {
        setPedidos(data)
      }
    }

    // Diferimos la carga inicial al siguiente tick
    Promise.resolve().then(inicializar)

    const canal = supabase
      .channel('pantalla-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos' },
        () => {
          cargarPedidos()
        }
      )
      .subscribe()

    return () => {
      montado = false
      if (canal) supabase.removeChannel(canal)
    }
  }, [])

  // Clasificamos las comandas según su estado
  const enEspera = pedidos.filter((p) => p.estado === 'pendiente')
  const enPreparacion = pedidos.filter((p) => p.estado === 'en_preparacion')
  const listos = pedidos.filter((p) => p.estado === 'listo')

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10 flex flex-col justify-between">
      <header className="text-center mb-8 pb-4 border-b border-neutral-800">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-amber-400">
          Estado de Comandas
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base mt-2">
          Síguelo en pantalla en tiempo real
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
        {/* Columna: En Espera */}
        <section className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 flex flex-col">
          <h2 className="text-xl font-black text-amber-500 uppercase tracking-widest text-center mb-6 pb-3 border-b border-neutral-800">
            ⏳ En Espera
          </h2>
          <div className="space-y-4 flex-1">
            {enEspera.map((p) => (
              <div key={p.id} className="bg-neutral-800/80 p-4 rounded-2xl flex justify-between items-center border border-neutral-700/50">
                <span className="text-2xl font-black text-white">{p.mesa}</span>
                <span className="text-xs uppercase font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {p.tipo_servicio}
                </span>
              </div>
            ))}
            {enEspera.length === 0 && (
              <p className="text-center text-neutral-600 font-bold uppercase text-xs my-auto">Sin pedidos</p>
            )}
          </div>
        </section>

        {/* Columna: En Preparación */}
        <section className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 flex flex-col">
          <h2 className="text-xl font-black text-blue-400 uppercase tracking-widest text-center mb-6 pb-3 border-b border-neutral-800">
            🍳 En Preparación
          </h2>
          <div className="space-y-4 flex-1">
            {enPreparacion.map((p) => (
              <div key={p.id} className="bg-neutral-800/80 p-4 rounded-2xl flex justify-between items-center border border-neutral-700/50">
                <span className="text-2xl font-black text-white">{p.mesa}</span>
                <span className="text-xs uppercase font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  {p.tipo_servicio}
                </span>
              </div>
            ))}
            {enPreparacion.length === 0 && (
              <p className="text-center text-neutral-600 font-bold uppercase text-xs my-auto">Sin pedidos</p>
            )}
          </div>
        </section>

        {/* Columna: Listos */}
        <section className="bg-neutral-900/60 border border-emerald-900/40 rounded-3xl p-6 flex flex-col">
          <h2 className="text-xl font-black text-emerald-400 uppercase tracking-widest text-center mb-6 pb-3 border-b border-neutral-800">
            ✅ ¡Listo!
          </h2>
          <div className="space-y-4 flex-1">
            {listos.map((p) => (
              <div key={p.id} className="bg-emerald-950/40 p-4 rounded-2xl flex justify-between items-center border border-emerald-500/40 animate-pulse">
                <span className="text-2xl font-black text-emerald-300">{p.mesa}</span>
                <span className="text-xs uppercase font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  ¡Retirar!
                </span>
              </div>
            ))}
            {listos.length === 0 && (
              <p className="text-center text-neutral-600 font-bold uppercase text-xs my-auto">Sin pedidos</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
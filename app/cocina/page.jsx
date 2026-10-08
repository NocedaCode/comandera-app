'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function CocinaPage() {
  const [pedidos, setPedidos] = useState([])
  const [sonidoHabilitado, setSonidoHabilitado] = useState(false)
  const audioRef = useRef(null)
  
  // Guardamos el estado del sonido en un ref para no reiniciar suscripciones realtime
  const sonidoRef = useRef(sonidoHabilitado)
  useEffect(() => {
    sonidoRef.current = sonidoHabilitado
  }, [sonidoHabilitado])

  const toggleSonido = () => {
    if (!sonidoHabilitado) {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
          setSonidoHabilitado(true)
        }).catch((err) => console.error('Error al reproducir audio:', err))
      }
    } else {
      setSonidoHabilitado(false)
    }
  }

  const reproducirAlerta = () => {
    if (sonidoRef.current && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => console.warn('Error al reproducir audio:', err))
    }
  }

  const cargarPedidos = async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
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
        .select('*')
        .neq('estado', 'entregado')
        .neq('estado', 'archivado')
        .order('created_at', { ascending: true })

      if (montado && !error && data) {
        setPedidos(data)
      }
    }

    // Diferimos la carga inicial al siguiente tick para no bloquear la fase síncrona
    Promise.resolve().then(inicializar)

    const canal = supabase
      .channel('cocina-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pedidos' },
        () => {
          reproducirAlerta()
          cargarPedidos()
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'pedidos' },
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

  const cambiarEstado = async (id, nuevoEstado) => {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    if (error) alert('Error al actualizar la comanda: ' + error.message)
  }

  return (
    <div className="page-container-wide">
      <audio ref={audioRef} src="/Notificacion.mp3" preload="auto" />

      <header className="mb-8 text-center border-b border-neutral-800 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="header-title !text-left">Comandera de Cocina</h1>
          <p className="header-subtitle !text-left">Gestión en Tiempo Real</p>
        </div>

        <button
          onClick={toggleSonido}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-all flex items-center gap-2 border ${
            sonidoHabilitado
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
              : 'bg-red-500/20 text-red-400 border-red-500/40 shadow-lg shadow-red-500/10'
          }`}
        >
          <span>{sonidoHabilitado ? '🔔' : '🔕'}</span>
          <span>{sonidoHabilitado ? 'Sonido Activado' : 'Activar Sonido'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="card-panel flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-800">
                <span className="text-xl font-bold text-amber-300">{pedido.mesa}</span>
                <span className="px-3 py-1 text-[10px] font-black uppercase rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {pedido.tipo_servicio}
                </span>
              </div>

              <div className="space-y-3">
                {pedido.items?.map((item, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="text-amber-400 font-black mr-2">{item.cantidad}x</span>
                    <span className="text-zinc-200">{item.nombre}</span>
                    {item.notas && <p className="text-[11px] text-amber-300/80 italic mt-1">Nota: {item.notas}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-neutral-800 flex flex-col gap-2">
              {pedido.estado === 'pendiente' && (
                <button 
                  onClick={() => cambiarEstado(pedido.id, 'en_preparacion')} 
                  className="btn-secundario py-3 text-xs border-amber-500/60 text-amber-300"
                >
                  🍳 EMPEZAR PREPARACIÓN
                </button>
              )}

              {pedido.estado === 'en_preparacion' && (
                <button 
                  onClick={() => cambiarEstado(pedido.id, 'listo')} 
                  className="btn-whatsapp py-3.5 text-xs"
                >
                  ✅ MARCAR COMO LISTO
                </button>
              )}

              {pedido.estado === 'listo' && (
                <button 
                  onClick={() => cambiarEstado(pedido.id, 'entregado')} 
                  className="btn-secundario py-3.5 text-xs opacity-80"
                >
                  📦 ENTREGAR Y ARCHIVAR
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {pedidos.length === 0 && (
        <div className="text-center py-20 text-neutral-500 text-xs font-black tracking-widest uppercase">
          NO HAY COMANDAS PENDIENTES
        </div>
      )}
    </div>
  )
}
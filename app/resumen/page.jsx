'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResumenPage() {
  const [totalVentas, setTotalVentas] = useState(0)
  const [totalPedidos, setTotalPedidos] = useState(0)
  const [tasaDolar, setTasaDolar] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tasa_dolar_bs') || '1.00'
    }
    return '1.00'
  })
  const [cargando, setCargando] = useState(true)

  const guardarTasa = (valor) => {
    setTasaDolar(valor)
    localStorage.setItem('tasa_dolar_bs', valor)
  }

  // Función reutilizable solo para eventos de usuario (botones)
  const obtenerTotales = async () => {
    setCargando(true)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('pedidos')
      .select('total')
      .gte('created_at', hoy.toISOString())
      .neq('estado', 'archivado')

    if (!error && data) {
      setTotalPedidos(data.length)
      const suma = data.reduce((acc, p) => acc + (Number(p.total) || 0), 0)
      setTotalVentas(suma)
    }
    setCargando(false)
  }

  // EFECTO DE CARGA INICIAL
  // Se usa un microtask (Promise.resolve) para desacoplar el fetch de la fase síncrona del render
  useEffect(() => {
    let montado = true

    const cargar = async () => {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('pedidos')
        .select('total')
        .gte('created_at', hoy.toISOString())
        .neq('estado', 'archivado')

      if (montado) {
        if (!error && data) {
          setTotalPedidos(data.length)
          const suma = data.reduce((acc, p) => acc + (Number(p.total) || 0), 0)
          setTotalVentas(suma)
        }
        setCargando(false)
      }
    }

    // Diferimos la ejecución asíncrona al siguiente tick
    Promise.resolve().then(cargar)

    return () => {
      montado = false
    }
  }, [])

  const valorTasaNum = parseFloat(tasaDolar) || 0
  const totalEnBs = totalVentas * valorTasaNum

  const cerrarJornadaYEnviarWhatsApp = async () => {
    if (totalPedidos === 0 && totalVentas === 0) {
      alert("No hay comandas activas registradas para cerrar.")
      return
    }

    const confirmar = confirm(
      `CONFIRMACIÓN DE CIERRE DE JORNADA\n\nComandas procesadas: ${totalPedidos}\nTotal USD: $${totalVentas.toFixed(2)}\nTotal Bs: Bs. ${totalEnBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTasa utilizada: ${valorTasaNum} Bs/$\n\n¿Deseas cerrar la jornada y abrir WhatsApp?`
    )
    if (!confirmar) return

    const hoyStr = new Date().toLocaleDateString('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    const mensaje = `REPORTE DE CIERRE DE CAJA\nFecha: ${hoyStr}\nTasa del Día: ${valorTasaNum.toFixed(2)} Bs/$\n-----------------------------------\nComandas Atendidas: ${totalPedidos}\nTotal Ganado (USD): $${totalVentas.toFixed(2)}\nTotal Ganado (Bs): Bs. ${totalEnBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n-----------------------------------\nJornada Finalizada Exitosamente.`

    const urlWhatsApp = `https://wa.me/584246172567?text=${encodeURIComponent(mensaje)}`

    const { error } = await supabase
      .from('pedidos')
      .update({ estado: 'archivado' })
      .neq('estado', 'archivado')

    if (error) {
      alert("Error al archivar las comandas: " + error.message)
    } else {
      window.open(urlWhatsApp, '_blank')
      await obtenerTotales()
      alert("Jornada cerrada con éxito.")
    }
  }

  return (
    <div className="page-container flex flex-col justify-center min-h-screen pb-12">
      <h1 className="header-title">Cierre de Caja</h1>
      <p className="header-subtitle mb-6">Resumen Diario de Ventas</p>

      {/* Ajuste de Tasa de Cambio */}
      <div className="card-panel mb-6">
        <label className="input-label">Tasa del Dólar del Día (Bs/$)</label>
        <input
          type="number"
          step="0.01"
          placeholder="Ej: 36.50"
          value={tasaDolar}
          onChange={(e) => guardarTasa(e.target.value)}
          className="input-field text-center font-bold text-amber-400 text-lg"
        />
      </div>

      <div className="card-panel mb-8 text-center space-y-6">
        <div>
          <p className="input-label">Comandas Atendidas Hoy</p>
          <p className="text-4xl font-black text-white">
            {cargando ? "..." : totalPedidos}
          </p>
        </div>
        
        <div className="border-t border-neutral-800 pt-4">
          <p className="input-label">Total Ganado (USD)</p>
          <p className="text-4xl font-black text-amber-400">
            ${cargando ? "..." : totalVentas.toFixed(2)}
          </p>
        </div>

        <div className="border-t border-neutral-800 pt-4">
          <p className="input-label">Total Ganado (Bolívares)</p>
          <p className="text-3xl font-black text-emerald-400">
            Bs. {cargando ? "..." : totalEnBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={obtenerTotales} 
          disabled={cargando}
          className="btn-secundario py-4 text-xs disabled:opacity-50"
        >
          {cargando ? "Cargando..." : "Actualizar Datos"}
        </button>

        <button 
          onClick={cerrarJornadaYEnviarWhatsApp} 
          disabled={cargando}
          className="btn-whatsapp py-5 text-xs sm:text-sm disabled:opacity-50"
        >
          Cerrar Jornada y Enviar a WhatsApp
        </button>
      </div>
    </div>
  )
}
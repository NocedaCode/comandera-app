'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CamareroPage() {
  const [mesa, setMesa] = useState('')
  const [tipoServicio, setTipoServicio] = useState('aqui')
  const [productoNombre, setProductoNombre] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [notas, setNotas] = useState('')
  const [totalComanda, setTotalComanda] = useState('')
  const [carrito, setCarrito] = useState([])
  const [enviando, setEnviando] = useState(false)

  const agregarAlCarrito = () => {
    if (!productoNombre.trim()) return
    setCarrito([...carrito, { nombre: productoNombre.trim(), cantidad: Number(cantidad), notas: notas.trim() }])
    setProductoNombre('')
    setCantidad(1)
    setNotas('')
  }

  const enviarPedido = async () => {
    if (!mesa.trim()) return alert('Por favor ingresa la mesa o cliente')
    if (carrito.length === 0) return alert('Agrega al menos un producto')
    if (!totalComanda || Number(totalComanda) <= 0) return alert('Ingresa un monto válido')

    setEnviando(true)
    const { error } = await supabase.from('pedidos').insert([
      { mesa, tipo_servicio: tipoServicio, items: carrito, total: parseFloat(totalComanda), estado: 'pendiente' }
    ])

    setEnviando(false)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Comanda enviada a cocina')
      setCarrito([])
      setMesa('')
      setTotalComanda('')
    }
  }

  return (
    <div className="page-container pb-12">
      <h1 className="header-title">Toma de Pedidos</h1>
      <p className="header-subtitle mb-6">Módulo de Atención</p>

      {/* Tipo de Servicio */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setTipoServicio('aqui')}
          className={`py-4 text-xs ${tipoServicio === 'aqui' ? 'btn-primario' : 'btn-secundario'}`}
        >
          COMER AQUÍ
        </button>
        <button
          onClick={() => setTipoServicio('delivery')}
          className={`py-4 text-xs ${tipoServicio === 'delivery' ? 'btn-primario' : 'btn-secundario'}`}
        >
          DELIVERY
        </button>
      </div>

      <div className="mb-6">
        <label className="input-label">
          {tipoServicio === 'aqui' ? 'Mesa / Ubicación' : 'Nombre del Cliente'}
        </label>
        <input
          type="text"
          placeholder={tipoServicio === 'aqui' ? 'Ej: Mesa 04' : 'Ej: Carlos'}
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Agregar Platillos */}
      <div className="card-panel mb-6 space-y-4">
        <label className="input-label">Agregar Platillo</label>
        
        {/* Campo Nombre del Platillo amplio */}
        <div>
          <input
            type="text"
            placeholder="Nombre del platillo..."
            value={productoNombre}
            onChange={(e) => setProductoNombre(e.target.value)}
            className="input-field w-full text-base py-3.5 px-4"
          />
        </div>

        {/* Cantidad y Observaciones */}
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-1">
            <label className="input-label text-[9px]">Cant.</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="input-field w-full text-center font-black text-amber-400 text-lg py-2"
            />
          </div>
          <div className="col-span-3">
            <label className="input-label text-[9px]">Observación (opcional)</label>
            <input
              type="text"
              placeholder="Ej: Sin cebolla, picante..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="input-field w-full text-xs italic py-2.5"
            />
          </div>
        </div>

        <button onClick={agregarAlCarrito} className="btn-secundario py-3 text-xs">
          + AGREGAR A LA COMANDA
        </button>
      </div>

      {/* Carrito de Pedidos */}
      {carrito.length > 0 && (
        <div className="card-panel mb-6 space-y-4">
          <label className="input-label border-b border-neutral-800 pb-2">Resumen de la Orden</label>
          <ul className="space-y-3">
            {carrito.map((item, idx) => (
              <li key={idx} className="flex justify-between items-start text-xs border-b border-neutral-800/50 pb-2">
                <div>
                  <strong className="text-amber-400">{item.cantidad}x</strong> {item.nombre}
                  {item.notas && <p className="text-[11px] text-amber-300/80 italic">Nota: {item.notas}</p>}
                </div>
                <button
                  onClick={() => setCarrito(carrito.filter((_, i) => i !== idx))}
                  className="text-red-400 hover:text-red-300 font-bold text-xs uppercase"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-neutral-800">
            <label className="input-label">Precio Total ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={totalComanda}
              onChange={(e) => setTotalComanda(e.target.value)}
              className="input-field text-center font-black text-2xl text-amber-400"
            />
          </div>
        </div>
      )}

      <button onClick={enviarPedido} disabled={enviando} className="btn-primario py-5 text-sm">
        {enviando ? 'ENVIANDO...' : 'ENVIAR PEDIDO A COCINA'}
      </button>
    </div>
  )
}
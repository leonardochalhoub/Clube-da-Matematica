'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet'
import { fetchVisitorPins, type VisitorPin } from '@/lib/analytics/visitor-pins'
import { useLocale } from './LocaleProvider'

/**
 * Mapa interativo de pins de visitantes (react-leaflet + CARTO Positron).
 *
 * Um pin por visitante DISTINTO (dados em Supabase, anônimos). Hover no pin
 * mostra "Cidade, País". Renderizado SOMENTE no client (ssr:false via dynamic
 * import no MapaPageContent) — Leaflet precisa de `window`.
 *
 * O ícone é um divIcon SVG (teardrop) em vez do PNG padrão do Leaflet pra
 * evitar o bug de asset 404 sob `basePath` no GitHub Pages.
 */

const PIN_HTML = `
<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M13 0C5.82 0 0 5.82 0 13c0 9.2 11.3 19.86 11.78 20.3a1.8 1.8 0 0 0 2.44 0C14.7 32.86 26 22.2 26 13 26 5.82 20.18 0 13 0Z" fill="rgb(15,118,110)"/>
  <circle cx="13" cy="13" r="5" fill="rgb(254,243,221)"/>
</svg>`

function makePinIcon(): L.DivIcon {
  return L.divIcon({
    className: 'clube-pin',
    html: PIN_HTML,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    tooltipAnchor: [0, -30],
  })
}

function pinLabel(pin: VisitorPin): string {
  const parts = [pin.city, pin.country].filter(Boolean) as string[]
  return parts.length ? parts.join(', ') : '—'
}

export function VisitorPinMap() {
  const { t, locale } = useLocale()
  const [pins, setPins] = useState<VisitorPin[] | null>(null)
  const icon = useMemo(() => makePinIcon(), [])

  useEffect(() => {
    let cancelled = false
    fetchVisitorPins().then((data) => {
      if (!cancelled) setPins(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const numberLocale = locale === 'pt-BR' ? 'pt-BR' : locale

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <p className="rounded-full border border-clube-teal/30 bg-clube-teal/5 px-4 py-1.5 text-sm text-clube-mist">
          {pins === null ? (
            t('visitor.loading')
          ) : (
            <>
              <strong className="text-clube-teal-deep">
                {pins.length.toLocaleString(numberLocale)}
              </strong>{' '}
              {t('mapa.pins.onmap')}
            </>
          )}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-clube-mist-soft/40 shadow-sm">
        <MapContainer
          center={[15, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={12}
          scrollWheelZoom
          worldCopyJump
          className="h-[60vh] min-h-[420px] w-full bg-clube-cream-soft"
          style={{ background: 'rgb(247,243,233)' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {(pins ?? []).map((pin, i) => (
            <Marker key={i} position={[pin.lat, pin.lng]} icon={icon}>
              <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                {pinLabel(pin)}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {pins !== null && pins.length === 0 && (
        <p className="mt-4 text-center text-sm text-clube-mist">
          {t('visitor.empty.title')}
        </p>
      )}

      <p className="mt-4 text-center text-xs italic text-clube-mist/70">
        {t('visitor.footer.note')}
      </p>
    </div>
  )
}

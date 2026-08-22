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

// Fills use the theme CSS vars (via style=, since var() isn't valid in a bare
// SVG presentation attribute) so the pin recolors automatically under `.dark`.
const PIN_HTML = `
<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M13 0C5.82 0 0 5.82 0 13c0 9.2 11.3 19.86 11.78 20.3a1.8 1.8 0 0 0 2.44 0C14.7 32.86 26 22.2 26 13 26 5.82 20.18 0 13 0Z" style="fill:rgb(var(--clube-teal))"/>
  <circle cx="13" cy="13" r="5" style="fill:rgb(var(--clube-surface))"/>
</svg>`

/** Tracks `.dark` on <html> (ThemeToggle flips the class, no React state). */
function useIsDark(): boolean {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const el = document.documentElement
    const update = () => setDark(el.classList.contains('dark'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

function makePinIcon(): L.DivIcon {
  return L.divIcon({
    className: 'clube-pin',
    html: PIN_HTML,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    tooltipAnchor: [0, -30],
  })
}

interface Place {
  lat: number
  lng: number
  label: string
  count: number
}

/** "Cuiabá, MT, Brazil" — cidade, estado/região (código preferido), país. */
function placeLabel(p: VisitorPin): string {
  const parts = [p.city, p.region_code || p.region, p.country].filter(Boolean) as string[]
  return parts.length ? parts.join(', ') : '—'
}

/**
 * Agrupa pins por lugar (cidade+região+país) → um marcador por lugar, com a
 * contagem de visitantes distintos ali. A coordenada é a média do grupo.
 */
function aggregatePlaces(pins: VisitorPin[]): Place[] {
  const groups = new Map<string, { lat: number; lng: number; n: number; label: string }>()
  for (const p of pins) {
    const key = `${p.city ?? ''}|${p.region ?? ''}|${p.country ?? ''}`.toLowerCase()
    const g = groups.get(key)
    if (g) {
      g.lat += p.lat
      g.lng += p.lng
      g.n += 1
    } else {
      groups.set(key, { lat: p.lat, lng: p.lng, n: 1, label: placeLabel(p) })
    }
  }
  return Array.from(groups.values()).map((g) => ({
    lat: g.lat / g.n,
    lng: g.lng / g.n,
    label: g.label,
    count: g.n,
  }))
}

export function VisitorPinMap() {
  const { t, locale } = useLocale()
  const [pins, setPins] = useState<VisitorPin[] | null>(null)
  const icon = useMemo(() => makePinIcon(), [])
  const dark = useIsDark()
  const places = useMemo(() => aggregatePlaces(pins ?? []), [pins])

  useEffect(() => {
    let cancelled = false
    fetchVisitorPins()
      .then((data) => {
        if (!cancelled) setPins(data)
      })
      .catch(() => {
        if (!cancelled) setPins([])
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

      {/* relative z-0 + isolate confines Leaflet's internal z-index (panes/controls
          go up to 1000) into its own stacking context, so the sticky header's
          language dropdown (z-40) stays above the map instead of behind it. */}
      <div className="relative z-0 isolate overflow-hidden rounded-2xl border border-clube-mist-soft/40 shadow-sm">
        <MapContainer
          center={[15, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={12}
          scrollWheelZoom
          worldCopyJump
          className="h-[60vh] min-h-[420px] w-full"
          style={{ background: 'rgb(var(--clube-cream-soft))' }}
        >
          <TileLayer
            key={dark ? 'dark' : 'light'}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={`https://{s}.basemaps.cartocdn.com/${dark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`}
          />
          {places.map((place, i) => (
            <Marker key={i} position={[place.lat, place.lng]} icon={icon}>
              <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                <span className="font-semibold">{place.label}</span>
                <br />
                <span className="text-xs opacity-80">
                  {place.count.toLocaleString(numberLocale)}{' '}
                  {t(place.count === 1 ? 'mapa.tip.visitor' : 'mapa.tip.visitors')}
                </span>
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

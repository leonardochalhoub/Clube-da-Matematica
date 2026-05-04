'use client'

import type { SVGProps } from 'react'
import { useLocale } from '@/components/layout/LocaleProvider'

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number
  variant?: 'filled' | 'outline'
}

/**
 * Espiral áurea de Fibonacci — símbolo do Clube da Matemática.
 *
 * 4 quartos de arco em razão áurea, contínuos. Aberto nas pontas
 * (aprendizado nunca fecha). Base teal #1A4D5C, traço gold #E8C77A.
 */
export function Logo({ size = 32, variant = 'filled', ...props }: LogoProps) {
  const { t } = useLocale()
  const brand = t('brand.name')

  if (variant === 'outline') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        role="img"
        aria-label={brand}
        {...props}
      >
        <title>{brand}</title>
        <g
          transform="translate(23 31) scale(3.5)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0,0 a1,1 0 0 1 1,1 a2,2 0 0 1 -2,2 a3,3 0 0 1 -3,-3 a5,5 0 0 1 5,-5 a8,8 0 0 1 8,8" />
        </g>
      </svg>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={brand}
      {...props}
    >
      <title>{brand}</title>
      <rect width="64" height="64" rx="12" fill="#1A4D5C" />
      <g
        transform="translate(23 31) scale(3.5)"
        fill="none"
        stroke="#E8C77A"
        strokeWidth="0.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0,0 a1,1 0 0 1 1,1 a2,2 0 0 1 -2,2 a3,3 0 0 1 -3,-3 a5,5 0 0 1 5,-5 a8,8 0 0 1 8,8" />
      </g>
    </svg>
  )
}

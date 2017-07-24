import styled, {css, keyframes} from 'styled-components'

export function color(name, opacity = 'normal', alpha = 1) {
  let opacity500 = {
    'thick': 850,
    'normal': 500,
    'intense': 400,
    'light': 250,
    'bright': 135,
    'pale': 67,
    'translucent': 20,
  }[opacity] || opacity
  let rgb = {
    'primary': [0, 150, 136],
    'primary_dark': [33, 93, 85],
    'action': [241, 121, 73],
    'important': [255, 82, 82],
    'attention': [255, 196, 0],
    'black': [0, 0, 0],
    'white': [255, 255, 255],
    'info': [3, 169, 244],
  }[name] || [0, 0, 0]
  let opacified_tint = (tint) => {
    let result = 255 - ((255 - tint) * opacity500 / 500)
    if (result < 0) {
      result = 0
    }
    return Math.floor(result)
  }
  return `rgba(${rgb.map((tint) => opacified_tint(tint)).join(', ')}, ${alpha})`
}

export const link = css`
  &:hover {
    cursor: pointer;
    opacity: 0.54;
  }

  &:active {
    opacity: 0.36;
  }
`

export const disabled_link = css`
  &:hover {
    cursor: not-allowed;
    opacity: 1;
  }

  &:active {
    opacity: 1;
  }
`

export const circle = (radius) => css`
  width: ${radius}px;
  height: ${radius}px;
  border-radius: ${radius}px;
`

export const card = css`
  border-radius: 2px;
  background-color: white;
  box-shadow: 0 1px 2px 1px ${color('black', 'normal', 0.25)};
  padding: 20px;
  margin-bottom: 2px;
`

export const input = css`
  background-color: transparent;
  border-style: none;
  padding-left: 0;

  &:focus {
    outline-color: transparent;
    outline-style: none;
  }
`
export const ellipsis = (max_width) => css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${max_width};
`
export const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'
export const desceleration = 'cubic-bezier(0, 0, 0.2, 1)'
export const acceleration = 'cubic-bezier(0.4, 0, 1, 1)'

export const rotate = css`
  animation: ${keyframes`
  	from {
  		transform: rotate(360deg);
  	}

  	to {
  		transform: rotate(0deg);
  	}
  `} 1s linear infinite;
`

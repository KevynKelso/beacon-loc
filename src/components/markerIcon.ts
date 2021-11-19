export default function markerIcon(name: string, numBeacons: number, active: boolean) {
  const characterWidth = 6
  const digitWidth = 12

  const numDigits: number = numBeacons.toString().length
  const numberBoxWidth: number = digitWidth * numDigits + 25

  const truncatedName: string = name.substring(0, 15)
  const nameBoxWidth: number = truncatedName.length * characterWidth + 25

  const totalWidth = nameBoxWidth + numberBoxWidth

  const fillColor: string = active ? "0, 217, 255" : "255, 255, 255"
  return {
    url: `data:image/svg+xml;utf8,
      <svg width="${totalWidth}" height="30" xmlns="http://www.w3.org/2000/svg">

       <g>
        <title>Layer 1</title>
        <rect id="svg_3" height="288" width="695.99999" style="fill:rgb(${fillColor})"/>
        <line stroke-width="3" id="svg_4" y2="420" x2="546" y1="130" x1="545" />
        <text transform="matrix(1.62776 0 0 1.71429 -349.964 -106.571)" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" stroke-width="0" id="svg_5" y="174" x="575" >Beacons:</text>
        <text transform="matrix(6.75494 0 0 4.1085 -3628.6 -829.088)" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_6" y="279.53356" x="629.0311" stroke-width="0" >0</text>
        <text transform="matrix(1.95833 0 0 2.46429 -280.917 -344.5)" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" stroke-width="0" id="svg_7" y="260" x="194" >Bridge:</text>
        <text transform="matrix(0.55275 0 0 0.547511 -0.503156 11.8495)" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_11" y="12.4251" x="18.54935" stroke-width="0" >${truncatedName}</text>
        <rect id="svg_15" height="31.49959" width="${numberBoxWidth}" y="-0.3748" x="${nameBoxWidth}" stroke-width="0" style="fill:rgb(0,255,0)"/>
        <text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_16" y="23.12489" x="${nameBoxWidth + 12.5}" stroke-width="0" >${numBeacons}</text>
       </g>
      </svg>
      `
  }
}


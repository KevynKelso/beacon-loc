export const darkSkyBlue: string = "116, 179, 206"
export const steelTeal: string = "80, 137, 145"
export const prussianBlue: string = "23, 42, 58"
export const warmBlack: string = "0, 67, 70"
export const mountainMeadow: string = "9, 188, 138"
export const lostRed: string = "112, 43, 44"

const emPrimary: string = "22, 118, 163"
const emSecondary: string = "0, 64, 94"

export default function markerIcon(
  name: string,
  numBeacons: number,
  active: boolean,
) {
  const characterWidth = 6
  const digitWidth = 12

  const numDigits: number = numBeacons.toString().length
  const numberBoxWidth: number = digitWidth * numDigits + 25

  const truncatedName: string = name.substring(0, 15).replace('&', 'and')
  const nameBoxWidth: number = truncatedName.length * characterWidth + 25

  const totalWidth = nameBoxWidth + numberBoxWidth

  const notActiveColor = !name.toLocaleLowerCase().includes("out of range") ? emSecondary : lostRed

  const fillColor: string = active ? darkSkyBlue : notActiveColor
  const textColor: string = active ? "5, 5, 5" : "255, 255, 255"
  return {
    url: `data:image/svg+xml,
        ${encodeSvg(`<svg width="${totalWidth}" height="40" xmlns="http://www.w3.org/2000/svg">
         <g>
          <title>Layer 1</title>
          <rect id="svg_3" height="30" width="695.99999" style="fill:rgb(${fillColor})"/>
          <line stroke-width="3" id="svg_4" y2="420" x2="546" y1="130" x1="545" />
          <text iransfori="matrix(1.62776 0 0 1.71429 -349.964 -106.571)" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" stroke-width="0" id="svg_5" y="174" x="575" >Beacons:</text>
          <text transform="matrix(6.75494 0 0 4.1085 -3628.6 -829.088)" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_6" y="279.53356" x="629.0311" stroke-width="0" >0</text>
          <text transform="matrix(1.95833 0 0 2.46429 -280.917 -344.5)" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" stroke-width="0" id="svg_7" y="260" x="194" >Bridge:</text>
          <text transform="matrix(0.55275 0 0 0.547511 -0.503156 11.8495)" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_11" y="12.4251" x="18.54935" stroke-width="0" style="fill:rgb(${textColor})">${truncatedName}</text>
          <rect id="svg_15" height="31" width="${numberBoxWidth}" y="-0.3748" x="${nameBoxWidth}" stroke-width="0" style="fill:rgb(${emPrimary})"/>
          <text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_16" y="23.12489" x="${nameBoxWidth + 12.5}" style="fill:rgb(255, 255, 255)" stroke-width="0" >${numBeacons}</text>
          <polygon stroke-width="2" style="fill:rgb(${emPrimary})" points="${totalWidth / 2},40 ${totalWidth / 2 + 10},30 ${totalWidth / 2 - 10},30"/>
         </g>
        </svg>`)}`
  }
}

function encodeSvg(svgString: string) {
  return svgString.replace('<svg', (~svgString.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))

    //
    //   Encode (may need a few extra replacements)
    //
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')

    .replace(/\s+/g, ' ')
    //
    //    The maybe list (add on documented fail)
    //
    .replace(/&/g, '%26')
  //  .replace('|', '%7C')
  //  .replace('[', '%5B')
  //  .replace(']', '%5D')
  //  .replace('^', '%5E')
  //  .replace('`', '%60')
  //  .replace(';', '%3B')
  //  .replace('?', '%3F')
  //  .replace(':', '%3A')
  //  .replace('@', '%40')
  //  .replace('=', '%3D')

}


export const getIconColor = (hexString: string): string => {
  const [red, green, blue] = hexString.substring(1).split(/(..)/g)
    .filter(s => s)
    .map(x => parseInt(x, 16))
  if ((red * 0.299 + green * 0.587 + blue * 0.114) > 186) {
    return '#000000'
  }

  return '#FFFFFF'
}

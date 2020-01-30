onmessage = function(messageEvent) {
  handleOffscreenCanvas(messageEvent.data.offscreenCanvas);
};

/**
 * @param {OffscreenCanvas} offscreenCanvas
 */
function handleOffscreenCanvas(offscreenCanvas) {
  const ctx = offscreenCanvas.getContext('2d');
  globalThis.requestAnimationFrame(() => animationStep('hsl(0, 50%, 50%'));

  function animationStep(hslString) {
    const {width, height} = offscreenCanvas;
    ctx.clearRect(0, 0, width, height);

    const hslObj = hslFromString(hslString);
    const nextHslString = hslToString(hslObj.hue + 1, hslObj.saturation, hslObj.lightness);

    ctx.fillStyle = nextHslString;
    ctx.fillRect(width * 0.1, height * 0.1, width * 0.2, height * 0.5);

    ctx.fillStyle = hslToString(hslObj.hue + 120, hslObj.saturation, hslObj.lightness);
    ctx.fillRect(width * 0.4, height * 0.1, width * 0.2, height * 0.4);

    ctx.fillStyle = hslToString(hslObj.hue + 240, hslObj.saturation, hslObj.lightness);
    ctx.fillRect(width * 0.7, height * 0.1, width * 0.2, height * 0.3);

    // ctx.arc(width * 0.25, width * 0.25, width * 0.25, 0, 2 * Math.PI);
    // ctx.fill();

    globalThis.requestAnimationFrame(() => animationStep(nextHslString));
  }
}

/**
 * @param {number} hue 0-360 deg
 * @param {number} saturation 0-100 %
 * @param {number} lightness 0-100 %
 * @returns {string}
 */
function hslToString(hue, saturation, lightness) {
  return `hsl(${hue % 360}, ${saturation % 100}%, ${lightness % 100}%)`;
}

/**
 * @param {string} hslAsString
 * @example 'hsl(120, 30%, 45%)' => {hue: 120, saturation: 30, lightness: 45};
 */
function hslFromString(hslAsString) {
  const prefixLength = 4;
  const suffixLength = 1;
  const clean = hslAsString.substr(
    prefixLength,
    hslAsString.length - prefixLength - suffixLength
  );

  const values = clean.split(',');
  return {
    hue: parseInt(values[0]),
    saturation: parseInt(values[1]),
    lightness: parseInt(values[2]),
  };
}

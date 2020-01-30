(function() {
  /** @type {HTMLCanvasElement} */
  const canvasElement = document.getElementById('main-canvas');
  const offscreenCanvas = canvasElement.transferControlToOffscreen();

  const offscreenCanvasWorker = new Worker('offscreen-canvas.worker.js');
  offscreenCanvasWorker.postMessage({offscreenCanvas}, [offscreenCanvas]);

  return;
})();

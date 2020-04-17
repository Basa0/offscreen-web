(function (x) {
  console.log('imported', x);
  console.log('fabric after import', window.fabric);

  /** @type {HTMLCanvasElement} */
  const canvasElement = document.getElementById('main-canvas');
  const offscreenCanvas = canvasElement.transferControlToOffscreen();

  const offscreenCanvasWorker = new Worker('offscreen-canvas.worker.js');
  offscreenCanvasWorker.postMessage({offscreenCanvas}, [offscreenCanvas]);

  document.body.appendChild(document.createElement('hr'));

  createAndAddPostMessageButton('Add something somewhere!', {
    addRandom: true,
  });
  createAndAddPostMessageButton('Move something somewhere!', {
    moveRandom: true,
  });
  createAndAddPostMessageButton('Zoom in', {
    zoomIn: true,
  });
  createAndAddPostMessageButton('Zoom out', {
    zoomOut: true,
  });

  canvasElement.onmousedown = /** @param {MouseEvent} mouseEvent */ (mouseEvent) => {
    let x = mouseEvent.clientX - canvasElement.offsetLeft;
    x = convertRange(x, [0, canvasElement.clientWidth], [0, canvasElement.width]);

    let y = mouseEvent.clientY - canvasElement.offsetTop;
    y = convertRange(y, [0, canvasElement.clientHeight], [0, canvasElement.height]);

    offscreenCanvasWorker.postMessage({
      addAt: {x, y},
    });
  };

  function createAndAddPostMessageButton(innerText, message) {
    createAndAddButton(innerText, () => offscreenCanvasWorker.postMessage(message));
  }

  function createAndAddButton(innerText, onclick) {
    const btn = document.createElement('button');
    btn.innerText = innerText;
    btn.onclick = onclick;
    document.body.appendChild(btn);
  }

  function convertRange(value, r1, r2) {
    return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
  }

  return;
})();

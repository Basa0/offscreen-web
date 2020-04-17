/** @type {Map<string,{id:string}>} */
const elementsById = new Map();

const workerDocument = (() => {
  const document = {
    createElement,
    getElementById,
    documentElement: createElement('documentElement'),
  };
  return document;

  function createElement(arg) {
    console.warn('createElement', arg);
    switch (arg) {
      case 'canvas':
        return new OffscreenCanvas(1, 1);
      default:
        return {
          style: {},
        };
    }
  }

  function getElementById(id) {
    console.warn('getElementById', id);
    return elementsById.get(id) || createElement('by id ' + id);
  }
})();

function require(arg) {
  console.warn('require', arg);

  return {
    JSDOM: function (arg) {
      console.warn('JSDOM', arg);
      this.window = {
        requestAnimationFrame: (func) => {
          // console.time('offscreen animation frame');
          return globalThis.requestAnimationFrame(() => {
            func();
            // console.timeEnd('offscreen animation frame');
          });
        },
        cancelAnimationFrame: (arg) => cancelAnimationFrame(arg),
        // setTimeout: func => func(),
        document: workerDocument,
      };
    },
  };
}

importScripts('node_modules/fabric/dist/fabric.js');

/** @type {fabric.StaticCanvas} */
let fCanvas = null;

onmessage = function (messageEvent) {
  const data = messageEvent && messageEvent.data;
  if (!data) {
    return;
  }

  if (data.offscreenCanvas) {
    initialize(data.offscreenCanvas);
  }

  if (fCanvas) {
    if (data.addAt) {
      addAt(data.addAt.x, data.addAt.y);
    }
    if (data.addRandom) {
      for (let i = 0; i < 100; i++) addRandom();
    }
    if (data.moveRandom) {
      moveRandom();
    }
    if (data.zoomIn) {
      zoomIn();
    }
    if (data.zoomOut) {
      zoomOut();
    }
  }
};

/**
 * @param {OffscreenCanvas} offscreenCanvas
 */
function initialize(offscreenCanvas) {
  const ctx = offscreenCanvas.getContext('2d');

  elementsById.set('test-canvas-id', offscreenCanvas);
  fCanvas = new fabric.StaticCanvas('test-canvas-id');
  console.log('fabricCanvas', fCanvas);
  const circle = new fabric.Circle({left: 10, top: 10, fill: 'pink', radius: 5});
  fCanvas.add(circle);
  fCanvas.requestRenderAll();

  initialized = true;
  return;
}

function moveRandom() {
  const objects = fCanvas.getObjects();
  objects.forEach((obj) => {
    const {left, top} = randomLeftTop();
    obj.left = left;
    obj.top = top;
  });
  fCanvas.requestRenderAll();

  // requestAnimationFrame(function wow() {
  //   fCanvas.renderAll();
  //   requestAnimationFrame(() => moveRandom());
  // });
}

function addRandom() {
  const {left, top} = randomLeftTop();
  addAt(left, top);
}

function addAt(left, top) {
  const circle = new fabric.Circle({
    left,
    top,
    fill: `rgba(${left}, ${top}, ${left + top})`,
    radius: 5,
  });
  fCanvas.add(circle);
  fCanvas.requestRenderAll();
}

function randomLeftTop() {
  const left = Math.random() * fCanvas.getWidth();
  const top = Math.random() * fCanvas.getHeight();
  return {left, top};
}

/** @type {number} */
let targetZoom = null;

function zoomIn() {
  targetZoom = (targetZoom || fCanvas.getZoom()) * 1.1;
  applyTargetZoom();
}

function zoomOut() {
  targetZoom = (targetZoom || fCanvas.getZoom()) * 0.9;
  applyTargetZoom();
}

const applyTargetZoomStep = 0.01;

let applyTargetZoom_frameId = 0;
function applyTargetZoom() {
  if (applyTargetZoom_frameId) {
    return;
  }

  applyTargetZoom_frameId = requestAnimationFrame(() => {
    applyTargetZoom_frameId = 0;

    if (targetZoom === null) {
      return;
    }

    const currentZoom = fCanvas.getZoom();

    let zoomToSet;
    if (Math.abs(currentZoom - targetZoom) < applyTargetZoomStep) {
      zoomToSet = targetZoom;
      targetZoom = null;
    } else if (targetZoom < currentZoom) {
      zoomToSet = currentZoom - applyTargetZoomStep;
    } else {
      zoomToSet = currentZoom + applyTargetZoomStep;
    }

    fCanvas.setZoom(zoomToSet);
    fCanvas.renderAll();

    applyTargetZoom();
  });
}

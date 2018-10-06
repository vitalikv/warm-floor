
var log = [];
var logTime = Date.now();
var logging = false;
var logMessages = false;
var logControls = false;
var useDelay = false;
var delay = 0;
var maxTimeBetweenActions = 0;

function startLog() {
  log = [];
  logTime = Date.now();
  logging = true;
  window.addEventListener('mousedown', recordMouseDown);
  window.addEventListener('mouseup', recordMouseUp);
  logMessages && UI.showAlert('Запись запущена', 'success');
}

function recordMouseDown(e) {
  if (!logging) return;
  if (e.target.className === 'projectInfo__copy') return;

  var coords = toRelativeCoords(e.clientX, e.clientY);
  log.push({
    x: coords[0],
    y: coords[1],
    b: e.button,
    c: e.target.className,
    i: e.target.dataset.logId,
    e: 'd',
    t: Date.now() - logTime
  })
}

function recordMouseUp(e) {
  if (!logging) return;
  if (e.target.className === 'projectInfo__copy') return;

  var coords = toRelativeCoords(e.clientX, e.clientY);
  log.push({
    x: coords[0],
    y: coords[1],
    b: e.button,
    c: e.target.className,
    i: e.target.dataset.logId,
    e: 'u',
    t: Date.now() - logTime
  })
}

function simulateClick(target, x, y, button) {
  var coords = toScreenCoords(x, y);
  var evt = new MouseEvent("click", {
    clientX: coords[0],
    clientY: coords[1],
    button: button,
    bubbles: true,
    cancelable: false,
    view: window
  });
  target.dispatchEvent(evt);
}

function playLog() {

  if (!log.length) return;
  stopLogging();
  logMessages && UI.showAlert('Воспроизведение');

  for (let i = 0; i < log.length; i++) {
    let timeout;
    if (useDelay) {
      timeout = delay;
    } else {
      timeout = log[i].t;
      if (maxTimeBetweenActions && timeout > maxTimeBetweenActions) {
        timeout = maxTimeBetweenActions;
      }
    }
    setTimeout(function () {
      let coords = toScreenCoords(log[i].x, log[i].y);

      if (log[i].c !== 'ui-layer') {
        let target = document.querySelector('[data-log-id="' + log[i].i + '"]') || document.querySelector('.' + log[i].c);
        simulateClick(target, log[i].x, log[i].y, log[i].b);
      } else {
        let eventParams = {
          clientX: coords[0],
          clientY: coords[1],
          button: log[i].b,
          bubbles: true,
          cancelable: false,
          view: window
        }
        let event = new MouseEvent("mousemove", eventParams);
        onDocumentMouseMove(event);
        if (log[i].e === 'd') {
          event = new MouseEvent("mousedown", eventParams);
          onDocumentMouseDown(event);
        } else if (log[i].e === 'u') {
          event = new MouseEvent("mouseup", eventParams);
          onDocumentMouseUp(event);
        }
      }
    }, timeout);
  }
}

function stopLogging() {
  if (!logging) return;

  logMessages && UI.showAlert('Запись остановлена');
  logging = false;
  window.removeEventListener('mousedown', recordMouseDown);
  window.removeEventListener('mouseup', recordMouseUp);
}

function clearLog() {
  if (!log.length) return;

  logMessages && UI.showAlert('Лог очищен');
  log = [];
  window.removeEventListener('mousedown', recordMouseDown);
  window.removeEventListener('mouseup', recordMouseUp);
}

window.addEventListener('keypress', function (e) {
  if (!logControls) return;

  if (e.keyCode === 114) {//r
    startLog();
  }
  if (e.keyCode === 116) {//t 
    playLog();
  }
  if (e.keyCode === 101) {//e
    stopLogging();
  }
  if (e.keyCode === 99) {//c
    clearLog();
  }
})

function saveLog() {
  var blob = new Blob([JSON.stringify(log)], {
    "type": "application/json"
  });
  var a = document.createElement("a");
  var date = new Date();
  var name = 'editor_log_' + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds()
  a.download = name;
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function initLogId() {
  const all = document.getElementsByTagName("*");

  for (let i = 0; i < all.length; i++) {
    all[i].dataset.logId = i;
  }
}

let logInput = document.createElement('input');
logInput.type = 'file';
document.body.appendChild(logInput);
logInput.addEventListener('change', readSingleFile, false);

function openLogBrowser() {
  logInput.click();
  UI.keyPressed[79] = false;
}

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    var contents = e.target.result;
    log = JSON.parse(contents);
    console.log('Log loaded');
    playLog();
  };
  reader.readAsText(file);
}

function toRelativeCoords(x, y) {
  return [x + '|' + window.innerWidth, y + '|' + window.innerHeight]
}

function toScreenCoords(x, y) {
  var cX = x.split('|');
  var cY = y.split('|');
  return [window.innerWidth / (cX[1] / cX[0]), window.innerHeight / (cY[1] / cY[0])];
}

function toggleLogControls() {
  logControls = !logControls;
  logMessages = !logMessages;
}

initLogId();
startLog();
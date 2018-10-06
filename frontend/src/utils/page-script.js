import $ from 'jquery'

var reactGlobal = {
  editorLoaded: false,
  eventTypes: [],
  win: '',
  init: function () {
    this.editorLoaded = true
    this.win = window.frames.editor
    let e = this.getEvent('load');
    if (e) {
      this.emit('load')
    }
  },
  showModal: () => {
    $('.modal').fadeIn();
  },
  closeModal: () => {
    $('.modal').hide();
  },
  sendMessage: function (action, payload) {
    if (!this.win) { console.error('no editor initiated'); return; }
    this.win.postMessage({ 'action': action, 'payload': payload }, '*');
  },

  on: function (event, callback) {
    var e = this.getEvent(event)
    if (e) {
      e.callbacks.push(callback);
    } else {
      var newE = { name: event, callbacks: [callback] }
      this.eventTypes.push(newE);
    }
  },
  getEvent: function (event) {
    for (var i = 0; i < this.eventTypes.length; i++) {
      if (this.eventTypes[i].name === event) {
        return this.eventTypes[i]
      }
    }
    return false;
  },
  emit: function (event, ...args) {
    var e = this.getEvent(event);
    if (e) {
      for (var i = 0; i < e.callbacks.length; i++) {
        e.callbacks[i].apply(this, args);
      }
    }
  }
}

$(document).ready(function () {
  var buttons = {
    save: 1,
    clone: 1,
    undo: 1,
    redo: 1,
    line: 1,
    zone: 1,
    door: 1,
    window: 1,
    doorway: 1,
    changeView: 1,
    toggleSizes: 1,
    center: 1,
    centerCamera2d: 1,
    zoomIn: 1,
    zoomOut: 1,
    angle: 1,
    changeViewMode: 1,
    cameraHeight: 1,
    ceilingHeight: 1,
    units: 1,
    render: 1
  }

  function listener(event) {
    if (event.source === window) return;
    // if (event.origin != 'http://127.0.0.1:3001') {
    //   return;
    // }
    var msg = event.data;
    console.log('recieving: ' + (msg.action || msg.source))
    if (msg.action === 'help') { reactGlobal.emit('showmodal', 'products') }
    if (msg.action === 'products') { reactGlobal.emit('showmodal', 'products') }
    if (msg.action === 'EDITOR.READY') { reactGlobal.init(); reactGlobal.sendMessage('UGOL.INIT', { buttons: buttons, url: window.location.href }); }
    if (msg.action === 'EDITOR.OPEN_CATALOG') { reactGlobal.emit('showmodal', 'products', msg.payload) }
    if (msg.action === 'open-catalog') { reactGlobal.emit('showmodal', 'products', msg.payload) }
    if (msg.action === 'file') { reactGlobal.sendMessage('file', msg.payload); }
    if (msg.action === 'EDITOR.READY') { window.parent.postMessage({ action: 'init' }, '*') }
  }

  window.addEventListener('message', listener);

})

export default reactGlobal
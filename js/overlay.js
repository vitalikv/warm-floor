var actionInProgress;
var renderMode = 'render';


//Заканчиваем события при отпускании кнопки
$(document).mouseup(function () {
  if (typeof actionInProgress !== 'object') return;
  emitAction(
    actionInProgress.action,
    actionInProgress.value,
    actionInProgress.target,
    'end'
  );
  actionInProgress = '';
});


function initUIButtons(buttons, callback) {
  refreshUIButtons();
  console.log(buttons);
  $.each(buttons, function (index, button) {
    var current = $('[data-action="' + index + '"]').parent().find('.overlay-btn');
    var del = 0;
    if (!current.length) {
      del = 1;
      current = $('[data-section="' + index + '"]');
    }
    switch (parseInt(button)) {
      case 0:
        del ? current.remove() : current.addClass('off');
        break;
      case 1:
        current.addClass('on');
        break;
      case 2:
        current.addClass('on');
        current.data({ inactive: true });
        break;
      case 3:
        current.addClass('disabled');
        break;
    }
  });
  if (typeof callback === 'function') {
    callback();
  }
}

function disableUIButtons() {
  disabledButtons = setAllUIButtons(Object.assign({}, editorButtons), 3);
  initUIButtons(disabledButtons);
}

function setAllUIButtons(buttons, stage) {
  $.each(buttons, function (index) {
    buttons[index] = stage;
  })
  return buttons;
}

function refreshUIButtons() {
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
    render: 1,
    help: 1
  };
  $.each(buttons, function (index) {
    var current = $('[data-action="' + index + '"]').parent().find('.overlay-btn');
    current.removeClass('off');
    current.removeClass('on');
    current.removeClass('disabled');
    current.data({ inactive: false });
  });
}


//Навешиваем события на все data-action
$('[data-action]').mousedown(function (e) {
  var $this = $(this);
  var $target;
  var $action;
  var action;
  var value;
  if ($this.parents('.disabled--in-2d').length > 0) {
    return;
  }

  if ($this.hasClass('disabled') || $this.find('.disabled').length) {
    return;
  }

  $target = $(e.currentTarget);
  $action = $(e.target).data('action') || $(e.currentTarget).data('action');
  action = $action.split(' ')[0];

  if ($this.data('action') === 'zoomIn' ||
    $this.data('action') === 'zoomOut') {
    value = null;
    emitAction(action, value, $target, 'start');
    actionInProgress = {
      target: $target,
      action: action,
      value: value
    };
  }

  if ($this.data('continuous')) {
    emitAction(action, value, $target, 'start');
    actionInProgress = {
      target: $target,
      action: action,
      value: value
    };
  }

});


$('[data-action]').on("mousemove", moveMouseAboveButton);


function moveMouseAboveButton() {
  if (camera == cameraTop) {
    activeHover2D_2();
  }
}


$('[data-action]').click(function (e) {
  var $target;
  var $action;
  var action;
  var value;
  var $this = $(this);

  if ($this.data('continuous') === true) {
    return;
  }

  if ($this.data('source') === 'select') {
    return;
  }
  if ($this.parents('.disabled--in-2d').length > 0) {
    UI.setView('2D');
    return;
  }

  if ($this.hasClass('disabled') || $this.find('.disabled').length) {
    return;
  }

  if ($this.data('source') === 'radio') {
    $(e.target).data('value') ?
      $target = $(e.target) :
      $target = $(e.target).closest('[data-value]');
    if ($target.length === 0) return;
    switchRadioBtn($this, $target);

    return;
  }
  
  $target = $(e.currentTarget);
  $action = $(e.target).data('action') || $(e.currentTarget).data('action');
  action = $action.split(' ')[0];

  if (action === 'open-catalog') {
    value = $(e.target).data('catalog') || $(e.currentTarget).data('catalog');
  }

  if (typeof action !== 'string') return;

  if ($this.data('inactive')) {
    sendMessage('EDITOR.ERROR', { code: 403, button: action });
    return;
  }

  emitAction(action, value, $target);
});


//Переключение радио кнопок
function switchRadioBtn($group, $el) {
  var action = $el.data('value');

  $group.children('.b-toolbar__btn_active').removeClass('b-toolbar__btn_active');
  $el.addClass('b-toolbar__btn_active');
  $group.data('selected', action);

  emitAction(action, null, $el);
}

//Подсказки
$('[data-action]').on({
  'mouseenter': function (e) {
    if (e.target.className === 'tooltip' || $(e.currentTarget).hasClass('overlay-menu_open') || $(e.currentTarget).hasClass('overlay-select_open') || UI.isMouseDown) return;
    var self = this;
    UI.tooltipTimer = setTimeout(function () { UI.showTooltip(self); }, 500);
  },
  'mouseleave': function (e) {
    clearTimeout(UI.tooltipTimer);
    if (e.relatedTarget && ($(e.relatedTarget.parentNode).closest('[data-action]')[0] === this)) return;
    UI.hideTooltip(this);
  },
  'click': function (e) {
    clearTimeout(UI.tooltipTimer);
    if (e.relatedTarget && ($(e.relatedTarget.parentNode).closest('[data-action]')[0] === this)) return;
    UI.hideTooltip(this);
  }
});




//Экшены
function emitAction(action, value, $source, stage) {
  var targetName = ($source) ? $source[0].className : false;
  console.log('target: ' + targetName + '\r\n' + 'action: ' + action + '\r\n' + 'value: ' + value + '\r\n' + 'stage: ' + stage);
  if (typeof stage === 'undefined') {

    detectMenuUI(action);

    if (obj_selected) return;

    if (action == 'shape' || action == 'shape1' || action == 'shape2' || action == 'shape3' || action == 'shape4' || action == 'shape5' || action == 'shape6') { createForm(action); }
    else if (action == 'changeView') { UI.changeView(); }
    else if (action == 'changeViewMode') { UI.changeViewMode($source); }
    else if (action == 'line') { clickO.button = 'create_wall'; }
    else if (action == 'add-wall-dot') { clickO.button = 'add_point'; }
    else if (action == 'window') { createEmptyFormWD({ lotid: 8747 }); }
    else if (action == 'doorway') { createEmptyFormWD({ lotid: 575 }); }
    else if (action == 'save') { saveFile(''); }
    else if (action == 'save-project-result') { sendMessage('EDITOR.PROJECT_SAVED', value); }
    else if (action == 'undo') { setInfoEvent1('undo'); renderCamera(); }
    else if (action == 'redo') { setInfoEvent1('redo'); renderCamera(); }
    else if (action == 'wallRedBlueArrow') { toggleButtonMenuWidthWall(clickO.obj); }
    else if (action == 'wallBlueArrow') { toggleButtonMenuWidthWall(clickO.obj); }
    else if (action == 'wallRedArrow') { toggleButtonMenuWidthWall(clickO.obj); }
    else if (action == 'room-type') { clickTableZoneUI(value); }
    else if (action == 'delete-wall') { detectDeleteObj(); }
    else if (action == 'delete-door') { detectDeleteObj(); }
    else if (action == 'delete-window') { detectDeleteObj(); }
    else if (action == 'delete-object') { detectDeleteObj(); }
    // else if (action == 'help') { tutorial.show('wall', 0, ['line', 'shape']); }
    // else if (action == 'help') { sendMessage('EDITOR.OPEN_TUTORIAL') }    
    else if (action == 'open-catalog') { sendMessReplaceObj(value); }
    else if (action == 'open-design-catalog') { var r = TEMPgetRoomType(UI('room-type').val()); r && sendMessage('EDITOR.DESIGN_CLICK', { roomType: { id: r.id, caption: r.caption, alias: r.alias } }); }//roomType: { id: null, alias: null } }
    else if (action == 'delete-texture-wall') { deleteTextureWall(clickO.last_obj, clickO.index); renderCamera(); }
    else if (action == 'delete-texture-floor') { deleteTextureFloorCeiling(clickO.last_obj); renderCamera(); }
    else if (action == 'rotate-45-w3d') { materialRotation({ obj : clickO.last_obj, rot: Math.PI / 4, loop : true, index : clickO.index }); }
    else if (action == 'rotate-90-w3d') { materialRotation({ obj : clickO.last_obj, rot: Math.PI / 2, loop : true, index : clickO.index }); }
    else if (action == 'rotate-45-f3d') { materialRotation({ obj : clickO.last_obj, rot: Math.PI / 4, loop : true }); } 
    else if (action == 'rotate-90-f3d') { materialRotation({ obj : clickO.last_obj, rot: Math.PI / 2, loop : true }); }
    
    else if (action == 'showCatalogButton') { sendMessage('show-catalog-button'); }
    else if (action == 'hideCatalogButton') { sendMessage('hide-catalog-button'); }
    else if (action == 'render') { UI.setRenderMode('render'); changeCamera(camera3D); UI.changeView('render'); }
    else if (action == 'vr-panorama') { UI.setRenderMode('vr-panorama'); UI.changeView('render'); }
    else if (action == 'make-render') { saveFile('render'); }
    else if (action == 'centerCamera2d') { centerCamera2D(); }
    else if (action == 'centerCamera3d') { centerCamera3D(); }
    else if (action == 'exitCameraWindow') { changeCamera(camera3D); }
    else if (action == 'cameraWall') { changeCamera(cameraWall); UI.changeView('window'); }
    else if (action == 'obj_pop_height_above_floor') { inputChangeHeightPopObj(value); }
    else if (action == 'load-project-start') { UI.showAlert('Загрузка объектов', 'loader', '', '', 'projectLoader'); UI.startFakeLoading('projectLoader', 100, 0); sendMessage('EDITOR.LOAD_START'); disableUIButtons(); }
    else if (action == 'load-project-end') { /*UI.updateProgressBar('projectLoader', 100, 100);*/ sendMessage('EDITOR.LOAD_END'); initUIButtons(editorButtons); }
    else if (action == 'stop-fake-loading') { UI.stopFakeLoading('projectLoader') }
    else if (action == 'load_error') { sendMessage('EDITOR.ERROR', { code: value.code, key: getErrorKey(value.code) }); }
    else if (action == 'camera-angle') { camera3D.fov = value / 2 + 25; camera3D.updateProjectionMatrix(); }
    else if (action == 'camera-height') { changeHeightCameraFirst(value); }
    
    else if (action == 'apply-to-all-walls') { assignTextureOnAllWall(); }
    else if (action == 'rotate-45-object') { inputGizmo(45); renderCamera(); }
    else if (action == 'rotate-90-object') { inputGizmo(90); renderCamera(); }
    else if (action == 'rotate-0-object') { inputGizmo(0); renderCamera(); }
    else if (action == 'door_horizontal') { changeInputPosDoorLeaf(0); renderCamera(); }
    else if (action == 'door_vertical') { changeInputPosDoorLeaf(1); renderCamera(); }
    else if (action == 'delete-handle') { /* deleteHandle() */ UI('handle-preview').val(''); UI.setObjectCaption('', 'handle'); }
    else if (action == 'show-interface-tutorial') { showInterfaceTutorial() }
    else if (action == 'show-hotkeys') { showHotkeys() }
    else if (action == 'floor_texture_offset_x') { offsetTextureInput(); }
    else if (action == 'floor_texture_offset_y') { offsetTextureInput(); }
    else if (action == 'floor_texture_rotation') { materialRotation({ obj : clickO.last_obj, rot: THREE.Math.degToRad(value) }); }
    else if (action == 'wall_texture_offset_x') { offsetTextureInput(); } 
    else if (action == 'wall_texture_offset_y') { offsetTextureInput(); } 
    else if (action == 'wall_texture_rotation') { materialRotation({ obj : clickO.last_obj, rot: THREE.Math.degToRad(value), index : clickO.index }); }  
  }
  if (stage === 'start') {
    if (action == 'zoomIn') { zoomLoop = 'zoomIn'; }
	else if (action == 'zoomOut') { zoomLoop = 'zoomOut'; }
    else if (action == 'wall_texture_offset_x_add') { moveTexture = { axis : 'x', value : -0.1 }; }
    else if (action == 'wall_texture_offset_x_sub') { moveTexture = { axis : 'x', value : 0.1 }; }
    else if (action == 'wall_texture_offset_y_add') { moveTexture = { axis : 'y', value : -0.1 }; }
    else if (action == 'wall_texture_offset_y_sub') { moveTexture = { axis : 'y', value : 0.1 }; }
    else if (action == 'floor_texture_offset_x_add') { moveTexture = { axis : 'x', value : -0.1 }; }
    else if (action == 'floor_texture_offset_x_sub') { moveTexture = { axis : 'x', value : 0.1 }; }
    else if (action == 'floor_texture_offset_y_add') { moveTexture = { axis : 'y', value : -0.1 }; }
    else if (action == 'floor_texture_offset_y_sub') { moveTexture = { axis : 'y', value : 0.1 }; }
  }
  if (stage === 'end') {
    if (action == 'zoomIn') { zoomLoop = ''; }
	else if (action == 'zoomOut') { zoomLoop = ''; }
    else if (action == 'wall_texture_offset_x_add') { moveTexture = { }; }
    else if (action == 'wall_texture_offset_x_sub') { moveTexture = { }; }
    else if (action == 'wall_texture_offset_y_add') { moveTexture = { }; }
    else if (action == 'wall_texture_offset_y_sub') { moveTexture = { }; }
    else if (action == 'floor_texture_offset_x_add') { moveTexture = { }; }
    else if (action == 'floor_texture_offset_x_sub') { moveTexture = { }; }
    else if (action == 'floor_texture_offset_y_add') { moveTexture = { }; }
    else if (action == 'floor_texture_offset_y_sub') { moveTexture = { }; }
  }
}


var menuUI = { open: false, type: '', select: null };

// определяем 
function detectMenuUI(action) {
  if (action == 'open-catalog') { menuUI.open = true; menuUI.type = 'catalog_self'; }
  else if (action == 'open-catalog-menu') { menuUI.open = true; menuUI.type = 'catalog_full'; }
  else if (action == 'close-catalog-menu') { menuUI.open = false; }

  else if (action == 'window' || action == 'singleWindow' || action == 'doubleWindow' || action == 'tripleWindow') { menuUI.type = 'toolbar'; }
  else if (action == 'leftDoor' || action == 'centerDoor' || action == 'rightDoor') { menuUI.type = 'toolbar'; }
  else if (action == 'door' || action == 'singleDoor' || action == 'doubleDoor' || action == 'tripleDoor' || action == 'doorway') { menuUI.type = 'toolbar'; }

  else if (action == 'open-design-catalog') { menuUI.open = true; menuUI.type = 'catalog_ugol_design'; }
}


// заменаяем материал/объект
function sendMessReplaceObj(value) {
  if (!clickO.last_obj) return;
  var obj = clickO.last_obj;
  var tag = clickO.last_obj.userData.tag;

  if (tag == 'wall') {
    var lotid = obj.userData.material[clickO.index].lotid;
    UI.catalogFilter = obj.userData.material[clickO.index].filters;
    UI.catalogSource = obj.userData.material[clickO.index].catalog;
  }
  else if (tag == 'room' || tag == 'ceiling') {
    var lotid = obj.userData.material.lotid;
    UI.catalogFilter = obj.userData.material.filters;
    UI.catalogSource = obj.userData.material.catalog;

    if (value == 'plinths-select') {
      var lotid = (tag == 'room') ? obj.userData.room.plinth.lotid : obj.userData.ceil.plinth.lotid;
    }
  }
  else if (tag == 'obj') {
    var lotid = obj.userData.obj3D.lotid;

    if (obj.userData.obj3D.boxPop) {
      obj.geometry.computeBoundingBox();
      obj.geometry.computeBoundingSphere();
      var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x)) / 1;
      var y = (Math.abs(obj.geometry.boundingBox.max.y) + Math.abs(obj.geometry.boundingBox.min.y)) / 1;
      var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z)) / 1;

      // поправка на масштаб объекта
      x *= obj.scale.x;
      y *= obj.scale.y;
      z *= obj.scale.z;

      x = Math.round(x * 100) / 100;
      y = Math.round(y * 100) / 100;
      z = Math.round(z * 100) / 100;

      var size = new THREE.Vector3(x, y, z);
    }
  }
  else if (tag == 'door') {
    var lotid = obj.userData.door.lotid;
  }
  else {
    return;
  }

  var mess = { lotid: lotid, category: value, filter: UI.catalogFilter, source: UI.catalogSource };
  if (size) { mess.size = size; };

  sendMessage('EDITOR.OPEN_CATALOG', mess);
}



function getErrorKey(code) {
  switch (parseInt(code)) {
    case 404:
      return 'project_not_found';
    case 403:
      return 'forbidden';
    default:
      return 'error';
  }
}

//Изменение инпутов по стрелочкам
$('[data-source="input"]').on('keydown', function (e) {
  if (e.keyCode != 38 && e.keyCode != 40) return;

  var $input = $(this);
  var incVal = parseFloat($input.data('step')) || 10;
  var minValue = $input.data('min');
  var value;

  if (e.altKey) { incVal = (incVal / 10 < 0.1) ? 0.1 : incVal / 10; }
  else if (e.ctrlKey) { incVal = incVal * 10; }
  else if (e.shiftKey) { incVal = incVal * 100; }

  if (e.keyCode == 38) {
    value = parseFloat($input.val()) || 0;
    $input.val(toFixed(value + incVal));
    e.preventDefault();
  }

  if (e.keyCode == 40) {
    value = parseFloat($input.val()) || 0;
    if (typeof minValue !== 'undefined') {
      value = (value - incVal <= minValue) ? minValue : value - incVal;
    } else {
      value = value - incVal;
    }

    $input.val(toFixed(value));
    e.preventDefault();
  }

  function toFixed(value) {
    return Math.round(value * 100) / 100;
  }

  emitAction($input.data('action'), $input.val(), $input);
});

$('[data-source="input"]').on('change keyup', function () {
  var $input = $(this);
  var value = $input.val();

  if (value.replace(/\s/g, '') === '') {
    value = 0;
  }

  emitAction($input.data('action'), value, $input);
});

$('[data-source="input"]').on('blur', function () {
  var $input = $(this);
  var value = $input.val();

  if (value.replace(/\s/g, '') === '') {
    $input.val(0);
  }
})

//Вводим только числа
$('[data-source="input"]').on('keypress paste', function (e) {
  if (e.type === 'paste' && !e.originalEvent.clipboardData.getData('text').match(/^[\d.,-]+$/)) { return false; }
  if (e.type === 'keypress' && !e.originalEvent.key.match(/^[\d.,-]+$/) && e.originalEvent.key.length == 1) { return false; }
});

//Не даём спуститься событиям в редактор
$('.toolbar__submenu, .b-toolbar, .interface-shade, .i-help-wrap, .i-help, .help__wrap,  .overlay-btn, .angle-range, .camera-range, .make-render').on('mousedown wheel DOMMouseScroll mousewheel', function (e) {
  e.stopPropagation();
});

$('[data-source="input"').on('keydown keyup keypress', function (e) {
  if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
    e.stopPropagation();
  }
});

$('.toolbar__submenu, .b-toolbar, .overlay-btn').mousemove(function (e) {
  if (UI.isMouseDown) {
    $('.ui-layer').css('pointerEvents', 'none');
    return;
  }
  e.stopPropagation();
});


//Верхний тулбар, подменю
$('.toolbar__submenu').click(function () {
  $(this).hide();
  var $that = $(this);
  setTimeout(function () { $that.show(); }, 100);
});


//Скрытие селектов, нижний тулбар
$('.ui-layer').click(function (e) {
  if (e.target.className !== 'select__value') {
    $('.select').each(function () {
      $(this).removeClass('select_open');
    });
  }
});


//Скрытие оверлей-селектов(единицы измерения, ползунки камер)
$('.ui-layer').click(function (e) {
  if (e.target.className !== 'overlay-select__value') {
    $('.overlay-select').each(function () {
      if (!$(this).hasClass('overlay-select_open')) return;
      var $el = $(this);
      var $items = $el.find('.overlay-select__items');
      toggleAnimation($items, $el, 'overlay-select_open');
    });
  }
  if (e.target.className !== 'overlay-menu__control' && e.target.className !== 'range-slider-track' && e.target.className !== 'dragger') {
    $('.overlay-menu_open').each(function () {
      var $el = $(this);
      var $items = $el.find('.overlay-menu__items');
      if ($items.length === 0) $items = $el.find('.overlay-menu__items_vertical');
      toggleAnimation($items, $el, 'overlay-menu_open');
    });
  }
  if (e.target.className !== 'overlay-select-menu__value') {
    $('.overlay-select-menu').removeClass('overlay-select-menu--open');
  }
});


//Работа селекта, нижний тулбар
$('.select').click(function (e) {
  $(this).toggleClass('select_open');
  if (e.target.className === 'select__option') {
    $(e.currentTarget).children('.select__value').html(e.target.innerHTML);
    emitAction($(this).data('action'), e.target.innerHTML, $(this));
  }
});


//Селект оверлея
$('.overlay-select__value').click(function () {
  if ($(this).hasClass('disabled') || $(this).find('.disabled').length) return;
  var $el = $(this);
  var $items = $el.siblings('.overlay-select__items');
  var $parent = $el.closest('.overlay-select');
  toggleAnimation($items, $parent, 'overlay-select_open');
});


$('.overlay-select__items [data-value]').click(function () {
  var $target = $(this);
  var $select = $target.closest('.overlay-select');
  var $items = $target.closest('.overlay-select__items');

  $select.attr('data-selected', $target.data('value'));
  toggleAnimation($items, $select, 'overlay-select_open');
  $select.children('.overlay-select__value').html($target.html());

  emitAction($select.data('action'), $target.data('value'), $select);
});


$('.overlay-select-menu__value').click(function () {
  if ($(this).hasClass('disabled') || $(this).find('.disabled').length) return;
  var $el = $(this);
  var $parent = $el.closest('.overlay-select-menu');
  $parent.toggleClass('overlay-select-menu--open');
})


$('.overlay-select-menu__list').click(function () {
  var $el = $(this);
  var $parent = $el.closest('.overlay-select-menu');
  $parent.toggleClass('overlay-select-menu--open');
})


//Показ/скрытие регулировок угла обзора
$('.overlay-menu__control').click(function () {
  var $el = $(this);
  var $items = $el.siblings('.overlay-menu__items, .overlay-menu__items_vertical');
  toggleAnimation($items, $el.closest('.overlay-menu'), 'overlay-menu_open');
});


//Анимации по открытию/закрытию
function toggleAnimation($el, $parent, className) {
  $el.data({ 'animationName': $el.css('animationName') });
  $el.css({ 'animationName': 'unset' });
  var dir = ($el.css('animationDirection') === 'reverse') ? 'normal' : 'reverse';
  if (dir == 'normal') {
    $el.data('isOpen', true);
    $el.show();
    if (typeof $parent !== 'undefined') {
      $parent.addClass(className);
    }
  }
  if (dir == 'reverse') {
    $el.data({ 'animationHiding': true });
    if (typeof $parent !== 'undefined') {
      $parent.removeClass(className);
    }
  }
  $el.css({ 'animationName': $el.data('animationName'), 'animationDirection': dir });
  $el.on('animationend', function () {
    if ($el.css('animationDirection') == 'reverse') {
      $el.hide();
      $el.data('isOpen', false);
    }
  });
}


$('.img-select__clear-btn').click(function () {
  $(this).siblings('.img-select__img').css({ 'background-image': '' });
  emitAction('clear-plinths-preview', null, $(this));
});

$('[data-chain]').each(function () {
  new ChainInput(this);
});





function Loader(text) {
  this.visible = false;
  this.$loader = $('.loader');
  this.$content = $('.loader__content');
  this.$textElement = $('.loader__text');
  this.$textElement.html(text || '');
  this.show = function (text) {
    this.$textElement.html(text);
    this.visible = true;
    this.$loader.show();
  };
  this.hide = function () {
    this.$loader.fadeOut();
  };
  var self = this;
  this.$content.on('click', function () {
    self.$loader.toggleClass('loader-small');
  });
}


var loader = new Loader('Загрузка проекта');


var roomTypes = [{ 'id': 2, 'caption': 'Кухня', 'color': 'e0e0e0', 'options': '', 'alias': 'kitchen' },
{ 'id': 4, 'caption': 'Гостиная', 'color': 'e0e0e0', 'options': 'IsDefault', 'alias': 'living room' },
{ 'id': 3, 'caption': 'Кухня-гостиная', 'color': 'e0e0e0', 'options': '', 'alias': '' },
{ 'id': 5, 'caption': 'Спальня', 'color': 'e0e0e0', 'options': '', 'alias': 'bedroom' },
{ 'id': 6, 'caption': 'Гардеробная', 'color': 'e0e0e0', 'options': '', 'alias': 'dressing room' },
{ 'id': 7, 'caption': 'Кабинет', 'color': 'e0e0e0', 'options': '', 'alias': 'home office' },
{ 'id': 8, 'caption': 'Детская', 'color': 'e0e0e0', 'options': '', 'alias': 'child\'s room' },
{ 'id': 9, 'caption': 'Прихожая', 'color': 'e0e0e0', 'options': '', 'alias': 'hall' },
{ 'id': 10, 'caption': 'Коридор', 'color': 'e0e0e0', 'options': '', 'alias': 'corridor' },
{ 'id': 11, 'caption': 'Туалет', 'color': 'e0e0e0', 'options': '', 'alias': 'toilet/WC' },
{ 'id': 12, 'caption': 'Ванная', 'color': 'e0e0e0', 'options': '', 'alias': '173_bathroom' },
{ 'id': 13, 'caption': 'С/у совмещенный', 'color': 'e0e0e0', 'options': '', 'alias': 'bathroom_combined' },
{ 'id': 15, 'caption': 'Балкон', 'color': 'e0e0e0', 'options': '', 'alias': '73_balcon' },
{ 'id': 18, 'caption': 'Техническое помещение', 'color': 'e0e0e0', 'options': '', 'alias': 'technical room' },
{ 'id': 19, 'caption': 'Кладовая', 'color': 'e0e0e0', 'options': '', 'alias': 'storage room' },
{ 'id': 20, 'caption': 'Лоджия', 'color': 'e0e0e0', 'options': '', 'alias': 'loggia' }];


function TEMPgetRoomType(name) {
  for (var i = 0; i < roomTypes.length; i++) {
    if (roomTypes[i].caption === name) {
      return roomTypes[i];
    }
  }
}


function initRoomTypeSelect(roomTypes) {
  var $select = $('[data-action="room-type"]').find('.select__options');
  for (var i = 0; i < roomTypes.length; i++) {
    $select.append('<li class="select__option">' + roomTypes[i].caption + '</li>');
  }
  
}


$('[data-subtoolbar]').click(function () {
  var $this = $(this);
  var targetToolbar = $this.data('subtoolbar');
  var toolbarIsOpen = $this.data('open');

  $this.data('open', !toolbarIsOpen);

  if (toolbarIsOpen) {
    hideToolbar(targetToolbar)
  } else {
    showSubToolbar(targetToolbar);
  }
});

$('.b-toolbar__toggle-btn').click(function () {
  var $this = $(this);
  var toolbarIsOpen = $this.data('open');

  toolbarIsOpen ?
    $this.addClass('b-toolbar__toggle-btn--active') :
    $this.removeClass('b-toolbar__toggle-btn--active');
});


$('[data-rel]').on('mousedown', handleRellMouseDown);

function handleRellMouseDown() {
  var $this = $(this);
  var targetAction = $this.data('rel');
  var $target = $('[data-action="' + targetAction + '"]');
  var action = $this.data('relAction');
  var step = $target.data('step');
  var interval = $this.data('relInt');
  var mouseDown = true;
  var minInterval = 25;
  var decreaseStep = 200;
  var firstDelay = 500;

  repeatableAction(interval);

  function repeatableAction(interval) {
    var _interval = interval;

    function repeat() {
      if (!firstDelay) {
        _interval = _interval <= minInterval ? _interval = minInterval : _interval -= decreaseStep;
      }

      if (mouseDown) {
        emitAction(targetAction, doRelAction($target, action, step), $target)
        setTimeout(repeat, firstDelay ? firstDelay : _interval);
      }
      firstDelay = false;
    }

    return repeat();
  }

  function clear() {
    mouseDown = false;
    $(document).off('mouseup', $this, clear);
  }

  $(document).on('mouseup', $this, clear);
}


function doRelAction($target, action, step) {
  var floatValue = parseFloat($target.val()) || 0;
  var floatStep = parseFloat(step) || 1;

  function toFixed(value) {
    return Math.round(value * 100) / 100;
  }

  switch (action) {
    case 'add':
      $target.val(toFixed(floatValue + floatStep));
      return $target.val();
    case 'sub':
      $target.val(toFixed(floatValue - floatStep));
      return $target.val();
    default:
      $target.val();
  }
}


function addDecor($el, decor) {
  $el.val($el.val() + decor);
}

$('[data-source="input"][data-decor]').each(function () {
  addDecor($(this), $(this).data('decor'));
});

$('[data-source="input"][data-decor]').focusout(function () {
  addDecor($(this), $(this).data('decor'));
});

$('[data-source="input"][data-decor]').focus(function () {
  var $this = $(this);
  var value = parseInt($this.val());
  value ? $this.val(value) : $this.val(0);
})

function formatInputValue($el) {
  if (!$el.is(":focus") && $el.data('decor')) {
    addDecor($el, $el.data('decor'));
  }
}


initRoomTypeSelect(roomTypes);

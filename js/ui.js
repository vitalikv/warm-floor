var UI = (function () {

  var isMouseDown = false;
  var activeInput = '';
  var currentView = '2D';
  var currentViewMode = 'bird';
  var lastView = '2D';
  var renderMode = 'false';
  var catalogFilter = '';
  var catalogSource = {};
  var tooltipTimer;
  var keyPressed = {};
  var $layer = $('.ui-layer');
  var currentCursor = '';
  var statsPanel = {};
  var dataShow = {};
  var mouse = {
    x: 0,
    y: 0
  };
  var objectCaption = {
    object: ''
  };
  var projectInfo = {
    file: '',
    hash: '',
    objectId: '',
    visible: false,
    element: null
  };
  var $objectPreviewElement = $('<div class="object-preview"></div>');
  $('.ui-layer').append($objectPreviewElement);
  var objectPreview = {
    image: null,
    $element: $objectPreviewElement
  };
  var objectCaptionTemplate = $('<div class="object-caption"></div>');
  $('.ui-layer').append(objectCaptionTemplate);
  var alertTemplate = '<div class="alert"> \
    <div class="alert__text"> \
    </div> \
    </div>';
  var alertBtnTemplate = '<div class="alert__btn">Пожаловаться</div>';

  function UIElement(action) {
    this.$el = $('[data-action*="' + action + '"]');
    return this;
  }

  var UI = function (action) {
    return new UIElement(action);
  };

  UIElement.prototype.val = function (value) {
    if (typeof value !== 'undefined') {
      switch (this.$el.data('source')) {
        case 'select':
          this.$el.children('.select__value').html(value);
          this.$el.data('value', value);
          break;
        case 'input':
          if (this.$el.data('type') === 'degrees') {
            this.$el.val(value % 360);
          } else {
            this.$el.val(value);
          }
          formatInputValue(this.$el);
          break;
        case 'radio':
          this.$el.data('selected', value);
          break;
        case 'preview':
          (value !== '') ? this.$el.css({ 'backgroundImage': 'url("' + makeThumbUrl(value, '54x54') + '")', 'backgroundSize': 'cover', 'backgroundColor': '#FFFFFF' }) : this.$el.css({ 'backgroundImage': '', 'backgroundSize': 'auto', 'backgroundColor': '' });
          (value !== '') ? this.$el.attr('data-selected', true) : this.$el.attr('data-selected', false);
          break;
        case 'img-select':
          this.$el.children('.select__img').css({ 'backgroundImage': 'url("' + makeThumbUrl(value, '60x30') + '")' });
          break;
        default:
          this.$el.data('value', value);
      }
      return this;
    }

    switch (this.$el.data('source')) {
      case 'select':
        value = this.$el.children('.select__value').html();
        break;
      case 'input':
        value = this.$el.val();
        break;
      case 'radio':
        value = this.$el.data('selected');
        break;
      default:
        value = this.$el.data('value');
    }
    return value;
  };

  UIElement.prototype.getVisibleElement = function () {
    if (this.$el.length === 1) return this.$el;
    for (var i = 0; i < this.$el.length; i++) {
      if ($(this.$el[i]).is(':visible')) {
        return $(this.$el[i]);
      }
    }
  };

  function toggleRenderMode() {
    if (renderMode) {
      $('.ui-layer').removeClass('render-mode');
    } else {
      $('ui-layer').addClass('render-mode');
    }
  }

  function makeThumbUrl(url, size) {
    var parsedUrl = url.match(/(.*thumb)(\d+)?(x)(\d+)?(.*)/i);
    if (!parsedUrl) return url;
    return parsedUrl[1] + size + parsedUrl[5];
  }

  function disableTopButtons() {
    $('[data-action="line"]').parent('li').addClass('disabled--in-2d');
    $('[data-action="zone"]').parent('li').addClass('disabled--in-2d');
    $('[data-action="door"]').parent('li').addClass('disabled--in-2d');
    $('[data-action="window"]').parent('li').addClass('disabled--in-2d');
    $('[data-action="doorway"]').parent('li').addClass('disabled--in-2d');
  }

  function enableTopButtons() {
    $('[data-action="line"]').parent('li').removeClass('disabled--in-2d');
    $('[data-action="zone"]').parent('li').removeClass('disabled--in-2d');
    $('[data-action="door"]').parent('li').removeClass('disabled--in-2d');
    $('[data-action="window"]').parent('li').removeClass('disabled--in-2d');
    $('[data-action="doorway"]').parent('li').removeClass('disabled--in-2d');
  }

  function disableRenderButton() {
    $('.render-group').fadeOut();
  }

  function enableRenderButton() {
    $('.render-group').fadeIn();
  }

  function changeView(view) { // Перключение с 2д на 3д
    this.lastView = currentView;

    if (view === 'render') {
      hideUIForRender();
      switchTo3D();
      switchToRender();
    } else if (view === 'window') {
      disableRenderButton();
      disableTopButtons();
      disableViewButtons();
      currentView = view;
    } else if (currentView === 'window') {
      switchToLastview();
      enableViewButtons();
      emitAction('exitCameraWindow');
    } else if (currentView === '2D') {
      switchTo3D();
      changeCamera(camera3D);
    } else if (currentView === '3D') {
      switchTo2D();
      changeCamera(cameraTop);
    } else if (currentView === 'render') {
      showUIAfterRender();
      switchTo3D();
    }
    setViewButtonValue();
  }

  function disableViewButtons() {
    $('.change-view-mode').fadeOut();
    $('.view-controls__middle').fadeOut();
  }

  function enableViewButtons() {
    $('.change-view-mode').fadeIn();
    $('.view-controls__middle').fadeIn();
  }

  function setView(view) {
    if (view === currentView) return;
    if (view === '3D') {
      showUIAfterRender();
      switchTo3D();
      changeCamera(camera3D);
      setViewButtonValue();
    }
    if (view === '2D') {
      showUIAfterRender();
      switchTo2D();
      changeCamera(cameraTop);
      setViewButtonValue();
      $('.change-view-mode').css('display', 'none');
      console.log($('.change-view-mode'))
    }
  }

  function switchToLastview() {
    currentView = lastView;
    if (lastView === '2D') {
      switchTo3D();
    }
    if (lastView === '3D') {
      switchTo2D();
    }
  }

  function hideUIForRender() {
    $('.ui-layer').addClass('render-mode');
    $('.toolbar-wrap').fadeOut();
    $('.b-toolbar-wrap').fadeOut();
    $('.open-catalog').fadeOut();
    $('.help-btn').fadeOut();
    $('.left-controls-wrap').fadeOut();
    $('.tutorial').fadeOut();
    $('.make-render').fadeIn();
    emitAction('hideCatalogButton');
  }

  function showUIAfterRender() {
    $('.ui-layer').removeClass('render-mode');
    $('.toolbar-wrap').fadeIn();
    $('.b-toolbar-wrap').fadeIn();
    $('.open-catalog').fadeIn();
    $('.help-btn').fadeIn();
    $('.left-controls-wrap').fadeIn();
    $('.tutorial').fadeIn();
    $('.make-render').fadeOut();
    enableViewButtons();
    emitAction('showCatalogButton');
  }

  function switchToRender() {
    currentView = 'render';
  }

  function switchTo2D() {
    $('.view-controls__control').hide();

    currentView = '2D';
    console.log('2D')
    $('.change-view-mode').stop();
    $('.change-view-mode').hide();
    $('.toggle-sizes').css('display', '');
    $('.control-2d').css('display', '');
    // $('.render-group').fadeOut();
    enableTopButtons();
  }

  function switchTo3D() {
    $('.view-controls__control').hide();

    currentView = '3D';
    console.log('3D')
    $('.change-view-mode').css('display', 'flex');
    $('.toggle-sizes').hide();
    if (currentViewMode === 'bird') {
      $('.control-bird').show();
    } else {
      $('.control-man').show();
    }
    $('.render-group').fadeIn();
    disableTopButtons();
    enableRenderButton();
  }

  function setRenderMode(mode) {
    var btnHTML;
    this.renderMode = mode;
    if (mode === 'render') {
      btnHTML = 'Сделать фотореалистичный снимок';
    } else if (mode === 'vr-panorama') {
      btnHTML = 'Сделать панораму';
    }
    $('.make-render').html(btnHTML);
  }

  function setViewButtonValue() {
    var $btn = $('[data-action="changeView"');
    $btn.attr('data-selected', currentView);
  }

  // Переключение свободный вид/прогулка
  function changeViewMode($target) 
  {    
	$('.view-controls__control').hide();
    
	if (currentViewMode === 'bird') 
	{
      currentViewMode = 'man';
      $('.control-man').show();

      showAllWallRender();

      camera3D.userData.camera.height = camera.position.y;
      camera3D.userData.camera.dist = centerCam.distanceTo(camera.position);
      camera3D.userData.camera.type = 'first';

      newCameraPosition = { positionFirst: new THREE.Vector3(camera.position.x, ($('.range-slider2').attr("value") / 100) * 2 + 0.2, camera.position.z) };
    } 
	else 
	{
      currentViewMode = 'bird';
      $('.control-bird').show();

      wallAfterRender_2();
      camera3D.userData.camera.type = 'fly';
      newCameraPosition = { positionFly: new THREE.Vector3(camera.position.x, camera3D.userData.camera.height, camera.position.z) };
    }
	
    $target.attr('data-selected', currentViewMode);
    $target.toggleClass('ic-man');
    $target.toggleClass('ic-bird');
  }


  function setViewMode(view) {
    if (view === currentViewMode) return;
    else (UI.changeViewMode($('[data-action="changeViewMode"]')));
  }

  function toggleObjBtn(target) {  //Активная кнопка верхнего тулбара
    $('.overlay-btn_active').removeClass('overlay-btn_active');

    if (typeof target !== 'undefined') {
      $(target).addClass('overlay-btn_active');
    }
  }

  function showAlert(message, type, duration, buttonFn, loaderId) {
    if (loaderId && $('#' + loaderId).length > 0) return;
    var className;
    var time = (typeof duration !== 'undefined') ? duration : 5000;
    var $el = $(alertTemplate);
    var btn = $(alertBtnTemplate);

    if (type === 'warning' || type === 'success' || type === 'loader' || type === '') {
      className = (type === '') ? '' : 'alert_' + type;
      $el.addClass(className);
    }

    if (type === 'loader') {
      var $progerssBar = '<div class="alert__progress"></div>';
      $el.append($progerssBar);
      $el.attr('id', loaderId);
    }

    $el.children('.alert__text').html(message);

    if (buttonFn) {
      btn.on('click', buttonFn);
      $el.append(btn);
    }

    $('.alert-container').append($el);
    if (type !== 'loader') {
      setTimeout(function () {
        hideElement($el, function () { $el.remove(); });
      }, time);
    }
  }

  function hideElement($el, callback) {
    $el.css({ 'animationFillMode': 'none' });
    $el.fadeTo(300, 0, function () {
      if (typeof callback === 'function') callback();
    });
  }

  function startFakeLoading(id, total, current) {
    var next = current + randomInt(1, 20);
    current = next;
    if (next >= total - 1) {
      next = total - 1;
      current = 0;
    }
    updateProgressBar(id, total, next);
    window[id + 'loader'] = setTimeout(function () {
      startFakeLoading(id, total, current);
    }, randomInt(1, 5) * 100);
  }

  function stopFakeLoading(id) {
    clearTimeout(window[id + 'loader']);
    updateProgressBar(id, 100, 100);
  }

  function randomInt(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  }

  function updateProgressBar(id, total, current) {
    var progress = (current / total) * 100;
    var $progressBar = $('#' + id + ' .alert__progress');
    var $el = $('#' + id);
    $progressBar.css({ width: progress + '%' });

    clearTimeout(window[id]);
    window[id] = setTimeout(function () {
      hideElement($el, function () { $el.remove(); });
    }, 60000);

    if (progress >= 100) {
      clearTimeout(window[id]);
      setTimeout(function () {
        hideElement($el, function () { $el.remove(); });
      }, 500);
    }
  }

  var toolTips = {
    'save': 'Сохранить проект',
    'clone': 'Дублировать проект',
    'undo': 'Отменить',
    'redo': 'Вернуть',
    'line': 'Построение по точкам',
    'zone': 'Зонирование',
    'doorway': 'Установить проём',
    'zoomIn': 'Приблизить',
    'zoomOut': 'Отдалить',
    'angle': 'Угол камеры',
    'cameraHeight': 'Высота камеры',
    'units': 'Единицы измерения',
    'center': 'По центру',
    'ceilingHeight': 'Высота потолка',
    'render': 'Фотореалистичный снимок'
  };

  function showTooltip(el) {
    var tipText = toolTips[$(el).data('action')];
    var $tipTemplate = $('<div class="tooltip">' + tipText + '</div>');
    var $el = $(el);

    if (typeof tipText === 'undefined') return;
    if ($el.parents('.toolbar').length > 0) $tipTemplate.css({ 'top': '45px', 'left': 'initial' });
    if ($el.parents('.view-controls').length > 0) $tipTemplate.css({ 'right': '45px', 'top': '50%', 'marginTop': '-11px' });
    if ($el.parents('.left-controls').length > 0) $tipTemplate.css({ 'left': '50%', 'top': '-27px', 'transform': 'translateX(-50%)' });
    if ($el.offset().left <= 20) $tipTemplate.css({ 'marginLeft': '30px' });

    $el.append($tipTemplate);
    $tipTemplate.fadeTo(150, 1);
  }

  function hideTooltip(el) {
    $(el).children('.tooltip').fadeTo(100, 0, function () {
      $(this).remove();
    });
  }

  function setCatalogData(object, index) {
    this.catalogFilter = (index) ? object.userData.material.filters[index] : object.userData.material.filters;
    this.catalogSource = (index) ? object.userData.material.catalog[index] : object.userData.material.catalog;
  }

  function handleKeyDown(e) {
    var key = e.keyCode;
    if (!UI.keyPressed[key]) {
      UI.keyPressed[key] = true;
    }
    if (UI.keyPressed[17] && UI.keyPressed[18] && UI.keyPressed[73]) {
      UI.toggleProjectInfo();
    }
    if (UI.keyPressed[16] && UI.keyPressed[17] && UI.keyPressed[70]) {
      UI.toggleStatsPanel('fps');
    }
    if (UI.keyPressed[17] && UI.keyPressed[18] && UI.keyPressed[79]) {
      openLogBrowser();
    }
    if (UI.keyPressed[17] && UI.keyPressed[18] && UI.keyPressed[82]) {
      toggleLogControls();
    }
  }

  function handleKeyUp(e) {
    UI.keyPressed[e.keyCode] = false;
  }

  function toggleStatsPanel(panel) {
    var panels = {
      fps: 0,
      ms: 1,
      mb: 2
    };
    if (UI.statsPanel[panel]) {
      document.body.removeChild(stats.dom);
      UI.statsPanel[panel] = false;
    } else {
      UI.statsPanel[panel] = true;
      stats.showPanel[panels[panel]];
      document.body.appendChild(stats.dom);
    }
  }

  function toggleProjectInfo() {
    var $el = $(getProjectInfoElement());
    UI.projectInfo.visible ? UI.projectInfo.visible = false : UI.projectInfo.visible = true;
    if (log.length > 0) {
      $('.savelog').show();
    } else {
      $('.savelog').hide();
    }
    $el.toggleClass('visible');
  }

  function getProjectInfoElement() {
    var el = UI.projectInfo.element || document.querySelector('.projectInfo');
    if (!el) {
      el = document.createElement('div');
      el.className = 'projectInfo';
      document.body.appendChild(el);

      el.addEventListener('mousedown', function (e) {
        e.stopPropagation();
      });
      document.addEventListener('click', function (e) {
        if (UI.projectInfo.visible && e.target !== el) {
          UI.toggleProjectInfo();
        }
      });
      UI.projectInfo.element = el;
    }
    return el;
  }

  function setProjectInfo(hash, file, objectId) {
    var $el = $(getProjectInfoElement());
    var info = '';
    var hash = hash || UI.projectInfo.hash;
    var file = file || UI.projectInfo.file;
    var objectId = objectId || UI.projectInfo.objectId;

    if (hash) {
      UI.projectInfo.hash = hash;
      info += 'hash: ' + hash + ' <input class="projectInfo__copy" onclick=\'UI.handleCopyClick("hash")\' type="button" value="копировать"/><br>';
    }
    if (file) {
      UI.projectInfo.file = file;
      info += 'file: ' + file + ' <input class="projectInfo__copy" onclick=\'UI.handleCopyClick("file")\' type="button" value="копировать"/><br>';
    }
    if (objectId) {
      UI.projectInfo.objectId = objectId;
      info += 'lotId: ' + objectId + ' <input class="projectInfo__copy" onclick=\'UI.handleCopyClick("objectId")\' type="button" value="копировать"/><br>';
    }
    var saveLogButton = '<div class="savelog" style="margin-top: 20px"><input class="projectInfo__copy" onclick=\'saveLog()\' type="button" value="Сохранить лог"/></div>';

    if (info === '') {
      $el.html('нет данных' + saveLogButton);
    } else {
      $el.html(info + saveLogButton);
    }
  }

  function handleCopyClick(param) {
    UI.copyToClipboard(UI.projectInfo[param]);
  }

  function copyToClipboard(text) {
    var el = document.createElement('textarea');
    el.textContent = text;
    el.style.position = 'fixed';
    document.body.appendChild(el);
    el.select();
    try {
      return document.execCommand('copy');
    } catch (ex) {
      return false;
    } finally {
      document.body.removeChild(el);
    }
  }

  function setObjectCaption(caption, object) {
    if (object) {
      UI.objectCaption[object] = caption;
    } else {
      UI.objectCaption.object = caption;
    }
  }

  function showObjectCaption() {
    if ($(this).data('action').split(' ')[1] === 'plinth-preview') {
      if (typeof UI.objectCaption.plinth === 'undefined' || UI.objectCaption.plinth.length === 0) return;
      UI.objectCaptionTemplate.html(UI.objectCaption.plinth);
    } else if ($(this).data('action').split(' ')[1] === 'handle-preview') {
      if (typeof UI.objectCaption.handle === 'undefined' || UI.objectCaption.handle.length === 0) return;
      UI.objectCaptionTemplate.html(UI.objectCaption.handle);
    } else {
      if (typeof UI.objectCaption.object === 'undefined' || UI.objectCaption.object.length === 0 || UI.objectCaption.object === 'defaultWall') return;
      UI.objectCaptionTemplate.html(UI.objectCaption.object);
    }
    var width = UI.objectCaptionTemplate.width();
    var left = $(this).offset().left - width / 2 + $(this).width() / 2;
    var top = $(this).offset().top - 30;
    UI.objectCaptionTemplate.css({ opacity: 1, left: left, top: top });
  }

  function hideObjectCaption() {
    UI.objectCaptionTemplate.css({ opacity: 0 });
  }

  function showObjectPreview(preview) {
    var offsetX = 7;
    var offsetY = 20;
    UI.objectPreview.image = preview;
    UI.objectPreview.$element.css({
      backgroundImage: 'url(' + makeThumbUrl(preview, '54x54') + ')',
      left: UI.mouse.x + offsetX + 'px',
      top: UI.mouse.y + offsetY + 'px'
    });
  }

  function hideObjectPreview() {
    UI.objectPreview.image = null;
    UI.objectPreview.$element.css({ opacity: 0 });
  }

  function handleMouseMove(e) {
    var x = e.clientX;
    var y = e.clientY;

    if (UI.objectPreview.image) {
      var offsetX = 7;
      var offsetY = 20;
      UI.objectPreview.$element.css({ left: x + offsetX + 'px', top: y + offsetY + 'px', opacity: 1 });
    }
    UI.mouse.x = x;
    UI.mouse.y = y;
  }

  function setCursor(type) {
    if (type == UI.currentCursor) return;
    UI.currentCursor = type;
    $layer.removeClass('cursor--pointer');
    $layer.removeClass('cursor--grab');
    $layer.removeClass('cursor--grabbing');
    $layer.removeClass('cursor--vertical');
    $layer.removeClass('cursor--horizontal');
    $layer.removeClass('cursor--move');
    if (type) $layer.addClass('cursor--' + type);
  }

  function show(variable) {
    if (UI.dataShow[variable]) {
      UI.dataShow[variable].show();
    }
  }

  function hide(variable) {
    if (UI.dataShow[variable]) {
      UI.dataShow[variable].hide();
    }
  }

  function showSubToolbar(toolbar) {
    $('.' + toolbar).show();
    closeToolbarHelp();
  }

  function showToolbar(toolbar) {
    $('.b-toolbar').hide();
    $('.' + toolbar).show();
    $('[data-subtoolbar]').data('open', false);
    $('.b-toolbar__toggle-btn').removeClass('b-toolbar__toggle-btn--active');

  }

  function hideToolbar(toolbar) {
    $('.' + toolbar).hide();
    $('.b-toolbar--subtoolbar').hide();
    $('[data-subtoolbar]').data('open', false);
    $('.b-toolbar__toggle-btn').removeClass('b-toolbar__toggle-btn--active');
    
  }

  UI.isMouseDown = isMouseDown;
  UI.activeInput = activeInput;
  UI.currentView = currentView;
  UI.currentViewMode = currentViewMode;
  UI.catalogFilter = catalogFilter;
  UI.catalogSource = catalogSource;
  UI.changeView = changeView;
  UI.changeViewMode = changeViewMode;
  UI.toggleObjBtn = toggleObjBtn;
  UI.showAlert = showAlert;
  UI.hideElement = hideElement;
  UI.showTooltip = showTooltip;
  UI.hideTooltip = hideTooltip;
  UI.tooltipTimer = tooltipTimer;
  UI.toggleRenderMode = toggleRenderMode;
  UI.setRenderMode = setRenderMode;
  UI.renderMode = renderMode;
  UI.setView = setView;
  UI.setCatalogData = setCatalogData;
  UI.updateProgressBar = updateProgressBar;
  UI.handleKeyDown = handleKeyDown;
  UI.handleKeyUp = handleKeyUp;
  UI.setProjectInfo = setProjectInfo;
  UI.toggleProjectInfo = toggleProjectInfo;
  UI.keyPressed = keyPressed;
  UI.projectInfo = projectInfo;
  UI.setObjectCaption = setObjectCaption;
  UI.objectCaption = objectCaption;
  UI.showObjectCaption = showObjectCaption;
  UI.hideObjectCaption = hideObjectCaption;
  UI.objectCaptionTemplate = objectCaptionTemplate;
  UI.copyToClipboard = copyToClipboard;
  UI.handleCopyClick = handleCopyClick;
  UI.showObjectPreview = showObjectPreview;
  UI.objectPreview = objectPreview;
  UI.handleMouseMove = handleMouseMove;
  UI.hideObjectPreview = hideObjectPreview;
  UI.mouse = mouse;
  UI.setCursor = setCursor;
  UI.currentCursor = currentCursor;
  UI.toggleStatsPanel = toggleStatsPanel;
  UI.statsPanel = statsPanel;
  UI.show = show;
  UI.hide = hide;
  UI.dataShow = dataShow;
  UI.setViewMode = setViewMode;
  UI.showToolbar = showToolbar;
  UI.hideToolbar = hideToolbar;
  UI.showSubToolbar = showSubToolbar;
  UI.startFakeLoading = startFakeLoading;
  UI.stopFakeLoading = stopFakeLoading;

  return UI;
})();


$(document).mousedown(function () {
  UI.isMouseDown = true;
});


$(document).mouseup(function (e) {
  UI.isMouseDown = false;
  $('.ui-layer').css('pointerEvents', 'auto');
});


$(document).keydown(UI.handleKeyDown);
$(document).keyup(UI.handleKeyUp);


$('input').on('focus keyup change', function () {
  UI.activeInput = $(this).data('action');
});


$('input').blur(function () {
  UI.activeInput = '';
});


$(document).mousemove(UI.handleMouseMove);
$(document).mouseenter(UI.handleMouseMove);


$('[data-source="preview"]').on('mouseenter', UI.showObjectCaption);
$('[data-source="preview"]').on('mouseleave', UI.hideObjectCaption);


$('[data-show]').each(function () {
  var v = $(this).data('show');
  $(this).hide();
  UI.dataShow[v] = $(this);
})


var showToolbar = UI.showToolbar;
var showSubToolbar = UI.showSubToolbar;
var hideToolbar = UI.hideToolbar;

function lsTest() {
  var test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
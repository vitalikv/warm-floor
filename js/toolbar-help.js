
var helpIconTempalte = '<div class="help__icon">\
<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">\
    <g fill="none" fill-rule="evenodd">\
        <circle cx="8.5" cy="8.5" r="8.5" fill="#4A4A4A"/>\
        <path fill="#FFF" d="M8.362 10.996c-.486 0-.9-.378-.9-.864v-.216c0-.756.324-1.296 1.386-2.286 1.062-.954 1.296-1.314 1.296-1.944 0-.828-.63-1.44-1.44-1.44-.666 0-1.206.36-1.548 1.062-.216.378-.468.54-.81.54a.845.845 0 0 1-.846-.846c0-.216.054-.378.162-.576C6.22 3.202 7.336 2.5 8.776 2.5c1.89 0 3.33 1.278 3.33 2.988 0 .954-.45 1.71-1.584 2.718-.972.864-1.26 1.278-1.26 1.8l-.018.18c-.018.468-.396.81-.882.81zm.054 3.78c-.774 0-1.386-.594-1.386-1.35 0-.756.612-1.368 1.386-1.368.756 0 1.35.612 1.35 1.368 0 .756-.594 1.35-1.35 1.35z"/>\
    </g>\
</svg>\
</div>'


var toolbarHelpMessages = {
  items: ['wall-2d-toolbar', 'door-2d-toolbar', 'floor-2d-toolbar', 'floor-3d-toolbar', 'object-toolbar', 'wall-3d-toolbar', 'camera-wall-toolbar', 'window-toolbar'],
  'wall-2d-toolbar': {
    items: ['wallLength', 'thickness', 'separate', 'delete'],
    wallLength: 'Указывайте точную длину стены<br> и направление её изменения',
    thickness: 'Меняйте толщину стены в нужном направлении',
    separate: 'Нажмите на кнопку "Разбить стену", чтобы<br> добавить новую опорную точку',
    delete: 'Удаляйте стену'
  },
  'door-2d-toolbar': {
    items: ['preview', 'handle', 'sizes', 'direction', 'delete'],
    preview: 'Заменяйте одну дверь на другую',
    handle: 'Меняйте фурнитуру двери',
    sizes: 'Габариты полотна двери',
    direction: 'Выберите направление в котором будет открываться дверь',
    delete: 'Удаляйте дверь'
  },
  'window-toolbar': {
    items: ['sizes', 'floorDistance', 'delete'],
    sizes: 'Указывайте точные размеры оконного проема',
    floorDistance: 'Положение окна над полом',
    delete: 'Удаляйте окно'
  },
  'floor-2d-toolbar': {
    items: ['design', 'apply'],
    design: 'Перед тем как выбрать дизайн,<br> укажите назначение помещения',
    apply: 'Применяйте к своей комнате<br> понравившийся дизайн'
  },
  'floor-3d-toolbar': {
    items: ['preview', 'plinth', 'rotate', 'delete'],
    preview: 'Выберите чистовой материал пола. Заменяйте,<br> повторно нажав на миниатюру',
    plinth: 'Добавляйте плинтус на пол',
    rotate: 'Поворачивайте материал пола на 45 и 90 градусов',
    delete: 'Удаляйте материал пола'
  },
  'object-toolbar': {
    items: ['preview', 'sizes', 'rotate', 'floorDistance', 'delete'],
    preview: 'Миниатюра объекта. Нажав на неё, вы можете<br> заменить объект на любой другой',
    sizes: 'Габариты объекта',
    rotate: 'Поворачивайте объект на 45 и 90 градусов',
    floorDistance: 'Положение объекта над полом',
    delete: 'Удаляйте объект'
  },
  'wall-3d-toolbar': {
    items: ['preview', 'rotate', 'apply', 'objects', 'delete'],
    preview: 'Выбирайте чистовые отделочные материалы<br> стены. Заменяйте, повторно нажав на миниатюру.',
    rotate: 'Поворачивайте на 45 и 90 градусов',
    applyAll: 'Применяйте выбранный материал под нужным<br> углом ко всем стенам помещения',
    objects: 'Удобынй режим редактирования окон и объектов,<br> расположенных на стене',
    delete: 'Удаляйте материал'
  },
  'camera-wall-toolbar': {
    items: ['preview', 'rotate', 'delete'],
    preview: 'Выбирайте чистовые отделочные материалы<br> стены. Заменяйте, повторно нажав на миниатюру.',
    rotate: 'Поворачивайте на 45 и 90 градусов',
    delete: 'Удаляйте материал'
  }
}


var $toolbarHelp = $('.help__wrap');
var $toolbarHelpContent = $('.help__content');
var toolbarCurrentMessages = [];
var $toolbarHelpNext = $('.help__arrow.help__arrow-next');
var $toolbarHelpPrev = $('.help__arrow.help__arrow-prev');
var $toolbarHelpClose = $('.help__close');
var currentHelpIndex = 0;
var currentHelp = '';


$toolbarHelpNext.click(showNextHelp);
$toolbarHelpPrev.click(showPrevHelp);
$toolbarHelpClose.click(closeToolbarHelp);


function showNextHelp() {
  currentHelpIndex++;
  showToolbarHelpText();
}


function showPrevHelp() {
  currentHelpIndex--;
  showToolbarHelpText();
}


function initToolbarHelp() {
  for (var i = 0; i < toolbarHelpMessages.items.length; i++) {
    var $el = $(helpIconTempalte);
    (function () {
      var num = toolbarHelpMessages.items[i];
      $el.click(function () {
        var $activeToolbar = getActiveToolbar();
        if ($activeToolbar) {
          showToolbarHelp($activeToolbar, num, this);
        }
      })
    })();
    $('.' + toolbarHelpMessages.items[i]).append($el);
  }
}


function getActiveToolbar() {
  if ($('.b-toolbar:visible').length > 0)
    return $('.b-toolbar:visible')
}


function getToolbarHelp(toolbar) {
  return {
    $el: $('.' + toolbar),
    i: toolbar,
    icon: $('.' + toolbar).find('.help__icon')[0]
  }
}


function showToolbarHelp($toolbar, i, icon) {
  $(icon).css({ opacity: 0 });
  var previewWidth = 0;
  if ($toolbar.find('.b-toolbar__design-btn-wrap').length > 0) previewWidth = 50;
  var width = $toolbar.width() + 30 + previewWidth + 'px';
  $toolbarHelp.addClass('active');
  $toolbarHelp.css({ width: width })
  var items = toolbarHelpMessages[i].items;
  currentHelp = i;
  toolbarCurrentMessages = [];
  for (var j = 0; j < items.length; j++) {
    toolbarCurrentMessages.push({
      el: items[j],
      message: toolbarHelpMessages[i][items[j]]
    });
  }
  showToolbarHelpText(0);
}


function showToolbarHelpText(index) {
  if (toolbarCurrentMessages.length === 0) return;
  if (index) currentHelpIndex = index;
  if (typeof toolbarCurrentMessages[currentHelpIndex] === 'undefined' && currentHelpIndex > toolbarCurrentMessages.length - 1) {
    currentHelpIndex = 0;
  }
  if (typeof toolbarCurrentMessages[currentHelpIndex] === 'undefined' && currentHelpIndex < 0) {
    currentHelpIndex = toolbarCurrentMessages.length - 1;
  }
  var $section = $('.' + currentHelp + ' [data-help="' + toolbarCurrentMessages[currentHelpIndex].el + '"]');
  $('.help-active').removeClass('help-active');
  if ($section.length === 0) {
    var hasSections = checkForHelpSections();
    if (!hasSections) closeToolbarHelp();
    currentHelpIndex++;
    showToolbarHelpText();
    return;
  }
  $toolbarHelpContent.html(toolbarCurrentMessages[currentHelpIndex].message);
  $section.addClass('help-active');
}


function checkForHelpSections() {
  for (var i = 0; i < toolbarCurrentMessages.length; i++) {
    if ($('.' + currentHelp + ' [data-help="' + toolbarCurrentMessages[i].el + '"]').length > 0) {
      return true;
    }
  }
}


function closeToolbarHelp() {
  $toolbarHelp.removeClass('active');
  currentHelp = '';
  currentHelpIndex = 0;
  toolbarCurrentMessages = [];
  $('.help__icon').css({ opacity: '' });
  $('.help-active').removeClass('help-active');
}

initToolbarHelp();
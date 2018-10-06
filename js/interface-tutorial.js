var iHelp = {
  'toolbar': {
    el: 'toolbar',
    items: [
      {
        target: ['save'],
        header: ['Сохранить проект'],
        text: 'Сохраняйте проект, чтобы вернуться к нему позднее.<br>Проект будет доступен в личном кабинете.',
        hl: 'square'
      },
      {
        target: ['undo', 'redo'],
        header: ['Отменить', 'Вернуть'],
        text: 'Отмена и повторение последних действий',
        hl: 'square'
      },
      {
        target: ['line'],
        header: ['Построение по точкам'],
        text: 'Построение стен. С этого стоит начать, если вы хотите создать новое помещение.\
        Выбирайте построенную стену чтобы уточнить ее длину и ширину',
        hl: 'square'
      },
      {
        target: ['zone'],
        header: ['Зонирование'],
        text: 'Зонирование помещения — деление одной комнаты на разные функциональные зоны',
        hl: 'square'
      },
      {
        target: ['door', 'window', 'doorway'],
        header: ['Дверь', 'Окно', 'Проем'],
        text: 'Добавление стен, окон и проемов к стенам. Двери можно заменить на реальные образцы ',
        hl: 'square'
      },
      {
        target: ['render'],
        header: ['Фотореалистичное изображение'],
        text: 'Создание изображений вашего проекта. Занимает некоторое время. Сообщение о готовности придет к вам на почту.',
        hl: 'square'
      }
    ]
  },
  'view-controls__top': {
    el: 'view-controls__top',
    items: [
      {
        target: ['changeView'],
        header: ['Режим 3D'],
        text: 'Перейдите в режим 3D чтобы рассмотерть проект со всех сторон, а так же чтобы назначить материалы для стен и пола',
        hl: 'circle',
        mode: '2D'
      },
      {
        target: ['changeViewMode'],
        header: ['Прогулка'],
        text: 'Переключайте камеру в режим Прогулки, чтобы посмотреть на объекты с высоты человеческого роста',
        hl: 'circle',
        mode: '3D-bird'
      }
    ]
  },
  'estimate': {
    el: 'ui-layer',
    items: [
      {
        target: '',
        header: ['Смета проекта'],
        text: 'Узнавайте цену примененных материалов и мебели, а так же расчет стоимости ремонтных работ'
      }
    ]
  },
  'end-first': {
    el: 'help-btn',
    items: [
      {
        target: ['help'],
        header: ['Конец основного обучения'],
        text: 'Вы всегда можете повторно запустить Знакомство с интерфейсом в справочном центре.',
        hl: 'circle',
        showMore: true
      }
    ]
  },
  'units': {
    el: 'left-controls-wrap',
    items: [
      {
        target: ['units'],
        header: ['Единицы измерения'],
        text: 'Меняйте единицы измерения: <br>миллиметры, <br>сантиметры, метры',
        hl: 'circle-units'
      }
    ]
  },
  '2d-mode': {
    el: 'control-2d',
    items: [
      {
        target: ['centerCamera2d', 'zoomIn', 'zoomOut'],
        header: ['Режим 2D'],
        text: 'Управляйте сценой в режиме 2D: <br><br>Отцентрировать план <br><br>Приблизить <br><br>Отдалить',
        mode: '2D',
        hl: 'circle-multiple'
      }
    ]
  },
  'hide-helpers': {
    el: 'view-controls__top',
    items: [
      {
        target: ['toggleSizes'],
        header: ['Скрыть подписи'],
        text: 'Отключайте вспомогательную информацию (подписи, разметку, сетку) в режими 2D',
        mode: '2D',
        hl: 'circle'
      }
    ]
  },
  'camera-angle': {
    el: 'control-bird',
    items: [
      {
        target: ['angle'],
        header: ['Режим 3D', 'Угол камеры'],
        text: 'В 3D режиме добавляется настройка угла обзора камеры. Выставив камеру на широкий угол, удобно осматривать небольшие помещения',
        hl: 'circle-angle',
        mode: '3D-bird'
      }
    ]
  },
  'camera-height': {
    el: 'control-man',
    items: [
      {
        target: ['cameraHeight'],
        header: ['Режим прогулки', 'Высота камеры'],
        text: 'Выставляйте камеру на комфортную для вас высоту',
        hl: 'circle-angle',
        mode: '3D-man'
      }
    ]
  },
  'end': {
    el: 'help-btn',
    items: [
      {
        target: ['help'],
        header: ['Конец обучения'],
        text: 'Вы всегда можете повторно запустить Знакомство с интерфейсом в справочном центре.',
        hl: 'circle',
        end: true
      }
    ]
  },
  'catalog': {
    el: 'ui-layer',
    items: [
      {
        target: ['plans'],
        header: ['Планировки'],
        text: 'Каталог готовых планировок. Выберите наиболее подходящую, уточните размеры. <br><br> Так же вы можете построить свою планировку самостоятельно',
        hl: 'catalog'
      },
      {
        target: ['catalog'],
        header: ['Каталог товаров'],
        text: 'Каталог отделочных материалов, мебели и сантехники. Дополните готовый дизайн-проект или создайте свой дизайн с нуля',
        hl: 'catalog'
      }
    ]
  }
}

var tutorialOrder = ['catalog', 'toolbar', 'view-controls__top', 'estimate', 'end-first',
  'units', '2d-mode', 'hide-helpers', 'camera-angle', 'camera-height', 'end'];

var iHelpTemplate = '<div class="i-help-wrap">\
<div class="i-help">\
  <div class="i-help__header">\
  </div>\
  <div class="i-help__text"></div>\
  <div class="i-help__footer">\
    <button class="i-help__back"></button>\
    <div>\
      <button class="i-help__close">Закрыть</button>\
      <button class="i-help__next">Далее</button>\
      </div>\
  </div>\
</div>\
</div>';

var $iShade = $('.interface-shade');
var activeTutorial;
var $hlEl = $('<div class="hl-button"></div>');
var lastTutorial;


function getIHelp(tutorialName, index) {

  var $el;
  var toolbar = iHelp[tutorialName].el;

  if (activeTutorial) {
    activeTutorial.toolbar = toolbar;
    activeTutorial.index = index;
    activeTutorial.el.css({ opacity: 1, pointerEvents: 'all' });
    activeTutorial.name = tutorialName
  }

  if (!activeTutorial) {

    $el = $(iHelpTemplate);

    var obj = {
      el: $el,
      header: $el.find('.i-help__header'),
      text: $el.find('.i-help__text'),
      next: $el.find('.i-help__next'),
      close: $el.find('.i-help__close'),
      prev: $el.find('.i-help__back'),
      index: index || 0,
      toolbar: toolbar,
      name: tutorialName
    };

    obj.next.click(function () {
      if (!activeTutorial) return;
      activeTutorial.index++;
      if (activeTutorial.index > iHelp[activeTutorial.name].items.length - 1) {
        showNextTutorial();
        return;
      }
      updateIHelp();
    });

    obj.prev.click(function () {
      if (!activeTutorial) return;
      activeTutorial.index--;
      if (activeTutorial.index < 0) {
        showPrevTutorial();
        return;
      }

      updateIHelp();
    })

    if (iHelp[tutorialName].items[index].showMore) {
      obj.close.html('Узнать больше');
      obj.close.click(function () {
        showIHelp('units');
      })
    }
    obj.close.click(function () {
      closeIHelp(true);
    });

    if (tutorialOrder.indexOf(tutorialName) === 0 && index === 0) {
      obj.prev.hide();
    }


    activeTutorial = Object.assign({}, obj);
  }


  return activeTutorial;
}


function getHlEl() {
  $('.hl-button').remove();
  return $('<div class="hl-button"></div>');
}


function setIHelpContent() {

  var header = iHelp[activeTutorial.name].items[activeTutorial.index].header;
  activeTutorial.header.children().remove();

  for (var i = 0; i < header.length; i++) {
    activeTutorial.header.append($('<div class="i-help__header-item">' + header[i] + '</div>'));
  }
  activeTutorial.text.html(iHelp[activeTutorial.name].items[activeTutorial.index].text);
  if (activeTutorial.index > 0) {
    activeTutorial.prev.show();
  }
  if (tutorialOrder.indexOf(activeTutorial.name) === 0 && activeTutorial.index === 0) {
    activeTutorial.prev.hide();
  }

}


function hlIHelpTargets() {

  if (!activeTutorial) return;

  var targets = iHelp[activeTutorial.name].items[activeTutorial.index].target;
  if (targets.length === 0) return;
  var hl = iHelp[activeTutorial.name].items[activeTutorial.index].hl;

  var width = 0;
  var $hlEl = getHlEl();
  var elements = targets.length;
  var offset = elements * 6;
  var firstEl = $($('[data-action="' + targets[0] + '"')[0]);
  var height;

  $('.ui-layer').prepend($hlEl);

  for (var i = 0; i < targets.length; i++) {
    var el = $('[data-action="' + targets[i] + '"')[0];
    width += $(el).outerWidth();
  }

  if (hl === 'circle') {
    height = firstEl.outerHeight();
  }
  if (hl === 'square') {
    height = firstEl.outerWidth();
  }

  $hlEl.attr('class', 'hl-button hl-button--' + hl);
  $hlEl.css({ left: firstEl.offset().left - 3 + 'px', top: firstEl.offset().top - 3 + 'px', width: width + offset + 'px', height: height + 6 + 'px' });
}

$(window).resize(function () {
  hlIHelpTargets();
})

function setIHelpClass() {
  activeTutorial.el.attr('class', 'i-help-wrap i-help--' + activeTutorial.name);
}


function showIHelp(tutorialName, start) {

  var el = iHelp[tutorialName].el;

  var $toolbar = $('.' + el);
  console.log(tutorialName)
  if ($toolbar.length === 0) return;

  activeTutorial = getIHelp(tutorialName, start || 0);
  setIHelpClass();

  $toolbar.prepend(activeTutorial.el);

  activeTutorial.el.on('mousedown wheel DOMMouseScroll mousewheel mousemove', function (e) {
    e.stopPropagation();
  });

  updateIHelp();
  disableToolbarButtons($toolbar);

  $iShade.addClass('active');
  $toolbar.css({ zIndex: 2 });

}


function disableToolbarButtons($toolbar) {
  $toolbar.css({ pointerEvents: 'none' });
}


function closeIHelp(click) {
  sendMessage('EDITOR.ENABLE_CATALOG_BUTTONS');
  if (click) {
    var $avatar = activeTutorial.el.clone();
    activeTutorial.el.css({ opacity: 0, pointerEvents: 'none' });
    $('.ui-layer').append($avatar);
    var $help = $('[data-action="help"]');
    $avatar.css({
      position: 'fixed',
      right: 'initial',
      bottom: 'initial',
      transform: 'translateY(0)',
      left: activeTutorial.el.offset().left + 'px',
      top: activeTutorial.el.offset().top + 'px',
      overflow: 'hidden',
      width: activeTutorial.el.width() + 'px',
      height: activeTutorial.el.height() + 'px',
      pointerEvents: 'none',
      boxSizing: 'border-box',
      margin: '0',
      padding: '0',
      opacity: '0.4'
    });
    $avatar.children('.i-help').animate({
      opacity: '0'
    },
      {
        complete: function () {
          $avatar.animate({
            left: $help.offset().left + 'px',
            top: $help.offset().top + 'px',
            height: '50px',
            width: '50px',
            borderRadius: '10px'
          }).animate({
            opacity: '0'
          },
            {
              complete: function () {
                animHelpBtnClose();
                $(this).remove()
              }
            })
        }
      });
  }
  $('.' + activeTutorial.toolbar).css({ pointerEvents: 'auto', zIndex: 1 });
  var $hlEl = getHlEl();
  $hlEl.remove();
  $iShade.removeClass('active');
  UI.setView('2D');
  activeTutorial = false;
}


function refreshIHelp() {
  $('.' + activeTutorial.toolbar).css({ pointerEvents: 'auto', zIndex: 1 });
  var $hlEl = getHlEl();
  $hlEl.remove();
}

function updateIHelp() {

  if (!activeTutorial) return;

  setUIView();
  setIHelpContent();
  hlIHelpTargets();

  if (activeTutorial.name === 'catalog') {
    sendMessage('EDITOR.DISABLE_CATALOG_BUTTONS', iHelp[activeTutorial.name].items[activeTutorial.index].target[0]);
  }

  if (activeTutorial.name !== 'catalog' && lastTutorial === 'catalog') {
    sendMessage('EDITOR.ENABLE_CATALOG_BUTTONS');
  }

  if (iHelp[activeTutorial.name].items[activeTutorial.index].showMore) {
    activeTutorial.next.html('Узнать больше');
    activeTutorial.close.html('Завершить');
  } else if (iHelp[activeTutorial.name].items[activeTutorial.index].end) {
    activeTutorial.close.html('Завершить');
  } else {
    activeTutorial.next.html('Далее');
    activeTutorial.close.html('Закрыть');
  }

  lastTutorial = activeTutorial.name;

}


function setUIView(mode) {

  var mode = mode || iHelp[activeTutorial.name].items[activeTutorial.index].mode;
  if (activeTutorial.mode === mode) return;
  switch (mode) {
    case '2D':
      UI.setView('2D');
      break;
    case '3D-bird':
      UI.setView('3D');
      UI.setViewMode('bird');
      break;
    case '3D-man':
      UI.setView('3D');
      UI.setViewMode('man');
      break;
  }
  activeTutorial.mode = mode;
}

// showIHelp('control-2d');
// showIHelp('toolbar');

function showInterfaceTutorial() {
  // showHotkeys();
  showIHelp('catalog');
}


function showHotkeys() {
  $iShade.addClass('active');

  $el = $(iHelpTemplate);
  $el.addClass('i-help--hotkeys');
  $el.find('.i-help__back').hide();
  $el.find('.i-help__header').append($('<div class="i-help__header-item">' + 'Перемещение' + '</div>'));
  $el.find('.i-help__text').html('Перемещайтесь в редакторе с помощью клавиатуры или правой кнопки мыши(работает не во всех браузерах)\
  <div>\
  <svg class="svg-ic-arrows-dims">\
  <use xlink:href="images/icons/sprite.svg#ic-arrows"></use>\
  </svg>\
  <svg class="svg-ic-wasd-dims">\
  <use xlink:href="images/icons/sprite.svg#ic-wasd"></use>\
  </svg>\
  </div>');
  if (!isFirstStart) {
    $el.addClass('i-help--only-close');
  }
  $el.find('.i-help__next').click(function () {
    $('.i-help--hotkeys').remove();
    showIHelp('catalog');
  })
  $el.find('.i-help__close').click(function () {
    var $el = $('.i-help--hotkeys');
    var $avatar = $el.clone();
    $avatar.addClass('no-hotkey-anim');
    $el.css({ 'display': 'none' });
    $('.ui-layer').append($avatar);
    var $help = $('[data-action="help"]');
    $avatar.css({ overflow: 'hidden' });
    $avatar.children('.i-help').animate({
      opacity: '0'
    },
      {
        complete: function () {
          $avatar.animate(
            {
              left: $help.offset().left + 25 + 'px',
              top: $help.offset().top + 25 + 'px',
              height: '50px',
              width: '50px',
            }).animate({
              opacity: '0'
            },
              {
                complete: function () {
                  animHelpBtnClose();
                  $(this).remove()
                }
              })
        }
      });
    $iShade.removeClass('active');
  })
  $('.ui-layer').append($el);
  $el.on('mousedown wheel DOMMouseScroll mousewheel mousemove', function (e) {
    e.stopPropagation();
  });
}


function showNextTutorial() {
  refreshIHelp();
  var num = tutorialOrder.indexOf(activeTutorial.name);
  if (num !== -1 && num + 1 < tutorialOrder.length) {
    showIHelp(tutorialOrder[num + 1]);
  }
}

function showPrevTutorial() {
  refreshIHelp();
  var num = tutorialOrder.indexOf(activeTutorial.name);
  if (num !== -1 && num - 1 >= 0) {
    showIHelp(tutorialOrder[num - 1], iHelp[tutorialOrder[num - 1]].items.length - 1);
  }
}


var isFirstStart = false;

function checkFirstStart() {
  if (lsTest() !== true) return;
  var secondStart = localStorage.getItem('tutorial2');
  if (secondStart != 'true') {
    isFirstStart = true;
    showHotkeys();
    localStorage.setItem('tutorial2', 'true')
  }
}

checkFirstStart();

function animHelpBtnClose() {
  var $hel = getHlEl();
  $hel.addClass('hl-button--help-hl');
  $help = $($('[data-action="help"')[0]);
  $hel.css({
    top: $help.offset().top - 3 + 'px',
    left: $help.offset().left - 3 + 'px',
    width: $help.outerWidth() + 6 + 'px',
    height: $help.outerHeight() + 6 + 'px'
  });

  $('.ui-layer').prepend($hel);
  setTimeout(function () {
    $('.hl-button--help-hl').remove();
  }, 2000)
}

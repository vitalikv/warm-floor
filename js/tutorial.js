var tutorial = (function () {
  var Tutorial = function() {

  };

  var tutorialPages = {
    wall: [
      {
        title: 'Длина стены',
        image: 'images/tutorial-ph.png',
        text: 'Установите точные размеры стены и направление в котором она будет увеличена'
      },
      {
        title: 'Толщина стены',
        image: 'images/tutorial-ph.png',
        text: 'Установите точные размеры толщины стены и направление, в котром она будет расширена'
      },
      {
        title: 'Разбиение стены',
        image: 'images/tutorial-ph.png',
        text: 'Нажмите на кнопку Разбить стену, если вам нужно добавить новую опорную точку'
      }
    ]
  };

  function fillTutorial(page) {
    return $('<div class="tutorial">\
    <div class="tutorial__body">\
      <div class="tutorial__header">'+ page.title + '</div>\
      <div class="tutorial__close"></div>\
      <div class="tutorial__image"><img src="'+ page.image + '"/></div>\
      <div class="tutorial__text">'+ page.text + '</div>\
      <div class="tutorial__controls">\
        <ul class="tutorial__nav">\
        </ul>\
        <div class="tutorial__btn">Далее</div>\
    </div>\
    </div>\
    </div>');
  }

  function showTutorial(name, page, target, callback, isNext) {
    if (typeof tutorialPages[name] === 'undefined' || typeof tutorialPages[name][0] === 'undefined') return;

    var tutorial = tutorialPages[name];
    var template = fillTutorial(tutorial[page]);
    page = page || 0;
    
    $('[data-action="help"]').hide();

    template.find('.tutorial__close').on('click', function () { hideTutorial(template); });
    template.css({ bottom: '20px', right: '20px', top: 'initial', left: 'initial' });

    if (tutorial.length > 0) {
      createTemplateNav();
    }

    initNextButton();

    $('.ui-layer').append(template);
    if (!isNext) {
      template.fadeIn();
    } else {
      template.show();
    }


    var targetWidth = 0;
    var targetHeight = 0;
    var offsetLeft = 0;
    var offsetTop = 0;
    var position = 'horizontal';
    var el;
    var i;

    if (target) {
      var hook = $('<div class="tutorial__hook"></div>');

      var firstTarget = UI(target[0]).getVisibleElement();
      if (target[0] !== 'catalog-btn') {
        offsetLeft = firstTarget.offset().left;
        offsetTop = firstTarget.offset().top;
      }

      if (target[0] === 'catalog-btn') {
        position = 'left';
      } else if (firstTarget.parents('.toolbar').length > 0) {
        position = 'top';
      } else if (firstTarget.parents('.view-controls__middle').length > 0) {
        position = 'right';
      } else if (firstTarget.parents('.left-controls').length > 0) {
        position = 'left-bottom';
      } else if (target[0] === 'changeView') {
        position = 'top-view';
      }


      if (position == 'top') {
        targetHeight = firstTarget.outerHeight() + 10;
        for (i = 0; i < target.length; i++) {
          el = UI(target[i]).getVisibleElement();
          el.addClass('tutorial__target');
          targetWidth += parseInt(el.outerWidth());
          if (i > 0) {
            targetWidth += parseInt(el.offset().left - UI(target[i - 1]).getVisibleElement().offset().left - el.outerWidth());
          }
        }
        targetWidth += 16;
        firstTarget.addClass('tutorial__target_first');
        UI(target[target.length - 1]).getVisibleElement().addClass('tutorial__target_last');
      }

      if (position == 'right') {
        targetWidth = firstTarget.outerWidth() + 15;
        for (i = 0; i < target.length; i++) {
          el = UI(target[i]).getVisibleElement();
          el.addClass('tutorial__target');
          targetHeight += parseInt(el.outerHeight());
          if (i > 0) {
            targetHeight += parseInt(el.offset().top - UI(target[i - 1]).getVisibleElement().offset().top - el.outerHeight());
          }
        }
        targetHeight += 14;
        hook.addClass('tutorial__hook_right');
      }

      if (position == 'left-bottom') {
        targetWidth = firstTarget.outerWidth() + 8;
        el = UI(target[0]).getVisibleElement();
        el.addClass('tutorial__target');
        targetHeight = parseInt(el.outerHeight());
        targetHeight += 14;
        hook.addClass('tutorial__hook_left-bottom');
      }

      if (position == 'left') {
        targetWidth = 70;
        targetHeight = 125;
        hook.addClass('tutorial__hook_left');
      }

      if (position == 'top-view') {
        targetWidth = firstTarget.outerWidth() + 14;
        el = UI(target[0]).getVisibleElement();
        el.addClass('tutorial__target');
        targetHeight = parseInt(el.outerHeight());
        targetHeight += 14;
        hook.addClass('tutorial__hook_top-view');
      }

      hook.css({ 'height': targetHeight + 'px', 'width': targetWidth + 'px' });
      template.append(hook);

      $(window).on('resize.template', setTemplatePosition);
      if ($('.tutorial__disable-ui').length == 0) {
        $('.ui-layer').append('<div class="tutorial__disable-ui"></div>');
      }
      template.addClass('tutorial_button');
      setTemplatePosition(position);
    }

    function setTemplatePosition(position) {
      switch (position) {
        case 'top':
          template.css({
            left: offsetLeft - template.width() / 2 + targetWidth / 2 - 8,
            top: offsetTop + targetHeight - 5,
            bottom: 'initial',
            right: 'initial'
          });
          break;
        case 'right':
          template.css({
            left: offsetLeft - template.width() - 10,
            top: offsetTop - template.height() / 2 + targetHeight / 2 - 7,
            bottom: 'initial',
            right: 'initial'
          });
          break;
        case 'top-view':
          template.css({
            left: offsetLeft - template.width() - 8,
            top: offsetTop - 3,
            bottom: 'initial',
            right: 'initial'
          });
          break;
        case 'left-bottom':
          template.css({
            left: offsetLeft + targetWidth - 4,
            top: offsetTop - template.height() + targetHeight - 8,
            bottom: 'initial',
            right: 'initial'
          });
          break;
        case 'left':
          template.css({
            left: targetWidth + 10,
            top: '50%',
            bottom: 'initial',
            right: 'initial',
            marginTop: -template.height() / 2 - 50
          });
          break;
      }
    }

    function initNextButton() {
      if (tutorial.length > page + 1) {
        template.find('.tutorial__btn').on('click', function () {
          hideTutorial(template); showTutorial(name, page + 1, target, false, true);
        });
      } else {
        template.find('.tutorial__btn').on('click', function () {
          hideTutorial(template);
          if (typeof callback === 'function') callback();
        });
      }
    }

    function createTemplateNav() {
      template.find('.tutorial__nav').empty();
      for (var i = 0; i < tutorial.length; i++) {
        var el = $('<li></li>');
        if (i == page)
          el.addClass('_active');
        (function (i) {
          el.click(function () { hideTutorial(template); showTutorial(name, i, target, false, true); });
        })(i);
        template.find('.tutorial__nav').append(el);
      }
      template.data('page', page);
    }
    $('.tutorial__disable-ui, .tutorial').on('mousedown mousemove', function(e) {
      e.stopPropagation();
    });

    return template;
  }

  function hideTutorial(el) {
    $('[data-action="help"]').show();
    $(el).remove();
    $(window).off('resize.template');
    $('.tutorial__target').removeClass('tutorial__target');
    $('.tutorial__target_last').removeClass('tutorial__target_last');
    $('.tutorial__target_first').removeClass('tutorial__target_first');
    $('.tutorial__disable-ui').remove();
  }

  Tutorial.show = showTutorial;
  Tutorial.hide = hideTutorial;

  return Tutorial;

})();

// window.setTimeout(function () { tutorial.show('wall', 0, ['changeView']) }, 500)
// window.setTimeout(function () { tutorial.show('wall', 0, ['catalog-btn']) }, 500)
// window.setTimeout(function () { tutorial.show('wall', 0, ['wall']) }, 500)
// window.setTimeout(function () { tutorial.show('wall', 0, ['units']) }, 500)
// window.setTimeout(function () { tutorial.show('wall', 0, ['center', 'zoomIn', 'zoomOut']) }, 500)
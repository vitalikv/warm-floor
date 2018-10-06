function RSelect(el) {
  this.el = $(el);
  this.action = this.el.data('action')
  this.value = this.el.data('selected');
  var self = this;
  $('.modal__btn[data-group="' + self.el.data('group') + '"]').addClass('modal__btn_disabled');

  this.el.children('.r-select__option').on('click', function (e) {
    $('.modal__btn[data-group="' + self.el.data('group') + '"]').removeClass('modal__btn_disabled');
    var val = $(this).data('value');
    self.el.data('selected', val);
    $(this).siblings('.r-select__option').removeClass('r-select__option_active');
    $(this).addClass('r-select__option_active');

    $('[data-action="' + self.action + '"]').each(function () {//установка такого же значения на других таких же селектах
      $(this).data('selected', val);
      $(this).children('[data-value="' + val + '"]').addClass('r-select__option_active');
      $(this).children('[data-value="' + val + '"]').siblings('.r-select__option').removeClass('r-select__option_active');
    })
  })
}
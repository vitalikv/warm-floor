function ChainInput(el) { //Соединенные инпунты
  this.connected = false;
  this.el = $(el);
  var inputs = this.el.data('chain').split(',');
  this.el1 = $('[data-action="' + inputs[0] + '"]');
  this.el2 = $('[data-action="' + inputs[1] + '"]');
  this.el1val = parseInt(this.el1.val());
  this.el2val = parseInt(this.el2.val());
  this.chain = this.el.children('.b-toolbar__chain-btn');
  var self = this;
  this.chain.click(function () {
    self.chain.toggleClass('b-toolbar__chain-btn_active');
    self.connected = !self.connected;
  })

  this.el.on('change paste click', function (e) {
    if ($(e.target)[0] == self.el1[0]) {
      self.el1val = parseInt($(e.target).val()) || 0;
    }
    if ($(e.target)[0] == self.el2[0]) {
      self.el2val = parseInt($(e.target).val()) || 0;
    }
  })

  this.el.on('keydown keyup', function (e) {
    if (!self.connected) return;

    if ($(e.target)[0] == self.el1[0]) {
      var newVal = (parseInt(self.el2.val()) + parseInt($(e.target).val()) - parseInt(self.el1val)) || 0;
      self.el2.val(newVal);
      self.el1val = parseInt($(e.target).val()) || 0;
      self.el2val = newVal;
    }
    if ($(e.target)[0] == self.el2[0]) {
      var newVal = (parseInt(self.el1.val()) + parseInt($(e.target).val()) - parseInt(self.el2val)) || 0;
      self.el1.val(newVal);
      self.el2val = parseInt($(e.target).val()) || 0;
      self.el1val = newVal;
    }
  })
}

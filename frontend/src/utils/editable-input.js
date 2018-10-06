
function EditableInput(el, onSubmit) {
  this.el = $(el);
  this.html = this.el.html();
  this.text = $('<span class="editable__text">' + this.html + '</span>');
  this.el.html('');
  this.el.append(this.text);
  this.edit = $('<input type="text" class="editable__input" value="' + this.html + '">');
  this.edit.css({ 'width': this.text.css('width'), 'height': this.text.css('height') })
  this.el.append(this.edit);
  this.edit.hide();
  var self = this;
  this.text.on('click', function (e) {
    self.text.hide();
    self.edit.show();
    self.edit.focus();
  })
  this.edit.on('blur', function () {
    self.text.html(self.edit.val());
    self.edit.hide();
    self.text.show();
    self.edit.css({ 'width': self.text.css('width') });
  })
  this.edit.on('keydown', function (e) {
    if (e.keyCode == 8 || e.keyCode == 46 || e.key.length > 1) return;
    self.text.html(self.edit.val() + e.key);
    self.edit.css({ 'width': self.text.css('width') });
  })
  this.edit.on('keyup', function (e) {
    self.text.html(self.edit.val());
    self.edit.css({ 'width': self.text.css('width') });
    if (e.keyCode == '13') {
      self.edit.hide();
      self.text.show();
      onSubmit(self.text.html());
    }
  })
}
(function () {
  'use strict';
  // Shared local listbox for the language and interactive-preview controls.
  window.createPortalDropdown = function (settings) {
    var container = settings.container, value = settings.value, options = [];
    container.classList.add('portal-dropdown');
    if (settings.placement === 'up') container.classList.add('dropdown-up');
    var trigger = document.createElement('button');
    trigger.type = 'button'; trigger.id = settings.id; trigger.className = 'dropdown-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox'); trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', settings.id + '-options');
    var current = document.createElement('span'); current.id = settings.id + '-value'; trigger.appendChild(current);
    if (settings.labelId) trigger.setAttribute('aria-labelledby', settings.labelId + ' ' + current.id);
    var chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('viewBox', '0 0 20 20'); chevron.setAttribute('class', 'dropdown-chevron'); chevron.setAttribute('aria-hidden', 'true');
    var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path'); arrow.setAttribute('d', 'm5 7.5 5 5 5-5');
    chevron.appendChild(arrow); trigger.appendChild(chevron);
    var menu = document.createElement('span');
    menu.id = settings.id + '-options'; menu.className = 'dropdown-options'; menu.setAttribute('role', 'listbox'); menu.hidden = true;
    function close(focus) { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); if (focus) trigger.focus(); }
    function selectedIndex() { return Math.max(0, settings.items.findIndex(function (item) { return item.value === value; })); }
    function open() { menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); options[selectedIndex()].focus(); }
    function setValue(next) {
      value = next;
      var item = settings.items[selectedIndex()]; current.textContent = item.label;
      options.forEach(function (option, index) { option.setAttribute('aria-selected', String(settings.items[index].value === value)); });
    }
    settings.items.forEach(function (item, index) {
      var option = document.createElement('button'); option.type = 'button'; option.setAttribute('role', 'option'); option.tabIndex = -1;
      option.textContent = item.label; if (item.lang) option.lang = item.lang;
      option.addEventListener('click', function () { setValue(item.value); close(true); settings.onChange(item.value); });
      option.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { event.preventDefault(); close(true); }
        else if (event.key === 'Tab') close(false);
        else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault(); options[(index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus();
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault(); options[event.key === 'Home' ? 0 : options.length - 1].focus();
        } else if (event.key.length === 1 && event.key !== ' ') {
          var match = options.find(function (candidate) { return candidate.textContent.toLowerCase().startsWith(event.key.toLowerCase()); });
          if (match) { event.preventDefault(); match.focus(); }
        }
      });
      options.push(option); menu.appendChild(option);
    });
    trigger.addEventListener('click', function () { if (menu.hidden) open(); else close(false); });
    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open(); }
      else if (event.key === 'Escape') close(false);
    });
    document.addEventListener('pointerdown', function (event) { if (!container.contains(event.target)) close(false); });
    container.appendChild(trigger); container.appendChild(menu); setValue(value);
    return {
      setValue: setValue,
      setLabel: function (label) { menu.setAttribute('aria-label', label); if (!settings.labelId) trigger.setAttribute('aria-label', label + ': ' + settings.items[selectedIndex()].label); }
    };
  };
})();

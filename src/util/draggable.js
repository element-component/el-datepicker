import { on, off } from 'wind-dom';

let isDragging = false;

const isIE8 = Number(document.documentMode) < 9;

const fixEvent = function(event) {
  const scrollTop = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0);
  const scrollLeft = Math.max(window.scrollX || 0, document.documentElement.scrollLeft || 0);

  event.target = event.srcElement;
  event.pageX = scrollLeft + event.clientX;
  event.pageY = scrollTop + event.clientY;
};

export default function(element, options) {
  const moveFn = function(event) {
    if (isIE8) {
      fixEvent(event);
    }
    if (options.drag) {
      options.drag(event);
    }
  };

  const upFn = function(event) {
    if (isIE8) {
      fixEvent(event);
    }
    off(document, 'mousemove', moveFn);
    off(document, 'mouseup', upFn);
    document.onselectstart = null;
    document.ondragstart = null;

    isDragging = false;

    if (options.end) {
      options.end(event);
    }
  };

  on(element, 'mousedown', function(event) {
    if (isIE8) {
      fixEvent(event);
    }
    if (isDragging) return;
    document.onselectstart = function() { return false; };
    document.ondragstart = function() { return false; };

    on(document, 'mousemove', moveFn);
    on(document, 'mouseup', upFn);
    isDragging = true;

    if (options.start) {
      options.start(event);
    }
  });
}

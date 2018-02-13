document.addEventListener('DOMContentLoaded', () => {
  const services = document.getElementsByClassName('js-service');

  for (let i=0; i<services.length; i++) {
    let rootEl = services[i],
        serviceName = rootEl.dataset.bindElement;

    if (typeof widgets[directiveName] !== 'undefined') {
      new widgets[directiveName](directiveDomNode)
    }
  }
});


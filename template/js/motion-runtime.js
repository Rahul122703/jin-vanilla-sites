(() => {
  const { animate, inView } = Motion;

  function applyState(el, state = {}) {
    if (state.opacity !== undefined) {
      el.style.opacity = state.opacity;
    }

    const transforms = [];

    if (state.x !== undefined) transforms.push(`translateX(${state.x}px)`);
    if (state.y !== undefined) transforms.push(`translateY(${state.y}px)`);
    if (state.scale !== undefined) transforms.push(`scale(${state.scale})`);
    if (state.rotate !== undefined)
      transforms.push(`rotate(${state.rotate}deg)`);

    if (transforms.length) {
      el.style.transform = transforms.join(" ");
    }

    if (state.blur !== undefined) {
      el.style.filter = `blur(${state.blur}px)`;
    }
  }

  document.querySelectorAll("[data-motion-config]").forEach((el) => {
    const config = JSON.parse(el.dataset.motionConfig);

    applyState(el, config.initial);

    if (config.whileInView) {
      inView(el, () => {
        animate(el, config.whileInView, config.transition);
      });
    } else if (config.animate) {
      animate(el, config.animate, config.transition);
    }
  });
})();

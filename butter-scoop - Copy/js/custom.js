const videoContainer = document.querySelector(".section-video .widget-video");
const video = videoContainer?.querySelector("video");

function updateFixedVideo() {
  if (!videoContainer || !video) return;

  const rect = videoContainer.getBoundingClientRect();

  video.style.left = `${rect.left}px`;
  video.style.top = `${rect.top}px`;
  video.style.width = `${rect.width}px`;
  video.style.height = `${rect.height}px`;
}

updateFixedVideo();

window.addEventListener("scroll", updateFixedVideo, { passive: true });
window.addEventListener("resize", updateFixedVideo);

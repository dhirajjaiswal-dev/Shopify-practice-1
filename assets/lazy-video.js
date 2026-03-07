const lazyVideos = Array.from(document.querySelectorAll("video.lazy-video"));

if ("IntersectionObserver" in window) {
    const lazyVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;

            if (entry.isIntersecting) {
                if (video) {
                    if (video.dataset.poster) {
                        video.poster = video.dataset.poster;
                    }

                    const sources = video.querySelectorAll("source");
                    if (!sources.length) return;

                    sources.forEach((source) => {
                        if (source.dataset.src) {
                            source.src = source.dataset.src;
                        }
                    });

                    video.muted = true;
                    video.load();
                    video.play().catch(() => {
                        console.warn("Video autoplay failed:", err);
                    });

                    video.classList.remove("lazy-video");
                    lazyVideoObserver.unobserve(video);
                }
            } else {
                if (video && !video.paused) {
                    video.pause();
                }
            }
        });
    });

    lazyVideos.forEach((lazyVideo) => {
        lazyVideoObserver.observe(lazyVideo);
    });
}
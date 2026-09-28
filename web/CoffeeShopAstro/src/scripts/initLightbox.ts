import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const instances = new Map<string, PhotoSwipeLightbox>();

export function initLightbox(
    selector: string,
    children: string = "a"
) {
    const current = instances.get(selector);

    if (current) {
        current.destroy();
    }

    const lightbox = new PhotoSwipeLightbox({
        gallery: selector,
        children,
        pswpModule: () => import("photoswipe"),
    });

    lightbox.init();

    instances.set(selector, lightbox);
}
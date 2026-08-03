import { formatDate } from "@/helpers";



function initBlogModal() {

    const modal = document.getElementById("post-modal") as HTMLElement;
    const closeBtn = document.getElementById("close-modal") as HTMLElement;
    const modalContainer = document.getElementById("modal-container") as HTMLElement;

    if (!modal) return;

    const title = document.getElementById("modal-title") as HTMLElement;
    const image = document.getElementById("modal-image") as HTMLImageElement;
    const content = document.getElementById("modal-content") as HTMLElement;
    const date = document.querySelector("#modal-date span") as HTMLElement;
    const categories = document.getElementById("modal-categories") as HTMLElement;

    document.querySelectorAll(".post-link").forEach((link) => {

        link.addEventListener("click", (e) => {

            e.preventDefault();

            const target = e.currentTarget as HTMLElement;

            title.textContent = target.dataset.title ?? "";

            image.src = target.dataset.image ?? "";
            image.alt = target.dataset.title ?? "";

            content.innerHTML = target.dataset.description ?? "";

            date.textContent = formatDate(target.dataset.date ?? "");

            categories.innerHTML = "";

            const cats = (target.dataset.categories ?? "").split(",");

            cats.forEach(cat => {

                const span = document.createElement("span");

                span.className =
                    "inline-block py-1 px-5 mr-2 mb-2 rounded-full bg-coffee-600 text-white text-sm";

                span.textContent = cat.trim();

                categories.appendChild(span);

            });
           
            

            
            modal.classList.remove("hidden");
            modal.classList.add("flex");

            requestAnimationFrame(() => {
                modalContainer.scrollTop = 0;
            });

        });

    });

    closeBtn?.addEventListener("click", () => {

        modal.classList.add("hidden");
        modal.classList.remove("flex");
        modalContainer.scrollTop = 0;

    });

    modal.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.classList.add("hidden");
            modal.classList.remove("flex");
            modalContainer.scrollTop = 0;
            

        }

    });

}

document.addEventListener("DOMContentLoaded", initBlogModal);
document.addEventListener("astro:page-load", initBlogModal);


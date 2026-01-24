const $ = e => document.querySelector(e);
const $$ = e => [...document.querySelectorAll(e)];

// 모토

const mottos = $$(".motto-container > div");
mottos.forEach((motto) => {
    motto.addEventListener("mouseover", () => {
        $$(".motto-title").forEach(t => {
            t.style.opacity = 0;
        });

        mottos.forEach(i => {
            i.style.backgroundImage = `url(./images/${motto.className}.png)`;
        });

        $(`.des${motto.className.replace(/[^0-9]/g, "")}`).style.opacity = 1;
        motto.querySelector(".motto-title").style.opacity = 1;
    });

    motto.addEventListener("mouseleave", () => {
        $$(".motto-title").forEach(t => {
            t.style.opacity = 1;
        });

        mottos.forEach(i => {
            i.style.backgroundImage = `url(./images/${i.className}.png)`;
        });

        $(`.des${motto.className.replace(/[^0-9]/g, "")}`).style.opacity = 0;
    });
});
const subText = e => document.querySelector(`.motto-text .${e}`)

const mottos = $(".motto-box div");

mottos.forEach((motto) => {
    const title = motto.querySelector(".motto-box .name");
    const index = motto.className.replace(/[^0-9]/g, "");
    const desc = document.querySelector(`motto${index}`);
    motto.addEventListener("mouseover", () => {
        $$(".motto-box .name").forEach(t => {
            t.style.opacity = 0;
        });

        mottos.forEach(item => {
            item.style.backgroundImage = `url(./images/motto/${motto.className})`;
        });

        if (title) title.style.opacity = 1;
        if (desc) desc.style.opacity = 1;
    });

        motto.addEventListener("mouseleave", () => {
        $$(".motto-box .name").forEach(t => {
            t.style.opacity = 0;
        });

        mottos.forEach(item => {
            item.style.backgroundImage = `url(./images/motto/${item.className})`;
        });

        if (desc) desc.style.opacity = 0;
    });
});
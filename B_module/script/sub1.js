const mottos = [...document.querySelectorAll(".motto-box div")]
const subText = e => document.querySelector(`.motto-text .${e}`)
const Name = [...document.querySelectorAll(".motto-box .name")]

mottos.forEach(e => {
    e.addEventListener("mouseenter", () => {
        mottos.forEach(e2 => e2.style.backgroundImage = `url("./images/${e.className}.png")`)
        subText(e.className).style.opacity = 1
        Name.forEach(e2 => { e2.style.display = 'none' })
        e.querySelector(".name").style.display = 'block'
    })

    e.addEventListener("mouseleave", () => {
        mottos.forEach(e2 => e2.style.backgroundImage = `url("./images/${e2.className}.png")`)
        subText(e.className).style.opacity = 0
        Name.forEach(e2 => { e2.style.display = 'block' })
    })
})
const $ = e => document.querySelector(e);
const $$ = e => [...document.querySelectorAll(e)];

// 드레그엔드드롭

let data, cate = "건강식품", total = 0;
const cart = $(".cart-box"), buy = $(".buy-box");

const modal = v => $(".modal-con").style.display = v;
$(".open-modal").onclick = () => modal("flex");
$(".close-modal").onclick = () => modal("none");

const user = [...Array(6)].map(() => Math.random().toString(36)[2].toUpperCase()).join("");
$(".user-id").textContent = user;

fetch("./data.json").then(r => r.json()).then(d => { data = d; render(); });

$$(".modal-nav div").forEach(item => {
    item.onclick = () => {
        $$(".modal-nav div").forEach(el => el.classList.remove("active"));
        item.classList.add("active");
        cate = item.dataset.cate;
        render();
    };
});

function render() {
    cart.innerHTML = "";
    Object.entries(data.product[cate]).forEach(([id, v]) => {
        const cartId = `${cate}-${id}`;
        const bought = !!buy.querySelector(`[data-id="${cartId}"]`);
        cart.innerHTML += `
        <div class="item" draggable="true" data-id="${cartId}" style="opacity:${bought ? "0.5" : "1"}">
            <img src="./images/${cate}/${id}.png">
            <div>${v.title.replace("상품명:", "")}</div>
            <span class="price">${v.discount != "0" ? v.discount : v.price}</span>
        </div>`;
    });
    drag();
}

let dragFrom = null;
let dragId = null;

function drag() {
    $$(".cart-box .item, .buy-box .item").forEach(item => {
        item.ondragstart = e => {
            dragId = item.dataset.id;
            dragFrom = item.closest(".cart-box") ? "cart" : "buy";
            e.dataTransfer.setData("text/plain", dragId);
        };

        item.ondragend = e => {
            if (dragFrom === "buy") {
                const modalContent = $(".modal-con > div") || $(".modal-con");
                const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
                if (!dropTarget || !modalContent.contains(dropTarget)) {
                    const buyItem = buy.querySelector(`[data-id="${dragId}"]`);
                    if (buyItem) {
                        buyItem.remove();
                        const cartItem = cart.querySelector(`[data-id="${dragId}"]`);
                        if (cartItem) cartItem.style.opacity = 1;
                        calc();
                    };
                };
            };
            dragFrom = null;
            dragId = null;
        };
    });
};

[cart, buy].forEach(box => box.ondragover = e => e.preventDefault());
document.addEventListener("dragover", e => e.preventDefault());

buy.ondrop = e => {
    e.preventDefault();
    if (dragFrom === "buy") return;

    const item = cart.querySelector(`[data-id="${dragId}"]`);
    if (!item) return;

    const exist = buy.querySelector(`[data-id="${dragId}"]`);
    if (exist) {
        exist.querySelector("input").value++;
    } else {
        buy.innerHTML += `
            <div class="item" draggable="true" data-id="${dragId}">
                ${item.innerHTML}
                <input type="number" value="1" min="1" oninput="calc()">
                <span class="totalPrice">0</span>
            </div>`;
    }
    item.style.opacity = 0.5;
    drag();
    calc();
};

cart.ondrop = e => {
    e.preventDefault();
    if (dragFrom !== "buy") return;

    const buyItem = buy.querySelector(`[data-id="${dragId}"]`);
    if (buyItem) buyItem.remove();
    const cartItem = cart.querySelector(`[data-id="${dragId}"]`);
    if (cartItem) cartItem.style.opacity = 1;
    calc();
};

function calc() {
    total = 0;
    $$(".buy-box .item").forEach(item => {
        const price = Number(item.querySelector(".price").textContent.replace(/,/g, "") || 0);
        const qty = Number(item.querySelector("input").value) || 0;
        const sum = price * qty;
        item.querySelector(".totalPrice").textContent = sum.toLocaleString();
        total += sum;
    });
    $(".all-price").textContent = total.toLocaleString();
}

$(".user-buy").onclick = () => {
    $(".user").textContent = user;
    $(".all-cost").textContent = total.toLocaleString();
    $(".buy-alert").style.display = "block";
    modal("none");
    setTimeout(() => $(".buy-alert").style.display = "none", 3000);
}


// 비디오

const video = $("video");
const controlsContainer = $(".controls")
const ctrls = $$('[class^="ctrl"]');
let isAuto = localStorage.getItem("auto") === true;
if (isAuto) {
    video.play();
    video.muted === "true";
}

const controls = {
    ctrl01: () => video.play(),
    ctrl02: () => video.pause(),
    ctrl03: () => { video.pause(); video.currentTime = 0; },
    ctrl04: () => video.currentTime -= 10,
    ctrl05: () => video.currentTime += 10,
    ctrl06: () => video.playbackRate -= 0.1,
    ctrl07: () => video.playbackRate += 0.1,
    ctrl08: () => video.playbackRate = 1,
    ctrl09: () => video.loop = !video.loop,
    ctrl10: () => {
        isAuto = !isAuto;
        localStorage.setItem("auto", isAuto);
        isAuto ? video.play() : video.pause();
    },
    ctrl11: () => controlsContainer.classList.toggle("hidden")
};
ctrls.forEach(btn => {
    btn.addEventListener("click", () => {
        const key = btn.classList[0];
        if (controls[key]) controls[key]();
    });
});
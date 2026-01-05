const $ = e => document.querySelector(e);
const $$ = e => [...document.querySelectorAll(e)];

let data, cate = "건강식품", total = 0;
const cart = $(".cart-box"), buy = $(".buy-box");

const modal = v => $("modal-con").style.display = v;
$(".open-modal").onclick = () => modal("flex");
$(".close-modal").onclick = () => modal("none");

const user = [...Array(6)].map(() => Math.random().toString(36)[2].toUpperCase()).join("");
$(".user-id").textContent = user;

fetch("./data.json").then(r => r.json()).then(d => {data = d; render(); });

$$(".modal-nav div").forEach(item => {
    item.onclick = () => {
        $$(".modal-nav div").forEach(el => el.classList.remove("acitve"));
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
};

function drag() {
    $$(".cart-box .item", ".buy-box .item").forEach(item => {
        item.ondragstart = () => {
            e.dataTransfer.setData("id", item.dataset.id);
            e.dataTransfer.setData("from", item.closest(".cart-box") ? "cart" : "buy");
        };
    });
};
[cart, buy].forEach(b => b.ondragover = e => e.preventDefault());

buy.ondrop = e => {
    e.preventDefault();
    if(e.dataTransfer.getData("from") === "buy") return;
    const id = e.dataTransfer.getData("id");
    const item = cart.querySelector(`[data-id="${id}"]`);
    if (!item) return;
    let exist = buy.querySelector(`[data-id="${id}"]`);
    if (exist) {
        exist.querySelector("input").value++;
    } else {
        buy.innerHTML += `
        <div class="item" draggable="true" data-id="${id}">
            ${item.innerHTML}
            <input type="number" value="1" min="1" oninput="calc()">
            <span class="totalPrice">0</span>
        </div>`;
    }
    $$(".buy-box .item input").forEach(input => input.oninput = calc);
    drag();
    calc();
};

cart.ondrop = e => {
    e.preventDefault();
    if(e.dataTransfer.getData("from") !== "buy") return;
    const id = e.dataTransfer.getData("id");
    const buyItem = buy.querySelector(`[data-id="${id}"]`);
    if (!buyItem) return;
    const cartItem = cart.querySelector(`[data-id="${id}]`);
    if (cartItem) cartItem.style.opacity = 1;
    calc();
};

function calc() {
    $$(".buy-box .item").forEach(item => {
        const price = Number(item.querySelector(".price").textContent.replace(/,/g, "") || 0);
        const qty = Number(item.querySelector("input").value) || 0;
        const sum = price * qty;
        item.querySelector(".totalPrice").textContent = sum.toLocaleString();
        total += sum;
    });
    $("all-price").textContent = total.toLocaleString();
};

$(".user-buy").onclick = () => {
    $(".user").textContent = user;
    $("all-cost").textContent = total.toLocaleString();
    modal("none");
    setTimeout(() => $(".buy-alert").style.display = "none", 3000);
};

const video = document.querySelector("video");
const controlsContainer = document.querySelector(".control-box");
const toggleControls = document.querySelector(".control11");

let isAuto = localStorage.getItem("auto") === "true";

if (isAuto) {
    video.muted = true;
    video.play();
}

controlsContainer.addEventListener("click", e => {
    const t = e.target.classList;
    if (t.contains("control01")) video.play();
    if (t.contains("control02")) video.pause();
    if (t.contains("control03")) { video.pause(); video.currentTime = 0; }
    if (t.contains("control04")) video.currentTime -= 10;
    if (t.contains("control05")) video.currentTime += 10;
    if (t.contains("control06")) video.playbackRate = Math.max(0.1, video.playbackRate - 0.1);
    if (t.contains("control07")) video.playbackRate += 0.1;
    if (t.contains("control08")) video.playbackRate = 1;
    if (t.contains("control09")) video.loop = !video.loop;
    if (t.contains("control10")) {
        isAuto = !isAuto;
        localStorage.setItem("auto", isAuto);
        video.muted = isAuto;
        isAuto ? video.play() : video.pause();
    }
});

toggleControls.addEventListener("click", () => {
    const conBox = controlsContainer.querySelector(".con-box");
    conBox.style.display = conBox.style.display === "none" ? "flex" : "none";
});
let html = document.querySelector("html"),
    carouselPrevBtn = document.querySelector(".carousell .prev"),
    carouselNextBtn = document.querySelector(".carousell .next"),
    navLinks = document.querySelectorAll(".navbar .nav-item"),
    navbarEle = document.querySelector("nav"),
    navbarHeight = navbarEle.clientHeight,
    correctImgs = document.querySelectorAll(".title img"),
    popUpBoxes = document.querySelectorAll(".popUp .box"),
    cartProducts = [];

if (localStorage.getItem('cartProducts') != null){
    cartProducts = JSON.parse(localStorage.getItem("cartProducts"));
}
else{
    updateLocalStorage();
}
isCartEmpty();

// CarouselButton Next/Prev
carouselNextBtn.addEventListener("click",()=>{
    let currentSlide = document.querySelector(".carousell .carouselItem.active"),
        nextSlide = currentSlide.nextElementSibling ?? document.querySelector(".carousell .carouselItem:nth-of-type(1)"),
        currentColorName = nextSlide.dataset.colorName;
    changeMainColor(currentColorName);

    currentSlide.classList.remove("active" , "show");
    nextSlide.classList.add("active" , "show");
});
carouselPrevBtn.addEventListener("click",()=>{
    let currentSlide = document.querySelector(".carousell .carouselItem.active"),
        prevSlide = currentSlide.previousElementSibling ?? document.querySelector(".carousell .carouselItem:last-child"),
        currentColorName = prevSlide.dataset.colorName;
    changeMainColor(currentColorName);

    currentSlide.classList.remove("active" , "show");
    prevSlide.classList.add("active" , "show");
});

// Anchor scroll
navLinks.forEach((navLink)=>{
    navLink.addEventListener("click",()=>{
        let currentSection = document.querySelector(`#${navLink.getAttribute("data-section-id")}`),
            currentSectionTop = currentSection.offsetTop;
        window.scrollTo({
            top : currentSectionTop - navbarHeight
        });
    });
});
document.querySelectorAll("header a.btn").forEach((btn) => {
    btn.addEventListener("click",()=>{
        window.scrollTo({
            top : document.querySelector("#Latest").offsetTop - navbarHeight
        });
    });
});

window.addEventListener("DOMContentLoaded",()=>{
    let currentSlide = document.querySelector(".carousell .carouselItem.active");
    currentSlide.classList.add("show");

    // Loading Page
    document.querySelector(".loadingPage").classList.add("hide");
    setTimeout(()=>{
        document.querySelector(".loadingPage").classList.add("d-none");
    },1000);
});
window.addEventListener("scroll",()=>{
    let windowTop = window.scrollY,
        sectionsName = ["Home","Latest","Featured"];
    for(let sectionName of sectionsName){
        let section = document.querySelector(`#${sectionName}`),
            sectionTop = section.offsetTop - navbarHeight;
        if(windowTop >= sectionTop){
            document.querySelector(".navbar .nav-item.active").classList.remove("active");
            document.querySelector(`.navbar .nav-item[data-section-id="${section.id}"]`).classList.add("active");
        }
    }
    if(windowTop >= 5){
        navbarEle.classList.add("scrolled");
    }
    else{
        navbarEle.classList.remove("scrolled");
    }
});

// Stop propagation on the popUp box
popUpBoxes.forEach((popUpBox)=>{
    popUpBox.addEventListener("click",(e)=>{
        e.stopPropagation();
    });
});

// Latest Products
latest.forEach((product)=>{
    document.querySelector("#Latest .products").innerHTML += `
        <div class="product mb-3" data-id="${product.id}" data-size="${(checkProduct(product.id) == undefined) ? product.sizes[0] : checkProduct(product.id).size}" data-color="${(checkProduct(product.id) == undefined) ? product.colors[0] : checkProduct(product.id).color}">
            <div class="row">
                <div class="col-lg-6 mb-md-4 mb-lg-0 part1">
                    <div class="item">
                        <div class="row">
                            <div class="col-md-2 col-lg-3 col-xl-2">
                                <div class="item">
                                    <ul type="none" class="p-0 m-0">
                                        ${prepareImages(product.images)}
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-10 col-lg-9 col-xl-10 d-flex align-items-center justify-content-center">
                                <div class="item selectedImg">
                                    <img src="./Images/products/${product.images[0]}" class="img-fluid" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 part2">
                    <div class="item">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price mb-2">
                            <strong class="me-2">Price :</strong>
                            ${preparePrice(product.price,product.discount)}
                        </div>
                        <div class="sizes mb-2">
                            <strong class="me-2">Size :</strong>
                            <ul type="none" class="d-inline-flex p-0 m-0">
                                ${prepareSizes(product.sizes, checkProduct(product.id))}
                            </ul>
                        </div>
                        ${
                            (checkProduct(product.id) == undefined) ? 
                            `<button class="btn mt-2" onclick="addToCart(this,${product.id})">Add To Cart</button>` :
                            `<button class="btn mt-2 removeBtn" onclick="removeFromCart(this,${product.id})">Remove From Cart</button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `
});

// Featured Products
features.forEach((product) => {
    let imagesEle = ``;
    for(let i = 0; i < product.images.length; i++){
        imagesEle += `
            <li class="${(i != product.images.length - 1) ? "me-2" : ""} ${(i == 0) ? "active" : ""}" src="./Images/products/${product.images[i]}" onclick="changeActive(this); showSelectedImg(this)"></li>
        `;
    }
    

    document.querySelector("#Featured .row").innerHTML += `
        <div class="col-sm-6 col-lg-3 mb-3 product">
            <div class="item text-center rounded">
                <div class="header">
                    <p class="${(product.discount == 0) ? 'd-none' : ''}">-${product.discount * 100}%</p>
                    <div class="selectedImg">
                        <img src="./Images/products/${product.images[0]}" class="img-fluid" alt="">
                    </div>
                    <i class="fa-solid fa-magnifying-glass" onclick="showProductPopUp(${product.id})"></i>
                    <ul type="none" class="d-flex justify-content-center align-items-center p-0">
                        ${imagesEle}
                    </ul>
                </div>
                <div class="body mt-5">
                    <h6>${product.name}</h6>
                    ${preparePrice(product.price,product.discount)}
                </div>
            </div>
        </div>
    `;
});
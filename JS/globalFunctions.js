// Change color
function changeImg(colorName, imgEle, name){
    let currentName = colorName.split("-")[2],
        currentSrc = (imgEle.tagName == "LINK") ? imgEle.href.split("/") : imgEle.src.split("/");
    currentSrc[currentSrc.length - 1] = `${currentName}-${name}.png`;
    (imgEle.tagName == "LINK") ? imgEle.href = currentSrc.join("/") : imgEle.src = currentSrc.join("/");
}
function changeMainColor(colorName){
    let currentColor = getComputedStyle(html).getPropertyValue(colorName);
    html.style.setProperty("--main-color",currentColor);
    changeImg(colorName, Logo, "logo");
    changeImg(colorName, ShortcutIcon, "logo");
    correctImgs.forEach((correctImg)=>{
        changeImg(colorName,correctImg,"correct");
    });
}

// PopUp functions
function openPopUp(popUpName){
    let currentPopUp = document.querySelector(`.popUp.${popUpName}`);
    currentPopUp.classList.add("active");
    setTimeout(()=>{
    currentPopUp.classList.add("show");
    currentPopUp.querySelector(".box").classList.add("show");
    },1);

    if(popUpName == "cart"){
        let row = currentPopUp.querySelector(".row");
        row.innerHTML = "";
        cartProducts.forEach((cartProduct) => {
            let product = getProduct(cartProduct.id);
            row.innerHTML += `
                <div class="col-md-4 mb-3 product">
                    <div class="item bg-light rounded p-3">
                        <div class="head text-center">
                            <img src="./Images/products/${product.images[0]}" class="img-fluid" alt="">
                        </div>
                        <div class="body">
                            <h5 class="text-center">${product.name.slice(0,15)}${(product.name.length > 15) ? "..." : ""}</h5>
                            <div class="price mt-3">
                                <strong class="me-2">Price :</strong>
                                ${preparePrice(product.price,product.discount)}
                            </div>
                            <div class="sizes my-3">
                                <strong class="me-2">Size :</strong>
                                <ul type="none" class="d-inline-flex p-0 m-0">
                                    <li class="active">${cartProduct.size}</li>
                                </ul>
                            </div>
                            <div class="colors mb-3">
                                <strong class="me-2">Color :</strong>
                                <ul type="none" class="d-inline-flex p-0 m-0">
                                    <li class="active" style="background-color: ${cartProduct.color}"></li>
                                </ul>
                            </div>
                            <button class="btn w-100" onclick="removeBtnInCart(this, ${product.id})">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        })
    }
}
function closePopUp(popUpName){
    let currentPopUp = document.querySelector(`.popUp.${popUpName}`);
    currentPopUp.querySelector(".box").classList.remove("show");
    setTimeout(()=>{
        currentPopUp.classList.remove("show");
        setTimeout(()=>{
            currentPopUp.classList.remove("active");
        },500);
    },500);
}
function showProductPopUp(productId){
    let product = getProduct(productId),
        productPopUpBox = document.querySelector(".popUp.product .box");
    productPopUpBox.innerHTML = `
        <div class="row product" data-id="${product.id}" data-size="${(checkProduct(product.id) == undefined) ? product.sizes[0] : checkProduct(product.id).size}" data-color="${(checkProduct(product.id) == undefined) ? product.colors[0] : checkProduct(product.id).color}">
            <div class="col-md-6">
                <div class="item">
                    <div class="selectedImg">
                        <img src="./Images/products/${product.images[0]}" class="img-fluid" alt="">
                    </div>
                    <ul type="none" class="d-flex p-0 m-0">
                        ${prepareImages(product.images)}
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <div class="item">
                    <h3>${product.name}</h3>
                    ${preparePrice(product.price,product.discount)}
                    <hr>
                    <p>${product.description}</p>
                    <div class="sizes my-3">
                        <strong class="me-2">Size :</strong>
                        <ul type="none" class="d-inline-flex p-0 m-0">
                            ${prepareSizes(product.sizes, checkProduct(product.id))}
                        </ul>
                    </div>
                    <div class="colors my-3">
                        <strong class="me-2">Color :</strong>
                        <ul type="none" class="d-inline-flex p-0 m-0">
                            ${prepareColors(product.colors, checkProduct(product.id))}
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
    `;
    openPopUp('product');
}

// Get product by Id
function getProduct(productId){
    return products.filter((product) => {return product.id == productId;})[0];
}

// Change active in li elements
function changeActive(that){
    that.parentElement.querySelector(".active").classList.remove("active");
    that.classList.add("active");
}

// Get parent element
function parents(element, parentSelector = null){
    let result = element;
    while(true){
        result = result.parentElement;
        if(result.classList.contains("product")){
            break;
        }
    }
    if(parentSelector == null){
        return result;
    }
    else {
        return result.querySelector(parentSelector);
    }
}

function showSelectedImg(that){
    let selectedImgEle = parents(that,'.selectedImg img');
    selectedImgEle.src = that.getAttribute("src");
}

// Prepare HTML elements
function prepareImages(images){
    let HTMLimages = ``;
    for(let i = 0; i < images.length; i++){
        HTMLimages += `
            <li class="${(i != images.length - 1) ? "me-2 me-md-0 mb-md-2" : ""}">
                <img src="./Images/products/${images[i]}" class="img-fluid" onclick="showSelectedImg(this)" alt="">
            </li>
        `;
    }
    return HTMLimages;
}
function preparePrice(price, discount){
    return `
        <span class="text-decoration-line-through text-danger ${ (discount == 0) ? "d-none" : ""}">${price.toFixed(2)} <sup>$</sup></span>
        <span>${(price * (1 - discount)).toFixed(2)} <sup>$</sup></span>
    `;
}
function prepareSizes(sizes, isProductInCart){
    let HTMLsizes = ``;
    for(let i = 0; i < sizes.length; i++){
        if(isProductInCart == undefined){
            HTMLsizes += `
                <li class="${(i != sizes.length - 1) ? 'me-2' : ""} ${(i == 0) ? 'active' : ''}" onclick="changeActive(this); updateSize(this, '${sizes[i]}')">${sizes[i]}</li>
            `;
        }
        else{
            HTMLsizes += `
                <li class="${(i != sizes.length - 1) ? 'me-2' : ""} ${(sizes[i] == isProductInCart.size) ? 'active' : ''}" onclick="changeActive(this); updateSize(this, '${sizes[i]}')">${sizes[i]}</li>
            `;
        }
    }
    return HTMLsizes;
}
function prepareColors(colors, isProductInCart){
    let HTMLcolors = ``;
    for(let i = 0; i < colors.length; i++){
        if(isProductInCart == undefined){
            HTMLcolors += `
                <li class="${(i != colors.length - 1) ? 'me-2' : ''} ${(i == 0) ? 'active' : ''}" onclick="changeActive(this); updateColor(this, '${colors[i]}')" style="background-color: ${colors[i]}"></li>
            `;
        }
        else{
            HTMLcolors += `
                <li class="${(i != colors.length - 1) ? 'me-2' : ''} ${(colors[i] == isProductInCart.color) ? 'active' : ''}" onclick="changeActive(this); updateColor(this, '${colors[i]}')" style="background-color: ${colors[i]}"></li>
            `;
        }
    }
    return HTMLcolors;
}

function updateSize(that, size){
    let parentElement = parents(that);
    parentElement.setAttribute("data-size",size);
}
function updateColor(that, color){
    let parentElement = parents(that);
    parentElement.setAttribute("data-color",color);
}

function updateLocalStorage(){
    localStorage.setItem("cartProducts",JSON.stringify(cartProducts));
}
function checkProduct(productId){
    let isProductInCart = cartProducts.filter((item) => {return item.id == productId ;})[0];
    return isProductInCart;
}

// Return size/color to default (first one)
function returnToDefault(productId){
    let firstSize = document.querySelector(`.product[data-id = "${productId}"] .sizes li`),
        firstColor = document.querySelector(`.product[data-id = "${productId}"] .colors li`);
    changeActive(firstSize);
    updateSize(firstSize, firstSize.textContent.trim());
    if(firstColor != null){
        changeActive(firstColor);
        updateColor(firstColor, firstColor.style.backgroundColor);
    }
}

// Cart functions
function toggleBtn(btn, status){
    if(status == "add"){
        btn.textContent = "Add To Cart";
        btn.classList.remove("removeBtn");
    }
    else if(status == "remove"){
        btn.textContent = "Remove From Cart";
        btn.classList.add("removeBtn");
    }
}
function addToCart(that, productId){
    let product = getProduct(productId),
        productEle = document.querySelector(`.product[data-id="${productId}"]`),
        selectedSize = productEle.getAttribute("data-size"),
        selectedColor = productEle.getAttribute("data-color"),
        cartProduct = {
            id: product.id,
            size: selectedSize,
            color: selectedColor
        };
    cartProducts.push(cartProduct);
    toggleBtn(that,"remove");
    that.setAttribute("onclick", `removeFromCart(this, ${productId})`);
    updateLocalStorage();
    isCartEmpty();
}
function removeFromCart(that, productId){
    cartProducts = cartProducts.filter((item) => {return item.id != productId ;});
    toggleBtn(that,"add");
    that.setAttribute("onclick", `addToCart(this, ${productId})`);
    returnToDefault(productId);
    updateLocalStorage();
    isCartEmpty();
}
function removeBtnInCart(that,productId){
    cartProducts = cartProducts.filter((item) => {return item.id != productId ;});
    parents(that).remove();
    updateLocalStorage();
    isCartEmpty();
    let button = document.querySelector(`.product[data-id = "${productId}"] button`);
    toggleBtn(button,"add");
    button.setAttribute("onclick", `addToCart(this, ${productId})`);
    returnToDefault(productId);
}
function buyNow(){
    cartProducts.forEach((cartProduct) => {
        let button = document.querySelector(`.product[data-id = "${cartProduct.id}"] button`);
        if(button != null){
            toggleBtn(button,"add");
            button.setAttribute("onclick", `addToCart(this, ${cartProduct.id})`);
            returnToDefault(cartProduct.id);
        }
    });
    document.querySelector('.popUp.cart .row').innerHTML = "";
    cartProducts.length = 0;
    updateLocalStorage();
    isCartEmpty();
}

function isCartEmpty(){
    if(cartProducts.length == 0){
        document.querySelector(".popUp.cart .buyBtn").classList.add("d-none");
        document.querySelector(".popUp.cart .alert").classList.remove("d-none");
    }
    else{
        document.querySelector(".popUp.cart .buyBtn").classList.remove("d-none");
        document.querySelector(".popUp.cart .alert").classList.add("d-none");
    }
}
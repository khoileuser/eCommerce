// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author and ID: Le Nguyen Khoi(3975162), Nguyen Thanh Dat(3975867), Tran Anh Tuan(3974799), Le Chanh Tri(3924585)
// ID: Your student ids (e.g. 1234567)
// Acknowledgement: Acknowledge the resources that you use here.

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

/** The function "preview" sets the source of a frame element to the URL of the selected file. */
function preview() {
    frame.src = URL.createObjectURL(event.target.files[0]);
}

/**
 * The clearImage function clears the value of a file input element and sets the source of an image
 * element to a default image.
 */
function clearImage() {
    document.getElementById('formFile').value = "";
    frame.src = "/images/profiles/default.jpg";
}

/**
 * The customAlert function displays a message in an alert container for 10 seconds.
 * @param message - The `message` parameter is a string that represents the message you want to display
 * in the alert.
 */
function customAlert(message) {
    var alertContainer = document.querySelector('.alert-container');
    var alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = message;
    alertContainer.style.display = 'block';

    setTimeout(function () {
        alertContainer.style.display = 'none';
        alertMsg.innerHTML = "";
    }, 10000);
}

/**
 * The function `massDisplayEdit` is used to change the display property of multiple elements specified
 * by an array of queries.
 * @param queries - The "queries" parameter is an array of HTML elements that you want to modify the
 * display property of.
 * @param display - The "display" parameter is a string that specifies how the elements should be
 * displayed. It can have the following values:
 */
function massDisplayEdit(queries, display) {
    for (i = 0; i < queries.length; i++) {
        queries[i].style.display = display;
    }
}

/**
 * The function `nextRegisterForm()` is used to validate user input for a registration form and
 * navigate to the next step of the registration process.
 * @returns The function return when there is a failed validation with alert message.
 */
function nextRegisterForm() {
    const username = document.querySelector('.username');
    const password = document.querySelector('.password');
    const accounttype = document.getElementsByName('accounttype');

    // check not entered
    if (username.value == "" || password.value == "") {
        customAlert('Please enter required information.');
        return;
    }
    var accountTypeCheck = false;
    var accountType = null;
    for (i = 0; i < accounttype.length; i++) {
        if (accounttype[i].checked) {
            accountTypeCheck = true;
            accountType = accounttype[i];
        }
    }
    if (accountTypeCheck == false) {
        customAlert('Please enter required information.');
        return;
    }

    // username and password validation
    if (username.value.length < 8 || username.value.length > 15 || ! /^[a-zA-Z0-9]+$/.test(username.value)) {
        customAlert("Username must contain only letters and digits, and and be 8-15 characters long.");
        return;
    }
    if (! /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(password.value)) {
        customAlert("Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character (!@#$%^&*), and be 8-20 characters long.");
        return;
    }

    // check username exists on database
    fetch('/check/username/' + username.value)
        .then(response => response.text())
        .then(data => {
            if (data == "true") {
                customAlert("Username exists in database, please try another username.");
            }
            else {
                var register1 = document.querySelector('.register-1');
                register1.style.left = -(window.innerWidth + register1.offsetWidth) + "px";

                var register2 = document.querySelector('.register-2');
                register2.style.display = 'block';
                setTimeout(function () { register2.style.left = 0; }, 100);
            }
        });

    // change content of next form based on account type
    var vendorForms = document.querySelectorAll('.vendor-form');
    var customerForms = document.querySelectorAll('.customer-form');
    var shipperForms = document.querySelectorAll('.shipper-form');
    if (accountType.value == "vendor") {
        massDisplayEdit(vendorForms, 'block');
        massDisplayEdit(customerForms, 'none');
        massDisplayEdit(shipperForms, 'none');
    }
    if (accountType.value == "customer") {
        massDisplayEdit(vendorForms, 'none');
        massDisplayEdit(customerForms, 'block');
        massDisplayEdit(shipperForms, 'none');
    }
    if (accountType.value == "shipper") {
        massDisplayEdit(vendorForms, 'none');
        massDisplayEdit(customerForms, 'none');
        massDisplayEdit(shipperForms, 'block');
    }
}

/**
 * The function backRegisterForm is used to transition from the second step of a registration form to
 * the first step by animating the movement of the form elements.
 */
function backRegisterForm() {
    var register2 = document.querySelector('.register-2');
    register2.style.left = "100vw";
    setTimeout(function () { register2.style.display = 'none'; }, 1000);

    var register1 = document.querySelector('.register-1');
    register1.style.left = 0;
}

/**
 * The function `vendorCheck` checks if a vendor name and address already exist in a database before
 * submitting a signup form.
 */
function vendorCheck() {
    if (document.querySelectorAll('.vendor-form')[0].style.display == 'block') {
        // check if vendor name and address is not entered
        const vendorname = document.querySelector('.vendorname').value;
        const vendoraddress = document.querySelector('.vendoraddress').value;
        if (vendorname == "" || vendoraddress == "") {
            customAlert('Please enter required information.');
        }
        else {
            // check if vendor name exist
            fetch('/check/vendorname/' + vendorname)
                .then(response => response.text())
                .then(data => {
                    if (data == "true") {
                        customAlert("Vendor name exists in database, please try another name.");
                    }
                    else {
                        // check if vendor address exist
                        /* The code is making a fetch request to the server to check if a vendor
                        address already exists in the database. */
                        fetch('/check/vendoraddress/' + vendoraddress)
                            .then(response => response.text())
                            .then(data => {
                                if (data == "true") {
                                    customAlert("Vendor address exists in database, please use another address.");
                                }
                                else {
                                    // submit form if all is passed
                                    document.querySelector(".signup-form").submit();
                                }
                            });
                    }
                });
        }
    }
    else if (document.querySelectorAll('.customer-form')[0].style.display == 'block') {
        // check if customer name and address is not entered
        const name = document.querySelector('.name').value;
        const address = document.querySelector('.address').value;
        if (name == "" || address == "") {
            customAlert('Please enter required information.');
        }
        else {
            document.querySelector(".signup-form").submit();
        }
    }
    else if (document.querySelectorAll('.shipper-form')[0].style.display == 'block') {
        // check if shipper hub is not selected
        const hub = document.querySelector('.hub').value;
        if (hub == "Select Hub") {
            customAlert('Please enter required information.');
        }
        else {
            document.querySelector(".signup-form").submit();
        }
    }
}

/**
 * The `signIn` function sends a POST request to the server to check the user's credentials and if they
 * are valid, it submits the sign-in form.
 */
function signIn() {
    const username = document.querySelector('.username').value;
    const password = document.querySelector('.password').value;
    fetch('/check/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'username': username,
            'password': password
        })
    })
        .then(response => response.text())
        .then(data => {
            if (data == "false") {
                customAlert("Login failed! Please check your credentials.");
            }
            else {
                // submit form if all is passed
                document.querySelector('.signin-form').submit();
            }
        });
}

/** The function "preview" sets the source of a frame element to the URL of the selected file. */
function previewImgs() {
    var addProductImgs = document.querySelectorAll('.add-pd-img');
    uploadedImgs = 0;
    for (i = 0; i < addProductImgs.length; i++) {
        if (!addProductImgs[i].src.includes("/images/products/default.png")) {
            uploadedImgs++;
        }
    }
    if (uploadedImgs == 4) {
        customAlert('The maximum amount of images for a product is 4.');
    }
    else if (document.getElementById('formFile').files.length > 4) {
        customAlert('Only 4 files can be selected.');
    }
    else {
        for (i = 0; i < addProductImgs.length; i++) {
            addProductImgs[i].src = "/images/products/default.png";
        }
        for (i = 0; i < addProductImgs.length; i++) {
            addProductImgs[i].src = URL.createObjectURL(event.target.files[i]);
        }
    }
}

/**
 * The clearImages function clears the value of a file input element and sets the source of an image
 * element to a default image.
 */
function clearImages() {
    document.getElementById('formFile').value = "";
    var addProductImgs = document.querySelectorAll('.add-pd-img');
    for (i = 0; i < addProductImgs.length; i++) {
        addProductImgs[i].src = "/images/products/default.png";
    }
}

/**
 * The function `addProductCheck()` checks if the required information for adding a product is entered
 * correctly and displays an alert message if any validation fails.
 */
function addProductCheck() {
    const productName = document.querySelector('.product-name').value;
    const productPrice = document.querySelector('.product-price').value;
    const productImages = document.querySelectorAll('.add-pd-img');
    const productDescription = document.querySelector('.product-desciption').value;

    // check if not entered
    if (productName == "" | productPrice == "") {
        customAlert('Please enter required information.');
    }

    // validation
    else if (productName.length < 10 | productName.length > 20) {
        customAlert('Product name has to be in length from 10 to 20.');
    }
    else if (productPrice < 0) {
        customAlert('Product price has to be larger than 0.');
    }
    else if (productImages[0].src.includes("/images/products/default.png")) {
        customAlert('There has to be atleast 1 image.');
    }
    else if (productDescription.length > 500) {
        customAlert('The maximum length of product description is 500.');
    }
    else {
        if (productDescription == "") {
            document.querySelector('.product-desciption').value = "No description provided.";
        }
        document.querySelector(".add-pd-form").submit();
    }
}

/**
 * The function clears the product information fields and calls another function to clear the images.
 */
function clearProductInfo() {
    document.querySelector('.product-name').value = "";
    document.querySelector('.product-price').value = "";
    document.querySelector('.product-desciption').value = "";
    clearImages();
}

function addToCart(productid, getQuantity = false) {
    var _quantity = 1;
    if (getQuantity) {
        _quantity = document.querySelector('.pd-quantity-input-box-' + productid).value;
    }
    fetch('/cart/add/' + productid + '/quantity/' + _quantity, {
        method: 'POST'
    });
    var quantity = document.querySelector('.cart-count');
    quantity.innerHTML = parseInt(quantity.innerHTML.trim()) + 1;
}

function doFetch(action, productid, quantity) {
    fetch('/cart/' + action + '/' + productid + '/quantity/' + quantity, {
        method: 'POST'
    });
}

function editQuantity(productid, action, _quantity, noUpdate = false, limit = false) {
    var quantity = document.querySelector('.pd-quantity-input-box-' + productid);
    if (action == 'add') {
        if (!noUpdate) { doFetch(action, productid, _quantity) }
        quantity.value = parseInt(quantity.value) + parseInt(_quantity);
    }
    else if (action == 'remove') {
        if (!noUpdate) { doFetch(action, productid, _quantity) }
        if (_quantity == 'all') {
            location.reload();
            return;
        }
        else {
            if (!limit & quantity.value == '1') {
                var cartQuantity = document.querySelector('.cart-count');
                cartQuantity.innerHTML = parseInt(cartQuantity.innerHTML.trim()) - 1;
                location.reload();
            }
            if (limit & quantity.value == '1') {
                return;
            }
            quantity.value = parseInt(quantity.value) - parseInt(_quantity);
        }
    }
    else if (action == 'edit') {
        if (parseInt(quantity.value) > parseInt(quantity.oldvalue)) {
            const calcQuantity = (parseInt(quantity.value) - parseInt(quantity.oldvalue))
            action = 'add';
            if (!noUpdate) { console.log('huh'); doFetch(action, productid, calcQuantity) }
        }
        else if (parseInt(quantity.value) < parseInt(quantity.oldvalue)) {
            const calcQuantity = (parseInt(quantity.oldvalue) - parseInt(quantity.value))
            action = 'remove';
            if (!noUpdate) { console.log('huh'); doFetch(action, productid, calcQuantity) }
            if (calcQuantity <= 0) {
                var cartQuantity = document.querySelector('.cart-count');
                cartQuantity.innerHTML = parseInt(cartQuantity.innerHTML.trim()) - 1;
                location.reload();
            }
        }
    }

    try {
        const pdPrice = parseFloat(document.querySelector('.pd-price-' + productid).innerHTML.trim());
        const totalPrice = parseFloat(quantity.value) * pdPrice;
        document.querySelector('.pd-total-price-' + productid).innerHTML = totalPrice.toFixed(2);

        var cartPrice = document.querySelector('.total-price');
        if (action == 'add') {
            cartPrice.innerHTML = (parseFloat(cartPrice.innerHTML.trim()) + _quantity * pdPrice).toFixed(2);
        }
        else if (action == 'remove') {
            cartPrice.innerHTML = (parseFloat(cartPrice.innerHTML.trim()) - _quantity * pdPrice).toFixed(2);
        }
    }
    catch (error) {
        if (error.name != "TypeError") {
            console.log(error);
        }
    }
}

function editMinPrice() {
    const min_price = parseInt(document.querySelector('.min-price').value);
    document.querySelector(".min-price-txt").innerHTML = "$" + min_price;
}

function editMaxPrice() {
    const max_price = parseInt(document.querySelector('.max-price').value);
    document.querySelector(".max-price-txt").innerHTML = "$" + max_price;
}

function submitForm() {
    console.log(document.querySelector('.profile').value)
    document.querySelector('.upload-profile-img').submit()
}

// ========== Listener ==========

/**
 * Handle page reload when user uses browser's back and forward button
 */
window.addEventListener("pageshow", function (event) {
    var historyTraversal = event.persisted ||
        (typeof window.performance != "undefined" &&
            window.performance.navigation.type === 2);
    if (historyTraversal) {
        window.location.reload();
    }
})

/**
 * The code is adding an event listener to the `DOMContentLoaded` event to set the height of the
 * dummy div except the signup page for pushing the footer down
 */
window.onload = function () {
    if (window.location.pathname != "/signup") {
        const viewportHeight = window.innerHeight;
        const documentHeight = document.body.offsetHeight;
        if (viewportHeight > documentHeight) {
            document.querySelector('.dummy').style.height = (viewportHeight - documentHeight) + 'px';
        }
    }
}

/**
 * The code is adding an event listener to the `DOMContentLoaded` event to set the height of the
 * dummy div in signup page for pushing the footer down because there are absolute divs on the page
 */
document.addEventListener("DOMContentLoaded", function setDummyDiv() {
    if (window.location.pathname == "/signup") {
        const viewportHeight = window.innerHeight;
        const documentHeight = document.body.offsetHeight;
        const absoluteDivHeight = document.querySelector('.register-1').offsetHeight;
        const footerHeight = document.querySelector('.footer-container').offsetHeight;
        if ((viewportHeight - documentHeight) < absoluteDivHeight) {
            document.querySelector('.dummy').style.height = (absoluteDivHeight + footerHeight) + 'px';
        }
        else {
            document.querySelector('.dummy').style.height = ((viewportHeight - footerHeight) - (documentHeight - footerHeight)) + 'px';
        }
    }
})

/**
 * The code is adding an event listener to the "DOMContentLoaded" event to set appropriate content
 * on the navigation bar for each account type.
 */
document.addEventListener("DOMContentLoaded", function displayNav() {
    if (window.location.pathname != "/signup" & window.location.pathname != "/signin") {
        const user = document.querySelector('.user').innerHTML.trim();
        if (user != "Guest") {
            // hide signin and signup button
            document.querySelector('.nav-signin').style.display = "none";
            document.querySelector('.nav-signup').style.display = "none";
            const accountType = document.querySelector('.account-type').innerHTML.trim();
            if (accountType == 'vendor') {
                // hide customer and shipper page button
                var customerNav = document.querySelectorAll('.nav-customer');
                massDisplayEdit(customerNav, 'none');
            }
            else if (accountType == 'customer') {
                // hide vendor and shipper page button
                var vendorNav = document.querySelectorAll('.nav-vendor');
                massDisplayEdit(vendorNav, 'none');
            }
            else if (accountType == 'shipper') {
                // hide customer and vendor page button
                var customerNav = document.querySelectorAll('.nav-customer');
                massDisplayEdit(customerNav, 'none');
                var vendorNav = document.querySelectorAll('.nav-vendor');
                massDisplayEdit(vendorNav, 'none');
                document.querySelector('.nav-shipper').style.display = 'block';
            }
        }
        else {
            // hide cart and user menu
            document.querySelector('.nav-cart').style.display = "none";
            document.querySelector('.nav-user-menu').style.display = "none";
        }
    }
})

/**
 * Retrieves the value of the "account-type" element and display content according
 * to its value. 
 */
document.addEventListener("DOMContentLoaded", function setAccountTypeDisplay() {
    var displayVendor = document.querySelectorAll('.display-vendor');
    var displayCustomer = document.querySelectorAll('.display-customer');
    var displayShipper = document.querySelectorAll('.display-shipper');
    const accountType = document.querySelector('.account-type').innerHTML.trim();
    if (accountType == "vendor") {
        massDisplayEdit(displayCustomer, 'none');
        massDisplayEdit(displayShipper, 'none');
    }
    else if (accountType == "customer") {
        massDisplayEdit(displayVendor, 'none');
        massDisplayEdit(displayShipper, 'none');
    }
    else if (accountType == "shipper") {
        massDisplayEdit(displayVendor, 'none');
        massDisplayEdit(displayCustomer, 'none');
    }
    else {
        massDisplayEdit(displayCustomer, 'none');
        massDisplayEdit(displayVendor, 'none');
        massDisplayEdit(displayShipper, 'none');
    }
})

/**
 * Retrieves the value of the "order-count" in order page and display no
 * orders message if value is 0.
 */
document.addEventListener("DOMContentLoaded", function setOrdersCount() {
    if (window.location.pathname == "/orders") {
        const orderCount = document.querySelector('.order-count').innerHTML.trim();
        if (orderCount != "0") {
            document.querySelector('.no-order').style.display = "none";
        }
        else {
            document.querySelector('.display-orders').style.display = "none";
        }
    }
})

/**
 * Retrieves the value of the "vendor-name" in view products page to determine
 * if the page is view all products from a vendor, if it is, remove "product-card-ctrl"
 * from the product cards to display all products instead of partically remove in css.
 */
document.addEventListener("DOMContentLoaded", function viewProducts() {
    if (window.location.pathname.includes("/products")) {
        const vendorName = document.querySelectorAll('.vendor-name');
        const productCards = document.querySelectorAll('.product-card');
        if (vendorName.length == 1) {
            for (i = 0; i < productCards.length; i++) {
                productCards[i].classList.remove("product-card-ctrl");
            }
        }
        const displayAll = document.querySelector('.display-all').innerHTML.trim();
        if (displayAll == "true") {
            for (i = 0; i < productCards.length; i++) {
                productCards[i].classList.remove("product-card-ctrl");
            }
        }
    }
})

/**
 * Workaround for setting value of product description because setting value of textarea
 * in html not showing the content.
 */
document.addEventListener("DOMContentLoaded", function viewProductDescription() {
    if (window.location.pathname.includes("/product") & window.location.pathname.includes("/update")) {
        const productDescription = document.querySelector('.product-desciption-value').innerHTML.trim()
        document.querySelector('.product-desciption').value = productDescription;
    }
})

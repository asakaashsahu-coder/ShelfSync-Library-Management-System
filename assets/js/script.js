// Mobile menu
const menuBtn =
    document.getElementById("menuBtn") ||
    document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
        navLinks.classList.toggle("show");
    });

    const navItems = navLinks.querySelectorAll("a");

    navItems.forEach(function (item) {
        item.addEventListener("click", function () {
            navLinks.classList.remove("show");
        });
    });
}


// Current year
const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// Storage helpers
function getCurrentMember() {
    const sessionData = localStorage.getItem("shelfSyncSession");

    if (sessionData) {
        return JSON.parse(sessionData);
    }

    return null;
}


function getBorrowStorageKey(email) {
    return "shelfSyncBorrowed_" + email.toLowerCase();
}


function getReturnedStorageKey(email) {
    return "shelfSyncReturned_" + email.toLowerCase();
}


function getActivityStorageKey(email) {
    return "shelfSyncActivity_" + email.toLowerCase();
}


function getBorrowedBooks(email) {
    const data = localStorage.getItem(
        getBorrowStorageKey(email)
    );

    if (data) {
        return JSON.parse(data);
    }

    return [];
}


function saveBorrowedBooks(email, books) {
    localStorage.setItem(
        getBorrowStorageKey(email),
        JSON.stringify(books)
    );
}


function getReturnedBooks(email) {
    const data = localStorage.getItem(
        getReturnedStorageKey(email)
    );

    if (data) {
        return JSON.parse(data);
    }

    return [];
}


function saveReturnedBooks(email, books) {
    localStorage.setItem(
        getReturnedStorageKey(email),
        JSON.stringify(books)
    );
}


function getMemberActivities(email) {
    const data = localStorage.getItem(
        getActivityStorageKey(email)
    );

    if (data) {
        return JSON.parse(data);
    }

    return [];
}


function addMemberActivity(email, activity) {
    const activities = getMemberActivities(email);

    activities.unshift(activity);

    localStorage.setItem(
        getActivityStorageKey(email),
        JSON.stringify(activities.slice(0, 10))
    );
}


// Logged-in navbar
const savedSession =
    localStorage.getItem("shelfSyncSession");

const loginButton =
    document.querySelector(".login-btn") ||
    document.getElementById("accountNavLink");

if (savedSession && loginButton) {
    loginButton.href = "profile.html";

    loginButton.innerHTML =
        '<i class="fa-regular fa-user"></i> Profile';
}


// Home search
const bookSearch =
    document.getElementById("bookSearch");

const searchBtn =
    document.getElementById("searchBtn");


if (bookSearch && searchBtn) {

    searchBtn.addEventListener("click", function () {

        const value =
            bookSearch.value.trim();

        if (value === "") {

            alert("Please enter a book name.");

        } else {

            window.location.href =
                "books.html?search=" +
                encodeURIComponent(value);
        }
    });


    bookSearch.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                searchBtn.click();
            }
        }
    );
}


// Books page
const librarySearch =
    document.getElementById("librarySearch");

const librarySearchBtn =
    document.getElementById("librarySearchBtn");

const categorySelect =
    document.getElementById("categorySelect");


const filterButtons =
    document.querySelectorAll(
        ".filter-btn, .book-filter-btn"
    );


const libraryBooks =
    document.querySelectorAll(
        ".library-book-card"
    );


const noBooks =
    document.getElementById("noBooks");


// Filter books
function filterBooks() {

    if (!libraryBooks.length) {
        return;
    }


    let searchText = "";

    if (librarySearch) {

        searchText =
            librarySearch.value
                .toLowerCase()
                .trim();
    }


    let category = "all";

    if (categorySelect) {
        category = categorySelect.value;
    }


    let found = 0;


    libraryBooks.forEach(function (book) {

        const title =
            (book.dataset.title || "")
                .toLowerCase();

        const author =
            (book.dataset.author || "")
                .toLowerCase();

        const bookCategory =
            book.dataset.category || "all";


        const matchesSearch =
            title.includes(searchText) ||
            author.includes(searchText);


        const matchesCategory =
            category === "all" ||
            bookCategory === category;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            book.style.display = "block";

            found++;

        } else {

            book.style.display = "none";
        }
    });


    if (noBooks) {

        if (found === 0) {

            noBooks.style.display = "block";

        } else {

            noBooks.style.display = "none";
        }
    }
}


// Search button
if (librarySearchBtn) {

    librarySearchBtn.addEventListener(
        "click",
        filterBooks
    );
}


// Search while typing
if (librarySearch) {

    librarySearch.addEventListener(
        "input",
        filterBooks
    );
}


// Category select
if (categorySelect) {

    categorySelect.addEventListener(
        "change",
        filterBooks
    );
}


// Category buttons
filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(
                function (item) {

                    item.classList.remove(
                        "active"
                    );
                }
            );


            button.classList.add(
                "active"
            );


            if (categorySelect) {

                categorySelect.value =
                    button.dataset.category ||
                    "all";
            }


            filterBooks();
        }
    );
});


// Search coming from Home page
if (
    librarySearch &&
    libraryBooks.length
) {

    const urlData =
        new URLSearchParams(
            window.location.search
        );


    const searchValue =
        urlData.get("search");


    if (searchValue) {

        librarySearch.value =
            searchValue;

        filterBooks();
    }
}


// Borrow buttons
const borrowButtons =
    document.querySelectorAll(
        ".borrow-btn:not(.unavailable-btn)"
    );


// Mark books already borrowed
function markAlreadyBorrowedBooks() {

    const member =
        getCurrentMember();


    if (
        !member ||
        !libraryBooks.length
    ) {
        return;
    }


    const borrowed =
        getBorrowedBooks(
            member.email
        );


    libraryBooks.forEach(
        function (book) {

            const title =
                book.dataset.title;


            const alreadyBorrowed =
                borrowed.some(
                    function (item) {

                        return (
                            item.title === title
                        );
                    }
                );


            if (!alreadyBorrowed) {
                return;
            }


            const button =
                book.querySelector(
                    ".borrow-btn"
                );


            if (button) {

                button.disabled = true;

                button.textContent =
                    "Borrowed";
            }


            const availability =
                book.querySelector(
                    ".availability"
                );


            if (availability) {

                availability.textContent =
                    "Borrowed";

                availability.classList.remove(
                    "available"
                );

                availability.classList.add(
                    "borrowed"
                );
            }
        }
    );
}


// Borrow a book
borrowButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const member =
                    getCurrentMember();


                // User must login
                if (!member) {

                    const goToLogin =
                        confirm(
                            "You need to login before borrowing a book. Go to the login page?"
                        );


                    if (goToLogin) {

                        window.location.href =
                            "login.html";
                    }


                    return;
                }


                const book =
                    button.closest(
                        ".library-book-card"
                    );


                if (!book) {
                    return;
                }


                const title =
                    book.dataset.title ||
                    "Unknown Book";


                const author =
                    book.dataset.author ||
                    "Unknown Author";


                const category =
                    book.dataset.category ||
                    "General";


                const price =
                    book.dataset.price ||
                    "Not listed";


                const borrowedBooks =
                    getBorrowedBooks(
                        member.email
                    );


                // Prevent duplicate borrowing
                const alreadyBorrowed =
                    borrowedBooks.some(
                        function (item) {

                            return (
                                item.title === title
                            );
                        }
                    );


                if (alreadyBorrowed) {

                    alert(
                        "You have already borrowed this book."
                    );

                    return;
                }


                const answer =
                    confirm(
                        'Borrow "' +
                        title +
                        '" for 14 days?'
                    );


                if (!answer) {
                    return;
                }


                const borrowedAt =
                    new Date();


                const dueAt =
                    new Date(
                        borrowedAt
                    );


                // 14 day borrowing period
                dueAt.setDate(
                    dueAt.getDate() + 14
                );


                const borrowedBook = {

                    id: Date.now(),

                    title: title,

                    author: author,

                    category: category,

                    price: price,

                    borrowedAt:
                        borrowedAt.toISOString(),

                    dueAt:
                        dueAt.toISOString()
                };


                borrowedBooks.push(
                    borrowedBook
                );


                saveBorrowedBooks(
                    member.email,
                    borrowedBooks
                );


                // Add activity
                addMemberActivity(
                    member.email,
                    {

                        type: "borrow",

                        title: title,

                        date:
                            new Date()
                                .toISOString()
                    }
                );


                button.disabled = true;

                button.textContent =
                    "Borrowed";


                const availability =
                    book.querySelector(
                        ".availability"
                    );


                if (availability) {

                    availability.textContent =
                        "Borrowed";

                    availability.classList.remove(
                        "available"
                    );

                    availability.classList.add(
                        "borrowed"
                    );
                }


                alert(
                    title +
                    " has been borrowed successfully for 14 days."
                );
            }
        );
    }
);


markAlreadyBorrowedBooks();


// Book details modal
const bookDetailsModal =
    document.getElementById("bookDetailsModal");

const bookModalOverlay =
    document.getElementById("bookModalOverlay");

const closeBookModal =
    document.getElementById("closeBookModal");

const modalCloseButton =
    document.getElementById("modalCloseButton");

const modalBorrowButton =
    document.getElementById("modalBorrowButton");

const bookDetailsButtons =
    document.querySelectorAll(".book-details-btn");

let selectedBookCard = null;


// Make category name readable
function formatBookCategory(category) {

    if (!category) {
        return "General";
    }

    return (
        category.charAt(0).toUpperCase() +
        category.slice(1)
    );
}


// Open selected book details
function openBookDetails(book) {

    if (!bookDetailsModal || !book) {
        return;
    }

    selectedBookCard = book;

    const title =
        book.dataset.title || "Book Title";

    const author =
        book.dataset.author || "Unknown Author";

    const category =
        book.dataset.category || "General";

    const price =
        book.dataset.price || "Not listed";

    const language =
        book.dataset.language || "English";

    const pages =
        book.dataset.pages || "-";

    const year =
        book.dataset.year || "-";

    const edition =
        book.dataset.isbn || "-";

    const description =
        book.dataset.description ||
        "No additional information is available for this book.";


    const modalBookTitle =
        document.getElementById("modalBookTitle");

    const modalBookAuthor =
        document.getElementById("modalBookAuthor");

    const modalBookCategory =
        document.getElementById("modalBookCategory");

    const modalBookDescription =
        document.getElementById("modalBookDescription");

    const modalBookLanguage =
        document.getElementById("modalBookLanguage");

    const modalBookPages =
        document.getElementById("modalBookPages");

    const modalBookYear =
        document.getElementById("modalBookYear");

    const modalBookIsbn =
        document.getElementById("modalBookIsbn");

    const modalBookPrice =
        document.getElementById("modalBookPrice");

    const modalBookStatus =
        document.getElementById("modalBookStatus");


    if (modalBookTitle) {
        modalBookTitle.textContent = title;
    }

    if (modalBookAuthor) {
        modalBookAuthor.textContent = author;
    }

    if (modalBookCategory) {
        modalBookCategory.textContent =
            formatBookCategory(category);
    }

    if (modalBookDescription) {
        modalBookDescription.textContent =
            description;
    }

    if (modalBookLanguage) {
        modalBookLanguage.textContent =
            language;
    }

    if (modalBookPages) {
        modalBookPages.textContent =
            pages;
    }

    if (modalBookYear) {
        modalBookYear.textContent =
            year;
    }

    if (modalBookIsbn) {
        modalBookIsbn.textContent =
            edition;
    }

    if (modalBookPrice) {
        modalBookPrice.textContent =
            price;
    }


    const cardBorrowButton =
        book.querySelector(".borrow-btn");

    const isBorrowed =
        cardBorrowButton &&
        cardBorrowButton.disabled;


    if (modalBookStatus) {

        modalBookStatus.textContent =
            isBorrowed
                ? "Borrowed"
                : "Available";

        modalBookStatus.classList.toggle(
            "modal-borrowed",
            isBorrowed
        );

        modalBookStatus.classList.toggle(
            "modal-available",
            !isBorrowed
        );
    }


    if (modalBorrowButton) {

        modalBorrowButton.disabled =
            Boolean(isBorrowed);

        if (isBorrowed) {

            modalBorrowButton.innerHTML =
                '<i class="fa-solid fa-check"></i> Already Borrowed';

        } else {

            modalBorrowButton.innerHTML =
                '<i class="fa-solid fa-book-open-reader"></i> Borrow Book';
        }
    }


    bookDetailsModal.classList.add("show");

    bookDetailsModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );
}


// Close details popup
function closeBookDetails() {

    if (!bookDetailsModal) {
        return;
    }

    bookDetailsModal.classList.remove(
        "show"
    );

    bookDetailsModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

    selectedBookCard = null;
}


// View Details buttons
bookDetailsButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const book =
                    button.closest(
                        ".library-book-card"
                    );

                openBookDetails(book);
            }
        );
    }
);


// Close using X
if (closeBookModal) {

    closeBookModal.addEventListener(
        "click",
        closeBookDetails
    );
}


// Close using Close button
if (modalCloseButton) {

    modalCloseButton.addEventListener(
        "click",
        closeBookDetails
    );
}


// Close by clicking background
if (bookModalOverlay) {

    bookModalOverlay.addEventListener(
        "click",
        closeBookDetails
    );
}


// Close with Escape key
document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            bookDetailsModal &&
            bookDetailsModal.classList.contains(
                "show"
            )
        ) {

            closeBookDetails();
        }
    }
);


// Borrow directly from details popup
if (modalBorrowButton) {

    modalBorrowButton.addEventListener(
        "click",
        function () {

            if (!selectedBookCard) {
                return;
            }

            const cardBorrowButton =
                selectedBookCard.querySelector(
                    ".borrow-btn"
                );

            if (
                !cardBorrowButton ||
                cardBorrowButton.disabled
            ) {
                return;
            }

            // Keep reference before closing modal
            const buttonToClick =
                cardBorrowButton;

            closeBookDetails();

            // Use the existing ShelfSync borrowing system
            buttonToClick.click();
        }
    );
}


// Gallery filter
const galleryButtons =
    document.querySelectorAll(
        ".gallery-filter-btn"
    );


const galleryItems =
    document.querySelectorAll(
        ".gallery-item"
    );


galleryButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const selected =
                    button.dataset.gallery;


                galleryButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                galleryItems.forEach(
                    function (item) {

                        if (
                            selected === "all" ||
                            item.dataset.gallery ===
                            selected
                        ) {

                            item.style.display =
                                "block";

                        } else {

                            item.style.display =
                                "none";
                        }
                    }
                );
            }
        );
    }
);


// Login and Register
const loginTab =
    document.getElementById(
        "loginTab"
    );


const registerTab =
    document.getElementById(
        "registerTab"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const registerForm =
    document.getElementById(
        "registerForm"
    );


const forgotPasswordForm =
    document.getElementById(
        "forgotPasswordForm"
    );


const forgotPasswordBtn =
    document.getElementById(
        "forgotPasswordBtn"
    );


const backToLoginBtn =
    document.getElementById(
        "backToLoginBtn"
    );


const openRegisterBtn =
    document.getElementById(
        "openRegisterBtn"
    );


const openLoginBtn =
    document.getElementById(
        "openLoginBtn"
    );


// Show login
function showLoginForm() {

    if (loginForm) {
        loginForm.style.display =
            "block";
    }


    if (registerForm) {
        registerForm.style.display =
            "none";
    }


    if (forgotPasswordForm) {
        forgotPasswordForm.style.display =
            "none";
    }


    if (loginTab) {
        loginTab.classList.add(
            "active"
        );
    }


    if (registerTab) {
        registerTab.classList.remove(
            "active"
        );
    }
}


// Show register
function showRegisterForm() {

    if (loginForm) {
        loginForm.style.display =
            "none";
    }


    if (registerForm) {
        registerForm.style.display =
            "block";
    }


    if (forgotPasswordForm) {
        forgotPasswordForm.style.display =
            "none";
    }


    if (registerTab) {
        registerTab.classList.add(
            "active"
        );
    }


    if (loginTab) {
        loginTab.classList.remove(
            "active"
        );
    }
}


// Show forgot password
function showForgotPasswordForm() {

    if (loginForm) {
        loginForm.style.display =
            "none";
    }


    if (registerForm) {
        registerForm.style.display =
            "none";
    }


    if (forgotPasswordForm) {
        forgotPasswordForm.style.display =
            "block";
    }


    if (loginTab) {
        loginTab.classList.remove(
            "active"
        );
    }


    if (registerTab) {
        registerTab.classList.remove(
            "active"
        );
    }
}


// Tab events
if (loginTab) {

    loginTab.addEventListener(
        "click",
        showLoginForm
    );
}


if (registerTab) {

    registerTab.addEventListener(
        "click",
        showRegisterForm
    );
}


if (forgotPasswordBtn) {

    forgotPasswordBtn.addEventListener(
        "click",
        showForgotPasswordForm
    );
}


if (backToLoginBtn) {

    backToLoginBtn.addEventListener(
        "click",
        showLoginForm
    );
}


if (openRegisterBtn) {

    openRegisterBtn.addEventListener(
        "click",
        showRegisterForm
    );
}


if (openLoginBtn) {

    openLoginBtn.addEventListener(
        "click",
        showLoginForm
    );
}


// Login validation
if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            const emailError =
                document.getElementById(
                    "loginEmailError"
                );


            const passwordError =
                document.getElementById(
                    "loginPasswordError"
                );


            emailError.textContent = "";

            passwordError.textContent = "";


            let valid = true;


            if (email === "") {

                emailError.textContent =
                    "Please enter your email.";

                valid = false;

            } else if (
                !email.includes("@")
            ) {

                emailError.textContent =
                    "Please enter a valid email.";

                valid = false;
            }


            if (password === "") {

                passwordError.textContent =
                    "Please enter your password.";

                valid = false;
            }


            if (!valid) {
                return;
            }


            const savedUser =
                localStorage.getItem(
                    "shelfSyncUser"
                );


            if (!savedUser) {

                alert(
                    "No account found. Please register first."
                );

                return;
            }


            const user =
                JSON.parse(
                    savedUser
                );


            if (
                email.toLowerCase() !==
                    user.email.toLowerCase() ||
                password !== user.password
            ) {

                passwordError.textContent =
                    "Email or password is incorrect.";

                return;
            }


            const session = {

                name: user.name,

                email: user.email,

                phone: user.phone,

                memberId:
                    user.memberId,

                joinedDate:
                    user.joinedDate
            };


            localStorage.setItem(
                "shelfSyncSession",
                JSON.stringify(session)
            );


            alert(
                "Login successful."
            );


            window.location.href =
                "profile.html";
        }
    );
}


// Registration validation
if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "registerPhone"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            const nameError =
                document.getElementById(
                    "registerNameError"
                ) ||
                document.getElementById(
                    "nameError"
                );


            const emailError =
                document.getElementById(
                    "registerEmailError"
                );


            const phoneError =
                document.getElementById(
                    "registerPhoneError"
                ) ||
                document.getElementById(
                    "phoneError"
                );


            const passwordError =
                document.getElementById(
                    "registerPasswordError"
                );


            const confirmError =
                document.getElementById(
                    "confirmPasswordError"
                );


            if (nameError) {
                nameError.textContent = "";
            }


            if (emailError) {
                emailError.textContent = "";
            }


            if (phoneError) {
                phoneError.textContent = "";
            }


            if (passwordError) {
                passwordError.textContent = "";
            }


            if (confirmError) {
                confirmError.textContent = "";
            }


            let valid = true;


            if (name === "") {

                if (nameError) {

                    nameError.textContent =
                        "Please enter your name.";
                }

                valid = false;
            }


            if (email === "") {

                if (emailError) {

                    emailError.textContent =
                        "Please enter your email.";
                }

                valid = false;

            } else if (
                !email.includes("@")
            ) {

                if (emailError) {

                    emailError.textContent =
                        "Please enter a valid email.";
                }

                valid = false;
            }


            if (
                phone.length !== 10 ||
                isNaN(phone)
            ) {

                if (phoneError) {

                    phoneError.textContent =
                        "Phone number must contain 10 digits.";
                }

                valid = false;
            }


            if (
                password.length < 6
            ) {

                if (passwordError) {

                    passwordError.textContent =
                        "Password must be at least 6 characters.";
                }

                valid = false;
            }


            if (
                confirmPassword !==
                password
            ) {

                if (confirmError) {

                    confirmError.textContent =
                        "Passwords do not match.";
                }

                valid = false;
            }


            if (!valid) {
                return;
            }


            const memberNumber =
                String(
                    Date.now()
                ).slice(-4);


            const today =
                new Date();


            const joinedDate =
                today.toLocaleDateString(
                    "en-IN",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );


            const user = {

                name: name,

                email: email,

                phone: phone,

                password: password,

                memberId:
                    "SS-" +
                    today.getFullYear() +
                    "-" +
                    memberNumber,

                joinedDate:
                    joinedDate
            };


            localStorage.setItem(
                "shelfSyncUser",
                JSON.stringify(user)
            );


            alert(
                "Registration successful. Please login."
            );


            registerForm.reset();


            showLoginForm();


            const loginEmail =
                document.getElementById(
                    "loginEmail"
                );


            if (loginEmail) {

                loginEmail.value =
                    email;
            }
        }
    );
}


// Forgot Password
if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "forgotEmail"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "forgotPhone"
                    )
                    .value
                    .trim();


            const newPassword =
                document
                    .getElementById(
                        "newPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "forgotConfirmPassword"
                    )
                    .value;


            const emailError =
                document.getElementById(
                    "forgotEmailError"
                );


            const phoneError =
                document.getElementById(
                    "forgotPhoneError"
                );


            const passwordError =
                document.getElementById(
                    "newPasswordError"
                );


            const confirmError =
                document.getElementById(
                    "forgotConfirmError"
                );


            emailError.textContent = "";

            phoneError.textContent = "";

            passwordError.textContent = "";

            confirmError.textContent = "";


            let valid = true;


            if (
                email === "" ||
                !email.includes("@")
            ) {

                emailError.textContent =
                    "Please enter a valid email.";

                valid = false;
            }


            if (
                phone.length !== 10 ||
                isNaN(phone)
            ) {

                phoneError.textContent =
                    "Enter your registered 10 digit phone number.";

                valid = false;
            }


            if (
                newPassword.length < 6
            ) {

                passwordError.textContent =
                    "Password must be at least 6 characters.";

                valid = false;
            }


            if (
                confirmPassword !==
                newPassword
            ) {

                confirmError.textContent =
                    "Passwords do not match.";

                valid = false;
            }


            if (!valid) {
                return;
            }


            const savedUser =
                localStorage.getItem(
                    "shelfSyncUser"
                );


            if (!savedUser) {

                emailError.textContent =
                    "No registered account found.";

                return;
            }


            const user =
                JSON.parse(
                    savedUser
                );


            if (
                email.toLowerCase() !==
                user.email.toLowerCase()
            ) {

                emailError.textContent =
                    "This email is not registered.";

                return;
            }


            if (
                phone !== user.phone
            ) {

                phoneError.textContent =
                    "Phone number does not match our record.";

                return;
            }


            // Update password
            user.password =
                newPassword;


            localStorage.setItem(
                "shelfSyncUser",
                JSON.stringify(user)
            );


            forgotPasswordForm.reset();


            alert(
                "Password changed successfully. You can now login."
            );


            showLoginForm();


            const loginEmail =
                document.getElementById(
                    "loginEmail"
                );


            if (loginEmail) {

                loginEmail.value =
                    user.email;
            }
        }
    );
}


// Format date for profile
function formatLibraryDate(
    dateValue
) {

    return new Date(
        dateValue
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// Calculate remaining borrowing time
function getTimeRemaining(
    dueValue
) {

    const now =
        new Date();


    const due =
        new Date(
            dueValue
        );


    const difference =
        due.getTime() -
        now.getTime();


    // Overdue
    if (difference <= 0) {

        const overdueDays =
            Math.max(
                1,
                Math.ceil(
                    Math.abs(
                        difference
                    ) /
                    86400000
                )
            );


        return (
            overdueDays +
            " day" +
            (
                overdueDays === 1
                    ? ""
                    : "s"
            ) +
            " overdue"
        );
    }


    const days =
        Math.ceil(
            difference /
            86400000
        );


    return (
        days +
        " day" +
        (
            days === 1
                ? ""
                : "s"
        ) +
        " left"
    );
}


// Prevent HTML from user data
function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// Profile elements
const profileName =
    document.getElementById(
        "profileName"
    );


const profileFirstName =
    document.getElementById(
        "profileFirstName"
    );


const profileEmail =
    document.getElementById(
        "profileEmail"
    );


const memberId =
    document.getElementById(
        "memberId"
    );


const joinedDate =
    document.getElementById(
        "joinedDate"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const borrowedCount =
    document.getElementById(
        "borrowedCount"
    );


const totalReadCount =
    document.getElementById(
        "totalReadCount"
    );


const savedCount =
    document.getElementById(
        "savedCount"
    );


const dueSoonCount =
    document.getElementById(
        "dueSoonCount"
    );


const borrowedList =
    document.querySelector(
        ".borrowed-list"
    );


const activityList =
    document.querySelector(
        ".activity-list"
    );


// Display borrowed books
function renderBorrowedBooks(
    member
) {

    if (!borrowedList) {
        return;
    }


    const books =
        getBorrowedBooks(
            member.email
        );


    if (borrowedCount) {

        borrowedCount.textContent =
            books.length;
    }


    let dueSoon = 0;


    const now =
        new Date();


    books.forEach(
        function (book) {

            const difference =
                new Date(
                    book.dueAt
                ) -
                now;


            const days =
                Math.ceil(
                    difference /
                    86400000
                );


            if (
                days >= 0 &&
                days <= 3
            ) {

                dueSoon++;
            }
        }
    );


    if (dueSoonCount) {

        dueSoonCount.textContent =
            dueSoon;
    }


    // No borrowed books
    if (books.length === 0) {

        borrowedList.innerHTML = `
            <div class="empty-library-state">

                <i class="fa-solid fa-book-open"></i>

                <h3>
                    No borrowed books yet
                </h3>

                <p>
                    Borrow an available book and
                    it will appear here with its
                    borrow date, due date and
                    time remaining.
                </p>

                <a href="books.html">
                    Browse Books
                </a>

            </div>
        `;


        return;
    }


    borrowedList.innerHTML = "";


    books.forEach(
        function (book) {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "borrowed-book";


            item.innerHTML = `

                <div class="borrowed-book-icon">

                    <i class="fa-solid fa-book"></i>

                </div>


                <div class="borrowed-book-info">

                    <span class="borrowed-category">

                        ${escapeHtml(
                            book.category
                        )}

                    </span>


                    <h3>

                        ${escapeHtml(
                            book.title
                        )}

                    </h3>


                    <p>

                        ${escapeHtml(
                            book.author
                        )}

                        ·

                        ${escapeHtml(
                            book.price
                        )}

                    </p>

                </div>


                <div class="borrowed-date">

                    <span>
                        Borrowed
                    </span>

                    <strong>

                        ${formatLibraryDate(
                            book.borrowedAt
                        )}

                    </strong>


                    <span>
                        Due
                    </span>

                    <strong>

                        ${formatLibraryDate(
                            book.dueAt
                        )}

                    </strong>

                </div>


                <div class="borrowed-date borrowed-time">

                    <span>
                        Time Remaining
                    </span>

                    <strong class="time-left">

                        ${getTimeRemaining(
                            book.dueAt
                        )}

                    </strong>

                </div>


                <button
                    class="return-book-btn"
                    data-book-id="${book.id}"
                    type="button">

                    Return

                </button>
            `;


            borrowedList.appendChild(
                item
            );
        }
    );


    // Return buttons
    const returnButtons =
        borrowedList.querySelectorAll(
            ".return-book-btn"
        );


    returnButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    returnBook(
                        member,
                        Number(
                            button.dataset.bookId
                        )
                    );
                }
            );
        }
    );
}


// Return book
function returnBook(
    member,
    bookId
) {

    const books =
        getBorrowedBooks(
            member.email
        );


    const book =
        books.find(
            function (item) {

                return (
                    item.id ===
                    bookId
                );
            }
        );


    if (!book) {
        return;
    }


    const answer =
        confirm(
            'Return "' +
            book.title +
            '"?'
        );


    if (!answer) {
        return;
    }


    // Remove from borrowed
    const remainingBooks =
        books.filter(
            function (item) {

                return (
                    item.id !==
                    bookId
                );
            }
        );


    saveBorrowedBooks(
        member.email,
        remainingBooks
    );


    // Add to returned history
    const returnedBooks =
        getReturnedBooks(
            member.email
        );


    returnedBooks.unshift({

        ...book,

        returnedAt:
            new Date()
                .toISOString()
    });


    saveReturnedBooks(
        member.email,
        returnedBooks
    );


    // Activity
    addMemberActivity(
        member.email,
        {

            type: "return",

            title: book.title,

            date:
                new Date()
                    .toISOString()
        }
    );


    // Refresh profile
    renderProfileData(
        member
    );


    alert(
        book.title +
        " has been returned successfully."
    );
}


// Recent activity
function renderActivity(
    member
) {

    if (!activityList) {
        return;
    }


    const activities =
        getMemberActivities(
            member.email
        );


    if (
        activities.length === 0
    ) {

        activityList.innerHTML = `

            <div class="empty-activity-state">

                <i class="fa-solid fa-clock-rotate-left"></i>

                <p>
                    Your borrowing activity
                    will appear here.
                </p>

            </div>
        `;


        return;
    }


    activityList.innerHTML = "";


    activities.forEach(
        function (activity) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "activity-item";


            const isReturn =
                activity.type ===
                "return";


            const title =
                isReturn
                    ? "Book Returned"
                    : "Book Borrowed";


            const icon =
                isReturn
                    ? "fa-rotate-left"
                    : "fa-book-open-reader";


            const message =
                isReturn
                    ? 'Returned "' +
                      activity.title +
                      '"'
                    : 'Borrowed "' +
                      activity.title +
                      '"';


            item.innerHTML = `

                <div class="activity-icon">

                    <i class="fa-solid ${icon}"></i>

                </div>


                <div>

                    <h3>
                        ${title}
                    </h3>

                    <p>
                        ${escapeHtml(
                            message
                        )}
                    </p>

                </div>


                <span>

                    ${formatLibraryDate(
                        activity.date
                    )}

                </span>
            `;


            activityList.appendChild(
                item
            );
        }
    );
}


// Render complete profile
function renderProfileData(
    member
) {

    const borrowed =
        getBorrowedBooks(
            member.email
        );


    const returned =
        getReturnedBooks(
            member.email
        );


    if (profileName) {

        profileName.textContent =
            member.name ||
            "Library Member";
    }


    if (profileFirstName) {

        profileFirstName.textContent =
            (
                member.name ||
                "Member"
            )
                .split(" ")[0];
    }


    if (profileEmail) {

        profileEmail.textContent =
            member.email ||
            "member@shelfsync.com";
    }


    if (memberId) {

        memberId.textContent =
            member.memberId ||
            "-";
    }


    if (joinedDate) {

        joinedDate.textContent =
            member.joinedDate ||
            "-";
    }


    if (borrowedCount) {

        borrowedCount.textContent =
            borrowed.length;
    }


    if (totalReadCount) {

        totalReadCount.textContent =
            returned.length;
    }


    // Saved feature not added yet
    if (savedCount) {

        savedCount.textContent =
            "0";
    }


    renderBorrowedBooks(
        member
    );


    renderActivity(
        member
    );
}


// Protect profile page
if (profileName) {

    const member =
        getCurrentMember();


    if (!member) {

        alert(
            "Please login to view your profile."
        );


        window.location.href =
            "login.html";

    } else {

        renderProfileData(
            member
        );
    }
}


// Logout
if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            const answer =
                confirm(
                    "Do you want to logout?"
                );


            if (!answer) {
                return;
            }


            localStorage.removeItem(
                "shelfSyncSession"
            );


            alert(
                "Logged out successfully."
            );


            window.location.href =
                "login.html";
        }
    );
}


// Contact form
const contactForm =
    document.getElementById(
        "contactForm"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "contactName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "contactEmail"
                    )
                    .value
                    .trim();


            const subject =
                document
                    .getElementById(
                        "contactSubject"
                    )
                    .value
                    .trim();


            const message =
                document
                    .getElementById(
                        "contactMessage"
                    )
                    .value
                    .trim();


            const nameError =
                document.getElementById(
                    "contactNameError"
                );


            const emailError =
                document.getElementById(
                    "contactEmailError"
                );


            const subjectError =
                document.getElementById(
                    "contactSubjectError"
                );


            const messageError =
                document.getElementById(
                    "contactMessageError"
                );


            nameError.textContent = "";

            emailError.textContent = "";

            subjectError.textContent = "";

            messageError.textContent = "";


            let valid = true;


            if (name === "") {

                nameError.textContent =
                    "Please enter your name.";

                valid = false;
            }


            if (email === "") {

                emailError.textContent =
                    "Please enter your email.";

                valid = false;

            } else if (
                !email.includes("@")
            ) {

                emailError.textContent =
                    "Please enter a valid email.";

                valid = false;
            }


            if (subject === "") {

                subjectError.textContent =
                    "Please enter a subject.";

                valid = false;
            }


            if (message === "") {

                messageError.textContent =
                    "Please enter your message.";

                valid = false;
            }


            if (valid) {

                alert(
                    "Message sent successfully."
                );


                contactForm.reset();
            }
        }
    );
}
// Mobile menu
const menuBtn = document.getElementById("menuBtn");
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


// Logged-in navbar
const savedSession = localStorage.getItem("shelfSyncSession");
const loginButton = document.querySelector(".login-btn");

if (savedSession && loginButton) {
    loginButton.href = "profile.html";
    loginButton.innerHTML =
        '<i class="fa-regular fa-user"></i> Profile';
}


// Home search
const bookSearch = document.getElementById("bookSearch");
const searchBtn = document.getElementById("searchBtn");

if (bookSearch && searchBtn) {
    searchBtn.addEventListener("click", function () {

        const value = bookSearch.value.trim();

        if (value === "") {
            alert("Please enter a book name.");
        } else {
            window.location.href =
                "books.html?search=" + encodeURIComponent(value);
        }
    });
}


// Books page
const librarySearch = document.getElementById("librarySearch");
const librarySearchBtn = document.getElementById("librarySearchBtn");
const categorySelect = document.getElementById("categorySelect");
const filterButtons = document.querySelectorAll(".filter-btn");
const libraryBooks = document.querySelectorAll(".library-book-card");
const noBooks = document.getElementById("noBooks");

function filterBooks() {

    if (!libraryBooks.length) {
        return;
    }

    let searchText = "";

    if (librarySearch) {
        searchText = librarySearch.value.toLowerCase().trim();
    }

    let category = "all";

    if (categorySelect) {
        category = categorySelect.value;
    }

    let found = 0;

    libraryBooks.forEach(function (book) {

        const title = book.dataset.title.toLowerCase();
        const author = book.dataset.author.toLowerCase();
        const bookCategory = book.dataset.category;

        const matchesSearch =
            title.includes(searchText) ||
            author.includes(searchText);

        const matchesCategory =
            category === "all" ||
            bookCategory === category;

        if (matchesSearch && matchesCategory) {
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


if (librarySearchBtn) {
    librarySearchBtn.addEventListener("click", filterBooks);
}


if (librarySearch) {
    librarySearch.addEventListener("keyup", filterBooks);
}


if (categorySelect) {
    categorySelect.addEventListener("change", filterBooks);
}


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        if (categorySelect) {
            categorySelect.value = button.dataset.category;
        }

        filterBooks();
    });
});


// Search from Home page
if (librarySearch && libraryBooks.length) {

    const urlData = new URLSearchParams(window.location.search);
    const searchValue = urlData.get("search");

    if (searchValue) {
        librarySearch.value = searchValue;
        filterBooks();
    }
}


// Borrow buttons
const borrowButtons =
    document.querySelectorAll(".borrow-btn:not(.unavailable-btn)");

borrowButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const book = button.closest(".library-book-card");
        const title = book.dataset.title;

        const answer = confirm(
            "Do you want to borrow " + title + "?"
        );

        if (answer) {
            alert("Book request submitted successfully.");
        }
    });
});


// Gallery filter
const galleryButtons =
    document.querySelectorAll(".gallery-filter-btn");

const galleryItems =
    document.querySelectorAll(".gallery-item");

galleryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const selected = button.dataset.gallery;

        galleryButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        galleryItems.forEach(function (item) {

            if (
                selected === "all" ||
                item.dataset.gallery === selected
            ) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});


// Login and Register tabs
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (loginTab && registerTab && loginForm && registerForm) {

    loginTab.addEventListener("click", function () {

        loginForm.style.display = "block";
        registerForm.style.display = "none";

        loginTab.classList.add("active");
        registerTab.classList.remove("active");
    });


    registerTab.addEventListener("click", function () {

        loginForm.style.display = "none";
        registerForm.style.display = "block";

        registerTab.classList.add("active");
        loginTab.classList.remove("active");
    });
}


// Login validation
if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const emailError =
            document.getElementById("loginEmailError");

        const passwordError =
            document.getElementById("loginPasswordError");

        emailError.textContent = "";
        passwordError.textContent = "";

        let valid = true;

        if (email === "") {
            emailError.textContent = "Please enter your email.";
            valid = false;
        } else if (!email.includes("@")) {
            emailError.textContent = "Please enter a valid email.";
            valid = false;
        }

        if (password === "") {
            passwordError.textContent = "Please enter your password.";
            valid = false;
        }

        if (!valid) {
            return;
        }

        const savedUser = localStorage.getItem("shelfSyncUser");

        if (!savedUser) {
            alert("No account found. Please register first.");
            return;
        }

        const user = JSON.parse(savedUser);

        if (
            email.toLowerCase() !== user.email.toLowerCase() ||
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
            memberId: user.memberId,
            joinedDate: user.joinedDate
        };

        localStorage.setItem(
            "shelfSyncSession",
            JSON.stringify(session)
        );

        alert("Login successful.");

        window.location.href = "profile.html";
    });
}


// Registration validation
if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const phone =
            document.getElementById("registerPhone").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const nameError =
            document.getElementById("nameError");

        const emailError =
            document.getElementById("registerEmailError");

        const phoneError =
            document.getElementById("phoneError");

        const passwordError =
            document.getElementById("registerPasswordError");

        const confirmError =
            document.getElementById("confirmPasswordError");

        nameError.textContent = "";
        emailError.textContent = "";
        phoneError.textContent = "";
        passwordError.textContent = "";
        confirmError.textContent = "";

        let valid = true;

        if (name === "") {
            nameError.textContent = "Please enter your name.";
            valid = false;
        }

        if (email === "") {
            emailError.textContent = "Please enter your email.";
            valid = false;
        } else if (!email.includes("@")) {
            emailError.textContent = "Please enter a valid email.";
            valid = false;
        }

        if (phone.length !== 10 || isNaN(phone)) {
            phoneError.textContent =
                "Phone number must contain 10 digits.";
            valid = false;
        }

        if (password.length < 6) {
            passwordError.textContent =
                "Password must be at least 6 characters.";
            valid = false;
        }

        if (confirmPassword !== password) {
            confirmError.textContent =
                "Passwords do not match.";
            valid = false;
        }

        if (!valid) {
            return;
        }

        const memberNumber =
            String(Date.now()).slice(-4);

        const today = new Date();

        const joinedDate =
            today.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric"
            });

        const user = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            memberId:
                "SS-" + today.getFullYear() + "-" + memberNumber,
            joinedDate: joinedDate
        };

        localStorage.setItem(
            "shelfSyncUser",
            JSON.stringify(user)
        );

        alert("Registration successful. Please login.");

        registerForm.reset();

        loginForm.style.display = "block";
        registerForm.style.display = "none";

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        document.getElementById("loginEmail").value = email;
    });
}


// Profile page
const profileName = document.getElementById("profileName");

const profileFirstName =
    document.getElementById("profileFirstName");

const profileEmail =
    document.getElementById("profileEmail");

const memberId =
    document.getElementById("memberId");

const joinedDate =
    document.getElementById("joinedDate");

const logoutBtn =
    document.getElementById("logoutBtn");

if (profileName) {

    const sessionData =
        localStorage.getItem("shelfSyncSession");

    if (!sessionData) {

        alert("Please login to view your profile.");

        window.location.href = "login.html";

    } else {

        const user =
            JSON.parse(sessionData);

        profileName.textContent =
            user.name || "Library Member";

        profileEmail.textContent =
            user.email || "member@shelfsync.com";

        memberId.textContent =
            user.memberId || "SS-2026-001";

        joinedDate.textContent =
            user.joinedDate || "September 2026";

        if (profileFirstName) {

            const firstName =
                (user.name || "Member")
                    .split(" ")[0];

            profileFirstName.textContent =
                firstName;
        }
    }
}


// Logout
if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        const answer =
            confirm("Do you want to logout?");

        if (answer) {

            localStorage.removeItem(
                "shelfSyncSession"
            );

            alert("Logged out successfully.");

            window.location.href =
                "login.html";
        }
    });
}


// Contact form validation
const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("contactName").value.trim();

        const email =
            document.getElementById("contactEmail").value.trim();

        const subject =
            document.getElementById("contactSubject").value.trim();

        const message =
            document.getElementById("contactMessage").value.trim();

        const nameError =
            document.getElementById("contactNameError");

        const emailError =
            document.getElementById("contactEmailError");

        const subjectError =
            document.getElementById("contactSubjectError");

        const messageError =
            document.getElementById("contactMessageError");

        nameError.textContent = "";
        emailError.textContent = "";
        subjectError.textContent = "";
        messageError.textContent = "";

        let valid = true;

        if (name === "") {
            nameError.textContent = "Please enter your name.";
            valid = false;
        }

        if (email === "") {
            emailError.textContent = "Please enter your email.";
            valid = false;
        } else if (!email.includes("@")) {
            emailError.textContent = "Please enter a valid email.";
            valid = false;
        }

        if (subject === "") {
            subjectError.textContent = "Please enter a subject.";
            valid = false;
        }

        if (message === "") {
            messageError.textContent = "Please enter your message.";
            valid = false;
        }

        if (valid) {
            alert("Message sent successfully.");
            contactForm.reset();
        }
    });
}
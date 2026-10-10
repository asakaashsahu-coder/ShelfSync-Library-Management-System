/* ShelfSync - Complete Main JavaScript */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       Basic setup
    ========================= */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    const inHtmlFolder =
        window.location.pathname.toLowerCase().includes("/assets/html/");

    function pageLink(page) {
        return inHtmlFolder ? page : "assets/html/" + page;
    }


    /* =========================
       Mobile / Tablet Navigation
    ========================= */

    const menuBtn =
        document.getElementById("menuToggle") ||
        document.getElementById("menuBtn");

    const navLinks =
        document.getElementById("navLinks");

    if (menuBtn && navLinks) {

        menuBtn.type = "button";

        menuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        menuBtn.setAttribute(
            "aria-controls",
            "navLinks"
        );

        menuBtn.setAttribute(
            "aria-label",
            "Open navigation menu"
        );


        function closeMobileMenu() {

            navLinks.classList.remove("open");
            navLinks.classList.remove("show");
            navLinks.classList.remove("active");

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            menuBtn.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            const icon =
                menuBtn.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        }


        function openMobileMenu() {

            navLinks.classList.add("open");

            menuBtn.setAttribute(
                "aria-expanded",
                "true"
            );

            menuBtn.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

            const icon =
                menuBtn.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            }
        }


        menuBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const isOpen =
                    navLinks.classList.contains("open");

                if (isOpen) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            }
        );


        navLinks
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {
                        closeMobileMenu();
                    }
                );

            });


        document.addEventListener(
            "click",
            function (event) {

                if (
                    !navLinks.classList.contains("open")
                ) {
                    return;
                }

                if (
                    navLinks.contains(event.target) ||
                    menuBtn.contains(event.target)
                ) {
                    return;
                }

                closeMobileMenu();
            }
        );


        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Escape") {
                    closeMobileMenu();
                }
            }
        );


        window.addEventListener(
            "resize",
            function () {

                if (window.innerWidth > 850) {
                    closeMobileMenu();
                }
            }
        );
    }


    /* =========================
       Storage helpers
    ========================= */

    function getCurrentMember() {

        const data =
            localStorage.getItem(
                "shelfSyncSession"
            );

        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            localStorage.removeItem(
                "shelfSyncSession"
            );
            return null;
        }
    }


    function getUsers() {

        try {

            const users =
                JSON.parse(
                    localStorage.getItem(
                        "shelfSyncUsers"
                    ) || "[]"
                );

            if (Array.isArray(users)) {
                return users;
            }

        } catch (error) {
            return [];
        }

        return [];
    }


    function saveUsers(users) {

        localStorage.setItem(
            "shelfSyncUsers",
            JSON.stringify(users)
        );
    }


    function migrateOldUser() {

        const oldUser =
            localStorage.getItem(
                "shelfSyncUser"
            );

        if (!oldUser) {
            return;
        }

        const users = getUsers();

        try {

            const user =
                JSON.parse(oldUser);

            if (
                user &&
                user.email &&
                !users.some(function (item) {
                    return (
                        item.email.toLowerCase() ===
                        user.email.toLowerCase()
                    );
                })
            ) {

                users.push(user);
                saveUsers(users);
            }

        } catch (error) {
            return;
        }
    }

    migrateOldUser();


    function getStorageKey(type, email) {

        return (
            "shelfSync" +
            type +
            "_" +
            String(email || "").toLowerCase()
        );
    }


    function readList(type, email) {

        if (!email) {
            return [];
        }

        try {

            return JSON.parse(
                localStorage.getItem(
                    getStorageKey(type, email)
                ) || "[]"
            );

        } catch (error) {
            return [];
        }
    }


    function saveList(type, email, data) {

        localStorage.setItem(
            getStorageKey(type, email),
            JSON.stringify(data)
        );
    }


    function getBorrowedBooks(email) {
        return readList(
            "Borrowed",
            email
        );
    }


    function saveBorrowedBooks(
        email,
        books
    ) {
        saveList(
            "Borrowed",
            email,
            books
        );
    }


    function getReturnedBooks(email) {
        return readList(
            "Returned",
            email
        );
    }


    function saveReturnedBooks(
        email,
        books
    ) {
        saveList(
            "Returned",
            email,
            books
        );
    }


    function getActivities(email) {
        return readList(
            "Activity",
            email
        );
    }


    function addActivity(
        email,
        activity
    ) {

        const activities =
            getActivities(email);

        activities.unshift(activity);

        saveList(
            "Activity",
            email,
            activities.slice(0, 10)
        );
    }


    /* =========================
       Navbar account
    ========================= */

    function updateNavbar() {

        const member =
            getCurrentMember();
            
        const adminLink =
            document.getElementById("adminNavLink");

        if (adminLink) {
            adminLink.href = pageLink("admin.html");

            adminLink.style.display =
                member && member.role === "admin"
                    ? ""
                    : "none";
        }


        const account =
            document.getElementById(
                "accountNavLink"
            ) ||
            document.querySelector(
                ".login-btn"
            );

        if (!account) {
            return;
        }

        account.href =
            member
                ? pageLink("profile.html")
                : pageLink("login.html");

        account.innerHTML =
            member
                ? '<i class="fa-regular fa-user"></i> Profile'
                : '<i class="fa-regular fa-user"></i> Login';
    }

    updateNavbar();


    /* =========================
       Home search
    ========================= */

    const homeSearch =
        document.getElementById(
            "bookSearch"
        );

    const homeSearchButton =
        document.getElementById(
            "searchBtn"
        );


    function performHomeSearch() {

        if (!homeSearch) {
            return;
        }

        const value =
            homeSearch.value.trim();

        if (!value) {

            alert(
                "Please enter a book name."
            );

            return;
        }

        window.location.href =
            pageLink("books.html") +
            "?search=" +
            encodeURIComponent(value);
    }


    if (homeSearchButton) {

        homeSearchButton.addEventListener(
            "click",
            performHomeSearch
        );
    }


    if (homeSearch) {

        homeSearch.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {
                    performHomeSearch();
                }
            }
        );
    }


    /* =========================
       Books
    ========================= */

    const librarySearch =
        document.getElementById(
            "librarySearch"
        );

    const librarySearchButton =
        document.getElementById(
            "librarySearchBtn"
        );

    const categorySelect =
        document.getElementById(
            "categorySelect"
        );

    const libraryBooks =
        document.querySelectorAll(
            ".library-book-card"
        );

    const noBooks =
        document.getElementById(
            "noBooks"
        );


    function filterBooks() {

        if (!libraryBooks.length) {
            return;
        }

        const search =
            librarySearch
                ? librarySearch.value
                    .toLowerCase()
                    .trim()
                : "";

        const category =
            categorySelect
                ? categorySelect.value.toLowerCase()
                : "all";

        let found = 0;


        libraryBooks.forEach(
            function (book) {

                const title =
                    (
                        book.dataset.title ||
                        ""
                    ).toLowerCase();

                const author =
                    (
                        book.dataset.author ||
                        ""
                    ).toLowerCase();

                const description =
                    (
                        book.dataset.description ||
                        ""
                    ).toLowerCase();

                const bookCategory =
                    (
                        book.dataset.category ||
                        "all"
                    ).toLowerCase();

                const searchMatch =
                    title.includes(search) ||
                    author.includes(search) ||
                    description.includes(search);

                const categoryMatch =
                    category === "all" ||
                    bookCategory === category;

                const show =
                    searchMatch &&
                    categoryMatch;

                book.style.display =
                    show ? "" : "none";

                if (show) {
                    found++;
                }
            }
        );


        if (noBooks) {

            noBooks.style.display =
                found === 0
                    ? "block"
                    : "none";
        }
    }


    if (librarySearchButton) {

        librarySearchButton.addEventListener(
            "click",
            filterBooks
        );
    }


    if (librarySearch) {

        librarySearch.addEventListener(
            "input",
            filterBooks
        );

        const urlSearch =
            new URLSearchParams(
                window.location.search
            ).get("search");

        if (urlSearch) {

            librarySearch.value =
                urlSearch;

            filterBooks();
        }
    }


    if (categorySelect) {

        categorySelect.addEventListener(
            "change",
            filterBooks
        );
    }


    document
        .querySelectorAll(
            ".filter-btn, .book-filter-btn"
        )
        .forEach(
            function (button) {

                button.type = "button";

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        document
                            .querySelectorAll(
                                ".filter-btn, .book-filter-btn"
                            )
                            .forEach(
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
            }
        );


    /* =========================
       Borrow books
    ========================= */

    function markBorrowedBooks() {

        const member =
            getCurrentMember();

        if (!member) {
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
                                item.title ===
                                title
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


  
async function borrowBook(button) {
    const member = getCurrentMember();

    if (!member) {
        const goLogin = confirm(
            "You need to login before borrowing a book. Go to the login page?"
        );

        if (goLogin) {
            window.location.href = pageLink("login.html");
        }

        return;
    }

    const card = button.closest(".library-book-card");

    if (!card) return;

    const title = card.dataset.title || "Unknown Book";
    const author = card.dataset.author || "Unknown Author";
    const category = card.dataset.category || "General";
    const price = card.dataset.price || "Not listed";

    const borrowed = getBorrowedBooks(member.email);

    if (borrowed.some(item => item.title === title)) {
        alert("You have already borrowed this book.");
        return;
    }

    const confirmBorrow = confirm(
        'Borrow "' + title + '" for 14 days?'
    );

    if (!confirmBorrow) return;

    const supabase = window.supabaseClient;

    if (!supabase) {
        alert("The borrowing service is unavailable. Please refresh the page.");
        return;
    }

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "Processing...";

    try {
        const { data: book, error: bookError } = await supabase
            .from("books")
            .select("id, title, author")
            .eq("title", title)
            .eq("author", author)
            .maybeSingle();

        if (bookError) {
            throw bookError;
        }

        if (!book) {
            throw new Error(
                "This book could not be found in the database."
            );
        }

        const { data, error } = await supabase.rpc(
            "borrow_shelfsync_book",
            {
                p_book_id: book.id
            }
        );

        if (error) {
            throw error;
        }

        const borrowing = Array.isArray(data) ? data[0] : data;

        if (!borrowing || !borrowing.id) {
            throw new Error("The borrowing record was not returned.");
        }

        const borrowedAt = borrowing.borrowed_at;
        const dueAt = borrowing.due_at;

        borrowed.push({
            id: Date.now(),
            supabaseBorrowingId: borrowing.id,
            bookId: book.id,
            title: title,
            author: author,
            category: category,
            price: price,
            borrowedAt: borrowedAt,
            dueAt: dueAt
        });

        saveBorrowedBooks(member.email, borrowed);

        addActivity(member.email, {
            type: "borrow",
            title: title,
            date: borrowedAt
        });

        button.textContent = "Borrowed";

        const availability = card.querySelector(".availability");

        if (availability) {
            availability.textContent = "Borrowed";
            availability.classList.remove("available");
            availability.classList.add("borrowed");
        }

        alert(
            title + " has been borrowed successfully for 14 days."
        );
    } catch (error) {
        console.error("Book borrowing failed:", error);

        let message = error.message || "Please try again.";

        if (message.includes("already borrowed")) {
            message = "You have already borrowed this book.";
        } else if (message.includes("No copies")) {
            message = "No copies of this book are currently available.";
        } else if (message.includes("sign in")) {
            message = "Your session may have expired. Please sign in again.";
        }

        alert("Unable to borrow this book: " + message);
        button.textContent = originalText;
    } finally {
        if (button.textContent !== "Borrowed") {
            button.disabled = false;
        }
    }
}



    document
        .querySelectorAll(
            ".borrow-btn:not(.unavailable-btn)"
        )
        .forEach(
            function (button) {

                button.type = "button";

                button.addEventListener(
                    "click",
                    function () {
                        borrowBook(button);
                    }
                );
            }
        );


    markBorrowedBooks();


    /* =========================
       Book details modal
    ========================= */

    const bookDetailsModal =
        document.getElementById(
            "bookDetailsModal"
        );

    const bookModalOverlay =
        document.getElementById(
            "bookModalOverlay"
        );

    const closeBookModal =
        document.getElementById(
            "closeBookModal"
        );

    const modalCloseButton =
        document.getElementById(
            "modalCloseButton"
        );

    const modalBorrowButton =
        document.getElementById(
            "modalBorrowButton"
        );

    let selectedBookCard = null;


    function formatCategory(
        category
    ) {

        if (!category) {
            return "General";
        }

        return (
            category
                .charAt(0)
                .toUpperCase() +
            category.slice(1)
        );
    }


    function openBookDetails(
        card
    ) {

        if (
            !bookDetailsModal ||
            !card
        ) {
            return;
        }

        selectedBookCard =
            card;


        const values = {

            modalBookTitle:
                card.dataset.title ||
                "Book Title",

            modalBookAuthor:
                card.dataset.author ||
                "Unknown Author",

            modalBookCategory:
                formatCategory(
                    card.dataset.category
                ),

            modalBookDescription:
                card.dataset.description ||
                "No additional information is available for this book.",

            modalBookLanguage:
                card.dataset.language ||
                "English",

            modalBookPages:
                card.dataset.pages ||
                "-",

            modalBookYear:
                card.dataset.year ||
                "-",

            modalBookIsbn:
                card.dataset.isbn ||
                "-",

            modalBookPrice:
                card.dataset.price ||
                "Not listed"
        };


        Object.keys(values)
            .forEach(
                function (id) {

                    const element =
                        document.getElementById(
                            id
                        );

                    if (element) {
                        element.textContent =
                            values[id];
                    }
                }
            );


        const borrowButton =
            card.querySelector(
                ".borrow-btn"
            );

        const borrowed =
            Boolean(
                borrowButton &&
                borrowButton.disabled
            );


        const status =
            document.getElementById(
                "modalBookStatus"
            );

        if (status) {

            status.textContent =
                borrowed
                    ? "Borrowed"
                    : "Available";

            status.classList.toggle(
                "modal-borrowed",
                borrowed
            );

            status.classList.toggle(
                "modal-available",
                !borrowed
            );
        }


        if (modalBorrowButton) {

            modalBorrowButton.disabled =
                borrowed;

            modalBorrowButton.innerHTML =
                borrowed
                    ? '<i class="fa-solid fa-check"></i> Already Borrowed'
                    : '<i class="fa-solid fa-book-open-reader"></i> Borrow Book';
        }


        bookDetailsModal.classList.add(
            "show"
        );

        bookDetailsModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


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


    document
        .querySelectorAll(
            ".book-details-btn"
        )
        .forEach(
            function (button) {

                button.type = "button";

                button.addEventListener(
                    "click",
                    function () {

                        openBookDetails(
                            button.closest(
                                ".library-book-card"
                            )
                        );
                    }
                );
            }
        );


    if (closeBookModal) {

        closeBookModal.addEventListener(
            "click",
            closeBookDetails
        );
    }


    if (modalCloseButton) {

        modalCloseButton.addEventListener(
            "click",
            closeBookDetails
        );
    }


    if (bookModalOverlay) {

        bookModalOverlay.addEventListener(
            "click",
            closeBookDetails
        );
    }


    if (modalBorrowButton) {

        modalBorrowButton.addEventListener(
            "click",
            function () {

                if (!selectedBookCard) {
                    return;
                }

                const button =
                    selectedBookCard.querySelector(
                        ".borrow-btn"
                    );

                if (
                    !button ||
                    button.disabled
                ) {
                    return;
                }

                closeBookDetails();

                button.click();
            }
        );
    }


    /* =========================
       Gallery
    ========================= */

    const galleryButtons =
        document.querySelectorAll(
            ".gallery-filter-btn, .gallery-filter, [data-gallery-filter], [data-filter]"
        );

    const galleryItems =
        document.querySelectorAll(
            ".gallery-item, .gallery-card"
        );


    function getGalleryFilter(
        element
    ) {

        return String(
            element.dataset.gallery ||
            element.dataset.filter ||
            element.dataset.galleryFilter ||
            element.dataset.category ||
            "all"
        )
            .toLowerCase()
            .trim();
    }


    galleryButtons.forEach(
        function (button) {

            button.type = "button";

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const selected =
                        getGalleryFilter(
                            button
                        );


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

                            const category =
                                getGalleryFilter(
                                    item
                                );

                            item.style.display =
                                selected === "all" ||
                                category === selected
                                    ? ""
                                    : "none";
                        }
                    );
                }
            );
        }
    );


    /* =========================
       Gallery lightbox
    ========================= */

    const lightbox =
        document.getElementById(
            "galleryLightbox"
        );

    const lightboxImage =
        document.getElementById(
            "galleryLightboxImage"
        );

    const lightboxTitle =
        document.getElementById(
            "galleryLightboxTitle"
        );

    const lightboxClose =
        document.getElementById(
            "galleryLightboxClose"
        );

    const lightboxOverlay =
        document.getElementById(
            "galleryLightboxOverlay"
        );


    function closeLightbox() {

        if (!lightbox) {
            return;
        }

        lightbox.classList.remove(
            "show"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }


    function openLightbox(
        image,
        title
    ) {

        if (
            !lightbox ||
            !lightboxImage
        ) {
            return;
        }

        lightboxImage.src =
            image;

        lightboxImage.alt =
            title ||
            "ShelfSync Gallery";

        if (lightboxTitle) {
            lightboxTitle.textContent =
                title ||
                "ShelfSync Gallery";
        }

        lightbox.classList.add(
            "show"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    document
        .querySelectorAll(
            ".gallery-view-btn, .gallery-item img, .gallery-card img"
        )
        .forEach(
            function (element) {

                element.addEventListener(
                    "click",
                    function () {

                        const item =
                            element.closest(
                                ".gallery-item, .gallery-card"
                            );

                        const image =
                            element.tagName.toLowerCase() ===
                            "img"
                                ? element
                                : item &&
                                  item.querySelector(
                                      "img"
                                  );

                        if (!image) {
                            return;
                        }

                        let title =
                            item &&
                            (
                                item.dataset.title ||
                                (
                                    item.querySelector(
                                        ".gallery-item-title, .gallery-title"
                                    ) || {}
                                ).textContent
                            );

                        openLightbox(
                            image.src,
                            title
                                ? title.trim()
                                : "ShelfSync Gallery"
                        );
                    }
                );
            }
        );


    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );
    }


    if (lightboxOverlay) {

        lightboxOverlay.addEventListener(
            "click",
            closeLightbox
        );
    }


    /* =========================
       Authentication
    ========================= */

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    const forgotForm =
        document.getElementById(
            "forgotPasswordForm"
        );


    const loginFormElement =
        document.getElementById(
            "loginFormElement"
        );

    const registerFormElement =
        document.getElementById(
            "registerFormElement"
        );

    const forgotPasswordFormElement =
        document.getElementById(
            "forgotPasswordFormElement"
        );


    const loginTab =
        document.getElementById(
            "loginTab"
        );

    const registerTab =
        document.getElementById(
            "registerTab"
        );


    const forgotPasswordButton =
        document.getElementById(
            "forgotPasswordBtn"
        );

    const backToLoginButton =
        document.getElementById(
            "backToLoginBtn"
        );

    const switchToRegister =
        document.getElementById(
            "switchToRegister"
        );

    const switchToLogin =
        document.getElementById(
            "switchToLogin"
        );


    function showLoginForm() {

        if (loginForm) {

            loginForm.classList.remove(
                "hidden"
            );

            loginForm.style.display =
                "block";
        }

        if (registerForm) {

            registerForm.classList.add(
                "hidden"
            );

            registerForm.style.display =
                "none";
        }

        if (forgotForm) {

            forgotForm.classList.add(
                "hidden"
            );

            forgotForm.style.display =
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


    function showRegisterForm() {

        if (loginForm) {

            loginForm.classList.add(
                "hidden"
            );

            loginForm.style.display =
                "none";
        }

        if (registerForm) {

            registerForm.classList.remove(
                "hidden"
            );

            registerForm.style.display =
                "block";
        }

        if (forgotForm) {

            forgotForm.classList.add(
                "hidden"
            );

            forgotForm.style.display =
                "none";
        }

        if (loginTab) {
            loginTab.classList.remove(
                "active"
            );
        }

        if (registerTab) {
            registerTab.classList.add(
                "active"
            );
        }
    }


    function showForgotForm() {

        if (loginForm) {

            loginForm.classList.add(
                "hidden"
            );

            loginForm.style.display =
                "none";
        }

        if (registerForm) {

            registerForm.classList.add(
                "hidden"
            );

            registerForm.style.display =
                "none";
        }

        if (forgotForm) {

            forgotForm.classList.remove(
                "hidden"
            );

            forgotForm.style.display =
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


    if (switchToRegister) {

        switchToRegister.addEventListener(
            "click",
            showRegisterForm
        );
    }


    if (switchToLogin) {

        switchToLogin.addEventListener(
            "click",
            showLoginForm
        );
    }


    if (forgotPasswordButton) {

        forgotPasswordButton.addEventListener(
            "click",
            showForgotForm
        );
    }


    if (backToLoginButton) {

        backToLoginButton.addEventListener(
            "click",
            showLoginForm
        );
    }


    function setError(
        id,
        message
    ) {

        const element =
            document.getElementById(
                id
            );

        if (element) {
            element.textContent =
                message || "";
        }
    }


    function clearErrors() {

        document
            .querySelectorAll(
                ".form-error"
            )
            .forEach(
                function (item) {
                    item.textContent = "";
                }
            );
    }


    function validEmail(
        email
    ) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }


    function validPhone(
        phone
    ) {

        return /^[0-9+\-\s]{10,15}$/
            .test(phone);
    }


    function createMemberId() {

        const year =
            new Date()
                .getFullYear();

        const number =
            Math.floor(
                1000 +
                Math.random() * 9000
            );

        return (
            "SS-" +
            year +
            "-" +
            number
        );
    }


        if (loginFormElement) {
        loginFormElement.addEventListener("submit", async function (event) {
            event.preventDefault();
            clearErrors();

            const email = (
                document.getElementById("loginEmail") || {}
            ).value?.trim().toLowerCase() || "";

            const password = (
                document.getElementById("loginPassword") || {}
            ).value || "";

            let valid = true;

            if (!validEmail(email)) {
                setError(
                    "loginEmailError",
                    "Please enter a valid email address."
                );
                valid = false;
            }

            if (!password) {
                setError(
                    "loginPasswordError",
                    "Please enter your password."
                );
                valid = false;
            }

            if (!valid) return;

            const supabase = window.supabaseClient;

            if (!supabase) {
                setError(
                    "loginPasswordError",
                    "Authentication is unavailable. Please refresh and try again."
                );
                return;
            }

            const submitButton = loginFormElement.querySelector(
                'button[type="submit"]'
            );

            if (submitButton) submitButton.disabled = true;

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    setError(
                        "loginPasswordError",
                        "Incorrect email or password."
                    );
                    return;
                }

                const authUser = data.user;

                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("id, full_name, member_id, role")
                    .eq("id", authUser.id)
                    .single();

                if (profileError) {
                    console.error("Could not load member profile:", profileError);
                }

                const member = {
                    id: authUser.id,
                    name: profile?.full_name ||
                        authUser.user_metadata?.full_name ||
                        email.split("@")[0],
                    email: authUser.email || email,
                    phone: authUser.user_metadata?.phone || "",
                    memberId: profile?.member_id || "",
                    role: profile?.role || "member",
                    joinedDate: authUser.created_at || new Date().toISOString()
                };

                localStorage.setItem(
                    "shelfSyncSession",
                    JSON.stringify(member)
                );

                updateNavbar();

                alert("Welcome back, " + member.name + "!");

                window.location.href = pageLink("profile.html");
            } catch (error) {
                console.error("Supabase login failed:", error);
                setError(
                    "loginPasswordError",
                    "Unable to sign in right now. Please try again."
                );
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }


   
    if (registerFormElement) {
        registerFormElement.addEventListener("submit", async function (event) {
            event.preventDefault();
            clearErrors();

            const name = (
                document.getElementById("registerName") || {}
            ).value?.trim() || "";

            const email = (
                document.getElementById("registerEmail") || {}
            ).value?.trim().toLowerCase() || "";

            const phone = (
                document.getElementById("registerPhone") || {}
            ).value?.trim() || "";

            const password = (
                document.getElementById("registerPassword") || {}
            ).value || "";

            const confirmPassword = (
                document.getElementById("confirmPassword") || {}
            ).value || "";

            const terms = document.getElementById("acceptTerms");
            let valid = true;

            if (name.length < 3) {
                setError(
                    "registerNameError",
                    "Please enter your full name."
                );
                valid = false;
            }

            if (!validEmail(email)) {
                setError(
                    "registerEmailError",
                    "Please enter a valid email address."
                );
                valid = false;
            }

            if (!validPhone(phone)) {
                setError(
                    "registerPhoneError",
                    "Please enter a valid phone number."
                );
                valid = false;
            }

            if (password.length < 6) {
                setError(
                    "registerPasswordError",
                    "Password must contain at least 6 characters."
                );
                valid = false;
            }

            if (password !== confirmPassword) {
                setError(
                    "confirmPasswordError",
                    "Passwords do not match."
                );
                valid = false;
            }

            if (terms && !terms.checked) {
                alert("Please accept the ShelfSync project acknowledgement.");
                valid = false;
            }

            if (!valid) return;

            const supabase = window.supabaseClient;

            if (!supabase) {
                setError(
                    "registerEmailError",
                    "Authentication is unavailable. Please refresh and try again."
                );
                return;
            }

            const submitButton = registerFormElement.querySelector(
                'button[type="submit"]'
            );

            if (submitButton) submitButton.disabled = true;

            try {
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name,
                            phone: phone
                        }
                    }
                });

                if (error) {
                    const message = error.message || "";

                    if (
                        message.toLowerCase().includes("already registered") ||
                        message.toLowerCase().includes("already exists")
                    ) {
                        setError(
                            "registerEmailError",
                            "An account with this email may already exist. Try signing in."
                        );
                    } else {
                        setError(
                            "registerEmailError",
                            message || "Unable to create your account. Please try again."
                        );
                    }

                    return;
                }

                if (data.session && data.user) {
                    const authUser = data.user;

                    const { data: profile, error: profileError } =
                        await supabase
                            .from("profiles")
                            .select("id, full_name, member_id, role")
                            .eq("id", authUser.id)
                            .maybeSingle();

                    if (profileError) {
                        console.error(
                            "Could not load the new member profile:",
                            profileError
                        );
                    }

                    const member = {
                        id: authUser.id,
                        name: profile?.full_name || name,
                        email: authUser.email || email,
                        phone: authUser.user_metadata?.phone || phone,
                        memberId: profile?.member_id || "",
                        role: profile?.role || "member",
                        joinedDate: authUser.created_at ||
                            new Date().toISOString()
                    };

                    localStorage.setItem(
                        "shelfSyncSession",
                        JSON.stringify(member)
                    );

                    alert("Account created successfully!");
                    window.location.href = pageLink("profile.html");
                    return;
                }

                alert(
                    "Your account has been created. Please check your email to confirm your address, then sign in."
                );

                const loginEmail = document.getElementById("loginEmail");

                if (loginEmail) {
                    loginEmail.value = email;
                }

                const loginForm = document.getElementById("loginForm");
                const registerForm = document.getElementById("registerForm");

                if (registerForm) registerForm.style.display = "none";
                if (loginForm) loginForm.style.display = "block";
            } catch (error) {
                console.error("Supabase registration failed:", error);

                setError(
                    "registerEmailError",
                    "Unable to create your account right now. Please try again."
                );
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }


    
    if (forgotPasswordFormElement) {
        forgotPasswordFormElement.addEventListener("submit", async function (event) {
            event.preventDefault();
            clearErrors();

            const email = (
                document.getElementById("forgotEmail") || {}
            ).value?.trim().toLowerCase() || "";

            if (!validEmail(email)) {
                setError(
                    "forgotEmailError",
                    "Please enter a valid email address."
                );
                return;
            }

            const supabase = window.supabaseClient;

            if (!supabase) {
                setError(
                    "forgotEmailError",
                    "Authentication is unavailable. Please refresh and try again."
                );
                return;
            }

            const submitButton = forgotPasswordFormElement.querySelector(
                'button[type="submit"]'
            );

            if (submitButton) submitButton.disabled = true;

            try {
                const recoveryUrl = new URL(
                    "login.html",
                    window.location.href
                );

                recoveryUrl.searchParams.set("resetPassword", "true");

                const { error } = await supabase.auth.resetPasswordForEmail(
                    email,
                    {
                        redirectTo: recoveryUrl.toString()
                    }
                );

                if (error) {
                    console.error(
                        "Supabase password recovery failed:",
                        error
                    );

                    setError(
                        "forgotEmailError",
                        "Unable to send the recovery email. Please try again."
                    );
                    return;
                }

                alert(
                    "If an account exists for this email, Supabase will send password-recovery instructions. Please check your inbox and spam folder."
                );
            } catch (error) {
                console.error("Password recovery failed:", error);

                setError(
                    "forgotEmailError",
                    "Something went wrong. Please try again."
                );
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }


    
    // Handle password recovery through Supabase.
    const recoverySupabase = window.supabaseClient;
    const resetPasswordRequested =
        new URLSearchParams(window.location.search).get("resetPassword") === "true";

    let passwordRecoveryActive = false;

    function showPasswordResetFields() {
        if (!forgotForm) return;

        showForgotForm();

        const emailInput = document.getElementById("forgotEmail");
        const phoneInput = document.getElementById("forgotPhone");
        const newPasswordInput = document.getElementById("newPassword");
        const confirmInput = document.getElementById("forgotConfirmPassword");

        [emailInput, phoneInput].forEach(function (input) {
            if (!input) return;
            const group = input.closest(".form-group");
            if (group) group.style.display = "none";
        });

        [newPasswordInput, confirmInput].forEach(function (input) {
            if (!input) return;
            const group = input.closest(".form-group");
            if (group) group.style.display = "block";
        });

        const heading = forgotForm.querySelector(".auth-form-header");
        const title = heading?.querySelector("h1, h2, h3");

        if (title) title.textContent = "Set a New Password";

        const description = heading?.querySelector("p:not(.small-heading)");
        if (description) {
            description.textContent = "Choose a new password for your ShelfSync account.";
        }

        const submitButton = forgotPasswordFormElement?.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.innerHTML =
                'Update Password <i class="fa-solid fa-key"></i>';
        }
    }

    if (recoverySupabase) {
        recoverySupabase.auth.onAuthStateChange(function (event, session) {
            if (event === "PASSWORD_RECOVERY" && session) {
                passwordRecoveryActive = true;
                showPasswordResetFields();
            }
        });
    }

    if (resetPasswordRequested && forgotForm) {
        showForgotForm();
    }

    if (forgotPasswordFormElement) {
        forgotPasswordFormElement.addEventListener(
            "submit",
            async function (event) {
                if (!passwordRecoveryActive) return;

                event.preventDefault();
                event.stopImmediatePropagation();
                clearErrors();

                const password =
                    document.getElementById("newPassword")?.value || "";
                const confirmPassword =
                    document.getElementById("forgotConfirmPassword")?.value || "";

                let valid = true;

                if (password.length < 6) {
                    setError(
                        "newPasswordError",
                        "Password must contain at least 6 characters."
                    );
                    valid = false;
                }

                if (password !== confirmPassword) {
                    setError(
                        "forgotConfirmError",
                        "Passwords do not match."
                    );
                    valid = false;
                }

                if (!valid) return;

                const submitButton = forgotPasswordFormElement.querySelector(
                    'button[type="submit"]'
                );

                if (submitButton) submitButton.disabled = true;

                try {
                    const { error } = await recoverySupabase.auth.updateUser({
                        password: password
                    });

                    if (error) {
                        console.error("Password update failed:", error);
                        setError(
                            "newPasswordError",
                            "Could not update your password. Please request a new recovery email."
                        );
                        return;
                    }

                    passwordRecoveryActive = false;

                    alert("Your password has been updated. You can now sign in.");

                    await recoverySupabase.auth.signOut();

                    window.history.replaceState(
                        {},
                        document.title,
                        window.location.pathname
                    );

                    showLoginForm();
                } catch (error) {
                    console.error("Password update failed:", error);
                    setError(
                        "newPasswordError",
                        "Something went wrong. Please try again."
                    );
                } finally {
                    if (submitButton) submitButton.disabled = false;
                }
            },
            true
        );
    }

    /* =========================
       Password visibility
    ========================= */

    document
        .querySelectorAll(
            ".password-toggle, .toggle-password"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const targetId =
                            button.dataset.target ||
                            button.getAttribute(
                                "data-target"
                            );

                        const input =
                            document.getElementById(
                                targetId
                            );

                        if (!input) {
                            return;
                        }


                        const show =
                            input.type ===
                            "password";


                        input.type =
                            show
                                ? "text"
                                : "password";


                        const icon =
                            button.querySelector(
                                "i"
                            );

                        if (icon) {

                            icon.classList.toggle(
                                "fa-eye",
                                !show
                            );

                            icon.classList.toggle(
                                "fa-eye-slash",
                                show
                            );
                        }


                        button.setAttribute(
                            "aria-label",
                            show
                                ? "Hide password"
                                : "Show password"
                        );
                    }
                );
            }
        );


    /* =========================
       Profile
    ========================= */

    const profilePage =
        document.querySelector(
            ".profile-page"
        ) ||
        document.getElementById(
            "profilePage"
        );


    if (
        profilePage ||
        document.getElementById(
            "profileName"
        )
    ) {

        const member =
            getCurrentMember();


        if (!member) {

            window.location.href =
                pageLink("login.html");

            return;
        }


        function setProfileText(
            ids,
            value
        ) {

            ids.forEach(
                function (id) {

                    const element =
                        document.getElementById(
                            id
                        );

                    if (element) {
                        element.textContent =
                            value;
                    }
                }
            );
        }


        const firstName =
            (
                member.name ||
                "Member"
            ).split(" ")[0];


        setProfileText(
            [
                "profileName",
                "profileFirstName"
            ],
            member.name ||
            "Member"
        );


        setProfileText(
            [
                "profileWelcomeName"
            ],
            firstName
        );


        setProfileText(
            [
                "profileEmail"
            ],
            member.email ||
            "-"
        );


        setProfileText(
            [
                "profilePhone"
            ],
            member.phone ||
            "-"
        );


        setProfileText(
            [
                "profileMemberId",
                "memberId"
            ],
            member.memberId ||
            member.id ||
            "-"
        );


        let joined =
            "-";


        if (member.joinedDate) {

            const date =
                new Date(
                    member.joinedDate
                );

            if (!Number.isNaN(date.getTime())) {

                joined =
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            day:
                                "2-digit",
                            month:
                                "short",
                            year:
                                "numeric"
                        }
                    );
            }
        }


        setProfileText(
            [
                "profileJoinedDate",
                "joinedDate"
            ],
            joined
        );


        // Refresh member details from Supabase.
        (async function loadSupabaseProfile() {
            const supabase = window.supabaseClient;

            if (!supabase) return;

            try {
                const { data: userData, error: userError } =
                    await supabase.auth.getUser();

                if (userError || !userData.user) return;

                const user = userData.user;

                const { data: profile, error: profileError } =
                    await supabase
                        .from("profiles")
                        .select("full_name, member_id, role, created_at")
                        .eq("id", user.id)
                        .maybeSingle();

                if (profileError) {
                    console.error("Could not load Supabase profile:", profileError);
                    return;
                }

                const savedMember = getCurrentMember() || {};

                const updatedMember = {
                    ...savedMember,
                    id: user.id,
                    name:
                        profile?.full_name ||
                        user.user_metadata?.full_name ||
                        savedMember.name ||
                        "Member",
                    email: user.email || savedMember.email || "",
                    phone:
                        user.user_metadata?.phone ||
                        savedMember.phone ||
                        "",
                    memberId:
                        profile?.member_id ||
                        savedMember.memberId ||
                        "",
                    role: profile?.role || "member",
                    joinedDate:
                        profile?.created_at ||
                        user.created_at ||
                        savedMember.joinedDate
                };

                localStorage.setItem(
                    "shelfSyncSession",
                    JSON.stringify(updatedMember)
                );

                setProfileText(
                    ["profileName", "profileFirstName"],
                    updatedMember.name
                );

                setProfileText(
                    ["profileWelcomeName"],
                    updatedMember.name.split(" ")[0]
                );

                setProfileText(
                    ["profileEmail"],
                    updatedMember.email || "-"
                );

                setProfileText(
                    ["profilePhone"],
                    updatedMember.phone || "-"
                );

                setProfileText(
                    ["profileMemberId", "memberId"],
                    updatedMember.memberId || "-"
                );

                let joined = "-";

                if (updatedMember.joinedDate) {
                    const date = new Date(updatedMember.joinedDate);

                    if (!Number.isNaN(date.getTime())) {
                        joined = date.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        });
                    }
                }

                setProfileText(
                    ["profileJoinedDate", "joinedDate"],
                    joined
                );
            } catch (error) {
                console.error("Supabase profile loading failed:", error);
            }
        })();

        const borrowed =
            getBorrowedBooks(
                member.email
            );


        const activities =
            getActivities(
                member.email
            );


        const borrowedCount =
            document.getElementById(
                "borrowedCount"
            );

        const activityCount =
            document.getElementById(
                "activityCount"
            );

        const totalReadCount =
            document.getElementById(
                "totalReadCount"
            );


        if (borrowedCount) {
            borrowedCount.textContent =
                borrowed.length;
        }


        if (activityCount) {
            activityCount.textContent =
                activities.length;
        }


        if (totalReadCount) {

            totalReadCount.textContent =
                getReturnedBooks(
                    member.email
                ).length;
        }


        function renderBorrowedBooks() {

            const list =
                document.querySelector(
                    ".borrowed-list"
                ) ||
                document.getElementById(
                    "borrowedBooksList"
                );


            if (!list) {
                return;
            }


            list.innerHTML = "";


            if (!borrowed.length) {

                list.innerHTML =
                    '<div class="empty-state">No books are currently borrowed.</div>';

                return;
            }


            borrowed.forEach(
                function (book) {

                    const wrapper =
                        document.createElement(
                            "div"
                        );

                    wrapper.className =
                        "borrowed-book-item";


                    const due =
                        new Date(
                            book.dueAt
                        );


                    const now =
                        new Date();


                    const remaining =
                        Math.max(
                            0,
                            Math.ceil(
                                (
                                    due -
                                    now
                                ) /
                                86400000
                            )
                        );


                    wrapper.innerHTML =

                        '<div class="borrowed-book-info">' +

                        "<h3>" +
                        escapeHTML(
                            book.title
                        ) +
                        "</h3>" +

                        "<p>" +
                        escapeHTML(
                            book.author ||
                            "Unknown Author"
                        ) +
                        "</p>" +

                        '<span class="borrowed-time">' +
                        (
                            remaining > 0
                                ? remaining +
                                  " days remaining"
                                : "Return date reached"
                        ) +
                        "</span>" +

                        "</div>" +

                        '<button type="button" class="secondary-btn return-book-btn" data-id="' +
                        book.id +
                        '">' +
                        "Return Book" +
                        "</button>";


                    list.appendChild(
                        wrapper
                    );
                }
            );


            list
                .querySelectorAll(
                    ".return-book-btn"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                returnBook(
                                    Number(
                                        button.dataset.id
                                    )
                                );
                            }
                        );
                    }
                );
        }


        
async function returnBook(bookId) {
    const current = getBorrowedBooks(member.email);

    const index = current.findIndex(function (book) {
        return Number(book.id) === Number(bookId);
    });

    if (index === -1) {
        return;
    }

    const book = current[index];
    const supabase = window.supabaseClient;

    if (!supabase) {
        alert("The return service is unavailable. Please refresh the page.");
        return;
    }

    if (!book.supabaseBorrowingId) {
        alert(
            "This borrowing record is not linked to Supabase. " +
            "Please refresh your profile and try again."
        );
        return;
    }

    const confirmReturn = confirm(
        'Are you sure you want to return "' + book.title + '"?'
    );

    if (!confirmReturn) {
        return;
    }

    try {
        const { data, error } = await supabase.rpc(
            "return_shelfsync_book",
            {
                p_borrowing_id: book.supabaseBorrowingId
            }
        );

        if (error) {
            throw error;
        }

        const borrowing = Array.isArray(data) ? data[0] : data;

        if (!borrowing || !borrowing.returned_at) {
            throw new Error("The return was not confirmed by the database.");
        }

        current.splice(index, 1);

        saveBorrowedBooks(member.email, current);

        const returned = getReturnedBooks(member.email);

        returned.unshift({
            ...book,
            returnedAt: borrowing.returned_at
        });

        saveReturnedBooks(member.email, returned);

        addActivity(member.email, {
            type: "return",
            title: book.title,
            date: borrowing.returned_at
        });

        alert(book.title + " has been returned successfully.");

        window.location.reload();
    } catch (error) {
        console.error("Book return failed:", error);

        let message = error.message || "Please try again.";

        if (message.includes("already been returned")) {
            message = "This book has already been returned.";
        } else if (message.includes("sign in")) {
            message = "Your session may have expired. Please sign in again.";
        }

        alert("Unable to return this book: " + message);
    }
}



        renderBorrowedBooks();


        function renderActivities() {

            const list =
                document.querySelector(
                    ".activity-list"
                ) ||
                document.getElementById(
                    "activityList"
                );


            if (!list) {
                return;
            }


            list.innerHTML = "";


            if (!activities.length) {

                list.innerHTML =
                    '<div class="empty-state">No recent activity.</div>';

                return;
            }


            activities.forEach(
                function (activity) {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "activity-item";


                    let date =
                        "";

                    if (activity.date) {

                        const d =
                            new Date(
                                activity.date
                            );

                        if (
                            !Number.isNaN(
                                d.getTime()
                            )
                        ) {

                            date =
                                d.toLocaleDateString(
                                    "en-IN",
                                    {
                                        day:
                                            "2-digit",
                                        month:
                                            "short",
                                        year:
                                            "numeric"
                                    }
                                );
                        }
                    }


                    item.innerHTML =

                        "<div>" +

                        "<strong>" +
                        escapeHTML(
                            activity.title ||
                            "Activity"
                        ) +
                        "</strong>" +

                        "<span>" +
                        escapeHTML(
                            activity.type ||
                            "activity"
                        ) +
                        "</span>" +

                        "</div>" +

                        "<small>" +
                        date +
                        "</small>";


                    list.appendChild(
                        item
                    );
                }
            );
        }


        renderActivities();

        // Load borrowing history and activity from Supabase.
        (async function loadSupabaseHistory() {
            const supabase = window.supabaseClient;

            if (!supabase) return;

            try {
                const { data: userData, error: userError } =
                    await supabase.auth.getUser();

                if (userError) throw userError;

                const user = userData.user;

                if (!user) return;

                const { data: records, error: recordsError } =
                    await supabase
                        .from("borrowings")
                        .select(
                            "id, book_id, borrowed_at, due_at, returned_at, books(title, author, category, price)"
                        )
                        .eq("user_id", user.id)
                        .order("borrowed_at", { ascending: false });

                if (recordsError) throw recordsError;

                const activeRecords = [];
                const returnedRecords = [];

                (records || []).forEach(function (record, index) {
                    const bookData = Array.isArray(record.books)
                        ? record.books[0]
                        : record.books;

                    const book = {
                        id: index + 1,
                        supabaseBorrowingId: record.id,
                        bookId: record.book_id,
                        title: bookData?.title || "Unknown Book",
                        author: bookData?.author || "Unknown Author",
                        category: bookData?.category || "General",
                        price: bookData?.price ?? "Not listed",
                        borrowedAt: record.borrowed_at,
                        dueAt: record.due_at
                    };

                    if (record.returned_at) {
                        returnedRecords.push({
                            ...book,
                            returnedAt: record.returned_at
                        });
                    } else {
                        activeRecords.push(book);
                    }
                });

                borrowed.splice(0, borrowed.length, ...activeRecords);

                saveBorrowedBooks(member.email, borrowed);
                saveReturnedBooks(member.email, returnedRecords);

                const { data: logs, error: logsError } =
                    await supabase
                        .from("activity_logs")
                        .select("event_type, details, created_at")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false });

                if (logsError) throw logsError;

                activities.splice(
                    0,
                    activities.length,
                    ...(logs || []).map(function (log) {
                        return {
                            type: log.event_type,
                            title: log.details?.title || "Library activity",
                            date: log.created_at
                        };
                    })
                );

                if (borrowedCount) {
                    borrowedCount.textContent = borrowed.length;
                }

                if (activityCount) {
                    activityCount.textContent = activities.length;
                }

                if (totalReadCount) {
                    totalReadCount.textContent = returnedRecords.length;
                }

                renderBorrowedBooks();
                renderActivities();

            } catch (error) {
                console.error(
                    "Could not load Supabase borrowing history:",
                    error
                );
            }
        })();


        /* Profile photo */

        const photoInput =
            document.getElementById(
                "profilePhotoInput"
            );

        const avatarImage =
            document.getElementById(
                "profileAvatarImage"
            );

        const avatarLetter =
            document.getElementById(
                "profileAvatarLetter"
            );

        const changePhotoButton =
            document.getElementById(
                "changeProfilePhotoBtn"
            );

        const removePhotoButton =
            document.getElementById(
                "removeProfilePhotoBtn"
            );


        const photoKey =
            "shelfSyncProfilePhoto_" +
            member.email.toLowerCase();


        function loadProfilePhoto() {

            const saved =
                localStorage.getItem(
                    photoKey
                );

            if (
                saved &&
                avatarImage
            ) {

                avatarImage.src =
                    saved;

                avatarImage.style.display =
                    "block";

                if (avatarLetter) {
                    avatarLetter.style.display =
                        "none";
                }

            } else {

                if (avatarImage) {
                    avatarImage.style.display =
                        "none";
                }

                if (avatarLetter) {

                    avatarLetter.style.display =
                        "flex";

                    avatarLetter.textContent =
                        (
                            member.name ||
                            "M"
                        )
                            .charAt(0)
                            .toUpperCase();
                }
            }
        }


        if (changePhotoButton) {

            changePhotoButton.addEventListener(
                "click",
                function () {

                    if (photoInput) {
                        photoInput.click();
                    }
                }
            );
        }


        if (photoInput) {

            photoInput.addEventListener(
                "change",
                function () {

                    const file =
                        photoInput.files &&
                        photoInput.files[0];

                    if (!file) {
                        return;
                    }


                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        alert(
                            "Please select an image file."
                        );

                        return;
                    }


                    if (
                        file.size >
                        5 * 1024 * 1024
                    ) {

                        alert(
                            "Image size must be below 5 MB."
                        );

                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            const image =
                                new Image();


                            image.onload =
                                function () {

                                    const canvas =
                                        document.createElement(
                                            "canvas"
                                        );


                                    const max =
                                        400;


                                    let width =
                                        image.width;

                                    let height =
                                        image.height;


                                    if (
                                        width >
                                        height
                                    ) {

                                        if (
                                            width >
                                            max
                                        ) {

                                            height =
                                                height *
                                                max /
                                                width;

                                            width =
                                                max;
                                        }

                                    } else {

                                        if (
                                            height >
                                            max
                                        ) {

                                            width =
                                                width *
                                                max /
                                                height;

                                            height =
                                                max;
                                        }
                                    }


                                    canvas.width =
                                        width;

                                    canvas.height =
                                        height;


                                    const context =
                                        canvas.getContext(
                                            "2d"
                                        );


                                    context.drawImage(
                                        image,
                                        0,
                                        0,
                                        width,
                                        height
                                    );


                                    const compressed =
                                        canvas.toDataURL(
                                            "image/jpeg",
                                            0.82
                                        );


                                    localStorage.setItem(
                                        photoKey,
                                        compressed
                                    );


                                    loadProfilePhoto();
                                };


                            image.src =
                                event.target.result;
                        };


                    reader.readAsDataURL(
                        file
                    );
                }
            );
        }


        if (removePhotoButton) {

            removePhotoButton.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        photoKey
                    );

                    loadProfilePhoto();
                }
            );
        }


        loadProfilePhoto();
    }


    /* =========================
       Contact form
    ========================= */

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
                    (
                        document.getElementById(
                            "contactName"
                        ) || {}
                    ).value?.trim() || "";


                const email =
                    (
                        document.getElementById(
                            "contactEmail"
                        ) || {}
                    ).value
                        ?.trim() || "";


                const message =
                    (
                        document.getElementById(
                            "contactMessage"
                        ) || {}
                    ).value?.trim() || "";


                if (!name) {

                    alert(
                        "Please enter your name."
                    );

                    return;
                }


                if (!validEmail(email)) {

                    alert(
                        "Please enter a valid email address."
                    );

                    return;
                }


                if (!message) {

                    alert(
                        "Please enter your message."
                    );

                    return;
                }


                alert(
                    "Thank you for contacting ShelfSync. Your message has been recorded for this project demonstration."
                );


                contactForm.reset();
            }
        );
    }


    /* =========================
       Admin dashboard
    ========================= */

    const adminPage =
        document.querySelector(
            ".admin-page"
        );


    if (adminPage) {

        const adminNavLinks =
            document.querySelectorAll(
                ".admin-nav-link[data-admin-section]"
            );


        const adminSections =
            document.querySelectorAll(
                ".admin-section"
            );


        function showAdminSection(
            sectionName
        ) {

            adminSections.forEach(
                function (section) {

                    const id =
                        section.id ||
                        section.dataset.section;

                    const active =
                        id ===
                        sectionName;

                    section.classList.toggle(
                        "active",
                        active
                    );

                    section.style.display =
                        active
                            ? ""
                            : "none";
                }
            );


            adminNavLinks.forEach(
                function (link) {

                    link.classList.toggle(
                        "active",
                        link.dataset.adminSection ===
                        sectionName
                    );
                }
            );
        }


        adminNavLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        showAdminSection(
                            link.dataset.adminSection
                        );
                    }
                );
            }
        );


        const adminMenuButton =
            document.getElementById(
                "adminMenuToggle"
            ) ||
            document.getElementById(
                "adminMenuBtn"
            );


        const adminSidebar =
            document.querySelector(
                ".admin-sidebar"
            );


        if (
            adminMenuButton &&
            adminSidebar
        ) {

            adminMenuButton.addEventListener(
                "click",
                function () {

                    adminSidebar.classList.toggle(
                        "open"
                    );
                }
            );
        }


        const adminMember =
            getCurrentMember();


        const adminUserName =
            document.getElementById(
                "adminUserName"
            );

        const adminUserEmail =
            document.getElementById(
                "adminUserEmail"
            );

        const adminAvatar =
            document.getElementById(
                "adminSidebarAvatar"
            );


        if (adminMember) {

            if (adminUserName) {

                adminUserName.textContent =
                    adminMember.name ||
                    "ShelfSync Admin";
            }


            if (adminUserEmail) {

                adminUserEmail.textContent =
                    adminMember.email ||
                    "Administrator";
            }


            if (adminAvatar) {

                adminAvatar.textContent =
                    (
                        adminMember.name ||
                        "A"
                    )
                        .charAt(0)
                        .toUpperCase();
            }
        }


        const allUsers =
            getUsers();


        const allBorrowings =
            allUsers.reduce(
                function (result, user) {

                    return result.concat(
                        getBorrowedBooks(
                            user.email
                        ).map(
                            function (book) {

                                return {
                                    ...book,
                                    memberName:
                                        user.name,
                                    memberEmail:
                                        user.email
                                };
                            }
                        )
                    );
                },
                []
            );


        function setAdminNumber(
            ids,
            value
        ) {

            ids.forEach(
                function (id) {

                    const element =
                        document.getElementById(
                            id
                        );

                    if (element) {
                        element.textContent =
                            value;
                    }
                }
            );
        }


        setAdminNumber(
            [
                "totalMembers",
                "adminTotalMembers",
                "memberCount"
            ],
            allUsers.length
        );


        setAdminNumber(
            [
                "totalBorrowed",
                "adminTotalBorrowed",
                "borrowedCount"
            ],
            allBorrowings.length
        );


        const bookCards =
            document.querySelectorAll(
                ".library-book-card"
            );


        setAdminNumber(
            [
                "totalBooks",
                "adminTotalBooks",
                "bookCount"
            ],
            bookCards.length
        );


        setAdminNumber(
            [
                "totalReturned",
                "adminTotalReturned"
            ],
            allUsers.reduce(
                function (total, user) {

                    return (
                        total +
                        getReturnedBooks(
                            user.email
                        ).length
                    );
                },
                0
            )
        );


        /* Admin member table */

        const memberTable =
            document.getElementById(
                "membersTableBody"
            ) ||
            document.querySelector(
                "#membersTable tbody"
            );


        if (memberTable) {

            memberTable.innerHTML = "";


            allUsers.forEach(
                function (user) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML =

                        "<td>" +
                        escapeHTML(
                            user.memberId ||
                            user.id ||
                            "-"
                        ) +
                        "</td>" +

                        "<td>" +
                        escapeHTML(
                            user.name ||
                            "-"
                        ) +
                        "</td>" +

                        "<td>" +
                        escapeHTML(
                            user.email ||
                            "-"
                        ) +
                        "</td>" +

                        "<td>" +
                        escapeHTML(
                            user.phone ||
                            "-"
                        ) +
                        "</td>";


                    memberTable.appendChild(
                        row
                    );
                }
            );
        }


        /* Admin borrowing table */

        const borrowingTable =
            document.getElementById(
                "borrowingsTableBody"
            ) ||
            document.querySelector(
                "#borrowingsTable tbody"
            );


        if (borrowingTable) {

            borrowingTable.innerHTML = "";


            allBorrowings.forEach(
                function (book) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    const due =
                        book.dueAt
                            ? new Date(
                                book.dueAt
                            ).toLocaleDateString(
                                "en-IN"
                            )
                            : "-";


                    row.innerHTML =

                        "<td>" +
                        escapeHTML(
                            book.title ||
                            "-"
                        ) +
                        "</td>" +

                        "<td>" +
                        escapeHTML(
                            book.memberName ||
                            "-"
                        ) +
                        "</td>" +

                        "<td>" +
                        escapeHTML(
                            book.memberEmail ||
                            "-"
                        ) +
                        "</td>" +

                        "<td>" +
                        due +
                        "</td>";


                    borrowingTable.appendChild(
                        row
                    );
                }
            );
        }


        /* Admin search */

        const adminBookSearch =
            document.getElementById(
                "adminBookSearch"
            );

        if (adminBookSearch) {

            adminBookSearch.addEventListener(
                "input",
                function () {

                    const value =
                        adminBookSearch.value
                            .toLowerCase()
                            .trim();


                    document
                        .querySelectorAll(
                            ".admin-book-row, .admin-book-card, #booksTable tbody tr"
                        )
                        .forEach(
                            function (item) {

                                item.style.display =
                                    item.textContent
                                        .toLowerCase()
                                        .includes(
                                            value
                                        )
                                        ? ""
                                        : "none";
                            }
                        );
                }
            );
        }


        const adminMemberSearch =
            document.getElementById(
                "adminMemberSearch"
            );


        if (adminMemberSearch) {

            adminMemberSearch.addEventListener(
                "input",
                function () {

                    const value =
                        adminMemberSearch.value
                            .toLowerCase()
                            .trim();


                    document
                        .querySelectorAll(
                            "#membersTable tbody tr, .member-row"
                        )
                        .forEach(
                            function (item) {

                                item.style.display =
                                    item.textContent
                                        .toLowerCase()
                                        .includes(
                                            value
                                        )
                                        ? ""
                                        : "none";
                            }
                        );
                }
            );
        }


        /* Admin tabs */

        document
            .querySelectorAll(
                ".admin-tab"
            )
            .forEach(
                function (tab) {

                    tab.addEventListener(
                        "click",
                        function () {

                            const target =
                                tab.dataset.tab;

                            document
                                .querySelectorAll(
                                    ".admin-tab"
                                )
                                .forEach(
                                    function (item) {
                                        item.classList.remove(
                                            "active"
                                        );
                                    }
                                );

                            tab.classList.add(
                                "active"
                            );


                            document
                                .querySelectorAll(
                                    ".admin-tab-content"
                                )
                                .forEach(
                                    function (content) {

                                        content.style.display =
                                            content.dataset.tabContent ===
                                            target
                                                ? ""
                                                : "none";
                                    }
                                );
                        }
                    );
                }
            );
    }

    
/* Load Admin Dashboard data from Supabase */

(async function loadSupabaseAdminDashboard() {
    const supabase = window.supabaseClient;

    
const memberTable =
    document.getElementById("adminMembersBody") ||
    document.getElementById("membersTableBody") ||
    document.querySelector("#membersTable tbody");


    
const borrowingTable =
    document.getElementById("adminBorrowingsBody") ||
    document.getElementById("borrowingsTableBody") ||
    document.querySelector("#borrowingsTable tbody");


    if (
        !supabase ||
        (!memberTable && !borrowingTable &&
        
!document.getElementById("adminTotalMembers")
)
    ) {
        return;
    }

    try {
        const { data: authData, error: authError } =
            await supabase.auth.getUser();

        if (authError || !authData.user) {
            window.location.href = pageLink("login.html");
            return;
        }

        const { data: adminProfile, error: roleError } =
            await supabase
                .from("profiles")
                .select("role, full_name, email, phone, member_id")
                .eq("id", authData.user.id)
                .single();

        if (roleError || !adminProfile ||
            adminProfile.role !== "admin") {
            alert("You do not have permission to access the Admin Dashboard.");
            window.location.href = pageLink("index.html");
            return;
        }

             const [
            { data: profiles, error: profilesError },
            { data: books, error: booksError },
            { data: borrowings, error: borrowingsError },
            { data: activityLogs, error: activityLogsError }
        ] = await Promise.all([
            supabase
                .from("profiles")
                .select("id, full_name, member_id, email, phone, created_at"),

            supabase
                .from("books")
                .select("id, title, author, category, description, price, cover_url, total_copies, created_at"),

            supabase
                .from("borrowings")
                .select("id, user_id, borrowed_at, due_at, returned_at, book:books(title)"),

            supabase
                .from("activity_logs")
                .select("id, user_id, event_type, details, created_at")
                .order("created_at", { ascending: false })
                .limit(50)
        ]);

        if (profilesError) throw profilesError;
        if (booksError) throw booksError;
        if (borrowingsError) throw borrowingsError;
        if (activityLogsError) throw activityLogsError;

        const members = profiles || [];
        const allBooks = books || [];
        const allRecords = borrowings || [];

        const activeBorrowings = allRecords.filter(
            function (item) {
                return !item.returned_at;
            }
        );

        const returnedBorrowings = allRecords.filter(
            function (item) {
                return Boolean(item.returned_at);
            }
        );

        function setAdminNumber(ids, value) {
            ids.forEach(function (id) {
                const element = document.getElementById(id);

                if (element) {
                    element.textContent = value;
                }
            });
        }
function safeText(value) {
    if (typeof escapeHTML === "function") {
        return escapeHTML(String(value ?? "-"));
    }

    return String(value ?? "-").replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

const recentBorrowingsBody = document.getElementById("recentBorrowingsBody");

if (recentBorrowingsBody) {
    const membersById = new Map(
        members.map(function (member) {
            return [member.id, member];
        })
    );

    const recentRecords = [...allRecords]
        .sort(function (a, b) {
            return new Date(b.borrowed_at || 0) -
                new Date(a.borrowed_at || 0);
        })
        .slice(0, 5);

    if (recentRecords.length === 0) {
        recentBorrowingsBody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="admin-empty-table">
                        <i class="fa-solid fa-book-open"></i>
                        <p>No borrowing activity yet.</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        recentBorrowingsBody.innerHTML = recentRecords.map(function (record) {
            const member = membersById.get(record.user_id);
            const bookTitle = record.book?.title || "Unknown book";

            const borrowedDate = record.borrowed_at
                ? new Date(record.borrowed_at).toLocaleDateString("en-IN")
                : "-";

            const status = record.returned_at ? "Returned" : "Borrowed";

            return `
                <tr>
                    <td>${safeText(member?.full_name || "Library member")}</td>
                    <td>${safeText(bookTitle)}</td>
                    <td>${safeText(borrowedDate)}</td>
                    <td>${safeText(status)}</td>
                </tr>
            `;
        }).join("");
    }
}



        setAdminNumber(
            ["totalMembers", "adminTotalMembers", "memberCount"],
            members.length
        );

        setAdminNumber(
            ["totalBorrowed", "adminTotalBorrowed", "borrowedCount"],
            activeBorrowings.length
        );

        setAdminNumber(
            ["totalBooks", "adminTotalBooks", "bookCount"],
            allBooks.length
        );

        setAdminNumber(
            ["totalReturned", "adminTotalReturned"],
            returnedBorrowings.length
        );
        setAdminNumber(
    ["adminActiveBorrowings"],
    activeBorrowings.length
);

setAdminNumber(
    ["adminReturnedBooks"],
    returnedBorrowings.length
);
        const adminBooksGrid = document.getElementById("adminBooksGrid");

if (adminBooksGrid) {
    if (allBooks.length === 0) {
        adminBooksGrid.innerHTML = "<p>No books found.</p>";
    } else {
        adminBooksGrid.innerHTML = allBooks.map(function (book) {
            return `
                <div class="admin-book-card">
                    <div class="admin-book-icon">
                        <i class="fa-solid fa-book"></i>
                    </div>

                    <h3>${safeText(book.title)}</h3>

                    <p class="admin-book-author">
                        By ${safeText(book.author)}
                    </p>

                    <div class="admin-book-meta">
                        <span>${safeText(book.category)}</span>
                        <span>₹${safeText(book.price)}</span>
                    </div>

                    <p>
                        ${safeText(book.description)}
                    </p>

                    <p>
                        Total copies: ${safeText(book.total_copies)}
                    </p>
                </div>
            `;
        }).join("");
    }
}

        const nameElement = document.getElementById("adminUserName");
        const emailElement = document.getElementById("adminUserEmail");
        const avatarElement = document.getElementById("adminAvatar");

        if (nameElement) {
            nameElement.textContent =
                adminProfile.full_name || "ShelfSync Admin";
        }

        if (emailElement) {
            emailElement.textContent =
                adminProfile.email || authData.user.email || "Administrator";
        }

        if (avatarElement) {
            avatarElement.textContent =
                (adminProfile.full_name || "A").charAt(0).toUpperCase();
        }

        
if (memberTable) {
    memberTable.innerHTML = "";

    members.forEach(function (member) {
        const row = document.createElement("tr");

        const joinedDate = member.created_at
            ? new Date(member.created_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            : "-";

        row.innerHTML =
            "<td>" + safeText(member.full_name) + "</td>" +
            "<td>" + safeText(member.member_id) + "</td>" +
            "<td>" + safeText(member.email) + "</td>" +
            "<td>" + safeText(member.phone) + "</td>" +
            "<td>" + safeText(joinedDate) + "</td>";

        memberTable.appendChild(row);
    });
}


                if (borrowingTable) {
            borrowingTable.innerHTML = "";

            const membersById = new Map(
                members.map(function (member) {
                    return [member.id, member];
                })
            );

            if (activeBorrowings.length === 0) {
                borrowingTable.innerHTML = `
                    <tr>
                        <td colspan="5">
                            <div class="admin-empty-table">
                                <i class="fa-solid fa-book-open-reader"></i>
                                <p>No active borrowings.</p>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                activeBorrowings.forEach(function (item) {
                    const member = membersById.get(item.user_id);
                    const row = document.createElement("tr");

                    const borrowedDate = item.borrowed_at
                        ? new Date(item.borrowed_at).toLocaleDateString("en-IN")
                        : "-";

                    const dueDate = item.due_at
                        ? new Date(item.due_at).toLocaleDateString("en-IN")
                        : "-";

                    const bookTitle = Array.isArray(item.book)
                        ? item.book[0]?.title
                        : item.book?.title;

                    row.innerHTML =
                        "<td>" + safeText(bookTitle) + "</td>" +
                        "<td>" + safeText(member?.full_name) + "</td>" +
                        "<td>" + safeText(borrowedDate) + "</td>" +
                        "<td>" + safeText(dueDate) + "</td>" +
                        '<td><span class="status-badge active">Active</span></td>';

                    borrowingTable.appendChild(row);
                });
            }
        }
                const adminActivityList = document.getElementById("adminActivityList");

        if (adminActivityList) {
            const membersById = new Map(
                members.map(function (member) {
                    return [member.id, member];
                })
            );

            if (!activityLogs || activityLogs.length === 0) {
                adminActivityList.innerHTML = `
                    <div class="admin-empty-activity">
                        <div class="admin-empty-icon">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <h3>No activity yet</h3>
                        <p>Library activity will appear here when members borrow or return books.</p>
                    </div>
                `;
            } else {
                adminActivityList.innerHTML = activityLogs.map(function (log) {
                    const member = membersById.get(log.user_id);
                    const eventType = String(log.event_type || "activity")
                        .replace(/[_-]+/g, " ");

                    const details = log.details && typeof log.details === "object"
                        ? log.details
                        : {};

                    const bookTitle =
                        details.book_title ||
                        details.title ||
                        details.book ||
                        "a book";

                    const eventDate = log.created_at
                        ? new Date(log.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short"
                        })
                        : "Date unavailable";

                    return `
                        <article class="admin-activity-item">
                            <div class="admin-activity-icon">
                                <i class="fa-solid ${
                                    /return/i.test(eventType)
                                        ? "fa-rotate-left"
                                        : /borrow/i.test(eventType)
                                            ? "fa-book-open"
                                            : "fa-clock-rotate-left"
                                }"></i>
                            </div>
                            <div class="admin-activity-content">
                                <h3>${safeText(eventType)}</h3>
                                <p>
                                    ${safeText(member?.full_name || "Library member")}
                                    — ${safeText(bookTitle)}
                                </p>
                                <span>${safeText(eventDate)}</span>
                            </div>
                        </article>
                    `;
                }).join("");
            }
        }

        console.log("ShelfSync Admin Dashboard loaded from Supabase.");
    } catch (error) {
        console.error("Could not load Admin Dashboard data:", error);

        alert(
            "The Admin Dashboard could not load its Supabase data. " +
            "Please check the browser console for details."
        );
    }
})();


    /* 
    =========================
       Logout
    ========================= */

    
document
    .querySelectorAll(
        "#logoutBtn, .logout-btn, [data-logout]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();

                    const supabase = window.supabaseClient;

                    try {
                        if (supabase) {
                            const { error } =
                                await supabase.auth.signOut();

                            if (error) {
                                console.error(
                                    "Supabase logout failed:",
                                    error
                                );

                                alert(
                                    "Could not sign out completely. Please try again."
                                );

                                return;
                            }
                        }

                        localStorage.removeItem(
                            "shelfSyncSession"
                        );

                        updateNavbar();

                        alert(
                            "You have been logged out."
                        );

                        window.location.href =
                            pageLink("login.html");

                    } catch (error) {
                        console.error(
                            "Logout failed:",
                            error
                        );

                        alert(
                            "Unable to log out right now. Please try again."
                        );
                    }
                }
            );
        }
    );



    /* =========================
       Escape key
    ========================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }

            closeBookDetails();
            closeLightbox();

            if (menuBtn && navLinks) {

                navLinks.classList.remove(
                    "open"
                );

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    );


    /* =========================
       Smooth internal links
    ========================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                targetId
                            );

                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView(
                            {
                                behavior:
                                    "smooth",
                                block:
                                    "start"
                            }
                        );
                    }
                );
            }
        );


    /* =========================
       Back to top
    ========================= */

    const backToTop =
        document.getElementById(
            "backToTop"
        );


    if (backToTop) {

        window.addEventListener(
            "scroll",
            function () {

                backToTop.classList.toggle(
                    "show",
                    window.scrollY >
                    400
                );
            }
        );


        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo(
                    {
                        top: 0,
                        behavior:
                            "smooth"
                    }
                );
            }
        );
    }


    /* =========================
       Helper
    ========================= */

    function escapeHTML(
        value
    ) {

        return String(
            value || ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }
});
document.addEventListener("click", function (event) {
    const shortcut = event.target.closest("[data-admin-target]");

    if (!shortcut) {
        return;
    }

    const targetSection = shortcut.dataset.adminTarget;

    const navLink = document.querySelector(
        `[data-admin-section="${targetSection}"]`
    );

    if (navLink) {
        navLink.click();
    }
});

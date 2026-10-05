/* =========================================
   PROJECT MARZ
   MOBILE REPAIR MANAGEMENT
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   DASHBOARD
========================================= */

function openDashboard() {

    const loggedIn =
        localStorage.getItem("marzLoggedIn") === "true";


    if (!loggedIn) {

        alert(
            "🔒 Please login to access the MARZ Dashboard."
        );

        openLoginForm();

        return;

    }


    const dashboard =
        document.getElementById("dashboard");


    if (dashboard) {

        dashboard.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================
   REPAIR MODAL
========================================= */

function openRepairForm() {

    if (!isMarzLoggedIn()) {

        alert(
            "🔒 Please login first to access Repairs."
        );

        openLoginForm();

        return;

    }


    const modal =
        document.getElementById("repairModal");


    if (modal) {

        modal.classList.add("show");

    }

}


function closeRepairForm() {

    const modal =
        document.getElementById("repairModal");

    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================================
   CUSTOMER MODAL
========================================= */

function openCustomerForm() {

    if (!isMarzLoggedIn()) {

        alert(
            "🔒 Please login first to access Customers."
        );

        openLoginForm();

        return;

    }


    const modal =
        document.getElementById("customerModal");


    if (modal) {

        modal.classList.add("show");

    }

}


function closeCustomerForm() {

    const modal =
        document.getElementById("customerModal");

    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================================
   SAVE CUSTOMER
========================================= */

function saveCustomer() {

    const nameElement =
        document.getElementById("newCustomerName");

    const phoneElement =
        document.getElementById("newCustomerPhone");

    const emailElement =
        document.getElementById("newCustomerEmail");

    const addressElement =
        document.getElementById("newCustomerAddress");


    if (
        !nameElement ||
        !phoneElement
    ) {

        return;

    }


    const name =
        nameElement.value.trim();

    const phone =
        phoneElement.value.trim();

    const email =
        emailElement
            ? emailElement.value.trim()
            : "";

    const address =
        addressElement
            ? addressElement.value.trim()
            : "";


    if (!name || !phone) {

        alert(
            "Please enter customer name and phone number."
        );

        return;

    }


    let customers =
        JSON.parse(
            localStorage.getItem("marzCustomers")
        ) || [];


    /* CHECK DUPLICATE PHONE */

    const existingCustomer =
        customers.find(
            customer =>
                customer.phone === phone
        );


    if (existingCustomer) {

        alert(
            "A customer with this phone number already exists."
        );

        return;

    }


    /* CREATE CUSTOMER */

    const customer = {

        id: Date.now(),

        name: name,

        phone: phone,

        email: email,

        address: address,

        repairs: 0,

        totalSpent: 0,

        deliveredRepairs: 0

    };


    customers.unshift(customer);


    localStorage.setItem(
        "marzCustomers",
        JSON.stringify(customers)
    );


    /* REFRESH UI */

    refreshCustomerList();

    updateCustomerCount();

    updateReports();


    alert(
        "Customer added successfully!"
    );


    /* CLOSE MODAL */

    closeCustomerForm();


    /* RESET FORM */

    const form =
        document.getElementById("customerForm");

    if (form) {

        form.reset();

    }

}


/* =========================================
   ADD CUSTOMER TO DASHBOARD
========================================= */

function addCustomerToDashboard(customer) {

    const customerList =
        document.getElementById("customerList");


    if (!customerList) {

        return;

    }


    const empty =
        customerList.querySelector(
            ".empty-customers"
        );


    if (empty) {

        empty.remove();

    }


    const card =
        document.createElement("div");


    card.className =
        "customer-card";


    const firstLetter =
        customer.name
            ? customer.name.charAt(0).toUpperCase()
            : "C";


    card.innerHTML = `

        <div class="customer-avatar">

            ${escapeHTML(firstLetter)}

        </div>


        <div class="customer-info">

            <h3>
                ${escapeHTML(customer.name)}
            </h3>


            <p>
                📞 ${escapeHTML(customer.phone)}
            </p>


            ${
                customer.email
                    ? `
                        <p>
                            ✉️ ${escapeHTML(customer.email)}
                        </p>
                      `
                    : ""
            }


            ${
                customer.address
                    ? `
                        <p>
                            📍 ${escapeHTML(customer.address)}
                        </p>
                      `
                    : ""
            }


            <div class="customer-stats">

                <span>
                    🔧 ${Number(customer.repairs) || 0} Repairs
                </span>

                <span>
                    ₹${(
                        Number(customer.totalSpent) || 0
                    ).toLocaleString("en-IN")}
                </span>

            </div>

        </div>

    `;


    customerList.appendChild(card);

}


/* =========================================
   REPAIR SYSTEM
========================================= */

function saveRepair() {

    const customerNameElement =
        document.getElementById("customerName");

    const phoneElement =
        document.getElementById("phoneNumber");

    const deviceElement =
        document.getElementById("device");

    const problemElement =
        document.getElementById("problem");

    const priceElement =
        document.getElementById("price");

    const statusElement =
        document.getElementById("repairStatus");


    if (
        !customerNameElement ||
        !phoneElement ||
        !deviceElement ||
        !problemElement ||
        !priceElement ||
        !statusElement
    ) {

        return;

    }


    const customerName =
        customerNameElement.value.trim();

    const phone =
        phoneElement.value.trim();

    const device =
        deviceElement.value.trim();

    const problem =
        problemElement.value.trim();

    const price =
        Number(priceElement.value) || 0;

    const status =
        statusElement.value;


    if (
        !customerName ||
        !phone ||
        !device ||
        !problem
    ) {

        alert(
            "Please fill all required repair details."
        );

        return;

    }


    let customers =
        JSON.parse(
            localStorage.getItem("marzCustomers")
        ) || [];


    const customerIndex =
        customers.findIndex(
            customer =>
                customer.phone === phone
        );


    if (customerIndex === -1) {

        alert(
            "Customer not found. Please add the customer first."
        );

        return;

    }


    customers[customerIndex].repairs =
        (Number(customers[customerIndex].repairs) || 0) + 1;


    customers[customerIndex].totalSpent =
        (Number(customers[customerIndex].totalSpent) || 0)
        + price;


    localStorage.setItem(
        "marzCustomers",
        JSON.stringify(customers)
    );


    const repair = {

        id: Date.now(),

        customerName: customerName,

        phone: phone,

        device: device,

        problem: problem,

        price: price,

        status: status,

        date:
            new Date()
                .toISOString()
                .split("T")[0]

    };


    let repairs =
        JSON.parse(
            localStorage.getItem("marzRepairs")
        ) || [];


    repairs.unshift(repair);


    localStorage.setItem(
        "marzRepairs",
        JSON.stringify(repairs)
    );


    loadRepairs();

    refreshCustomerList();

    updateActiveRepairs();

    updateTodayRevenue();

    updateReports();


    alert(
        "Repair saved successfully!"
    );


    closeRepairForm();


    const form =
        document.getElementById("repairForm");

    if (form) {

        form.reset();

    }

}


/* =========================================
   ADD REPAIR TO DASHBOARD
========================================= */

function addRepairToDashboard(repair) {

    const repairList =
        document.getElementById("repairList");


    if (!repairList) {

        return;

    }


    const empty =
        repairList.querySelector(
            ".empty-repairs"
        );


    if (empty) {

        empty.remove();

    }


    const repairCard =
        document.createElement("div");


    repairCard.className =
        "repair";


    const statusClass =
        String(repair.status)
            .toLowerCase()
            .replace(/\s+/g, "-");


    repairCard.classList.add(statusClass);


    repairCard.innerHTML = `

        <div class="repair-info">

            <h4>
                ${escapeHTML(repair.device)}
            </h4>

            <p>
                ${escapeHTML(repair.problem)}
            </p>

            <span>
                👤 ${escapeHTML(repair.customerName)}
            </span>

            <small>
                📅 ${escapeHTML(repair.date)}
            </small>

        </div>


        <div class="repair-right">

            <strong>
                ₹${(
                    Number(repair.price) || 0
                ).toLocaleString("en-IN")}
            </strong>


            <select
                onchange="
                    changeRepairStatus(
                        ${repair.id},
                        this.value
                    )
                "
            >

                <option
                    value="Pending"
                    ${repair.status === "Pending" ? "selected" : ""}
                >
                    Pending
                </option>

                <option
                    value="Repairing"
                    ${repair.status === "Repairing" ? "selected" : ""}
                >
                    Repairing
                </option>

                <option
                    value="Ready"
                    ${repair.status === "Ready" ? "selected" : ""}
                >
                    Ready
                </option>

                <option
                    value="Delivered"
                    ${repair.status === "Delivered" ? "selected" : ""}
                >
                    Delivered
                </option>

            </select>


            <div class="repair-actions">

                <button
                    type="button"
                    onclick="viewRepairDetails(${repair.id})"
                >
                    👁 View
                </button>

                <button
                    type="button"
                    onclick="deleteRepair(${repair.id})"
                >
                    🗑 Delete
                </button>

            </div>

        </div>

    `;


    repairList.appendChild(repairCard);

}


/* =========================================
   VIEW REPAIR DETAILS
========================================= */

function viewRepairDetails(repairId) {

    const repairs =
        JSON.parse(
            localStorage.getItem("marzRepairs")
        ) || [];


    const repair =
        repairs.find(
            item =>
                String(item.id) ===
                String(repairId)
        );


    if (!repair) {

        alert(
            "Repair not found."
        );

        return;

    }


    alert(

        "MARZ REPAIR DETAILS\n\n" +

        "Customer: " +
        repair.customerName +

        "\nPhone: " +
        repair.phone +

        "\nDevice: " +
        repair.device +

        "\nProblem: " +
        repair.problem +

        "\nPrice: ₹" +
        Number(repair.price)
            .toLocaleString("en-IN") +

        "\nStatus: " +
        repair.status +

        "\nDate: " +
        repair.date

    );

}


/* =========================================
   DELETE REPAIR
========================================= */

function deleteRepair(repairId) {

    const repairs =
        JSON.parse(
            localStorage.getItem("marzRepairs")
        ) || [];


    const repair =
        repairs.find(
            item =>
                String(item.id) ===
                String(repairId)
        );


    if (!repair) {

        alert(
            "Repair not found."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this repair?"
        );


    if (!confirmDelete) {

        return;

    }


    const updatedRepairs =
        repairs.filter(
            item =>
                String(item.id) !==
                String(repairId)
        );


    localStorage.setItem(
        "marzRepairs",
        JSON.stringify(updatedRepairs)
    );


    let customers =
        JSON.parse(
            localStorage.getItem("marzCustomers")
        ) || [];


    const customerIndex =
        customers.findIndex(
            customer =>
                customer.phone === repair.phone
        );


    if (customerIndex !== -1) {

        customers[customerIndex].repairs =
            Math.max(
                (
                    Number(
                        customers[customerIndex].repairs
                    ) || 0
                ) - 1,
                0
            );


        customers[customerIndex].totalSpent =
            Math.max(
                (
                    Number(
                        customers[customerIndex].totalSpent
                    ) || 0
                ) -
                (
                    Number(repair.price) || 0
                ),
                0
            );


        if (
            repair.status === "Delivered"
        ) {

            customers[customerIndex].deliveredRepairs =
                Math.max(
                    (
                        Number(
                            customers[customerIndex]
                                .deliveredRepairs
                        ) || 0
                    ) - 1,
                    0
                );

        }


        localStorage.setItem(
            "marzCustomers",
            JSON.stringify(customers)
        );

    }


    loadRepairs();

    refreshCustomerList();

    updateActiveRepairs();

    updateTodayRevenue();

    updateReports();


    alert(
        "Repair deleted successfully."
    );

}


/* =========================================
   CHANGE REPAIR STATUS
========================================= */

function changeRepairStatus(
    repairId,
    newStatus
) {

    let repairs =
        JSON.parse(
            localStorage.getItem("marzRepairs")
        ) || [];


    const repairIndex =
        repairs.findIndex(
            repair =>
                String(repair.id) ===
                String(repairId)
        );


    if (repairIndex === -1) {

        return;

    }


    const oldStatus =
        repairs[repairIndex].status;


    repairs[repairIndex].status =
        newStatus;


    localStorage.setItem(
        "marzRepairs",
        JSON.stringify(repairs)
    );


    let customers =
        JSON.parse(
            localStorage.getItem("marzCustomers")
        ) || [];


    const customerIndex =
        customers.findIndex(
            customer =>
                customer.phone ===
                repairs[repairIndex].phone
        );


    if (customerIndex !== -1) {

        if (
            newStatus === "Delivered" &&
            oldStatus !== "Delivered"
        ) {

            customers[customerIndex].deliveredRepairs =
                (
                    Number(
                        customers[customerIndex]
                            .deliveredRepairs
                    ) || 0
                ) + 1;

        }


        if (
            oldStatus === "Delivered" &&
            newStatus !== "Delivered"
        ) {

            customers[customerIndex].deliveredRepairs =
                Math.max(
                    (
                        Number(
                            customers[customerIndex]
                                .deliveredRepairs
                        ) || 0
                    ) - 1,
                    0
                );

        }


        localStorage.setItem(
            "marzCustomers",
            JSON.stringify(customers)
        );

    }


    loadRepairs();

    refreshCustomerList();

    updateActiveRepairs();

    updateTodayRevenue();

    updateReports();


    alert(
        "Repair status updated to " +
        newStatus
    );

}


/* =========================================
   LOAD REPAIRS
========================================= */

function loadRepairs() {

    const repairList =
        document.getElementById("repairList");


    if (!repairList) {

        return;

    }


    repairList.innerHTML = "";


    const repairs =
        JSON.parse(
            localStorage.getItem("marzRepairs")
        ) || [];


    if (repairs.length === 0) {

        repairList.innerHTML = `

            <div class="empty-repairs">

                <p>
                    No repairs added yet.
                </p>

                <span>
                    Create your first repair
                    using the button above.
                </span>

            </div>

        `;


        updateActiveRepairs();

        return;

    }


    repairs.forEach(
        repair =>
            addRepairToDashboard(repair)
    );


    updateActiveRepairs();

}


/* =========================================
   ACTIVE REPAIRS COUNT
========================================= */

function updateActiveRepairs() {

    const element =
        document.getElementById("activeRepairs");


    if (!element) {

        return;

    }


    const repairs =
        JSON.parse(
            localStorage.getItem("marzRepairs")
        ) || [];


    const activeRepairs =
        repairs.filter(
            repair =>
                repair.status === "Pending" ||
                repair.status === "Repairing"
        ).length;


    element.textContent =
        activeRepairs;

}


/* =========================================
   CUSTOMER COUNT
========================================= */

function updateCustomerCount() {

    const element =
        document.getElementById("customerCount");


    if (!element) {

        return;

    }


    const customers =
        JSON.parse(
            localStorage.getItem("marzCustomers")
        ) || [];


    element.textContent =
        customers.length;

}


/* =========================================
   REFRESH CUSTOMER LIST
========================================= */

function refreshCustomerList() {

    const customerList =
        document.getElementById("customerList");


    if (!customerList) {

        return;

    }


    const customers =
        JSON.parse(
            localStorage.getItem("marzCustomers")
        ) || [];


    customerList.innerHTML = "";


    if (customers.length === 0) {

        customerList.innerHTML = `

            <div class="empty-customers">

                <p>
                    No customers added yet.
                </p>

                <span>
                    Add your first customer
                    using the button above.
                </span>

            </div>

        `;


        updateCustomerCount();

        return;

    }


    customers.forEach(
        customer =>
            addCustomerToDashboard(customer)
    );


    updateCustomerCount();

}


/* =========================================
   SEARCH CUSTOMERS
========================================= */

function searchCustomers() {

    const searchElement =
        document.getElementById("customerSearch");

    const customerList =
        document.getElementById("customerList");


    if (
        !searchElement ||
        !customerList
    ) {

        return;

    }


    const search =
        searchElement.value
            .trim()
            .toLowerCase();


    const customers =
        JSON.parse(
            localStorage.getItem("marzCustomers")
        ) || [];


    const filteredCustomers =
        customers.filter(
            customer =>

                String(customer.name)
                    .toLowerCase()
                    .includes(search)

                ||

                String(customer.phone)
                    .toLowerCase()
                    .includes(search)

                ||

                String(customer.email || "")
                    .toLowerCase()
                    .includes(search)

        );


    customerList.innerHTML = "";


    if (filteredCustomers.length === 0) {

        customerList.innerHTML = `

            <div class="empty-customers">

                <p>
                    No matching customers.
                </p>

                <span>
                    Try another name, phone number
                    or email.
                </span>

            </div>

        `;

        return;

    }


    filteredCustomers.forEach(
        customer =>
            addCustomerToDashboard(customer)
    );

}


/* =========================================
   LOAD CUSTOMERS
========================================= */

function loadCustomers() {

    refreshCustomerList();

    updateCustomerCount();

}


/* =========================================
   TODAY'S REVENUE
========================================= */

function updateTodayRevenue() {

    const element =
        document.getElementById("todayRevenue");


    if (!element) {

        return;

    }


    const repairs =
        JSON.parse(
            localStorage.getItem("marzRepairs")
        ) || [];


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayRevenue =
        repairs
            .filter(
                repair =>
                    repair.date === today
            )
            .reduce(
                (
                    total,
                    repair
                ) =>
                    total +
                    (
                        Number(repair.price) || 0
                    ),
                0
            );


    element.textContent =
        "₹" +
        todayRevenue.toLocaleString("en-IN");

}


/* =========================================
   REPORTS
========================================= */

function updateReports() {

    const repairs =
        JSON.parse(
            localStorage.getItem("marzRepairs")
        ) || [];


    const customers =
        JSON.parse(
            localStorage.getItem("marzCustomers")
        ) || [];


    const stock =
        JSON.parse(
            localStorage.getItem("marzStock")
        ) || [];


    const totalRevenue =
        repairs.reduce(
            (
                total,
                repair
            ) =>
                total +
                (
                    Number(repair.price) || 0
                ),
            0
        );


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayRevenue =
        repairs
            .filter(
                repair =>
                    repair.date === today
            )
            .reduce(
                (
                    total,
                    repair
                ) =>
                    total +
                    (
                        Number(repair.price) || 0
                    ),
                0
            );


    const deliveredRepairs =
        repairs.filter(
            repair =>
                repair.status === "Delivered"
        ).length;


    const totalRevenueElement =
        document.getElementById(
            "reportTotalRevenue"
        );


    const todayRevenueElement =
        document.getElementById(
            "reportTodayRevenue"
        );


    const totalRepairsElement =
        document.getElementById(
            "reportTotalRepairs"
        );


    const totalCustomersElement =
        document.getElementById(
            "reportTotalCustomers"
        );


    const totalStockElement =
        document.getElementById(
            "reportTotalStock"
        );


    const deliveredRepairsElement =
        document.getElementById(
            "reportDeliveredRepairs"
        );


    if (totalRevenueElement) {

        totalRevenueElement.textContent =
            "₹" +
            totalRevenue.toLocaleString("en-IN");

    }


    if (todayRevenueElement) {

        todayRevenueElement.textContent =
            "₹" +
            todayRevenue.toLocaleString("en-IN");

    }


    if (totalRepairsElement) {

        totalRepairsElement.textContent =
            repairs.length;

    }


    if (totalCustomersElement) {

        totalCustomersElement.textContent =
            customers.length;

    }


    if (totalStockElement) {

        totalStockElement.textContent =
            stock.length;

    }


    if (deliveredRepairsElement) {

        deliveredRepairsElement.textContent =
            deliveredRepairs;

    }

}


/* =========================================
   STOCK MODAL
========================================= */

function openStockForm() {

    if (!isMarzLoggedIn()) {

        alert(
            "🔒 Please login first to access Stock."
        );

        openLoginForm();

        return;

    }


    const modal =
        document.getElementById("stockModal");


    if (modal) {

        modal.classList.add("show");

    }

}


function closeStockForm() {

    const modal =
        document.getElementById("stockModal");


    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================================
   SAVE STOCK
========================================= */

function saveStock() {

    const itemNameElement =
        document.getElementById("stockItemName");

    const categoryElement =
        document.getElementById("stockCategory");

    const quantityElement =
        document.getElementById("stockQuantity");

    const priceElement =
        document.getElementById("stockPrice");

    const supplierElement =
        document.getElementById("stockSupplier");


    if (
        !itemNameElement ||
        !categoryElement ||
        !quantityElement ||
        !priceElement
    ) {

        return;

    }


    const itemName =
        itemNameElement.value.trim();

    const category =
        categoryElement.value;

    const quantity =
        Number(quantityElement.value) || 0;

    const price =
        Number(priceElement.value) || 0;

    const supplier =
        supplierElement
            ? supplierElement.value.trim()
            : "";


    if (!itemName || !category) {

        alert(
            "Please enter item name and category."
        );

        return;

    }


    const stockItem = {

        id: Date.now(),

        itemName: itemName,

        category: category,

        quantity: quantity,

        price: price,

        supplier: supplier

    };


    let stock =
        JSON.parse(
            localStorage.getItem("marzStock")
        ) || [];


    stock.unshift(stockItem);


    localStorage.setItem(
        "marzStock",
        JSON.stringify(stock)
    );


    loadStock();

    updateStockCount();

    updateReports();


    alert(
        "Stock added successfully!"
    );


    closeStockForm();


    const form =
        document.getElementById("stockForm");


    if (form) {

        form.reset();

    }

}


/* =========================================
   ADD STOCK TO DASHBOARD
========================================= */

function addStockToDashboard(stockItem) {

    const stockList =
        document.getElementById("stockList");


    if (!stockList) {

        return;

    }


    const empty =
        stockList.querySelector(
            ".empty-stock"
        );


    if (empty) {

        empty.remove();

    }


    const card =
        document.createElement("div");


    card.className =
        "stock-card";


    const quantity =
        Number(stockItem.quantity) || 0;


    const lowStock =
        quantity <= 5;


    card.innerHTML = `

        <div class="stock-card-header">

            <div>

                <h3>
                    ${escapeHTML(stockItem.itemName)}
                </h3>

                <span>
                    ${escapeHTML(stockItem.category)}
                </span>

            </div>


            ${
                lowStock
                    ? `
                        <strong class="low-stock-warning">
                            ⚠ Low Stock
                        </strong>
                      `
                    : ""
            }

        </div>


        <div class="stock-details">

            <p>
                📦 Quantity:
                <strong>
                    ${quantity}
                </strong>
            </p>


            <p>
                💰 Price / Unit:
                <strong>
                    ₹${(
                        Number(stockItem.price) || 0
                    ).toLocaleString("en-IN")}
                </strong>
            </p>


            ${
                stockItem.supplier
                    ? `
                        <p>
                            🚚 Supplier:
                            ${escapeHTML(stockItem.supplier)}
                        </p>
                      `
                    : ""
            }

        </div>

    `;


    stockList.appendChild(card);

}


/* =========================================
   LOAD STOCK
========================================= */

function loadStock() {

    const stockList =
        document.getElementById("stockList");


    if (!stockList) {

        return;

    }


    const stock =
        JSON.parse(
            localStorage.getItem("marzStock")
        ) || [];


    stockList.innerHTML = "";


    if (stock.length === 0) {

        stockList.innerHTML = `

            <div class="empty-stock">

                <p>
                    No stock added yet.
                </p>

                <span>
                    Add your first spare part
                    using the button above.
                </span>

            </div>

        `;

        return;

    }


    stock.forEach(
        item =>
            addStockToDashboard(item)
    );

}


/* =========================================
   STOCK COUNT
========================================= */

function updateStockCount() {

    const element =
        document.getElementById("stockCount");


    if (!element) {

        return;

    }


    const stock =
        JSON.parse(
            localStorage.getItem("marzStock")
        ) || [];


    element.textContent =
        stock.length;

}


/* =========================================
   SEARCH STOCK
========================================= */

function searchStock() {

    const searchElement =
        document.getElementById("stockSearch");

    const stockList =
        document.getElementById("stockList");


    if (
        !searchElement ||
        !stockList
    ) {

        return;

    }


    const search =
        searchElement.value
            .trim()
            .toLowerCase();


    const stock =
        JSON.parse(
            localStorage.getItem("marzStock")
        ) || [];


    const filteredStock =
        stock.filter(
            item =>

                String(item.itemName)
                    .toLowerCase()
                    .includes(search)

                ||

                String(item.category)
                    .toLowerCase()
                    .includes(search)

        );


    stockList.innerHTML = "";


    if (filteredStock.length === 0) {

        stockList.innerHTML = `

            <div class="empty-stock">

                <p>
                    No matching stock.
                </p>

                <span>
                    Try another item name
                    or category.
                </span>

            </div>

        `;

        return;

    }


    filteredStock.forEach(
        item =>
            addStockToDashboard(item)
    );

}


/* =========================================
   INVOICE MODAL
========================================= */

function openInvoiceForm() {

    if (!isMarzLoggedIn()) {

        alert(
            "🔒 Please login first to access Invoices."
        );

        openLoginForm();

        return;

    }


    const modal =
        document.getElementById("invoiceModal");


    if (modal) {

        modal.classList.add("show");

    }

}


function closeInvoiceForm() {

    const modal =
        document.getElementById("invoiceModal");


    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================================
   CREATE INVOICE
========================================= */

function createInvoice() {

    console.log("MARZ: createInvoice() called");

    const customerNameElement =
        document.getElementById(
            "invoiceCustomerName"
        );


    const phoneElement =
        document.getElementById(
            "invoicePhone"
        );


    const deviceElement =
        document.getElementById(
            "invoiceDevice"
        );


    const serviceElement =
        document.getElementById(
            "invoiceService"
        );


    const amountElement =
        document.getElementById(
            "invoiceAmount"
        );


    const paymentElement =
        document.getElementById(
            "invoicePayment"
        );


    if (
        !customerNameElement ||
        !phoneElement ||
        !deviceElement ||
        !serviceElement ||
        !amountElement ||
        !paymentElement
    ) {

        return;

    }


    const customerName =
        customerNameElement.value.trim();

    const phone =
        phoneElement.value.trim();

    const device =
        deviceElement.value.trim();

    const service =
        serviceElement.value.trim();

    const amount =
        Number(amountElement.value) || 0;

    const payment =
        paymentElement.value;


    if (
        !customerName ||
        !phone ||
        !device ||
        !service ||
        !payment
    ) {

        alert(
            "Please fill all invoice details."
        );

        return;

    }


    const now =
        new Date();


    const invoice = {

        id: Date.now(),

        invoiceNumber:
            "MARZ-" + Date.now(),

        customerName:
            customerName,

        phone:
            phone,

        device:
            device,

        service:
            service,

        amount:
            amount,

        payment:
            payment,

        date:
            now.toLocaleDateString("en-IN"),

        time:
            now.toLocaleTimeString("en-IN")

    };


    let invoices =
        JSON.parse(
            localStorage.getItem("marzInvoices")
        ) || [];


    invoices.unshift(invoice);


    localStorage.setItem(
        "marzInvoices",
        JSON.stringify(invoices)
    );


    generateInvoice(invoice);


    closeInvoiceForm();


    const form =
        document.getElementById("invoiceForm");


    if (form) {

        form.reset();

    }

}


/* =========================================
   GENERATE PRINTABLE INVOICE
========================================= */

function generateInvoice(invoice) {

    /* =========================================
       LOAD SHOP PROFILE
    ========================================= */

    let shopProfile = {};

    try {

        shopProfile =
            JSON.parse(
                localStorage.getItem("marzShopProfile")
            ) || {};

    } catch (error) {

        shopProfile = {};

    }


    /* =========================================
       SHOP DETAILS
    ========================================= */

    const shopName =
        shopProfile.shopName || "MARZ";

    const ownerName =
        shopProfile.ownerName || "";

    const shopPhone =
        shopProfile.phone || "";

    const shopEmail =
        shopProfile.email || "";

    const shopAddress =
        shopProfile.address || "";

    const shopGST =
        shopProfile.gst || "";


    /* =========================================
       CREATE INVOICE HTML
    ========================================= */

    const invoiceHTML = `

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ${escapeHTML(invoice.invoiceNumber)}
    </title>


    <style>

        * {
            box-sizing: border-box;
        }


        body {

            margin: 0;

            padding: 40px;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            background: #f5f5f5;

            color: #222;

        }


        .invoice {

            max-width: 700px;

            margin: auto;

            background: white;

            padding: 40px;

            border-radius: 12px;

            box-shadow:
                0 10px 30px
                rgba(0, 0, 0, 0.08);

        }


        .header {

            display: flex;

            justify-content:
                space-between;

            align-items:
                flex-start;

            border-bottom:
                2px solid #164a36;

            padding-bottom: 20px;

            margin-bottom: 30px;

        }


        .logo {

            font-size: 34px;

            font-weight: 800;

            color: #164a36;

            letter-spacing: 4px;

        }


        .subtitle {

            margin-top: 5px;

            color: #777;

            font-size: 13px;

        }


        .shop-details {

            margin-top: 12px;

            color: #555;

            font-size: 12px;

            line-height: 1.6;

        }


        .invoice-number {

            text-align: right;

            font-size: 13px;

            color: #555;

        }


        h2 {

            color: #164a36;

            margin-top: 0;

        }


        .customer {

            margin-bottom: 30px;

        }


        .customer p {

            margin: 6px 0;

        }


        table {

            width: 100%;

            border-collapse:
                collapse;

            margin-top: 20px;

        }


        th {

            background: #164a36;

            color: white;

            text-align: left;

            padding: 12px;

        }


        td {

            padding: 14px 12px;

            border-bottom:
                1px solid #ddd;

        }


        .total {

            text-align: right;

            font-size: 22px;

            font-weight: bold;

            color: #164a36;

            margin-top: 25px;

        }


        .payment {

            margin-top: 15px;

            color: #555;

        }


        .footer {

            margin-top: 45px;

            padding-top: 20px;

            border-top:
                1px solid #ddd;

            text-align: center;

            color: #777;

            font-size: 13px;

            line-height: 1.6;

        }


        .print-btn {

            display: block;

            margin: 30px auto 0;

            padding: 12px 25px;

            border: none;

            border-radius: 6px;

            background: #164a36;

            color: white;

            cursor: pointer;

            font-size: 15px;

        }


        @media print {

            body {

                background: white;

                padding: 0;

            }


            .invoice {

                box-shadow: none;

                border-radius: 0;

            }


            .print-btn {

                display: none;

            }

        }

    </style>

</head>


<body>


<div class="invoice">


    <div class="header">


        <div>

            <div class="logo">

                ${escapeHTML(shopName)}

            </div>


            <div class="subtitle">

                Mobile Repair Management

            </div>


            <div class="shop-details">

                ${
                    ownerName
                        ? `
                            <strong>
                                Owner:
                            </strong>

                            ${escapeHTML(ownerName)}

                            <br>
                          `
                        : ""
                }


                ${
                    shopPhone
                        ? `
                            📞 ${escapeHTML(shopPhone)}

                            <br>
                          `
                        : ""
                }


                ${
                    shopEmail
                        ? `
                            ✉️ ${escapeHTML(shopEmail)}

                            <br>
                          `
                        : ""
                }


                ${
                    shopAddress
                        ? `
                            📍 ${escapeHTML(shopAddress)}

                            <br>
                          `
                        : ""
                }


                ${
                    shopGST
                        ? `
                            <strong>
                                GST:
                            </strong>

                            ${escapeHTML(shopGST)}
                          `
                        : ""
                }

            </div>

        </div>


        <div class="invoice-number">

            <strong>
                INVOICE
            </strong>

            <br>

            ${escapeHTML(invoice.invoiceNumber)}

            <br>

            ${escapeHTML(invoice.date)}

        </div>


    </div>


    <div class="customer">

        <h2>
            Customer Details
        </h2>


        <p>

            <strong>
                Name:
            </strong>

            ${escapeHTML(invoice.customerName)}

        </p>


        <p>

            <strong>
                Phone:
            </strong>

            ${escapeHTML(invoice.phone)}

        </p>

    </div>


    <table>

        <thead>

            <tr>

                <th>
                    Device
                </th>

                <th>
                    Service
                </th>

                <th>
                    Amount
                </th>

            </tr>

        </thead>


        <tbody>

            <tr>

                <td>
                    ${escapeHTML(invoice.device)}
                </td>

                <td>
                    ${escapeHTML(invoice.service)}
                </td>

                <td>
                    ₹${Number(invoice.amount)
                        .toLocaleString("en-IN")}
                </td>

            </tr>

        </tbody>

    </table>


    <div class="total">

        Total:

        ₹${Number(invoice.amount)
            .toLocaleString("en-IN")}

    </div>


    <div class="payment">

        Payment Method:

        <strong>

            ${escapeHTML(invoice.payment)}

        </strong>

    </div>


    <div class="footer">

        Thank you for choosing
        ${escapeHTML(shopName)}.

        <br>

        Professional Mobile Repair Management

        ${
            shopPhone
                ? `
                    <br>
                    📞 ${escapeHTML(shopPhone)}
                  `
                : ""
        }

    </div>


    <button
        class="print-btn"
        onclick="window.print()"
    >

        🖨 Print Invoice

    </button>


</div>


</body>

</html>

    `;


    /* =========================================
       CREATE BLOB URL
    ========================================= */

    const invoiceBlob =
        new Blob(
            [invoiceHTML],
            {
                type: "text/html"
            }
        );


    const invoiceURL =
        URL.createObjectURL(
            invoiceBlob
        );


    /* =========================================
       OPEN INVOICE
    ========================================= */

    const invoiceWindow =
        window.open(
            invoiceURL,
            "_blank"
        );


    if (!invoiceWindow) {

        alert(
            "Please allow pop-ups to open the invoice."
        );

        URL.revokeObjectURL(invoiceURL);

        return;

    }


    /* =========================================
       CLEAN UP BLOB URL
    ========================================= */

    setTimeout(
        () => {

            URL.revokeObjectURL(invoiceURL);

        },
        10000
    );

}
/* =========================================
   SECURITY / HTML ESCAPE
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   INITIALIZE MARZ
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCustomers();

        loadRepairs();

        loadStock();

        updateActiveRepairs();

        updateCustomerCount();

        updateTodayRevenue();

        updateStockCount();

        updateReports();

    }
);


/* =========================================
   MARZ LOGIN SYSTEM
========================================= */

function openLoginForm() {

    const modal =
        document.getElementById("loginModal");


    if (modal) {

        modal.classList.add("show");

    }

}


function closeLoginForm() {

    const modal =
        document.getElementById("loginModal");


    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================================
   LOGIN
========================================= */

function loginUser(event) {

    event.preventDefault();


    const username =
        document
            .getElementById("loginUsername")
            .value
            .trim();


    const password =
        document
            .getElementById("loginPassword")
            .value
            .trim();


    const error =
        document.getElementById("loginError");


    if (
        username === "admin" &&
        password === "1234"
    ) {

        localStorage.setItem(
            "marzLoggedIn",
            "true"
        );


        if (error) {

            error.textContent = "";

        }


        alert(
            "Welcome to MARZ Dashboard!"
        );


        closeLoginForm();


        const form =
            document.getElementById("loginForm");


        if (form) {

            form.reset();

        }


        updateLoginButton();


    } else {

        if (error) {

            error.textContent =
                "❌ Invalid username or password.";

        }

    }

}


/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

function toggleLoginPassword() {

    const password =
        document.getElementById("loginPassword");


    if (!password) {

        return;

    }


    if (
        password.type === "password"
    ) {

        password.type = "text";

    } else {

        password.type = "password";

    }

}


/* =========================================
   LOGIN BUTTON STATE
========================================= */

function updateLoginButton() {

    const loginButton =
        document.querySelector(".login-btn");


    if (!loginButton) {

        return;

    }


    const loggedIn =
        localStorage.getItem(
            "marzLoggedIn"
        ) === "true";


    if (loggedIn) {

        loginButton.textContent =
            "Logout";

        loginButton.onclick =
            logoutUser;

    } else {

        loginButton.textContent =
            "Login";

        loginButton.onclick =
            openLoginForm;

    }

}


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    localStorage.removeItem(
        "marzLoggedIn"
    );


    updateLoginButton();


    alert(
        "You have been logged out."
    );

}


/* =========================================
   LOGIN INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateLoginButton();

    }
);


/* =========================================
   MARZ ACCESS CONTROL
========================================= */

function isMarzLoggedIn() {

    return (
        localStorage.getItem("marzLoggedIn") === "true"
    );

}


/* =========================================
   REQUIRE LOGIN
========================================= */

function requireMarzLogin() {

    if (!isMarzLoggedIn()) {

        alert(
            "🔒 Please login first to access MARZ."
        );

        openLoginForm();

        return false;

    }

    return true;

}


/* =========================================
   MARZ SECTION ACCESS CONTROL
========================================= */

function protectMarzSection(sectionId) {

    if (!isMarzLoggedIn()) {

        alert(
            "🔒 Please login first to access MARZ."
        );

        openLoginForm();

        return false;

    }


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }


    return true;

}


/* =========================================
   MARZ SHOP PROFILE
========================================= */

function saveShopProfile() {

    const shopNameElement =
        document.getElementById("shopName");

    const ownerElement =
        document.getElementById("shopOwner");

    const phoneElement =
        document.getElementById("shopPhone");

    const emailElement =
        document.getElementById("shopEmail");

    const addressElement =
        document.getElementById("shopAddress");

    const gstElement =
        document.getElementById("shopGST");


    if (
        !shopNameElement ||
        !ownerElement ||
        !phoneElement ||
        !emailElement ||
        !addressElement ||
        !gstElement
    ) {

        return;

    }


    const shopProfile = {

        shopName:
            shopNameElement.value.trim(),

        ownerName:
            ownerElement.value.trim(),

        phone:
            phoneElement.value.trim(),

        email:
            emailElement.value.trim(),

        address:
            addressElement.value.trim(),

        gst:
            gstElement.value.trim()

    };


    localStorage.setItem(
        "marzShopProfile",
        JSON.stringify(shopProfile)
    );


    alert(
        "✅ Shop profile saved successfully!"
    );

}


/* =========================================
   LOAD SHOP PROFILE
========================================= */

function loadShopProfile() {

    const savedProfile =
        localStorage.getItem("marzShopProfile");


    if (!savedProfile) {

        return;

    }


    let shopProfile = {};


    try {

        shopProfile =
            JSON.parse(savedProfile) || {};

    } catch (error) {

        shopProfile = {};

    }


    const shopNameElement =
        document.getElementById("shopName");

    const ownerElement =
        document.getElementById("shopOwner");

    const phoneElement =
        document.getElementById("shopPhone");

    const emailElement =
        document.getElementById("shopEmail");

    const addressElement =
        document.getElementById("shopAddress");

    const gstElement =
        document.getElementById("shopGST");


    if (shopNameElement) {

        shopNameElement.value =
            shopProfile.shopName || "";

    }


    if (ownerElement) {

        ownerElement.value =
            shopProfile.ownerName || "";

    }


    if (phoneElement) {

        phoneElement.value =
            shopProfile.phone || "";

    }


    if (emailElement) {

        emailElement.value =
            shopProfile.email || "";

    }


    if (addressElement) {

        addressElement.value =
            shopProfile.address || "";

    }


    if (gstElement) {

        gstElement.value =
            shopProfile.gst || "";

    }

}

/* =========================================
   LIVE SHOP PROFILE PREVIEW
========================================= */

function updateShopProfilePreview() {

    const shopName =
        document.getElementById("shopName");

    const owner =
        document.getElementById("shopOwner");

    const phone =
        document.getElementById("shopPhone");

    const email =
        document.getElementById("shopEmail");

    const address =
        document.getElementById("shopAddress");

    const gst =
        document.getElementById("shopGST");


    const previewShopName =
        document.getElementById("previewShopName");

    const previewOwner =
        document.getElementById("previewOwner");

    const previewPhone =
        document.getElementById("previewPhone");

    const previewEmail =
        document.getElementById("previewEmail");

    const previewAddress =
        document.getElementById("previewAddress");

    const previewGST =
        document.getElementById("previewGST");


    if (
        !shopName ||
        !owner ||
        !phone ||
        !email ||
        !address ||
        !gst ||
        !previewShopName
    ) {
        return;
    }


    previewShopName.textContent =
        shopName.value.trim() ||
        "Your Shop Name";

    previewOwner.textContent =
        owner.value.trim() ||
        "Owner Name";

    previewPhone.textContent =
        phone.value.trim() ||
        "Phone number";

    previewEmail.textContent =
        email.value.trim() ||
        "Email address";

    previewAddress.textContent =
        address.value.trim() ||
        "Shop address";

    previewGST.textContent =
        gst.value.trim() ||
        "GST number";
}


/* =========================================
   SHOP PROFILE PREVIEW EVENTS
========================================= */

function setupShopProfilePreview() {

    const fields = [
        "shopName",
        "shopOwner",
        "shopPhone",
        "shopEmail",
        "shopAddress",
        "shopGST"
    ];


    fields.forEach(function(id) {

        const field =
            document.getElementById(id);

        if (field) {

            field.addEventListener(
                "input",
                updateShopProfilePreview
            );

        }

    });


    updateShopProfilePreview();
}


/* =========================================
   LOAD PROFILE WHEN MARZ STARTS
========================================= */

document.addEventListener("DOMContentLoaded", function() {

    loadShopProfile();

    setupShopProfilePreview();

});

/* =========================================
   LIVE SHOP PROFILE PREVIEW
========================================= */

function updateShopProfilePreview() {

    const shopName =
        document.getElementById("shopName");

    const owner =
        document.getElementById("shopOwner");

    const phone =
        document.getElementById("shopPhone");

    const email =
        document.getElementById("shopEmail");

    const address =
        document.getElementById("shopAddress");

    const gst =
        document.getElementById("shopGST");


    const previewShopName =
        document.getElementById("previewShopName");

    const previewOwner =
        document.getElementById("previewOwner");

    const previewPhone =
        document.getElementById("previewPhone");

    const previewEmail =
        document.getElementById("previewEmail");

    const previewAddress =
        document.getElementById("previewAddress");

    const previewGST =
        document.getElementById("previewGST");


    if (!shopName || !previewShopName) {
        return;
    }


    previewShopName.textContent =
        shopName.value.trim() ||
        "Your Shop Name";

    previewOwner.textContent =
        owner.value.trim() ||
        "Owner Name";

    previewPhone.textContent =
        phone.value.trim() ||
        "Phone number";

    previewEmail.textContent =
        email.value.trim() ||
        "Email address";

    previewAddress.textContent =
        address.value.trim() ||
        "Shop address";

    previewGST.textContent =
        gst.value.trim() ||
        "GST number";
}


/* =========================================
   SHOP PROFILE PREVIEW EVENTS
========================================= */

function setupShopProfilePreview() {

    const fields = [
        "shopName",
        "shopOwner",
        "shopPhone",
        "shopEmail",
        "shopAddress",
        "shopGST"
    ];

    fields.forEach(function(id) {

        const field =
            document.getElementById(id);

        if (field) {

            field.addEventListener(
                "input",
                updateShopProfilePreview
            );

        }

    });

    updateShopProfilePreview();
};



/* =========================================
   CHECK LOGIN ON PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            localStorage.getItem(
                "marzLoggedIn"
            ) === "true"
        ) {

            unlockMarzApp();

        }

    }
);
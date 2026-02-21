function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const errorEl = document.getElementById("loginError");

    // clear previous error
    if (errorEl) {
        errorEl.style.display = "none";
        errorEl.textContent = "";
    }

    // basic client‑side validation
    if (!email || !password) {
        if (errorEl) {
            errorEl.textContent = "Please enter both email and password.";
            errorEl.style.display = "block";
        }
        return false;
    }

    // example credential check (replace with real auth when available)
    const sampleCreds = {
        student: { email: "student@example.com", password: "student123" },
        admin: { email: "admin@example.com", password: "admin123" },
        alumni: { email: "alumni@example.com", password: "alumni123" }
    };

    const creds = sampleCreds[role];
    if (!creds || creds.email !== email || creds.password !== password) {
        if (errorEl) {
            errorEl.textContent = "Invalid credentials for the selected role.";
            errorEl.style.display = "block";
        }
        return false;
    }

    // 1. Save session to satisfy the security check on dashboard pages
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role);
    localStorage.setItem("userEmail", email);

    // 2. Map the roles to their respective "Brains" (Views)
    if (role === "admin") {
        window.location.href = "pages/admin/dashboard.html";
    } else if (role === "student") {
        window.location.href = "pages/student/dashboard.html";
    } else if (role === "alumni") {
        window.location.href = "pages/alumni/dashboard.html";
    }

    // Prevent form from refreshing the page
    return false;
}
function logout() {
    localStorage.clear();
    // always redirect back to root login page regardless of current folder
    window.location.href = window.location.origin + "/login.html";
}
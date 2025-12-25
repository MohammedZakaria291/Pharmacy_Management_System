document.getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    let isValid = true;

    // Hide previous errors
    document.getElementById("usernameError").style.display = "none";
    document.getElementById("passwordError").style.display = "none";

    // Validate username
    if (username === "") {
      document.getElementById("usernameError").style.display = "block";
      isValid = false;
    }

    // Validate password
    if (password === "") {
      document.getElementById("passwordError").style.display = "block";
      isValid = false;
    }
    // Simulate login (in a real app, this would send to a server)
    if (isValid) {
      // For demo: Check hardcoded credentials (username: admin, password: admin123)
      if (username === "admin" && password === "admin123") {
        // alert('Login successful! Welcome to Pharmacy Management System.');
        window.location.href = "../dashboard/index.html"; // Redirect to dashboard
      } else if (username === "pharma" && password === "pharma123") {
        // alert('Login successful! Welcome to Pharmacy Management System.');
        window.location.href = "../dashboard/index.html";
      } else {
        alert("Invalid username or password. Please try again.");
      }
    }
  });

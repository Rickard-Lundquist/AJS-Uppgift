function validate() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "admin" && password === "admin") {
        document.getElementById('log').style.display = 'none'
        document.getElementById('add').style.display = 'block'
    }
    else {
        window.alert("Error Wrong Username or Password");
    }
}
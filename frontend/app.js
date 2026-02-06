(document).ready(function() {
    const API_URL = "http://localhost:8080/api/users";

    // 1. Load users when the page loads
    loadUsers();

    // 2. Handle form submission to add a new user
    $("#userForm").on("submit", function(e) {
        e.preventDefault();

        const userData = {
            name: $("#name").val(),
            surname: $("#surname").val(),
            gender: $("#gender").val(),
            birthdate: $("#birthdate").val(),
            addresses: []
        };
        $.ajax({
            url: API_URL,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(userData),
            success: function(response) {
                alert("User added successfully!");
                $("#userForm")[0].reset();
                loadUsers();
            },
            error: function(err) {
                alert("Error adding user: " + err.responseText);
            }
        });
    });

    // 3. Function to load users and display them in the table
    function loadUsers() {
        $.get(API_URL, function(users) {
            let rows = "";
            users.forEach(user => {
                rows += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.surname}</td>
                        <td>${user.gender}</td>
                        <td>${user.birthdate}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
            $("#userTableBody").html(rows);
        });
    }

    // 4. Function to delete a user
    window.deleteUser = function(userId) {
        if (confirm("Are you sure you want to delete this user?")) {
            $.ajax({
                url: `${API_URL}/${userId}`,
                type: "DELETE",
                success: function() {
                    loadUsers();
                    alert("User deleted successfully!");
                }
            });
        }
    };
});
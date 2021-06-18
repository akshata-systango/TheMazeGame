function ValidateData() {        //Function to validate and add data to database


    let username = document.getElementById("username").value;
    console.log(username)
    var database = firebase.database();
    var ref = database.ref("PlayerRecords/" + username);
    if (username.length > 0) {    //validating Data already exists or not
        ref.on('value', function (snap) {

            if (snap.exists()) {

                function render() {
                    localStorage.setItem("username", username)
                    window.location.href = "./html/game.html"
                }
                render();

            } else {
                document.getElementById("User_Error").innerHTML = "No User Found!!!"
                setTimeout(() => {
                    document.getElementById("LoginWindow").style.display = "none"
                    document.getElementById("register").style.display = "inline-block"
                }, 2000);
                
            }
        })
    } else {
        alert("Please enter value!!")
    }
}

function newUser(){
    let username = document.getElementById("username2").value;
    let Fullname = document.getElementById("Fname").value;
    firebase.database().ref("PlayerRecords/" + username).set({  // if not and adding data to database
            Username: username,
            name : Fullname,
            Easy_level_Score: 0,
            Medium_level_Score: 0,
            Hard_level_Score: 0,
            Extreme_level_Score: 0,
        })
        function render() {                 // function to redirect user to Game page
            localStorage.setItem("username", username)
            window.location.href = "./html/game.html"
        }
    render();
}
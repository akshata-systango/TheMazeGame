

function ValidateData() {        //Function to validate and add data to database
    
    
    let username = document.getElementById("username").value;
    let Fullname = document.getElementById("Fname").value;
    console.log(Fullname, username)
    var database = firebase.database();
    var ref = database.ref("PlayerRecords/" + username);
    if (Fullname.length > 0 && username.length > 0) {    //validating Data already exists or not
        ref.on('value', function (snap) {

            if (snap.exists() && (snap.val().name == Fullname)) {

                function render() {
                    localStorage.setItem("username", username)
                    window.location.href = "E:/FindTheCarrot/html/Game.html"
                }
                render();

            }else if (snap.exists() && (snap.val().name != Fullname)) {
                document.getElementById("username_error").innerHTML = "Username Already Exists!!";
                setTimeout(() => {
                    document.getElementById("username_error").innerHTML = " ";
                    document.getElementById("username").value = " ";
                    document.getElementById("Fname").value=" ";
                }, 1000);
            } else {
                firebase.database().ref("PlayerRecords/" + username).set({  // if not and adding data to database
                    name: Fullname,
                    Username: username,
                    Easy_level_Score: 0,
                    Medium_level_Score: 0,
                    Hard_level_Score: 0,
                    Extreme_level_Score: 0,
                })
                function render() {                 // function to redirect user to Game page
                    localStorage.setItem("username", username)
                    window.location.href = "E:/FindTheCarrot/html/Game.html"
                }
                render();
            }

        })
    } else {
        alert("Please enter value!!")
    }
}
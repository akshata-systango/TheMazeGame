
function SelectAllData() {              //fetching data from database


  var refernce = firebase.database().ref('PlayerRecords')
  refernce.orderByChild("Medium").on('value',
    function (Records) {

      Records.forEach(
        function (child) {
          var Data = child.val()
          var Username = Data.Username
          var score = Data.Medium
          var Fullname = Data.name
          if((score != undefined) &&(score != 0)){
            AddItemsToTable(Fullname,Username, score)
          }
        })
    })
}
function render(){
  window.location.href ="E:/FindTheCarrot/html/Game.html";
}

var sno = 0;
function AddItemsToTable(Fullname, Username, score) {   //Showing Data into a Responsive Table
  var tbody = document.getElementById("tbody")
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');

  var td2 = document.createElement('td');
  var td3 = document.createElement('td');

  var td4 = document.createElement('td');
  td1.innerHTML = ++sno
  td2.innerHTML = Username
  td3.innerHTML = Fullname
  td4.innerHTML = score
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  tbody.appendChild(trow)


}

window.onload = SelectAllData()




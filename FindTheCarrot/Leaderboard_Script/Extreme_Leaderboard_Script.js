var list_of_scores = []
var list_of_fullname = []
var list_of_username = []
var list_of_CurrentScr = []

function SelectAllData() {          //fetching data from database


  var refernce = firebase.database().ref('PlayerRecords')
  refernce.on('value',
    function (Records) {

      Records.forEach(
        function (child) {
          var Data = child.val()
          var Username = Data.Username
          var score = Data.Extreme_level_Score
          var Fullname = Data.name
          var CurrentScr = Data.CurrentScore_ExtremeLevel
          list_of_scores.push(score)
          list_of_fullname.push(Fullname)
          list_of_username.push(Username)
          list_of_CurrentScr.push(CurrentScr)

          for (var i = 0; i < list_of_scores.length; i++) {

            for (var z = 0; z < (list_of_scores.length - i - 1); z++) {

              if (parseInt(list_of_scores[z]) < parseInt(list_of_scores[z + 1])) {
                var temp = list_of_scores[z]
                list_of_scores[z] = list_of_scores[z + 1]
                list_of_scores[z + 1] = temp

                var temp2 = list_of_fullname[z]
                list_of_fullname[z] = list_of_fullname[z + 1]
                list_of_fullname[z + 1] = temp2

                var temp3 = list_of_username[z]
                list_of_username[z] = list_of_username[z + 1]
                list_of_username[z + 1] = temp3

                var temp4 = list_of_CurrentScr[z]
                list_of_CurrentScr[z] = list_of_CurrentScr[z + 1]
                list_of_CurrentScr[z + 1] = temp4


              }
            }
          }



        })
      PlayerRecords_Sort()
    })
}
function PlayerRecords_Sort() {
  for (i = 0; i < list_of_scores.length; i++) {
    var score = list_of_scores[i]
    var Fullname = list_of_fullname[i]
    var Username = list_of_username[i]
    var CurrentScr = list_of_CurrentScr[i]

    if ((score != undefined) && (score != 0)) {
      AddItemsToTable(Fullname, Username, score, CurrentScr)
    }

  }
}
function render() {
  window.location.href = "E:/FindTheCarrot/html/Game.html";
}

var sno = 0;
function AddItemsToTable(Fullname, Username, score, CurrentScr) {   //Showing Data into a Responsive Table
  var tbody = document.getElementById("tbody")
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');

  var td2 = document.createElement('td');
  var td3 = document.createElement('td');

  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  td1.innerHTML = ++sno
  td2.innerHTML = Username
  td3.innerHTML = Fullname
  td4.innerHTML = CurrentScr
  td5.innerHTML = score
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  tbody.appendChild(trow)
}

window.onload = SelectAllData()

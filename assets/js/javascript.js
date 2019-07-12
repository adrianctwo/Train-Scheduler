// Firebase data
var config = {
    apiKey: "AIzaSyBnYa7Q9rt6wLmgNPVyBJdXOvO5h5FeoNc",
    authDomain: "train-scheduler071219.firebaseapp.com",
    databaseURL: "https://train-scheduler071219.firebaseio.com",
    projectId: "train-scheduler071219",
    storageBucket: "",
    messagingSenderId: "775605965388",
    appId: "1:775605965388:web:45a751b57675e47e"
};
// Initialize Firebase
firebase.initializeApp(config);
var data = firebase.database();

// Initalize variable
var trainName = "";
var destination = "";
var time = "";
var frequency = "";
// Time Values
var currentTime = moment(currentTime).format('hh:mm');
var timeConverted;
var clock;
var date;
// Train variable
var trainName;
var trainDestination;
var trainFrequency;
var nextTrainTime;
var timeLeft;
// Array to store information
var trainNameArray = [];
var trainDestinationArray = [];
var trainTimesArray = [];
var trainFreqsArray = [];

$(document).ready(function () {

    // Method to show time for next train
    function showTrains() {
        // time difference = current time - time of first train
        var timeDiff = moment().diff(timeConverted, 'minutes');
        // Getting the remainder
        var minutesAgo = timeDiff % trainFrequency;
        // minutesLeft = frequency - remainder
        timeLeft = trainFrequency - minutesAgo;
        // currentTime + minutesLeft = time of next train
        var nextTrain = moment().add(timeLeft, "minutes");
        // Reformat the time for next time
        nextTrainTime = moment(nextTrain).format("hh:mm");

        // appends train info to table
        $("#table-body").append("<tr class='table-row'><td class='table-name'> " + trainName +
            " </td><td class='table-desination'> " + trainDestination +
            " </td><td class='table-frequency'> " + trainFrequency + " </td><td class='next-train'> " + nextTrainTime +
            " </td><td class='minutes-away'> " + timeLeft +
            " </td></tr>");
    };

    // method to display time
    var updateClock = function () {
        clock = $('#current-time');
        // Using Moment to get the date
        date = moment(new Date()).format('dddd, MMMM Do YYYY, h:mm:ss a');
        clock.html('<p>' + date + '</p>');
        var colon = date.indexOf(':');
        var seconds = (date.substring(colon + 4, date.length - 3));
        // update table for each new minute
        if (seconds == '00') {
            updateTable();
        };
    };
    updateClock();
    // Setting the interval to 1 sec
    setInterval(updateClock, 1000);
    // updates table with train info
    
    function updateTable() {
        // empty table
        $("#table-body").empty();

        // updates values in table for each object key
        for (i = 0; i < trainNameArray.length; i++) {
            //ensures that time is in the past
            timeConverted = moment(trainTimesArray[i], "hh:mm").subtract(1, "years");
            trainName = trainNameArray[i]
            trainDestination = trainDestinationArray[i];
            trainFrequency = trainFreqsArray[i];
            showTrains();
        };
    };

    // Event listener for on click for submit button
    $(document).on('click', '#add-train', function (event) {
        event.preventDefault();
        // Getting value and trimming off any spaces behind the values
        name = $("#name-input").val().trim();
        destination = $("#destination-input").val().trim();
        time = $("#time-input").val().trim();
        frequency = $("#frequency-input").val().trim();
        // Pushing codes to firebase if all required fields 
        if (name != '' && destination != '' && time != '' && frequency != '') {
            data.ref().push({
                name: name,
                destination: destination,
                time: time,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
            // Empty input fields after values are pushed to firebase
            $("#name-input").val('');
            $("#destination-input").val('');
            $("#time-input").val('');
            $("#frequency-input").val('');
        } else {
            // Alert if all required fields are not filled out
            alert("Please fill out all of the fields");
        }
    });

    // Event listener triggers if a child is added to firebase
    data.ref().on("child_added", function (childSnapshot) {
        // pushes new values to arrays
        trainNameArray.push(childSnapshot.val().name);
        trainDestinationArray.push(childSnapshot.val().destination);
        trainTimesArray.push(childSnapshot.val().time);
        trainFreqsArray.push(childSnapshot.val().frequency);
        updateTable();
        // errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});
function filterStudents() {

    let minCGPA = parseFloat(document.getElementById("minCGPA").value);
    let maxBacklogs = parseInt(document.getElementById("maxBacklogs").value);

    // Dummy Student Database
    let students = [
        { name: "Ram", cgpa: 8.2, backlogs: 0 },
        { name: "Rahul", cgpa: 7.5, backlogs: 0 },
        { name: "Sneha", cgpa: 6.8, backlogs: 1 },
        { name: "Arjun", cgpa: 9.0, backlogs: 0 }
    ];

    let eligible = students.filter(student =>
        student.cgpa >= minCGPA &&
        student.backlogs <= maxBacklogs
    );

    let resultHTML = "<h4>Eligible Students:</h4>";

    if (eligible.length === 0) {
        resultHTML += "<p>No students found.</p>";
    } else {
        resultHTML += "<ul class='list-group'>";
        eligible.forEach(student => {
            resultHTML += "<li class='list-group-item'>" +
                student.name + " (CGPA: " + student.cgpa + ")</li>";
        });
        resultHTML += "</ul>";
    }

    document.getElementById("resultArea").innerHTML = resultHTML;

    return false;
}
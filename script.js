// Selecting our form, input, buttons, and message div
var uploadSection = document.getElementById('upload-section');
var reviewSection = document.getElementById('review-section');
var form = document.getElementById('upload-form');
var inputFile = document.getElementById('file-input');
var addButton = document.getElementById('add-button');
var messageDiv = document.getElementById('message');
var fileListDiv = document.getElementById('file-list');
var filesList = [];

// Initially hide the review section
reviewSection.style.display = "none"; 

// When the Add button is clicked
addButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Trigger the file input click
    inputFile.click();
});

// Function to add a file to the list and the UI
function addFile(file) {
    // Add the file to our array
    filesList.push(file);

    // Add the file to our list in the HTML
    var listItem = document.createElement("li");
    listItem.textContent = file.name;
    listItem.className = "file-item";

    // Add the remove button
    var removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.className = "remove-button";

    // When the remove button is clicked, remove the file
    removeButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the index of the file in the array
        var index = filesList.indexOf(file);
        if (index !== -1) {
            // Remove the file from the array
            filesList.splice(index, 1);
        }

        // Remove the file from the list in the HTML
        fileListDiv.removeChild(listItem);

        // If no more files, hide review section and show upload section
        if (filesList.length === 0) {
            uploadSection.style.display = "block"; 
            reviewSection.style.display = "none";
        }
    });

    listItem.appendChild(removeButton);
    fileListDiv.appendChild(listItem);
}

// When a file is selected
inputFile.addEventListener('change', function() {
    // Get the selected files
    var files = inputFile.files;

    // Loop through the files and display their names
    for (let i = 0; i < files.length; i++) {
        addFile(files[i]);
    }

    // Check if files are uploaded then hide upload section and show review section
    if (filesList.length > 0) {
        uploadSection.style.display = "none"; 
        reviewSection.style.display = "block";
    }

    // Reset the input value
    inputFile.value = null;
});

// When the form is submitted
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Create a new FormData instance
    var formData = new FormData();

    // Add each file to the FormData
    for (var i = 0; i < filesList.length; i++) {
        formData.append('files[]', filesList[i]);
    }

    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Set up the request
    xhr.open('POST', 'upload.php', true);

    // Handle the response
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Display the response message
                messageDiv.innerHTML = xhr.responseText;
                messageDiv.style.color = 'green';

                // Clear the selected files
                inputFile.value = '';

                // Clear the files list
                filesList = [];
            } else {
                // Display an error message
                messageDiv.innerHTML = 'Error uploading files.';
                messageDiv.style.color = 'red';
            }
        }
    };

    // Send the request
    xhr.send(formData);
});

/*
  This Google Apps Script is designed to update pull request links in a Google Sheets document.
  
  The updatePRLinks() function iterates through each row in the active sheet, extracts the GitHub
  username from the GitHub profile link in the specified column, and fetches the corresponding
  pull request link using the getPRLink() function. The extracted pull request links are then
  populated in the designated column.
  
  Functions:
  - updatePRLinks(): Iterates through each row in the active sheet, updates pull request links.
  - extractUsernameFromURL(url): Extracts GitHub username from the GitHub profile URL.
  - getPRLink(username): Retrieves the pull request link associated with the specified username.
*/

function updatePRLinks() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var githubColumn = 7; // GitHub profile link column (Column G)
  var prColumn = 13; // PR link column (Column I)

  var lastRow = sheet.getLastRow();

  for (var i = 2; i <= lastRow; i++) { // Assuming data starts from row 2
    var githubProfile = sheet.getRange(i, githubColumn).getValue();

    // Extract username from GitHub profile link
    var username = extractUsernameFromURL(githubProfile);

    if (username !== '') {
      var prLink = getPRLink(username);
      console.log(prLink,username)
      sheet.getRange(i, prColumn).setValue(prLink);
    }
  }
}

function extractUsernameFromURL(url) {
  // Assuming GitHub profile URL format: https://github.com/username
  var parts = url.split('/');
  if (parts.length >= 4 && parts[3] !== '') {
    return parts[3];
  } else {
    return 'None';
  }
}

function getPRLink(username) {
  var repo = 'juspay/hyperswitch';
  var baseURL = 'https://api.github.com/repos/' + repo + '/pulls';

  var response = UrlFetchApp.fetch(baseURL + '?state=all');
  var data = JSON.parse(response.getContentText());

  // Iterate through each pull request to find the one created by the specified username
  for (var i = 0; i < data.length; i++) {
    var pullRequest = data[i];
    if (pullRequest.user.login === username) {
      return pullRequest.html_url; // Return the URL of the pull request created by the specified username
    }
  }
  
  // If no matching pull request is found, return an empty string
  return '';
}


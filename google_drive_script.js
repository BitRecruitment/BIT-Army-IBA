/**
 * ==============================================================================
 * BUSINESS INFORMATION AND TECHNOLOGY (BIT) CLUB - ARMY IBA SAVAR
 * GOOGLE APPS SCRIPT: AUTOMATIC GOOGLE DRIVE RECRUITMENT CLOUD VAULT
 * ==============================================================================
 * 
 * WHAT THIS SCRIPT DOES:
 * 1. Automatically creates a Master Folder in your Google Drive:
 *    "BIT Club Recruitment 2026 (BBA 16 & 17)"
 * 2. Creates an individual subfolder for each applicant:
 *    "[APP-XXXX] Candidate Name - StudentID"
 * 3. Saves the Candidate's uploaded CV / Resume directly into their Google Drive folder.
 * 4. Saves the Candidate's Auto-Generated Official PDF Dossier.
 * 5. Saves any Project / Portfolio files attached by the candidate.
 * 6. Logs all candidate data, scores, and direct file download links into a Master Google Sheet.
 * 
 * DEPLOYMENT INSTRUCTIONS (Takes 2 minutes):
 * 1. Open https://script.google.com/ in your browser (logged into your Google account).
 * 2. Click "+ New project".
 * 3. Delete any code in the editor and paste this entire file.
 * 4. Click "Deploy" (top right) -> "New deployment".
 * 5. Select type: "Web app" (click the gear icon -> Web app).
 * 6. Set Description: "BIT Recruitment Webhook"
 * 7. Execute as: "Me (your email)"
 * 8. Who has access: "Anyone" (IMPORTANT: must be "Anyone" so the website can upload files).
 * 9. Click "Deploy" -> click "Authorize access" (choose your Google account, click Advanced -> Go to Untitled project).
 * 10. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...)
 * 11. Paste that URL into script.js at: const GOOGLE_DRIVE_WEBHOOK_URL = 'YOUR_URL_HERE';
 * ==============================================================================
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // 1. Root Recruitment Folder in your Google Drive
    var rootFolderName = "BIT Club Recruitment 2026 (BBA 16 & 17)";
    var rootFolderIterator = DriveApp.getFoldersByName(rootFolderName);
    var rootFolder;
    if (rootFolderIterator.hasNext()) {
      rootFolder = rootFolderIterator.next();
    } else {
      rootFolder = DriveApp.createFolder(rootFolderName);
    }
    
    // 2. Individual Candidate Subfolder
    var candidateFolderName = "[" + (data.appId || "APP") + "] " + (data.candidateName || "Candidate") + " - " + (data.studentId || "");
    var candidateFolder = rootFolder.createFolder(candidateFolderName);
    
    var dossierPdfUrl = "";
    var cvFileUrl = "";
    var projectFileUrls = [];
    
    // 3. Save Candidate's Auto-Generated PDF Dossier
    if (data.pdfBase64) {
      var pdfBytes = Utilities.base64Decode(data.pdfBase64);
      var pdfFileName = data.pdfFileName || ("Dossier_" + (data.candidateName || "Candidate") + ".pdf");
      var pdfBlob = Utilities.newBlob(pdfBytes, "application/pdf", pdfFileName);
      var pdfFile = candidateFolder.createFile(pdfBlob);
      pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      dossierPdfUrl = pdfFile.getUrl();
    }
    
    // 4. Save Candidate's Uploaded CV / Resume File
    if (data.cvBase64) {
      var cvBytes = Utilities.base64Decode(data.cvBase64);
      var cvFileName = data.cvFileName || "Candidate_CV.pdf";
      var cvMimeType = data.cvMimeType || "application/pdf";
      var cvBlob = Utilities.newBlob(cvBytes, cvMimeType, cvFileName);
      var cvFile = candidateFolder.createFile(cvBlob);
      cvFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      cvFileUrl = cvFile.getUrl();
    }
    
    // 5. Save Project / Portfolio Files (if attached in Stage 4)
    if (data.projectFiles && Array.isArray(data.projectFiles)) {
      data.projectFiles.forEach(function(proj) {
        if (proj.base64) {
          var pBytes = Utilities.base64Decode(proj.base64);
          var pBlob = Utilities.newBlob(pBytes, proj.mimeType || "application/octet-stream", proj.name || "Project_File");
          var pFile = candidateFolder.createFile(pBlob);
          pFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          projectFileUrls.push(pFile.getUrl());
        }
      });
    }
    
    // 6. Master Google Sheet Database
    var sheetName = "BIT Recruitment 2026 Master Candidates Log";
    var files = rootFolder.getFilesByName(sheetName);
    var spreadsheet;
    var sheet;
    
    if (files.hasNext()) {
      spreadsheet = SpreadsheetApp.open(files.next());
      sheet = spreadsheet.getActiveSheet();
    } else {
      spreadsheet = SpreadsheetApp.create(sheetName);
      var sheetFile = DriveApp.getFileById(spreadsheet.getId());
      sheetFile.moveTo(rootFolder);
      sheet = spreadsheet.getActiveSheet();
      
      // Header Row
      sheet.appendRow([
        "Timestamp",
        "Application ID",
        "Full Name",
        "Student ID",
        "Intake Batch",
        "Preferred Sector",
        "Email Address",
        "Contact Phone",
        "Motivation Statement",
        "Psychological Evaluation Summary",
        "Cognitive Speed Score",
        "Project Pitch / Ideas",
        "Candidate Uploaded CV File Link",
        "Generated Single-Page Dossier PDF Link",
        "Candidate Google Drive Folder Link"
      ]);
      sheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#0284C7").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
    
    // Append Candidate Record
    sheet.appendRow([
      new Date(),
      data.appId || "",
      data.candidateName || "",
      data.studentId || "",
      data.intake || "",
      data.sector || "",
      data.email || "",
      data.phone || "",
      data.statement || "",
      data.psychologicalSummary || "",
      data.cognitiveScore || "",
      data.projectVision || "",
      cvFileUrl || (data.cvDetailsString || "None Provided"),
      dossierPdfUrl || "Generated",
      candidateFolder.getUrl()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Candidate files and dossier successfully saved to Google Drive!",
      folderUrl: candidateFolder.getUrl(),
      dossierUrl: dossierPdfUrl,
      cvUrl: cvFileUrl
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

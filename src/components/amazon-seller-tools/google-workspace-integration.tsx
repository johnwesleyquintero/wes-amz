import React from 'react';
import { initializeGoogleSheets, readGoogleSheet, writeGoogleSheet } from '../../lib/google-sheets-utils';
import { initializeGoogleDrive, uploadFileToDrive, downloadFileFromDrive } from '../../lib/google-drive-utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const GoogleWorkspaceIntegration: React.FC = () => {
  const [sheetId, setSheetId] = React.useState('');
  const [sheetRange, setSheetRange] = React.useState('');
  const [fileContent, setFileContent] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [mimeType, setMimeType] = React.useState('');
  const [fileId, setFileId] = React.useState('');

  const handleInitializeSheets = () => {
    initializeGoogleSheets();
    alert('Google Sheets initialized (placeholder)');
  };

  const handleReadSheet = () => {
    const data = readGoogleSheet(sheetId, sheetRange);
    alert(`Read data (placeholder): ${JSON.stringify(data)}`);
  };

  const handleWriteSheet = () => {
    const success = writeGoogleSheet(sheetId, sheetRange, [['Hello', 'World']]);
    if (success) {
      alert('Data written to Google Sheet (placeholder)');
    } else {
      alert('Failed to write data to Google Sheet (placeholder)');
    }
  };

  const handleInitializeDrive = () => {
    initializeGoogleDrive();
    alert('Google Drive initialized (placeholder)');
  };

  const handleUploadFile = () => {
    const success = uploadFileToDrive(fileName, fileContent, mimeType);
    if (success) {
      alert('File uploaded to Google Drive (placeholder)');
    } else {
      alert('Failed to upload file to Google Drive (placeholder)');
    }
  };

  const handleDownloadFile = () => {
    const content = downloadFileFromDrive(fileId);
    alert(`Downloaded file content (placeholder): ${content}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Workspace Integration</CardTitle>
        <CardDescription>Integrate with Google Sheets and Google Drive.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Google Sheets</h3>
          <Button onClick={handleInitializeSheets}>Initialize Sheets</Button>
          <div>
            <Label htmlFor="sheetId">Spreadsheet ID</Label>
            <Input id="sheetId" value={sheetId} onChange={(e) => setSheetId(e.target.value)} placeholder="Enter Spreadsheet ID" />
          </div>
          <div>
            <Label htmlFor="sheetRange">Range (e.g., Sheet1!A1:B2)</Label>
            <Input id="sheetRange" value={sheetRange} onChange={(e) => setSheetRange(e.target.value)} placeholder="Enter Range" />
          </div>
          <Button onClick={handleReadSheet}>Read Sheet</Button>
          <Button onClick={handleWriteSheet}>Write Sample Data to Sheet</Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Google Drive</h3>
          <Button onClick={handleInitializeDrive}>Initialize Drive</Button>
          <div>
            <Label htmlFor="fileName">File Name</Label>
            <Input id="fileName" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Enter File Name" />
          </div>
          <div>
            <Label htmlFor="fileContent">File Content</Label>
            <Input id="fileContent" value={fileContent} onChange={(e) => setFileContent(e.target.value)} placeholder="Enter File Content" />
          </div>
          <div>
            <Label htmlFor="mimeType">MIME Type (e.g., text/plain)</Label>
            <Input id="mimeType" value={mimeType} onChange={(e) => setMimeType(e.target.value)} placeholder="Enter MIME Type" />
          </div>
          <Button onClick={handleUploadFile}>Upload File</Button>
          <div>
            <Label htmlFor="fileId">File ID to Download</Label>
            <Input id="fileId" value={fileId} onChange={(e) => setFileId(e.target.value)} placeholder="Enter File ID" />
          </div>
          <Button onClick={handleDownloadFile}>Download File</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleWorkspaceIntegration;
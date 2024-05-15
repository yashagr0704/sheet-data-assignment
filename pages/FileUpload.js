'use client'
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import * as XLSX from 'xlsx';
import axios from 'axios';




const FileUpload = () => {
  const [validData, setValidData] = useState(null);
  const [invalidData, setInvalidData]=useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check file type
    if (
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      parseFile(file);
    } else {
      setError('Invalid file type. Please upload a CSV or XLSX file.');
    }
  };

  const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result;
      let parsedData = null;
      let unparsedData=null;

      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        [parsedData,unparsedData]= await parseXLSX(data);
        setValidData(parsedData);
        setInvalidData(unparsedData);
      }

        
      
    };
    reader.readAsBinaryString(file); // Use readAsBinaryString for XLSX files
  };

  const parseXLSX = async (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const csvDataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const validData = [];
    const invalidData=[];

    for (let i = 1; i < csvDataArray.length; i++) {
      const row = csvDataArray[i];
      const headers = csvDataArray[0];
      const rowData = {};
      headers.forEach((header, index) => {
        if (row[index] && header) {
          rowData[header] = row[index];
        }
      });
      const requiredKeys = ['Code', 'Description', 'Amount'];
      const missingKeys = requiredKeys.filter(key => !(key in rowData));
      const keywords = ['Azure', 'AWS', 'Salesforce'];
      let foundKeywords=[];
      if(rowData.Description){
        foundKeywords = keywords.filter(keyword => rowData.Description.includes(keyword));
      }

      if (missingKeys.length > 0) {
        rowData.reason=`Missing keys: ${missingKeys.join(', ')} at row number ${i}`;
        invalidData.push(rowData);
    } 
    else if (isNaN(rowData.Amount)) {
        rowData.reason=`Amount is not in the form of a number at row number ${i}`;
        invalidData.push(rowData);
      } else if (!rowData.Code.startsWith('#')) {
        rowData.reason=`Code is not started with # at row number ${i}`;
        invalidData.push(rowData);
      } else if (rowData.Code.length !== 8) {
        rowData.reason=`Code is not of length 8`;
        invalidData.push(rowData);
      } else if (foundKeywords.length === 0) {
        rowData.reason=`Description doesn't contain any of the required keywords at row number ${i}`;
        invalidData.push(rowData);
      } else if (foundKeywords.length > 1) {
        rowData.reason=`Description contains more than 1 keyword at line number ${i}`;
        invalidData.push(rowData);
      } else {
        rowData.type = foundKeywords[0];
        const response=await postData(rowData);
        if(response){
        validData.push(rowData);
        }
        else{
        rowData.reason=`Code is already used of line number ${i}`;
        invalidData.push(rowData);
        }
      }
    }

    //console.log('XLSX parsed:', csvData);
    return [validData,invalidData];
  };

  const postData= async (obj)=>{
       try {
         const data= await axios.post('/api/addData',obj);
         console.log("Successfully added in the database")
         return data;
       } catch (error) {
         console.log("Error while adding data to the database")
       }
  }

 
    

  return (
    <div>
      <Dropzone onDrop={handleFileUpload}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} style={dropzoneStyles}>
            <input {...getInputProps()} />
            <p>Drag & drop a CSV or XLSX file here, or click to select one</p>
          </div>
        )}
      </Dropzone>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      
        <div>
          <h2>Valid Data</h2>
          <pre>{JSON.stringify(validData, null, 2)}</pre>
          <h2>Invalid Data</h2>
          <pre>{JSON.stringify(invalidData, null, 2)}</pre>

        </div>
      
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  cursor: 'pointer',
  margin: '20px 0',
};

export default FileUpload;


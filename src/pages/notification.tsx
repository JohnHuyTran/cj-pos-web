// @ts-nocheck
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import { Document, Page } from "react-pdf";
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

export default function Notification() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div>
      <Document
        file="http://54.255.171.154:30010/api/stock-diff/xxx/export"
        // file="https://docs.marklogic.com/8.0/guide/rest-dev.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => alert('Error while retrieving the outline! ' + error.message)}
        externalLinkTarget="_blank"
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
    </div>
  );
}

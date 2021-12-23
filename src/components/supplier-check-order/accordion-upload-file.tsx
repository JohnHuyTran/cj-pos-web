import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

import theme from '../../styles/theme';
import { useStyles } from '../../styles/makeTheme';
import DeleteIcon from '@mui/icons-material/Delete';
import { isConstructorDeclaration } from 'typescript';
import CloseIcon from '@mui/icons-material/Close';

import ModalAlert from '../modal-alert';
import { uploadFileState } from '../../store/slices/upload-file-slice';
import { useAppDispatch } from '../../store/store';
import { FileType } from '../../models/supplier-check-order-model';
import { ApiError } from '../../models/api-error-model';
import { getFileUrlHuawei } from '../../services/purchase';
import ModalShowHuaweiFile from '../commons/ui/modal-show-huawei-file';

interface fileListProps {
  file: any;
  filename: string;
}

interface fileDisplayList {
  file?: File;
  fileKey?: string;
  fileName?: string;
  status?: string;
  mimeType?: string;
}

interface Props {
  files: FileType[];
}

function AccordionUploadFile({ files }: Props): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [accordionFile, setAccordionFile] = useState<boolean>(false);

  const [displayFile, setDisplayFile] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [newFilename, setNewFilename] = useState<any>('test-rename');
  const [isImage, setIsImage] = useState(false);

  const [validationFile, setValidationFile] = React.useState(false);
  const [errorBrowseFile, setErrorBrowseFile] = React.useState(false);
  const [checkErrorBrowseFile, setCheckErrorBrowseFile] = React.useState(false);
  const [msgErrorBrowseFile, setMsgErrorBrowseFile] = React.useState('');

  // const [fileInfo, setFileInfo] = React.useState<fileInfoProps>({
  //   file: null,
  //   fileName: '',
  //   base64URL: '',
  // });

  // const [fileInfo, setFileInfo] = React.useState<fileInfoProps>({
  //   file: null,
  // });

  // const [fileList, setFileList] = React.useState<fileListProps[]>([]);
  const [fileList, setFileList] = React.useState<File[]>([]);
  const [fileDSList, setFileDSList] = React.useState<fileDisplayList[]>([]);

  const checkSizeFile = (e: any) => {
    const fileSize = e.target.files[0].size;
    const fileName = e.target.files[0].name;
    let parts = fileName.split('.');
    let length = parts.length - 1;
    let checkError: boolean = false;
    // pdf, .jpg, .jpeg
    if (
      parts[length].toLowerCase() !== 'pdf' &&
      parts[length].toLowerCase() !== 'jpg' &&
      parts[length].toLowerCase() !== 'jpeg'
    ) {
      // setValidationFile(true);
      // setCheckErrorBrowseFile(true);
      setErrorBrowseFile(true);
      setMsgErrorBrowseFile('ไม่สามารถอัพโหลดไฟล์ได้ กรุณาแนบไฟล์.pdf หรือ .jpg เท่านั้น');

      return (checkError = true);
    }

    // 1024 = bytes
    // 1024*1024*1024 = mb
    let mb = 1024 * 1024 * 1024;
    // fileSize = mb unit
    if (fileSize < mb) {
      //size > 5MB
      let size = fileSize / 1024 / 1024;
      if (size > 5) {
        // setValidationFile(true);
        // setCheckErrorBrowseFile(true);
        setErrorBrowseFile(true);
        setMsgErrorBrowseFile('ไม่สามารถอัพโหลดไฟล์ได้ เนื่องจากขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์ใหม่');
        return (checkError = true);
      }
    }
  };

  const handleFileInputChange = (e: any) => {
    setValidationFile(false);
    setErrorBrowseFile(false);
    setMsgErrorBrowseFile('');
    const isCheckError = checkSizeFile(e);

    // console.log('isCheckError: ', isCheckError);

    let files: File = e.target.files[0];
    let fileType = files.type.split('/');
    // const fileName = `${sdNo}-01.${fileType[1]}`;

    if (fileList.length < 5 && !isCheckError) {
      setAccordionFile(true);
      // setFileList((fileList) => [...fileList, { file: files, filename: fileType[1] }]);
      setFileList((fileList) => [...fileList, files]);
    } else {
      setFileList((fileList) => [...fileList]);
    }
  };

  function getHuaweiFileUrl(item: fileDisplayList) {
    const keys = item.fileKey;
    const name = item.fileName;

    if (item.status === 'old') {
      console.log('key: ', keys);
      console.log('name: ', name);
      getFileUrlHuawei(keys)
        .then((resp) => {
          if (resp && resp.data) {
            setFileUrl(resp.data);
            setIsImage(item.mimeType === 'image/jpeg');
            setNewFilename(item.fileName);
            setDisplayFile(true);
          }
        })
        .catch((error: ApiError) => {
          console.log('error', error);
        });
    }
  }

  useEffect(() => {
    dispatch(uploadFileState(fileList));
  }, [fileList]);

  let newFileHuawei: any = [];
  let newFileUpload: any = [];
  newFileHuawei = files.map((data: FileType, index: number) => {
    return {
      file: null,
      fileKey: data.fileKey,
      fileName: data.fileName,
      status: 'old',
      mimeType: data.mimeType,
    };
  });
  newFileUpload = fileList.map((data: File, index: number) => {
    return {
      file: data,
      fileKey: '',
      fileName: data.name,
      status: 'new',
      mimeType: '',
    };
  });

  let newFileDisplayList: any = [];
  newFileDisplayList = [...newFileHuawei, ...newFileUpload];

  // const handleDelete = (file: fileListProps) => {
  //   console.log('fileDelete', file);
  //   console.log(
  //     'file delete filter: ',
  //     dataFile.filter((a: any) => a.filename !== file.filename)
  //   );
  //   const fileDelete = dataFile.filter((a: any) => a.filename !== file.filename);
  // };

  const closeDialogConfirm = (value: string) => {
    setErrorBrowseFile(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
        <label htmlFor={'btnBrowse'}>
          <Button id="btnPrint" color="primary" variant="contained" component="span" className={classes.MbtnBrowse}>
            แนบไฟล์
          </Button>
        </label>

        <Typography variant="overline" sx={{ ml: 1, color: theme.palette.cancelColor.main, lineHeight: '120%' }}>
          แนบไฟล์ .pdf/.jpg ขนาดไม่เกิน 5 mb
        </Typography>
      </Box>

      <input
        id="btnBrowse"
        type="file"
        // multiple
        // onDrop
        accept=".pdf, .jpg, .jpeg"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      <Box
        sx={{
          px: 2,
          py: 1,
          mt: 2,
          borderRadius: '5px',
          border: `1px dashed ${theme.palette.primary.main}`,
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => {
            if (newFileDisplayList.length > 0) setAccordionFile(!accordionFile);
          }}
        >
          <Typography sx={{ fontSize: '14px', color: '#676767' }}>
            เอกสารแนบ จำนวน {newFileDisplayList.length}/5
          </Typography>
          {accordionFile ? <KeyboardArrowUp color="primary" /> : <KeyboardArrowDown color="primary" />}
        </Box>

        <Box sx={{ display: accordionFile ? 'visible' : 'none' }}>
          {newFileDisplayList.length > 0 &&
            newFileDisplayList.map((item: fileDisplayList, index: number) => (
              <Box
                key={index}
                component="a"
                href={void 0}
                sx={{
                  color: theme.palette.secondary.main,
                  cursor: item.status === 'old' ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
                onClick={() => getHuaweiFileUrl(item)}
              >
                {item.status === 'old' && (
                  <Typography color="secondary" sx={{ textDecoration: 'underline', fontSize: '13px' }}>
                    {item.fileName}
                  </Typography>
                )}

                {item.status === 'new' && (
                  <Typography color="secondary" sx={{ fontSize: '13px' }}>
                    {item.fileName}
                  </Typography>
                )}

                {/* <IconButton onClick={() => handleDelete(item)} size="small">
                  <CloseIcon fontSize="small" color="error" />
                </IconButton> */}
              </Box>
            ))}
        </Box>
      </Box>

      <ModalShowHuaweiFile
        open={displayFile}
        onClose={() => setDisplayFile(false)}
        fileName={newFilename}
        url={fileUrl}
        isImage={isImage}
      />

      <ModalAlert open={errorBrowseFile} onClose={closeDialogConfirm} errormsg={msgErrorBrowseFile} />
    </>
  );
}

export default AccordionUploadFile;

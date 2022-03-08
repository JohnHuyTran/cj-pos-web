import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

import theme from '../../../styles/theme';
import { useStyles } from '../../../styles/makeTheme';
import CloseIcon from '@mui/icons-material/Close';

import ModalAlert from '../../modal-alert';
import { uploadFileState } from '../../../store/slices/upload-file-slice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { FileType } from '../../../models/supplier-check-order-model';
import { ApiError } from '../../../models/api-error-model';
import { delFileUrlHuawei, getFileUrlHuawei } from '../../../services/purchase';
import ModalShowHuaweiFile from '../../commons/ui/modal-show-huawei-file';

interface fileDisplayList {
  file?: File;
  fileKey?: string;
  fileName?: string;
  status?: string;
  mimeType?: string;
}

interface Props {
  files: FileType[];
  docNo?: string | null | undefined | '';
  docType?: string | null | undefined | '';
  isStatus: boolean;
  onChangeUploadFile: (status: boolean) => void;
}

function AccordionUploadFile({ files, docNo, docType, isStatus, onChangeUploadFile }: Props): ReactElement {
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const [accordionFile, setAccordionFile] = useState<boolean>(false);

  const [displayFile, setDisplayFile] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>('');

  const [newFilename, setNewFilename] = useState<string>('test-rename');
  const [isImage, setIsImage] = useState(false);

  const [validationFile, setValidationFile] = React.useState(false);
  const [errorBrowseFile, setErrorBrowseFile] = React.useState(false);
  const [msgErrorBrowseFile, setMsgErrorBrowseFile] = React.useState('');
  const [fileList, setFileList] = React.useState<File[]>([]);

  const [statusSaveFile, setStatusSaveFile] = useState<boolean>(false);
  const [statusUpload, setStatusUpload] = useState<boolean>(false);

  const fileUploadList = useAppSelector((state) => state.uploadFileSlice.state);

  const checkSizeFile = (e: any) => {
    // console.log('e.target.files: ', e.target.files);
    const fileSize = e.target.files[0].size;
    const fileName = e.target.files[0].name;
    let parts = fileName.split('.');
    let length = parts.length - 1;
    let checkError: boolean = false;

    //match file name
    const matchFilename: any = newFileDisplayList.find((r: any) => r.fileName === fileName);
    if (newFileDisplayList.length > 0 && matchFilename) {
      setErrorBrowseFile(true);
      setMsgErrorBrowseFile('ไม่สามารถอัพโหลดไฟล์ได้ เนื่องจากไฟล์นี้มีอยู่แล้ว');
      return (checkError = true);
    }

    // pdf, .jpg, .jpeg
    if (
      parts[length].toLowerCase() !== 'pdf' &&
      parts[length].toLowerCase() !== 'jpg' &&
      parts[length].toLowerCase() !== 'jpeg'
    ) {
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
        setErrorBrowseFile(true);
        setMsgErrorBrowseFile('ไม่สามารถอัพโหลดไฟล์ได้ เนื่องจากขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์ใหม่');
        return (checkError = true);
      }
    }
  };

  const handleFileInputChange = (e: any) => {
    setStatusUpload(true);
    setStatusSaveFile(false);
    setValidationFile(false);
    setErrorBrowseFile(false);
    setMsgErrorBrowseFile('');
    const isCheckError = checkSizeFile(e);

    let files: File = e.target.files[0];

    if (fileList.length < 5 && !isCheckError) {
      setStatusUpload(true);
      setStatusSaveFile(false);
      setAccordionFile(true);

      setFileList((fileList) => [...fileUploadList, files]);
      return onChangeUploadFile(false);
    } else {
      setStatusUpload(false);
      setFileList((fileList) => [...fileList]);
    }
  };

  function getHuaweiFileUrl(item: fileDisplayList) {
    const keys = item.fileKey ? item.fileKey : '';
    const name = item.fileName ? item.fileName : '';

    if (item.status === 'old') {
      getFileUrlHuawei(keys)
        .then((resp) => {
          if (resp && resp.data) {
            setFileUrl(resp.data);
            setIsImage(item.mimeType === 'image/jpeg');
            setNewFilename(name);
            setDisplayFile(true);
          }
        })
        .catch((error: ApiError) => {
          console.log('error', error);
        });
    }
  }
  let newFileDisplayList: any = [];

  useEffect(() => {
    dispatch(uploadFileState(fileList));
    setStatusSaveFile(isStatus);

    if (newFileDisplayList.length > 0) {
      setAccordionFile(true);
    }
  }, [fileList, !isStatus]);

  const mapHuaweiFile = (file: any) => {
    newFileHuawei = file.map((data: FileType, index: number) => {
      return {
        file: null,
        fileKey: data.fileKey,
        fileName: data.fileName,
        status: 'old',
        mimeType: data.mimeType,
      };
    });
  };

  let newFileHuawei: any = [];
  let newFileUpload: any = [];

  if (files && files.length > 0) {
    mapHuaweiFile(files);
  }

  if (fileList.length > 0) {
    newFileUpload = fileList.map((data: File, index: number) => {
      return {
        file: data,
        fileKey: '',
        fileName: data.name,
        status: 'new',
        mimeType: '',
      };
    });
  }

  if (isStatus) {
    newFileDisplayList = [...newFileHuawei];
  } else {
    if (newFileUpload.length > 0) {
      newFileDisplayList = [...newFileHuawei, ...newFileUpload];
    } else {
      newFileDisplayList = [...newFileHuawei];
    }
  }

  const handleDelete = (file: any) => {
    const fileNameDel = file.fileName;
    const fileKeyDel = file.fileKey;

    if (file.status === 'new') {
      setFileList(fileList.filter((r: any) => r.name !== fileNameDel));
    } else if (file.status === 'old') {
      if (docType && docNo) {
        delFileUrlHuawei(fileKeyDel, docType, docNo)
          .then((value) => {
            return onChangeUploadFile(true);
          })
          .catch((error: ApiError) => {
            return onChangeUploadFile(false);
          });
      }
    }
  };

  const closeDialogConfirm = (value: string) => {
    setErrorBrowseFile(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
        <label htmlFor={'btnBrowse'}>
          <Button
            id="btnPrint"
            color="primary"
            variant="contained"
            component="span"
            className={classes.MbtnBrowse}
            disabled={newFileDisplayList.length === 5}
          >
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
              >
                {item.status === 'old' && (
                  <Typography
                    color="secondary"
                    sx={{ textDecoration: 'underline', fontSize: '13px' }}
                    onClick={() => getHuaweiFileUrl(item)}
                  >
                    {item.fileName}
                  </Typography>
                )}

                {item.status === 'new' && (
                  <Typography color="secondary" sx={{ fontSize: '13px' }}>
                    {item.fileName}
                  </Typography>
                )}

                <IconButton onClick={() => handleDelete(item)} size="small">
                  <CloseIcon fontSize="small" color="error" />
                </IconButton>
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

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
// import { ApiError } from '../../models/api-error-model';
// import { getFileUrlHuawei } from '../../services/purchase';
// import ModalShowHuaweiFile from '../commons/ui/modal-show-huawei-file';
// import { PurchaseDetailFiles } from '../../models/supplier-check-order-model';

interface fileListProps {
  file: any;
  filename: string;
}

interface fileUploadList {
  file?: File;
  fileKey?: string;
  fileName: string;
  status?: string;
}

interface Props {
  files: FileType[];
}

function AccordionUploadFile({ files }: Props): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [accordionFile, setAccordionFile] = useState<boolean>(false);

  // const [displayFile, setDisplayFile] = useState<boolean>(false);
  // const [fileUrl, setFileUrl] = useState<string>('');
  // const [newFilename, setNewFilename] = useState<string>('test-rename');
  // const [isImage, setIsImage] = useState(false);

  // async function getHuaweiFileUrl(item: PurchaseDetailFiles) {
  //   await getFileUrlHuawei(item.filekey)
  //     .then((resp) => {
  //       if (resp && resp.data) {
  //         setFileUrl(resp.data);
  //         setIsImage(item.mimeType === 'image/jpeg');
  //         setNewFilename(item.filename);
  //         setDisplayFile(true);
  //       }
  //     })
  //     .catch((error: ApiError) => {
  //       console.log('error', error);
  //     });
  // }

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

  // let dataFile: any = [];

  // dataFile = fileList.map((data: fileListProps, index: number) => {
  //   return {
  //     file: data.file,
  //     filename: `${sdNo}-0${index + 1} .` + data.filename,
  //   };
  // });

  useEffect(() => {
    console.log('files from huawei: ', files);
    console.log('file List upload file: ', fileList);
    dispatch(uploadFileState(fileList));
  }, [fileList]);

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

      {/* <TextField
        name="browserTxf"
        className={classes.MtextFieldBrowse}
        value={fileInfo.fileName}
        placeholder="แนบไฟล์ .pdf หรือ .jpg ขนาดไฟล์ไม่เกิน 5 MB"
      /> */}

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
            if (fileList.length > 0) setAccordionFile(!accordionFile);
          }}
        >
          <Typography sx={{ fontSize: '14px', color: '#676767' }}>เอกสารแนบ จำนวน {fileList.length}/5</Typography>
          {accordionFile ? <KeyboardArrowUp color="primary" /> : <KeyboardArrowDown color="primary" />}
        </Box>

        <Box sx={{ display: accordionFile ? 'visible' : 'none' }}>
          {fileList.length > 0 &&
            fileList.map((item: any, index: number) => (
              <Box
                key={index}
                component="a"
                href={void 0}
                sx={{
                  color: theme.palette.secondary.main,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography color="secondary" sx={{ fontSize: '13px' }}>
                  {item.name}
                </Typography>

                {/* <IconButton onClick={() => handleDelete(item)} size="small">
                  <CloseIcon fontSize="small" color="error" />
                </IconButton> */}
              </Box>
            ))}
        </Box>
      </Box>

      <ModalAlert open={errorBrowseFile} onClose={closeDialogConfirm} errormsg={msgErrorBrowseFile} />
    </>
  );
}

export default AccordionUploadFile;

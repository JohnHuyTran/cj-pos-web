import React, { ReactElement, useEffect } from 'react';
import { useStyles } from '../../../styles/makeTheme';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

interface Props {
  fieldName: string;
  defaultValue: string;
  maxLength: number;
  onChangeComment: (value: string) => void;
  isDisable: boolean;
  rowDisplay?: number;
}
function TextBoxComment({
  fieldName,
  defaultValue,
  maxLength,
  isDisable,
  onChangeComment,
  rowDisplay,
}: Props): ReactElement {
  const classes = useStyles();
  const [characterCount, setCharacterCount] = React.useState(0);
  const [comment, setComment] = React.useState(defaultValue);

  useEffect(() => {
    if (defaultValue !== '' && defaultValue !== undefined) setCharacterCount(defaultValue.length);
  }, []);

  const handleChangeComment = (event: any) => {
    const value = event.target.value;
    const length = event.target.value.length;
    if (length <= maxLength) {
      setCharacterCount(event.target.value.length);
      // setComment(value);
    }
    return onChangeComment(value);
  };

  return (
    <>
      <Typography variant='body2'>{fieldName}</Typography>
      <TextField
        multiline
        fullWidth
        rows={rowDisplay ? rowDisplay : 2}
        onChange={handleChangeComment}
        defaultValue={defaultValue}
        placeholder={`ความยาวไม่เกิน ${maxLength} ตัวอักษร`}
        className={classes.MtextFieldRemark}
        inputProps={{ maxLength: maxLength }}
        sx={{ maxWidth: 350 }}
        disabled={isDisable}
      />

      <div
        style={{
          fontSize: '11px',
          color: '#AEAEAE',
          width: '100%',
          maxWidth: 350,
          textAlign: 'right',
          // marginTop: "-1.5em",
        }}>
        {characterCount}/{maxLength}
      </div>
    </>
  );
}

export default TextBoxComment;

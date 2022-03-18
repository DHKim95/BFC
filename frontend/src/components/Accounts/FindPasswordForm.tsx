import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import TextFieldWithButton from "./TextFieldWithButton";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function FindPasswordForm() {
  const classes = useStyles();
  // 이메일
  const [email, setEmail] = useState<string>("");

  // 인증관련 state
  const [emailConfirmation, setEmailConfirmation] = useState<boolean>(false);
  const [sendEmailConfirmation, setSendEmailConfirmation] =
    useState<boolean>(false);
  const [userCertificationNumber, setUserCertificationNumber] =
    useState<number>(0);
  const [responseCertificationNumber, setResponseCertificationNumber] =
    useState<number>(0);

  // 유효성 검사 처리
  const [emailMessage, setEmailMessage] = useState<string>("");

  // 임시비밀번호 발급받기
  function requestTempPw(email: string): void {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_URL}/api/v1/auth/signup`,
      data: email,
    })
      .then((res) => console.log(res)) // redux로 저장해서 사용해야할듯
      .catch((err) => console.log(err));
  }

  // 이메일 인증요청
  function requsetEmailConfirmation(): void {
    // 버튼을 다시누르는 경우 다시인증해야함
    if (sendEmailConfirmation) {
      setSendEmailConfirmation(() => false);
      setEmailConfirmation(() => false);
    } else {
      // 인증
      console.log("이메일 인증요청");
      setSendEmailConfirmation(() => true);
      axios({
        method: "get",
        url: `${process.env.REACT_APP_BASE_URL}/api/v1/auth/signup/email`,
      })
        .then((res) => {
          setResponseCertificationNumber(() => res.data.certificationNumber);
        })
        .catch((err) => {
          console.log(err);
          // setSendEmailConfirmation(() => false);
        });
    }
  }

  // 이메일 입력
  function changeEmail(event: React.ChangeEvent<HTMLInputElement>): void {
    const newEmail = email;
    setEmail(event.currentTarget.value);
    setEmail(() => newEmail);
    // 유효성 검사
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!newEmail || emailRegex.test(newEmail)) {
      setEmailMessage("");
    } else {
      setEmailMessage("이메일 형식이 틀렸습니다.");
    }

    return;
  }

  // 이메일 인증번호 입력
  function changeUserCertificationNumber(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const newUserCertificationNumber: number = parseInt(event.target.value);
    setUserCertificationNumber(() => newUserCertificationNumber);
    if (
      userCertificationNumber !== 0 &&
      userCertificationNumber === responseCertificationNumber
    ) {
      setEmailConfirmation(() => true);
    } else {
      setEmailConfirmation(() => false);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          비밀번호 재설정
        </Typography>
        <form className={classes.form} noValidate>
          <TextFieldWithButton
            label="이메일"
            id="username"
            autoComplete="email"
            onChange={changeEmail}
            onClickButton={requsetEmailConfirmation}
            buttonText="인증번호발송"
            disabled={sendEmailConfirmation}
            helperText={emailMessage}
          ></TextFieldWithButton>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="certificationNumber"
            label="인증번호"
            type="text"
            name="certificationNumber"
            onChange={changeUserCertificationNumber}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => requestTempPw}
            disabled={email === "" || emailConfirmation === false}
          >
            임시비밀번호 발급받기
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default FindPasswordForm;

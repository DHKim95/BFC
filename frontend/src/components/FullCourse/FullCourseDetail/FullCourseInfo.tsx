import { Button, FormGroup, Stack, Switch, Typography } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { connect } from "react-redux";

function FullCourseInfo({ title, isPublic }: Props) {
  const isMine = true;
  //내가 쓴글 확인
  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "40px",
      }}
    >
      <Box sx={{ fontSize: "h4.fontSize" }}>{title}</Box>
      {isMine && (
        <Button
          variant="contained"
          style={{
            marginLeft: "10px",
            marginRight: "40px",
            width: "80px",
            height: "30px",
            padding: "0",
            fontSize: "h8.fontSize",
          }}
        >
          수정하기
        </Button>
      )}
      {isMine && (
        <FormGroup>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>비공개</Typography>
            <AntSwitch inputProps={{ "aria-label": "ant design" }} />
            <Typography>공개</Typography>
          </Stack>
        </FormGroup>
      )}
    </div>
  );
}
const mapStateToProps = ({ fullCourse, account }: any) => {
  return {
    title: fullCourse.title,
    currentUserId: account.userId,
    isPublic: fullCourse.isPublic,
  };
};
type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(FullCourseInfo);

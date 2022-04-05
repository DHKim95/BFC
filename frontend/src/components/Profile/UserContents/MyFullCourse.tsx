import * as React from "react";
import { makeStyles } from "@mui/styles";
import { Theme, Paper } from "@mui/material";
import FullCourseModal from "./Modal/FullCourseModal";
import { connect } from "react-redux";
interface place {
  fullcourse_id: number;
  name: string;
  thumbnail: string;
  label: string;
}
const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: theme.spacing(2),
    width: "200px",
    height: "200px",
    margin: "10px",
    paddingRight: "0",
    paddingBottom: "0",
    paddingTop: "0",
    paddingLeft: "0",
  },
  text: {
    position: "absolute",
    textAlign: "center",
  },
}));
function MyFullCourse({ myList }: Props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const nickname = "나는 윈터야"; // props 받아 가져와야함
  const title = `${nickname}님의 풀코스`;
  const placesList: Array<place> = [
    {
      fullcourse_id: 2,
      name: "광안리",
      thumbnail:
        "https://www.visitbusan.net/uploadImgs/files/cntnts/20191229160530047_oen",
      label: "나혼자여행",
    },
    {
      fullcourse_id: 3,
      name: "목구멍",
      thumbnail:
        "https://www.visitbusan.net/uploadImgs/files/cntnts/20191229160530047_oen",
      label: "가족여행",
    },
    {
      fullcourse_id: 2,
      name: "광안리",
      thumbnail:
        "https://www.visitbusan.net/uploadImgs/files/cntnts/20191229160530047_oen",
      label: "나혼자여행",
    },
    {
      fullcourse_id: 3,
      name: "목구멍",
      thumbnail:
        "https://www.visitbusan.net/uploadImgs/files/cntnts/20191229160530047_oen",
      label: "가족여행",
    },
    {
      fullcourse_id: 2,
      name: "광안리",
      thumbnail:
        "https://www.visitbusan.net/uploadImgs/files/cntnts/20191229160530047_oen",
      label: "나혼자여행",
    },
    {
      fullcourse_id: 3,
      name: "목구멍",
      thumbnail:
        "https://www.visitbusan.net/uploadImgs/files/cntnts/20191229160530047_oen",
      label: "가족여행",
    },
  ];
  let baseCard = [];
  for (let i = 0; i < 6; i++) {
    if (i < myList.length) {
      baseCard.push(
        <div key={i} style={{ position: "relative" }}>
          <img
            style={{
              width: "200px",
              height: "200px",
              marginRight: "10px",
              marginLeft: "10px",
              borderRadius: "10px",
            }}
            src={myList[i].thumbnail}
            alt="fullCourseImg"
          ></img>
          <div
            style={{
              width: "200px",
              height: "200px",
              marginRight: "10px",
              marginLeft: "10px",
              borderRadius: "10px",
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              top: 0,
              left: 0,
            }}
          >
            <p style={{ color: "white" }}>#{myList[i].label}</p>
          </div>
        </div>
      );
    } else {
      baseCard.push(<Paper elevation={3} className={classes.paper}></Paper>);
    }
  }

  return (
    <div>
      <p
        style={{
          fontWeight: "bold",
          fontSize: 20,
          textAlign: "left",
          marginLeft: "300px",
        }}
      >
        {title}
        <button
          style={{ float: "right", marginRight: "300px" }}
          onClick={() => setOpen(true)}
        >
          더보기
        </button>
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {baseCard}
      </div>
      {open && (
        <FullCourseModal
          open={open}
          setOpen={() => setOpen(false)}
          contentList={myList}
          title={title}
        ></FullCourseModal>
      )}
    </div>
  );
}
const mapStateToProps = ({ account, profile }: any) => {
  return {
    isLogin: account.isLogin,
    myList: profile.myList,
  };
};
type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(MyFullCourse);

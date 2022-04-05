import { Backdrop, CircularProgress, Stack } from "@mui/material";
import { styled } from "@mui/styles";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { connect } from "react-redux";
import AddCustomPlaceModal from "../../components/FullCourse/CreateFullCourse/AddCustomPlaceModal";
import CollapseContainer from "../../components/FullCourse/CreateFullCourse/CollapseContainer";
import DailyFullCourse from "../../components/FullCourse/CreateFullCourse/DailyFullCourse";
import DayBar from "../../components/FullCourse/CreateFullCourse/DayBar";
import { reorder } from "../../components/FullCourse/CreateFullCourse/dndFunction";
import FullCourseHeader from "../../components/FullCourse/CreateFullCourse/FullCourseHeader";
import FullCourseKakaoMap from "../../components/FullCourse/CreateFullCourse/FullCourseKakaoMap";
import Notice from "../../components/FullCourse/CreateFullCourse/Notice";
import PlaceCardList from "../../components/FullCourse/CreateFullCourse/PlaceCardList";
import PlaceCardListDnd from "../../components/FullCourse/CreateFullCourse/PlaceCardListDnd";
import PlaceDetail from "../../components/FullCourse/CreateFullCourse/PlaceDetail";
import PlaceHeader from "../../components/FullCourse/CreateFullCourse/PlaceHeader";
import PlaceSearch from "../../components/FullCourse/CreateFullCourse/PlaceSearch";
import {
  createNewSchedule,
  moveCard,
  updateSchedule,
} from "../../redux/createFullCourse/actions";
import {
  CreateNewScheduleProps,
  FullCourseListProps,
  UpdateScheduleProps,
} from "../../redux/createFullCourse/types";
import { resetPlaceListWithDistance } from "../../redux/placeList/actions";
import { setFinished, setPage } from "../../redux/schedule/actions";

const MapContainer = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  position: "fixed",
  backgroundColor: "#cdcdcd",
});

// 카드를 이동하는 함수
export const move = (
  source: any,
  destination: any,
  droppableSource: any,
  droppableDestination: any
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed]: any = sourceClone.splice(droppableSource.index, 1);
  const removedClone = { ...removed };
  if (droppableSource.dropableId !== "placeList") {
    removedClone.id = `${removed.id}-${new Date().getTime()}`;
  }
  destClone.splice(droppableDestination.index, 0, removedClone);

  const result: any = {};
  if (droppableSource.dropableId !== "placeList") {
    result[droppableSource.droppableId] = sourceClone;
  }
  result[droppableDestination.droppableId] = destClone;

  return result;
};

// 풀코스 생성페이지
function CreateFullCourse({
  fullCourseList,
  fullCourseId,
  placeList,
  placeListWithDistance,
  nowLoading,
  finished,
  selectedScheduleId,
  setFinished,
  resetPlaceListWithDistance,
  createNewSchedule,
  updateSchedule,
  setPage,
}: Props) {
  const [pickedDay, setPickedDay] = useState<number>(1);
  const [nowScrollPosition, setNowScrollPosition] = useState<number>(0);
  const [dayChange, setDayChange] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [nowFilterTypeIdx, setNowFilterTypeIdx] = useState<number>(0);
  const [recommendDistance, setRecommendDistance] = useState<number>(500);

  // 인피니티 스크롤 관련 변수
  const [nowPage, setNowPage] = useState<number>(0);
  const SIZE = 8;

  // 탭을 여닫는 변수
  const [expandedFullCourse, setExpandedFullCourse] = useState(true);
  const [expandedPlace, setExpandedPlace] = useState(true);
  const [expandedPlaceDetail, setExpandedPlaceDetail] = useState(true);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    // 리스트 바깥이나 place영역에 카드를 놓았을 때
    if (!destination || destination.dropableId === "placeList") {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    const nowSelectedPlaceList =
      nowFilterTypeIdx === 0
        ? placeList
        : nowFilterTypeIdx === 1
        ? placeListWithDistance
        : placeList;

    if (source.droppableId === "placeList") {
      const result = move(
        nowSelectedPlaceList,
        fullCourseList[dInd],
        source,
        destination
      );
      const newState: FullCourseListProps = [...fullCourseList];
      newState[dInd] = result[dInd];
      createNewSchedule({
        newScheduleListInfo: newState,
        day: dInd,
        sequence: destination.index,
        fullCourseId: fullCourseId,
      });

      return;
    }

    const scheduleId = fullCourseList[sInd][source.index].content.scheduleId;
    const placeId = fullCourseList[sInd][source.index].content.placeId;

    if (sInd === dInd) {
      if (source.index === destination.index) {
        // 같은칸, 같은위치로 움직이는 경우
        return;
      }

      // 같은 칸 내부에서 움직이는 경우
      const items = reorder(
        fullCourseList[sInd],
        source.index,
        destination.index
      );
      const newState: any = [...fullCourseList];
      newState[sInd] = items;
      updateSchedule({
        placeId: placeId,
        updateScheduleListInfo: newState,
        fullCourseId: fullCourseId,
        scheduleId: scheduleId,
        day: sInd,
        day2: dInd,
        sequence: source.index,
        sequence2: destination.index,
      });
    } else {
      // 다른 칸으로 움직이는 경우
      const result = move(
        fullCourseList[sInd],
        fullCourseList[dInd],
        source,
        destination
      );
      const newState: any = [...fullCourseList];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];
      updateSchedule({
        placeId: placeId,
        updateScheduleListInfo: newState,
        fullCourseId: fullCourseId,
        scheduleId: scheduleId,
        day: sInd,
        day2: dInd,
        sequence: source.index,
        sequence2: destination.index,
      });
    }
  };
  useEffect(() => {
    console.log("선택지 변경");
    setPage(0);
    setFinished(false);
    resetPlaceListWithDistance();
  }, [nowFilterTypeIdx, recommendDistance, selectedScheduleId]);

  return (
    <>
      <Notice></Notice>
      <div style={{ width: "100%" }}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={nowLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <AddCustomPlaceModal
          openModal={openModal}
          setOpenModal={setOpenModal}
        ></AddCustomPlaceModal>
        <DragDropContext onDragEnd={onDragEnd}>
          <PlaceDetail></PlaceDetail>
          <PlaceSearch></PlaceSearch>
          <div style={{ display: "flex", position: "relative" }}>
            <MapContainer>
              <FullCourseKakaoMap
                nowFilterTypeIdx={nowFilterTypeIdx}
                expandedFullCourse={expandedFullCourse}
                expandedPlace={expandedPlace}
                expandedPlaceDetail={expandedPlaceDetail}
                pickedDay={pickedDay}
              ></FullCourseKakaoMap>
            </MapContainer>
            <DayBar
              pickedDay={pickedDay}
              setPickedDay={setPickedDay}
              setDayChange={setDayChange}
            ></DayBar>
            <CollapseContainer
              expanded={expandedFullCourse}
              setExpanded={setExpandedFullCourse}
              dayChange={dayChange}
              buttonPositionY={0}
              setNowScrollPosition={setNowScrollPosition}
            >
              <FullCourseHeader setOpenModal={setOpenModal}></FullCourseHeader>

              <Stack
                spacing={2}
                sx={{ alignItems: "center", position: "relative" }}
              >
                {fullCourseList.map((dailyCourse: any, idx: number) => (
                  <div key={idx}>
                    <DailyFullCourse
                      setDayChange={setDayChange}
                      nowScrollPosition={nowScrollPosition}
                      idx={idx}
                      pickedDay={pickedDay}
                      placeList={dailyCourse}
                      droppableId={`${idx}`}
                    ></DailyFullCourse>
                  </div>
                ))}
              </Stack>
            </CollapseContainer>

            <CollapseContainer
              expanded={expandedPlace}
              setExpanded={setExpandedPlace}
              buttonPositionY={150}
              backgroundColor="#dee"
            >
              <PlaceHeader
                nowPage={nowPage}
                setNowPage={setNowPage}
                SIZE={SIZE}
                nowFilterTypeIdx={nowFilterTypeIdx}
                recommendDistance={recommendDistance}
                setNowFilterTypeIdx={setNowFilterTypeIdx}
                setRecommendDistance={setRecommendDistance}
              ></PlaceHeader>
              <Stack
                spacing={2}
                sx={{ alignItems: "center", position: "relative" }}
              >
                {nowFilterTypeIdx === 0 ? (
                  <>
                    <PlaceCardList
                      finished={finished}
                      selectedScheduleId={selectedScheduleId}
                      recommendDistance={recommendDistance}
                      placeList={placeList}
                    ></PlaceCardList>
                    <PlaceCardListDnd placeList={placeList}></PlaceCardListDnd>
                  </>
                ) : nowFilterTypeIdx === 1 ? (
                  <>
                    <PlaceCardList
                      finished={finished}
                      selectedScheduleId={selectedScheduleId}
                      recommendDistance={recommendDistance}
                      placeList={placeListWithDistance}
                    ></PlaceCardList>
                    <PlaceCardListDnd
                      placeList={placeListWithDistance}
                    ></PlaceCardListDnd>
                  </>
                ) : (
                  <>
                    <PlaceCardList
                      finished={finished}
                      selectedScheduleId={selectedScheduleId}
                      recommendDistance={recommendDistance}
                      placeList={placeList}
                    ></PlaceCardList>
                    <PlaceCardListDnd placeList={placeList}></PlaceCardListDnd>{" "}
                  </>
                )}
              </Stack>
            </CollapseContainer>
            <CollapseContainer
              expanded={expandedPlaceDetail}
              setExpanded={setExpandedPlaceDetail}
              buttonPositionY={300}
              backgroundColor="#cdd"
            >
              디테일
            </CollapseContainer>
          </div>
        </DragDropContext>
      </div>
    </>
  );
}
const mapStateToProps = ({
  createFullCourse,
  placeListReducer,
  schedule,
  baseInfo,
}: any) => ({
  fullCourseList: createFullCourse.fullCourseList,
  placeList: placeListReducer.placeList,
  placeListWithDistance: placeListReducer.placeListWithDistance,
  fullCourseId: createFullCourse.fullCourseId,
  nowLoading: baseInfo.nowLoading,
  selectedScheduleId: schedule.selectedScheduleId,
  finished: schedule.finished,
});
const mapDispatchToProps = (dispatch: any) => {
  return {
    moveCard: (newState: FullCourseListProps) => dispatch(moveCard(newState)),
    createNewSchedule: (newState: CreateNewScheduleProps) =>
      dispatch(createNewSchedule(newState)),
    updateSchedule: (newState: UpdateScheduleProps) =>
      dispatch(updateSchedule(newState)),
    resetPlaceListWithDistance: () => dispatch(resetPlaceListWithDistance()),
    setPage: (page: number) => dispatch(setPage(page)),
    setFinished: (finished: boolean) => dispatch(setFinished(finished)),
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CreateFullCourse);

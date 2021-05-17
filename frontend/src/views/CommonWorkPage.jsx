import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdContentPaste } from 'react-icons/md';
import { saveRoomInfo, resetRoomInfo } from '../modules/actions/roomActions';
import { commentSetAction } from '../modules/actions/commentActions';
import { getRoomInfo, closeRoom } from '../api/co-fix';
import { modifyDocuments } from '../api/documents';
import { getDocuments } from '../api/documents';
import {
  documentGetAction,
  documentModifyAction,
} from '../modules/actions/documentActions';
import { getAllComments, agreeComment } from '../api/comments.js';

// socket
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

// library
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { debounce } from 'lodash';

// containers
import Participant from '../containers/mypage/Participant';
import DocumentContainer from '../containers/DocumentContainer';
import CommentContainer from '../containers/CommentContainer';
import RoomSettingButtonContainer from '../containers/RoomSettingButtonContainer';

// components
import OpenViduMain from '../openvidu/OpenViduMain';
import useRoomInfo from '../hook/useRoomInfo';
import useLoginUser from '../hook/useLoginUser';

const localStorage = window.localStorage;

export default function CommonWorkPage() {
  const dispatch = useDispatch();
  const { roomId, documentId, memberId, roomTitle, pinNumber } = useRoomInfo();
  const user = useLoginUser();
  const [stompClientTest, setStompClientTest] = useState();
  const sentences = useSelector((state) => {
    return state.document.data;
  });

  const [onFocusedSentence, setOnFocusedSentence] = useState('');

  // socket

  // sentence 클릭 -> comment 조회
  const onHandleClickSentence = (sentenceId) => {
    setOnFocusedSentence(sentenceId);
    getAllComments(
      roomId,
      documentId,
      sentenceId,
      (res) => {
        dispatch(commentSetAction(res.data.data));
      },
      (error) => {
        console.log(error);
      },
    );
  };

  // socket 테스트
  const testRequest = (sentenceId, modifiedContent) => {
    modifyDocuments(
      roomId,
      documentId,
      sentenceId,
      {
        modifiedContent: modifiedContent,
      },
      (res) => {
        // console.log('반환되는 값입니다. : ', res);
      },
      (error) => {
        console.log(error);
      },
    );
  };

  const connectSocket = () => {
    const socket = new SockJS('https://k4b104.p.ssafy.io/api/wss');
    const stompClient = Stomp.over(socket);
    setStompClientTest(stompClient);
    stompClient.connect(
      {
        nickname: localStorage.getItem('nickName') || 'defaultNickName',
        commentRoomId: roomId,
      },
      (frame) => {
        console.log('room connected : ', roomId);
        stompClient.subscribe('/room/' + roomId, (res) => {
          const body = JSON.parse(res.body);
          const modifiedSentence = body.sentence; // 들어오는거 확인
          console.log('room에 문장 추가.');
          ModifyActionHandler(modifiedSentence);
          return body;
        });
      },
    );
  };

  const onHandleDebounce = debounce((modifiedSentence) => {
    dispatch(documentModifyAction(modifiedSentence));
  }, 500);

  const ModifyActionHandler = (modifiedSentence) => {
    onHandleDebounce(modifiedSentence);
  };

  const disconnectSocket = (stompClient) => {
    stompClient.disconnect(() => {
      console.log('room socket disconnected');
    });
  };

  // redux에 저장되어있는 documentReducer 가져오기
  useEffect(() => {
    getDocuments(
      roomId,
      documentId,
      (response) => {
        dispatch(documentGetAction(response.data.data));
      },
      (error) => {
        console.log(`error`, error);
      },
    );

    connectSocket();

    return () => {
      // stompClientTest.disconnect();
    };
  }, []);

  const onPinPasteHandler = () => {
    const pinNum = document.getElementById('pinNum');
    pinNum.select();
    document.execCommand('copy');
  };

  return (
    <S.CommonWorkPage oncopy="return false" oncut="return false">
      <S.HeaderSpace>
        <S.HeaderLeft>
          <S.HeaderTitle>제목 : {roomTitle}</S.HeaderTitle>
        </S.HeaderLeft>
        {user.authenticated && memberId === user.credentials.member.id ? (
          <S.HeaderCenter>
            PIN : &nbsp;
            <S.HeaderInput id="pinNum" value={pinNumber} readOnly />
            <S.PasteIcon onClick={onPinPasteHandler} />
          </S.HeaderCenter>
        ) : null}
        <S.HeaderRight>
          <RoomSettingButtonContainer
            stompClientTest={stompClientTest}
            disconnectSocket={disconnectSocket}
          />
        </S.HeaderRight>
      </S.HeaderSpace>
      <S.UsableSpace>
        <S.LeftSide>
          <Scrollbars style={{ width: '100%', height: '100%' }}>
            <DocumentContainer
              sentences={sentences}
              testRequest={testRequest}
              onHandleClickSentence={onHandleClickSentence}
              stompClientTest={stompClientTest}
            />
          </Scrollbars>
        </S.LeftSide>
        <S.RightSide>
          <Scrollbars style={{ width: '100%', height: '100%' }}>
            <CommentContainer
              sentenceId={onFocusedSentence}
              onHandleClickSentence={onHandleClickSentence}
            />
          </Scrollbars>
        </S.RightSide>
      </S.UsableSpace>
      {/* <Participant /> */}
      <OpenViduMain />
    </S.CommonWorkPage>
  );
}

const S = {
  CommonWorkPage: styled.div`
    width: 100%;
    height: 100%;
    /* padding-top: 86px; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, #ffffeb, #ffcbee);
    padding: 0 5%;
    padding-bottom: 30px;
  `,
  HeaderSpace: styled.div`
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding: 0 10%; */
  `,
  HeaderTitle: styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.1);
    padding: 10px 30px;
    font-family: 'S-CoreDream-6Bold';
    font-size: 1.2rem;
  `,
  HeaderRight: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  HeaderCenter: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.1);
    padding: 10px 30px;
    font-family: 'S-CoreDream-6Bold';
    font-size: 1.2rem;
  `,
  HeaderInput: styled.input`
    width: 100px;
    font-family: 'S-CoreDream-6Bold';
    font-size: 1.2rem;
  `,
  PasteIcon: styled(MdContentPaste)`
    margin-left: 5px;
    width: 24px;
    height: 24px;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: #907b7b;
      transform: scale(1.1);
    }
  `,
  HeaderLeft: styled.div``,
  UsableSpace: styled.div`
    width: 100%;
    height: 90%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
  `,
  LeftSide: styled.div`
    flex-basis: 55%;
    max-width: 60%;
    box-shadow: 0 0 30px #dddddd;
    border-radius: 20px;
    overflow: hidden;
    background-color: white;
    padding: 20px;
    height: 95%;
  `,
  RightSide: styled.div`
    flex-basis: 35%;
    max-width: 35%;
    box-shadow: 0 0 30px #dddddd;
    border-radius: 20px;
    overflow: hidden;
    background-color: white;
    height: 95%;
  `,
};

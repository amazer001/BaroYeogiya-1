import React, { useState } from 'react';
import WithDrawal from '../Components/Modals/WithDrawal';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ModifyUser from '../Components/Modals/ModifyUser';
import '../Css/UserInfo.css';
import axios from 'axios';
export default function UserInfo({
  userInfo,
  userName,
  handleUserName,
  handleWithDrawalModal,
  handleModifyModal,
  handleResponse,
  handleIsLogin,
}) {
  const [userId, setUserId] = useState('');

  const navigate = useNavigate();
  const token = userInfo.accessToken.data.accessToken;

  const [errorMessage, setErrorMessage] = useState('');

  const userInfoRequest = () => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER_URL}/user`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        const id = result.data.data.id;
        const name = result.data.data.name;
        if (result.status === 200) {
          //불러와졌을 경우
          setUserId(id);
          handleUserName(name);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setErrorMessage('유효하지 않은 사용자입니다.');
        } else if (err.response.status === 401) {
          // 토큰 만료 시 refresh 토큰 재발급 요청
          axios({
            method: 'GET',
            url: `${process.env.REACT_APP_SERVER_URL}/user/refresh`,
          })
            .then((result) => {
              // 토큰 갱신에 성공할 경우
              if (result.status === 200) {
                handleResponse(result);
              }
            })
            .catch((err) => {
              if (err.response.status === 400) {
                // 유효한 접근이 아니므로 로그아웃 처리
                handleIsLogin(false);
                navigate('/');
              }
            });
        }
      });
  };

  useEffect(() => {
    userInfoRequest();
  }, []);
  return (
    <div className="userinfo-box">
      <h2 id="signup-title">회원정보</h2>
      <div>
        <p>이름</p>
        <p>{userName ? userName : ''}</p>
      </div>
      <div>
        <p>아이디</p>
        <p>{userId ? userId : ''}</p>
      </div>
      <p className="alert-box">{errorMessage}</p>
      <div className="signup-btns">
        <button
          onClick={() => {
            handleModifyModal();
          }}
        >
          회원정보 수정
        </button>
        <button
          onClick={() => {
            handleWithDrawalModal();
          }}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}

import "../../styles/chatbot.css";

import React, {useState} from 'react';
import {useRecoilState, useRecoilValue} from "recoil";
import {Link, useNavigate} from "react-router-dom";
import chatbot from "../../assets/ic_chatbot.png";
import plusbutton from "../../assets/ic_plus_black.png";
import Bot from './bot';
import {botSteps} from "../../contexts/botSteps";
import {formIdState, spaceState, userState} from "../../commons/Atom";

import form from "../../services/form/form";

const Chatbot = () => {
    const navigate = useNavigate();

    // isSelectBoxVisible 및 isBotVisible 상태를 관리
    const [isSelectBoxVisible, setIsSelectBoxVisible] = useState(false);
    const [isBotVisible, setIsBotVisible] = useState(false);

    const [message, setMessage] = useState("");
    const [formId, setFormId] = useRecoilState(formIdState);

    const space = useRecoilValue(spaceState);
    const user = useRecoilValue(userState);

    /**
     * 플러스 버튼 클릭 시 isSelectBoxVisible 상태를 변경하는 함수
     */
    const handlePlusButtonClick = () => {
        setIsSelectBoxVisible(!isSelectBoxVisible);
    };

    /**
     * 챗봇 버튼 클릭 시 isBotVisible 상태를 변경하는 함수
     */
    const handleChatbotClick = () => {
        setIsBotVisible(!isBotVisible);
    };

    /**
     * 설문 생성 버튼을 클릭했을 때 설문 생성 API를 호출한다.
     */
    const handleCreateSurvey = (e: any) => {
        // 기본 동작을 무시하고 사용자 정의한 액션만 수행하도록 한다.
        e.preventDefault();

        // 콘솔로 전역 상태 관리 변수 값이 잘 들어가 있는지 확인하기
        console.log(`userId: ${user.id}`);

        // API 6.1 설문지 생성하기 (+ 버튼)
        form
            .CreateSurvey(space.id, user.id)
            .then((response) => {
                // 위의 함수에서 response.data를 받아온다.

                console.log(response);
                console.log(response.result);

                const {isSuccess, code, message} = response;
                setMessage(message);

                const {formId} = response.result;

                if (code === 1000) {
                    // 성공적으로 요청이 된 경우
                    setFormId(formId);

                    // <Link to="/createSurvey" />
                    navigate("/createSurvey");
                } else {
                    // FIXME: 이후 남은 예외 처리를 모두 분기 처리해주어야 한다.
                    console.log(code);
                }

                console.log("formIdState.formId: " + formIdState.key);
            })
            .catch((error) => {
                console.log(error);
                setMessage("설문 생성에 실패하였습니다.");
            });
    };

    // 컴포넌트 렌더링
    return (
        <div className="chatbot-container">
            <img
                className="plus-button"
                src={plusbutton}
                alt="plus button"
                onClick={handlePlusButtonClick}
            />
            <img
                className="chatbot"
                src={chatbot}
                alt="chatbot btn"
                onClick={handleChatbotClick}
            />
            {isSelectBoxVisible && (
                <div className="select-box">
                    {/* 스페이스 추가 main page로 이동 */}
                    <Link to="/main">
                        <div className="option">add Space</div>
                    </Link>
                    {/* 설문 페이지로 이동 */}
                    <div className="option" onClick={(e) => handleCreateSurvey(e)}>
                        create Survey
                    </div>
                </div>
            )}
            {/* Bot 컴포넌트를 렌더링하고 botSteps와 isVisible 속성을 전달 */}
            <Bot steps={botSteps} isVisible={isBotVisible}/>
        </div>
    );
};

export default Chatbot;

import React, { useState, useRef, useEffect, useContext } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components/native';
import { Image, Input, Button } from '@components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace, validatePassword } from '@utils/common';
import { Alert } from 'react-native';

import userState from '@contexts/userState';

const Container = styled.View`
  flex: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 40px 20px;
`;

const InputContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;
const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const Signup = ({ navigation }) => {
  // const { dispatch } = useContext(UserContext);
  // const { spinner } = useContext(ProgressContext);
  const [userName, setUserName] = useRecoilState(userState.nameState);
  const [userEmail, setUserEmail] = useRecoilState(userState.emailState);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [disabled, setDisabled] = useState(true);
  const [nameButton, setNameButton] = useState(true);
  const [nameValid, setNameValid] = useState(false);
  const [emailButton, setEmailButton] = useState(true);
  const [emailValid, setEmailValid] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const didMountRef = useRef();

  useEffect(() => {
    if (name) {
      setNameButton(false);
    } else {
      setNameButton(true);
    }
  }, [name]);
  useEffect(() => {
    if (email) {
      if (!validateEmail(email)) {
        setEmailValid(false);
        setEmailButton(false);
      }
    } else {
      setEmailButton(true);
    }
  }, [email]);

  useEffect(() => {
    if (didMountRef.current) {
      let _errorMessage = '';
      if (!name) {
        _errorMessage = '이름을 입력하세요';
      } else if (!validateEmail(email)) {
        _errorMessage = '이메일을 확인해주세요';
      } else if (!validatePassword(password)) {
        _errorMessage = '숫자,문자,특수문자 1개 이상 6자에서 16자';
      } else if (password !== passwordConfirm) {
        _errorMessage = '비밀번호가 맞지 않습니다.';
      } else {
        _errorMessage = '';
      }
      setErrorMessage(_errorMessage);
    } else {
      didMountRef.current = true;
    }
  }, [name, email, password, passwordConfirm]);

  useEffect(() => {
    setDisabled(!(name && email && password && passwordConfirm && !errorMessage && emailValid && nameValid));
  }, [name, email, password, passwordConfirm, errorMessage, emailValid, nameValid]);

  useEffect(() => {}, [email]);

  const signup = ({ email, password, name, photoUrl }) => {
    // API request
    /*
    axios.post('api/signup', {email,password,name,photoUrl}).then(res=>{
      if(res){
        return true;
      }
      return false;
    }).catch(error=>{
      return false;
    })
    */
  };

  const _handleSignupButtonPress = async () => {
    try {
      // spinner.start();

      // 회원가입하는데 user를 리턴받나요??
      // const user = await signup({ email, password, name, photoUrl });

      Alert.alert('회원가입', '회원가입 성공!', [
        {
          text: '로그인하기',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]);
    } catch (e) {
      Alert.alert('회원가입 실패', e.message);
    } finally {
      // spinner.stop();
    }
  };

  return (
    <KeyboardAwareScrollView extraScrollHeight={20}>
      <Container>
        <InputContainer>
          <Input
            label="닉네임"
            value={name}
            onChangeText={(text) => setName(text)}
            onSubmitEditing={() => {
              setName(name.trim());
              emailRef.current.focus();
            }}
            onBlur={() => setName(name.trim())}
            placeholder="닉네임"
            returnKeyType="next"
            width="250px"
            height="50px"
          />
          <Button
            title={nameValid ? '사용 가능' : '중복확인'}
            onPress={() => {
              //TODO : 닉네임 중복 체크
              setNameValid(true);
            }}
            disabled={nameButton}
            width="100px"
            height="40px"
          />
        </InputContainer>

        <InputContainer>
          <Input
            ref={emailRef}
            label="이메일"
            value={email}
            onChangeText={(text) => setEmail(removeWhitespace(text))}
            onSubmitEditing={() => passwordRef.current.focus()}
            placeholder="이메일"
            returnKeyType="next"
            width="250px"
            height="50px"
          />

          <Button
            title={emailValid ? '사용 가능' : '중복확인'}
            onPress={() => {
              if (!validateEmail(email)) {
                Alert.alert('유요하지 않는 이메일', '이메일을 다시 입력해주세요');
              } else {
                //TODO : 서버에서 이메일 중복 확인
                setEmailButton(true);
                Alert.alert('이메일 중복 확인', '사용할 수 있는 이메일 입니다.');
                setEmailValid(true);
                passwordRef.current.focus();
              }
            }}
            disabled={emailButton}
            width="100px"
            height="40px"
          />
        </InputContainer>

        <Input
          ref={passwordRef}
          label="비밀번호"
          value={password}
          onChangeText={(text) => setPassword(removeWhitespace(text))}
          onSubmitEditing={() => passwordConfirmRef.current.focus()}
          placeholder="비밀번호"
          returnKeyType="done"
          isPassword
        />
        <Input
          ref={passwordConfirmRef}
          label="비밀번호 확인"
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(removeWhitespace(text))}
          onSubmitEditing={_handleSignupButtonPress}
          placeholder="비밀번호 재입력"
          returnKeyType="done"
          isPassword
        />
        <ErrorText>{errorMessage}</ErrorText>
        <Button title="회원가입" onPress={_handleSignupButtonPress} disabled={disabled} />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signup;

import React, { useContext, useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Row,
  Col,
} from "reactstrap";
import "./Login.css";
import { AuthContext } from "../../contexts/AuthProvider";

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [alertVisible, setAlertVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [signUpUsername, setSignUpUsername] = useState();
  const [signUpPassword, setSignUpPassword] = useState();
  const [signUpFullName, setSignUpFullName] = useState();
  const [signUpPhone, setSignUpPhone] = useState();
  const [signUpEmail, setSignUpEmail] = useState();
  const [signUpCompany, setSignUpCompany] = useState();
  const [signUpAddress, setSignUpAddress] = useState();
  const [signUpAlertVisible, setSignUpAlertVisible] = useState(false);

  const { userAcc, login, signup } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password).then(function () {
      checkError();
    });
  };

  const handleSubmitSignUp = () => {
    if (
      signUpUsername &&
      signUpPassword &&
      signUpAddress &&
      signUpPhone &&
      signUpEmail &&
      signUpCompany &&
      signUpFullName
    ) {
      signup(
        signUpUsername,
        signUpPassword,
        signUpAddress,
        signUpPhone,
        signUpEmail,
        signUpCompany,
        signUpFullName
      )
        .then(() => {
          setIsLogin(true);
        })
        .catch(() => {
          setSignUpAlertVisible(true);
        });
    } else {
      setSignUpAlertVisible(true);
    }
  };

  function checkError() {
    if (!userAcc) {
      setAlertVisible(true);
    }
  }

  const onDismiss = () => setAlertVisible(false);
  const signUpOnDismiss = () => setSignUpAlertVisible(false);

  return (
    <div>
      <div className="login-container">
        <Form onSubmit={handleSubmit} hidden={!isLogin}>
          <FormGroup row>
            <Label for="exampleEmail">Tài khoản</Label>
            <Input
              type="text"
              name="user"
              id="user"
              placeholder="Tên tài khoản"
              onChange={(e) => {
                setUsername(e.target.value);
                setAlertVisible(false);
              }}
            />
          </FormGroup>
          <FormGroup row>
            <Label for="examplePassword">Mật khẩu</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Mật khẩu"
              onChange={(e) => {
                setPassword(e.target.value);
                setAlertVisible(false);
              }}
            />
          </FormGroup>
          <Row>
            <Button className="login-button">Đăng nhập</Button>
            <Button className="login-button" onClick={() => setIsLogin(false)}>
              Đăng ký
            </Button>
          </Row>
        </Form>
        <Alert
          className="alert-error"
          color="warning"
          isOpen={alertVisible}
          toggle={onDismiss}
        >
          Tên tài khoản hoặc mật khẩu không đúng.
        </Alert>
      </div>
      <div className="signup-container">
        <Form hidden={isLogin}>
          <Row>
            <Col style={{ marginRight: 5 }}>
              <FormGroup row>
                <Label for="exampleEmail">Tài khoản</Label>
                <Input
                  type="text"
                  name="user"
                  id="user"
                  placeholder="Tên tài khoản"
                  onChange={(e) => {
                    setSignUpUsername(e.target.value);
                    setSignUpAlertVisible(false);
                  }}
                />
              </FormGroup>
            </Col>
            <Col style={{ marginLeft: 5 }}>
              <FormGroup row>
                <Label for="examplePassword">Mật khẩu</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Mật khẩu"
                  onChange={(e) => {
                    setSignUpPassword(e.target.value);
                    setSignUpAlertVisible(false);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col style={{ marginRight: 5 }}>
              <FormGroup row>
                <Label for="exampleEmail">Họ và Tên</Label>
                <Input
                  type="text"
                  name="user"
                  id="user"
                  placeholder="Họ và Tên"
                  onChange={(e) => {
                    setSignUpFullName(e.target.value);
                    setSignUpAlertVisible(false);
                  }}
                />
              </FormGroup>
            </Col>
            <Col style={{ marginLeft: 5 }}>
              <FormGroup row>
                <Label for="exampleEmail">Số điện thoại</Label>
                <Input
                  type="number"
                  name="user"
                  id="user"
                  placeholder="Số điện thoại"
                  onChange={(e) => {
                    setSignUpPhone(e.target.value);
                    setSignUpAlertVisible(false);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup row>
            <Label for="exampleEmail">Email</Label>
            <Input
              type="email"
              name="user"
              id="user"
              placeholder="Email"
              onChange={(e) => {
                setSignUpEmail(e.target.value);
                setSignUpAlertVisible(false);
              }}
            />
          </FormGroup>
          <FormGroup row>
            <Label for="exampleEmail">Công ty</Label>
            <Input
              type="text"
              name="user"
              id="user"
              placeholder="Tên công ty"
              onChange={(e) => {
                setSignUpCompany(e.target.value);
                setSignUpAlertVisible(false);
              }}
            />
          </FormGroup>
          <FormGroup row>
            <Label for="exampleEmail">Địa chỉ</Label>
            <Input
              type="text"
              name="user"
              id="user"
              placeholder="Địa chỉ"
              onChange={(e) => {
                setSignUpAddress(e.target.value);
                setSignUpAlertVisible(false);
              }}
            />
          </FormGroup>
          <Row>
            <Button
              className="login-button"
              onClick={() => {
                handleSubmitSignUp();
              }}
            >
              Đăng ký
            </Button>
            <Button className="login-button" onClick={() => setIsLogin(true)}>
              Trở về
            </Button>
          </Row>
        </Form>
        <Alert
          className="alert-error"
          color="warning"
          isOpen={signUpAlertVisible}
          toggle={signUpOnDismiss}
        >
          Lỗi đăng ký tài khoản: nhập thiếu trường hoặc không phù hợp
        </Alert>
      </div>
    </div>
  );
}

export default Login;

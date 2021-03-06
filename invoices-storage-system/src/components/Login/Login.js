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
    login(username, password).then((res) => {
      setAlertVisible(!res);
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
        .then((rs) => {
          if (rs) {
            console.log("dk dc ne");
            setIsLogin(true);
          } else {
            setSignUpAlertVisible(true);
          }
        })
        .catch(() => {
          setSignUpAlertVisible(true);
        });
    } else {
      setSignUpAlertVisible(true);
    }
  };

  const onDismiss = () => setAlertVisible(false);
  const signUpOnDismiss = () => setSignUpAlertVisible(false);

  return (
    <div>
      <div className="login-container">
        <Form onSubmit={handleSubmit} hidden={!isLogin}>
          <FormGroup row>
            <Label for="exampleEmail">T??i kho???n</Label>
            <Input
              type="text"
              name="user"
              id="user"
              placeholder="T??n t??i kho???n"
              onChange={(e) => {
                setUsername(e.target.value);
                setAlertVisible(false);
              }}
            />
          </FormGroup>
          <FormGroup row>
            <Label for="examplePassword">M???t kh???u</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="M???t kh???u"
              onChange={(e) => {
                setPassword(e.target.value);
                setAlertVisible(false);
              }}
            />
          </FormGroup>
          <Row>
            <Button className="login-button">????ng nh???p</Button>
            <Button className="login-button" onClick={() => setIsLogin(false)}>
              ????ng k??
            </Button>
          </Row>
        </Form>
        <Alert
          className="alert-error"
          color="warning"
          isOpen={alertVisible}
          toggle={onDismiss}
        >
          T??n t??i kho???n ho???c m???t kh???u kh??ng ????ng.
        </Alert>
      </div>
      <div className="signup-container">
        <Form hidden={isLogin}>
          <Row>
            <Col style={{ marginRight: 5 }}>
              <FormGroup row>
                <Label for="exampleEmail">T??i kho???n</Label>
                <Input
                  type="text"
                  name="user"
                  id="user"
                  placeholder="T??n t??i kho???n"
                  onChange={(e) => {
                    setSignUpUsername(e.target.value);
                    setSignUpAlertVisible(false);
                  }}
                />
              </FormGroup>
            </Col>
            <Col style={{ marginLeft: 5 }}>
              <FormGroup row>
                <Label for="examplePassword">M???t kh???u</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="M???t kh???u"
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
                <Label for="exampleEmail">H??? v?? T??n</Label>
                <Input
                  type="text"
                  name="user"
                  id="user"
                  placeholder="H??? v?? T??n"
                  onChange={(e) => {
                    setSignUpFullName(e.target.value);
                    setSignUpAlertVisible(false);
                  }}
                />
              </FormGroup>
            </Col>
            <Col style={{ marginLeft: 5 }}>
              <FormGroup row>
                <Label for="exampleEmail">S??? ??i???n tho???i</Label>
                <Input
                  type="number"
                  name="user"
                  id="user"
                  placeholder="S??? ??i???n tho???i"
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
            <Label for="exampleEmail">C??ng ty</Label>
            <Input
              type="text"
              name="user"
              id="user"
              placeholder="T??n c??ng ty"
              onChange={(e) => {
                setSignUpCompany(e.target.value);
                setSignUpAlertVisible(false);
              }}
            />
          </FormGroup>
          <FormGroup row>
            <Label for="exampleEmail">?????a ch???</Label>
            <Input
              type="text"
              name="user"
              id="user"
              placeholder="?????a ch???"
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
              ????ng k??
            </Button>
            <Button className="login-button" onClick={() => setIsLogin(true)}>
              Tr??? v???
            </Button>
          </Row>
        </Form>
        <Alert
          className="alert-error"
          color="warning"
          isOpen={signUpAlertVisible}
          toggle={signUpOnDismiss}
        >
          L???i ????ng k?? t??i kho???n: nh???p thi???u tr?????ng ho???c kh??ng ph?? h???p
        </Alert>
      </div>
    </div>
  );
}

export default Login;

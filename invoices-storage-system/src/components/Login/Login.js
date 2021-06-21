import React, { useContext, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import "./Login.css";
import { AuthContext } from "../../contexts/AuthProvider";

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [alertVisible, setAlertVisible] = useState(false);

  const { userAcc, login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password).then(function () {
      checkError();
    });
  };

  function checkError() {
    if (!userAcc) {
      setAlertVisible(true);
    }
  }

  const onDismiss = () => setAlertVisible(false);

  return (
    <div className="login-container">
      <Form onSubmit={handleSubmit}>
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
        <Button className="login-button">Đăng nhập</Button>
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
  );
}

export default Login;

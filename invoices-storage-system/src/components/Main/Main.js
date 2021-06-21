import React, { useEffect, useState, useContext } from "react";
import DInvoice from "../../abis/Invoices.json";
import Web3 from "web3";

import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Table,
} from "reactstrap";
import { AuthContext } from "../../contexts/AuthProvider";
import { setConstantValue } from "typescript";
const axios = require("axios");

function Main() {
  const { logout, userAcc } = useContext(AuthContext);
  const [isDateSearch, setIsDateSearch] = useState(false);

  const [openInvoice, setOpenInvoice] = React.useState(false);
  const [openProfile, setOpenProfile] = React.useState(false);

  const [onChange, setOnChange] = useState(false);
  const [fullName, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [address, setAddress] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [company, setCompany] = useState(null);
  const [failAlert, setFailAlert] = useState(false);

  const [dInvoice, setDInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    getUser();
  }, [onChange]);

  //load web3
  useEffect(async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }, []);

  //load contract
  useEffect(async () => {
    const web3 = window.web3;
    //Load accounts
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    //Add first account the the state
    setAccount(accounts[0]);
    //Get network ID
    const networkId = await web3.eth.net.getId();
    //Get network data
    const networkData = DInvoice.networks[networkId];
    if (networkData) {
      const invoice = new web3.eth.Contract(DInvoice.abi, networkData.address);
      console.log("[INVOICE NE]", invoice);
      // this.setState({ invoice });
      setDInvoice(invoice);

      // this.setState({ loading: false });
      setLoading(false);
    } else {
      window.alert("DInvoice contract not deployed to detected network");
    }
  }, []);

  const getUser = () => {
    let loginToken = localStorage.getItem("LoginToken");
    let userId = localStorage.getItem("UserId");
    axios
      .get(process.env.REACT_APP_BASE_URL + "users", {
        params: {
          id: userId,
        },
        headers: {
          Authorization: "Bearer " + loginToken,
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setFullName(userAcc.username);
        setEmail(data.claims.email);
        setPhoneNumber(data.claims.phoneNumber);
        setAddress(data.claims.address);
        setCompany(data.claims.company);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateUser = () => {
    let loginToken = localStorage.getItem("LoginToken");
    let userId = localStorage.getItem("UserId");
    let newUserClaim = {
      updateClaim: {
        address: address,
        phoneNumber: phoneNumber,
        email: email,
        company: company,
      },
    };
    axios
      .put(process.env.REACT_APP_BASE_URL + "users", newUserClaim, {
        params: {
          id: userId,
        },
        headers: {
          Authorization: "Bearer " + loginToken,
        },
      })
      .then((response) => {
        setOnChange(!onChange);
        closeUserProfile();
      })
      .catch((error) => {
        console.log(error);
        setFailAlert(true);
      });
  };

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 1,
      }}
    />
  );

  const getSearchField = (e) => {
    if (e.target.value === "2") {
      setIsDateSearch(true);
    } else {
      setIsDateSearch(false);
    }
  };

  const handleClickOpenInvoice = () => {
    setOpenInvoice(true);
  };

  const handleCloseInvoice = () => {
    setOpenInvoice(false);
  };

  const createNewInvoice = () => {
    const sender = {
      _name: "minh duc",
      _address: "hue",
      _phone: "091390210",
      _company: "DDD",
      _email: "email@gmail.com",
    };
    const receiver = {
      _name: "binh ngu",
      _address: "qna",
      _phone: "091390210",
      _company: "AAA",
      _email: "email@gmail.com",
    };
    const details = [
      {
        description: "ao",
        quantity: 10,
        unitPrice: 22000,
        price: 220000,
      },
      {
        description: "quan",
        quantity: 10,
        unitPrice: 22000,
        price: 220000,
      },
    ];
    dInvoice.methods
      .uploadInvoice(
        sender,
        receiver,
        "20%",
        "10%",
        "123456",
        JSON.stringify(details)
      )
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log("[HASH NE]", hash);
        setLoading(false);
      });
  };

  const handleUpdateProfile = () => {
    setFailAlert(false);
    updateUser();
  };

  const openUserProfile = () => {
    setOpenProfile(!openProfile);
  };

  const closeUserProfile = () => {
    setOnChange(!onChange);
    setOpenProfile(!openProfile);
  };

  const onDismissFail = () => setFailAlert(!failAlert);

  return (
    <>
      <div>
        <Row>
          <Card>
            <CardHeader style={{ marginLeft: 20 }}>
              <Row>
                <Col>
                  <CardTitle tag="h3" style={{ fontWeight: "bold" }}>
                    Danh sách hóa đơn
                  </CardTitle>
                </Col>
                <Col md="auto">
                  <CardTitle
                    tag="h4"
                    style={{ marginTop: 15, marginRight: -20 }}
                  >
                    {fullName}
                  </CardTitle>
                </Col>
                <Col md="auto">
                  <UncontrolledDropdown style={{ marginRight: 10 }}>
                    <DropdownToggle
                      caret
                      color="default"
                      nav
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="photo">
                        <img
                          height="40"
                          width="40"
                          alt="..."
                          src={require("assets/img/anime3.png").default}
                        />
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-navbar" right tag="ul">
                      <DropdownItem
                        onClick={openUserProfile}
                        className="nav-item"
                      >
                        Thông tin
                      </DropdownItem>
                      <DropdownItem divider tag="li" />
                      <DropdownItem onClick={logout} className="nav-item">
                        Đăng xuất
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Col>
              </Row>
              <Row>
                <Col md="2">
                  <Input
                    //value={searchTerm}
                    type="select"
                    defaultValue={"1"}
                    onChange={(e) => getSearchField(e)}
                  >
                    <option value="1">Mã hóa đơn</option>
                    <option value="2">Ngày giao dịch</option>
                    <option value="3">Người gửi</option>
                    <option value="4">Người nhận</option>
                    <option value="5">Trạng thái</option>
                  </Input>
                </Col>
                <Col md="3" hidden={isDateSearch}>
                  <Input
                    //value={searchTerm}
                    type="text"
                    placeholder="Nội dung tìm kiếm"
                    //onChange={(e) => getSearchTerm(e)}
                  />
                </Col>
                <Col md="3" hidden={!isDateSearch}>
                  <Input
                    //defaultValue={dateOB}
                    type="date"
                    //onChange={e => setDateOB(e.target.value)}
                  />
                </Col>
                <Col md="5" />
                <Col md="2">
                  <Button
                    className="btn-fill"
                    color="primary"
                    type="submit"
                    style={{ marginTop: 0 }}
                    onClick={createNewInvoice}
                  >
                    Hóa đơn mới
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody style={{ margin: 10 }}>
              <table class="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã hóa đơn</th>
                    <th>Ngày tạo</th>
                    <th>Người gửi</th>
                    <th>Người nhận</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr onDoubleClick={handleClickOpenInvoice}>
                    <td>1</td>
                    <td>HD012345</td>
                    <td>22/04/2000</td>
                    <td>Bình đẹp trai</td>
                    <td>Bình đẹp trai</td>
                    <td>1000000 VNĐ</td>
                    <td>Đã thanh toán</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>HD012345</td>
                    <td>22/04/2000</td>
                    <td>Bình đẹp trai</td>
                    <td>Bình đẹp trai</td>
                    <td>1000000 VNĐ</td>
                    <td>Đã thanh toán</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>HD012345</td>
                    <td>22/04/2000</td>
                    <td>Bình đẹp trai</td>
                    <td>Bình đẹp trai</td>
                    <td>1000000 VNĐ</td>
                    <td>Đã thanh toán</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>HD012345</td>
                    <td>22/04/2000</td>
                    <td>Bình đẹp trai</td>
                    <td>Bình đẹp trai</td>
                    <td>1000000 VNĐ</td>
                    <td>Đã thanh toán</td>
                  </tr>
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Row>

        <Modal isOpen={openInvoice} size="lg">
          <ModalHeader style={{ margin: 25, justifyContent: "center" }}>
            <h3 className="title">Hóa đơn</h3>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="3">
                <h4 className="title">Ngày giao dịch:</h4>
              </Col>
              <Col>
                <h5 className="title">22/04/2000</h5>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <h4 className="title">Người gửi:</h4>
              </Col>
              <Col>
                <h5 className="title">Võ Thanh Bình</h5>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <h4 className="title">Người nhận:</h4>
              </Col>
              <Col>
                <h5 className="title">Võ Thanh Bình</h5>
              </Col>
            </Row>
            <ColoredLine color="gray" />
            <Row>
              <Card>
                <CardHeader>
                  <Row>
                    <Col>
                      <CardTitle tag="h4">Chi tiết hóa đơn</CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>STT</th>
                        <th>Thông tin</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>abc</td>
                        <td>50</td>
                        <td>10000 VNĐ</td>
                        <td>5000000 VNĐ</td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>xyz</td>
                        <td>50</td>
                        <td>10000 VNĐ</td>
                        <td>5000000 VNĐ</td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>binh</td>
                        <td>50</td>
                        <td>10000 VNĐ</td>
                        <td>5000000 VNĐ</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Row>
            <ColoredLine color="gray" />
            <Row>
              <Col>
                <h4 className="title">Thành tiền</h4>
              </Col>
              <Col md="auto">
                <h4 className="title">1000000 VNĐ</h4>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter style={{ margin: 25, justifyContent: "flex-end" }}>
            <Button
              onClick={handleCloseInvoice}
              className="btn-fill"
              color="primary"
              type="submit"
              style={{ marginRight: 25 }}
            >
              In hóa đơn
            </Button>
            <Button
              onClick={handleCloseInvoice}
              className="btn-fill"
              color="primary"
              type="submit"
            >
              OK
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={openProfile} size="lg">
          <ModalHeader>
            <p style={{ fontSize: 25 }} className="title">
              Chỉnh sửa hồ sơ
            </p>
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col className="pr-md-1" md="6">
                  <FormGroup>
                    <label>Username</label>
                    <Input
                      value={fullName}
                      placeholder="Username"
                      disabled
                      type="text"
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col className="pl-md-1" md="6">
                  <FormGroup>
                    <label>Số điện thoại</label>
                    <Input
                      value={phoneNumber}
                      placeholder="Số điện thoại"
                      type="number"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="pr-md-1" md="6">
                  <FormGroup>
                    <label>Công ty</label>
                    <Input
                      value={company}
                      placeholder="Công ty"
                      type="text"
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col className="pl-md-1" md="6">
                  <FormGroup>
                    <label htmlFor="exampleInputEmail1">Địa chỉ email</label>
                    <Input
                      value={email}
                      placeholder="Email"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="pl-md-1">
                  <FormGroup style={{ marginLeft: 10 }}>
                    <label>Địa chỉ</label>
                    <Input
                      value={address}
                      placeholder="Địa chỉ thường trú"
                      type="text"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
            <Alert
              className="alert-error"
              color="warning"
              isOpen={failAlert}
              toggle={onDismissFail}
            >
              Cập nhật thông tin thất bại.
            </Alert>
          </ModalBody>
          <ModalFooter style={{ marginRight: 10, justifyContent: "flex-end" }}>
            <Button
              className="btn-fill"
              color="primary"
              type="submit"
              style={{ marginRight: 10 }}
              onClick={closeUserProfile}
            >
              Hủy
            </Button>
            <Button
              className="btn-fill"
              color="primary"
              type="submit"
              onClick={handleUpdateProfile}
            >
              Cập nhật
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}

export default Main;

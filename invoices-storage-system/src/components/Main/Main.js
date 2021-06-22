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
  Input,
  Alert,
  Table,
} from "reactstrap";
import { Tooltip, Fab } from "@material-ui/core";
import { AuthContext } from "../../contexts/AuthProvider";
const axios = require("axios");

function Main() {
  const { logout, userAcc } = useContext(AuthContext);
  const [isDateSearch, setIsDateSearch] = useState(false);

  const [openInvoice, setOpenInvoice] = React.useState(false);
  const [openProfile, setOpenProfile] = React.useState(false);
  const [openNewInvoice, setOpenNewInvoice] = React.useState(false);

  //UserProfile Fields
  const [onChange, setOnChange] = useState(false);
  const [fullName, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [address, setAddress] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [company, setCompany] = useState(null);
  const [failAlert, setFailAlert] = useState(false);

  //Invoice Fields
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverPhoneNumber, setReceiverPhoneNumber] = useState("");
  const [receiverCompany, setReceiverCompany] = useState("");

  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [detailList, setDetailList] = useState([]);
  const [onDetailListChange, setOnDetailListChange] = useState(false);

  const [dInvoice, setDInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [invoices, setInvoices] = useState([]);

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
      // console.log("[INVOICE NE]", invoice);
      // this.setState({ invoice });
      setDInvoice(invoice);

      //console.log("use id", userAcc.userId);
      invoice.methods
        .GetInvoices(userAcc.userId)
        .call()
        .then((result) => {
          const temp = result.map((bill) => {
            return {
              numberId: bill._numberId,
              sender: {
                name: bill._sender._name,
                address: bill._sender._address,
                phone: bill._sender._phone,
                company: bill._sender._company,
                email: bill._sender._email,
              },
              receiver: {
                name: bill._receiver._name,
                address: bill._receiver._address,
                phone: bill._receiver._phone,
                company: bill._receiver._company,
                email: bill._receiver._email,
              },
              discount: bill._discount,
              tax: bill._tax,
              total: bill._total,
              details: JSON.parse(bill._details),
              author: bill._author,
            };
          });
          setInvoices(temp);
          console.log(temp);
        });

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
    if (
      detailList.length < 1 ||
      email === null ||
      fullName === null ||
      address === null ||
      phoneNumber === null ||
      company === null ||
      receiverName === "" ||
      receiverAddress === "" ||
      receiverPhoneNumber === "" ||
      receiverEmail === "" ||
      receiverCompany === ""
    ) {
      console.log("[KO DUOC LUU]");
    } else {
      console.log("[DUOC LUU]");
      const sender = {
        _name: fullName,
        _address: address,
        _phone: phoneNumber,
        _company: company,
        _email: email,
      };
      const receiver = {
        _name: receiverName,
        _address: receiverAddress,
        _phone: receiverPhoneNumber,
        _company: receiverCompany,
        _email: receiverCompany,
      };
      dInvoice.methods
        .uploadInvoice(
          userAcc.userId,
          sender,
          receiver,
          discount.toString(),
          tax.toString(),
          calcInvoicePrice().toString(),
          JSON.stringify(detailList)
        )
        .send({ from: account })
        .on("transactionHash", (hash) => {
          console.log("[HASH NE]", hash);
          setLoading(false);
          handleCloseNewInvoice();
        });
    }
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

  const handleClickOpenNewInvoice = () => {
    setOpenNewInvoice(true);
  };

  const handleCloseNewInvoice = () => {
    setReceiverAddress("");
    setReceiverCompany("");
    setReceiverName("");
    setReceiverPhoneNumber("");
    setReceiverEmail("");
    setDetailList([]);
    setDescription("");
    setQuantity(0);
    setUnitPrice(0);
    setDiscount(0);
    setTax(0);
    setOpenNewInvoice(false);
  };

  const addDetailToTable = () => {
    if (description === "" || Number(quantity) <= 0 || Number(unitPrice) < 0) {
      console.log("[KO DUOC THEM VAO BANG]");
    } else {
      console.log("[DUOC THEM VAO BANG]");
      let tempPrice = Number(quantity) * Number(unitPrice);
      setDetailList([
        ...detailList,
        {
          description: description,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
          price: tempPrice,
        },
      ]);
      setDescription("");
      setQuantity(0);
      setUnitPrice(0);
    }
  };

  const removeDetailFromTable = (index) => {
    detailList.splice(index, 1);
    setOnDetailListChange(!onDetailListChange);
  };

  const calcInvoicePrice = () => {
    if (detailList.length > 0) {
      let total = 0;
      detailList.map((detail) => {
        total += Number(detail.price);
      });
      if (discount !== 0) {
        total *= Number((100 - Number(discount)) / 100);
      }
      if (tax !== 0) {
        total *= Number((100 + Number(tax)) / 100);
      }
      return total.toFixed(2);
    } else {
      return 0;
    }
  };

  useEffect(() => {
    setDetailList(detailList);
  }, [onDetailListChange]);

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
                    onClick={handleClickOpenNewInvoice}
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
            <h3 style={{ fontSize: 25, fontWeight: "bold" }}>Hóa đơn</h3>
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

        <Modal isOpen={openNewInvoice} size="lg">
          <ModalHeader style={{ justifyContent: "center" }}>
            <p style={{ fontSize: 25, fontWeight: "bold" }} className="title">
              Hóa đơn mới
            </p>
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col>
                  <FormGroup>
                    <h4 style={{ fontWeight: "bold" }}>Thông tin người nhận</h4>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="8">
                  <FormGroup>
                    <label>Họ và Tên</label>
                    <Input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <label>Số điện thoại</label>
                    <Input
                      type="number"
                      value={receiverPhoneNumber}
                      onChange={(e) => setReceiverPhoneNumber(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <label>Công ty</label>
                    <Input
                      type="text"
                      value={receiverCompany}
                      onChange={(e) => setReceiverCompany(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="8">
                  <FormGroup>
                    <label>Email</label>
                    <Input
                      type="email"
                      value={receiverEmail}
                      onChange={(e) => setReceiverEmail(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <label>Địa chỉ</label>
                    <Input
                      type="text"
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <ColoredLine color="grey" />
              <Row>
                <Col>
                  <FormGroup>
                    <h4 style={{ fontWeight: "bold" }}>Chi tiết hóa đơn</h4>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col md="5">
                      <label>Chi tiết</label>
                    </Col>
                    <Col md="3">
                      <label>Đơn giá (VNĐ)</label>
                    </Col>
                    <Col md="3">
                      <label>Số lượng</label>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md="5">
                  <FormGroup>
                    <Input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Input
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="1" style={{ alignItems: "flex-end", display: "flex" }}>
                  <Tooltip title="Thêm">
                    <Fab
                      size="small"
                      style={{ marginBottom: 10 }}
                      onClick={addDetailToTable}
                    >
                      <i className="tim-icons icon-simple-add"></i>
                    </Fab>
                  </Tooltip>
                </Col>
              </Row>
              <ColoredLine color="grey" />
              <table class="table">
                <thead className="text-primary">
                  <tr>
                    <th>ID</th>
                    <th>Chi tiết</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {detailList.length < 1 ? (
                    <div hidden="true"></div>
                  ) : (
                    detailList.map((detail, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{detail.description}</td>
                        <td>{detail.unitPrice}</td>
                        <td>{detail.quantity}</td>
                        <td>{detail.price}</td>
                        <Fab
                          size="small"
                          onClick={() => {
                            removeDetailFromTable(index);
                          }}
                        >
                          <i className="tim-icons icon-simple-delete"></i>
                        </Fab>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <ColoredLine color="grey" />
              <Row>
                <Col>
                  <FormGroup>
                    <h4 style={{ fontWeight: "bold" }}>Các khoản khác</h4>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <label>Discount (%)</label>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <label>Tax (%)</label>
                    <Input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <ColoredLine color="grey" />
              <Row>
                <Col>
                  <FormGroup>
                    <h4 style={{ fontWeight: "bold" }}>Tổng cộng</h4>
                  </FormGroup>
                </Col>
                <Row>
                  <Col md="auto" style={{ marginRight: 25 }}>
                    <h3 className="title">{calcInvoicePrice()} VNĐ</h3>
                  </Col>
                </Row>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter style={{ margin: 10, justifyContent: "flex-end" }}>
            <Button
              onClick={handleCloseNewInvoice}
              className="btn-fill"
              color="primary"
              type="submit"
              style={{ marginRight: 20 }}
            >
              Hủy
            </Button>
            <Button
              onClick={createNewInvoice}
              className="btn-fill"
              color="primary"
              type="submit"
            >
              Lưu
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}

export default Main;

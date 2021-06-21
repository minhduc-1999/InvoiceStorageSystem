pragma experimental ABIEncoderV2;
// pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.5.16;

contract Invoices {
  uint public invoiceCount = 0;
  string public name = "Invoices";
  //Create id=>struct mapping
  mapping(uint => Invoice) public invoices;
  //Create Struct
  struct Invoice {
    uint _numberId;
    Person _sender;
    Person _receiver;
    string _discount;
    string _tax;
    string _total;
    // mapping(uint => Detail) _details;
    // uint _detailsSize;
    string _details;
    address _author;
  }

  struct Person {
    string _name;
    string _address;
    string _phone;
    string _company;
    string _email;
  }

  // struct Detail {
  //   string _description;
  //   string _quantity;
  //   string _unitPrice;
  //   string _price;
  // }

  //Create Event
  event InvoiceUploaded (
    uint _numberId,
    Person _sender,
    Person _receiver,
    string _discount,    
    string _tax,
    string _total,
    string _details,
    address _author
  );

  constructor() public {
  }

  // function CheckDetail(Detail memory detail) private pure returns(bool){
  //   if (bytes(detail._description).length <= 0)
  //       return false;
  //   if (bytes(detail._price).length <= 0)
  //       return false;
  //   if (bytes(detail._quantity).length <= 0)
  //       return false;
  //   if (bytes(detail._unitPrice).length <= 0)
  //       return false;
  //   return true;
  // }

  // function CheckDetailList(string memory details) internal pure returns(bool){
  //   if(details.length <= 0)
  //       return false;
  //   // for(uint i = 0; i < details.length; i++)
  //   // {
  //   //     if (!CheckDetail(details[i]))
  //   //         return false;
  //   // }
  //   return true;
  // }

  function CheckPerson(Person memory person) private pure returns(bool){
    if (bytes(person._address).length <= 0)
        return false;
    if (bytes(person._company).length <= 0)
        return false;
    if (bytes(person._email).length <= 0)
        return false;
    if (bytes(person._name).length <= 0)
        return false;
    if (bytes(person._phone).length <= 0)
        return false;
    return true;
  }

  function uploadInvoice(Person memory sender, Person memory receiver, string memory discount,
    string memory tax,
    string memory total,
    string memory details) public {
    // Make sure the sender exists
    require(CheckPerson(sender));
    // Make sure receiver exists
    require(CheckPerson(receiver));
    require(bytes(discount).length > 0);
    require(bytes(tax).length > 0);
    require(bytes(total).length > 0);
    // require(CheckDetailList(details));
    require(bytes(details).length > 0);

    // Make sure uploader address exists
    require(msg.sender != address(0));

    // Increment video id
    invoiceCount++;

    // Add video to the contract
    invoices[invoiceCount] = Invoice(invoiceCount,
     sender,
     receiver,
     discount,
     tax,
     total,
     details, msg.sender);
    // invoices[invoiceCount] = temp;

    // Trigger an event
    emit InvoiceUploaded(invoiceCount,
     sender,
     receiver,
     discount,
     tax,
     total,
     details, msg.sender);
  }
}
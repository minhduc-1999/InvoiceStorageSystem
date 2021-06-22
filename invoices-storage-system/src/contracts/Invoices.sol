pragma experimental ABIEncoderV2;
// pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.5.16;

contract Invoices {
  uint public invoiceCount = 0;
  string public name = "Invoices";
  //Create id=>struct mapping
  // mapping(uint => Invoice) public invoices;
  mapping(uint => Invoice) public invoices;

  mapping(string => uint[]) public ownerShips;


  //Create Struct
  struct Invoice {
    uint _numberId;
    Person _sender;
    Person _receiver;
    string _discount;
    string _tax;
    string _total;
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

  function uploadInvoice(string memory authorId, Person memory sender, Person memory receiver, string memory discount,
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

    require(bytes(authorId).length > 0);

    // Make sure uploader address exists
    require(msg.sender != address(0));

    // Increment video id
    invoiceCount++;

    // Add video to the contract
    invoices[invoiceCount] = (Invoice(invoiceCount,
     sender,
     receiver,
     discount,
     tax,
     total,
     details, msg.sender));

     ownerShips[authorId].push(invoiceCount);
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

  function GetInvoices(string memory id) public view returns(Invoice[] memory) {
    uint size = ownerShips[id].length;
    Invoice[] memory result = new Invoice[](size);
    for(uint i = 0; i< size; i++)
      result[i] = invoices[ownerShips[id][i]];
    return result;
  }
}
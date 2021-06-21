const DInvoice = artifacts.require("Invoices");

module.exports = function (deployer) {
  deployer.deploy(DInvoice);
};

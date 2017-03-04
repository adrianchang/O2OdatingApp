
var MacAddress = {
    getBluetoothMacAddress: function (successCallback, failureCallback) {
        cordova.exec(successCallback, failureCallback, 'MacAddressPlugin', 'getBluetoothMacAddress', []);
    }
};

module.exports = MacAddress;
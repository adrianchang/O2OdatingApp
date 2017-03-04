cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-bluetooth-serial.bluetoothSerial",
        "file": "plugins/cordova-plugin-bluetooth-serial/www/bluetoothSerial.js",
        "pluginId": "cordova-plugin-bluetooth-serial",
        "clobbers": [
            "window.bluetoothSerial"
        ]
    },
    {
        "id": "com-badrit-macaddress.MacAddress",
        "file": "plugins/com-badrit-macaddress/www/MacAddress.js",
        "pluginId": "com-badrit-macaddress",
        "clobbers": [
            "window.MacAddress"
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "org.cordova.bluetoothmacaddress.MacAddress",
        "file": "plugins/org.cordova.bluetoothmacaddress/www/MacAddress.js",
        "pluginId": "org.cordova.bluetoothmacaddress",
        "clobbers": [
            "window.MacAddress"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-plugin-bluetooth-serial": "0.4.6",
    "com-badrit-macaddress": "0.2.0",
    "cordova-plugin-device": "1.1.3",
    "org.cordova.bluetoothmacaddress": "0.1.0"
};
// BOTTOM OF METADATA
});
package org.cordova.bluetoothmacaddress;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.util.Log;

public class MacAddressPlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args,
            CallbackContext callbackContext) {

        if (action.equals("getBluetoothMacAddress")) {

            String macAddress = this.getBluetoothMacAddress();

            if (macAddress != null) {
                JSONObject JSONresult = new JSONObject();
                try {
                    JSONresult.put("mac", macAddress);
                    PluginResult r = new PluginResult(PluginResult.Status.OK, JSONresult);
                    callbackContext.success(macAddress);
                    r.setKeepCallback(true);
                    callbackContext.sendPluginResult(r);
                    return true;
                } catch (JSONException jsonEx) {
                    PluginResult r = new PluginResult(PluginResult.Status.JSON_EXCEPTION);
                    callbackContext.error("error");
                    r.setKeepCallback(true);
                    callbackContext.sendPluginResult(r);
                    return true;
                }
            }
        }
        return false;
    }

    public String getBluetoothMacAddress() {
        // String macAddress = null;

        // macAddress = BluetoothAdapter.getDefaultAdapter().getAddress().toString();

        // Log.v("GetMacBTAddress", macAddress);

        // if (macAddress == null || macAddress.length() == 0) {
        //     macAddress = "00:00:00:00:00:00";
        // }

        // return macAddress;
          Context context = this.cordova.getActivity().getApplicationContext();
          String macAddress = android.provider.Settings.Secure.getString(context.getContentResolver(), "bluetooth_address");
          return macAddress;

    }
}

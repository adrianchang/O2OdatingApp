//
//  MacAddressPlugin.h
//  MacAddressPlugin
//
//

#import <Cordova/CDV.h>

@interface MacAddressPlugin : CDVPlugin

- (void)getBluetoothMacAddress:(CDVInvokedUrlCommand*)command;

@end
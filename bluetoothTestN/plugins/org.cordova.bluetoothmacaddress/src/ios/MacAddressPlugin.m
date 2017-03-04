//
//  MacAddressPlugin.m
//  MacAddressPlugin
//
//

#import "MacAddressPlugin.h"
#include <sys/types.h>
#include <sys/socket.h>
#include <ifaddrs.h>
#include <netdb.h>
#include <net/if_dl.h>
#include <string.h>

#if ! defined(IFT_ETHER)
#define IFT_ETHER 0x6/* Ethernet CSMACD */
#endif

@implementation MacAddressPlugin

- (void)getBluetoothMacAddress:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult* pluginResult = nil;
    
    BOOL                        success;
    struct ifaddrs *            addrs;
    const struct ifaddrs *      cursor;
    const struct sockaddr_dl *  dlAddr;
    const uint8_t *             base;
    NSString                    *macAddressString = NULL;
    
    // We look for interface "en0" on iPhone
    
    success = getifaddrs(&addrs) == 0;
    if (success) {
        cursor = addrs;
        while (cursor != NULL) {
            if ( (cursor->ifa_addr->sa_family == AF_LINK)
                && (((const struct sockaddr_dl *) cursor->ifa_addr)->sdl_type == IFT_ETHER)
                && (strcmp(cursor->ifa_name, "en0") == 0)) {
                dlAddr = (const struct sockaddr_dl *) cursor->ifa_addr;
                base = (const uint8_t *) &dlAddr->sdl_data[dlAddr->sdl_nlen];
                
                if (dlAddr->sdl_alen == 6) {
                    
                    macAddressString = [NSString stringWithFormat:@"%02x:%02x:%02x:%02x:%02x:%02x",
                                                  base[0], base[1], base[2],
                                                  base[3], base[4], base[5]];
                    NSLog(@"Mac Address: %@", macAddressString);
                } else {
                    NSLog(@"ERROR - len is not 6: %@", stderr);
                }
            }
            cursor = cursor->ifa_next;
        }
        freeifaddrs(addrs);
    }
    
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:macAddressString];
    
    
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

@end
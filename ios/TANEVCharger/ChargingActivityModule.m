#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ChargingActivityModule, NSObject)

RCT_EXTERN_METHOD(startActivity:(NSDictionary *)payload)
RCT_EXTERN_METHOD(updateActivity:(NSDictionary *)payload)
RCT_EXTERN_METHOD(endActivity:(NSDictionary *)payload)

@end

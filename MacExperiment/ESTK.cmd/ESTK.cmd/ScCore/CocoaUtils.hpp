#ifndef __ScCore_CocoaUtils__
#define __ScCore_CocoaUtils__

class NSString;

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class String;

class CocoaUtils {
public:

  static String& fromNSString(NSString const*);
  static NSString* toNSString(String const&, bool);

};
  
};

#endif

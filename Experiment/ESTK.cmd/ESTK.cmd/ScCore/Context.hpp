#ifndef __ScCore_Context__
#define __ScCore_Context__

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Context {
private:
  Context();
  ~Context();
public:
  static Context* get();
};
  
};

#endif

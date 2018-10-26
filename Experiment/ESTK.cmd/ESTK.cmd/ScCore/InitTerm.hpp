#ifndef __ScCore_InitTerm__
#define __ScCore_InitTerm__

namespace ScCore {

class InitTerm {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

public:
  static bool isInitialized();
  static void exit();
  static void init();
  static bool isUIEnabled();
  static void atExit(void (*)());
  static void enableUI(bool);
  static bool isMT();
  static void setMT();
  static void setStartupSpec(char const*);
};
  
};

#endif

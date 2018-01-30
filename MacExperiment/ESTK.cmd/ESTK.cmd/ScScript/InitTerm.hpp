#ifndef __ScScript_InitTerm__
#define __ScScript_InitTerm__

namespace ScScript {

 //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class InitTerm {
public:
  static bool isInitialized();
  static void exit();
  static void init();
  static void atExit(void (*)());
};

};

#endif


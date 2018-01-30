#ifndef __ScScript_Script__
#define __ScScript_Script__

namespace ScScript {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Script {

private:
	
  ~Script();

public:

  static bool isValidLine(Script const&, int);

};
  
};

#endif

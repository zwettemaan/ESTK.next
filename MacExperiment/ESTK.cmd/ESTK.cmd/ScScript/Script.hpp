#ifndef __ScScript_Script__
#define __ScScript_Script__

#include "../ScCore/Root.hpp"

namespace ScScript {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Script: ScCore::Root {

private:
	
public:

  static bool isValidLine(Script const&, int);
  virtual ~Script();

};
  
};

#endif

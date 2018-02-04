#ifndef __ScScript_ESContext__
#define __ScScript_ESContext__

#include "../ScCore/Context.hpp"

namespace ScScript {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class ESContext: public ScCore::Context {
private:
	ESContext();
	~ESContext();
public:
	static ESContext* get();
};
  
};

#endif

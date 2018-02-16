#ifndef __ScCore_Callbacks__
#define __ScCore_Callbacks__

#include "Root.hpp"

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Callbacks: Root {
public:
  Callbacks();
  virtual ~Callbacks();
	static Callbacks* get();
	static void set(Callbacks*);
};
  
};

#endif

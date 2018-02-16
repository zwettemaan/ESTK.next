#ifndef __ScScript_ScopeNode__
#define __ScScript_ScopeNode__

#include "../ScCore/Root.hpp"
#include "../ScCore/String.hpp"

#include "Node.hpp"

namespace ScScript {

class ScanInfo;

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class ScopeNode: public Node {
private:
	ScopeNode(ScanInfo const&);
	virtual ~ScopeNode();
public:
	virtual bool dump(ScScript::Engine&, int);
	virtual ScopeNode& toScopeNode() const;
	virtual ScCore::String* toString() const;
};
  
};

#endif

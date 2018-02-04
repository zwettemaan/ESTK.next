#ifndef __ScScript_ParserAPI__
#define __ScScript_ParserAPI__

#include "../ScCore/String.hpp"

class Engine;
class ScopeNode;
class Script;

namespace ScScript {

 //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class ParserAPI {
public:

  ParserAPI(Engine&);
  
  Script* decompile(ScopeNode const&) const;
  void enablePreProcessor(bool);
  ScCore::String* getIncludePath() const;
  Script* parse(ScCore::String const&) const;
  void setIncludePath(ScCore::String const&) const;
};

};

#endif


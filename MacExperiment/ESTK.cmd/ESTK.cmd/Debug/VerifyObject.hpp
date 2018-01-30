#ifndef VerifyObject_hpp
#define VerifyObject_hpp

#include "../ScCore/String.hpp"
#include "../ScScript/BreakpointInfo.hpp"
#include "../ScScript/Engine.hpp"
#include "../ScScript/Node.hpp"
#include "../ScScript/ParserAPI.hpp"
#include "../ScScript/Script.hpp"
#include "../ScScript/ScriptContainer.hpp"

#include <string>

namespace  ESTK_N {

  std::string VerifyObject_(ScCore::String& s);
  std::string VerifyObject_(ScScript::BreakpointInfo& in_b);
  std::string VerifyObject_(ScScript::ParserAPI& in_p);
  std::string VerifyObject_(ScScript::Engine& in_e);
  std::string VerifyObject_(ScScript::Script& in_s);
  std::string VerifyObject_(ScScript::ScriptContainer& in_s);
  std::string VerifyObject_(ScScript::Node& in_n);

  template<typename T>
  std::string VerifyObject(T& in_t) {
    return VerifyObject_(in_t);
  }
  
}

#endif /* VerifyObject_hpp */

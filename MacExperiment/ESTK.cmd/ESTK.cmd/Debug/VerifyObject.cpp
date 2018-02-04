#include "VerifyObject.hpp"

#include <string>
#include <iosfwd>
#include <ios>
#include <iomanip>
#include <sstream>

#include "../ESTK_N/CocoaUtilsWrapper.hpp"

namespace ESTK_N {

std::string VerifyObject_(ScCore::String& in_s) {
  std::string temp;
  scCoreString_to_utf8string(temp, in_s, false);
  return temp;
}

std::string VerifyObject_(ScScript::BreakpointInfo& in_b) {
  std::string temp;
  return temp;
}

std::string VerifyObject_(ScScript::ParserAPI& in_p) {
  std::auto_ptr<ScCore::String> p(in_p.getIncludePath());
  std::string temp;
  scCoreString_to_utf8string(temp, *p, false);
  return temp;
}

std::string VerifyObject_(ScScript::Script& in_s) {
  bool b = ScScript::Script::isValidLine(in_s, 0);
  return std::string(b ? "isValidLine0" : "notIsValidLine0");
}

std::string VerifyObject_(ScScript::Engine& in_e) {
  int version = in_e.getVersion();
  
  std::string name;
  scCoreString_to_utf8string(name, *in_e.getName(), false);
  
  std::stringstream stream;
  stream << std::hex << version;
  std::string hexVersion( stream.str() );
  
  name = "'" + name + "' (" + hexVersion + ")";
  
  return name;
}

std::string VerifyObject_(ScScript::Node& in_n) {
  std::auto_ptr<ScCore::String> s(in_n.toString());
  std::string temp;
  if (s.get() != nullptr) {
    scCoreString_to_utf8string(temp, *s, false);
  }
  return temp;
}


std::string VerifyObject_(ScScript::ScriptContainer& in_b) {
  std::auto_ptr<ScScript::Script> s(in_b.getScript(0));
  bool b = in_b.isContinueOnError();
  size_t l = in_b.length();
  std::string temp;
  return temp;
}


}

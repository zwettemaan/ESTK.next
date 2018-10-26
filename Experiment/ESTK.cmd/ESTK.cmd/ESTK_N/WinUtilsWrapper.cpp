#include "CocoaUtilsWrapper.hpp"

#include "Utils.hpp"
#include "Logger.hpp"
#include <string>

namespace ESTK_N {
  
void utf8string_to_ScCoreString(ScCore::String& out_scCoreString, const char* in_string) {

  do {

  }
  while (false);
  
}

void utf8string_to_ScCoreString(ScCore::String& out_scCoreString, const std::string& in_string) {

  return utf8string_to_ScCoreString(out_scCoreString, in_string.c_str());
  
}

void u16string_to_ScCoreString(ScCore::String& out_scCoreString, const std::u16string& in_u16string) {

 do {
  }
  while (false);

}

void scCoreString_to_u16string(std::u16string& out_u16string, const ScCore::String& in_scCoreString, bool dontKnowYet) {

  do {

  }
  while (false);

}

void scCoreString_to_utf8string(std::string& out_string, const ScCore::String& in_scCoreString, bool dontKnowYet) {

  std::u16string temp;
  scCoreString_to_u16string(temp, in_scCoreString, dontKnowYet);
  out_string = u16string_to_utf8(temp);
  
}


}


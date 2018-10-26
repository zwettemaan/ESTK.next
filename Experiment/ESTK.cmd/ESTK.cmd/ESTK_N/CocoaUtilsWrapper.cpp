#include "CocoaUtilsWrapper.hpp"

#include "../ScCore/CocoaUtils.hpp"
#include "Utils.hpp"
#include "Logger.hpp"
#include <string>

/*
  extern size_t       nsString_length(PtrImmutable in_nsString);
  extern void         nsString_release(PtrImmutable in_nsString);
  extern void         nsString_to_UTF16(PtrImmutable in_nsString, PtrImmutable io_buffer, size_t in_bufSize);
  extern PtrImmutable utf8_to_NSString(char* in_s);
  extern PtrImmutable utf16_to_NSString(PtrImmutable in_sUTF16, size_t in_length);
*/
namespace ESTK_N {
  
void utf8string_to_ScCoreString(ScCore::String& out_scCoreString, const char* in_string) {

  do {

    const NSString* nsString = utf8_to_NSString(in_string);
    if (nsString == nullptr) {
      Logger::error("utf8string_to_ScCoreString: utf8_to_NSString returns nullptr");
      break;
    }
    
    out_scCoreString = *ScCore::CocoaUtils::fromNSString(nsString);

  }
  while (false);
  
}

void utf8string_to_ScCoreString(ScCore::String& out_scCoreString, const std::string& in_string) {

  return utf8string_to_ScCoreString(out_scCoreString, in_string.c_str());
  
}

void u16string_to_ScCoreString(ScCore::String& out_scCoreString, const std::u16string& in_u16string) {

 do {

    const NSString* temp = utf16_to_NSString((unichar*) in_u16string.c_str(), in_u16string.length());
    if (temp == nullptr) {
      Logger::error("u16string_to_ScCoreString: utf16_to_NSString returns nullptr");
      break;
    }
   
    std::auto_ptr<ScCore::String> out_scCoreString(ScCore::CocoaUtils::fromNSString(temp));
   
    nsString_release(temp);
  }
  while (false);

}

void scCoreString_to_u16string(std::u16string& out_u16string, const ScCore::String& in_scCoreString, bool dontKnowYet) {

  do {

    const NSString* temp = ScCore::CocoaUtils::toNSString(in_scCoreString, dontKnowYet);
    const size_t length = nsString_length(temp);
   
    out_u16string.resize(length);
    nsString_to_UTF16(temp, (unichar*) out_u16string.c_str(), length);
   
    nsString_release(temp);
  }
  while (false);

}

void scCoreString_to_utf8string(std::string& out_string, const ScCore::String& in_scCoreString, bool dontKnowYet) {

  std::u16string temp;
  scCoreString_to_u16string(temp, in_scCoreString, dontKnowYet);
  out_string = u16string_to_utf8(temp);
  
}


}


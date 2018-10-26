#ifndef CocoaUtilsWrapper_hpp
#define CocoaUtilsWrapper_hpp

#include <stddef.h>

#ifdef __cplusplus

#include <string>
#include "../ScCore/String.hpp"
class NSString;

//
// Functions defined in CocoaUtilsWrapper.cpp
//
namespace ESTK_N {
extern void         utf8string_to_ScCoreString(ScCore::String& out_scCoreString, const char* in_string);
extern void         utf8string_to_ScCoreString(ScCore::String& out_scCoreString, const std::string& in_string);
extern void         u16string_to_ScCoreString(ScCore::String& out_scCoreString, const std::u16string& in_u16string);
extern void         scCoreString_to_u16string(std::u16string& out_u16string, const ScCore::String& in_scCoreString, bool dontKnowYet);
extern void         scCoreString_to_utf8string(std::string& out_string, const ScCore::String& in_scCoreString, bool dontKnowYet);
}

typedef char16_t unichar;

extern "C" {
#endif

//
// Functions defined in CocoaUtilsWrapper.m
//
  extern size_t          nsString_length(const NSString* in_nsString);
  extern void            nsString_release(const NSString* in_nsString);
  extern void            nsString_to_UTF16(const NSString* in_nsString, unichar* io_buffer, size_t in_bufSize);
  extern const NSString* utf8_to_NSString(const char* in_s);
  extern const NSString* utf16_to_NSString(const unichar* in_sUTF16, size_t in_length);

#ifdef __cplusplus
}
#endif

#endif /* CocoaUtilsWrapper_hpp */

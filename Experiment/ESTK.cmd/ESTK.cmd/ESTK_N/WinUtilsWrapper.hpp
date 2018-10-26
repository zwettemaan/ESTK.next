#ifndef WinUtilsWrapper_hpp
#define WinUtilsWrapper_hpp

#include <stddef.h>

#include <string>
#include "../ScCore/String.hpp"

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

#endif /* WinUtilsWrapper_hpp */

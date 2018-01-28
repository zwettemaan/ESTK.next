#include "Utils.hpp"

#include <string>
#include <locale>
#include <codecvt>

namespace ESTK_N {

std::u16string utf8_to_u16string(const std::string& str)
{
  const std::u16string u16_conv = std::wstring_convert<
        std::codecvt_utf8_utf16<char16_t>, char16_t>{}.from_bytes(str);
  return u16_conv;
}

std::string u16string_to_utf8(const std::u16string& str)
{
  const std::string u8_conv = std::wstring_convert<
        std::codecvt_utf8_utf16<char16_t>, char16_t>{}.to_bytes(str);
  return u8_conv;
}

}


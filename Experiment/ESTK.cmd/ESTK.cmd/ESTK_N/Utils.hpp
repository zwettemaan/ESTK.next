#ifndef __ESTK_N_Utils__
#define __ESTK_N_Utils__

#include <string>

namespace ESTK_N {

extern std::u16string utf8_to_u16string(const std::string& str);
extern std::string u16string_to_utf8(const std::u16string& str);

}
#endif

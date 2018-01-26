#include "Utils.hpp"

namespace ESTK_N {

std::u16string stringTou16string(const std::string& in_s)
{
  std::u16string temp(in_s.length(),' ');
  std::copy(in_s.begin(), in_s.end(), temp.begin());
  return temp;
}

}


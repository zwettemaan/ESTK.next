#include "Tests_All.hpp"

#include "Test_memchr16.hpp"

namespace ESTK_N {

bool test_all() {

  bool retVal = true;
  
  retVal = test_memchr16() || retVal;
  
  return retVal;
  
}

}

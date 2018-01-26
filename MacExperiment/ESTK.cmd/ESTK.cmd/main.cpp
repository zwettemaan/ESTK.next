#include <iostream>

#include "ScCore/InitTerm.hpp"
#include "ScScript/InitTerm.hpp"

void exitFunc() {
  std::cout << "Goodbye, World!\n";
}

int main(int argc, const char * argv[]) {
  // insert code here...
  
  ScCore::InitTerm::init();
  ScCore::InitTerm::atExit(exitFunc);
  
  ScScript::InitTerm::init();
  ScScript::InitTerm::atExit(exitFunc);
  
  std::cout << "Hello, World!\n";
  
  ScScript::InitTerm::exit();
  ScCore::InitTerm::exit();
  
  return 0;
}

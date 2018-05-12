//
// ExtendScript Recompiler
//
//
// This script will read an existing .jsx file and add instrumentation code to it
//
// This instrumentation code allows debugging and inspecting of the script
//
#include "logging.jsx"
#include "compiler.jsx"

$.writeln(_ESNX_.compiler.compileFile(new File("/Users/kris/Documents/Controlled/Rorohiko/ESTK.next/ExtendScriptRecompiler/compiler.jsx")));

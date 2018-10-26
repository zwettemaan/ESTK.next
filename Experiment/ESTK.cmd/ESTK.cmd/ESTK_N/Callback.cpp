#include "Callback.hpp"

#include "../ScCore/Error.hpp"

#include "../ScScript/Callback.hpp"
#include "../ScScript/Engine.hpp"

#include "Logger.hpp"

namespace ESTK_N {

void Callback::engineNotify(ScScript::Engine& engine, int i1, long l1) {
  Logger::note("engineNotify");
}

void Callback::enterDebugMode(ScScript::Engine& engine) {
  Logger::note("enterDebugMode");
}

void Callback::garbageCollecting(ScScript::Engine& engine) {
  Logger::note("garbageCollecting");
}

void* Callback::getClassObject(ScScript::Engine& engine, ScCore::String const& s1, unsigned int& i1) {
  Logger::note("getClassObject");
  return nullptr;
}

bool Callback::isValidClassName(ScScript::Engine& engine, ScCore::String const& s1) {
  Logger::note("isValidClassName");
  return false;
}

void Callback::leaveDebugMode(ScScript::Engine& engine, bool b) {
  Logger::note("leaveDebugMode");
}

void Callback::running(ScScript::Engine& engine) {
  Logger::note("running");
}

void Callback::runtimeError(ScScript::Engine& engine) {
  Logger::note("runtimeError");
}

void Callback::undefinedError(ScScript::Engine& engine, ScCore::Variant const& v1, ScCore::Variant const& v2, ScCore::Variant& v3) {
  Logger::note("runtimeError");
}

}

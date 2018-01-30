#include "Callback.hpp"

#include "../ScCore/Error.hpp"

#include "../ScScript/Callback.hpp"
#include "../ScScript/Engine.hpp"

namespace ESTK_N {

void Callback::engineNotify(ScScript::Engine& engine, int i1, long l1) {
  if (fOldCallback) {
    fOldCallback->engineNotify(engine, i1, l1);
  }
}

void Callback::enterDebugMode(ScScript::Engine& engine) {
  if (fOldCallback) {
    fOldCallback->enterDebugMode(engine);
  }
}

bool Callback::garbageCollecting(ScScript::Engine& engine) {
  if (fOldCallback) {
    return fOldCallback->garbageCollecting(engine);
  }
  else {
    return false;
  }
}

void* Callback::getClassObject(ScScript::Engine& engine, ScCore::String const& s1, unsigned int& i1) {
  if (fOldCallback) {
    return fOldCallback->getClassObject(engine, s1, i1);
  }
  else {
    return nullptr;
  }
}

bool Callback::isValidClassName(ScScript::Engine& engine, ScCore::String const& s1) {
  if (fOldCallback) {
    return fOldCallback->isValidClassName(engine, s1);
  }
  else {
    return false;
  }
}

void Callback::leaveDebugMode(ScScript::Engine& engine, bool b) {
  if (fOldCallback) {
    fOldCallback->leaveDebugMode(engine, b);
  }
}

bool Callback::running(ScScript::Engine& engine) {
  if (fOldCallback) {
    return fOldCallback->running(engine);
  }
  else {
    return false;
  }
}

ScCore::Error Callback::runtimeError(ScScript::Engine& engine) {
  if (fOldCallback) {
    return fOldCallback->runtimeError(engine);
  }
  else {
    ScCore::Error e;
    return e;
  }
}

ScCore::Error Callback::undefinedError(ScScript::Engine& engine, ScCore::Variant const& v1, ScCore::Variant const& v2, ScCore::Variant& v3) {
  if (fOldCallback) {
    return fOldCallback->undefinedError(engine, v1, v2, v3);
  }
  else {
    ScCore::Error e;
    return e;
  }
}

}

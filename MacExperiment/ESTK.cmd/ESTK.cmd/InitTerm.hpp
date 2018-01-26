#ifdef __ScScript_InitTerm__
#define __ScScript_InitTerm__

  namespace ScScript {
    class InitTerm {
    public:
      static bool isInitialized();
      static void exit();
      static void init();
      static void atExit(void (*)());
    };
  }

#endif


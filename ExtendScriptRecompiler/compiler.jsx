//
// Compiler/parser for ExtendScript
//
// By Kris Coppieters, kris@rorohiko.com
//

#include "compilerConst.jsx"

if (typeof _ESNX_ == "undefined") {
    _ESNX_ = {};
}

(function(){

_ESNX_.compiler = {};

var template = function() {

    var retVal = undefined;

    do {
        try {
            LOG_ERROR("template function - don't use");
        }
        catch (err) {
            LOG_ERROR("template: throws " + err)
        }
    }
    while (false);
}
_ESNX_.compiler.template = template;

function addCharToScriptCharsQueue(scriptContext, rawChr, lineNumber) {

    if (" \t".indexOf(rawChr) >= 0) {
        if (scriptContext.bufferedWhiteSpace.length == 0) {
            scriptContext.bufferedWhiteSpace = " ";
        }
    }
    else if ("\n\r".indexOf(rawChr) >= 0) {
        scriptContext.bufferedWhiteSpace = "\n";
    }
    else {
        if (scriptContext.bufferedWhiteSpace.length > 0) {
            scriptContext.scriptCharsQueue += scriptContext.bufferedWhiteSpace;
            scriptContext.scriptCharsLineNumber.push(lineNumber);
            scriptContext.bufferedWhiteSpace = "";
        }
        scriptContext.scriptCharsQueue += rawChr;
        scriptContext.scriptCharsLineNumber.push(lineNumber);
    }

}

function addToScriptCharsQueue(scriptContext, chars, lineNumber) {
    for (var idx = 0; idx < chars.length; idx++) {
        addCharToScriptCharsQueue(scriptContext, chars.charAt(idx), lineNumber);
    }
}

function addToTokenList(parserContext, scriptContext, token) {
    parserContext.tokenQueue.push(token);
    parserContext.tokenList.push(token);
    scriptContext.lastTokenType = token.tokenType;
}

var compileFile = function(in_file) {

    var retVal = "";

    do {
        try {
            if (! in_file) {
                LOG_ERROR("compileFile: need in_file");
                break;
            }

            if (! in_file.exists) {
                LOG_ERROR("compileFile: in_file does not exist");
                break;
            }

            in_file.open("r");
            var scriptText = in_file.read();
            in_file.close();

            retVal = compileScript(scriptText);
        }
        catch (err) {
            LOG_ERROR("compileFile: throws " + err)
        }
    }
    while (false);

    return retVal;
}
_ESNX_.compiler.compileFile = compileFile;

var compileScript = function(in_scriptText) {

    var retVal = "";

    do {
        try {

            var textState = {
                commentState: kCommentStateIdle,
                scriptText: in_scriptText,
                scriptLength: in_scriptText.length,
                charPos: 0,
                literalString: "",
                literalStringLineNumber: 0,
                lineNumber: 1,
                seenCrLineEnd: false,
                prvNonWhiteRawChr: "",
                nonWhiteCharOnLineCount: false
            };

            var scriptContext = {
                scriptState: kScriptStateIdle,
                scriptCharsQueue: "",
                scriptCharsLineNumber: [],
                bufferedWhiteSpace: "",
                lastTokenType: kTokenNone,
                scriptCharsQueuePos: 0,
                stringConst: "",
                keyword: "",
                numberStr: "",
                regExp: "",
                preprocessorString: "",
                prvNonWhiteScriptChr: "",
                prvLineNumber: 0,
                tokenLineNumber: 0,
                scriptChr: "",
                codeChar: ""
            };

            var parserContext = {
                parserState: kParserStateIdle,
                tokenQueue: [],
                tokenList: []
            };
        
            while (textState.commentState != kCommentStateEOF || scriptContext.scriptCharsQueue.length > 0 || parserContext.tokenQueue.length > 0) {
                processRawScriptChar(scriptContext, textState);
                processFilteredScriptChar(parserContext, scriptContext);
                processToken(parserContext);
            }
        }
        catch (err) {
            LOG_ERROR("compileScript: throws " + err)
        }
    }
    while (false);

    return tokenListToString(parserContext.tokenList);
}
_ESNX_.compiler.compileScript = compileScript;

var escapeStr = function(s) {
    var retVal = "";
    for (var charPos = 0; charPos < s.length; charPos++) {
        var c = s.charAt(charPos);
        if (c == '"') {
            retVal += '\\"';
        }
        else if (c == '\\') {
            retVal += '\\\\';
        }    
        else if (c == '\n') {
            retVal += '\\n';
        }    
        else if (c == '\r') {
            retVal += '\\r';
        } 
        else if (c == '\t') {
            retVal += '\\t';
        } 
        else if (c < ' ' || c == '\x7F') {
            retVal += "\\x" + hexIntToStr(c.charCodeAt(0), 2);
        }
        else if (c > '\x7f') {
            retVal += "\\u" + hexIntToStr(c.charCodeAt(0), 4);
        }
        else {
            retVal += c;
        }
    }

    return retVal;
}
_ESNX_.compiler.escapeStr = escapeStr;

var hexIntToStr = function(i, len) {
    var retVal = "";
    while (len > 0) {
        var nib = i & 0x0F;
        if (nib < 10) {
            retVal = String.fromCharCode(48 + nib) + retVal;
        }
        else {
            retVal = String.fromCharCode(65 + nib - 10) + retVal;
        }
        i = i >> 4;
        len--;
    }    

    return retVal;
}

_ESNX_.compiler.hexIntToStr = hexIntToStr;

function processFilteredScriptChar(parserContext, scriptContext) {

    do {

        if (scriptContext.scriptCharsQueuePos >= scriptContext.scriptCharsQueue.length) {
            
            if (scriptContext.scriptCharsQueuePos) {
                scriptContext.scriptCharsQueue = "";
                scriptContext.scriptCharsLineNumber = [];
                scriptContext.scriptCharsQueuePos = 0;
            }
            break;
        }

        var scriptChr = scriptContext.scriptCharsQueue.charAt(scriptContext.scriptCharsQueuePos);
        var lineNumber = scriptContext.scriptCharsLineNumber[scriptContext.scriptCharsQueuePos];
        
        scriptContext.scriptCharsQueuePos++;
        switch (scriptContext.scriptState) {
            default:
                LOG_ERROR("processFilteredScriptChar: unexpected scriptContext.scriptState");
                break;
            case kScriptStateIdle:
                if (scriptChr <= ' ') {
                    // do nothing
                }
                else if (scriptChr == '#' && scriptContext.prvLineNumber != lineNumber) {
                    scriptContext.preprocessorString = scriptChr;
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStatePreprocessor;
                }
                else if (scriptChr == '"') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateDoubleQuote;
                }
                else if (scriptChr == "'") {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateSingleQuote;
                }
                else if (scriptChr == ';') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenSemicolon,
                        lineNumber: lineNumber,
                        token: ';'
                    });
                }
                else if (scriptChr == ':') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenColon,
                        lineNumber: lineNumber,
                        token: ':'
                    });
                }
                else if (scriptChr == '{') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenOpenBrace,
                        lineNumber: lineNumber,
                        token: '{'
                    });
                }
                else if (scriptChr == '}') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenCloseBrace,
                        lineNumber: lineNumber,
                        token: '}'
                    });
                }
                else if (scriptChr == '[') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenOpenBracket,
                        lineNumber: lineNumber,
                        token: '['
                    });
                }
                else if (scriptChr == ']') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenCloseBracket,
                        lineNumber: lineNumber,
                        token: ']'
                    });
                }
                else if (scriptChr == '(') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenOpenParens,
                        lineNumber: lineNumber,
                        token: '('
                    });
                }
                else if (scriptChr == ')') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenCloseParens,
                        lineNumber: lineNumber,
                        token: ')'
                    });
                }
                else if (scriptChr == ',') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenComma,
                        lineNumber: lineNumber,
                        token: ','
                    });
                }
                else if (scriptChr == '?') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenQuestionMark,
                        lineNumber: lineNumber,
                        token: '?'
                    });
                }
                else if (scriptChr == '0') {
                    scriptContext.numberStr = "0";
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateZero;
                }
                else if (scriptChr >= '1' && scriptChr <= '9') {
                    scriptContext.numberStr = scriptChr;
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateNumerical;
                }
                else if (scriptChr == '.') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStatePeriod;
                }
                else if (scriptChr == '+') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStatePlus;
                }
                else if (scriptChr == '-') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateMinus;
                }
                else if (scriptChr == '&') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateAnd;
                }
                else if (scriptChr == '^') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateXor;
                }
                else if (scriptChr == '|') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateOr;
                }
                else if (scriptChr == '*') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateTimes;
                }
                else if (scriptChr == '=') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateEquals;
                }
                else if (scriptChr == '<') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateLess;
                }
                else if (scriptChr == '>') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.scriptState = kScriptStateGreater;
                }
                else if (scriptChr == '/') {
                    scriptContext.tokenLineNumber = lineNumber;
                    if 
                    (
                        (scriptContext.prvNonWhiteScriptChr >= 'a' && scriptContext.prvNonWhiteScriptChr <= 'z')
                        ||
                        (scriptContext.prvNonWhiteScriptChr >= '0' && scriptContext.prvNonWhiteScriptChr <= '9')
                        ||
                        scriptContext.prvNonWhiteScriptChr == '.'
                        ||
                        scriptContext.prvNonWhiteScriptChr == '$'
                        ||
                        scriptContext.prvNonWhiteScriptChr == '_'
                        ||
                        scriptContext.prvNonWhiteScriptChr == ')'
                    ) {
                        scriptContext.scriptState = kScriptStateDivide;
                    }
                    else {
                        scriptContext.regExp = scriptChr;
                        scriptContext.scriptState = kScriptStateRegExp;
                    }
                }
                else if (scriptChr > ' ') {
                    scriptContext.tokenLineNumber = lineNumber;
                    scriptContext.keyword = scriptChr;
                    scriptContext.scriptState = kScriptStateKeyword;
                }                           
                break;
            case kScriptStatePreprocessor:
                if (scriptChr < ' ') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenPreprocessor,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.preprocessorString
                    });
                    scriptContext.preprocessorString = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else {
                    scriptContext.preprocessorString += scriptChr;
                }
                break;
            case kScriptStateGreater:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenGreaterOrEqual,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '>='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else if (scriptChr == '>') {
                    scriptContext.scriptState = kScriptStateDoubleGreater;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenGreater,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '>'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateDoubleGreater:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitShiftRightInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '>>='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitShiftRight,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '>>'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateLess:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenLessOrEqual,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '<='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else if (scriptChr == '<') {
                    scriptContext.scriptState = kScriptStateDoubleLess;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenLess,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '<'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateDoubleLess:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitShiftLeftInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '<<='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitShiftLeft,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '<<'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateEquals:
                if (scriptChr == '=') {
                    scriptContext.scriptState = kScriptStateDoubleEquals;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenAssign,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateDoubleEquals:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenIdentical,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '==='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenEqual,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '=='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateRegExp:
                if (scriptChr == '/') {
                    scriptContext.regExp += scriptChr;
                    scriptContext.scriptState = kScriptStateAfterRegExp;
                }
                else {
                    scriptContext.regExp += scriptChr;
                    if (scriptChr == '\\') {
                        scriptContext.scriptState = kScriptStateRegExpBackslash;
                    }
                }
                break;
            case kScriptStateRegExpBackslash: 
                scriptContext.regExp += scriptChr;
                scriptContext.scriptState = kScriptStateRegExp;
                break;
            case kScriptStateAfterRegExp:
                if (scriptChr >= 'a' && scriptChr <= 'z') {
                    scriptContext.regExp += scriptChr;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenRegExp,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.regExp
                    });
                    scriptContext.regExp = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStatePeriod:
                if (scriptContext.lastTokenType == kTokenKeyword) {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenPeriod,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '.',
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else if 
                  (
                      (scriptChr >= '0' && scriptChr <= '9') 
                      || 
                      scriptChr == 'e' 
                      || 
                      scriptChr == 'E'
                  ) {
                    scriptContext.numberStr += '.' + scriptChr;
                    scriptContext.scriptState = kScriptStateNumerical;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenPeriod,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '.'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStatePlus:
                if (scriptChr == '+') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenIncrement,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '++'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenAddInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '+='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else if (scriptChr >= '0' && scriptChr >= '9') {
                    scriptContext.numberStr += '+' + scriptChr;
                    scriptContext.scriptState = kScriptStateNumerical;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenAdd,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '+'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateAnd:
                if (scriptChr == '&') {
                    scriptContext.scriptState = kScriptStateDoubleAnd;
                }
                else if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitAndInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '&='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitAnd,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '&'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateDoubleAnd:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenAndInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '&&='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenAnd,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '&&'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateOr:
                if (scriptChr == '|') {
                    scriptContext.scriptState = kScriptStateDoubleOr;
                }
                else if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitOrInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '|='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitOr,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '|'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateDoubleOr:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenOrInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '||='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenOr,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '||'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateXor:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitXorInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '^='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenBitXor,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '^'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateTimes:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenMultiplyInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '*='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenMultiply,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '*'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateDivide:
                if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenDivideInTo,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '/='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenDivide,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '/'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateMinus:
                if (scriptChr == '-') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenDecrement,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '--'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else if (scriptChr == '=') {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenSubtractInto,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '-='
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else if (scriptChr >= '0' && scriptChr >= '9') {
                    scriptContext.numberStr += '-' + scriptChr;
                    scriptContext.scriptState = kScriptStateNumerical;
                }
                else 
                {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenSubtract,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: '-'
                    });
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateZero:
                if 
                  (
                    scriptChr == 'x' 
                    ||
                    scriptChr == 'X'
                  ) {
                    scriptContext.numberStr += scriptChr;
                    scriptContext.scriptState = kScriptStateHexNumber;
                }
                else if (scriptChr >= '0' && scriptChr <= '9') {
                    scriptContext.numberStr += scriptChr;
                    scriptContext.scriptState = kScriptStateNumerical;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenNumber,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.numberStr
                    });
                    scriptContext.numberStr = "";
                    scriptContext.scriptState = kScriptStateIdle;                                
                }
                break;
            case kScriptStateHexNumber:
                if 
                  (
                      (scriptChr >= '0' && scriptChr <= '9') 
                      || 
                      (scriptChr >= 'a' && scriptChr <= 'f') 
                      || 
                      (scriptChr >= 'A' && scriptChr <= 'F')
                  ) {
                    scriptContext.numberStr += scriptChr;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenNumber,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.numberStr
                    });                             
                    scriptContext.numberStr = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateNumericalExponentNumber:
                if (scriptChr >= '0' && scriptChr <= '9') {
                    scriptContext.numberStr += scriptChr;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenNumber,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.numberStr
                    });
                    scriptContext.numberStr = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateNumericalExponent:
                if (scriptChr >= '-' && scriptChr <= '+') {
                    scriptContext.numberStr += scriptChr;
                    scriptContext.scriptState = kScriptStateNumericalExponentNumber;
                }
                else if (scriptChr >= '0' && scriptChr <= '9') {
                    scriptContext.numberStr += scriptChr;
                    scriptContext.scriptState = kScriptStateNumericalExponentNumber;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenNumber,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.numberStr
                    });
                    scriptContext.numberStr = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateNumericalMantisse:
                if (scriptChr >= '0' && scriptChr <= '9') {
                    scriptContext.numberStr += scriptChr;
                }
                else if (scriptChr == 'e' || scriptChr == 'E') {
                    scriptContext.numberStr += scriptChr;
                    scriptContext.scriptState = kScriptStateNumericalExponent;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenNumber,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.numberStr
                    });
                    scriptContext.numberStr = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateNumerical:
                if (scriptChr >= '0' && scriptChr <= '9') {
                    scriptContext.numberStr += scriptChr;
                }
                else if (scriptChr == '.') {
                    scriptContext.numberStr += scriptChr;
                    scriptContext.scriptState = kScriptStateNumericalMantisse;
                }
                else if (scriptChr == 'e' || scriptChr == 'E') {
                    scriptContext.numberStr += scriptChr;
                    scriptContext.scriptState = kScriptStateNumericalExponent;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenNumber,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.numberStr
                    });
                    scriptContext.numberStr = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateKeyword:
                if 
                  (
                      (scriptChr >= 'a' && scriptChr <= 'z') 
                      || 
                      (scriptChr >= 'A' && scriptChr <= 'Z') 
                      || 
                      (scriptChr >= '0' && scriptChr <= '9') 
                      || scriptChr == '$' 
                      || scriptChr == '_'
                  ) {
                    scriptContext.keyword += scriptChr;
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenKeyword,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.keyword
                    });
                    scriptContext.keyword = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                break;
            case kScriptStateDoubleQuote:
                if (scriptChr == "\"") {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenLiteralString,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.stringConst
                    });
                    scriptContext.stringConst = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else {
                    if (scriptChr == "\\") {
                        scriptContext.scriptState = kScriptStateDoubleQuoteBackslash;
                    }
                    else {
                        scriptContext.stringConst += scriptChr;
                    }                                    
                } 
                break;
            case kScriptStateSingleQuote:
                if (scriptChr == "'") {
                    addToTokenList(parserContext, scriptContext,
                    {
                        tokenType: kTokenLiteralString,
                        lineNumber: scriptContext.tokenLineNumber,
                        token: scriptContext.stringConst
                    });
                    scriptContext.stringConst = "";
                    scriptContext.scriptState = kScriptStateIdle;
                }
                else {
                    if (scriptChr == "\\") {
                        scriptContext.scriptState = kScriptStateSingleQuoteBackslash;
                    }
                    else {
                        scriptContext.stringConst += scriptChr;
                    }                                    
                } 
                break;
            case kScriptStateDoubleQuoteBackslash:
            case kScriptStateSingleQuoteBackslash:
                if (scriptChr == 'x' || scriptChr == 'X') {
                    scriptContext.scriptState = 
                        scriptContext.scriptState == kScriptStateDoubleQuoteBackslash ? 
                            kScriptStateDoubleQuoteHexChar : 
                            kScriptStateSingleQuoteHexChar;
                    scriptContext.codeChar = '\\x';
                }
                else if (scriptChr == 'u' || scriptChr == 'U') {
                    scriptContext.scriptState = 
                        scriptContext.scriptState == kScriptStateDoubleQuoteBackslash ? 
                            kScriptStateDoubleQuoteUnicodeChar : 
                            kScriptStateSingleQuoteUnicodeChar;
                    scriptContext.codeChar = '\\u';
                }
                else if (scriptChr >= '0' && scriptChr <= '7') {
                    scriptContext.scriptState = 
                        scriptContext.scriptState == kScriptStateDoubleQuoteBackslash ? 
                            kScriptStateDoubleQuoteOctalChar : 
                            kScriptStateSingleQuoteOctalChar;
                    scriptContext.codeChar = '\\' + scriptChr;
                }
                else {
                    try {
                        scriptContext.stringConst += eval('\'\\' + scriptChr + '\'');
                    }
                    catch (err) {
                        LOG_ERROR("invalid escape");
                    }
                    scriptContext.scriptState = 
                        scriptContext.scriptState == kScriptStateDoubleQuoteBackslash ? 
                            kScriptStateDoubleQuote : 
                            kScriptStateSingleQuote;
                }
                break;
            case kScriptStateDoubleQuoteOctalChar:
            case kScriptStateSingleQuoteOctalChar:
                if 
                (
                    (scriptChr >= '0' && scriptChr <= '7') 
                ) {
                    scriptContext.codeChar += scriptChr;
                    if (scriptContext.codeChar.length >= 4) {
                        try {
                            scriptContext.stringConst += eval('\'' + scriptContext.codeChar + '\'');
                        }
                        catch (err) {
                            LOG_ERROR("invalid escape");
                        }
                        scriptContext.codeChar = "";
                        scriptContext.scriptState = 
                            scriptContext.scriptState == kScriptStateDoubleQuoteOctalChar ? 
                                kScriptStateDoubleQuote : 
                                kScriptStateSingleQuote;
                    }
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    // Do not eval if it's too short
                    scriptContext.stringConst += scriptContext.codeChar;
                    scriptContext.codeChar = "";
                    scriptContext.scriptState = 
                        scriptContext.scriptState == kScriptStateDoubleQuoteOctalChar ? 
                            kScriptStateDoubleQuote : 
                            kScriptStateSingleQuote;
                }
                break;
            case kScriptStateDoubleQuoteHexChar:
            case kScriptStateSingleQuoteHexChar:
                if 
                (
                    (scriptChr >= '0' && scriptChr <= '9') 
                    ||
                    (scriptChr >= 'a' && scriptChr <= 'f') 
                    ||
                    (scriptChr >= 'A' && scriptChr <= 'F') 
                ) {
                    scriptContext.codeChar += scriptChr;
                    if (scriptContext.codeChar.length >= 4) {
                        try {
                            scriptContext.stringConst += eval('\'' + scriptContext.codeChar + '\'');
                        }
                        catch (err) {
                            LOG_ERROR("invalid escape");
                        }
                        scriptContext.codeChar = "";
                        scriptContext.scriptState = 
                            scriptContext.scriptState == kScriptStateDoubleQuoteHexChar ?
                                kScriptStateDoubleQuote : 
                                kScriptStateSingleQuote;
                    }
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    // Do not eval if it's too short
                    scriptContext.stringConst += scriptContext.codeChar;
                    scriptContext.codeChar = "";
                    scriptContext.scriptState = 
                        scriptContext.scriptState == kScriptStateDoubleQuoteHexChar ?
                            kScriptStateDoubleQuote : 
                            kScriptStateSingleQuote;
                }
                break;
            case kScriptStateDoubleQuoteUnicodeChar:
            case kScriptStateSingleQuoteUnicodeChar:
                if 
                (
                    (scriptChr >= '0' && scriptChr <= '9') 
                    ||
                    (scriptChr >= 'a' && scriptChr <= 'f') 
                    ||
                    (scriptChr >= 'A' && scriptChr <= 'F') 
                ) {
                    scriptContext.codeChar += scriptChr;
                    if (scriptContext.codeChar.length >= 6) {
                        try {
                            scriptContext.stringConst += eval('\'' + scriptContext.codeChar + '\'');
                        }
                        catch (err) {
                            LOG_ERROR("invalid escape");
                        }
                        scriptContext.codeChar = "";
                        scriptContext.scriptState = 
                            scriptContext.scriptState == kScriptStateDoubleQuoteUnicodeChar ? 
                                kScriptStateDoubleQuote : 
                                kScriptStateSingleQuote;
                    }
                }
                else {
                    scriptContext.scriptCharsQueuePos--;
                    // Do not eval if it's too short
                    scriptContext.stringConst += scriptContext.codeChar;
                    scriptContext.codeChar = "";
                    scriptContext.scriptState = 
                        scriptContext.scriptState == kScriptStateDoubleQuoteUnicodeChar ?
                            kScriptStateDoubleQuote : 
                            kScriptStateSingleQuote;
                }
                break;
        }
    
        if (scriptChr > ' ') {
            scriptContext.prvNonWhiteScriptChr = scriptChr;
        }
        scriptContext.prvLineNumber = lineNumber;

    }
    while (false);
    

}

function processRawScriptChar(scriptContext, textState) {

    var rawChr;
    if (textState.charPos >= textState.scriptLength) {
        textState.commentState = kCommentStateEOF;
        rawChr = "";
    }
    else {
        
        rawChr = textState.scriptText.charAt(textState.charPos);
        if (rawChr == '\r') {
            textState.nonWhiteCharOnLineCount = 0;
            textState.lineNumber++;
            textState.seenCrLineEnd = true;
        }
        else {
            if (rawChr == '\n') {
                textState.nonWhiteCharOnLineCount = 0;
                if (! textState.seenCrLineEnd) {
                    textState.lineNumber++;
                }
            }
            else if (rawChr > ' ') {
                textState.nonWhiteCharOnLineCount++;
            }
            textState.seenCrLineEnd = false;
        }
        textState.charPos++;
    }

    switch (textState.commentState) {
        default:
            LOG_ERROR("processFilteredScriptChar: unexpected textState.commentState");
            break;
        case kCommentStateIdle:
            if (rawChr == '#' && textState.nonWhiteCharOnLineCount == 1) {
                textState.commentState = kCommentStateHash;
                textState.literalString = rawChr;
                textState.literalStringLineNumber = textState.lineNumber;
            }
            else if (rawChr == '/') {
                textState.commentState = kCommentStateSlash;
            }
            else if (rawChr == "\"") {
                textState.commentState = kCommentStateDoubleQuote;
                textState.literalStringLineNumber = textState.lineNumber;
            }
            else if (rawChr == "'") {
                textState.commentState = kCommentStateSingleQuote;
                textState.literalStringLineNumber = textState.lineNumber;
            }
            else if (rawChr) {
                addToScriptCharsQueue(scriptContext, rawChr, textState.lineNumber);
            }
            break;
        case kCommentStateHash:
            if (rawChr == '\n' || rawChr == '\r' || rawChr == '/') {
                addToScriptCharsQueue(scriptContext, textState.literalString + '\n', textState.literalStringLineNumber);
                textState.literalString = "";
                textState.commentState = kCommentStateIdle;
            }
            else { 
                textState.literalString += rawChr;
                if (rawChr == '"') {
                    textState.commentState = kCommentStateHashDoubleQuoted;
                }
                else if (rawChr == '\'') {
                    textState.commentState = kCommentStateHashSingleQuoted;
                }
            }
            break;
        case kCommentStateHashDoubleQuoted:
            if (rawChr == '\n' || rawChr == '\r') {
                addToScriptCharsQueue(scriptContext, textState.literalString + '\n', textState.literalStringLineNumber);
                textState.literalString = "";
                textState.commentState = kCommentStateIdle;
            }
            else {
                textState.literalString += rawChr;
                if (rawChr == '"') {
                    textState.commentState = kCommentStateHash;
                }
                else if (rawChr == '\\') {
                    textState.commentState = kCommentStateHashDoubleQuotedBackSlash;
                }
            }
            break;
        case kCommentStateHashDoubleQuotedBackslash:
            if (rawChr == '\n' || rawChr == '\r') {
                addToScriptCharsQueue(scriptContext, textState.literalString + '\n', textState.literalStringLineNumber);
                textState.literalString = "";
                textState.commentState = kCommentStateIdle;
            }
            else {
                textState.literalString += rawChr;
                textState.commentState = kCommentStateHashDoubleQuoted;
            }
            break;
        case kCommentStateHashSingleQuoted:
            if (rawChr == '\n' || rawChr == '\r') {
                addToScriptCharsQueue(scriptContext, textState.literalString + '\n', textState.literalStringLineNumber);
                textState.literalString = "";
                textState.commentState = kCommentStateIdle;
            }
            else {
                textState.literalString += rawChr;
                if (rawChr == '"') {
                    textState.commentState = kCommentStateHash;
                }
                else if (rawChr == '\\') {
                    textState.commentState = kCommentStateHashSingleQuotedBackSlash;
                }
            }
            break;
        case kCommentStateHashSingleQuotedBackslash:
            if (rawChr == '\n' || rawChr == '\r') {
                addToScriptCharsQueue(scriptContext, textState.literalString + '\n', textState.literalStringLineNumber);
                textState.literalString = "";
                textState.commentState = kCommentStateIdle;
            }
            else {
                textState.literalString += rawChr;
                textState.commentState = kCommentStateHashSingleQuoted;
            }
            break;
        case kCommentStateSlash:
            if (rawChr == '/') {
                textState.commentState = kCommentStateSlashSlashComment;
            }
            else if (rawChr == '*') {
                textState.commentState = kCommentStateSlashStarComment;
            }
            else if 
            (
                (textState.prvNonWhiteRawChr >= 'a' && textState.prvNonWhiteRawChr <= 'z')
                ||
                (textState.prvNonWhiteRawChr >= '0' && textState.prvNonWhiteRawChr <= '9')
                ||
                textState.prvNonWhiteRawChr == '.'
                ||
                textState.prvNonWhiteRawChr == ')'
            ) {
                addToScriptCharsQueue(scriptContext, "/" + rawChr, textState.lineNumber);
                textState.commentState = kCommentStateIdle;
            }
            else {
                textState.commentState = kCommentStateRegExp;
                textState.literalString = "/";
                textState.charPos--;
                textState.literalStringLineNumber = textState.lineNumber;
            }
            break;
        case kCommentStateRegExp:
            if (rawChr == '/') {
                textState.literalString += rawChr;
                textState.commentState = kCommentStateAfterRegExp;
            }
            else {
                textState.literalString += rawChr;
                if (rawChr == '\\') {
                    textState.commentState = kCommentStateRegExpBackslash;
                }
            }
            break;
        case kCommentStateRegExpBackslash:
            textState.literalString += rawChr;
            textState.commentState = kCommentStateRegExp;
            break;
        case kCommentStateAfterRegExp:
            if (rawChr >= 'a' && rawChr <= 'z') {
                textState.literalString += rawChr;
            }
            else {
                addToScriptCharsQueue(scriptContext, textState.literalString, textState.literalStringLineNumber);
                textState.literalString = "";
                textState.charPos--;
                textState.commentState = kCommentStateIdle;
            }
            break;
        case kCommentStateSlashStarComment:
            if (rawChr == '*') {
                textState.commentState = kCommentStateSlashStarCommentStar;
            }
            else {
                addToScriptCharsQueue(scriptContext, "/" + rawChr, textState.lineNumber);
                textState.commentState = kCommentStateIdle;
            }
            break;
        case kCommentStateSlashStarCommentStar:
            if (rawChr == '/') {
                textState.commentState = kCommentStateIdle;
            }
            break;
        case kCommentStateSlashSlashComment:
            if (rawChr < ' ') {
                textState.commentState = kCommentStateIdle;
            }
            break;
        case kCommentStateDoubleQuote:
            if (rawChr == "\"") {
                addToScriptCharsQueue(scriptContext, "\"" + textState.literalString + "\"", textState.literalStringLineNumber);
                textState.literalString = "";
                textState.commentState = kCommentStateIdle;
            }
            else {
                textState.literalString += rawChr;
                if (rawChr == "\\") {
                    textState.commentState = kCommentStateDoubleQuoteBackslash;
                }
            }
            break;
        case kCommentStateDoubleQuoteBackslash:
            textState.literalString += rawChr;
            textState.commentState = kCommentStateDoubleQuote;
            break;
        case kCommentStateSingleQuote:
            if (rawChr == "'") {
                addToScriptCharsQueue(scriptContext, "'" + textState.literalString + "'", textState.literalStringLineNumber);
                textState.literalString = "";
                textState.commentState = kCommentStateIdle;
            }
            else {
                textState.literalString += rawChr;
                if (rawChr == "\\") {
                    textState.commentState = kCommentStateSingleQuoteBackslash;
                }
            }
            break;
        case kCommentStateSingleQuoteBackslash:
            textState.literalString += rawChr;
            textState.commentState = kCommentStateSingleQuote;
            break;
        case kCommentStateEOF:
            break;
    }

    if (rawChr > ' ') {
        textState.prvNonWhiteRawChr = rawChr;
    }

}

function processToken(parserContext) {

    var tokenQueue = parserContext.tokenQueue;
    parserContext.tokenQueue = [];
    
    for (var tokenIdx = 0; tokenIdx < parserContext.tokenQueue.length; tokenIdx++) {
        var token = parserContext.tokenQueue[tokenIdx];
        
    }       
}

var tokenListToString = function(tokenList) {

    var scriptText = "";
    var lineNumber = 1;
    var prvTokenType = kTokenNone;
    for (var idx = 0; idx < tokenList.length; idx++) {
        var token = tokenList[idx];
        while (lineNumber < token.lineNumber) {
            lineNumber++;
            dump += '\n';
            prvTokenType = kTokenNone;
        }
        switch (token.tokenType) {
            case kTokenNone:
                break;
            case kTokenLiteralString:
                dump += '"' + escapeStr(token.token) + '"';
                break;
            case kTokenRegExp:
                dump += token.token;
                break;
            case kTokenPreprocessor:
                dump += token.token + "\n";
                lineNumber++;
                break;
            case kTokenKeyword:
                if (prvTokenType == kTokenKeyword || prvTokenType == kTokenNumber || prvTokenType == kTokenRegExp) {
                    dump += ' ';
                }
                dump += token.token;
                break;
            case kTokenOpenParens:
                dump += '(';
                break;
            case kTokenCloseParens:
                dump += ')';
                break;
            case kTokenOpenBrace:
                dump += '{';
                break;
            case kTokenCloseBrace:
                dump += '}';
                break;
            case kTokenNumber:
                if (prvTokenType == kTokenKeyword || prvTokenType == kTokenNumber || prvTokenType == kTokenRegExp) {
                    dump += ' ';
                }
                dump += token.token;
                break;
            case kTokenSemicolon:
                dump += ';';
                break;
            case kTokenIncrement:
                dump += '++';
                break;
            case kTokenDecrement:
                dump += '--';
                break;
            case kTokenAdd:
                dump += '+';
                break;
            case kTokenMultiply:
                dump += '*';
                break;
            case kTokenSubtract:
                dump += '-';
                break;
            case kTokenDivide:
                dump += '/';
                break;
            case kTokenBitAnd:
                dump += '&';
                break;
            case kTokenBitOr:
                dump += '|';
                break;
            case kTokenAnd:
                dump += '&&';
                break;
            case kTokenOr:
                dump += '||';
                break;
            case kTokenPeriod:
                dump += '.';
                break;
            case kTokenColon:
                dump += ':';
                break;
            case kTokenEqual:
                dump += '==';
                break;
            case kTokenAssign:
                dump += '=';
                break;
            case kTokenComma:
                dump += ',';
                break;
            case kTokenQuestionMark:
                dump += '?';
                break;
            case kTokenGreaterOrEqual:
                dump += '>=';
                break;
            case kTokenGreater:
                dump += '>';
                break;
            case kTokenLessOrEqual:
                dump += '<=';
                break;
            case kTokenLess:
                dump += '<';
                break;
            case kTokenAddInTo:
                dump += '+=';
                break;
            case kTokenSubtractInTo:
                dump += '-=';
                break;
            case kTokenMultiplyInTo:
                dump += '*=';
                break;
            case kTokenDivideInTo:
                dump += '/=';
                break;
            case kTokenAndInTo:
                dump += '&&=';
                break;
            case kTokenOrInTo:
                dump += '||=';
                break;
            case kTokenBitAndInTo:
                dump += '&=';
                break;
            case kTokenBitOrInTo:
                dump += '|=';
                break;
            case kTokenBitXorInTo:
                dump += '^=';
                break;
            case kTokenBitXor:
                dump += '^';
                break;
            case kTokenBitShiftLeft:
                dump += '<<';
                break;
            case kTokenBitShiftRight:
                dump += '>>';
                break;
            case kTokenBitShiftLeftInto:
                dump += '<<=';
                break;
            case kTokenBitShiftRightInto:
                dump += '>>=';
                break;
            case kTokenIdentical:
                dump += '===';
                break;
            case kTokenOpenBracket:
                dump += '[';
                break;
            case kTokenCloseBracket:
                dump += ']';
                break;
        }
        prvTokenType = token.tokenType;
    }

    return dump;
}
_ESNX_.compiler.tokenListToString = tokenListToString;

})();

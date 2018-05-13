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
        else if (c < ' ') {
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

var tokenListToString = function(tokenList) {

    var dump = "";
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

var compileScript = function(in_scriptText) {

    var retVal = "";

    do {
        try {

            var scriptCharsQueue = "";
            var scriptCharsLineNumber = [];
            var whiteSpace = "";

            function addCharToScriptCharsQueue(rawChr, lineNumber) {

                if (" \t".indexOf(rawChr) >= 0) {
                    if (whiteSpace.length == 0) {
                        whiteSpace = " ";
                    }
                }
                else if ("\n\r".indexOf(rawChr) >= 0) {
                    whiteSpace = "\n";
                }
                else {
                    if (whiteSpace.length > 0) {
                        scriptCharsQueue += whiteSpace;
                        whiteSpace = "";
                    }
                    scriptCharsQueue += rawChr;
                    scriptCharsLineNumber.push(lineNumber);
                }
            }

            function addToScriptCharsQueue(chars, lineNumber) {
                for (var idx = 0; idx < chars.length; idx++) {
                    addCharToScriptCharsQueue(chars.charAt(idx), lineNumber);
                }
            }

            // TODO: put these in a state struct so we can separate this off in a separate function
            var scriptState = kScriptStateIdle;
            var lastTokenType = kTokenNone;
            var scriptCharsQueuePos = 0;
            var stringConst = "";
            var keyword = "";
            var numberStr = "";
            var regExp = "";
            var preprocessorString = "";
            var prvNonWhiteScriptChr = "";
            var prvLineNumber = 0;
            var tokenLineNumber = 0;
            var scriptChr = "";
            var codeChar = "";

            var tokenList = [];

            function processToken() {
            }
            var counter = 0;
            
            function addTotokenList(token) {
                tokenList.push(token);
                lastTokenType = token.tokenType;
            }

            function processFilteredScriptChar() {

                do {

                    if (scriptCharsQueuePos >= scriptCharsQueue.length) {
                        if (scriptCharsQueuePos) {
                            scriptCharsQueue = "";
                            scriptCharsLineNumber = [];
                            scriptCharsQueuePos = 0;
                        }
                        break;
                    }

                    if (scriptChr > ' ') {
                        prvNonWhiteScriptChr = scriptChr;
                    }

                    scriptChr = scriptCharsQueue.charAt(scriptCharsQueuePos);
                    var prvLineNumber = lineNumber;
                    var lineNumber = scriptCharsLineNumber[scriptCharsQueuePos];
                    scriptCharsQueuePos++;
                    switch (scriptState) {
                        default:
                            LOG_ERROR("processFilteredScriptChar: unexpected scriptState");
                            break;
                        case kScriptStateIdle:
                            if (scriptChr <= ' ') {
                                // do nothing
                            }
                            else if (scriptChr == '#' && prvLineNumber != lineNumber) {
                                preprocessorString = scriptChr;
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStatePreprocessor;
                            }
                            else if (scriptChr == '"') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateDoubleQuote;
                            }
                            else if (scriptChr == "'") {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateSingleQuote;
                            }
                            else if (scriptChr == ';') {
                                addTotokenList({
                                    tokenType: kTokenSemicolon,
                                    lineNumber: lineNumber,
                                    token: ';'
                                });
                            }
                            else if (scriptChr == ':') {
                                addTotokenList({
                                    tokenType: kTokenColon,
                                    lineNumber: lineNumber,
                                    token: ':'
                                });
                            }
                            else if (scriptChr == '{') {
                                addTotokenList({
                                    tokenType: kTokenOpenBrace,
                                    lineNumber: lineNumber,
                                    token: '{'
                                });
                            }
                            else if (scriptChr == '}') {
                                addTotokenList({
                                    tokenType: kTokenCloseBrace,
                                    lineNumber: lineNumber,
                                    token: '}'
                                });
                            }
                            else if (scriptChr == '[') {
                                addTotokenList({
                                    tokenType: kTokenOpenBracket,
                                    lineNumber: lineNumber,
                                    token: '['
                                });
                            }
                            else if (scriptChr == ']') {
                                addTotokenList({
                                    tokenType: kTokenCloseBracket,
                                    lineNumber: lineNumber,
                                    token: ']'
                                });
                            }
                            else if (scriptChr == '(') {
                                addTotokenList({
                                    tokenType: kTokenOpenParens,
                                    lineNumber: lineNumber,
                                    token: '('
                                });
                            }
                            else if (scriptChr == ')') {
                                addTotokenList({
                                    tokenType: kTokenCloseParens,
                                    lineNumber: lineNumber,
                                    token: ')'
                                });
                            }
                            else if (scriptChr == ',') {
                                addTotokenList({
                                    tokenType: kTokenComma,
                                    lineNumber: lineNumber,
                                    token: ','
                                });
                            }
                            else if (scriptChr == '?') {
                                addTotokenList({
                                    tokenType: kTokenQuestionMark,
                                    lineNumber: lineNumber,
                                    token: '?'
                                });
                            }
                            else if (scriptChr == '0') {
                                numberStr = "0";
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateZero;
                            }
                            else if (scriptChr >= '1' && scriptChr <= '9') {
                                numberStr = scriptChr;
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateNumerical;
                            }
                            else if (scriptChr == '.') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStatePeriod;
                            }
                            else if (scriptChr == '+') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStatePlus;
                            }
                            else if (scriptChr == '-') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateMinus;
                            }
                            else if (scriptChr == '&') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateAnd;
                            }
                            else if (scriptChr == '^') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateXor;
                            }
                            else if (scriptChr == '|') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateOr;
                            }
                            else if (scriptChr == '*') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateTimes;
                            }
                            else if (scriptChr == '=') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateEquals;
                            }
                            else if (scriptChr == '<') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateLess;
                            }
                            else if (scriptChr == '>') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateGreater;
                            }
                            else if (scriptChr == '/') {
                                tokenLineNumber = lineNumber;
                                if 
                                (
                                    (prvNonWhiteScriptChr >= 'a' && prvNonWhiteScriptChr <= 'z')
                                    ||
                                    (prvNonWhiteScriptChr >= '0' && prvNonWhiteScriptChr <= '9')
                                    ||
                                    prvNonWhiteScriptChr == '.'
                                    ||
                                    prvNonWhiteScriptChr == '$'
                                    ||
                                    prvNonWhiteScriptChr == '_'
                                    ||
                                    prvNonWhiteScriptChr == ')'
                                ) {
                                    scriptState = kScriptStateDivide;
                                }
                                else {
                                    regExp = scriptChr;
                                    scriptState = kScriptStateRegExp;
                                }
                            }
                            else if (scriptChr > ' ') {
                                tokenLineNumber = lineNumber;
                                keyword = scriptChr;
                                scriptState = kScriptStateKeyword;
                            }                           
                            break;
                        case kScriptStatePreprocessor:
                            if (scriptChr < ' ') {
                                addTotokenList({
                                    tokenType: kTokenPreprocessor,
                                    lineNumber: tokenLineNumber,
                                    token: preprocessorString
                                });
                                preprocessorString = "";
                                scriptState = kScriptStateIdle;
                            }
                            else {
                                preprocessorString += scriptChr;
                            }
                            break;
                        case kScriptStateGreater:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenGreaterOrEqual,
                                    lineNumber: lineNumber,
                                    token: '>='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr == '>') {
                                scriptState = kScriptStateDoubleGreater;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenGreater,
                                    lineNumber: lineNumber,
                                    token: '>'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleGreater:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenBitShiftRightInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '>>='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenBitShiftRight,
                                    lineNumber: tokenLineNumber,
                                    token: '>>'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateLess:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenLessOrEqual,
                                    lineNumber: tokenLineNumber,
                                    token: '<='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr == '<') {
                                scriptState = kScriptStateDoubleLess;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenLess,
                                    lineNumber: tokenLineNumber,
                                    token: '<'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleLess:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenBitShiftLeftInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '<<='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenBitShiftLeft,
                                    lineNumber: tokenLineNumber,
                                    token: '<<'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateEquals:
                            if (scriptChr == '=') {
                                scriptState = kScriptStateDoubleEquals;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenAssign,
                                    lineNumber: tokenLineNumber,
                                    token: '='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleEquals:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenIdentical,
                                    lineNumber: tokenLineNumber,
                                    token: '==='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenEqual,
                                    lineNumber: tokenLineNumber,
                                    token: '=='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateRegExp:
                            if (scriptChr == '/') {
                                regExp += scriptChr;
                                scriptState = kScriptStateAfterRegExp;
                            }
                            else {
                                regExp += scriptChr;
                                if (scriptChr == '\\') {
                                    scriptState = kScriptStateRegExpBackslash;
                                }
                            }
                            break;
                        case kScriptStateRegExpBackslash: 
                            regExp += scriptChr;
                            scriptState = kScriptStateRegExp;
                            break;
                        case kScriptStateAfterRegExp:
                            if (scriptChr >= 'a' && scriptChr <= 'z') {
                                regExp += scriptChr;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenRegExp,
                                    lineNumber: tokenLineNumber,
                                    token: regExp
                                });
                                regExp = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStatePeriod:
                            if (lastTokenType == kTokenKeyword) {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenPeriod,
                                    lineNumber: tokenLineNumber,
                                    token: '.',
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if 
                              (
                                  (scriptChr >= '0' && scriptChr <= '9') 
                                  || 
                                  scriptChr == 'e' 
                                  || 
                                  scriptChr == 'E'
                              ) {
                                numberStr += '.' + scriptChr;
                                scriptState = kScriptStateNumerical;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenPeriod,
                                    lineNumber: tokenLineNumber,
                                    token: '.'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStatePlus:
                            if (scriptChr == '+') {
                                addTotokenList({
                                    tokenType: kTokenIncrement,
                                    lineNumber: tokenLineNumber,
                                    token: '++'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenAddInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '+='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr >= '0' && scriptChr >= '9') {
                                numberStr += '+' + scriptChr;
                                scriptState = kScriptStateNumerical;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenAdd,
                                    lineNumber: tokenLineNumber,
                                    token: '+'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateAnd:
                            if (scriptChr == '&') {
                                scriptState = kScriptStateDoubleAnd;
                            }
                            else if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenBitAndInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '&='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenBitAnd,
                                    lineNumber: tokenLineNumber,
                                    token: '&'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleAnd:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenAndInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '&&='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenAnd,
                                    lineNumber: tokenLineNumber,
                                    token: '&&'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateOr:
                            if (scriptChr == '|') {
                                scriptState = kScriptStateDoubleOr;
                            }
                            else if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenBitOrInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '|='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenBitOr,
                                    lineNumber: tokenLineNumber,
                                    token: '|'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleOr:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenOrInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '||='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenOr,
                                    lineNumber: tokenLineNumber,
                                    token: '||'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateXor:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenBitXorInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '^='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenBitXor,
                                    lineNumber: tokenLineNumber,
                                    token: '^'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateTimes:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenMultiplyInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '*='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenMultiply,
                                    lineNumber: tokenLineNumber,
                                    token: '*'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDivide:
                            if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenDivideInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '/='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenDivide,
                                    lineNumber: tokenLineNumber,
                                    token: '/'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateMinus:
                            if (scriptChr == '-') {
                                addTotokenList({
                                    tokenType: kTokenDecrement,
                                    lineNumber: tokenLineNumber,
                                    token: '--'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr == '=') {
                                addTotokenList({
                                    tokenType: kTokenSubtractInto,
                                    lineNumber: tokenLineNumber,
                                    token: '-='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr >= '0' && scriptChr >= '9') {
                                numberStr += '-' + scriptChr;
                                scriptState = kScriptStateNumerical;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenSubtract,
                                    lineNumber: tokenLineNumber,
                                    token: '-'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateZero:
                            if 
                              (
                                scriptChr == 'x' 
                                ||
                                scriptChr == 'X'
                              ) {
                                numberStr += scriptChr;
                                scriptState = kScriptStateHexNumber;
                            }
                            else if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumerical;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;                                
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
                                numberStr += scriptChr;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });                             
                                numberStr = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateNumericalExponentNumber:
                            if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateNumericalExponent:
                            if (scriptChr >= '-' && scriptChr <= '+') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalExponentNumber;
                            }
                            else if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalExponentNumber;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateNumericalMantisse:
                            if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                            }
                            else if (scriptChr == 'e' || scriptChr == 'E') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalExponent;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateNumerical:
                            if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                            }
                            else if (scriptChr == '.') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalMantisse;
                            }
                            else if (scriptChr == 'e' || scriptChr == 'E') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalExponent;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;
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
                                keyword += scriptChr;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addTotokenList({
                                    tokenType: kTokenKeyword,
                                    lineNumber: tokenLineNumber,
                                    token: keyword
                                });
                                keyword = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleQuote:
                            if (scriptChr == "\"") {
                                addTotokenList({
                                    tokenType: kTokenLiteralString,
                                    lineNumber: tokenLineNumber,
                                    token: stringConst
                                });
                                stringConst = "";
                                scriptState = kScriptStateIdle;
                            }
                            else {
                                if (scriptChr == "\\") {
                                    scriptState = kScriptStateDoubleQuoteBackslash;
                                }
                                else {
                                    stringConst += scriptChr;
                                }                                    
                            } 
                            break;
                        case kScriptStateSingleQuote:
                            if (scriptChr == "'") {
                                addTotokenList({
                                    tokenType: kTokenLiteralString,
                                    lineNumber: tokenLineNumber,
                                    token: stringConst
                                });
                                stringConst = "";
                                scriptState = kScriptStateIdle;
                            }
                            else {
                                if (scriptChr == "\\") {
                                    scriptState = kScriptStateSingleQuoteBackslash;
                                }
                                else {
                                    stringConst += scriptChr;
                                }                                    
                            } 
                            break;
                        case kScriptStateDoubleQuoteBackslash:
                        case kScriptStateSingleQuoteBackslash:
                            if (scriptChr == 'x' || scriptChr == 'X') {
                                scriptState = 
                                    scriptState == kScriptStateDoubleQuoteBackslash ? 
                                        kScriptStateDoubleQuoteHexChar : 
                                        kScriptStateSingleQuoteHexChar;
                                codeChar = '\\x';
                            }
                            else if (scriptChr == 'u' || scriptChr == 'U') {
                                scriptState = 
                                    scriptState == kScriptStateDoubleQuoteBackslash ? 
                                        kScriptStateDoubleQuoteUnicodeChar : 
                                        kScriptStateSingleQuoteUnicodeChar;
                                codeChar = '\\u';
                            }
                            else if (scriptChr >= '0' && scriptChr <= '7') {
                                scriptState = 
                                    scriptState == kScriptStateDoubleQuoteBackslash ? 
                                        kScriptStateDoubleQuoteOctalChar : 
                                        kScriptStateSingleQuoteOctalChar;
                                codeChar = '\\' + scriptChr;
                            }
                            else {
                                try {
                                    stringConst += eval('\'\\' + scriptChr + '\'');
                                }
                                catch (err) {
                                    LOG_ERROR("invalid escape");
                                }
                            }
                            scriptState = 
                                scriptState == kScriptStateDoubleQuoteBackslash ? 
                                    kScriptStateDoubleQuote : 
                                    kScriptStateSingleQuote;
                            break;
                        case kScriptStateDoubleQuoteOctalChar:
                        case kScriptStateSingleQuoteOctalChar:
                            if 
                            (
                                (scriptChr >= '0' && scriptChr <= '7') 
                            ) {
                                codeChar += scriptChr;
                                if (codeChar.length >= 4) {
                                    try {
                                        stringConst += eval('\'' + codeChar + '\'');
                                    }
                                    catch (err) {
                                        LOG_ERROR("invalid escape");
                                    }
                                    codeChar = "";
                                    scriptState = 
                                        scriptState == kScriptStateDoubleQuoteOctalChar ? 
                                            kScriptStateDoubleQuote : 
                                            kScriptStateSingleQuote;
                                }
                            }
                            else {
                                scriptCharsQueuePos--;
                                // Do not eval if it's too short
                                stringConst += codeChar;
                                codeChar = "";
                                scriptState = 
                                    scriptState == kScriptStateDoubleQuoteOctalChar ? 
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
                                codeChar += scriptChr;
                                if (codeChar.length >= 4) {
                                    try {
                                        stringConst += eval('\'' + codeChar + '\'');
                                    }
                                    catch (err) {
                                        LOG_ERROR("invalid escape");
                                    }
                                    codeChar = "";
                                    scriptState = 
                                        scriptState == kScriptStateDoubleQuoteHexChar ?
                                            kScriptStateDoubleQuote : 
                                            kScriptStateSingleQuote;
                                }
                            }
                            else {
                                scriptCharsQueuePos--;
                                // Do not eval if it's too short
                                stringConst += codeChar;
                                codeChar = "";
                                scriptState = 
                                    scriptState == kScriptStateDoubleQuoteHexChar ?
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
                                codeChar += scriptChr;
                                if (codeChar.length >= 6) {
                                    try {
                                        stringConst += eval('\'' + codeChar + '\'');
                                    }
                                    catch (err) {
                                        LOG_ERROR("invalid escape");
                                    }
                                    codeChar = "";
                                    scriptState = 
                                        scriptState == kScriptStateDoubleQuoteUnicodeChar ? 
                                            kScriptStateDoubleQuote : 
                                            kScriptStateSingleQuote;
                                }
                            }
                            else {
                                scriptCharsQueuePos--;
                                // Do not eval if it's too short
                                stringConst += codeChar;
                                codeChar = "";
                                scriptState = 
                                    scriptState == kScriptStateDoubleQuoteUnicodeChar ?
                                        kScriptStateDoubleQuote : 
                                        kScriptStateSingleQuote;
                            }
                            break;
                    }

                }
                while (false);


            }

            var commentState = kCommentStateIdle;
            var charPos = 0;
            var scriptLength = in_scriptText.length;
            var literalString = "";
            var literalStringLineNumber = 0;
            var lineNumber = 1;
            var seenCrLineEnd = false;
            var prvNonWhiteRawChr = "";
            var rawChr = "";
            var nonWhiteCharOnLineCount = false;

            function processRawScriptChar() {

                if (rawChr > ' ') {
                    prvNonWhiteRawChr = rawChr;
                    seenLineBegin = true;
                }
            
                if (charPos >= scriptLength) {
                    if (scriptCharsQueue.length == 0) {
                        commentState = kCommentStateEOF;
                    }
                }
                else {
                    
                    rawChr = in_scriptText.charAt(charPos);
                    if (rawChr == '\r') {
                        nonWhiteCharOnLineCount = 0;
                        lineNumber++;
                        seenCrLineEnd = true;
                    }
                    else {
                        if (rawChr == '\n') {
                            nonWhiteCharOnLineCount = 0;
                            if (! seenCrLineEnd) {
                                lineNumber++;
                            }
                        }
                        else if (rawChr > ' ') {
                            nonWhiteCharOnLineCount++;
                        }
                        seenCrLineEnd = false;
                    }
                    charPos++;
                }

                switch (commentState) {
                    default:
                        LOG_ERROR("processFilteredScriptChar: unexpected commentState");
                        break;
                    case kCommentStateIdle:
                        if (rawChr == '#' && nonWhiteCharOnLineCount == 1) {
                            commentState = kCommentStateHash;
                            literalString = rawChr;
                            literalStringLineNumber = lineNumber;
                        }
                        else if (rawChr == '/') {
                            commentState = kCommentStateSlash;
                        }
                        else if (rawChr == "\"") {
                            commentState = kCommentStateDoubleQuote;
                            literalStringLineNumber = lineNumber;
                        }
                        else if (rawChr == "'") {
                            commentState = kCommentStateSingleQuote;
                            literalStringLineNumber = lineNumber;
                        }
                        else {
                            addToScriptCharsQueue(rawChr, lineNumber);
                        }
                        break;
                    case kCommentStateHash:
                        if (rawChr == '\n' || rawChr == '\r' || rawChr == '/') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else { 
                            literalString += rawChr;
                            if (rawChr == '"') {
                                commentState = kCommentStateHashDoubleQuoted;
                            }
                            else if (rawChr == '\'') {
                                commentState = kCommentStateHashSingleQuoted;
                            }
                        }
                        break;
                    case kCommentStateHashDoubleQuoted:
                        if (rawChr == '\n' || rawChr == '\r') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == '"') {
                                commentState = kCommentStateHash;
                            }
                            else if (rawChr == '\\') {
                                commentState = kCommentStateHashDoubleQuotedBackSlash;
                            }
                        }
                        break;
                    case kCommentStateHashDoubleQuotedBackslash:
                        if (rawChr == '\n' || rawChr == '\r') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            commentState = kCommentStateHashDoubleQuoted;
                        }
                        break;
                    case kCommentStateHashSingleQuoted:
                        if (rawChr == '\n' || rawChr == '\r') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == '"') {
                                commentState = kCommentStateHash;
                            }
                            else if (rawChr == '\\') {
                                commentState = kCommentStateHashSingleQuotedBackSlash;
                            }
                        }
                        break;
                    case kCommentStateHashSingleQuotedBackslash:
                        if (rawChr == '\n' || rawChr == '\r') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            commentState = kCommentStateHashSingleQuoted;
                        }
                        break;
                    case kCommentStateSlash:
                        if (rawChr == '/') {
                            commentState = kCommentStateSlashSlashComment;
                        }
                        else if (rawChr == '*') {
                            commentState = kCommentStateSlashStarComment;
                        }
                        else if 
                        (
                            (prvNonWhiteRawChr >= 'a' && prvNonWhiteRawChr <= 'z')
                            ||
                            (prvNonWhiteRawChr >= '0' && prvNonWhiteRawChr <= '9')
                            ||
                            prvNonWhiteRawChr == '.'
                            ||
                            prvNonWhiteRawChr == ')'
                        ) {
                            addToScriptCharsQueue("/" + rawChr, lineNumber);
                            commentState = kCommentStateIdle;
                        }
                        else {
                            commentState = kCommentStateRegExp;
                            literalString = "/";
                            charPos--;
                            literalStringLineNumber = lineNumber;
                        }
                        break;
                    case kCommentStateRegExp:
                        if (rawChr == '/') {
                            literalString += rawChr;
                            commentState = kCommentStateAfterRegExp;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == '\\') {
                                commentState = kCommentStateRegExpBackslash;
                            }
                        }
                        break;
                    case kCommentStateRegExpBackslash:
                        literalString += rawChr;
                        commentState = kCommentStateRegExp;
                        break;
                    case kCommentStateAfterRegExp:
                        if (rawChr >= 'a' && rawChr <= 'z') {
                            literalString += rawChr;
                        }
                        else {
                            addToScriptCharsQueue(literalString, literalStringLineNumber);
                            literalString = "";
                            charPos--;
                            commentState = kCommentStateIdle;
                        }
                        break;
                    case kCommentStateSlashStarComment:
                        if (rawChr == '*') {
                            commentState = kCommentStateSlashStarCommentStar;
                        }
                        else {
                            addToScriptCharsQueue("/" + rawChr, lineNumber);
                            commentState = kCommentStateIdle;
                        }
                        break;
                    case kCommentStateSlashStarCommentStar:
                        if (rawChr == '/') {
                            commentState = kCommentStateIdle;
                        }
                        break;
                    case kCommentStateSlashSlashComment:
                        if (rawChr < ' ') {
                            commentState = kCommentStateIdle;
                        }
                        break;
                    case kCommentStateDoubleQuote:
                        if (rawChr == "\"") {
                            addToScriptCharsQueue("\"" + literalString + "\"", literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == "\\") {
                                commentState = kCommentStateDoubleQuoteBackslash;
                            }
                        }
                        break;
                    case kCommentStateDoubleQuoteBackslash:
                        literalString += rawChr;
                        commentState = kCommentStateDoubleQuote;
                        break;
                    case kCommentStateSingleQuote:
                        if (rawChr == "'") {
                            addToScriptCharsQueue("'" + literalString + "'", literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == "\\") {
                                commentState = kCommentStateSingleQuoteBackslash;
                            }
                        }
                        break;
                    case kCommentStateSingleQuoteBackslash:
                        literalString += rawChr;
                        commentState = kCommentStateSingleQuote;
                        break;
                    case kCommentStateEOF:
                        break;
                }
            }

            while (commentState != kCommentStateEOF) {
                processRawScriptChar();
                processFilteredScriptChar();
                processToken();
            }
        }
        catch (err) {
            LOG_ERROR("compileScript: throws " + err)
        }
    }
    while (false);

    return tokenListToString(tokenList);
}
_ESNX_.compiler.compileScript = compileScript;

})();

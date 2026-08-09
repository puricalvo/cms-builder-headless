export function getEmv3dsParams() {
    let emv3dsObj: Record<string, any> = {};

    emv3dsObj["browserUserAgent"] = navigator.userAgent;
    emv3dsObj["browserJavaEnabled"] = false;
    emv3dsObj["browserJavascriptEnabled"] = true;
    emv3dsObj["browserLanguage"] = navigator.language;

    let colorDepth = window.screen.colorDepth;

    if (
        colorDepth === undefined ||
        colorDepth === null ||
        !(
            colorDepth == 1 ||
            colorDepth == 4 ||
            colorDepth == 8 ||
            colorDepth == 15 ||
            colorDepth == 16 ||
            colorDepth == 24 ||
            colorDepth == 32 ||
            colorDepth == 48
        )
    ) {
        colorDepth = 24;
    }

    emv3dsObj["browserColorDepth"] = colorDepth;
    emv3dsObj["browserScreenHeight"] = window.screen.height;
    emv3dsObj["browserScreenWidth"] = window.screen.width;
    emv3dsObj["browserTZ"] = new Date().getTimezoneOffset();

    return emv3dsObj;
}
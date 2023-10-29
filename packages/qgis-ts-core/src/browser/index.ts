import isMobile from 'ismobilejs';

/**
 * Browser properties.
 */
export interface BrowserInfo {
    /**
     * Is this Internet Explorer?
     */
    ie: boolean;

    /**
     * Is this Internet Explorer 11?
     */
    ie11: boolean;

    ieLt9: boolean;
    webkit: boolean;
    gecko: boolean;

    android: boolean;
    android23: boolean;

    chrome: boolean;

    ie3d: boolean;
    webkit3d: boolean;
    gecko3d: boolean;
    opera3d: boolean;
    any3d: boolean;

    mobile: boolean;
    mobileWebkit: boolean;
    mobileWebkit3d: boolean;
    mobileOpera: boolean;

    touch: boolean;
    msPointer: boolean;
    pointer: boolean;

    retina: boolean;

    /**
     * A string identifying the platform on which
     * the user's browser is running.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform
     */
    platform: string;
};


// As the browser never changes we can cache the result.
let browserInfo = undefined as any as BrowserInfo;


/**
* Utility to detect browser properties.
* Code from leaflet-src.js
*/
export function getBrowserInfo(ignoreCache: boolean = false): BrowserInfo {
    if (ignoreCache === false && browserInfo) {
        return browserInfo;
    }
    const ie = 'ActiveXObject' in window;
    const ieLt9 = ie && !document.addEventListener;
    const ie11 = (
        ie &&
        (window.location.hash as any) === !!(window as any).MSInputMethodContext &&
        !!(document as any).documentMode
    );

    // terrible browser detection to work around
    // Safari / iOS / Android browser bugs
    const ua = navigator.userAgent.toLowerCase();
    const webkit = ua.indexOf('webkit') !== -1;
    const chrome = ua.indexOf('chrome') !== -1;
    const phantomjs = ua.indexOf('phantom') !== -1;
    const android = ua.indexOf('android') !== -1;
    const android23 = ua.search('android [23]') !== -1;
    const gecko = ua.indexOf('gecko') !== -1;

    const mobile = isMobile(window.navigator).any;
    const msPointer = !window.PointerEvent && (window as any).MSPointerEvent;
    const pointer = (
        window.PointerEvent &&
        (window.navigator as any).pointerEnabled &&
        window.navigator.maxTouchPoints
    ) || msPointer;
    const retina = (
        (
            'devicePixelRatio' in window &&
            window.devicePixelRatio > 1
        ) || (
            'matchMedia' in window &&
            window.matchMedia('(min-resolution:144dpi)') &&
            window.matchMedia('(min-resolution:144dpi)').matches
        )
    );

    const doc = document.documentElement;
    const ie3d = ie && ('transition' in doc.style);
    const webkit3d = (
        ('WebKitCSSMatrix' in window) &&
        ('m11' in new window.WebKitCSSMatrix()) &&
        !android23
    );
    const gecko3d = 'MozPerspective' in doc.style;
    const opera3d = 'OTransition' in doc.style;
    const any3d = (
        !(window as any).L_DISABLE_3D &&
        (ie3d || webkit3d || gecko3d || opera3d) &&
        !phantomjs
    );

    const touch = (
        !(window as any).L_NO_TOUCH &&
        !phantomjs && (
            pointer ||
            'ontouchstart' in window ||
            (
                (window as any).DocumentTouch &&
                document instanceof (window as any).DocumentTouch
            )
        )
    );

    browserInfo = {
        ie,
        ie11,
        ieLt9,
        webkit,
        gecko: gecko && !webkit && !(window as any).opera && !ie,

        android,
        android23,

        chrome: chrome,

        ie3d,
        webkit3d,
        gecko3d,
        opera3d,
        any3d,

        mobile,
        mobileWebkit: mobile && webkit,
        mobileWebkit3d: mobile && webkit3d,
        mobileOpera: mobile && (window as any).opera,

        touch,
        msPointer,
        pointer,

        retina,

        platform: navigator.platform
    };
    return browserInfo;
}

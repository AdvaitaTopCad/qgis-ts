import { getBrowserInfo } from ".";

let mockIsMobile = false;
jest.mock('ismobilejs', () => ({
    __esModule: true,
    default: jest.fn(secret => {
        return {
            any: mockIsMobile,
        };
    }),
}));

const navigatorSpy = jest.spyOn(global, 'navigator', 'get');
let mockUserAgent = "foo";
let mockPlatform = "bar";
let mockPointerEnabled: boolean | undefined = undefined;
let mockMaxTouchPoints: number | undefined = undefined;
navigatorSpy.mockImplementation(() => ({
    userAgent: mockUserAgent,
    platform: mockPlatform,
    pointerEnabled: mockPointerEnabled,
    maxTouchPoints: mockMaxTouchPoints
} as unknown as Navigator));

const documentSpy = jest.spyOn(global, 'document', 'get');
let mockDocumentElement = {
    style: {}
};

let mockDocumentMode: string | undefined = undefined;
let mockAddEventListener: string | undefined = undefined;
documentSpy.mockImplementation(() => ({
    documentElement: mockDocumentElement,
    documentMode: mockDocumentMode,
    addEventListener: mockAddEventListener,
} as unknown as Document));

const locationSpy = jest.spyOn((global.window as any), 'location', 'get');
let mockLocationHash: boolean | undefined = undefined;
locationSpy.mockImplementation(() => ({
    hash: mockLocationHash
} as unknown as Location));


beforeEach(() => {
    (global.window as any).location = {
        href: "http://example.com/"
    } as Location;
    Object.assign(navigator, () => ({
        userAgent: "foo",
        platform: "bar",
    }))
});


describe("ie", () => {
    it("should detect IE when ActiveXObject is present", () => {
        (global.window as any).ActiveXObject = "foo";
        expect(getBrowserInfo(true).ie).toBe(true);
    });
    it("should not detect IE when ActiveXObject is not present", () => {
        delete (global.window as any).ActiveXObject;
        expect(getBrowserInfo(true).ie).toBe(false);
    });
});

describe("ie11", () => {
    it.skip("should detect IE11 when hash is true", () => {
        // This one is failing because the mockLocationHash is not
        // picked up by the getBrowserInfo(true) call.
        // As set right now the window.location.hash will show up as ''
        // (empty string).
        // If set with (global.window as any).location.hash`true`
        // it will show up as '#true'.
        (global.window as any).ActiveXObject = "foo";
        (global.window as any).MSInputMethodContext = "foo";
        mockDocumentMode = "foo";
        mockLocationHash = true;
        expect(getBrowserInfo(true).ie11).toBe(true);
    });
});

describe("ieLt9", () => {
    it("should detect ieLt9 when addEventListener is not present", () => {
        (global.window as any).ActiveXObject = "foo";
        mockAddEventListener = undefined;
        expect(getBrowserInfo(true).ieLt9).toBe(true);
    });
    it("should not detect ieLt9 when addEventListener is present", () => {
        (global.window as any).ActiveXObject = "foo";
        mockAddEventListener = "foo";
        expect(getBrowserInfo(true).ieLt9).toBe(false);
    });
});

describe("webkit", () => {
    it("should detect webkit", () => {
        mockUserAgent = "fOo";
        expect(
            getBrowserInfo(true).webkit
        ).toBe(false);
        mockUserAgent = "fOoWEBKIT";
        expect(
            getBrowserInfo(true).webkit
        ).toBe(true);
    });
});

describe("gecko", () => {
    it("should not detect gecko", () => {
        mockUserAgent = "fOo";
        expect(
            getBrowserInfo(true).gecko
        ).toBe(false);
    });
    it("should detect gecko if opera was found", () => {
        mockUserAgent = "fOoGECKO";
        (global.window as any).opera = true;
        delete (global.window as any).ActiveXObject;
        expect(
            getBrowserInfo(true).gecko
        ).toBeFalsy();
    });
    it("should detect gecko if IE was found", () => {
        mockUserAgent = "fOoGECKO";
        (global.window as any).opera = false;
        (global.window as any).ActiveXObject = true;
        expect(
            getBrowserInfo(true).gecko
        ).toBeFalsy();
    });
    it("should not detect gecko if webkit was found", () => {
        mockUserAgent = "GECKO-webkit";
        delete (global.window as any).opera;
        delete (global.window as any).ActiveXObject;
        expect(
            getBrowserInfo(true).gecko
        ).toBeFalsy();
    });
    it("should detect gecko", () => {
        mockUserAgent = "fOoGECKO";
        delete (global.window as any).opera;
        delete (global.window as any).ActiveXObject;
        expect(
            getBrowserInfo(true).gecko
        ).toBe(true);
    });
});

describe("android", () => {
    it("should detect android", () => {
        mockUserAgent = "fOo";
        expect(
            getBrowserInfo(true).android
        ).toBe(false);
        mockUserAgent = "fOoANDROID";
        expect(
            getBrowserInfo(true).android
        ).toBe(true);
    });
});

describe("android23", () => {
    it("should not detect android23", () => {
        mockUserAgent = "fOo";
        expect(
            getBrowserInfo(true).android23
        ).toBe(false);
        mockUserAgent = "fOoANDROID";
        expect(
            getBrowserInfo(true).android23
        ).toBe(false);
    });
    it("should detect android23", () => {
        mockUserAgent = "fOoANDROID 2";
        expect(
            getBrowserInfo(true).android
        ).toBe(true);
        expect(
            getBrowserInfo(true).android23
        ).toBe(true);
        mockUserAgent = "fOoANDROID 3";
        expect(
            getBrowserInfo(true).android
        ).toBe(true);
        expect(
            getBrowserInfo(true).android23
        ).toBe(true);
    });
});

describe("chrome", () => {
    it("should detect chrome", () => {
        mockUserAgent = "fOo";
        expect(
            getBrowserInfo(true).chrome
        ).toBe(false);
        mockUserAgent = "fOoCHROME";
        expect(
            getBrowserInfo(true).chrome
        ).toBe(true);
    });
});

describe("ie3d", () => {
    it("should detect it", () => {
        (global.window as any).ActiveXObject = "foo";
        mockDocumentElement = {
            style: {
                transition: "foo"
            }
        };
        const bp = getBrowserInfo(true);
        expect(bp.ie3d).toBeTruthy();
        expect(bp.any3d).toBeTruthy();
    });
    it("should not detect it if transition is missing", () => {
        mockDocumentElement = {
            style: {}
        };
        (global.window as any).ActiveXObject = "foo";
        expect(
            getBrowserInfo(true).ie3d
        ).toBeFalsy();
    });
    it("should not detect it if ActiveX is missing", () => {
        mockDocumentElement = {
            style: {
                transition: "foo"
            }
        };
        delete (global.window as any).ActiveXObject;
        expect(
            getBrowserInfo(true).ie3d
        ).toBeFalsy();
    });
});

describe("webkit3d", () => {
    it("should not detect it if WebKitCSSMatrix is missing", () => {
        delete (global.window as any).WebKitCSSMatrix;
        expect(
            getBrowserInfo(true).webkit3d
        ).toBeFalsy();
    });
    it("should not detect it if m11 is missing", () => {
        class Xyz { }
        (global.window as any).WebKitCSSMatrix = Xyz;
        expect(
            getBrowserInfo(true).webkit3d
        ).toBeFalsy();
    });
    it("should not detect it if android23", () => {
        class Xyz {
            m11 = 1;
        }
        mockUserAgent = "android 3";
        (global.window as any).WebKitCSSMatrix = Xyz;
        expect(
            getBrowserInfo(true).webkit3d
        ).toBeFalsy();
    });
    it("should detect it", () => {
        class Xyz {
            m11 = 1;
        }
        mockUserAgent = "xxx";
        (global.window as any).WebKitCSSMatrix = Xyz;
        const bp = getBrowserInfo(true);
        expect(bp.webkit3d).toBeTruthy();
        expect(bp.any3d).toBeTruthy();
    });
});

describe("gecko3d", () => {
    it("should detect it", () => {
        mockDocumentElement = {
            style: {
                MozPerspective: "foo"
            }
        };
        const bp = getBrowserInfo(true);
        expect(bp.gecko3d).toBeTruthy();
        expect(bp.any3d).toBeTruthy();
    });
    it("should not detect it", () => {
        mockDocumentElement = {
            style: {}
        };
        expect(
            getBrowserInfo(true).gecko3d
        ).toBeFalsy();
    });
});

describe("opera3d", () => {
    it("should detect it", () => {
        mockDocumentElement = {
            style: {
                OTransition: "foo"
            }
        };
        const bp = getBrowserInfo(true);
        expect(bp.opera3d).toBeTruthy();
        expect(bp.any3d).toBeTruthy();
    });
    it("should not detect it", () => {
        mockDocumentElement = {
            style: {}
        };
        expect(
            getBrowserInfo(true).opera3d
        ).toBeFalsy();
    });
});

describe("any3d", () => {
    it("should detect it", () => {
        (global.window as any).L_DISABLE_3D = false;
        mockDocumentElement = {
            style: {
                OTransition: "foo"
            }
        };
        expect(
            getBrowserInfo(true).any3d
        ).toBeTruthy();
    });
    it("should not detect it", () => {
        (global.window as any).L_DISABLE_3D = true;
        mockDocumentElement = {
            style: {
                OTransition: "foo"
            }
        };
        expect(
            getBrowserInfo(true).any3d
        ).toBeFalsy();
    });
});

describe("mobile", () => {
    it("should detect it", () => {
        mockIsMobile = true;
        expect(
            getBrowserInfo(true).mobile
        ).toBe(true);
    });
    it("should not detect it", () => {
        mockIsMobile = false;
        expect(
            getBrowserInfo(true).mobile
        ).toBe(false);
    });
});

describe("mobileWebkit", () => {
    it("should detect it if user agent is webkit", () => {
        mockIsMobile = true;
        mockUserAgent = 'webkit';
        expect(
            getBrowserInfo(true).mobileWebkit
        ).toBeTruthy();
    });
    it("should not detect it not on mobile", () => {
        mockIsMobile = false;
        expect(
            getBrowserInfo(true).mobileWebkit
        ).toBe(false);
    });
    it("should not detect it not on webkit", () => {
        mockIsMobile = true;
        mockUserAgent = 'other-kit';
        expect(
            getBrowserInfo(true).mobileWebkit
        ).toBe(false);
    });
});

describe("mobileWebkit3d", () => {
    it("should not detect it if not on mobile", () => {
        mockIsMobile = false;
        expect(
            getBrowserInfo(true).mobileWebkit3d
        ).toBeFalsy();
    });
    it("should not detect it if WebKitCSSMatrix is missing", () => {
        mockIsMobile = true;
        mockUserAgent = "xxx";
        delete (global.window as any).WebKitCSSMatrix;
        expect(
            getBrowserInfo(true).mobileWebkit3d
        ).toBeFalsy();
    });
    it("should not detect it if m11 is missing", () => {
        class Xyz { }
        mockIsMobile = true;
        mockUserAgent = "xxx";
        (global.window as any).WebKitCSSMatrix = Xyz;
        expect(
            getBrowserInfo(true).mobileWebkit3d
        ).toBeFalsy();
    });
    it("should not detect it if android23", () => {
        class Xyz {
            m11 = 1;
        }
        mockIsMobile = true;
        mockUserAgent = "android 2";
        (global.window as any).WebKitCSSMatrix = Xyz;
        expect(
            getBrowserInfo(true).mobileWebkit3d
        ).toBeFalsy();
    });
    it("should detect it", () => {
        class Xyz {
            m11 = 1;
        }
        mockIsMobile = true;
        mockUserAgent = "xxx";
        (global.window as any).WebKitCSSMatrix = Xyz;
        expect(
            getBrowserInfo(true).mobileWebkit3d
        ).toBeTruthy();
    });
});

describe("mobileOpera", () => {
    it("should detect it if opera is in window object", () => {
        mockIsMobile = true;
        (global.window as any).opera = true;
        expect(
            getBrowserInfo(true).mobileOpera
        ).toBeTruthy();
    });
    it("should not detect it if mobile or opera are missing", () => {
        mockIsMobile = false;
        expect(
            getBrowserInfo(true).mobileOpera
        ).toBeFalsy();
        mockIsMobile = true;
        (global.window as any).opera = false;
        expect(
            getBrowserInfo(true).mobileOpera
        ).toBeFalsy();
    });
});

describe("touch", () => {
    class Xyz { }

    it("should not detect it if L_NO_TOUCH", () => {
        (global.window as any).L_NO_TOUCH = true;
        expect(
            getBrowserInfo(true).touch
        ).toBeFalsy();
    });
    it("should not detect it if user-agent is phantom", () => {
        (global.window as any).L_NO_TOUCH = false;
        mockUserAgent = "PHANTOM";
        expect(
            getBrowserInfo(true).touch
        ).toBeFalsy();
    });
    it("should detect it if there is a pointer", () => {
        (global.window as any).L_NO_TOUCH = false;
        mockUserAgent = "non-ph";
        (global.window as any).PointerEvent = true;
        mockPointerEnabled = true;
        mockMaxTouchPoints = 1;
        delete (global.window as any).ontouchstart;
        delete (global.window as any).DocumentTouch;
        expect(
            getBrowserInfo(true).touch
        ).toBeTruthy();
    });
    it("should detect it if ontouchstart is found", () => {
        (global.window as any).L_NO_TOUCH = false;
        mockUserAgent = "non-ph";
        (global.window as any).PointerEvent = false;
        (global.window as any).ontouchstart = true;
        (global.window as any).DocumentTouch = true;
        expect(
            getBrowserInfo(true).touch
        ).toBeTruthy();
    });
    it("should not detect it if DocumentTouch is of wrong type", () => {
        (global.window as any).L_NO_TOUCH = false;
        mockUserAgent = "non-ph";
        (global.window as any).PointerEvent = false;
        delete (global.window as any).ontouchstart;
        (global.window as any).DocumentTouch = Xyz;
        expect(
            getBrowserInfo(true).touch
        ).toBeFalsy();
    });
    it("should not detect it if DocumentTouch is of right type", () => {
        (global.window as any).L_NO_TOUCH = false;
        mockUserAgent = "non-ph";
        (global.window as any).PointerEvent = false;
        delete (global.window as any).ontouchstart;
        (global.window as any).DocumentTouch = Xyz;
        global.document = new Xyz() as unknown as Document;
        expect(
            getBrowserInfo(true).touch
        ).toBeFalsy();
    });
});

describe("msPointer", () => {
    it("should not detect it if PointerEvent is present", () => {
        (global.window as any).PointerEvent = true;
        expect(
            getBrowserInfo(true).msPointer
        ).toBeFalsy();
    });
    it("should not detect it if MSPointerEvent is missing", () => {
        (global.window as any).PointerEvent = true;
        delete (global.window as any).MSPointerEvent;
        expect(
            getBrowserInfo(true).msPointer
        ).toBeFalsy();
    });
    it("should detect it all are true", () => {
        (global.window as any).PointerEvent = true;
        (global.window as any).MSPointerEvent = true;
        expect(
            getBrowserInfo(true).msPointer
        ).toBeFalsy();
    });
});

describe("pointer", () => {
    describe("using msPointer", () => {
        it("should not detect it if MSPointerEvent is missing", () => {
            delete (global.window as any).PointerEvent;
            delete (global.window as any).MSPointerEvent;
            expect(
                getBrowserInfo(true).pointer
            ).toBeFalsy();
        });
        it("should detect it all are true", () => {
            delete (global.window as any).PointerEvent;
            (global.window as any).MSPointerEvent = true;
            expect(
                getBrowserInfo(true).pointer
            ).toBeTruthy();
        });
    });
    describe("using plain Pointer", () => {
        it("should not detect it if PointerEvent is missing", () => {
            delete (global.window as any).MSPointerEvent;
            delete (global.window as any).PointerEvent;

            expect(
                getBrowserInfo(true).pointer
            ).toBeFalsy();
        });
        it("should not detect it if pointerEnabled is falsy", () => {
            delete (global.window as any).MSPointerEvent;
            (global.window as any).PointerEvent = true;
            mockPointerEnabled = false;
            expect(
                getBrowserInfo(true).pointer
            ).toBeFalsy();
        });
        it("should not detect it if maxTouchPoints is falsy", () => {
            delete (global.window as any).MSPointerEvent;
            (global.window as any).PointerEvent = true;
            mockPointerEnabled = true;
            mockMaxTouchPoints = 0;
            expect(
                getBrowserInfo(true).pointer
            ).toBeFalsy();
        });
        it("should detect it if iff all are true", () => {
            delete (global.window as any).MSPointerEvent;
            (global.window as any).PointerEvent = true;
            mockPointerEnabled = true;
            mockMaxTouchPoints = 1;
            expect(
                getBrowserInfo(true).pointer
            ).toBeTruthy();
        });
    });
});

describe("retina", () => {
    describe("using devicePixelRatio", () => {
        beforeEach(() => { delete (global.window as any).matchMedia; });
        it("should detect it if devicePixelRatio > 1", () => {
            (global.window as any).devicePixelRatio = 2;
            expect(
                getBrowserInfo(true).retina
            ).toBe(true);
        });
        it("should not detect it if devicePixelRatio is missing", () => {
            delete (global.window as any).devicePixelRatio;
            expect(
                getBrowserInfo(true).retina
            ).toBe(false);
        });
        it("should not detect it if devicePixelRatio is 1", () => {
            (global.window as any).devicePixelRatio = 1;
            expect(
                getBrowserInfo(true).retina
            ).toBe(false);
        });
    });
    describe("using matchMedia", () => {
        beforeEach(() => { delete (global.window as any).devicePixelRatio; });
        it("should not detect it if matchMedia is missing", () => {
            delete (global.window as any).matchMedia;
            expect(
                getBrowserInfo(true).retina
            ).toBeFalsy();
        });
        it("should not detect it if matchMedia returns falsy", () => {
            (global.window as any).matchMedia = () => (
                undefined as unknown as MediaQueryList
            )
            expect(
                getBrowserInfo(true).retina
            ).toBeFalsy();
        });
        it("should not detect it if matches returns falsy", () => {
            (global.window as any).matchMedia = () => ({
                matches: false
            } as unknown as MediaQueryList);
            expect(
                getBrowserInfo(true).retina
            ).toBeFalsy();
        });
        it("should detect it if matches returns truthy", () => {
            (global.window as any).matchMedia = () => ({
                matches: true
            } as unknown as MediaQueryList);
            expect(
                getBrowserInfo(true).retina
            ).toBeTruthy();
        });
    });
});

describe("platform", () => {
    it("should detect it", () => {
        expect(
            getBrowserInfo(true).platform
        ).toBe("bar");
    });
});

/* eslint-disable require-await */
(async () => {
    const featureDetectionMap = {
        419413: {
            name: 'Web Bluetooth API',
            supported: async () => 'bluetooth' in navigator,
        },
        492204: {
            name: 'WebUSB API',
            supported: async () => 'usb' in navigator,
        },
        903010: {
            name: 'Web Share API Level 2',
            supported: async () => 'canShare' in navigator,
        },
        150835: {
            name: 'Async Clipboard: Read and Write Images',
            supported: async () =>
                'clipboard' in navigator && 'write' in navigator.clipboard,
        },
        895854: {
            name: 'Get Installed Related Apps API',
            supported: async () => 'getInstalledRelatedApps' in navigator,
        },
        925297: {
            name: 'Periodic Background Sync',
            supported: async () => 'PeriodicSyncManager' in self,
        },
        897298: {
            name: 'Compression codecs',
            supported: async () => 'CompressionStream' in self,
        },
        860467: {
            name: 'Contacts API',
            supported: async () => 'contacts' in navigator,
        },
        719176: {
            name: 'Badging API',
            supported: async () => 'setAppBadge' in navigator,
        },
        897312: {
            name: 'Web Bluetooth Scanning',
            supported: async () =>
                'bluetooth' in navigator &&
                'requestLEScan' in navigator.bluetooth,
        },
        897309: {
            name: 'EyeDropper API',
            supported: async () => 'EyeDropper' in self,
        },
        659138: {
            name: 'Barcode Detection API',
            supported: async () => 'BarcodeDetector' in self,
        },
        670299: {
            name: 'WebOTP',
            supported: async () => 'OTPCredential' in self,
        },
        257511: {
            name: 'Screen Wake Lock API',
            supported: async () => 'wakeLock' in navigator,
        },
        853326: {
            name: 'File System Access',
            supported: async () => 'showOpenFilePicker' in self,
        },
        982379: {
            name: 'PointerLock unadjustedMovement',
            needClick: true,
            supported: async () =>
                (async () => {
                    try {
                        const p = document.createElement('p');
                        const res = await p.requestPointerLock({ unadjustedMovement: true });
                        return !!res;
                    } catch {
                        return false;
                    }
                })(),
        },
        934063: {
            name: 'Pan/Tilt support for Camera',
            supported: async () => {
                const supports =
                    navigator.mediaDevices.getSupportedConstraints();
                return supports.pan && supports.tilt && supports.zoom;
            },
        },
        520391: {
            name: 'Web NFC',
            supported: async () => 'NDEFReader' in self,
        },
        1275576: {
            name: 'Web NFC: NDEFReader makeReadOnly()',
            // eslint-disable-next-line no-undef
            supported: async () => 'NDEFReader' in self && 'makeReadOnly' in new NDEFReader(),
        },
        890096: {
            name: 'WebHID (Human Interface Device)',
            supported: async () => 'hid' in navigator,
        },
        884928: {
            name: 'Web Serial API',
            supported: async () => 'serial' in navigator,
        },
        1207667: {
            name: 'Handwriting Recognition API',
            supported: async () => 'queryHandwritingRecognizerSupport' in navigator,
        },
        897302: {
            name: 'Run PWA on OS Login',
            supported: async () => 'runOnOsLogin' in navigator,
        },
        897297: {
            name: 'WebCodecs',
            supported: async () => 'MediaStreamTrackProcessor' in self,
        },
        1141849: {
            name: 'Managed configuration for Web Applications',
            supported: async () => 'managed' in navigator && 'getManagedConfiguration' in navigator.managed,
        },
        878979: {
            name: 'Idle Detection',
            supported: async () => 'IdleDetector' in self,
        },
        1011392: {
            name: 'WebTransport',
            supported: async () => 'WebTransport' in self,
        },
        897300: {
            name: 'Multi-Screen Window Placement',
            supported: async () => 'getScreens' in self,
        },
        937121: {
            name: 'Window Controls Overlay for Installed Desktop Web Apps',
            supported: async () => 'windowControlsOverlay' in navigator,
        },
        829689: {
            name: 'File Handling',
            // eslint-disable-next-line no-undef
            supported: async () => 'launchQueue' in self && 'files' in LaunchParams.prototype,
        },
        535764: {
            name: 'Local Font Access',
            supported: async () => 'queryLocalFonts' in self,
        },
        606766: {
            name: 'Ambient Light Sensor API',
            supported: async () => 'AmbientLightSensor' in self,
        },
        1067627: {
            name: 'Compute Pressure',
            supported: async () => 'ComputePressureObserver' in self,
        },
        1066842: {
            name: 'Device Posture API',
            supported: async () => 'devicePosture' in navigator,
        },
        1006642: {
            name: 'Lock Screen API',
            supported: async () => 'getLockScreenData' in self,
        },
        983030: {
            name: 'WebSocketStream',
            supported: async () => 'WebSocketStream' in self,
        },
        1216187: {
            name: 'AudioContext.setSinkId()',
            supported: async () => 'Audio' in self && 'setSinkId' in Audio.prototype,
        },
        1291639: {
            name: 'Keyboard Lock API',
            supported: async () => 'keyboard' in navigator && 'lock' in navigator.keyboard,
        },
        897317: {
            name: 'Proximity sensor',
            supported: async () => 'ProximitySensor' in self,
        },
        973844: {
            name: 'Content Indexing API',
            supported: async () =>
                'serviceWorker' in navigator &&
                'index' in
                    (await navigator.serviceWorker.ready ||
                        self.registration),
        },
    };

    const clickFeatures = [];

    const cards = document.querySelectorAll('.card');
    Array.from(cards).forEach(async (card) => {
        const id = Number(card.id);
        if (!id) {
            return;
        }

        const feature = featureDetectionMap[id];
        if (!feature) {
            setStatus(card, 'Unknown');
            return;
        }


        if (feature.needClick) {
            clickFeatures.push([feature, card]);
            setStatus(card, 'Unknown');
            return;
        }

        processFeature(feature, card);
    });

    async function processFeature(feature, card) {
        try {
            const isSupported = await feature.supported();
            if (isSupported) {
                setStatus(card, 'Yes');
                card.classList.add('card--success');
            } else {
                setStatus(card, 'No');
                card.classList.add('card--fail');
            }
        } catch (e) {
            setStatus(card, 'Unknown');
        }
    }

    function setStatus(card, status) {
        card.querySelector('.card__status').innerHTML = status;
    }

    document.addEventListener('click', function() {
        clickFeatures.forEach(([feature, card]) => {
            processFeature(feature, card);
        });
    });
})();

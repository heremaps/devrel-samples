export declare function hds(): void;
declare global {
    interface Window {
        hds: {
            disableAutoCustomElementsDefine?: boolean;
            tryGetBeforeCustomElementsDefine?: boolean;
        };
    }
}

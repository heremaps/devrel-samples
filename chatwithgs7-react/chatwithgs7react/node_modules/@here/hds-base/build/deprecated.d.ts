export interface Warner {
    (): void;
}
export declare type DeprecatedDecorator = ClassDecorator & PropertyDecorator;
export interface DeprecatedOptions {
    alternative?: string;
    version?: string;
    url?: string;
}
/**
 * Decorator to flag a Class, Method, Property or Function as Deprecated
 * It accepts 3 arguments:
 *    - `alternative` A string with the name of the alternative to be used instead
 *    - `version` Since which version is deprecated
 *    - `url` Link to more information
 * @param options Object with the properties of `alternative`, `version` and `url`
 * @example
 * ```
 * @customElement('hds-tag')
 * @deprecated({
 *   alternative: '@here/hds-chip',
 *   version: '1.1.2',
 *   url: 'https://url.to.storybook.here.com'
 * })
 * export class Tag extends TagBase {
 *   static styles = styles;
 * }
 * ```
 * It logs in the console a message like
 * ```
 * Component `Tag` has been deprecated since version 1.1.2, use `@here/hds-chip` instead.
 * at http://localhost:6006/vendors~main.3ac2f736246dd0305b2f.bundle.js:61967:134
 * Check out https://url.to.storybook.here.com.
 * ```
 */
export declare function deprecated(options?: DeprecatedOptions): DeprecatedDecorator;
export declare function deprecated<T extends Function>(alternative: string, version: string, fn: T): T;
/**
 * Decorator to flag a Class, Method, Property or Function as Deprecated
 * It accepts 3 arguments:
 *    - `alternative` A string with the name of the alternative to be used instead
 *    - `version` Since which version is deprecated
 *    - `url` Link to more information
 * @param alternative Alternative element (class, property or method) to be used instead
 * @param version Version since when the element is depreacted
 * @param url Link with more information about the component or deprecation
 * @example
 * ```
 * @customElement('hds-tag')
 * @deprecated('@here/hds-chip', '1.1.2', 'https://url.to.storybook.here.com')
 * export class Tag extends TagBase {
 *   static styles = styles;
 * }
 * ```
 * It logs in the console a message like
 * ```
 * Component `Tag` has been deprecated since version 1.1.2, use `@here/hds-chip` instead.
 * at http://localhost:6006/vendors~main.3ac2f736246dd0305b2f.bundle.js:61967:134
 * Check out https://url.to.storybook.here.com.
 * ```
 */
export declare function deprecated(alternative?: string, version?: string, url?: string): DeprecatedDecorator;
/**
 * Decorator to flag a Class, Method, Property or Function as Deprecated
 * It accepts 3 arguments:
 *    - `alternative` A string with the name of the alternative to be used instead
 *    - `version` Since which version is deprecated
 *    - `url` Link to more information
 * @param options Object with the properties of `alternative`, `version` and `url`
 * @example
 * ```
 * @customElement('hds-tag')
 * @deprecated({
 *   alternative: '@here/hds-chip',
 *   version: '1.1.2',
 *   url: 'https://url.to.storybook.here.com'
 * })
 * export class Tag extends TagBase {
 *   static styles = styles;
 * }
 * ```
 * It logs in the console a message like
 * ```
 * Component `Tag` has been deprecated since version 1.1.2, use `@here/hds-chip` instead.
 * at http://localhost:6006/vendors~main.3ac2f736246dd0305b2f.bundle.js:61967:134
 * Check out https://url.to.storybook.here.com.
 * ```
 */
export declare function deprecated<T extends Function>(fn: T): T;
/**
 * Decorator to flag a Class, Method, Property or Function as Deprecated
 * It accepts 3 arguments:
 *    - `alternative` A string with the name of the alternative to be used instead
 *    - `version` Since which version is deprecated
 *    - `url` Link to more information
 * @param options Object with the properties of `alternative`, `version` and `url`
 * @param fn Function that is deprecated
 * @example
 * ```
 * @customElement('hds-tag')
 * @deprecated({
 *   alternative: '@here/hds-chip',
 *   version: '1.1.2',
 *   url: 'https://url.to.storybook.here.com'
 * })
 * export class Tag extends TagBase {
 *   static styles = styles;
 * }
 * ```
 * It logs in the console a message like
 * ```
 * Component `Tag` has been deprecated since version 1.1.2, use `@here/hds-chip` instead.
 * at http://localhost:6006/vendors~main.3ac2f736246dd0305b2f.bundle.js:61967:134
 * Check out https://url.to.storybook.here.com.
 * ```
 */
export declare function deprecated<T extends Function>(options: DeprecatedOptions, fn: T): T;
/**
 * Decorator to flag a Class, Method, Property or Function as Deprecated
 * It accepts 3 arguments:
 *    - `alternative` A string with the name of the alternative to be used instead
 *    - `version` Since which version is deprecated
 *    - `url` Link to more information
 * @param alternative Alternative element (class, property or method) to be used instead
 * @param fn Function that is deprecated
 * @example
 * ```
 * @customElement('hds-tag')
 * @deprecated('@here/hds-chip')
 * export class Tag extends TagBase {
 *   static styles = styles;
 * }
 * ```
 * It logs in the console a message like
 * ```
 * Component `Tag` has been deprecated since version 1.1.2, use `@here/hds-chip` instead.
 * at http://localhost:6006/vendors~main.3ac2f736246dd0305b2f.bundle.js:61967:134
 * Check out https://url.to.storybook.here.com.
 * ```
 */
export declare function deprecated<T extends Function>(alternative: string, fn: T): T;
/**
 * Decorator to flag a Class, Method, Property or Function as Deprecated
 * It accepts 3 arguments:
 *    - `alternative` A string with the name of the alternative to be used instead
 *    - `version` Since which version is deprecated
 *    - `url` Link to more information
 * @param alternative Alternative element (class, property or method) to be used instead
 * @param version Version since when the element is deprecated
 * @example
 * ```
 * @customElement('hds-tag')
 * @deprecated('@here/hds-chip', '1.1.2')
 * export class Tag extends TagBase {
 *   static styles = styles;
 * }
 * ```
 * It logs in the console a message like
 * ```
 * Component `Tag` has been deprecated since version 1.1.2, use `@here/hds-chip` instead.
 * at http://localhost:6006/vendors~main.3ac2f736246dd0305b2f.bundle.js:61967:134
 * Check out https://url.to.storybook.here.com.
 * ```
 */
export declare function deprecated<T extends Function>(alternative: string, version: string, fn: T): T;
/**
 * Decorator to flag a Class, Method, Property or Function as Deprecated
 * It accepts 3 arguments:
 *    - `alternative` A string with the name of the alternative to be used instead
 *    - `version` Since which version is deprecated
 *    - `url` Link to more information
 * @param alternative Alternative element (class, property or method) to be used instead
 * @param version Version since when the element is depreacted
 * @param url Link with more information about the component or deprecation
 * @example
 * ```
 * @customElement('hds-tag')
 * @deprecated('@here/hds-chip', '1.1.2', 'https://url.to.storybook.here.com')
 * export class Tag extends TagBase {
 *   static styles = styles;
 * }
 * ```
 * It logs in the console a message like
 * ```
 * Component `Tag` has been deprecated since version 1.1.2, use `@here/hds-chip` instead.
 * at http://localhost:6006/vendors~main.3ac2f736246dd0305b2f.bundle.js:61967:134
 * Check out https://url.to.storybook.here.com.
 * ```
 */
export declare function deprecated<T extends Function>(alternative: string, version: string, url: string, fn: T): T;
export default deprecated;

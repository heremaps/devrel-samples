/* eslint-disable prefer-destructuring, no-shadow,  no-param-reassign, @typescript-eslint/ban-types, no-redeclare, func-names, @typescript-eslint/no-explicit-any, prefer-rest-params, @typescript-eslint/no-non-null-assertion */
function createWarner(type, name, alternative, version, url) {
    const warnedPositions = {};
    return () => {
        const stack = new Error().stack || '';
        let at = (stack.match(/(?:\s+at\s.+){2}\s+at\s(.+)/) || [undefined, ''])[1];
        if (at) {
            if (/\)$/.test(at)) {
                at = at.match(/[^(]+(?=\)$)/)[0];
            }
            else {
                at = at.trim();
            }
            if (at in warnedPositions) {
                return;
            }
            warnedPositions[at] = true;
        }
        let message = '';
        // eslint-disable-next-line default-case
        switch (type) {
            case 'class':
                message = 'Component';
                break;
            case 'property':
                message = 'Property';
                break;
            case 'method':
                message = 'Event';
                break;
            case 'function':
                message = 'Function';
                break;
        }
        message += ` \`${name}\` has been deprecated`;
        if (version) {
            message += ` since version ${version}`;
        }
        if (alternative) {
            message += `, use \`${alternative}\` instead`;
        }
        message += '.';
        if (at) {
            message += `\n    at ${at}`;
        }
        if (url) {
            message += `\nCheck out ${url} for more information.`;
        }
        // eslint-disable-next-line no-console
        console.warn(message);
    };
}
function decorateProperty(type, name, descriptor, alternative, version, url) {
    const warner = createWarner(type, name, alternative, version, url);
    descriptor = descriptor || {
        writable: true,
        enumerable: false,
        configurable: true,
    };
    const deprecatedDescriptor = {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
    };
    if (descriptor.get || descriptor.set) {
        if (descriptor.get) {
            deprecatedDescriptor.get = function () {
                warner();
                return descriptor.get.call(this);
            };
        }
        if (descriptor.set) {
            deprecatedDescriptor.set = function (value) {
                warner();
                return descriptor.set.call(this, value);
            };
        }
    }
    else {
        let propertyValue = descriptor.value;
        deprecatedDescriptor.get = function () {
            warner();
            return propertyValue;
        };
        if (descriptor.writable) {
            deprecatedDescriptor.set = function (value) {
                warner();
                propertyValue = value;
            };
        }
    }
    return deprecatedDescriptor;
}
function decorateFunction(type, target, alternative, version, url) {
    const { name } = target;
    const warner = createWarner(type, name, alternative, version, url);
    const fn = function () {
        warner();
        return target.apply(this, arguments);
    };
    for (const propertyName of Object.getOwnPropertyNames(target)) {
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyName);
        if (descriptor.writable) {
            fn[propertyName] = target[propertyName];
        }
        else if (descriptor.configurable) {
            Object.defineProperty(fn, propertyName, descriptor);
        }
    }
    return fn;
}
export function deprecated(...args) {
    let fn = args[args.length - 1];
    if (typeof fn === 'function') {
        fn = args.pop();
    }
    else {
        fn = undefined;
    }
    const options = args[0];
    let alternative = '';
    let version = '';
    let url = '';
    if (typeof options === 'string') {
        alternative = options;
        version = args[1];
        url = args[2];
    }
    else if (options) {
        ({ alternative, version, url } = options);
    }
    if (fn) {
        return decorateFunction('function', fn, alternative, version, url);
    }
    return (target, name, descriptor) => {
        if (typeof name === 'string') {
            const type = descriptor && typeof descriptor.value === 'function' ? 'method' : 'property';
            return decorateProperty(type, name, descriptor, alternative, version, url);
        }
        if (typeof target === 'function') {
            const { name } = target;
            const warner = createWarner('class', name, alternative, version, url);
            return class extends target {
                constructor(...args) {
                    warner();
                    super(...args);
                }
            };
        }
        return target;
    };
}
export default deprecated;
//# sourceMappingURL=deprecated.js.map
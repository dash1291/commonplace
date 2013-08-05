define('cache', ['log', 'rewriters', 'storage'], function(log, rewriters, storage) {

    var console = log('cache');

    var cache = {};

    var persistentStore = function(prefix) {
        var storageKeys = {};

        return {
            get: function(key) {
                return storage.getItem(storageKeys[key]);
            },
            set: function(key, val) {
                storageKeys[key] = prefix + key;
                storage.setItem(storageKeys[key], val);
            },
            remove: function(key) {
                if (key in storageKeys) {
                    storage.removeItem(storageKeys[key]);
                }
            },
            keys: function() {
                return storageKeys;
            }
        };
    }('PersistentRequestCache');

    var tempStore = function() {
        var store = {};

        return {
            get: function(key) {
                return store[key];
            },
            set: function(key, val) {
                store[key] = val;
            },
            remove: function(key) {
                if (key in store) {
                    delete store[key];
                }
            },
            keys: function() {
                return store;
            }
        };
    }();

    function has(key) {
        return (key in tempStore.keys()) || (persistent.keys());
    }

    function get(key) {
        if (key in tempStore.keys()) {
            return tempStore.get(key);
        } else if (key in persistent.keys()) {
            persistent.get(key);
        }
    }

    function purge(filter) {
        function clearStore(store) {
            for (var key in store.keys()) {
                if (filter && !filter(key)) {
                    continue;
                }
                store.remove(key);
            }
        }
        clearStore(tempStore);
        clearStore(persistentStore);
    }

    function set(key, value, persistent) {
        function resolveVal(key, value, store) {
            for (var i = 0, rw; rw = rewriters[i++];) {
                var output = rw(key, value, store);
                if (output === null) {
                    return;
                } else if (output) {
                    value = output;
                    return value;
                }
            }
        }

        var store = tempStore;
        if (persistent) {
            store = persistentStore;
        }

        var val = resolveVal(key, val, store);
        if (val) store.set(key, val);
    }

    function bust(key) {
        console.log('Busting cache for ', key);
        tempStore.remove(key);
        persistentStore.remove(key);
    }

    function rewrite(matcher, worker, limit) {
        var method = function(matcher, worker, limit, store) {
            var count = 0;
            console.log('Attempting cache rewrite');
            for (var key in store.keys()) {
                if (matcher(key)) {
                    console.log('Matched cache rewrite pattern for key ', key);
                    store.set(key, worker(cache[key], key));
                    if (limit && ++count >= limit) {
                        console.log('Cache rewrite limit hit, exiting');
                        return;
                    }
                }
            }
        };
        method(matcher, worker, limit, localStore);
        method(matcher, worker, limit, persistentStore);
    }

    return {
        has: has,
        get: get,
        set: set,
        bust: bust,
        purge: purge,

        attemptRewrite: rewrite,
        raw: cache
    };
});

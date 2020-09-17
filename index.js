'use strict';

var React = require('react');

function useAsyncEffect(effect, destroy, inputs) {
  var hasDestroy = typeof destroy === 'function';

  var isMounted = React.useRef(true);

  React.useEffect(function() {
    return function() {
      isMounted.current = false;
    };
  }, []);

  React.useEffect(
    function() {
      var result;
      var maybePromise = effect(function() {
        return isMounted.current;
      });

      Promise.resolve(maybePromise).then(function(value) {
        result = value;
      });

      return function() {
        if (hasDestroy) {
          destroy(result);
        }
      };
    },
    hasDestroy ? inputs : destroy
  );
}

module.exports = useAsyncEffect;
module.exports.useAsyncEffect = useAsyncEffect;

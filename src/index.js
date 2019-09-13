import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Notification({ amount }) {
  useEffect(() => {
    document.title = `${amount} notifications`;
  }, [amount]);

  return (
    <p>
      You have <em>{amount}</em> notifications
    </p>
  );
}

function App() {
  const [notifications, incrementNotifications] = React.useReducer(
    n => n + 1,
    0
  );

  useInterval(incrementNotifications, 100);

  return (
    <div>
      <p>Click one of the links and reload to change the mode</p>
      <nav>
        <ul>
          <li>
            <a href="#legacy">legacy mode</a>
          </li>
          <li>
            <a href="#sync">sync mode</a>
          </li>
          <li>
            <a href="#concurrent">concurrent mode</a>
          </li>
        </ul>
      </nav>
      <Notification amount={notifications} />
    </div>
  );
}

/**
 * @type {'legacy' | 'sync' | 'concurrent'}
 */
const mode = window.location.hash.slice(1) || "concurrent";

if (mode === "legacy") {
  ReactDOM.render(<App />, document.getElementById("root"));
} else if (mode === "sync") {
  const root = ReactDOM.unstable_createSyncRoot(
    document.getElementById("root")
  );
  root.render(<App />);
} else if (mode === "concurrent") {
  const root = ReactDOM.unstable_createRoot(document.getElementById("root"));
  root.render(<App />);
} else {
  throw new TypeError(`unrecognized mode '${mode}'`);
}

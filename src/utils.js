import {
  useEffect,
  useRef
} from 'react'
/*
Jaetaan tämä pätkä oppilaille pastebiniin https://pastebin.com/
Thanks Dan Abramov for useInterval hook
https://overreacted.io/making-setinterval-declarative-with-react-hooks/
This useInterval Hook sets up an interval and clears it after unmounting.
It’s a combo of setInterval and clearInterval tied to the component lifecycle.
*/
export const useInterval = (callback, delay) => {
  const savedCallback = useRef()
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
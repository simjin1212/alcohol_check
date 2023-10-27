import * as tf from "@tensorflow/tfjs";
import React from "react";

export function useTensorFlowModel(modelKind: any) {
  const [model, setModel] = React.useState(null);

  const isMounted = React.useRef(true);

  React.useEffect((): any => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  React.useEffect(() => {
    setModel(null);
    modelKind.load().then((model: any) => {
      if (isMounted.current) {
        setModel(model);
      }
    });
  }, [modelKind]);

  return model;
}

export function useTensorFlowLoaded() {
  const [isLoaded, setLoaded] = React.useState(false);

  React.useEffect((): any => {
    let isMounted = true;
    tf.ready().then(() => {
      if (isMounted) {
        setLoaded(true);
      }
    });
    return () => (isMounted = false);
  }, []);

  return isLoaded;
}

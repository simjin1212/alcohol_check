import * as posenet from "@tensorflow-models/posenet";
import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

import Canvas from "react-native-canvas";
import { CustomTensorCamera } from "./CustomTensorCamera";
import { LoadingView } from "./LoadingView";
import { TensorKeypoint } from "./tenser-types";
import { useTensorFlowModel } from "./useTensorFlow";
import { check_HandsUp, check_O, check_X } from "./pose-validation";

export function ModelView() {
  const model = useTensorFlowModel(posenet);
  const [predictions, setPredictions] = React.useState([]);

  if (!model) {
    return <LoadingView message="Loading TensorFlow model" />;
  }

  return (
    <View style={{ flex: 1, borderColor: "blue" }}>
      {/* <PredictionList predictions={predictions} /> */}
      {/* <View style={{ borderRadius: 20, overflow: "hidden" }}> */}
      <ModelCamera
        model={model}
        predictions={predictions}
        setPredictions={setPredictions}
      />
      {/* </View> */}
    </View>
  );
}

function ModelCamera({ model, setPredictions, predictions }: any) {
  const raf = React.useRef(null);
  const size = useWindowDimensions();

  const canvasRef = useRef<Canvas | null>(null);

  const [tensorXyPostion, setTensorXyPostion] = useState<TensorKeypoint[]>([]);

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(Number(raf.current));
    };
  }, []);

  const onReady = React.useCallback(
    (images: any) => {
      const loop = async () => {
        const nextImageTensor = images.next().value;

        // const predictions = await model.posenet.predictions(nextImageTensor);
        const predictions = await model.estimateSinglePose(nextImageTensor, {
          flipHorizontal: false,
        });
        // const predictions = await model.classify(nextImageTensor);
        // drawMultiplePosesResults();
        await setPredictions(predictions);

        // @ts-ignore
        raf.current = requestAnimationFrame(loop);
      };
      loop();
    },
    [setPredictions, setTensorXyPostion]
  );

  const onCanvasDraw = (canvas: Canvas, tensorXyPostion: TensorKeypoint[]) => {
    const canvasWidth = size.width;
    const canvasHeight = size.height - 180;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (canvas === null) return;
    if (!tensorXyPostion) return;

    for (let i = 0; i < 17; i++) {
      let el = tensorXyPostion[i];
      if (!el) return;
      ctx.fillStyle = "red"; // 점의 색상
      ctx.beginPath();

      // const canvasX = el.position?.x ?? 0 * canvas.width;
      // const canvasY = el.position?.y ?? 0 * canvas.height;

      // TODO:: posenet이 가운데를 0,0 으로 인식하는거로 추정 그로인한 좌표계산
      const canvasX = canvas.width / 2;
      const canvasY = canvas.height / 2;
      if (el.position?.x === undefined) return;
      if (el.position?.y === undefined) return;
      const x = canvasX - el.position?.x;
      const y = canvasY + el.position?.y;

      console.log("x", x);
      console.log("y", y);
      if (el?.score ?? 0 > 0.9) {
        ctx.arc(x, y, 5, 0, 2 * Math.PI); // 점의 중심 좌표와 반지름
      }
      ctx.fill();
    }

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    // if (check_HandsUp(predictions)) return;
    // if (check_O(predictions)) return;
    // if (check_X(predictions)) return;
    setTensorXyPostion(predictions.keypoints);
    if (canvasRef.current) {
      onCanvasDraw(canvasRef.current, tensorXyPostion);
    }
  }, [predictions]);

  return React.useMemo(
    () => (
      <View style={styles.container}>
        <CustomTensorCamera
          width={size.width}
          style={styles.camera}
          // @ts-ignore
          type={Camera.Constants.Type.back}
          onReady={onReady}
          autorender
        />
        <Canvas ref={canvasRef} style={styles.overlayCanvas} />
      </View>
    ),
    [onReady, size.width]
  );
}

const styles = StyleSheet.create({
  camera: {
    zIndex: 0,
  },
  overlayCanvas: {
    position: "absolute", // 절대 위치 설정
    zIndex: 9999,
    top: 0,
    left: 0,
    flex: 1,
  },
  container: {
    position: "relative",
    flex: 1,
  },
});

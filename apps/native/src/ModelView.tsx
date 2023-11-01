import * as posenet from "@tensorflow-models/posenet";
import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { CustomTensorCamera } from "./CustomTensorCamera";
import { LoadingView } from "./LoadingView";
import { PredictionList } from "./PredictionList";
import { useTensorFlowModel } from "./useTensorFlow";
import Canvas from "react-native-canvas";
import { TensorKeypoint } from "./tenser-types";

export function ModelView() {
  const model = useTensorFlowModel(posenet);
  const [predictions, setPredictions] = React.useState([]);

  if (!model) {
    return <LoadingView message="Loading TensorFlow model" />;
  }

  return (
    <View
    // style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
    >
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

        //@ts-ignore
        await setTensorXyPostion(predictions.keyPoints);
        // @ts-ignore
        raf.current = requestAnimationFrame(loop);
      };
      loop();
    },
    [setPredictions, setTensorXyPostion]
  );

  const onCanvasDraw = (canvas: Canvas, tensorXyPostion: TensorKeypoint[]) => {
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    if (canvas === null) return;

    console.log(tensorXyPostion);
    // for (let i = 0; i < 17; i++) {
    //   let el = tensorXyPostion[i];
    //   if (!el) return;
    //   ctx.fillStyle = "red"; // 점의 색상
    //   ctx.beginPath();
    //   // ctx.arc(el.position.x, el.position.y, 5, 0, 2 * Math.PI); // 점의 중심 좌표와 반지름
    //   ctx.fill();
    // }

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    // console.log(predictions);
    console.log(tensorXyPostion);
    if (canvasRef.current) {
      onCanvasDraw(canvasRef.current, tensorXyPostion);
    }
  }, [tensorXyPostion]);

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

// const tmp = {
//   keypoints: [
//     { part: "nose", position: [Object], score: 0.99853515625 },
//     { part: "leftEye", position: [Object], score: 0.9931640625 },
//     { part: "rightEye", position: [Object], score: 0.99951171875 },
//     { part: "leftEar", position: [Object], score: 0.10595703125 },
//     { part: "rightEar", position: [Object], score: 0.990234375 },
//     { part: "leftShoulder", position: [Object], score: 0.97509765625 },
//     { part: "rightShoulder", position: [Object], score: 0.98388671875 },
//     { part: "leftElbow", position: [Object], score: 0.62744140625 },
//     { part: "rightElbow", position: [Object], score: 0.92822265625 },
//     { part: "leftWrist", position: [Object], score: 0.11456298828125 },
//     { part: "rightWrist", position: [Object], score: 0.54150390625 },
//     { part: "leftHip", position: [Object], score: 0.260498046875 },
//     { part: "rightHip", position: [Object], score: 0.16650390625 },
//     { part: "leftKnee", position: [Object], score: 0.0328369140625 },
//     { part: "rightKnee", position: [Object], score: 0.04779052734375 },
//     { part: "leftAnkle", position: [Object], score: 0.01495361328125 },
//     { part: "rightAnkle", position: [Object], score: 0.0225067138671875 },
//   ],
//   score: 0.5178357292624081,
// };

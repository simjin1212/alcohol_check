import * as posedetection from "@tensorflow-models/pose-detection";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";

import Svg, { Circle } from "react-native-svg";

import * as tf from "@tensorflow/tfjs";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { Camera } from "expo-camera";
import { CameraType } from "expo-camera/build/Camera.types";
import { ExpoWebGLRenderingContext } from "expo-gl";
import * as ScreenOrientation from "expo-screen-orientation";
const TensorCamera = cameraWithTensors(Camera);
// 운영플랫폼
const IS_ANDROID = Platform.OS === "android";
const IS_IOS = Platform.OS === "ios";

// 카메라 사이즈
const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// 키포인트 포즈 스코어
const MIN_KEYPOINT_SCORE = 0.3;

// 텐서 카메라 사이즈
const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// 자동 렌더링
const AUTO_RENDER = false;

// 모델 번들러
const LOAD_MODEL_FROM_BUNDLE = true;
export function ModelView() {
  const cameraRef = useRef(null);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>();
  const [posesCenter, setPosesCenter] = useState<posedetection.Pose[]>();
  const [fps, setFps] = useState(0);
  // 폰 가로세로
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation>();

  // 난 왜 front 없어
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.front);

  // 계속 다시 렌더링 못하게 ref로 감싸?
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    async function prepare() {
      rafId.current = null;

      const curOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(curOrientation);

      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });

      await Camera.requestCameraPermissionsAsync();

      await tf.ready();

      // Load movenet model.
      // 무브넷 관련 로드
      const movenetModelConfig: posedetection.MoveNetModelConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };
      // 뭔지 전혀모름
      // if (LOAD_MODEL_FROM_BUNDLE) {
      //   const modelJson = require("./offline_model/model.json");
      //   const modelWeights1 = require("./offline_model/group1-shard1of2.bin");
      //   const modelWeights2 = require("./offline_model/group1-shard2of2.bin");
      //   movenetModelConfig.modelUrl = bundleResourceIO(modelJson, [
      //     modelWeights1,
      //     modelWeights2,
      //   ]);
      // }
      const model = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        movenetModelConfig
      );

      setModel(model);

      // Ready!
      setTfReady(true);
    }

    prepare();
  }, []);

  useEffect(() => {
    // 언마운트시에 실행 애니메이션 프레임을 사용한다
    return () => {
      if (rafId.current != null && rafId.current !== 0) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []);

  // 턴서플로가 적용된 expo 카메라 실행
  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    const loop = async () => {
      // 텐서 카메라 실행
      const imageTensor = images.next().value as tf.Tensor3D;
      const flippedTensor = tf.reverse(imageTensor, [1]);

      const startTs = Date.now();
      const poses = await model?.estimatePoses(
        flippedTensor,
        undefined,
        Date.now()
      );

      const latency = Date.now() - startTs;

      setFps(Math.floor(1000 / latency));
      if (poses === undefined || poses.length === 0) {
      } else {
        setPosesCenter(poses);
      }
      tf.dispose([flippedTensor]);

      if (rafId.current === 0) {
        return;
      }

      // 자동렌더링이 false면 카메라 미리보기를 수동으로 렌더링??
      if (!AUTO_RENDER) {
        updatePreview();
        gl.endFrameEXP();
      }
      // 애니메이션 요청?
      rafId.current = requestAnimationFrame(loop);
    };

    loop();
  };

  const renderPose = () => {
    if (posesCenter != null && posesCenter.length > 0) {
      const keypoints = posesCenter[0].keypoints
        .filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
        .map((k) => {
          // Android에서는 수평으로 뒤집고 iOS에서는 후면 카메라를 사용할 때 사용한다
          const flipX = IS_ANDROID || cameraType === CameraType.back;
          // 좌표 계산식 깊은 이해가 필요할듯

          const x = flipX ? getOutputTensorWidth() - k.x : k.x;
          const y = k.y;
          const cx =
            (x / getOutputTensorWidth()) *
            (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT);
          const cy =
            (y / getOutputTensorHeight()) *
            (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH);
          return (
            <Circle
              key={`skeletonkp_${k.name}`}
              cx={cx}
              cy={cy}
              r="4"
              strokeWidth="2"
              fill="#00AA00"
              stroke="white"
            />
          );
        });

      return <Svg style={styles.svg}>{keypoints}</Svg>;
    } else {
      return <View></View>;
    }
  };

  const renderFps = () => {
    return (
      <View style={styles.fpsContainer}>
        <Text>FPS: {fps}</Text>
      </View>
    );
  };

  const renderCameraTypeSwitcher = () => {
    return (
      <View
        style={styles.cameraTypeSwitcher}
        onTouchEnd={handleSwitchCameraType}
      >
        <Text>
          Switch to {cameraType === CameraType.front ? "back" : "front"} camera
        </Text>
      </View>
    );
  };

  const handleSwitchCameraType = () => {
    if (cameraType === CameraType.front) {
      setCameraType(CameraType.back);
    } else {
      setCameraType(CameraType.front);
    }
  };

  const isPortrait = () => {
    return (
      // orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
      // orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
      true
    );
  };

  const getOutputTensorWidth = () => {
    // OS 가로 모드에서 출력 텐서의 너비와 높이를 다음으로 전환
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_WIDTH
      : OUTPUT_TENSOR_HEIGHT;
  };

  const getOutputTensorHeight = () => {
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_HEIGHT
      : OUTPUT_TENSOR_WIDTH;
  };

  const getTextureRotationAngleInDegrees = () => {
    if (IS_ANDROID) {
      return 0;
    }
    switch (orientation) {
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return 180;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return cameraType === CameraType.front ? 270 : 90;
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return cameraType === CameraType.front ? 90 : 270;
      default:
        return 0;
    }
  };

  if (!tfReady) {
    return (
      <View style={styles.loadingMsg}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    // console.log(CAM_PREVIEW_WIDTH);

    return (
      // Note that you don't need to specify `cameraTextureWidth` and `cameraTextureHeight` prop in `TensorCamera` below.
      <View
        style={
          isPortrait() ? styles.containerPortrait : styles.containerLandscape
        }
      >
        {/* @ts-ignore */}
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          // mirrorImage={true}
          // tensor related props
          resizeWidth={getOutputTensorWidth()}
          resizeHeight={getOutputTensorHeight()}
          resizeDepth={3}
          rotation={getTextureRotationAngleInDegrees()}
          onReady={handleCameraStream}
        />
        {renderPose()}
        {renderFps()}
        {renderCameraTypeSwitcher()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerPortrait: {
    // flex: 1,
    position: "relative",
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    // marginTop: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  containerLandscape: {
    // position: "relative",
    // // flex: 1,
    // width: CAM_PREVIEW_HEIGHT,
    // height: CAM_PREVIEW_WIDTH,
    // marginLeft: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
    position: "relative",
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    // marginTop: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  loadingMsg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  svg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 30,
  },
  fpsContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 80,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  cameraTypeSwitcher: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 180,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 80,
  },
});

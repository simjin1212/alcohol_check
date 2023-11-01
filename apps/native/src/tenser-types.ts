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

export interface TensorKeypoint {
  part?:
    | "nose"
    | "leftEye"
    | "rightEye"
    | "leftEar"
    | "rightEar"
    | "leftShoulder"
    | "rightShoulder"
    | "leftElbow"
    | "rightElbow"
    | "leftWrist"
    | "rightWrist"
    | "leftHip"
    | "rightHip"
    | "leftKnee"
    | "rightKnee"
    | "leftAnkle"
    | "rightAnkle";
  position?: { x: number; y: number };
  score?: number;
}

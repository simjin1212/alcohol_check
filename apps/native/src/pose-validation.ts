let head = { x: 0, y: 0 };
let rw = { x: 0, y: 0 };
let re = { x: 0, y: 0 };
let rs = { x: 0, y: 0 };
let lw = { x: 0, y: 0 };
let le = { x: 0, y: 0 };
let ls = { x: 0, y: 0 };
let b = { x: 0, y: 0 };

export function check_HandsUp(pose: any) {
  head = pose.keypoints[0].position; //머리(코)
  rw = pose.keypoints[10].position; //오른쪽 손목
  re = pose.keypoints[8].position; //오른쪽 팔꿈치
  rs = pose.keypoints[6].position; //오른쪽 어깨
  lw = pose.keypoints[9].position; //왼쪽 손목
  le = pose.keypoints[7].position; //왼쪽 팔꿈치
  ls = pose.keypoints[5].position; //왼쪽 어깨

  //팔꿈치가 어깨보다 높을 것, 양 팔꿈치 사이에 머리가 위치할 것
  if (re.y < rs.y && le.y < ls.y && re.x < head.x && head.x < le.x) {
    //양쪽 손목 중, 어느 하나라도 머리보다는 위에 위치할 것
    if (rw.y < head.y || lw.y < head.y) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
export function check_O(pose: any) {
  rw = pose.keypoints[10].position; //오른쪽 손목
  re = pose.keypoints[8].position; //오른쪽 팔꿈치
  lw = pose.keypoints[9].position; //왼쪽 손목
  le = pose.keypoints[7].position; //왼쪽 팔꿈치
  if (
    check_HandsUp(pose) &&
    ((re.x < rw.x && rw.y < re.y) || (le.x > lw.x && le.y > lw.y))
  ) {
    return true;
  } else {
    return false;
  }
}

export function check_X(pose: any) {
  head = pose.keypoints[0].position; //머리(코)
  rw = pose.keypoints[10].position; //오른쪽 손목
  re = pose.keypoints[8].position; //오른쪽 팔꿈치
  rs = pose.keypoints[6].position; //오른쪽 어깨
  lw = pose.keypoints[9].position; //왼쪽 손목
  le = pose.keypoints[7].position; //왼쪽 팔꿈치
  ls = pose.keypoints[5].position; //왼쪽 어깨
  b = pose.keypoints[12].position; //body(오른쪽 골반)
  //골반보다 팔꿈치가 위쪽에 위치, 팔꿈치보다 손목이 위쪽에 위치, 손목보다 머리가 위쪽에 위치
  if (
    b.y > le.y &&
    b.y > re.y &&
    le.y > lw.y &&
    re.y > rw.y &&
    lw.y > head.y &&
    rw.y > head.y
  ) {
    //어깨 안쪽으로 손목이 위치
    if (rs.x < rw.x || lw.x < ls.x) {
      let r_gradient = -1;
      let l_gradient = 1;
      if (rw.x - re.x != 0) {
        r_gradient = (rw.y - re.y) / (rw.x - re.x);
      }
      if (lw.x - le.x != 0) {
        l_gradient = (lw.y - le.y) / (lw.x - le.x);
      }
      if (r_gradient < 0 || l_gradient > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

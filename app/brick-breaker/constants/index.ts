/** 패들(대가리) 히트박스 너비 - 마우스로 움직이는 범위 */
export const PADDLE_HIT_WIDTH = 100;
/** 대가리 이미지 크기 - 정사각으로 그려서 찌그러짐 방지, 바닥에 붙임 */
export const HEAD_SIZE = 56;
export const BALL_R = 10;
export const HAIR_SIZE = 64;
/** 클리어 시 가발이 떨어지는 속도 (px/frame) */
export const FALLING_HAIR_SPEED = 2;
/** 클리어 시 가발이 떨어지면서 회전하는 속도 (deg/frame) */
export const FALLING_HAIR_ROTATION_SPEED = 8;

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 500;

export const STAGES = [
    {
        level: 1,
        hairCount: 12,
        hairSpeedMin: 1,
        hairSpeedMax: 2,
        ballSpeed: 4,
    },
    {
        level: 2,
        hairCount: 15,
        hairSpeedMin: 1.5,
        hairSpeedMax: 2.5,
        ballSpeed: 5,
    },
    {
        level: 3,
        hairCount: 20,
        hairSpeedMin: 2,
        hairSpeedMax: 3.5,
        ballSpeed: 6,
    },
];

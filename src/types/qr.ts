import { Options, TypeNumber, Mode, ErrorCorrectionLevel } from "qr-code-styling";

export type DotType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';
export type Extension = 'png' | 'jpeg' | 'svg';
export type GradientType = 'linear' | 'radial';

export interface QRState extends Options {
  width: number;
  height: number;
  margin: number;
  data: string;
  image?: string;
  dotsOptions: {
    type: DotType;
    color: string;
    gradient?: {
      type: GradientType;
      rotation: number;
      colorStops: { offset: number; color: string }[];
    };
  };
  backgroundOptions: {
    color: string;
    gradient?: {
      type: GradientType;
      rotation: number;
      colorStops: { offset: number; color: string }[];
    };
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin: 'anonymous';
  };
  cornersSquareOptions: {
    type?: CornerSquareType;
    color?: string;
    gradient?: {
      type: GradientType;
      rotation: number;
      colorStops: { offset: number; color: string }[];
    };
  };
  cornersDotOptions: {
    type?: CornerDotType;
    color?: string;
    gradient?: {
      type: GradientType;
      rotation: number;
      colorStops: { offset: number; color: string }[];
    };
  };
  qrOptions: {
    typeNumber: TypeNumber;
    mode: Mode;
    errorCorrectionLevel: ErrorCorrectionLevel;
  };
}

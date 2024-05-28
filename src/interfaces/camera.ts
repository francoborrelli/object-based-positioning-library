import type { CameraProps } from 'expo-camera';
import type { TensorCameraResult } from './detection';

export interface TensorCameraProps extends CameraProps {
  /**
   * @description The minimum confidence score to consider a detection. Value between 0 and 100.
   * @default 20
   */
  minPrecision?: number;

  /**
   * @description The number of frames to skip before running the model. This is useful to reduce the number of inferences and improve performance.
   * @default 100
   */
  numberOfFrames?: number;

  /**
   * @description The list of objects to detect. If not provided, the model will detect all objects.
   */
  availableObjects?: string[];

  /**
   * @description Callback function to receive the detection results.
   */
  onNewResults?: (results: any[]) => void;
}

export interface CocoSsdCameraProps extends TensorCameraProps {
  /**
   * @description The list of objects to detect. If not provided, the model will detect all objects.
   */
  availableObjects?: string[];

  /**
   * @description Callback function to receive the detection results.
   */
  onNewResults?: (results: TensorCameraResult[]) => void;
}

export interface MobileNetCameraProps extends TensorCameraProps {
  /**
   * @description Version of the MobileNet model to use. Version 1 is faster but less accurate than version 2.
   * @default 1
   */
  version?: 1 | 2;

  /**
   * @description The list of objects to detect. If not provided, the model will detect all objects.
   */
  availableObjects?: string[];

  /**
   * @description Callback function to receive the detection results.
   */
  onNewResults?: (results: Omit<TensorCameraResult, 'bbox'>[]) => void;
}

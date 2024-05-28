export type TensorCameraResult = {
  /**
   * @description The label of the detected object.
   */
  label: string;

  /**
   * @description The id of the detected object.
   */
  id: string;

  /**
   * @description The confidence score of the detected object. Value between 0 and 100.
   */
  percentage: number;

  /**
   * @description The bounding box of the detected object.
   */
  bbox: [number, number, number, number];
};

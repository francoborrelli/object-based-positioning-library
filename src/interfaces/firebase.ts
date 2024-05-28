import type { FieldValue } from 'firebase/firestore';
import type { TensorCameraResult } from './detection';
import type { CurrentPositionResponse } from './positioning';

export interface FirebaseObject {
  /**
   * @description Unique identifier of the object inside the collection
   */
  id: string;

  /**
   * @description Object data
   */
  object: TensorCameraResult;

  /**
   * @description Positioning data
   */
  position: CurrentPositionResponse;

  /**
   * @description Extra data sent by the user
   */
  extra?: any;

  /**
   * @description Date when the object was created
   * @example serverTimestamp()
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.FieldValue.serverTimestamp
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp.now
   */
  created_at: FieldValue;

  /**
   * @description Date when the object was updated
   * @example serverTimestamp()
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.FieldValue.serverTimestamp
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
   * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp.now
   */
  updated_at: FieldValue;
}
